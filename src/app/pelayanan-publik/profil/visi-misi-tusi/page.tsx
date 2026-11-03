import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visi, Misi, Tugas dan Fungsi - PPID BMKG Stasiun Klimatologi Jawa Timur",
  description:
    "Visi, Misi, Tugas dan Fungsi Pejabat Pengelola Informasi dan Dokumentasi BMKG",
};

export default function VisiMisiTusiPage() {
  return (
    <main className="min-h-screen bg-slate-50 w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-4 pb-16 lg:pt-8 lg:pb-24 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/30"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            Visi, Misi,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Tugas dan Fungsi
            </span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Arah kebijakan dan peran strategis PPID BMKG dalam mewujudkan
            pelayanan informasi publik yang akuntabel
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 pb-24 relative z-20">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {/* 1. Visi */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white shadow-lg">
                <span className="material-symbols-outlined text-[28px]">
                  visibility
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  01
                </p>
                <h2 className="text-xl font-bold text-slate-800">
                  Visi PPID BMKG
                </h2>
              </div>
            </div>

            <blockquote className="border-l-4 border-blue-500 pl-6 py-3 bg-blue-50/50 rounded-r-xl">
              <p className="text-lg font-semibold text-slate-800 italic leading-relaxed">
                &ldquo;Terwujudnya Pelayanan Informasi yang Akuntabel.&rdquo;
              </p>
            </blockquote>
          </div>

          {/* 2. Misi */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg">
                <span className="material-symbols-outlined text-[28px]">
                  flag
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  02
                </p>
                <h2 className="text-xl font-bold text-slate-800">
                  Misi PPID BMKG
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-emerald-50/50 rounded-xl p-5">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold shrink-0">
                  1
                </span>
                <p className="text-slate-700 leading-relaxed text-[15px]">
                  Meningkatkan layanan informasi yang cepat, tepat dan akurat.
                </p>
              </div>
              <div className="flex items-start gap-4 bg-emerald-50/50 rounded-xl p-5">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold shrink-0">
                  2
                </span>
                <p className="text-slate-700 leading-relaxed text-[15px]">
                  Meningkatkan kompetensi SDM pelayanan Informasi.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Tugas dan Fungsi */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
                <span className="material-symbols-outlined text-[28px]">
                  work
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  03
                </p>
                <h2 className="text-xl font-bold text-slate-800">
                  Tugas dan Fungsi BMKG
                </h2>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-[15px] mb-6">
              Informasi lengkap mengenai Tugas dan Fungsi BMKG tersedia pada
              portal resmi PPID BMKG. Klik tombol di bawah untuk membuka
              halaman resmi.
            </p>

            <a
              href="https://ppid.bmkg.go.id/tugas-fungsi"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[20px]">
                open_in_new
              </span>
              Lihat Tugas dan Fungsi BMKG
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
