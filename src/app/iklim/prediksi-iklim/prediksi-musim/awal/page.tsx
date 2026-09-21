"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useState, useEffect } from "react";
import { supabaseFetch } from "@/lib/supabase";
import { CustomSelect } from "@/components/ui/CustomSelect";

// Import peta tanpa SSR karena Leaflet menggunakan window
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

export default function AwalMusimPage() {
  const [forecasts, setForecasts] = useState<ForecastOption[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<ForecastOption | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch metadata khusus kategori awal_musim dari database
  useEffect(() => {
    const fetchForecasts = async () => {
      setIsLoading(true);
      try {
        const data = await supabaseFetch(
          "rainfall_forecasts", 
          "or=(category.eq.awal_musim_hujan,category.eq.awal_musim_kemarau,category.eq.awal_musim)&order=year.desc,month.desc,created_at.desc"
        );

        if (data && data.length > 0) {
          setForecasts(data);
          setSelectedForecast(data[0]);
        } else {
          // Tanpa fallback data kategori lain jika belum ada file terupload
          setForecasts([]);
          setSelectedForecast(null);
        }
      } catch (err) {
        console.error("Error fetching awal_musim forecasts:", err);
        setForecasts([]);
        setSelectedForecast(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecasts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header activeRoute="/iklim/prediksi-iklim/prediksi-musim/awal" />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="uppercase tracking-widest text-sm">Informasi Iklim</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Peta Prediksi Awal Musim
          </h1>
          <p className="text-slate-600 max-w-3xl leading-relaxed">
            Peta interaktif prakiraan waktu dimulainya musim pada Zona Musim (ZOM) wilayah Jawa Timur.
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
                  ? [{ value: "", label: "Belum Ada Data Peta (Kosong)" }] 
                  : forecasts.map(f => ({ value: f.id.toString(), label: f.label || `Periode ${f.month}/${f.year}` }))}
            />
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 min-h-[600px] flex flex-col relative z-10">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">map</span>
              {selectedForecast ? selectedForecast.label : "Peta Zona Musim Jawa Timur"}
            </h2>
          </div>
          
          <div className="flex-1 relative bg-slate-100 min-h-[600px] p-4">
            <SeasonMap forecast={selectedForecast} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
