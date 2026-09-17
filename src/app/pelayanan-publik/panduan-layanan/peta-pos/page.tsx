"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BackButton } from "@/components/ui/back-button";

// Import AloptamaMap dynamically to prevent Leaflet window SSR errors
const AloptamaMap = dynamic(
  () => import("@/components/climate/aloptama-map").then((mod) => mod.AloptamaMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[550px] lg:h-[620px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 animate-pulse">Memuat Peta ALOPTAMA...</p>
        </div>
      </div>
    ),
  }
);

const kabupatenData = [
  { kabupaten: "Kab. Jember", jumlahPos: 31, status: "Aktif" },
  { kabupaten: "Kab. Banyuwangi", jumlahPos: 29, status: "Aktif" },
  { kabupaten: "Kab. Malang", jumlahPos: 26, status: "Aktif" },
  { kabupaten: "Kab. Kediri", jumlahPos: 24, status: "Aktif" },
  { kabupaten: "Kab. Probolinggo", jumlahPos: 22, status: "Aktif" },
  { kabupaten: "Kab. Lumajang", jumlahPos: 21, status: "Aktif" },
  { kabupaten: "Kab. Pasuruan", jumlahPos: 21, status: "Aktif" },
  { kabupaten: "Kab. Sumenep", jumlahPos: 21, status: "Aktif" },
  { kabupaten: "Kab. Lamongan", jumlahPos: 20, status: "Aktif" },
  { kabupaten: "Kab. Blitar", jumlahPos: 19, status: "Aktif" },
  { kabupaten: "Kab. Jombang", jumlahPos: 19, status: "Aktif" },
  { kabupaten: "Kab. Bangkalan", jumlahPos: 18, status: "Aktif" },
  { kabupaten: "Kab. Bondowoso", jumlahPos: 18, status: "Aktif" },
  { kabupaten: "Kab. Ngawi", jumlahPos: 18, status: "Aktif" },
  { kabupaten: "Kab. Ponorogo", jumlahPos: 18, status: "Aktif" },
  { kabupaten: "Kab. Tuban", jumlahPos: 18, status: "Aktif" },
  { kabupaten: "Kab. Nganjuk", jumlahPos: 17, status: "Aktif" },
  { kabupaten: "Kab. Bojonegoro", jumlahPos: 16, status: "Aktif" },
  { kabupaten: "Kab. Sidoarjo", jumlahPos: 16, status: "Aktif" },
  { kabupaten: "Kab. Situbondo", jumlahPos: 16, status: "Aktif" },
  { kabupaten: "Kab. Magetan", jumlahPos: 15, status: "Aktif" },
  { kabupaten: "Kab. Mojokerto", jumlahPos: 14, status: "Aktif" },
  { kabupaten: "Kab. Tulungagung", jumlahPos: 14, status: "Aktif" },
  { kabupaten: "Kab. Sampang", jumlahPos: 13, status: "Aktif" },
  { kabupaten: "Kab. Pacitan", jumlahPos: 12, status: "Aktif" },
  { kabupaten: "Kab. Trenggalek", jumlahPos: 12, status: "Aktif" },
  { kabupaten: "Kab. Gresik", jumlahPos: 11, status: "Aktif" },
  { kabupaten: "Kab. Madiun", jumlahPos: 11, status: "Aktif" },
  { kabupaten: "Kab. Pamekasan", jumlahPos: 11, status: "Aktif" },
  { kabupaten: "Kota Surabaya", jumlahPos: 9, status: "Aktif" },
  { kabupaten: "Kota Batu", jumlahPos: 4, status: "Aktif" },
  { kabupaten: "Kota Malang", jumlahPos: 3, status: "Aktif" },
  { kabupaten: "Kota Probolinggo", jumlahPos: 3, status: "Aktif" },
  { kabupaten: "Kota Blitar", jumlahPos: 2, status: "Aktif" },
  { kabupaten: "Kota Kediri", jumlahPos: 1, status: "Aktif" },
  { kabupaten: "Kota Pasuruan", jumlahPos: 1, status: "Aktif" },
];

