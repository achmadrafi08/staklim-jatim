import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import { supabaseUploadFile } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast-provider";
import { useConfirm } from "@/components/ui/confirm-provider";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { getBMKGSeasonColor } from "@/lib/seasonColors";

const SEASON_TYPE_OPTIONS = [
  { value: "awal_musim_hujan", label: "Prediksi Awal Musim Hujan" },
  { value: "awal_musim_kemarau", label: "Prediksi Awal Musim Kemarau" },
];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const m = i + 1;
  const monthStr = m.toString().padStart(2, "0");
  const monthName = new Date(2000, m - 1, 1).toLocaleString("id-ID", { month: "long" });
  return { value: monthStr, label: monthName };
});

export function SeasonTab() {
  const confirm = useConfirm();
  const { success, error } = useToast();
  const { items: seasonForecasts, isLoading, load, add, remove } = useCrud<any>(
    "rainfall_forecasts",
    "rainfall-data"
  );

  const [filterType, setFilterType] = useState<string>("all");
  const [newSeason, setNewSeason] = useState<{
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
    category: "awal_musim_hujan",
    label: "",
    uploadMode: "shp",
    fileShp: null,
    fileDbf: null,
    fileJson: null,
  });

  const [isUploading, setIsUploading] = useState(false);

  const SEASON_QUERY = "or=(category.eq.awal_musim_hujan,category.eq.awal_musim_kemarau,category.eq.awal_musim)&order=year.desc,month.desc,created_at.desc";

  useEffect(() => {
    load(SEASON_QUERY);
  }, [load]);

  const getCategoryLabel = (catVal: string) => {
    if (catVal === "awal_musim") return "Awal Musim (Legacy)";
    const found = SEASON_TYPE_OPTIONS.find((c) => c.value === catVal);
    return found ? found.label : catVal;
  };

  const filteredSeasons = seasonForecasts.filter((r) => {
    if (filterType === "all") return true;
    return r.category === filterType;
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSeason.uploadMode === "shp" && (!newSeason.fileShp || !newSeason.fileDbf)) {
      error("Harap pilih file .shp DAN .dbf secara bersamaan!");
      return;
    }
    if (newSeason.uploadMode === "json" && !newSeason.fileJson) {
      error("Harap pilih file GeoJSON (.json)!");
      return;
    }
    setIsUploading(true);
    try {
      const finalFileName = `prakiraan/season-${Date.now()}-${Math.random().toString(36).substring(7)}.json`;
      let geojson: any;

      if (newSeason.uploadMode === "shp") {
        const shapefile = await import("shapefile");
        const shpBytes = await newSeason.fileShp!.arrayBuffer();
        const dbfBytes = await newSeason.fileDbf!.arrayBuffer();
        geojson = await shapefile.read(shpBytes, dbfBytes);
      } else {
        const text = await newSeason.fileJson!.text();
        geojson = JSON.parse(text);
      }

      // Terapkan warna otomatis dari library BMKG permanen berdasarkan nilai PMK / PMH / AWAL_MUSIM & kategori
      if (geojson && geojson.features) {
        geojson.features.forEach((f: any) => {
          const p = f.properties || {};
          const val = p.PMK || p.pmk || p.PMH || p.pmh || p.AWAL_MUSIM || p.awal_musim || p.AM || p.am || p.PERIODE || p.periode || p.ZOM;
          const bmkgColor = getBMKGSeasonColor(val, newSeason.category);
          f.properties = { ...p, fill_color: bmkgColor };
        });
      }

      const fileToUpload = new File([JSON.stringify(geojson)], "converted.json", {
        type: "application/json",
      });

      const uploadedUrl = await supabaseUploadFile("rainfall-data", finalFileName, fileToUpload);
      if (!uploadedUrl) throw new Error("Gagal mengupload file ke Storage");

      const successAdd = await add(
        {
          category: newSeason.category,
          year: newSeason.year,
          month: newSeason.month,
          label: newSeason.label,
          file_path: uploadedUrl,
        },
        "Data Peta Prediksi Awal Musim berhasil ditambahkan!"
      );

      if (successAdd) {
        setNewSeason({
          category: "awal_musim_hujan",
          year: new Date().getFullYear(),
          month: "01",
          label: "",
          uploadMode: "shp",
          fileShp: null,
          fileDbf: null,
          fileJson: null,
        });
        load(SEASON_QUERY);
      }
    } catch (err: any) {
      error(err.message || "Terjadi kesalahan saat memproses data.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number, filePath: string) => {
    if (await confirm("Yakin ingin menghapus data ini? File GeoJSON di storage juga akan dihapus.")) {
      remove(id, filePath, "Data dihapus");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Upload */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col h-fit sticky top-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Upload Peta Awal Musim</h3>
          </div>

          {/* Info Box */}
          <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-green-600 text-[20px] shrink-0 mt-0.5">info</span>
            <div className="text-xs text-green-800 space-y-1">
              <p className="font-semibold">
                Upload Data Prediksi Awal Musim Hujan & Kemarau
              </p>
              <p className="text-[11px] text-green-700 leading-relaxed">
                • Kolom atribut DBF yang dibaca: <strong>NO_ZOM_NAS</strong> (Nomor ZOM), <strong>NAMA_ZOM</strong> (Nama Zona), dan <strong>PMK</strong> / <strong>PMH</strong> / <strong>AWAL_MUSIM</strong> (Periode Awal Musim).<br/>
                • <strong>Pewarnaan Otomatis:</strong> Sistem menggunakan <em>Library Resmi Warna BMKG (AMH & AMK)</em> permanen untuk mewarnai setiap kategori dasarian secara otomatis.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="flex flex-col gap-4 flex-1">
            {/* Metode Upload */}
            <div className="pt-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Metode Upload</label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={newSeason.uploadMode === "shp"}
                    onChange={() => setNewSeason({ ...newSeason, uploadMode: "shp" })}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium">SHP & DBF</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={newSeason.uploadMode === "json"}
                    onChange={() => setNewSeason({ ...newSeason, uploadMode: "json" })}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium">GeoJSON (.json)</span>
                </label>
              </div>

              {newSeason.uploadMode === "shp" ? (
                <div className="grid grid-cols-1 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {/* SHP */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                      <span>File .SHP (Geometri)</span>
                      {newSeason.fileShp && (
                        <span className="text-emerald-500 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Terpilih</span>
                      )}
                    </label>
                    <label
                      className={`flex items-center justify-between w-full border ${
                        newSeason.fileShp
                          ? "border-primary/50 bg-blue-50/50"
                          : "border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50"
                      } rounded-xl px-4 py-3 cursor-pointer transition-all group`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="material-symbols-outlined text-primary/70">upload_file</span>
                        <span className={`text-sm truncate font-medium ${
                          newSeason.fileShp ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                        }`}>
                          {newSeason.fileShp ? newSeason.fileShp.name : "Pilih file .shp..."}
                        </span>
                      </div>
                      <input type="file" accept=".shp" className="hidden"
                        onChange={(e) => setNewSeason({ ...newSeason, fileShp: e.target.files?.[0] || null })} />
                      <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors shrink-0">Browse</span>
                    </label>
                  </div>

                  {/* DBF */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                      <span>File .DBF (Atribut: NAMA_ZOM, PMK)</span>
                      {newSeason.fileDbf && (
                        <span className="text-emerald-500 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Terpilih</span>
                      )}
                    </label>
                    <label
                      className={`flex items-center justify-between w-full border ${
                        newSeason.fileDbf
                          ? "border-primary/50 bg-blue-50/50"
                          : "border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50"
                      } rounded-xl px-4 py-3 cursor-pointer transition-all group`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="material-symbols-outlined text-primary/70">upload_file</span>
                        <span className={`text-sm truncate font-medium ${
                          newSeason.fileDbf ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                        }`}>
                          {newSeason.fileDbf ? newSeason.fileDbf.name : "Pilih file .dbf..."}
                        </span>
                      </div>
                      <input type="file" accept=".dbf" className="hidden"
                        onChange={(e) => setNewSeason({ ...newSeason, fileDbf: e.target.files?.[0] || null })} />
                      <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors shrink-0">Browse</span>
                    </label>
                  </div>

                  <div className="col-span-full mt-1">
                    <p className="text-xs text-slate-500 flex items-start gap-1.5 bg-white p-3 rounded-xl border border-slate-100">
                      <span className="material-symbols-outlined text-[16px] text-amber-500 shrink-0">info</span>
                      File SHP & DBF akan dikonversi otomatis ke GeoJSON.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                    <span>File GeoJSON (.json)</span>
                    {newSeason.fileJson && (
                      <span className="text-emerald-500 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Terpilih</span>
                    )}
                  </label>
                  <label
                    className={`flex items-center justify-between w-full border ${
                      newSeason.fileJson
                        ? "border-primary/50 bg-blue-50/50"
                        : "border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50"
                    } rounded-xl px-4 py-3 cursor-pointer transition-all group`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="material-symbols-outlined text-primary/70">data_object</span>
                      <span className={`text-sm truncate font-medium ${
                        newSeason.fileJson ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                      }`}>
                        {newSeason.fileJson ? newSeason.fileJson.name : "Pilih file .json..."}
                      </span>
                    </div>
                    <input type="file" accept=".json,application/json" className="hidden"
                      onChange={(e) => setNewSeason({ ...newSeason, fileJson: e.target.files?.[0] || null })} />
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors shrink-0">Browse</span>
                  </label>
                </div>
              )}
            </div>

            {/* Jenis Musim */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jenis Prediksi Musim</label>
              <CustomSelect
                required
                value={newSeason.category}
                onChange={(val) => setNewSeason({ ...newSeason, category: val })}
                options={SEASON_TYPE_OPTIONS}
              />
            </div>

            {/* Tahun & Bulan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tahun</label>
                <input
                  required type="number" min="2000" max="2100"
                  value={newSeason.year}
                  onChange={(e) => setNewSeason({ ...newSeason, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bulan / Periode</label>
                <CustomSelect
                  required
                  value={newSeason.month}
                  onChange={(val) => setNewSeason({ ...newSeason, month: val })}
                  options={MONTH_OPTIONS}
                />
              </div>
            </div>

            {/* Label */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Label Periode (opsional)</label>
              <input
                type="text"
                value={newSeason.label}
                onChange={(e) => setNewSeason({ ...newSeason, label: e.target.value })}
                placeholder="Contoh: Awal Musim Hujan 2026/2027"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="pt-4 mt-auto">
              <button
                type="submit"
                disabled={isUploading}
                className={`w-full text-white shadow-md shadow-green-500/20 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isUploading
                    ? "bg-green-400 cursor-wait"
                    : "bg-gradient-to-r from-green-600 to-emerald-500 hover:scale-[1.02] active:scale-95"
                }`}
              >
                {isUploading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                    <span>Upload Data Awal Musim</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Data */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Daftar Data Awal Musim ({filteredSeasons.length})</h3>
            </div>

            <div className="w-full sm:w-64">
              <CustomSelect
                value={filterType}
                onChange={(val) => setFilterType(val)}
                options={[
                  { value: "all", label: "Semua Jenis Musim" },
                  ...SEASON_TYPE_OPTIONS,
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSeasons.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3 relative group overflow-hidden"
              >
                <div className="flex justify-between items-start relative z-10 gap-2">
                  <div className="flex-1">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mb-2 ${
                        r.category === "awal_musim_hujan"
                          ? "bg-blue-100 text-blue-700"
                          : r.category === "awal_musim_kemarau"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {getCategoryLabel(r.category)}
                    </span>
                    <h4 className="font-bold text-slate-800 text-[15px] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_month</span>
                      {new Date(r.year, parseInt(r.month) - 1, 1).toLocaleString("id-ID", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h4>
                    {r.label && (
                      <p className="text-xs text-slate-500 font-bold mt-1 bg-white inline-block px-2 py-0.5 rounded border border-slate-100">
                        {r.label}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(r.id, r.file_path)}
                    className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0"
                    title="Hapus Data"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
                <div
                  className="mt-auto text-[10px] text-slate-500 font-mono bg-white p-2.5 rounded-xl border border-slate-200 line-clamp-1 relative z-10 flex items-center gap-2"
                  title={r.file_path}
                >
                  <span className="material-symbols-outlined text-[14px] text-primary">data_object</span>
                  <span className="truncate">{r.file_path?.split("/").pop()}</span>
                </div>
              </div>
            ))}
            {filteredSeasons.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                <span className="material-symbols-outlined text-4xl mb-2">calendar_today</span>
                <p className="text-sm font-medium">Belum ada data prediksi awal musim.</p>
                <p className="text-xs text-slate-300 mt-1">Upload file SHP/DBF atau GeoJSON di panel kiri.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
