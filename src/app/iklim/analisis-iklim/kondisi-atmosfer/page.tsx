import { ClimatePublicationViewer } from "@/components/climate/ClimatePublicationViewer";

export default function KondisiAtmosferPage() {
  return (
    <>
<main className="min-h-screen bg-slate-50 pt-4 pb-12 w-full">
      <ClimatePublicationViewer 
        tableName="iklim_kondisi_atmosfer" 
        title="Kondisi Atmosfer" 
        description="Analisis dan pantauan kondisi atmosfer global dan regional terkini."
      />
    </main>
</>
  );
}
