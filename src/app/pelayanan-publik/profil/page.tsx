import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil PPID - BMKG Stasiun Klimatologi Jawa Timur",
  description:
    "Profil Pejabat Pengelola Informasi dan Dokumentasi (PPID) Stasiun Klimatologi Kelas I Jawa Timur",
};

export default function ProfilPage() {
  return (
    <main className="min-h-screen bg-slate-50 w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-4 pb-16 lg:pt-8 lg:pb-24 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            Profil{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              PPID
            </span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Pejabat Pengelola Informasi dan Dokumentasi Stasiun Klimatologi
            Kelas I Jawa Timur
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 pb-24 relative z-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-8">
            {/* Intro Icon */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white shadow-lg">
                <span className="material-symbols-outlined text-[28px]">
                  account_balance
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Dasar Hukum & Penunjukan PPID
                </h2>
                <p className="text-sm text-slate-500">
                  Landasan regulasi keterbukaan informasi publik
                </p>
              </div>
            </div>

            {/* Paragraphs */}
            <p className="text-slate-700 leading-relaxed text-[15px] text-justify">
              Dalam rangka memberikan informasi publik sebagaimana diamanatkan
              dalam Peraturan Pemerintah Nomor 61 tahun 2010 tentang Pelaksanaan
              Undang-Undang Nomor 14 tahun 2008 tentang Keterbukaan Informasi
              Publik serta Peraturan Komisi Informasi Republik Indonesia Nomor 1
              Tahun 2021, Kepala Badan Meteorologi, Klimatologi, dan Geofisika
              menetapkan Pejabat Pengelola Informasi dan Dokumetasi (PPID)
              melalui Surat Keputusan Nomor KEP.21/KB/I/2026 Tentang Organisasi
              Pengelola Informasi dan Dokumentasi Badan Meteorologi,
              Klimatologi, dan Geofisika.
            </p>

            <p className="text-slate-700 leading-relaxed text-[15px] text-justify">
              Dalam rangka memperkuat komitmen dan meningkatkan kualitas
              pelayanan informasi publik yang menjangkau masyarakat secara cepat
              dan luas, Kepala Stasiun Klimatologi Jawa Timur menetapkan Tim
              Pejabat Pengelola Informasi dan Dokumentasi, Website dan Media
              Sosial melalui Surat Keputusan Nomor
              e.T/KEP.009d/KJTM/III/2026 Perubahan Atas Keputusan Kepala
              Stasiun Klimatologi Jawa Timur Nomor KEP.008/KJTM/II/2026 Tentang
              Pembentukan Tim Pejabat Pengelola Informasi dan Dokumentasi,
              Website dan Media Sosial Stasiun Klimatologi Jawa Timur.
            </p>

            <p className="text-slate-700 leading-relaxed text-[15px] text-justify">
              Stasiun Klimatologi Jawa Timur dalam menjalankan keterbukaan
              informasi publik sebagai tugas PPID dilakukan secara terpusat
              sesuai arahan dan petunjuk teknis Induk Organisasi yaitu BMKG
              Pusat.
            </p>

            {/* Quick Links */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                Halaman Terkait
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/pelayanan-publik/profil/visi-misi-tusi"
                  className="group inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    flag
                  </span>
                  Visi, Misi, Tugas dan Fungsi
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </Link>
                <a
                  href="https://ppid.bmkg.go.id/struktur-organisasi"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    account_tree
                  </span>
                  Struktur Organisasi PPID
                  <span className="material-symbols-outlined text-[16px]">
                    open_in_new
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
