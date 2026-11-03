"use client";

import { useState, useEffect } from "react";
import { fetchServiceLinks, DEFAULT_SERVICE_LINKS } from "@/lib/service-links";

interface Channel {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  tag: string;
  dynamicKey?: "surveiSKM" | "surveiSPAK" | "pengaduanInternal";
}

const staticChannels: Channel[] = [
  {
    title: "SP4N LAPOR!",
    description: "Sistem Pengelolaan Pengaduan Pelayanan Publik Nasional — platform resmi pemerintah untuk menyampaikan aspirasi, pengaduan, dan pelaporan terkait pelayanan publik.",
    icon: "sms",
    href: "https://www.lapor.go.id/",
    color: "from-blue-500 to-blue-700",
    tag: "Pengaduan Resmi",
  },
  {
    title: "Survei Kepuasan Masyarakat",
    description: "Bantu kami meningkatkan kualitas layanan dengan mengisi survei kepuasan masyarakat (SKM) secara anonim.",
    icon: "rate_review",
    href: DEFAULT_SERVICE_LINKS.surveiSKM,
    color: "from-emerald-500 to-teal-600",
    tag: "Survei",
    dynamicKey: "surveiSKM",
  },
  {
    title: "Survei Persepsi Anti Korupsi",
    description: "Berikan penilaian Anda terhadap integritas dan penerapan anti korupsi di lingkungan kerja kami.",
    icon: "gavel",
    href: DEFAULT_SERVICE_LINKS.surveiSPAK,
    color: "from-purple-500 to-violet-600",
    tag: "Integritas",
    dynamicKey: "surveiSPAK",
  },
  {
    title: "Whistleblowing System",
    description: "Laporkan dugaan pelanggaran, penyalahgunaan wewenang, atau tindak pidana korupsi secara rahasia dan terlindungi.",
    icon: "security",
    href: "https://wbs.bmkg.go.id/",
    color: "from-red-500 to-rose-600",
    tag: "Pelaporan Rahasia",
  },
  {
    title: "Pengaduan Internal",
    description: "Formulir khusus bagi internal pegawai BMKG untuk menyampaikan keluhan, masukan, atau laporan internal.",
    icon: "feedback",
    href: DEFAULT_SERVICE_LINKS.pengaduanInternal,
    color: "from-amber-500 to-orange-600",
    tag: "Internal",
    dynamicKey: "pengaduanInternal",
  },
];

export function PengaduanChannels() {
  const [channels, setChannels] = useState<Channel[]>(staticChannels);

  useEffect(() => {
    fetchServiceLinks().then((links) => {
      setChannels((prev) =>
        prev.map((ch) => {
          if (ch.dynamicKey && links[ch.dynamicKey]) {
            return { ...ch, href: links[ch.dynamicKey] };
          }
          return ch;
        })
      );
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {channels.map((ch, idx) => (
        <a
          key={idx}
          href={ch.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl border border-slate-100 hover:border-transparent transition-all duration-300 flex flex-col h-full overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${ch.color} opacity-5 rounded-full blur-2xl group-hover:scale-150 group-hover:opacity-10 transition-all duration-500 -mr-8 -mt-8`}></div>

          <div className="flex items-center justify-between mb-5 relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${ch.color} text-white shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
              <span className="material-symbols-outlined text-[24px]">{ch.icon}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              {ch.tag}
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors relative z-10">
            {ch.title}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-1 relative z-10">
            {ch.description}
          </p>
          
          <div className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 mt-auto relative z-10">
            <span>Buka Portal</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">open_in_new</span>
          </div>
        </a>
      ))}
    </div>
  );
}
