"use client";

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
    title: "Profil",
    icon: "badge",
    items: [
      {
        label: "Profil PPID",
        href: "/pelayanan-publik/profil/profil-ppid",
        desc: "Gambaran umum PPID Stasiun Klimatologi Jawa Timur",
      },
      {
        label: "Tugas dan Fungsi",
        href: "/pelayanan-publik/profil/tugas-dan-fungsi",
        desc: "Tupoksi pengelola informasi dan dokumentasi",
      },
      {
        label: "Struktur Pengelola",
        href: "/pelayanan-publik/profil/struktur-pengelola",
        desc: "Bagan susunan tim kerja dan pengelola PPID",
      },
    ],
  },
  {
    title: "Informasi Layanan",
    icon: "info",
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

export default function PelayananPublikPage() {

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      {/* ═══════════════════════════════════════════════════ */}
      {/* 3. BREADCRUMBS                                      */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="bg-slate-50 border-b border-slate-200 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-blue-600">
            Beranda
          </Link>
          <span>›</span>
          <span className="text-slate-800 font-semibold">PPID</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 4. ISI UTAMA HALAMAN PPID                           */}
      {/* ═══════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full space-y-10">

        {/* Banner Selamat Datang Sederhana */}
        <div className="bg-[#0b2847] text-white rounded-2xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-bold text-sky-300 uppercase tracking-widest block mb-2">
              Layanan Informasi & Dokumentasi Publik
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">
              Keterbukaan Informasi Publik BMKG Jawa Timur
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Selamat datang di portal resmi PPID Stasiun Klimatologi Jawa Timur. Portal ini disediakan untuk mempermudah masyarakat dalam memperoleh informasi iklim, dokumen transparansi kinerja pemerintah, standar pelayanan operasional, serta penyampaian pengaduan masyarakat.
            </p>
          </div>
        </div>

        {/* Kotak Menu Layanan Utama (5 Kategori) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PPID_MENUS.map((category) => (
            <div
              key={category.title}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all"
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

        {/* Maklumat Pelayanan */}
        <div className="border border-slate-200 rounded-xl p-6 sm:p-8 bg-white text-center max-w-4xl mx-auto shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-extrabold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Maklumat Pelayanan
          </div>
          <blockquote className="text-sm sm:text-base text-slate-700 italic font-medium leading-relaxed max-w-2xl mx-auto">
            &ldquo;Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai ketentuan peraturan perundang-undangan yang berlaku.&rdquo;
          </blockquote>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-3">
            Kepala Stasiun Klimatologi Kelas I Jawa Timur
          </p>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 5. FOOTER RESMI SITUS                               */}
      {/* ═══════════════════════════════════════════════════ */}

    </div>
  );
}