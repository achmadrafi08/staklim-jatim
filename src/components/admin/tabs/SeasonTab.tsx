import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import { supabaseUploadFile } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast-provider";
import { useConfirm } from "@/components/ui/confirm-provider";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { getBMKGSeasonColor } from "@/lib/seasonColors";

// ============================================================
// KONFIGURASI KATEGORI PREDIKSI MUSIM
// ============================================================
const SEASON_CATEGORIES = [
  {
    value: "awal_musim_hujan",
    label: "Prediksi Awal Musim Hujan",
    icon: "water_drop",
    color: "blue",
    defaultColumn: "PMK",
    columns: ["PMK", "PMH", "AWAL_MUSIM", "AM", "PERIODE"],
    description: "Upload data prakiraan awal musim hujan per ZOM Jawa Timur.",
    dbfInfo: "Kolom utama: NO_ZOM_NAS, NAMA_ZOM, PMK / PMH",
  },
  {
    value: "awal_musim_kemarau",
    label: "Prediksi Awal Musim Kemarau",
    icon: "wb_sunny",
    color: "orange",
    defaultColumn: "PMK",
    columns: ["PMK", "AWAL_MUSIM", "AM", "PERIODE"],
    description: "Upload data prakiraan awal musim kemarau per ZOM Jawa Timur.",
    dbfInfo: "Kolom utama: NO_ZOM_NAS, NAMA_ZOM, PMK / AWAL_MUSIM",
  },
  {
    value: "sifat_musim",
    label: "Prediksi Sifat Musim",
    icon: "analytics",
    color: "purple",
    defaultColumn: "Sifat_MK",
    columns: ["Sifat_MK", "SIFAT", "SIFAT_MUSIM", "SM", "KET", "INFO"],
    description: "Upload data prakiraan sifat musim (Atas Normal / Normal / Bawah Normal).",
    dbfInfo: "Kolom utama: NO_ZOM_NAS, NAMA_ZOM, Sifat_MK / SIFAT",
  },
  {
    value: "perbandingan_musim",
    label: "Prediksi Perbandingan Musim",
    icon: "compare",
    color: "teal",
    defaultColumn: "Mamun_PMK",
    columns: ["Mamun_PMK", "PERB", "PERBANDINGAN", "BAND", "KET", "INFO"],
    description: "Upload data perbandingan musim terhadap normal.",
    dbfInfo: "Kolom utama: NO_ZOM_NAS, NAMA_ZOM, Mamun_PMK / PERB",
  },
  {
    value: "puncak_musim",
    label: "Prediksi Puncak Musim",
    icon: "trending_up",
    color: "red",
    defaultColumn: "Puncak_MK",
    columns: ["Puncak_MK", "PUNCAK", "PEAK", "PUNCAK_MUSIM", "PM", "KET"],
    description: "Upload data prakiraan puncak musim per ZOM.",
    dbfInfo: "Kolom utama: NO_ZOM_NAS, NAMA_ZOM, Puncak_MK / PUNCAK",
  },
  {
    value: "curah_hujan_musim",
    label: "Prediksi Curah Hujan Musim",
    icon: "water",
    color: "cyan",
    defaultColumn: "curah_MK",
    columns: ["curah_MK", "CH", "CURAH_HUJAN", "CURAHHUJAN", "RAIN", "KET"],
    description: "Upload data prakiraan curah hujan musiman per ZOM.",
    dbfInfo: "Kolom utama: NO_ZOM_NAS, NAMA_ZOM, curah_MK / CH",
  },
];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const m = i + 1;
  const monthStr = m.toString().padStart(2, "0");
  const monthName = new Date(2000, m - 1, 1).toLocaleString("id-ID", { month: "long" });
  return { value: monthStr, label: monthName };
});

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", badge: "bg-blue-100 text-blue-700" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100", badge: "bg-orange-100 text-orange-700" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100", badge: "bg-purple-100 text-purple-700" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-100", badge: "bg-teal-100 text-teal-700" },
  red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-100", badge: "bg-red-100 text-red-700" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-100", badge: "bg-cyan-100 text-cyan-700" },
};

// All category query
const ALL_SEASON_QUERY = "or=(category.eq.awal_musim_hujan,category.eq.awal_musim_kemarau,category.eq.awal_musim,category.eq.sifat_musim,category.eq.perbandingan_musim,category.eq.puncak_musim,category.eq.curah_hujan_musim)&order=year.desc,month.desc,created_at.desc";

