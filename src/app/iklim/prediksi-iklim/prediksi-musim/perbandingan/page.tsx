"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { supabaseFetch } from "@/lib/supabase";
import { CustomSelect } from "@/components/ui/CustomSelect";

const SeasonMap = dynamic(
  () => import("@/components/climate/season-map").then((mod) => mod.SeasonMap),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-100 rounded-xl animate-pulse"><div className="flex flex-col items-center gap-4"><span className="material-symbols-outlined text-4xl text-slate-400 animate-bounce">map</span><span className="text-slate-500 font-medium">Memuat Peta Interaktif...</span></div></div> }
);

interface ForecastOption {
  id: number;
  category: string;
  year: number;
  month: string;
  label: string;
  file_path: string;
}

// Legenda untuk AMK
const LEGEND_AMK = [
  { kriteria: "Mundur ≥3 Dasarian", color: "#70A800", nilai: "≥3" },
  { kriteria: "Mundur 2 Dasarian", color: "#98E500", nilai: "2" },
  { kriteria: "Mundur 1 Dasarian", color: "#D0FF73", nilai: "1" },
  { kriteria: "Sama", color: "#FFFF00", nilai: "0" },
  { kriteria: "Maju 1 Dasarian", color: "#FFD380", nilai: "-1" },
  { kriteria: "Maju 2 Dasarian", color: "#E69800", nilai: "-2" },
  { kriteria: "Maju ≥3 Dasarian", color: "#A87001", nilai: "≤-3" },
];

// Legenda untuk AMH: Mundur=COKLAT/ORANYE (lebih lambat dari normal), Maju=HIJAU (lebih awal dari normal)
const LEGEND_AMH = [
  { kriteria: "Mundur ≥3 Dasarian", color: "#A87001", nilai: "≥3" },
  { kriteria: "Mundur 2 Dasarian", color: "#E69800", nilai: "2" },
  { kriteria: "Mundur 1 Dasarian", color: "#FFD380", nilai: "1" },
  { kriteria: "Sama", color: "#FFFF00", nilai: "0" },
  { kriteria: "Maju 1 Dasarian", color: "#D0FF73", nilai: "-1" },
  { kriteria: "Maju 2 Dasarian", color: "#98E500", nilai: "-2" },
  { kriteria: "Maju ≥3 Dasarian", color: "#70A800", nilai: "≤-3" },
];

export default function PerbandinganMusimPage() {
  const [forecasts, setForecasts] = useState<ForecastOption[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<ForecastOption | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForecasts = async () => {
      setIsLoading(true);
      try {
        const data = await supabaseFetch(
          "rainfall_forecasts",
          "or=(category.eq.perbandingan_musim_hujan,category.eq.perbandingan_musim_kemarau,category.eq.perbandingan_musim)&order=year.desc,month.desc,created_at.desc"
        );
        if (data && data.length > 0) {
          setForecasts(data);
          setSelectedForecast(data[0]);
        } else {
          setForecasts([]);
          setSelectedForecast(null);
        }
      } catch (err) {
        console.error("Error fetching perbandingan forecasts:", err);
        setForecasts([]);
        setSelectedForecast(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForecasts();
  }, []);

  // Tentukan jenis musim peta yang dipilih
  const isAMH = selectedForecast?.category === "perbandingan_musim_hujan";
  const isAMK = selectedForecast?.category === "perbandingan_musim_kemarau";
  const currentLegend = isAMH ? LEGEND_AMH : LEGEND_AMK;
  const currentMusimLabel = isAMH ? "Awal Musim Hujan (AMH)" : isAMK ? "Awal Musim Kemarau (AMK)" : "Perbandingan Musim";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
<main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined">compare</span>
            <span className="uppercase tracking-widest text-sm">Informasi Iklim</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Peta Prediksi Perbandingan Musim
          </h1>
          <p className="text-slate-600 max-w-3xl leading-relaxed">
            Peta interaktif perbandingan waktu dimulainya musim dibandingkan rata-rata normalnya pada Zona Musim (ZOM) wilayah Jawa Timur.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-end relative z-20">
          <div className="flex-1 w-full space-y-1.5 relative z-40">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Periode Prediksi</label>
            <CustomSelect
              value={selectedForecast?.id?.toString() || ""}
              onChange={(val) => {
                const found = forecasts.find(f => f.id.toString() === val);
                if (found) setSelectedForecast(found);
              }}
              disabled={isLoading || forecasts.length === 0}
              options={isLoading
                ? [{ value: "", label: "Memuat data..." }]
                : forecasts.length === 0
                  ? [{ value: "", label: "Belum Ada Data Peta Perbandingan Musim" }]
                  : forecasts.map(f => ({
                      value: f.id.toString(),
                      label: `${f.label || `Periode ${f.month}/${f.year}`} — ${f.category === "perbandingan_musim_hujan" ? "AMH" : "AMK"}`
                    }))}
            />
          </div>

          {/* Badge musim */}
          {selectedForecast && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold shrink-0 ${isAMH ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
              <span className="material-symbols-outlined text-[16px]">{isAMH ? "water_drop" : "wb_sunny"}</span>
              {currentMusimLabel}
            </div>
          )}

          {!isLoading && forecasts.length === 0 && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 text-xs font-semibold shrink-0">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Data belum tersedia.
            </div>
          )}
        </div>

        {/* Legenda Dinamis */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-sm text-slate-700 flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">palette</span>
            Keterangan — Perbandingan {currentMusimLabel}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="py-3 px-4 font-bold text-slate-600 text-center">Warna</th>
                  <th className="py-3 px-4 font-bold text-slate-600">Kriteria</th>
                  <th className="py-3 px-4 font-bold text-slate-600 text-center">Nilai Data</th>
                </tr>
              </thead>
              <tbody>
                {currentLegend.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-5 rounded border border-black/10 shadow-sm" style={{ backgroundColor: item.color }} />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{item.kriteria}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-600">{item.nilai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            * Nilai negatif = Maju (lebih awal dari normal), nilai positif = Mundur (lebih lambat dari normal). Nilai di luar ±3 dianggap sama dengan ±3 Dasarian.
          </p>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 min-h-[600px] flex flex-col relative z-10">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">map</span>
              {selectedForecast ? selectedForecast.label : "Peta Zona Musim Jawa Timur - Perbandingan Musim"}
            </h2>
          </div>
          <div className="flex-1 relative bg-slate-100 min-h-[600px] p-4">
            <SeasonMap forecast={selectedForecast} categoryLabel={`Perbandingan ${currentMusimLabel}`} />
          </div>
        </div>
      </main>

</div>
  );
}
