"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MenuItem {
  label: string;
  href: string;
  desc?: string;
  external?: boolean;
}

interface MenuCategory {
  title: string;
  icon: string;
  items: MenuItem[];
}

const PPID_MENUS: MenuCategory[] = [
  {
    title: "Profil PPID",
    icon: "account_balance",
    items: [
      { label: "Profil PPID", href: "/pelayanan-publik/profil" },
      { label: "Visi, Misi, Tugas dan Fungsi", href: "/pelayanan-publik/profil/visi-misi-tusi" },
      { label: "Struktur Organisasi PPID", href: "https://ppid.bmkg.go.id/struktur-organisasi", external: true },
    ],
  },
  {
    title: "Informasi Publik",
    icon: "public",
    items: [
      { label: "Daftar Informasi Publik", href: "https://ppid.bmkg.go.id/daftar-informasi-publik", external: true },
      { label: "Informasi Publik Secara Berkala", href: "/pelayanan-publik/informasi-publik/berkala" },
      { label: "Informasi Publik Setiap Saat", href: "/pelayanan-publik/informasi-publik/setiap-saat" },
      { label: "Informasi Publik Serta Merta", href: "/pelayanan-publik/informasi-publik/serta-merta" },
      { label: "Informasi Yang Dikecualikan", href: "https://ppid.bmkg.go.id/daftar-informasi-yang-dikecualikan", external: true },
    ],
  },
  {
    title: "Standar Layanan",
    icon: "verified_user",
    items: [
      {
        label: "Maklumat Pelayanan",
        href: "/pelayanan-publik/informasi-layanan/maklumat",
        desc: "Komitmen mutu penyelenggaraan layanan informasi",
      },
      {
        label: "Standar Pelayanan",
        href: "/pelayanan-publik/informasi-layanan/standar",
        desc: "Pedoman baku persyaratan dan prosedur publik",
      },
      {
        label: "Jenis Layanan",
        href: "/pelayanan-publik/informasi-layanan/jenis",
        desc: "Katalog ragam produk data dan jasa iklim",
      },
      {
        label: "Jam Operasional Pelayanan",
        href: "/pelayanan-publik/informasi-layanan/jam-operasional",
        desc: "Jadwal loket pelayanan kantor & online",
      },
    ],
  },
  {
    title: "Panduan Layanan",
    icon: "menu_book",
    items: [
      {
        label: "Alur Pelayanan",
        href: "/pelayanan-publik/panduan-layanan/alur",
        desc: "Tahapan tata cara permohonan informasi publik",
      },
      {
        label: "Formulir Permohonan Informasi",
        href: "/pelayanan-publik/panduan-layanan/formulir",
        desc: "Pengajuan permohonan data dan info iklim online",
      },
      {
        label: "Lacak Status Dokumen",
        href: "/pelayanan-publik/panduan-layanan/lacak-status",
        desc: "Pantau proses berkas dan tiket permohonan Anda",
      },
      {
        label: "Jenis & Tarif Layanan PNBP",
        href: "/pelayanan-publik/panduan-layanan/tarif-pnbp",
        desc: "Daftar tarif resmi penerimaan negara bukan pajak",
      },
      {
        label: "Tarif Nol Rupiah",
        href: "/pelayanan-publik/panduan-layanan/tarif-nol-rupiah",
        desc: "Ketentuan bebas biaya pendidikan dan penelitian",
      },
      {
        label: "PTSP BMKG Pusat",
        href: "https://ptsp.bmkg.go.id",
        external: true,
        desc: "Portal Pelayanan Terpadu Satu Pintu Pusat",
      },
      {
        label: "Peta Sebaran Pos Hujan",
        href: "/pelayanan-publik/panduan-layanan/peta-pos",
        desc: "Sebaran jaringan pos pengamatan ALOPTAMA",
      },
    ],
  },
  {
    title: "Dokumen Kinerja",
    icon: "folder_open",
    items: [
      {
        label: "Perjanjian Kinerja (PK)",
        href: "/pelayanan-publik/dokumen-kinerja/pk",
        desc: "Sasaran target dan komitmen perjanjian kinerja tahunan",
      },
      {
        label: "LKJIP",
        href: "/pelayanan-publik/dokumen-kinerja/lkjip",
        desc: "Laporan Kinerja Instansi Pemerintah Staklim Jatim",
      },
      {
        label: "Laporan Tahunan",
        href: "/pelayanan-publik/dokumen-kinerja/laporan-tahunan",
        desc: "Akuntabilitas penyelenggaraan tugas selama satu tahun",
      },
      {
        label: "Rencana Kinerja Tahunan (RKT)",
        href: "/pelayanan-publik/dokumen-kinerja/rkt",
        desc: "Dokumen perencanaan target kinerja tahunan satker",
      },
    ],
  },
  {
    title: "Kanal Pengaduan",
    icon: "campaign",
    items: [
      {
        label: "SP4N LAPOR!",
        href: "https://www.lapor.go.id",
        external: true,
        desc: "Layanan aspirasi & pengaduan online rakyat",
      },
      {
        label: "Survei Kepuasan Masyarakat",
        href: "/pelayanan-publik/pengaduan/skm",
        desc: "Evaluasi berkala kepuasan pelayanan publik",
      },
      {
        label: "Survei Persepsi Anti Korupsi",
        href: "/pelayanan-publik/pengaduan/spak",
        desc: "Penilaian indeks integritas dan anti korupsi",
      },
      {
        label: "Whistleblowing System (WBS)",
        href: "https://wbs.bmkg.go.id",
        external: true,
        desc: "Sistem pelaporan dugaan pelanggaran internal",
      },
      {
        label: "Pengaduan Internal",
        href: "/pelayanan-publik/pengaduan/internal",
        desc: "Kanal pengaduan langsung ke kepatuhan internal",
      },
    ],
  },
];

