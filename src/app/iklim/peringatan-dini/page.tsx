import { ClimatePublicationViewer } from "@/components/climate/ClimatePublicationViewer";

export default function PeringatanDiniPage() {
  return (
    <>
<main className="min-h-screen bg-slate-50 pt-4 pb-12 w-full">
      <ClimatePublicationViewer 
        tableName="iklim_peringatan_dini" 
        title="Peringatan Dini Cuaca dan Iklim" 
        description="Informasi peringatan dini mengenai kondisi cuaca dan iklim ekstrem."
      />
    </main>
</>
  );
}
