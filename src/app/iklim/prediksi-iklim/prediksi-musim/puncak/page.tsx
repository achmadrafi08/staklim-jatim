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

const PUNCAK_LEGEND = [
  { mh_month: "JULI", mh_color: "#9AFD0F", mk_month: "JANUARI", mk_color: "#FFB810" },
  { mh_month: "AGUSTUS", mh_color: "#7BC50C", mk_month: "FEBRUARI", mk_color: "#D0920D" },
  { mh_month: "SEPTEMBER", mh_color: "#5B9409", mk_month: "MARET", mk_color: "#966B0B" },
  { mh_month: "OKTOBER", mh_color: "#10FE23", mk_month: "APRIL", mk_color: "#FE7E10" },
  { mh_month: "NOVEMBER", mh_color: "#0CBC1B", mk_month: "MEI", mk_color: "#D16A0D" },
  { mh_month: "DESEMBER", mh_color: "#09950E", mk_month: "JUNI", mk_color: "#954709" },
  { mh_month: "JANUARI", mh_color: "#082698", mk_month: "JULI", mk_color: "#821308" },
  { mh_month: "FEBRUARI", mh_color: "#0A34BE", mk_month: "AGUSTUS", mk_color: "#C71D0C" },
  { mh_month: "MARET", mh_color: "#0F4AFC", mk_month: "SEPTEMBER", mk_color: "#FC260E" },
  { mh_month: "APRIL", mh_color: "#096A95", mk_month: "OKTOBER", mk_color: "#960955" },
  { mh_month: "MEI", mh_color: "#0C8BC1", mk_month: "NOVEMBER", mk_color: "#D10E9B" },
  { mh_month: "JUNI", mh_color: "#0FBAFE", mk_month: "DESEMBER", mk_color: "#FD0FBC" },
];

export default function PuncakMusimPage() {
  const [forecasts, setForecasts] = useState<ForecastOption[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<ForecastOption | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForecasts = async () => {
      setIsLoading(true);
      try {
        const data = await supabaseFetch(
          "rainfall_forecasts",
          "category=eq.puncak_musim&order=year.desc,month.desc,created_at.desc"
        );

        if (data && data.length > 0) {
          setForecasts(data);
          setSelectedForecast(data[0]);
        } else {
          setForecasts([]);
          setSelectedForecast(null);
        }
      } catch (err) {
        console.error("Error fetching puncak_musim forecasts:", err);
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
      <Header activeRoute="/iklim/prediksi-iklim/prediksi-musim/puncak" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined">trending_up</span>
            <span className="uppercase tracking-widest text-sm">Informasi Iklim</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Peta Prediksi Puncak Musim
          </h1>
          <p className="text-slate-600 max-w-3xl leading-relaxed">
            Peta interaktif prakiraan waktu terjadinya Puncak Musim pada Zona Musim (ZOM) wilayah Jawa Timur.
          </p>
        </div>

        {/* Legenda Statis Puncak Musim */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-sm text-slate-700 flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">palette</span>
            Keterangan Kategori Puncak Musim
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="py-3 px-4 font-bold text-slate-600 text-center">Warna (MH)</th>
                  <th className="py-3 px-4 font-bold text-slate-600">Puncak Musim Hujan</th>
                  <th className="py-3 px-4 font-bold text-slate-600 text-center">Warna (MK)</th>
                  <th className="py-3 px-4 font-bold text-slate-600">Puncak Musim Kemarau</th>
                </tr>
              </thead>
              <tbody>
                {PUNCAK_LEGEND.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <div
                          className="w-8 h-5 rounded border border-black/10 shadow-sm"
                          style={{ backgroundColor: item.mh_color }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 uppercase">{item.mh_month}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <div
                          className="w-8 h-5 rounded border border-black/10 shadow-sm"
                          style={{ backgroundColor: item.mk_color }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 uppercase">{item.mk_month}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-end relative z-20">
          <div className="flex-1 w-full space-y-1.5 relative z-40">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Periode Prediksi Puncak Musim</label>
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
                  ? [{ value: "", label: "Belum Ada Data Peta Puncak Musim" }]
                  : forecasts.map(f => ({ value: f.id.toString(), label: f.label || `Puncak Musim Periode ${f.month}/${f.year}` }))}
            />
          </div>

          {!isLoading && forecasts.length === 0 && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 text-xs font-semibold shrink-0">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Data belum tersedia.
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 min-h-[600px] flex flex-col relative z-10">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">map</span>
              {selectedForecast ? selectedForecast.label : "Peta Zona Musim Jawa Timur - Puncak Musim"}
            </h2>
          </div>

          <div className="flex-1 relative bg-slate-100 min-h-[600px] p-4">
            <SeasonMap forecast={selectedForecast} categoryLabel="Puncak Musim" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
