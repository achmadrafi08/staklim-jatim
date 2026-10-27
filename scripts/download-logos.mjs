/**
 * scripts/download-logos.mjs
 * Script resmi pengunduh 39 logo daerah Jawa Timur (1 Provinsi + 38 Kab/Kota)
 * Menggunakan Wikipedia Parse & MediaWiki Imageinfo API
 */

import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../public/logos");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const USER_AGENT = "StaklimJatimDev/6.0 (BMKG Staklim Jatim; dev@bmkg.go.id)";

// Daftar lengkap 39 wilayah di Jawa Timur
const REGIONS_DATA = [
  // Provinsi
  { slug: "jawa-timur", wikiPage: "Jawa Timur", fileTitle: "Coat of arms of East Java.svg" },

  // Kabupaten
  { slug: "kab-bangkalan", wikiPage: "Kabupaten Bangkalan", fileTitle: "Lambang Kabupaten Bangkalan.png" },
  { slug: "kab-banyuwangi", wikiPage: "Kabupaten Banyuwangi", fileTitle: "Lambang Kabupaten Banyuwangi.png" },
  { slug: "kab-blitar", wikiPage: "Kabupaten Blitar", fileTitle: "Lambang Kabupaten Blitar.png" },
  { slug: "kab-bojonegoro", wikiPage: "Kabupaten Bojonegoro", fileTitle: "Lambang Kabupaten Bojonegoro.png" },
  { slug: "kab-bondowoso", wikiPage: "Kabupaten Bondowoso", fileTitle: "Lambang Kabupaten Bondowoso.png" },
  { slug: "kab-gresik", wikiPage: "Kabupaten Gresik", fileTitle: "Lambang Kabupaten Gresik.png" },
  { slug: "kab-jember", wikiPage: "Kabupaten Jember", fileTitle: "Lambang Kabupaten Jember.png" },
  { slug: "kab-jombang", wikiPage: "Kabupaten Jombang", fileTitle: "Lambang Kabupaten Jombang.png" },
  { slug: "kab-kediri", wikiPage: "Kabupaten Kediri", fileTitle: "Lambang Kabupaten Kediri.png" },
  { slug: "kab-lamongan", wikiPage: "Kabupaten Lamongan", fileTitle: "Lambang Kabupaten Lamongan.png" },
  { slug: "kab-lumajang", wikiPage: "Kabupaten Lumajang", fileTitle: "Lambang Kabupaten Lumajang.png" },
  { slug: "kab-madiun", wikiPage: "Kabupaten Madiun", fileTitle: "Lambang Kabupaten Madiun.png" },
  { slug: "kab-magetan", wikiPage: "Kabupaten Magetan", fileTitle: "Lambang Kabupaten Magetan.png" },
  { slug: "kab-malang", wikiPage: "Kabupaten Malang", fileTitle: "Lambang Kabupaten Malang.png" },
  { slug: "kab-mojokerto", wikiPage: "Kabupaten Mojokerto", fileTitle: "Lambang Kabupaten Mojokerto.png" },
  { slug: "kab-nganjuk", wikiPage: "Kabupaten Nganjuk", fileTitle: "Lambang Kabupaten Nganjuk.png" },
  { slug: "kab-ngawi", wikiPage: "Kabupaten Ngawi", fileTitle: "Lambang Kabupaten Ngawi.png" },
  { slug: "kab-pacitan", wikiPage: "Kabupaten Pacitan", fileTitle: "Lambang Kabupaten Pacitan.png" },
  { slug: "kab-pamekasan", wikiPage: "Kabupaten Pamekasan", fileTitle: "Lambang Kabupaten Pamekasan.png" },
  { slug: "kab-pasuruan", wikiPage: "Kabupaten Pasuruan", fileTitle: "Lambang Kabupaten Pasuruan.png" },
  { slug: "kab-ponorogo", wikiPage: "Kabupaten Ponorogo", fileTitle: "Lambang Kabupaten Ponorogo.png" },
  { slug: "kab-probolinggo", wikiPage: "Kabupaten Probolinggo", fileTitle: "Lambang Kabupaten Probolinggo.png" },
  { slug: "kab-sampang", wikiPage: "Kabupaten Sampang", fileTitle: "Lambang Kabupaten Sampang.png" },
  { slug: "kab-sidoarjo", wikiPage: "Kabupaten Sidoarjo", fileTitle: "Lambang Kabupaten Sidoarjo.png" },
  { slug: "kab-situbondo", wikiPage: "Kabupaten Situbondo", fileTitle: "Lambang Kabupaten Situbondo.png" },
  { slug: "kab-sumenep", wikiPage: "Kabupaten Sumenep", fileTitle: "Lambang Kabupaten Sumenep.png" },
  { slug: "kab-trenggalek", wikiPage: "Kabupaten Trenggalek", fileTitle: "Lambang Kabupaten Trenggalek.png" },
  { slug: "kab-tuban", wikiPage: "Kabupaten Tuban", fileTitle: "Lambang Kabupaten Tuban.png" },
  { slug: "kab-tulungagung", wikiPage: "Kabupaten Tulungagung", fileTitle: "Lambang Kabupaten Tulungagung.png" },

  // Kota
  { slug: "kota-batu", wikiPage: "Kota Batu", fileTitle: "Lambang Kota Batu.png" },
  { slug: "kota-blitar", wikiPage: "Kota Blitar", fileTitle: "Lambang Kota Blitar.png" },
  { slug: "kota-kediri", wikiPage: "Kota Kediri", fileTitle: "Lambang Kota Kediri.png" },
  { slug: "kota-madiun", wikiPage: "Kota Madiun", fileTitle: "Lambang Kota Madiun.png" },
  { slug: "kota-malang", wikiPage: "Kota Malang", fileTitle: "Coat of arms of Malang.svg" },
  { slug: "kota-mojokerto", wikiPage: "Kota Mojokerto", fileTitle: "Coat of arms of Mojokerto.svg" },
  { slug: "kota-pasuruan", wikiPage: "Kota Pasuruan", fileTitle: "Lambang Kota Pasuruan.png" },
  { slug: "kota-probolinggo", wikiPage: "Kota Probolinggo", fileTitle: "Lambang Kota Probolinggo.png" },
  { slug: "kota-surabaya", wikiPage: "Kota Surabaya", fileTitle: "Coat of arms of Surabaya.svg" },
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": USER_AGENT } }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function downloadBinary(url, destPath) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": USER_AGENT,
            Referer: "https://id.wikipedia.org/",
          },
        },
        (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            return downloadBinary(res.headers.location, destPath)
              .then(resolve)
              .catch(reject);
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          const fileStream = fs.createWriteStream(destPath);
          res.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            resolve();
          });
        }
      )
      .on("error", reject);
  });
}

