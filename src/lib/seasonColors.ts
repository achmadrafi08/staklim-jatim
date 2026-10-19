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

// Color map untuk Sifat Musim (Atas Normal / Normal / Bawah Normal)
export const SIFAT_COLOR_MAP: Record<string, string> = {
  // Atas Normal
  "ATAS NORMAL": "#38A700",
  "AN": "#38A700",
  "A": "#38A700",
  // Normal
  "NORMAL": "#FFFF00",
  "N": "#FFFF00",
  // Bawah Normal
  "BAWAH NORMAL": "#A87001",
  "BN": "#A87001",
  "B": "#A87001",
};

// Color map untuk Perbandingan Musim — AMK (Kemarau)
// Mundur (lebih lambat) = HIJAU, Maju (lebih awal) = COKLAT/ORANYE
export const PERBANDINGAN_AMK_COLOR_MAP: Record<string, string> = {
  // Nilai teks
  "MUNDUR 3": "#70A800",
  "MUNDUR 2": "#98E500",
  "MUNDUR 1": "#D0FF73",
  "SAMA": "#FFFF00",
  "MAJU 1": "#FFD380",
  "MAJU 2": "#E69800",
  "MAJU 3": "#A87001",
  // Nilai numerik: plus = Mundur (hijau), minus = Maju (coklat), 0 = Sama
  "3": "#70A800",
  "2": "#98E500",
  "1": "#D0FF73",
  "0": "#FFFF00",
  "-1": "#FFD380",
  "-2": "#E69800",
  "-3": "#A87001",
  "4": "#70A800", "5": "#70A800", "6": "#70A800", "7": "#70A800", "8": "#70A800", "9": "#70A800",
  "-4": "#A87001", "-5": "#A87001", "-6": "#A87001", "-7": "#A87001", "-8": "#A87001", "-9": "#A87001",
};

// Color map untuk Perbandingan Musim — AMH (Hujan)
// Mundur (lebih lambat) = COKLAT/ORANYE, Maju (lebih awal) = HIJAU
export const PERBANDINGAN_AMH_COLOR_MAP: Record<string, string> = {
  // Nilai teks
  "MUNDUR 3": "#A87001",
  "MUNDUR 2": "#E69800",
  "MUNDUR 1": "#FFD380",
  "SAMA": "#FFFF00",
  "MAJU 1": "#D0FF73",
  "MAJU 2": "#98E500",
  "MAJU 3": "#70A800",
  // Nilai numerik: plus = Mundur (coklat), minus = Maju (hijau), 0 = Sama
  "3": "#A87001",
  "2": "#E69800",
  "1": "#FFD380",
  "0": "#FFFF00",
  "-1": "#D0FF73",
  "-2": "#98E500",
  "-3": "#70A800",
  "4": "#A87001", "5": "#A87001", "6": "#A87001", "7": "#A87001", "8": "#A87001", "9": "#A87001",
  "-4": "#70A800", "-5": "#70A800", "-6": "#70A800", "-7": "#70A800", "-8": "#70A800", "-9": "#70A800",
};

// Alias untuk backward compatibility
export const PERBANDINGAN_COLOR_MAP = PERBANDINGAN_AMK_COLOR_MAP;

// Color map untuk Puncak Musim
export const PUNCAK_MH_COLOR_MAP: Record<string, string> = {
  // Nama lengkap
  "JANUARI": "#082698",
  "FEBRUARI": "#0A34BE",
  "MARET": "#0F4AFC",
  "APRIL": "#096A95",
  "MEI": "#0C8BC1",
  "JUNI": "#0FBAFE",
  "JULI": "#9AFD0F",
  "AGUSTUS": "#7BC50C",
  "SEPTEMBER": "#5B9409",
  "OKTOBER": "#10FE23",
  "NOVEMBER": "#0CBC1B",
  "DESEMBER": "#09950E",
  // Singkatan
  "JAN": "#082698",
  "FEB": "#0A34BE",
  "MAR": "#0F4AFC",
  "APR": "#096A95",
  "MEI3": "#0C8BC1",
  "JUN": "#0FBAFE",
  "JUL": "#9AFD0F",
  "AGT": "#7BC50C",
  "SEP": "#5B9409",
  "OKT": "#10FE23",
  "NOV": "#0CBC1B",
  "DES": "#09950E",
};

