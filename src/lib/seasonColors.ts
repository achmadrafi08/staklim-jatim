// Library Permanen Kode Warna Resmi BMKG untuk Awal Musim Hujan (AMH) & Awal Musim Kemarau (AMK)

export const AMH_COLOR_MAP: Record<string, string> = {
  "MEI I": "#36088C",
  "MEI II": "#4B0CCC",
  "MEI III": "#620DFC",
  "JUN I": "#082698",
  "JUN II": "#0A34BE",
  "JUN III": "#0F4AFC",
  "JUL I": "#096A95",
  "JUL II": "#0C8BC1",
  "JUL III": "#0FBAFE",
  "AGT I": "#088A8A",
  "AGT II": "#0CB9C0",
  "AGT III": "#0FF1FD",
  "SEP I": "#09950E",
  "SEP II": "#0CBC1B",
  "SEP III": "#10FE23",
  "OKT I": "#5B9409",
  "OKT II": "#7BC50C",
  "OKT III": "#9AFD0F",
  "NOV I": "#FEFB0D",
  "NOV II": "#D0CD0B",
  "NOV III": "#A9A80A",
  "DES I": "#FFB810",
  "DES II": "#D0920D",
  "DES III": "#966B0B",
  "JAN I": "#FE7E10",
  "JAN II": "#D16A0D",
  "JAN III": "#954709",
  "FEB I": "#FC260E",
  "FEB II": "#C71D0C",
  "FEB III": "#821308",
  "MAR I": "#FD0FBC",
  "MAR II": "#D10E9B",
  "MAR III": "#960955",
  "APR I": "#B410FE",
  "APR II": "#8F0DD1",
  "APR III": "#520677",
};

export const AMK_COLOR_MAP: Record<string, string> = {
  "NOV III": "#36088C",
  "NOV II": "#4B0CCC",
  "NOV I": "#620DFC",
  "OKT III": "#082698",
  "OKT II": "#0A34BE",
  "OKT I": "#0F4AFC",
  "SEP III": "#096A95",
  "SEP II": "#0C8BC1",
  "SEP I": "#0FBAFE",
  "AGT III": "#088A8A",
  "AGT II": "#0CB9C0",
  "AGT I": "#0FF1FD",
  "JUL III": "#09950E",
  "JUL II": "#0CBC1B",
  "JUL I": "#10FE23",
  "JUN III": "#5B9409",
  "JUN II": "#7BC50C",
  "JUN I": "#9AFD0F",
  "MEI III": "#FEFB0D",
  "MEI II": "#D0CD0B",
  "MEI I": "#A9A80A",
  "APR III": "#FFB810",
  "APR II": "#D0920D",
  "APR I": "#966B0B",
  "MAR III": "#FE7E10",
  "MAR II": "#D16A0D",
  "MAR I": "#954709",
  "FEB III": "#FC260E",
  "FEB II": "#C71D0C",
  "FEB I": "#821308",
  "JAN III": "#FD0FBC",
  "JAN II": "#D10E9B",
  "JAN I": "#960955",
  "DES III": "#B410FE",
  "DES II": "#8F0DD1",
  "DES I": "#520677",
};

export function getBMKGSeasonColor(val: string | number | undefined, category?: string): string {
  if (!val) return "#94a3b8";
  const s = String(val).trim().toUpperCase();

  const isKemarau = category && (category.includes("kemarau") || category.includes("amk"));
  const targetMap = isKemarau ? AMK_COLOR_MAP : AMH_COLOR_MAP;
  const fallbackMap = isKemarau ? AMH_COLOR_MAP : AMK_COLOR_MAP;

  // Direct lookup
  if (targetMap[s]) return targetMap[s];
  if (fallbackMap[s]) return fallbackMap[s];

  // Match substring (e.g. "APR I" within "APRIL I" or "APR I 2026")
  for (const [key, hex] of Object.entries(targetMap)) {
    if (s.includes(key)) return hex;
  }
  for (const [key, hex] of Object.entries(fallbackMap)) {
    if (s.includes(key)) return hex;
  }

  return "#3b82f6";
}
