/**
 * SINGLE SOURCE OF TRUTH for category matching.
 *
 * To add / rename / retire a category, edit CATEGORY_DEFS below. Nothing else in
 * the code needs to change (parser, audit, legend modal and samples all read this).
 *
 *   planLabel : what appears in the Daily Planning Sheet (Production / Review column)
 *   timeCode  : what appears in the Data Pull (time entry) Sheet "Type" column
 *   tracked   : false => rows with this category are ignored on both sides
 */
export type Axis = 'production' | 'review';

export interface CategoryDef {
  axis: Axis;
  planLabel: string;
  timeCode: string | null;
  tracked: boolean;
}

export const CATEGORY_DEFS: CategoryDef[] = [
  // ---- Production ----
  { axis: 'production', planLabel: 'Full',    timeCode: 'full',        tracked: true },
  { axis: 'production', planLabel: 'Limited', timeCode: 'limited',     tracked: true },
  { axis: 'production', planLabel: 'Minimal', timeCode: null,          tracked: false }, // ignored for now
  { axis: 'production', planLabel: 'Semi',    timeCode: 'semiCurated', tracked: true },
  // ---- Review ----
  { axis: 'review', planLabel: 'Full first',    timeCode: 'firstReview',            tracked: true },
  { axis: 'review', planLabel: 'Full final',    timeCode: 'finalReviewFull',        tracked: true },
  { axis: 'review', planLabel: 'Limited final', timeCode: 'finalReviewLimited',     tracked: true },
  { axis: 'review', planLabel: 'Semi Final',    timeCode: 'finalReviewSemiCurated', tracked: true }
];

/**
 * Label matching strictness.
 *  strict  = exact text (after trimming outer spaces). "semicurated" or "Semi final"
 *            will NOT match "semiCurated" / "Semi Final" and is flagged as
 *            "Unrecognized label" with a suggestion instead of being silently matched.
 *  tolerant = ignore case, spaces and punctuation (how Ledger 2 behaved).
 * The UI has a toggle; this is the default.
 */
export const DEFAULT_STRICT_LABELS = true;

const PLACEHOLDERS = new Set(['', '-', '—', 'n/a', 'na', 'none', '0']);

const loose = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export type LabelSide = 'plan' | 'time';

export interface LabelResolution {
  /** Canonical category (the planning label) when the value is a tracked, valid label. */
  category: string | null;
  axis: Axis | null;
  /** true when the value was a known category but explicitly untracked (e.g. Minimal) */
  ignored: boolean;
  /** set when the value LOOKS like a tracked label but fails the strict match */
  nearMiss: { suggestion: string } | null;
}

function labelOf(def: CategoryDef, side: LabelSide): string | null {
  return side === 'plan' ? def.planLabel : def.timeCode;
}

/**
 * Resolve a raw cell value to a category.
 * @param axis  For the planning sheet, the column the value came from. For the time
 *              entry sheet pass null (the axis is derived from the code).
 */
export function resolveLabel(
  raw: unknown,
  side: LabelSide,
  axis: Axis | null,
  strict: boolean
): LabelResolution {
  const none: LabelResolution = { category: null, axis: null, ignored: false, nearMiss: null };
  const text = String(raw ?? '').trim();
  if (PLACEHOLDERS.has(text.toLowerCase())) return none;

  const candidates = CATEGORY_DEFS.filter((d) => labelOf(d, side) !== null);

  const hit = (cmp: (a: string, b: string) => boolean, onlyAxis: boolean) =>
    candidates.find(
      (d) => (!onlyAxis || !axis || d.axis === axis) && cmp(text, labelOf(d, side)!)
    );

  const exactHit = hit((a, b) => a === b, true);
  if (exactHit) {
    return exactHit.tracked
      ? { category: exactHit.planLabel, axis: exactHit.axis, ignored: false, nearMiss: null }
      : { ...none, ignored: true };
  }

  const looseHit = hit((a, b) => loose(a) === loose(b), false);
  if (looseHit) {
    if (!looseHit.tracked) return { ...none, ignored: true };
    if (!strict && (!axis || looseHit.axis === axis)) {
      return { category: looseHit.planLabel, axis: looseHit.axis, ignored: false, nearMiss: null };
    }
    // strict mode, or the label sits in the wrong column
    return { ...none, nearMiss: { suggestion: labelOf(looseHit, side)! } };
  }

  return none; // unknown text: not one of our categories -> ignored
}

export const TRACKED_DEFS = CATEGORY_DEFS.filter((d) => d.tracked);