const HERO_SLIDES = [
  {
    tag: "PPID BMKG · Jawa Timur",
    title: "Informasi Publik yang Mudah Diakses",
    desc: "Temukan informasi mengenai layanan, dokumen, dan kegiatan resmi Stasiun Klimatologi Kelas I Jawa Timur secara transparan.",
    ctaText: "Formulir Permohonan",
    ctaHref: "/pelayanan-publik/panduan-layanan/formulir",
    bgGradient: "from-[#0b2847] via-[#0f3b68] to-[#164e87]",
  },
  {
    tag: "Keterbukaan Informasi",
    title: "Akses Terbuka untuk Seluruh Masyarakat",
    desc: "Pelajari klasifikasi informasi publik, hak pemohon informasi, serta mekanisme permohonan sesuai ketentuan perundang-undangan.",
    ctaText: "Jelajahi Informasi Publik",
    ctaHref: "#kategori-informasi",
    bgGradient: "from-[#07213a] via-[#0c3156] to-[#0e4477]",
  },
  {
    tag: "Integritas & Akuntabilitas",
    title: "Melayani dengan Profesional dan Terpercaya",
    desc: "Komitmen kami dalam memberikan layanan informasi klimatologi yang akurat, cepat, dan akuntabel bagi seluruh pemangku kepentingan.",
    ctaText: "Baca Maklumat Pelayanan",
    ctaHref: "#maklumat-pelayanan",
    bgGradient: "from-[#0a233f] via-[#10375c] to-[#1c558c]",
  },
];

