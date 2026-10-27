import { ClimatePublicationViewer } from "@/components/climate/ClimatePublicationViewer";

export default function DurasiMusimPage() {
  return (
    <>
<main className="min-h-screen bg-slate-50 pt-4 pb-12 w-full">
      <ClimatePublicationViewer 
        tableName="iklim_durasi_musim" 
        title="Prediksi Durasi Musim" 
        description="Prakiraan lamanya durasi musim yang akan berlangsung."
      />
    </main>
</>
  );
}
