import { ClimatePublicationViewer } from "@/components/climate/ClimatePublicationViewer";

export default function AnalisisHujanBulananPage() {
  return (
    <>
<main className="min-h-screen bg-slate-50 pt-24 pb-12 w-full">
      <ClimatePublicationViewer 
        tableName="iklim_analisis_hujan_bulanan" 
        title="Analisis Hujan Bulanan" 
        description="Analisis akumulasi dan evaluasi curah hujan yang terjadi pada bulan-bulan sebelumnya."
      />
    </main>
</>
  );
}
