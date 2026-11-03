import { Metadata } from "next";
import { PengaduanChannels } from "@/components/pelayanan/PengaduanChannels";

export const metadata: Metadata = {
  title: "Pengaduan & Survei - BMKG Klimatologi Jawa Timur",
  description: "Kanal resmi pengaduan, saran, survei kepuasan, dan pelaporan pelanggaran BMKG Klimatologi Jawa Timur.",
};

export default function PengaduanPage() {
  return (
    <>
<main className="min-h-screen bg-slate-50 w-full overflow-hidden">

        {/* Hero Section */}
        <section className="relative pt-4 pb-16 lg:pt-8 lg:pb-24 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-white to-red-50/30"></div>
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/50 border border-rose-200 text-rose-700 text-xs font-bold mb-6">
              <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
              <span>Suara Anda Penting Bagi Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Pengaduan, Saran <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-red-500">&amp; Survei</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Kami membuka berbagai kanal resmi untuk menampung aspirasi, pengaduan, dan penilaian Anda demi perbaikan berkelanjutan.
            </p>
          </div>
        </section>

        {/* Channels Grid - Now uses dynamic links from admin */}
        <section className="py-12 pb-24 relative z-20">
          <div className="max-w-5xl mx-auto px-6">
            <PengaduanChannels />
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <span className="material-symbols-outlined text-4xl text-rose-400 mb-4">support_agent</span>
            <h2 className="text-3xl font-black text-white mb-4">Butuh Bantuan Langsung?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Hubungi kami melalui email <strong className="text-white">staklim.karangploso@bmkg.go.id</strong> atau kunjungi kantor kami di Jl. Raya Ngijo No. 25, Karangploso, Malang.
            </p>
            <a
              href="mailto:staklim.karangploso@bmkg.go.id"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">mail</span>
              Kirim Email
            </a>
          </div>
        </section>

      </main></>
  );
}
