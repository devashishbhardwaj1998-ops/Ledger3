import { RawEmployeeRow, RawEmployerRow } from '../types';
import { normAsset, normDate, mapGeographyToRegion, normalizeCountryCode } from './parser';

/**
 * Small demo data set. It deliberately contains one example of every finding type:
 *   clean match, category mismatch, status not Done, missing on either side,
 *   an ignored "Minimal" row, and strict-mode spelling/case errors (both sides).
 */
export function getSampleDataPullSheet(): RawEmployeeRow[] {
  const rawList = [
    // --- Jaynam Gandhi ---
    { first: 'Jaynam', last: 'Gandhi', uid: 'EMP-301', country: 'GB', asset: 'Slamcore', date: '14-Sep-26', mins: 45, type: 'full' },
    { first: 'Jaynam', last: 'Gandhi', uid: 'EMP-301', country: 'GB', asset: 'Deucalion Aviation', date: '14-Sep-26', mins: 50, type: 'finalReviewFull' },
    { first: 'Jaynam', last: 'Gandhi', uid: 'EMP-301', country: 'US', asset: 'Synchrony Group', date: '15-Sep-26', mins: 35, type: 'semiCurated' },
    { first: 'Jaynam', last: 'Gandhi', uid: 'EMP-301', country: 'US', asset: 'Distyl AI', date: '15-Sep-26', mins: 40, type: 'firstReview' },           // plan status not Done
    { first: 'Jaynam', last: 'Gandhi', uid: 'EMP-301', country: 'GB', asset: 'PIB Group', date: '15-Sep-26', mins: 60, type: 'limited' },                // plan says Full -> mismatch
    { first: 'Jaynam', last: 'Gandhi', uid: 'EMP-301', country: 'US', asset: 'Puzzle', date: '16-Sep-26', mins: 45, type: 'finalReviewSemiCurated' },
    { first: 'Jaynam', last: 'Gandhi', uid: 'EMP-301', country: 'US', asset: 'Aegis Sciences Corporation', date: '16-Sep-26', mins: 55, type: 'finalReviewLimited' },
    { first: 'Jaynam', last: 'Gandhi', uid: 'EMP-301', country: 'GB', asset: 'Tonic Health', date: '17-Sep-26', mins: 50, type: 'finalReviewSemiCurated' }, // plan label "Semi final" (case)
    { first: 'Jaynam', last: 'Gandhi', uid: 'EMP-301', country: 'US', asset: 'Coast', date: '17-Sep-26', mins: 35, type: 'semicurated' },              // misspelled code
    { first: 'Jaynam', last: 'Gandhi', uid: 'EMP-301', country: 'GB', asset: 'Scoreline', date: '18-Sep-26', mins: 60, type: 'full' },                   // not in planning sheet
    { first: 'Jaynam', last: 'Gandhi', uid: 'EMP-301', country: 'GB', asset: 'Norbev', date: '18-Sep-26', mins: 30, type: 'minimal' },                  // Minimal: ignored

    // --- Sanjana Khiani ---
    { first: 'Sanjana', last: 'Khiani', uid: 'EMP-302', country: 'US', asset: 'Fullscript', date: '14-Sep-26', mins: 90, type: 'full' },
    { first: 'Sanjana', last: 'Khiani', uid: 'EMP-302', country: 'US', asset: 'Fullscript', date: '14-Sep-26', mins: 45, type: 'finalReviewFull' },
    { first: 'Sanjana', last: 'Khiani', uid: 'EMP-302', country: 'US', asset: 'Seen Health', date: '14-Sep-26', mins: 35, type: 'limited' },
    { first: 'Sanjana', last: 'Khiani', uid: 'EMP-302', country: 'GB', asset: 'Xapien', date: '15-Sep-26', mins: 30, type: 'firstReview' }
  ];

  return rawList.map((r) => {
    const name = `${r.first} ${r.last}`.trim();
    return {
      name,
      nameKey: name.toLowerCase(),
      firstName: r.first,
      lastName: r.last,
      userId: r.uid,
      country: r.country ? normalizeCountryCode(r.country) : undefined,
      assetName: r.asset,
      assetKey: normAsset(r.asset),
      date: normDate(r.date),
      minutes: r.mins,
      type: r.type
    };
  });
}