export default function PelayananPublikPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS */}
      <div className="bg-slate-50 border-b border-slate-200 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-blue-600">
            Beranda
          </Link>
          <span>›</span>
          <span className="text-slate-800 font-semibold">PPID</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-grow w-full space-y-10 sm:space-y-14">
        {/* 2. HERO CAROUSEL BANNER (Model Klimatgo) */}
        <div
          className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-md overflow-hidden bg-gradient-to-r ${HERO_SLIDES[currentSlide].bgGradient} transition-all duration-700`}
        >
          <div className="max-w-3xl relative z-10 space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-sky-300 uppercase tracking-widest border border-white/15">
              {HERO_SLIDES[currentSlide].tag}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm sm:leading-relaxed max-w-2xl">
              {HERO_SLIDES[currentSlide].desc}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href={HERO_SLIDES[currentSlide].ctaHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <span>{HERO_SLIDES[currentSlide].ctaText}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                href="/pelayanan-publik/profil"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all"
              >
                Profil PPID
              </Link>
            </div>
          </div>

          {/* Navigasi Titik & Panah Slider */}
          <div className="absolute bottom-5 right-6 sm:bottom-6 sm:right-8 flex items-center gap-2 z-10">
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
              className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 flex items-center justify-center text-white backdrop-blur-sm transition-colors"
              aria-label="Previous Slide"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <div className="flex gap-1.5 px-1">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${currentSlide === i ? "w-6 bg-sky-400" : "w-2 bg-white/40"
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 flex items-center justify-center text-white backdrop-blur-sm transition-colors"
              aria-label="Next Slide"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* 3. PINTASAN AKSES LAYANAN UTAMA (Permohonan, Lacak, Keberatan, Portal PTSP) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                Akses Cepat
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0b2847]">
                Layanan Informasi & Permohonan
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/pelayanan-publik/panduan-layanan/formulir"
              className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">edit_document</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  Permohonan Informasi
                </h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  Panduan dan pengajuan permohonan data dan info iklim secara online.
                </p>
              </div>
              <span className="text-[11px] font-bold text-blue-600 mt-4 inline-flex items-center gap-1">
                Buka Formulir <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </span>
            </Link>

            <Link
              href="/pelayanan-publik/panduan-layanan/lacak-status"
              className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">travel_explore</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  Lacak Status Dokumen
                </h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  Pantau proses verifikasi berkas dan nomor tiket permohonan Anda.
                </p>
              </div>
              <span className="text-[11px] font-bold text-blue-600 mt-4 inline-flex items-center gap-1">
                Lacak Tiket <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </span>
            </Link>

            <a
              href="https://www.lapor.go.id"
              target="_blank"
              rel="noreferrer"
              className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">gavel</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors flex items-center gap-1">
                  Pengajuan Pengaduan
                  <span className="material-symbols-outlined text-[13px] text-slate-400">open_in_new</span>
                </h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  Kanal resmi SP4N LAPOR! untuk menyampaikan pengaduan atau keberatan publik.
                </p>
              </div>
              <span className="text-[11px] font-bold text-blue-600 mt-4 inline-flex items-center gap-1">
                Lapor Online <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </span>
            </a>

            <a
              href="https://ptsp.bmkg.go.id"
              target="_blank"
              rel="noreferrer"
              className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">hub</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors flex items-center gap-1">
                  PTSP BMKG Pusat
                  <span className="material-symbols-outlined text-[13px] text-slate-400">open_in_new</span>
                </h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  Portal Pelayanan Terpadu Satu Pintu untuk layanan meteorologi, klimatologi, dan geofisika.
                </p>
              </div>
              <span className="text-[11px] font-bold text-blue-600 mt-4 inline-flex items-center gap-1">
                Kunjungi PTSP <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </span>
            </a>
          </div>
        </section>

        {/* 4. KLASIFIKASI INFORMASI PUBLIK (Mirip Segmen Klimatgo) */}
        <section id="kategori-informasi" className="space-y-4">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
              Keterbukaan Informasi
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0b2847]">
              Klasifikasi Informasi Publik
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pilih kelompok klasifikasi informasi untuk mengakses dokumen resmi Staklim Jatim dan BMKG.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </div>
                <h3 className="text-base font-extrabold text-[#0b2847]">
                  Informasi Secara Berkala
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Informasi yang wajib diperbarui dan diumumkan secara rutin kepada publik seperti laporan kinerja, anggaran, dan buletin iklim.
                </p>
              </div>
              <Link
                href="/pelayanan-publik/informasi-publik/berkala"
                className="mt-6 inline-flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-800 pt-3 border-t border-slate-100"
              >
                <span>Lihat Dokumen Berkala</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100/70 text-sky-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </div>
                <h3 className="text-base font-extrabold text-[#0b2847]">
                  Informasi Setiap Saat
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Informasi yang wajib disediakan dan siap diberikan setiap kali terdapat permohonan dari masyarakat sesuai ketentuan.
                </p>
              </div>
              <Link
                href="/pelayanan-publik/informasi-publik/setiap-saat"
                className="mt-6 inline-flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-800 pt-3 border-t border-slate-100"
              >
                <span>Lihat Dokumen Tersedia</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                </div>
                <h3 className="text-base font-extrabold text-[#0b2847]">
                  Informasi Serta Merta
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Informasi yang dapat mengancam hajat hidup orang banyak dan ketertiban umum seperti peringatan dini cuaca dan iklim ekstrem.
                </p>
              </div>
              <Link
                href="/pelayanan-publik/informasi-publik/serta-merta"
                className="mt-6 inline-flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-800 pt-3 border-t border-slate-100"
              >
                <span>Lihat Peringatan Dini</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 5. TENTANG PPID & MAKLUMAT PELAYANAN */}
        <section id="maklumat-pelayanan" className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </div>
                <h3 className="text-sm font-extrabold text-[#0b2847] uppercase tracking-wide">
                  Tentang PPID
                </h3>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed text-justify">
                PPID Stasiun Klimatologi Jawa Timur bertugas mewujudkan tata kelola keterbukaan informasi publik yang transparan, efektif, efisien, dan dapat dipertanggungjawabkan di lingkungan BMKG Jawa Timur.
              </p>
            </div>
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <Link
                href="/pelayanan-publik/profil"
                className="text-xs font-bold text-blue-700 hover:underline flex items-center justify-between"
              >
                <span>Profil & Surat Keputusan PPID</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </Link>
              <Link
                href="/pelayanan-publik/profil/visi-misi-tusi"
                className="text-xs font-bold text-blue-700 hover:underline flex items-center justify-between"
              >
                <span>Visi, Misi, Tugas & Fungsi</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-70 pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Maklumat Pelayanan
              </div>
              <blockquote className="text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed max-w-2xl mx-auto space-y-2">
                <p>
                  &ldquo;Dengan ini, kami Stasiun Klimatologi Jawa Timur menyatakan sanggup menyelenggarakan pelayanan informasi klimatologi secara profesional, akurat, cepat, transparan, dan berintegritas, sesuai dengan standar pelayanan yang telah ditetapkan.&rdquo;
                </p>
                <p>
                  &ldquo;Kami berkomitmen untuk senantiasa berfokus pada kebutuhan dan harapan pelanggan, serta memastikan kepuasan pelanggan dipertahankan dan ditingkatkan secara berkelanjutan melalui penerapan dan perbaikan berkesinambungan.&rdquo;
                </p>
                <p>
                  &ldquo;Apabila kami tidak menepati janji ini, kami siap menerima sanksi sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.&rdquo;
                </p>
              </blockquote>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 relative z-10">
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                Kepala Stasiun Klimatologi Kelas I Jawa Timur
              </p>
            </div>
          </div>
        </section>

        {/* 6. KATALOG LENGKAP MENU & DOKUMEN PPID */}
        <section className="space-y-4">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
              Direktori Menu
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0b2847]">
              Seluruh Kategori Layanan & Dokumen
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PPID_MENUS.map((category) => (
              <div
                key={category.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">
                        {category.icon}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-[#0b2847]">
                      {category.title}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {category.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noreferrer" : undefined}
                          className="group flex flex-col"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                            <span>{item.label}</span>
                            <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all">
                              {item.external ? "open_in_new" : "chevron_right"}
                            </span>
                          </div>
                          {item.desc && (
                            <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {item.desc}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}