export default function PetaPosPage() {
  const [totalPosMap, setTotalPosMap] = useState<number>(544);
  const totalPosTable = kabupatenData.reduce((acc, d) => acc + d.jumlahPos, 0);

  return (
    <>
      <Header activeRoute="/pelayanan-publik/panduan-layanan/peta-pos" />
      <main className="min-h-screen bg-slate-50/70 pt-24 pb-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <BackButton fallbackHref="/pelayanan-publik/panduan-layanan" className="inline-flex items-center gap-1 text-primary hover:text-secondary font-medium mb-4 transition-colors cursor-pointer bg-transparent border-0 p-0">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali ke Panduan Layanan
          </BackButton>

          {/* Header Title / ALOPTAMA Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 relative overflow-hidden mb-6 shadow-xs">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full mb-2.5 border border-emerald-200/80">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">travel_explore</span>
                  ALOPTAMA — Sebaran Pos Hujan Jatim
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Peta Sebaran Pos Hujan Kerjasama &amp; Operasional
                </h1>
                
                <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                  Peta ini menampilkan titik lokasi Pos Hujan kerjasama dan operasional BMKG di wilayah Jawa Timur. Klik pada setiap titik marker untuk melihat ID Pos dan Nama Pos pengamatan secara mendetail.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shrink-0 w-full md:w-auto shadow-md">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">pin_drop</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Pos Terdata</div>
                  <div className="text-2xl font-black text-emerald-400">{totalPosMap} <span className="text-xs font-normal text-slate-300">Titik</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* MAP AND SIDE PANEL SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
            {/* Left: Map */}
            <div className="lg:col-span-9 w-full">
              <AloptamaMap onDataLoaded={(count) => setTotalPosMap(count)} />
            </div>

            {/* Right: Info Panel & Legend */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {/* KETERANGAN PANEL */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-emerald-600 shadow-xs">
                <h6 className="font-extrabold text-xs uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-2 mb-3.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">info</span>
                  KETERANGAN
                </h6>
                
                <div className="flex items-center gap-2.5 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs shrink-0"></span>
                  <span className="text-xs font-bold text-slate-800">Lokasi Pos Hujan</span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed text-justify">
                  Peta ini menampilkan titik lokasi Pos Hujan kerjasama dan operasional BMKG di wilayah Jawa Timur.
                  <br /><br />
                  Klik pada titik untuk melihat <strong>ID Pos</strong> dan <strong>Nama Pos</strong>.
                </p>
              </div>

              {/* TOTAL POS CARD */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Pos Terdata</span>
                <span className="text-4xl font-black text-emerald-600 mb-0.5">{totalPosMap}</span>
                <span className="text-[11px] font-medium text-slate-400">Titik Pengamatan</span>
              </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-6 sm:px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  Data Sebaran Per Kabupaten/Kota
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Daftar lengkap rekapitulasi pos pengamatan hujan aktif di wilayah Jawa Timur.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 sm:px-8 py-3.5 font-extrabold text-slate-500 text-[11px] uppercase tracking-wider w-20">No.</th>
                    <th className="text-left px-4 py-3.5 font-extrabold text-slate-500 text-[11px] uppercase tracking-wider">Kabupaten / Kota</th>
                    <th className="text-center px-4 py-3.5 font-extrabold text-slate-500 text-[11px] uppercase tracking-wider w-32">Jumlah Pos</th>
                    <th className="text-center px-6 sm:px-8 py-3.5 font-extrabold text-slate-500 text-[11px] uppercase tracking-wider w-32">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kabupatenData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 sm:px-8 py-3 text-slate-400 font-mono text-xs">{idx + 1}</td>
                      <td className="px-4 py-3 font-bold text-slate-700">{row.kabupaten}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center min-w-[32px] bg-slate-100 text-slate-700 font-bold text-xs px-2 py-0.5 rounded-md border border-slate-200">
                          {row.jumlahPos}
                        </span>
                      </td>
                      <td className="px-6 sm:px-8 py-3 text-center">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900 border-t-2 border-slate-800">
                    <td className="px-6 sm:px-8 py-3.5"></td>
                    <td className="px-4 py-3.5 font-black text-white text-right">Total Pos Terdaftar</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center justify-center min-w-[40px] bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-md shadow-xs">
                        {totalPosTable}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-3.5"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {/* Note */}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex gap-4 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">info</span>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed pt-0.5">
              <strong>Catatan Penting:</strong> Pos hujan ALOPTAMA (Manual) ini bekerja secara terintegrasi dengan jaringan operasional Stasiun Klimatologi Jawa Timur. Untuk permohonan data teknis historis curah hujan atau titik koordinat lebih rinci, dapat mengajukan melalui layanan resmi BMKG.
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
