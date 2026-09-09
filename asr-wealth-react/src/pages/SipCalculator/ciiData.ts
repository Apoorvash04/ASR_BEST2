export interface CiiEntry {
  slNo: number;
  financialYear: string;
  assessmentYear: string;
  cii: number;
}

/**
 * Official Cost Inflation Index (CII) Dataset
 * Base year 2001-02 = 100
 * Maintained as per the Income Tax Department of India notifications
 */
export const CII_DATA: CiiEntry[] = [
  { slNo: 1, financialYear: '2001-02', assessmentYear: '2002-03', cii: 100 },
  { slNo: 2, financialYear: '2002-03', assessmentYear: '2003-04', cii: 105 },
  { slNo: 3, financialYear: '2003-04', assessmentYear: '2004-05', cii: 109 },
  { slNo: 4, financialYear: '2004-05', assessmentYear: '2005-06', cii: 113 },
  { slNo: 5, financialYear: '2005-06', assessmentYear: '2006-07', cii: 117 },
  { slNo: 6, financialYear: '2006-07', assessmentYear: '2007-08', cii: 122 },
  { slNo: 7, financialYear: '2007-08', assessmentYear: '2008-09', cii: 129 },
  { slNo: 8, financialYear: '2008-09', assessmentYear: '2009-10', cii: 137 },
  { slNo: 9, financialYear: '2009-10', assessmentYear: '2010-11', cii: 148 },
  { slNo: 10, financialYear: '2010-11', assessmentYear: '2011-12', cii: 167 },
  { slNo: 11, financialYear: '2011-12', assessmentYear: '2012-13', cii: 184 },
  { slNo: 12, financialYear: '2012-13', assessmentYear: '2013-14', cii: 200 },
  { slNo: 13, financialYear: '2013-14', assessmentYear: '2014-15', cii: 220 },
  { slNo: 14, financialYear: '2014-15', assessmentYear: '2015-16', cii: 240 },
  { slNo: 15, financialYear: '2015-16', assessmentYear: '2016-17', cii: 254 },
  { slNo: 16, financialYear: '2016-17', assessmentYear: '2017-18', cii: 264 },
  { slNo: 17, financialYear: '2017-18', assessmentYear: '2018-19', cii: 272 },
  { slNo: 18, financialYear: '2018-19', assessmentYear: '2019-20', cii: 280 },
  { slNo: 19, financialYear: '2019-20', assessmentYear: '2020-21', cii: 289 },
  { slNo: 20, financialYear: '2020-21', assessmentYear: '2021-22', cii: 301 },
  { slNo: 21, financialYear: '2021-22', assessmentYear: '2022-23', cii: 317 },
  { slNo: 22, financialYear: '2022-23', assessmentYear: '2023-24', cii: 331 },
  { slNo: 23, financialYear: '2023-24', assessmentYear: '2024-25', cii: 348 },
  { slNo: 24, financialYear: '2024-25', assessmentYear: '2025-26', cii: 363 },
  { slNo: 25, financialYear: '2025-26', assessmentYear: '2026-27', cii: 376 },
  { slNo: 26, financialYear: '2026-27', assessmentYear: '2027-28', cii: 384 },
];

/**
 * Utility helper to determine the Indian Financial Year (FY) for a given Date string (YYYY-MM-DD)
 * April 1 to March 31 cycle
 */
export const getFinancialYearFromDate = (dateStr: string): string | null => {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);

  if (isNaN(year) || isNaN(month)) return null;

  const startYear = month >= 4 ? year : year - 1;
  const endYear = (startYear + 1) % 100;
  const endYearStr = endYear < 10 ? `0${endYear}` : `${endYear}`;

  return `${startYear}-${endYearStr}`;
};
