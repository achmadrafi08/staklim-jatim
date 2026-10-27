"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

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

// Mobile Accordion Menu Item
function MobileAccordion({
  menu,
  pathname,
  onNavigate,
}: {
  menu: MenuCategory;
  pathname: string;
  onNavigate: () => void;
}) {
  const isActive = menu.items.some((item) => pathname.startsWith(item.href));
  const [open, setOpen] = useState(isActive);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors ${
          isActive ? "bg-blue-50/60" : "hover:bg-slate-50"
        }`}
      >
        <span
          className={`text-sm font-bold ${
            isActive ? "text-blue-700" : "text-slate-700"
          }`}
        >
          {menu.title}
        </span>
        <span
          className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
            open ? "rotate-180 text-blue-600" : "text-slate-400"
          }`}
        >
          expand_more
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-slate-50/50"
          >
            {menu.items.map((item) => {
              const itemActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  onClick={onNavigate}
                  className={`flex items-center justify-between pl-8 pr-5 py-2.5 text-[13px] transition-colors ${
                    itemActive
                      ? "text-blue-700 font-bold bg-blue-50"
                      : "text-slate-600 hover:text-blue-700 hover:bg-blue-50/50 font-medium"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.external && (
                    <span className="material-symbols-outlined text-[13px] text-slate-400 shrink-0 ml-2">
                      open_in_new
                    </span>
                  )}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PpidHeader() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = (title: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(title);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };

  return (
    <div className="w-full">
      {/* 1. TOP BAR PPID */}
      <div className="bg-[#0b2847] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <span className="font-medium text-[10px] sm:text-xs tracking-wide truncate">
            Pejabat Pengelola Informasi dan Dokumentasi · Stasiun Klimatologi Jawa Timur
          </span>
          <div className="hidden sm:flex items-center gap-3 text-[11px] shrink-0">
            <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">
              Beranda Portal Utama
            </Link>
            <span className="text-slate-500">·</span>
            <a
              href="https://www.bmkg.go.id"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Situs BMKG
            </a>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR PPID */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo + Title */}
          <Link href="/pelayanan-publik" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative shrink-0 p-1 rounded-xl border border-slate-100 bg-white shadow-2xs">
              <img
                src="/LogoStaklimJatim.jpg"
                alt="Logo BMKG"
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/logos/jawa-timur.png";
                }}
              />
            </div>
            <div className="leading-tight min-w-0">
              {/* Desktop title */}
              <h1 className="hidden sm:block text-sm lg:text-base font-extrabold text-[#0b2847] tracking-tight group-hover:text-blue-700 transition-colors whitespace-nowrap">
                PEJABAT PENGELOLA INFORMASI DAN DOKUMENTASI
              </h1>
              {/* Mobile title */}
              <h1 className="block sm:hidden text-[11px] font-extrabold text-[#0b2847] tracking-tight leading-tight">
                <span className="block">PPID</span>
                <span className="block text-[9px] font-bold text-slate-500 mt-0.5">Staklim Jawa Timur</span>
              </h1>
              <p className="hidden sm:block text-[10px] lg:text-[11px] text-slate-500 font-medium whitespace-nowrap">
                Badan Meteorologi, Klimatologi, dan Geofisika · Jawa Timur
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-0.5 shrink-0">
            {PPID_MENUS.map((menu) => (
              <div
                key={menu.title}
                className="relative"
                onMouseEnter={() => handleMouseEnter(menu.title)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                  <span>{menu.title}</span>
                  <span
                    className={`material-symbols-outlined text-[16px] text-slate-400 transition-transform duration-200 ${
                      activeDropdown === menu.title ? "rotate-180 text-blue-600" : ""
                    }`}
                  >
                    arrow_drop_down
                  </span>
                </button>

                <AnimatePresence>
                  {activeDropdown === menu.title && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50"
                    >
                      {menu.items.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          target={sub.external ? "_blank" : undefined}
                          rel={sub.external ? "noreferrer" : undefined}
                          onClick={() => setActiveDropdown(null)}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Link
              href="/pelayanan-publik/faq"
              className="px-2.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              FAQ
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="flex xl:hidden items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </header>

      {/* 3. MOBILE SIDEBAR DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white z-[100] xl:hidden flex flex-col shadow-2xl border-l border-slate-200"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 shrink-0 p-0.5 rounded-lg border border-slate-100 bg-white">
                    <img
                      src="/LogoStaklimJatim.jpg"
                      alt="Logo"
                      className="w-full h-full object-contain rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "/logos/jawa-timur.png";
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold text-[#0b2847] leading-tight">
                      PPID
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      Staklim Jawa Timur
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>

              {/* Quick Links */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-white text-[11px]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  ← Portal Utama
                </Link>
                <span className="text-slate-300">|</span>
                <a
                  href="https://www.bmkg.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 font-medium hover:text-blue-600"
                >
                  Situs BMKG
                </a>
              </div>

              {/* Menu Accordions */}
              <div className="flex-1 overflow-y-auto">
                {PPID_MENUS.map((menu) => (
                  <MobileAccordion
                    key={menu.title}
                    menu={menu}
                    pathname={pathname}
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                ))}

                {/* FAQ Link */}
                <Link
                  href="/pelayanan-publik/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors border-b border-slate-100"
                >
                  FAQ
                </Link>
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <p className="text-[10px] text-slate-400 font-medium text-center">
                  &copy; {new Date().getFullYear()} PPID Stasiun Klimatologi Kelas I Jawa Timur
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
