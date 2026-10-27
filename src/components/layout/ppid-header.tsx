"use client";

import { useState } from "react";
import Link from "next/link";

interface MenuItem {
  label: string;
  href: string;
  external?: boolean;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export const PPID_MENUS: MenuCategory[] = [
  {
    title: "Profil",
    items: [
      { label: "Profil PPID", href: "/pelayanan-publik/profil/profil-ppid" },
      { label: "Tugas dan Fungsi", href: "/pelayanan-publik/profil/tugas-dan-fungsi" },
      { label: "Struktur Pengelola", href: "/pelayanan-publik/profil/struktur-pengelola" },
    ],
  },
  {
    title: "Informasi Layanan",
    items: [
      { label: "Maklumat Pelayanan", href: "/pelayanan-publik/informasi-layanan/maklumat" },
      { label: "Standar Pelayanan", href: "/pelayanan-publik/informasi-layanan/standar" },
      { label: "Jenis Layanan", href: "/pelayanan-publik/informasi-layanan/jenis" },
      { label: "Jam Operasional Pelayanan", href: "/pelayanan-publik/informasi-layanan/jam-operasional" },
    ],
  },
  {
    title: "Panduan Layanan",
    items: [
      { label: "Alur Pelayanan", href: "/pelayanan-publik/panduan-layanan/alur" },
      { label: "Formulir Permohonan Informasi", href: "/pelayanan-publik/panduan-layanan/formulir" },
      { label: "Lacak Status Dokumen", href: "/pelayanan-publik/panduan-layanan/lacak-status" },
      { label: "Jenis & Tarif Layanan PNBP", href: "/pelayanan-publik/panduan-layanan/tarif-pnbp" },
      { label: "Tarif Nol Rupiah", href: "/pelayanan-publik/panduan-layanan/tarif-nol-rupiah" },
      { label: "PTSP BMKG Pusat", href: "https://ptsp.bmkg.go.id", external: true },
      { label: "Peta Sebaran Pos Hujan", href: "/pelayanan-publik/panduan-layanan/peta-pos" },
    ],
  },
  {
    title: "Dokumen Kinerja",
    items: [
      { label: "Perjanjian Kinerja (PK)", href: "/pelayanan-publik/dokumen-kinerja/pk" },
      { label: "LKJIP", href: "/pelayanan-publik/dokumen-kinerja/lkjip" },
      { label: "Laporan Tahunan", href: "/pelayanan-publik/dokumen-kinerja/laporan-tahunan" },
      { label: "Rencana Kinerja Tahunan (RKT)", href: "/pelayanan-publik/dokumen-kinerja/rkt" },
    ],
  },
  {
    title: "Kanal Pengaduan",
    items: [
      { label: "SP4N LAPOR!", href: "https://www.lapor.go.id", external: true },
      { label: "Survei Kepuasan Masyarakat", href: "/pelayanan-publik/pengaduan/skm" },
      { label: "Survei Persepsi Anti Korupsi", href: "/pelayanan-publik/pengaduan/spak" },
      { label: "Whistleblowing System (WBS)", href: "https://wbs.bmkg.go.id", external: true },
      { label: "Pengaduan Internal", href: "/pelayanan-publik/pengaduan/internal" },
    ],
  },
];

export function PpidHeader() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* 1. TOP BAR PPID */}
      <div className="bg-[#0b2847] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-medium text-[11px] sm:text-xs tracking-wide">
            Pejabat Pengelola Informasi dan Dokumentasi · Stasiun Klimatologi Jawa Timur
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <Link href="/" className="hover:text-white transition-colors">
              Beranda Portal Utama
            </Link>
            <span className="text-slate-500">·</span>
            <a
              href="https://www.bmkg.go.id"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Situs BMKG
            </a>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR PPID */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20 gap-4">
          <Link href="/pelayanan-publik" className="flex items-center gap-3.5 group shrink-0">
            <div className="w-12 h-12 relative shrink-0 p-1 rounded-xl border border-slate-100 bg-white shadow-2xs">
              <img
                src="/LogoStaklimJatim.jpg"
                alt="Logo BMKG"
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/logos/jawa-timur.png";
                }}
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-sm sm:text-base font-extrabold text-[#0b2847] tracking-tight group-hover:text-blue-700 transition-colors whitespace-nowrap">
                PEJABAT PENGELOLA INFORMASI DAN DOKUMENTASI
              </h1>
              <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                Badan Meteorologi, Klimatologi, dan Geofisika · Jawa Timur
              </p>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1 shrink-0">
            {PPID_MENUS.map((menu) => (
              <div
                key={menu.title}
                className="relative"
                onMouseEnter={() => setActiveDropdown(menu.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                  <span>{menu.title}</span>
                  <span className="material-symbols-outlined text-[16px] text-slate-400">
                    arrow_drop_down
                  </span>
                </button>

                {activeDropdown === menu.title && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    {menu.items.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        target={sub.external ? "_blank" : undefined}
                        rel={sub.external ? "noreferrer" : undefined}
                        className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 transition-colors font-medium"
                      >
                        <span className="truncate pr-2">{sub.label}</span>
                        {sub.external && (
                          <span className="material-symbols-outlined text-[13px] text-slate-400 shrink-0">
                            open_in_new
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/pelayanan-publik/faq"
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              FAQ
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
}
