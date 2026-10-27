export interface Region {
  name: string;
  slug: string;
  logoFile: string;
}

export const REGIONS: Region[] = [
  // Provinsi
  {
    name: "Provinsi Jawa Timur",
    slug: "jawa-timur",
    logoFile: "jawa-timur.png",
  },

  // Kabupaten
  {
    name: "Kabupaten Bangkalan",
    slug: "kab-bangkalan",
    logoFile: "kab-bangkalan.png",
  },
  {
    name: "Kabupaten Banyuwangi",
    slug: "kab-banyuwangi",
    logoFile: "kab-banyuwangi.png",
  },
  {
    name: "Kabupaten Blitar",
    slug: "kab-blitar",
    logoFile: "kab-blitar.png",
  },
  {
    name: "Kabupaten Bojonegoro",
    slug: "kab-bojonegoro",
    logoFile: "kab-bojonegoro.png",
  },
  {
    name: "Kabupaten Bondowoso",
    slug: "kab-bondowoso",
    logoFile: "kab-bondowoso.png",
  },
  {
    name: "Kabupaten Gresik",
    slug: "kab-gresik",
    logoFile: "kab-gresik.png",
  },
  {
    name: "Kabupaten Jember",
    slug: "kab-jember",
    logoFile: "kab-jember.png",
  },
  {
    name: "Kabupaten Jombang",
    slug: "kab-jombang",
    logoFile: "kab-jombang.png",
  },
  {
    name: "Kabupaten Kediri",
    slug: "kab-kediri",
    logoFile: "kab-kediri.png",
  },
  {
    name: "Kabupaten Lamongan",
    slug: "kab-lamongan",
    logoFile: "kab-lamongan.png",
  },
  {
    name: "Kabupaten Lumajang",
    slug: "kab-lumajang",
    logoFile: "kab-lumajang.png",
  },
  {
    name: "Kabupaten Madiun",
    slug: "kab-madiun",
    logoFile: "kab-madiun.png",
  },
  {
    name: "Kabupaten Magetan",
    slug: "kab-magetan",
    logoFile: "kab-magetan.png",
  },
  {
    name: "Kabupaten Malang",
    slug: "kab-malang",
    logoFile: "kab-malang.png",
  },
  {
    name: "Kabupaten Mojokerto",
    slug: "kab-mojokerto",
    logoFile: "kab-mojokerto.png",
  },
  {
    name: "Kabupaten Nganjuk",
    slug: "kab-nganjuk",
    logoFile: "kab-nganjuk.png",
  },
  {
    name: "Kabupaten Ngawi",
    slug: "kab-ngawi",
    logoFile: "kab-ngawi.png",
  },
  {
    name: "Kabupaten Pacitan",
    slug: "kab-pacitan",
    logoFile: "kab-pacitan.png",
  },
  {
    name: "Kabupaten Pamekasan",
    slug: "kab-pamekasan",
    logoFile: "kab-pamekasan.png",
  },
  {
    name: "Kabupaten Pasuruan",
    slug: "kab-pasuruan",
    logoFile: "kab-pasuruan.png",
  },
  {
    name: "Kabupaten Ponorogo",
    slug: "kab-ponorogo",
    logoFile: "kab-ponorogo.png",
  },
  {
    name: "Kabupaten Probolinggo",
    slug: "kab-probolinggo",
    logoFile: "kab-probolinggo.png",
  },
  {
    name: "Kabupaten Sampang",
    slug: "kab-sampang",
    logoFile: "kab-sampang.png",
  },
  {
    name: "Kabupaten Sidoarjo",
    slug: "kab-sidoarjo",
    logoFile: "kab-sidoarjo.png",
  },
  {
    name: "Kabupaten Situbondo",
    slug: "kab-situbondo",
    logoFile: "kab-situbondo.png",
  },
  {
    name: "Kabupaten Sumenep",
    slug: "kab-sumenep",
    logoFile: "kab-sumenep.png",
  },
  {
    name: "Kabupaten Trenggalek",
    slug: "kab-trenggalek",
    logoFile: "kab-trenggalek.png",
  },
  {
    name: "Kabupaten Tuban",
    slug: "kab-tuban",
    logoFile: "kab-tuban.png",
  },
  {
    name: "Kabupaten Tulungagung",
    slug: "kab-tulungagung",
    logoFile: "kab-tulungagung.png",
  },

  // Kota
  {
    name: "Kota Batu",
    slug: "kota-batu",
    logoFile: "kota-batu.png",
  },
  {
    name: "Kota Blitar",
    slug: "kota-blitar",
    logoFile: "kota-blitar.png",
  },
  {
    name: "Kota Kediri",
    slug: "kota-kediri",
    logoFile: "kota-kediri.png",
  },
  {
    name: "Kota Madiun",
    slug: "kota-madiun",
    logoFile: "kota-madiun.png",
  },
  {
    name: "Kota Malang",
    slug: "kota-malang",
    logoFile: "kota-malang.png",
  },
  {
    name: "Kota Mojokerto",
    slug: "kota-mojokerto",
    logoFile: "kota-mojokerto.png",
  },
  {
    name: "Kota Pasuruan",
    slug: "kota-pasuruan",
    logoFile: "kota-pasuruan.png",
  },
  {
    name: "Kota Probolinggo",
    slug: "kota-probolinggo",
    logoFile: "kota-probolinggo.png",
  },
  {
    name: "Kota Surabaya",
    slug: "kota-surabaya",
    logoFile: "kota-surabaya.png",
  },
];

export function getRegionLogo(wilayahName?: string): string {
  const fallback = "/logos/jawa-timur.png";
  if (!wilayahName) return fallback;

  // 1. Exact match
  const exact = REGIONS.find(
    (r) => r.name.toLowerCase() === wilayahName.toLowerCase()
  );
  if (exact) return `/logos/${exact.logoFile}`;

  // 2. Fuzzy match
  const cleanInput = wilayahName
    .toLowerCase()
    .replace(/\b(kabupaten|kota)\b/g, "")
    .trim();

  const fuzzy = REGIONS.find((r) => {
    const cleanRegion = r.name
      .toLowerCase()
      .replace(/\b(kabupaten|kota)\b/g, "")
      .trim();
    return (
      cleanInput === cleanRegion ||
      cleanInput.includes(cleanRegion) ||
      cleanRegion.includes(cleanInput)
    );
  });

  return fuzzy ? `/logos/${fuzzy.logoFile}` : fallback;
}