export const PUNCAK_MK_COLOR_MAP: Record<string, string> = {
  // Nama lengkap
  "JANUARI": "#FFB810",
  "FEBRUARI": "#D0920D",
  "MARET": "#966B0B",
  "APRIL": "#FE7E10",
  "MEI": "#D16A0D",
  "JUNI": "#954709",
  "JULI": "#821308",
  "AGUSTUS": "#C71D0C",
  "SEPTEMBER": "#FC260E",
  "OKTOBER": "#960955",
  "NOVEMBER": "#D10E9B",
  "DESEMBER": "#FD0FBC",
  // Singkatan
  "JAN": "#FFB810",
  "FEB": "#D0920D",
  "MAR": "#966B0B",
  "APR": "#FE7E10",
  "JUN": "#954709",
  "JUL": "#821308",
  "AGT": "#C71D0C",
  "SEP": "#FC260E",
  "OKT": "#960955",
  "NOV": "#D10E9B",
  "DES": "#FD0FBC",
};

// Color map untuk Curah Hujan Musim (by range mm) — standar BMKG
export const CH_COLOR_MAP: Record<string, string> = {
  // Nilai teks kategori
  "SANGAT RENDAH": "#FFF9C4",
  "RENDAH": "#FFD54F",
  "MENENGAH": "#66BB6A",
  "SEDANG": "#66BB6A",
  "TINGGI": "#1976D2",
  "SANGAT TINGGI": "#0D47A1",
  // Range teks standar BMKG (mm/musim)
  "<500": "#FFF9C4",
  "500": "#FFF9C4",
  "<501": "#FFF9C4",
  "501-1000": "#FFB810",
  "501 - 1000": "#FFB810",
  "1001-1500": "#FFFF00",
  "1001 - 1500": "#FFFF00",
  "1501-2000": "#38A700",
  "1501 - 2000": "#38A700",
  "2001-2500": "#006837",
  "2001 - 2500": "#006837",
  ">2500": "#1A237E",
  ">2500 ": "#1A237E",
  // Variasi lain
  "0-500": "#FFF9C4",
  "0 - 500": "#FFF9C4",
};

// Fungsi helper: tentukan warna curah hujan berdasarkan nilai numerik (mm)
function getCHColorByNumber(num: number): string {
  if (num <= 500) return "#FFF9C4";          // < 500 mm: sangat rendah (kuning pucat)
  if (num <= 1000) return "#FFD54F";         // 501–1000 mm: rendah (oranye/kuning)
  if (num <= 1500) return "#66BB6A";         // 1001–1500 mm: menengah (hijau)
  if (num <= 2000) return "#1976D2";         // 1501–2000 mm: tinggi (biru)
  return "#0D47A1";                          // > 2000 mm: sangat tinggi (biru gelap)
}