export function getSampleEmployerPlanningSheet(): RawEmployerRow[] {
  const rawList = [
    // --- Jaynam Gandhi ---
    { day: 'Monday', date: '14-Sep-26', asset: 'Slamcore', geo: 'UK NICE', prod: 'Full', rev: '', status: 'Done', analyst: 'Jaynam Gandhi' },
    { day: 'Monday', date: '14-Sep-26', asset: 'Deucalion Aviation', geo: 'UK NICE', prod: '', rev: 'Full final', status: 'Done', analyst: 'Jaynam Gandhi' },
    { day: 'Tuesday', date: '15-Sep-26', asset: 'Synchrony Group', geo: 'US', prod: 'Semi', rev: '', status: 'Done', analyst: 'Jaynam Gandhi' },
    { day: 'Tuesday', date: '15-Sep-26', asset: 'Distyl AI', geo: 'US', prod: '', rev: 'Full first', status: 'In progress', analyst: 'Jaynam Gandhi' },
    { day: 'Tuesday', date: '15-Sep-26', asset: 'PIB Group', geo: 'UK NICE', prod: 'Full', rev: '', status: 'Done', analyst: 'Jaynam Gandhi' },
    { day: 'Wednesday', date: '16-Sep-26', asset: 'Puzzle', geo: 'US', prod: '', rev: 'Semi Final', status: 'Done', analyst: 'Jaynam Gandhi' },
    { day: 'Wednesday', date: '16-Sep-26', asset: 'Aegis Sciences Corporation', geo: 'US', prod: '', rev: 'Limited final', status: 'Done', analyst: 'Jaynam Gandhi' },
    { day: 'Thursday', date: '17-Sep-26', asset: 'Tonic Health', geo: 'UK NICE', prod: '', rev: 'Semi final', status: 'Done', analyst: 'Jaynam Gandhi' },
    { day: 'Thursday', date: '17-Sep-26', asset: 'Coast', geo: 'US', prod: 'Semi', rev: '', status: 'Done', analyst: 'Jaynam Gandhi' },
    { day: 'Thursday', date: '17-Sep-26', asset: 'Alpine Health', geo: 'US', prod: 'Limited', rev: '', status: 'Done', analyst: 'Jaynam Gandhi' }, // not in data pull
    { day: 'Friday', date: '18-Sep-26', asset: 'Norbev', geo: 'UK NICE', prod: 'Minimal', rev: '', status: 'Done', analyst: 'Jaynam Gandhi' },

    // --- Sanjana Khiani ---
    { day: 'Monday', date: '14-Sep-26', asset: 'Fullscript', geo: 'US', prod: 'Full', rev: 'Full final', status: 'Done', analyst: 'Sanjana Khiani' },
    { day: 'Monday', date: '14-Sep-26', asset: 'Seen Health', geo: 'US', prod: 'Limited', rev: '', status: 'Done', analyst: 'Sanjana Khiani' },
    { day: 'Tuesday', date: '15-Sep-26', asset: 'Xapien', geo: 'UK NICE', prod: '', rev: 'Full first', status: 'Done', analyst: 'Sanjana Khiani' }
  ];

  return rawList.map((r) => {
    const parsedDate = normDate(r.date);
    return {
      assetName: r.asset,
      assetKey: normAsset(r.asset),
      date: parsedDate,
      production: r.prod,
      review: r.rev,
      status: r.status,
      employee: r.analyst,
      week: '202638',
      day: r.day,
      geography: r.geo,
      region: mapGeographyToRegion(r.geo) || undefined,
      inTheNews: ''
    };
  });
}
