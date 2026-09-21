import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import { supabaseUploadFile } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast-provider";
import { useConfirm } from "@/components/ui/confirm-provider";
import { CustomSelect } from "@/components/ui/CustomSelect";

const CATEGORY_OPTIONS = [
  { value: "dasarian", label: "Prakiraan Curah Hujan Dasarian" },
  { value: "bulanan_1", label: "Prakiraan Curah Hujan 1 Bulan ke Depan" },
  { value: "bulanan_3", label: "Prakiraan Curah Hujan 3 Bulan ke Depan" },
  { value: "bulanan_6", label: "Prakiraan Curah Hujan 6 Bulan ke Depan" },
];

export function RainfallTab() {
  const confirm = useConfirm();
  const { success, error } = useToast();
  const { items: rainfallForecasts, isLoading, load, add, remove } = useCrud<any>("rainfall_forecasts", "rainfall-data");
  
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [newRainfall, setNewRainfall] = useState<{
    year: number;
    month: string;
    category: string;
    label: string;
    uploadMode: "shp" | "json";
    fileShp: File | null;
    fileDbf: File | null;
    fileJson: File | null;
  }>({ 
    year: new Date().getFullYear(), 
    month: "01", 
    category: "dasarian", 
    label: "",
    uploadMode: "shp",
    fileShp: null,
    fileDbf: null,
    fileJson: null
  });
  
  const [isUploadingRainfall, setIsUploadingRainfall] = useState(false);

  useEffect(() => {
    // Hanya tampilkan kategori prakiraan curah hujan, bukan awal musim
    load("category=in.(dasarian,bulanan_1,bulanan_3,bulanan_6)&order=year.desc,month.desc,created_at.desc");
  }, [load]);

  const getCategoryLabel = (catVal: string) => {
    const found = CATEGORY_OPTIONS.find(c => c.value === catVal);
    return found ? found.label : catVal;
  };

  const filteredForecasts = rainfallForecasts.filter(r => {
    if (filterCategory === "all") return true;
    return r.category === filterCategory;
  });

  const handleAddRainfall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRainfall.uploadMode === 'shp' && (!newRainfall.fileShp || !newRainfall.fileDbf)) {
      error("Harap pilih file .shp DAN .dbf secara bersamaan!");
      return;
    }
    if (newRainfall.uploadMode === 'json' && !newRainfall.fileJson) {
      error("Harap pilih file .json!");
      return;
    }
    setIsUploadingRainfall(true);

    try {
      let finalFileName = `prakiraan/${Date.now()}-${Math.random().toString(36).substring(7)}.json`;
      let fileToUpload: File;

      if (newRainfall.uploadMode === 'shp') {
        const shapefile = await import('shapefile');
        const shpBytes = await newRainfall.fileShp!.arrayBuffer();
        const dbfBytes = await newRainfall.fileDbf!.arrayBuffer();
        
        const geojson = await shapefile.read(shpBytes, dbfBytes);
        
        const geojsonStr = JSON.stringify(geojson);
        fileToUpload = new File([geojsonStr], 'converted.json', { type: 'application/json' });
      } else {
        fileToUpload = newRainfall.fileJson!;
      }

      const uploadedUrl = await supabaseUploadFile("rainfall-data", finalFileName, fileToUpload);
      if (!uploadedUrl) throw new Error("Gagal mengupload file ke Storage");

      const successAdd = await add({
        category: newRainfall.category,
        year: newRainfall.year,
        month: newRainfall.month,
        label: newRainfall.label,
        file_path: uploadedUrl
      }, "Data Peta Prakiraan Curah Hujan berhasil ditambahkan!");

      if (successAdd) {
        setNewRainfall({ category: "dasarian", year: new Date().getFullYear(), month: "01", label: "", uploadMode: "shp", fileShp: null, fileDbf: null, fileJson: null });
        load("order=year.desc,month.desc,created_at.desc");
      }
    } catch (err: any) {
      error(err.message || "Terjadi kesalahan saat memproses data.");
    } finally {
      setIsUploadingRainfall(false);
    }
  };

  const handleDeleteRainfall = async (id: number, filePath: string) => {
    if (await confirm("Yakin ingin menghapus data ini? File GeoJSON di storage juga akan dihapus.")) {
      remove(id, filePath, "Data dihapus");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Upload */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col h-fit sticky top-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Upload Peta Prakiraan Curah Hujan
            </h3>
          </div>
          <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[18px] shrink-0 mt-0.5">info</span>
            <p className="text-xs text-blue-800 font-medium">Halaman ini khusus untuk upload peta <strong>Prakiraan Curah Hujan</strong> (Dasarian, 1 Bulan, 3 Bulan, 6 Bulan). Untuk upload <strong>Prediksi Awal Musim</strong>, gunakan menu &quot;Prediksi Awal Musim&quot; di sidebar.</p>
          </div>
          <form onSubmit={handleAddRainfall} className="flex flex-col gap-4 flex-1">
            <div className="pt-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Metode Upload</label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={newRainfall.uploadMode === 'shp'} onChange={() => setNewRainfall({...newRainfall, uploadMode: 'shp'})} className="accent-primary" />
                  <span className="text-sm font-medium">SHP & DBF (Konversi Otomatis)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={newRainfall.uploadMode === 'json'} onChange={() => setNewRainfall({...newRainfall, uploadMode: 'json'})} className="accent-primary" />
                  <span className="text-sm font-medium">File GeoJSON (.json)</span>
                </label>
              </div>

              {newRainfall.uploadMode === 'shp' ? (
                <div className="grid grid-cols-1 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                      <span>File .SHP (Geometri)</span>
                      {newRainfall.fileShp && <span className="text-emerald-500 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Terpilih</span>}
                    </label>
                    <label className={`flex items-center justify-between w-full border ${newRainfall.fileShp ? 'border-primary/50 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50'} rounded-xl px-4 py-3 cursor-pointer transition-all group`}>
                      <div className="flex items-center gap-3 truncate">
                        <span className="material-symbols-outlined text-primary/70">upload_file</span>
                        <span className={`text-sm truncate font-medium ${newRainfall.fileShp ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          {newRainfall.fileShp ? newRainfall.fileShp.name : "Pilih file .shp..."}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        accept=".shp" 
                        className="hidden"
                        onChange={e => setNewRainfall({...newRainfall, fileShp: e.target.files?.[0] || null})} 
                      />
                      <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors shrink-0">Browse</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                      <span>File .DBF (Atribut)</span>
                      {newRainfall.fileDbf && <span className="text-emerald-500 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Terpilih</span>}
                    </label>
                    <label className={`flex items-center justify-between w-full border ${newRainfall.fileDbf ? 'border-primary/50 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50'} rounded-xl px-4 py-3 cursor-pointer transition-all group`}>
                      <div className="flex items-center gap-3 truncate">
                        <span className="material-symbols-outlined text-primary/70">upload_file</span>
                        <span className={`text-sm truncate font-medium ${newRainfall.fileDbf ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          {newRainfall.fileDbf ? newRainfall.fileDbf.name : "Pilih file .dbf..."}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        accept=".dbf" 
                        className="hidden"
                        onChange={e => setNewRainfall({...newRainfall, fileDbf: e.target.files?.[0] || null})} 
                      />
                      <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors shrink-0">Browse</span>
                    </label>
                  </div>
                  <div className="col-span-full mt-1">
                    <p className="text-xs text-slate-500 flex items-start gap-1.5 bg-white p-3 rounded-xl border border-slate-100">
                      <span className="material-symbols-outlined text-[16px] text-amber-500 shrink-0">info</span>
                      File akan diekstrak dan dikonversi secara aman di browser sebelum disimpan. Pastikan kedua file valid.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                    <span>File GeoJSON (.json)</span>
                    {newRainfall.fileJson && <span className="text-emerald-500 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Terpilih</span>}
                  </label>
                  <label className={`flex items-center justify-between w-full border ${newRainfall.fileJson ? 'border-primary/50 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50'} rounded-xl px-4 py-3 cursor-pointer transition-all group`}>
                    <div className="flex items-center gap-3 truncate">
                      <span className="material-symbols-outlined text-primary/70">data_object</span>
                      <span className={`text-sm truncate font-medium ${newRainfall.fileJson ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {newRainfall.fileJson ? newRainfall.fileJson.name : "Pilih file .json..."}
                      </span>
                    </div>
                    <input 
                      type="file" 
                      accept=".json,application/json" 
                      className="hidden"
                      onChange={e => setNewRainfall({...newRainfall, fileJson: e.target.files?.[0] || null})} 
                    />
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors shrink-0">Browse</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-3 flex items-start gap-1.5 bg-white p-3 rounded-xl border border-slate-100">
                    <span className="material-symbols-outlined text-[16px] text-blue-500 shrink-0">info</span>
                    Upload file GeoJSON yang sebelumnya sudah Anda konversi (seperti analisis_xxx.json).
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori Waktu Prakiraan</label>
              <CustomSelect
                required
                value={newRainfall.category}
                onChange={(val) => setNewRainfall({...newRainfall, category: val})}
                options={CATEGORY_OPTIONS}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tahun</label>
                <input 
                  required 
                  type="number" 
                  min="2000" 
                  max="2100"
                  value={newRainfall.year} 
                  onChange={e => setNewRainfall({...newRainfall, year: parseInt(e.target.value) || new Date().getFullYear()})} 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bulan / Periode</label>
                <CustomSelect
                  required
                  value={newRainfall.month}
                  onChange={(val) => setNewRainfall({...newRainfall, month: val})}
                  options={Array.from({length: 12}, (_, i) => i + 1).map(m => {
                    const monthStr = m.toString().padStart(2, '0');
                    const monthName = new Date(2000, m - 1, 1).toLocaleString('id-ID', { month: 'long' });
                    return { value: monthStr, label: monthName };
                  })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Label Periode (opsional)</label>
              <input 
                type="text" 
                value={newRainfall.label} 
                onChange={e => setNewRainfall({...newRainfall, label: e.target.value})} 
                placeholder="Contoh: Awal Musim Kemarau 2026, Dasarian I, dst."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300" 
              />
            </div>

            <div className="pt-4 mt-auto">
              <button 
                type="submit" 
                disabled={isUploadingRainfall}
                className={`w-full text-white shadow-md shadow-primary/20 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isUploadingRainfall ? 'bg-primary/70 cursor-wait' : 'bg-gradient-to-r from-primary to-blue-600 hover:scale-[1.02] active:scale-95'}`}
              >
                {isUploadingRainfall ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                    <span>Upload Data Peta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Data Peta */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">map</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Daftar Data Peta ({filteredForecasts.length})</h3>
            </div>
            
            {/* Filter Kategori List */}
            <div className="w-full sm:w-64">
              <CustomSelect
                value={filterCategory}
                onChange={(val) => setFilterCategory(val)}
                options={[
                  { value: "all", label: "Semua Kategori Peta" },
                  ...CATEGORY_OPTIONS
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredForecasts.map(r => (
              <div key={r.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3 relative group overflow-hidden">
                <div className="flex justify-between items-start relative z-10 gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 inline-block mb-2">
                      {getCategoryLabel(r.category)}
                    </span>
                    <h4 className="font-bold text-slate-800 text-[15px] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_month</span>
                      {new Date(r.year, parseInt(r.month)-1, 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                    </h4>
                    {r.label && <p className="text-xs text-slate-500 font-bold mt-1 bg-white inline-block px-2 py-0.5 rounded border border-slate-100">{r.label}</p>}
                  </div>
                  <button 
                    onClick={() => handleDeleteRainfall(r.id, r.file_path)} 
                    className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0"
                    title="Hapus Data"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
                <div className="mt-auto text-[10px] text-slate-500 font-mono bg-white p-2.5 rounded-xl border border-slate-200 line-clamp-1 relative z-10 flex items-center gap-2" title={r.file_path}>
                  <span className="material-symbols-outlined text-[14px] text-primary">data_object</span>
                  <span className="truncate">{r.file_path?.split('/').pop()}</span>
                </div>
              </div>
            ))}
            {filteredForecasts.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                <span className="material-symbols-outlined text-4xl mb-2">map</span>
                <p className="text-sm font-medium">Belum ada data peta untuk kategori ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