export function getBMKGSeasonColor(val: string | number | undefined, category?: string): string {
  if (!val) return "#94a3b8";
  const s = String(val).trim().toUpperCase();

  // Sifat musim: AN / N / BN
  if (category && (category.includes("sifat"))) {
    if (SIFAT_COLOR_MAP[s]) return SIFAT_COLOR_MAP[s];
    for (const [key, hex] of Object.entries(SIFAT_COLOR_MAP)) {
      if (s.includes(key)) return hex;
    }
    // fallback based on first char
    if (s.startsWith("A")) return SIFAT_COLOR_MAP["AN"];
    if (s.startsWith("B")) return SIFAT_COLOR_MAP["BN"];
    if (s.startsWith("N")) return SIFAT_COLOR_MAP["N"];
  }

  // Perbandingan musim - AMK: Mundur=HIJAU, Maju=COKLAT
  if (category && category.includes("perbandingan") && category.includes("kemarau")) {
    if (PERBANDINGAN_AMK_COLOR_MAP[s]) return PERBANDINGAN_AMK_COLOR_MAP[s];
    for (const [key, hex] of Object.entries(PERBANDINGAN_AMK_COLOR_MAP)) {
      if (s.includes(key)) return hex;
    }
    const num = parseFloat(s);
    if (!isNaN(num)) {
      if (num >= 3) return "#70A800";   // Mundur >= 3 = hijau gelap
      if (num === 2) return "#98E500";
      if (num === 1) return "#D0FF73";
      if (num === 0) return "#FFFF00";  // Sama = kuning
      if (num === -1) return "#FFD380";
      if (num === -2) return "#E69800";
      if (num <= -3) return "#A87001";  // Maju >= 3 = coklat gelap
    }
  }

  // Perbandingan musim - AMH: Mundur=COKLAT/ORANYE, Maju=HIJAU
  if (category && category.includes("perbandingan") && category.includes("hujan")) {
    if (PERBANDINGAN_AMH_COLOR_MAP[s]) return PERBANDINGAN_AMH_COLOR_MAP[s];
    for (const [key, hex] of Object.entries(PERBANDINGAN_AMH_COLOR_MAP)) {
      if (s.includes(key)) return hex;
    }
    const num = parseFloat(s);
    if (!isNaN(num)) {
      if (num >= 3) return "#A87001";   // Mundur >= 3 = coklat gelap
      if (num === 2) return "#E69800";
      if (num === 1) return "#FFD380";
      if (num === 0) return "#FFFF00";  // Sama = kuning
      if (num === -1) return "#D0FF73";
      if (num === -2) return "#98E500";
      if (num <= -3) return "#70A800";  // Maju >= 3 = hijau gelap
    }
  }

  // Perbandingan musim - generic fallback (category "perbandingan_musim" tanpa spesifik hujan/kemarau)
  if (category && category.includes("perbandingan")) {
    if (PERBANDINGAN_AMK_COLOR_MAP[s]) return PERBANDINGAN_AMK_COLOR_MAP[s];
    for (const [key, hex] of Object.entries(PERBANDINGAN_AMK_COLOR_MAP)) {
      if (s.includes(key)) return hex;
    }
  }

  // Puncak musim
  if (category && category.includes("puncak")) {
    const isKemarauPuncak = category.includes("kemarau") || category.includes("mk");
    const pTargetMap = isKemarauPuncak ? PUNCAK_MK_COLOR_MAP : PUNCAK_MH_COLOR_MAP;
    const pFallbackMap = isKemarauPuncak ? PUNCAK_MH_COLOR_MAP : PUNCAK_MK_COLOR_MAP;
    
    if (pTargetMap[s]) return pTargetMap[s];
    if (pFallbackMap[s]) return pFallbackMap[s];
    
    for (const [key, hex] of Object.entries(pTargetMap)) {
      if (s.includes(key)) return hex;
    }
    for (const [key, hex] of Object.entries(pFallbackMap)) {
      if (s.includes(key)) return hex;
    }
  }

  // Curah hujan musim — diprioritaskan sebelum fallback awal musim
  if (category && category.includes("curah_hujan")) {
    // Cek teks dulu
    if (CH_COLOR_MAP[s]) return CH_COLOR_MAP[s];
    for (const [key, hex] of Object.entries(CH_COLOR_MAP)) {
      if (s.includes(key)) return hex;
    }
    // Parse range "1001-1500" atau angka tunggal
    const rangeMatch = s.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (rangeMatch) {
      const mid = (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2;
      return getCHColorByNumber(mid);
    }
    // Parse angka tunggal
    const singleNum = parseFloat(s.replace(/[^0-9.]/g, ""));
    if (!isNaN(singleNum) && singleNum > 0) {
      return getCHColorByNumber(singleNum);
    }
    // Tidak dikenali → abu netral
    return "#94a3b8";
  }

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