// 1. Ekstrak gambar dari nama berkas langsung di Commons/ID Wikipedia
async function getImageUrlByFileTitle(fileTitle) {
  const sources = [
    `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=350&format=json`,
    `https://id.wikipedia.org/w/api.php?action=query&titles=Berkas:${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=350&format=json`
  ];

  for (const apiUrl of sources) {
    try {
      const data = await fetchJson(apiUrl);
      const pages = data?.query?.pages;
      if (pages) {
        const page = Object.values(pages)[0];
        const info = page?.imageinfo?.[0];
        if (info?.thumburl || info?.url) {
          return info.thumburl || info.url;
        }
      }
    } catch { }
  }
  return null;
}

// 2. Ekstrak logo melalui parse artikel infobox (fallback paling akurat)
async function getImageUrlFromArticle(pageTitle) {
  try {
    const parseUrl = `https://id.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=images&format=json`;
    const parseData = await fetchJson(parseUrl);
    const images = parseData?.parse?.images || [];

    const logoFile = images.find((img) => {
      const lower = img.toLowerCase();
      const isEmblem =
        lower.includes("lambang") ||
        lower.includes("coat_of_arms") ||
        lower.includes("seal") ||
        lower.includes("logo");
      const isExcluded =
        lower.includes("commons") ||
        lower.includes("peta") ||
        lower.includes("lokasi") ||
        lower.includes("map") ||
        lower.includes("bendera") ||
        lower.includes("flag");
      return isEmblem && !isExcluded;
    });

    if (logoFile) {
      return await getImageUrlByFileTitle(logoFile);
    }
  } catch { }
  return null;
}

async function main() {
  console.log("🚀 Memeriksa dan mengunduh 39 logo daerah Jawa Timur...\n");
  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const item of REGIONS_DATA) {
    const filename = `${item.slug}.png`;
    const dest = path.join(OUTPUT_DIR, filename);

    // Lewati jika file sudah terunduh dengan ukuran valid (> 1 KB)
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1024) {
      console.log(`  ⏭️  Sudah ada : ${filename}`);
      skip++;
      continue;
    }

    process.stdout.write(`  📥 Mengunduh  ${filename.padEnd(25, " ")} `);

    try {
      let downloadUrl = await getImageUrlByFileTitle(item.fileTitle);

      if (!downloadUrl) {
        downloadUrl = await getImageUrlFromArticle(item.wikiPage);
      }

      if (!downloadUrl) {
        throw new Error("Logo tidak ditemukan");
      }

      await downloadBinary(downloadUrl, dest);

      if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
        console.log(`✅ OK`);
        ok++;
      } else {
        throw new Error("Berkas rusak atau kosong");
      }
    } catch (err) {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      console.log(`❌ GAGAL (${err.message})`);
      fail++;
    }

    // Jeda 500ms agar koneksi stabil dan terhindar dari rate-limit
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Selesai!
  Berhasil baru : ${ok}
  Sudah ada     : ${skip}
  Gagal         : ${fail}
  Output        : ${OUTPUT_DIR}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

main().catch(console.error);