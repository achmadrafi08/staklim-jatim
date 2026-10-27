"use client";

import { useEffect, useState, useMemo } from "react";
import { supabaseFetch, supabaseGetPublicUrl } from "@/lib/supabase";
import { EBuletin } from "@/types/admin";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import { REGIONS, getRegionLogo } from "@/app/data/regions";

export default function EBuletinPage() {
  const [data, setData] = useState<EBuletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuletin, setSelectedBuletin] = useState<{
    judul: string;
    pdfUrl: string;
    wilayah: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await supabaseFetch(
          "e_buletin",
          "order=wilayah.asc,created_at.desc"
        );
        if (res && Array.isArray(res)) {
          setData(res);
        }
      } catch (err) {
        console.error("Gagal memuat e-buletin:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Helper untuk mempersingkat kata 'Kabupaten' menjadi 'Kab.'
  const formatWilayahName = (name: string) => {
    return name.replace(/\bKabupaten\b/g, "Kab.");
  };

  // Hubungkan daftar referensi wilayah dengan dokumen yang ada di Supabase
  const combinedList = useMemo(() => {
    return REGIONS.map((region) => {
      const dbItem =
        data.find(
          (d) =>
            d.wilayah?.toLowerCase().trim() === region.name.toLowerCase().trim()
        ) ??
        data.find((d) => {
          const dw = (d.wilayah || "").toLowerCase().trim();
          const rn = region.name.toLowerCase().trim();
          return dw.includes(rn) || rn.includes(dw);
        });

      const pdfUrl = dbItem?.pdf_url
        ? supabaseGetPublicUrl("e-buletin-files", dbItem.pdf_url)
        : "";

      return {
        id: region.slug,
        wilayah: region.name,
        judul:
          dbItem?.judul ||
          `E-Buletin Prakiraan Sifat dan Curah Hujan di ${region.name}`,
        edisi: dbItem?.edisi || "",
        pdfUrl: pdfUrl,
        hasDoc: !!dbItem,
      };
    });
  }, [data]);

  // Pisahkan Buletin Utama Provinsi Jawa Timur
  const jatimItem = useMemo(() => {
    return (
      combinedList.find(
        (r) =>
          r.wilayah.toLowerCase().includes("jawa timur") ||
          r.id === "jawa-timur"
      ) || combinedList[0]
    );
  }, [combinedList]);

  // Filter daftar kabupaten dan kota (kecuali dokumen provinsi)
  const filteredKotaKab = useMemo(() => {
    const list = combinedList.filter((r) => r.id !== jatimItem?.id);
    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter((item) =>
      item.wilayah.toLowerCase().includes(q)
    );
  }, [combinedList, jatimItem, searchQuery]);

  return (
    <>
<main className="min-h-screen bg-slate-50 pb-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-200 mb-4 border border-white/10">
                <span className="material-symbols-outlined text-[16px]">
                  menu_book
                </span>
                <span>Publikasi Ilmiah & Buletin</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
                E-Buletin Kota & Kabupaten
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                Daftar arsip dokumen E-Buletin informasi iklim, analisis curah
                hujan, dan ringkasan agroklimat untuk 38 Kota dan Kabupaten di
                Provinsi Jawa Timur.
              </p>
            </div>
          </div>

          {/* Modal / Pratinjau PDF Aktif */}
          {selectedBuletin && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-primary/30 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-3">
                  <div>
                    <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                      {formatWilayahName(selectedBuletin.wilayah)}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1">
                      {selectedBuletin.judul}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBuletin(null);
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                    <span>Tutup Pratinjau</span>
                  </button>
                </div>

                <div className="w-full">
                  <PdfViewer
                    url={selectedBuletin.pdfUrl}
                    title={selectedBuletin.judul}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Highlight Card: Dokumen Utama Provinsi Jawa Timur */}
          {jatimItem && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                  <img
                    src={getRegionLogo(jatimItem.wilayah)}
                    alt="Logo Jawa Timur"
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/logos/jawa-timur.png";
                    }}
                  />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-600 block">
                    BULETIN PROV JATIM
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    E-Buletin Prakiraan Sifat dan Curah Hujan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Prakiraan untuk seluruh Provinsi Jawa Timur.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                <button
                  onClick={() => {
                    setSelectedBuletin({
                      wilayah: jatimItem.wilayah,
                      judul: jatimItem.judul,
                      pdfUrl: jatimItem.pdfUrl,
                    });
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-sky-600 text-sky-700 bg-sky-50/50 hover:bg-sky-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    visibility
                  </span>
                  <span>Lihat</span>
                </button>
                <a
                  href={jatimItem.pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    download
                  </span>
                  <span>Simpan</span>
                </a>
              </div>
            </div>
          )}

          {/* Direktori Wilayah & Kontrol Pencarian */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-600 block mb-1">
                DIREKTORI WILAYAH
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Pilih kabupaten atau kota
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Menampilkan {filteredKotaKab.length} wilayah.
              </p>
            </div>

            <div className="w-full sm:w-80">
              <label
                htmlFor="search-wilayah"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Cari wilayah
              </label>
              <div className="relative">
                <input
                  id="search-wilayah"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Contoh: Malang"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all shadow-xs"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  search
                </span>
              </div>
            </div>
          </div>

          {/* Card Grid Daftar Kabupaten / Kota */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 font-medium animate-pulse">
                Memuat data e-buletin wilayah...
              </p>
            </div>
          ) : filteredKotaKab.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
                location_off
              </span>
              <h4 className="text-base font-bold text-slate-700 mb-1">
                Wilayah Tidak Ditemukan
              </h4>
              <p className="text-xs text-slate-400">
                Coba gunakan kata kunci pencarian yang lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredKotaKab.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-4 shadow-xs transition-all flex items-center justify-between gap-3 ${item.hasDoc
                      ? "border-slate-200 hover:shadow-md"
                      : "border-slate-100 opacity-60"
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                      <img
                        src={getRegionLogo(item.wilayah)}
                        alt={`Lambang ${item.wilayah}`}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/logos/jawa-timur.png";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-sm font-bold text-slate-900 leading-snug break-words"
                        title={item.wilayah}
                      >
                        {formatWilayahName(item.wilayah)}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {item.hasDoc
                          ? `E-Buletin PDF${item.edisi ? ` • ${item.edisi}` : ""}`
                          : "Belum tersedia"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.hasDoc ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedBuletin({
                              wilayah: item.wilayah,
                              judul: item.judul,
                              pdfUrl: item.pdfUrl,
                            });
                            window.scrollTo({ top: 350, behavior: "smooth" });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-sky-600 text-sky-700 bg-sky-50/50 hover:bg-sky-100 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            visibility
                          </span>
                          <span>Lihat</span>
                        </button>
                        <a
                          href={item.pdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            download
                          </span>
                          <span>Simpan</span>
                        </a>
                      </>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                        Segera hadir
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
</>
  );
}