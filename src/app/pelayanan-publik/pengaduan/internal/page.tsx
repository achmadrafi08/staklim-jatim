"use client";

import { useEffect, useState } from "react";
import { fetchServiceLinks, DEFAULT_SERVICE_LINKS } from "@/lib/service-links";

export default function PengaduanInternalPage() {
  const [url, setUrl] = useState(DEFAULT_SERVICE_LINKS.pengaduanInternal);

  useEffect(() => {
    fetchServiceLinks().then((links) => {
      const target = links.pengaduanInternal || DEFAULT_SERVICE_LINKS.pengaduanInternal;
      setUrl(target);
      window.location.href = target;
    });
  }, []);

  return (
    <>
<main className="min-h-screen bg-slate-50 pt-4 pb-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100 shadow-xs">
            <span className="material-symbols-outlined text-[32px]">feedback</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Pengaduan Internal</h2>
          <p className="text-sm text-slate-500 mb-6">
            Sedang mengalihkan Anda ke formulir Pengaduan Internal BMKG Jawa Timur...
          </p>
          <a
            href={url}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>Buka Formulir Pengaduan</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
        </div>
      </main></>
  );
}
