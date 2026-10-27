import { ClimatePublicationViewer } from "@/components/climate/ClimatePublicationViewer";

export default function SifatHujanPage() {
  return (
    <>
<main className="min-h-screen bg-slate-50 pt-4 pb-12 w-full">
      <ClimatePublicationViewer 
        tableName="iklim_sifat_hujan" 
        title="Prediksi Sifat Hujan Bulanan" 
        description="Prakiraan sifat hujan secara bulanan untuk periode ke depan."
      />
    </main>
</>
  );
}