export function SeasonTab() {
  const confirm = useConfirm();
  const { success, error } = useToast();
  const { items: seasonForecasts, isLoading, load, add, remove } = useCrud<any>(
    "rainfall_forecasts",
    "rainfall-data"
  );

  const [activeCategory, setActiveCategory] = useState<string>("awal_musim_hujan");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const currentCatConfig = SEASON_CATEGORIES.find(c => c.value === activeCategory) || SEASON_CATEGORIES[0];
  const colors = COLOR_MAP[currentCatConfig.color];

  const [newSeason, setNewSeason] = useState<{
    year: number;
    month: string;
    label: string;
    uploadMode: "shp" | "json";
    fileShp: File | null;
    fileDbf: File | null;
    fileJson: File | null;
    dataColumn: string;
    customColumn: string;
  }>({
    year: new Date().getFullYear(),
    month: "01",
    label: "",
    uploadMode: "shp",
    fileShp: null,
    fileDbf: null,
    fileJson: null,
    dataColumn: SEASON_CATEGORIES[0].defaultColumn,
    customColumn: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [showCustomColumn, setShowCustomColumn] = useState(false);

  useEffect(() => {
    load(ALL_SEASON_QUERY);
  }, [load]);

  // When category changes, reset column to default
  useEffect(() => {
    const cat = SEASON_CATEGORIES.find(c => c.value === activeCategory);
    if (cat) {
      setNewSeason(prev => ({ ...prev, dataColumn: cat.defaultColumn, customColumn: "" }));
      setShowCustomColumn(false);
    }
  }, [activeCategory]);

  const getCategoryConfig = (catVal: string) =>
    SEASON_CATEGORIES.find(c => c.value === catVal) || null;

  const getCategoryLabel = (catVal: string) => {
    if (catVal === "awal_musim") return "Awal Musim (Legacy)";
    const found = getCategoryConfig(catVal);
    return found ? found.label : catVal;
  };

  const filteredSeasons = seasonForecasts.filter((r) => {
    if (filterCategory === "all") return true;
    return r.category === filterCategory;
  });

  // Determine which column to use from DBF
  const getEffectiveColumn = () => {
    if (showCustomColumn && newSeason.customColumn.trim()) {
      return newSeason.customColumn.trim().toUpperCase();
    }
    return newSeason.dataColumn;
  };

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

    const effectiveColumn = getEffectiveColumn();
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

      // Apply color mapping based on category and selected column
      if (geojson && geojson.features) {
        geojson.features.forEach((f: any) => {
          const p = f.properties || {};
          // Try exact column first, then fallback columns
          const catConfig = getCategoryConfig(activeCategory);
          const allColumns = [effectiveColumn, ...(catConfig?.columns || [])];
          let val: string | undefined;
          for (const col of allColumns) {
            const v = p[col] || p[col.toLowerCase()];
            if (v) { val = String(v); break; }
          }
          // Also try legacy columns for awal musim
          if (!val) {
            val = p.PMK || p.pmk || p.PMH || p.pmh || p.AWAL_MUSIM || p.awal_musim;
          }
          // Determine color
          const bmkgColor = getBMKGSeasonColor(val, activeCategory);
          f.properties = { 
            ...p, 
            fill_color: bmkgColor,
            _data_column: effectiveColumn,
            _category: activeCategory,
          };
        });
      }

      const fileToUpload = new File([JSON.stringify(geojson)], "converted.json", {
        type: "application/json",
      });

      const uploadedUrl = await supabaseUploadFile("rainfall-data", finalFileName, fileToUpload);
      if (!uploadedUrl) throw new Error("Gagal mengupload file ke Storage");

      const successAdd = await add(
        {
          category: activeCategory,
          year: newSeason.year,
          month: newSeason.month,
          label: newSeason.label || `${getCategoryLabel(activeCategory)} ${newSeason.year}`,
          file_path: uploadedUrl,
          data_column: effectiveColumn,
        },
        `Data ${getCategoryLabel(activeCategory)} berhasil ditambahkan!`
      );

      if (successAdd) {
        setNewSeason({
          year: new Date().getFullYear(),
          month: "01",
          label: "",
          uploadMode: "shp",
          fileShp: null,
          fileDbf: null,
          fileJson: null,
          dataColumn: currentCatConfig.defaultColumn,
          customColumn: "",
        });
        setShowCustomColumn(false);
        load(ALL_SEASON_QUERY);
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
      {/* Category Tabs */}
      <div className="mb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pilih Kategori Prediksi Musim</p>
        <div className="flex flex-wrap gap-2">
          {SEASON_CATEGORIES.map(cat => {
            const c = COLOR_MAP[cat.color];
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                  isActive
                    ? `${c.bg} ${c.text} border-current shadow-sm scale-[1.02]`
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Upload */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col h-fit sticky top-28">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Upload {currentCatConfig.label}</h3>
          </div>

          {/* Info Box */}
          <div className={`mb-4 p-3.5 rounded-xl ${colors.bg} border ${colors.border} flex items-start gap-2.5`}>
            <span className={`material-symbols-outlined ${colors.text} text-[20px] shrink-0 mt-0.5`}>info</span>
            <div className={`text-xs space-y-1`}>
              <p className={`font-semibold ${colors.text}`}>{currentCatConfig.description}</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {currentCatConfig.dbfInfo}
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
                  <span className="text-sm font-medium">SHP &amp; DBF</span>
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
                        <span className={`text-sm truncate font-medium ${newSeason.fileShp ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`}>
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
                      <span>File .DBF (Atribut Data)</span>
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
                        <span className={`text-sm truncate font-medium ${newSeason.fileDbf ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`}>
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
                      File SHP &amp; DBF akan dikonversi otomatis ke GeoJSON.
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
                      <span className={`text-sm truncate font-medium ${newSeason.fileJson ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`}>
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

            {/* Kolom Data */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Kolom Data di DBF/GeoJSON</label>
                <button
                  type="button"
                  onClick={() => setShowCustomColumn(!showCustomColumn)}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  {showCustomColumn ? "Pilih dari daftar" : "Masukkan manual"}
                </button>
              </div>
              {showCustomColumn ? (
                <input
                  type="text"
                  value={newSeason.customColumn}
                  onChange={(e) => setNewSeason({ ...newSeason, customColumn: e.target.value })}
                  placeholder={`Nama kolom, misal: ${currentCatConfig.defaultColumn}`}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono uppercase placeholder:normal-case"
                />
              ) : (
                <CustomSelect
                  value={newSeason.dataColumn}
                  onChange={(val) => setNewSeason({ ...newSeason, dataColumn: val })}
                  options={currentCatConfig.columns.map(c => ({ value: c, label: c }))}
                />
              )}
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">key</span>
                Kolom yang akan dibaca dari atribut data: <strong className="text-slate-600 font-mono">{getEffectiveColumn()}</strong>
              </p>
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
                placeholder={`Contoh: ${currentCatConfig.label} 2026/2027`}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="pt-4 mt-auto">
              <button
                type="submit"
                disabled={isUploading}
                className={`w-full text-white shadow-md py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isUploading
                    ? "bg-slate-400 cursor-wait"
                    : `bg-gradient-to-r from-${currentCatConfig.color === "blue" ? "blue" : currentCatConfig.color === "orange" ? "orange" : currentCatConfig.color === "purple" ? "purple" : currentCatConfig.color === "teal" ? "teal" : currentCatConfig.color === "red" ? "red" : "cyan"}-600 to-${currentCatConfig.color === "blue" ? "indigo" : currentCatConfig.color === "orange" ? "amber" : currentCatConfig.color === "purple" ? "violet" : currentCatConfig.color === "teal" ? "emerald" : currentCatConfig.color === "red" ? "rose" : "sky"}-500 hover:scale-[1.02] active:scale-95`
                }`}
                style={{
                  background: isUploading ? undefined : currentCatConfig.color === "blue" ? "linear-gradient(to right, #2563eb, #4f46e5)" :
                    currentCatConfig.color === "orange" ? "linear-gradient(to right, #ea580c, #d97706)" :
                    currentCatConfig.color === "purple" ? "linear-gradient(to right, #9333ea, #7c3aed)" :
                    currentCatConfig.color === "teal" ? "linear-gradient(to right, #0d9488, #059669)" :
                    currentCatConfig.color === "red" ? "linear-gradient(to right, #dc2626, #e11d48)" :
                    "linear-gradient(to right, #0891b2, #0284c7)"
                }}
              >
                {isUploading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                    <span>Upload {currentCatConfig.label}</span>
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
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">list</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Semua Data Prediksi Musim ({filteredSeasons.length})</h3>
            </div>

            <div className="w-full sm:w-72">
              <CustomSelect
                value={filterCategory}
                onChange={(val) => setFilterCategory(val)}
                options={[
                  { value: "all", label: "Semua Kategori" },
                  ...SEASON_CATEGORIES.map(c => ({ value: c.value, label: c.label })),
                ]}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 animate-spin">progress_activity</span>
              <p className="text-sm font-medium">Memuat data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSeasons.map((r) => {
                const catConfig = getCategoryConfig(r.category);
                const c = COLOR_MAP[catConfig?.color || "blue"];
                return (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3 relative group overflow-hidden"
                  >
                    <div className="flex justify-between items-start relative z-10 gap-2">
                      <div className="flex-1">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mb-2 ${c.badge}`}>
                          {catConfig ? catConfig.label : r.category}
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
                        {r.data_column && (
                          <p className="text-[10px] text-slate-400 font-mono mt-1">
                            Kolom: <span className="font-bold text-slate-600">{r.data_column}</span>
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
                );
              })}
              {filteredSeasons.length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                  <span className="material-symbols-outlined text-4xl mb-2">calendar_today</span>
                  <p className="text-sm font-medium">Belum ada data prediksi musim.</p>
                  <p className="text-xs text-slate-300 mt-1">Upload file di panel kiri untuk memulai.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
