"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { Search } from "lucide-react";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface ForecastOption {
  id: number;
  category: string;
  year: number;
  month: string;
  label: string;
  file_path: string;
}

interface SeasonMapProps {
  forecast: ForecastOption | null;
}

// Skala warna khas BMKG untuk Zona Musim / Awal Musim
const getSeasonColor = (val: string | number | undefined) => {
  if (!val) return "#94a3b8";
  const s = String(val).toLowerCase();

  if (s.includes("mar iii")) return "#d97706"; // Orange
  if (s.includes("apr i")) return "#b45309";  // Darker Gold
  if (s.includes("apr ii")) return "#ca8a04"; // Gold
  if (s.includes("apr iii")) return "#eab308"; // Yellow
  if (s.includes("mei i")) return "#a3e635";  // Lime
  if (s.includes("mei ii")) return "#84cc16"; // Yellow Green
  if (s.includes("jun i")) return "#22c55e";  // Green

  if (s.includes("sep i")) return "#06b6d4";  // Cyan
  if (s.includes("sep iii")) return "#10b981"; // Emerald
  if (s.includes("okt i")) return "#15803d";  // Dark Green
  if (s.includes("okt ii")) return "#65a30d"; // Olive Green
  if (s.includes("okt iii")) return "#84cc16"; // Lime
  if (s.includes("nov i")) return "#eab308";  // Yellow
  if (s.includes("nov ii")) return "#d97706"; // Amber
  if (s.includes("nov iii")) return "#b45309"; // Dark Amber
  if (s.includes("des i")) return "#f97316";   // Orange

  const colors = ["#d97706", "#b45309", "#ca8a04", "#eab308", "#a3e635", "#84cc16", "#22c55e"];
  const num = parseInt(s.replace(/\D/g, ""), 10);
  if (!isNaN(num)) return colors[num % colors.length];

  return "#3b82f6";
};

function MapController({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 12 });
      map.setMaxBounds(L.latLngBounds([-9.5, 110.5], [-5.5, 116.5]));
    }
  }, [bounds, map]);
  return null;
}

export function SeasonMap({ forecast }: SeasonMapProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [kabBoundary, setKabBoundary] = useState<any>(null);
  const [kecBoundary, setKecBoundary] = useState<any>(null);
  const [showKab, setShowKab] = useState(true);
  const [showKec, setShowKec] = useState(false);
  const [showData, setShowData] = useState(true);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);

  // Load GeoJSON data utama saat forecast berubah
  useEffect(() => {
    if (!forecast?.file_path) {
      setGeoData(null);
      return;
    }

    setLoading(true);
    fetch(forecast.file_path)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengunduh berkas GeoJSON");
        return res.json();
      })
      .then((data) => {
        setGeoData(data);
        if (data.features && data.features.length > 0) {
          const leafletGeoJSON = L.geoJSON(data);
          setMapBounds(leafletGeoJSON.getBounds());
        }
      })
      .catch((err) => {
        console.error("Error loading season GeoJSON:", err);
        setGeoData(null);
      })
      .finally(() => setLoading(false));
  }, [forecast]);

  // Load peta batas wilayah Kabupaten & Kecamatan Jawa Timur
  useEffect(() => {
    fetch("/maps/kabupaten_jatim.geojson")
      .then((res) => res.json())
      .then((d) => setKabBoundary(d))
      .catch(() => {
        fetch("/batas_kabupaten.json")
          .then((res) => res.json())
          .then((d) => setKabBoundary(d))
          .catch(() => {});
      });

    fetch("/maps/kecamatan_jatim.geojson")
      .then((res) => res.json())
      .then((d) => setKecBoundary(d))
      .catch(() => {
        fetch("/batas_kecamatan.json")
          .then((res) => res.json())
          .then((d) => setKecBoundary(d))
          .catch(() => {});
      });
  }, []);

  // Extract unique Dasarian legend items from GeoJSON properties if available
  const legendItems = useMemo(() => {
    if (!geoData || !geoData.features || geoData.features.length === 0) return null;

    const itemsMap = new Map<string, { label: string; color: string }>();

    for (const f of geoData.features) {
      const p = f.properties || {};
      const label = p.AWAL_MUSIM || p.awal_musim || p.AM || p.am || p.info || p.INFO || p.ket || p.KET;
      const color = p.fill_color || p.FILL_COLOR || p.color || p.COLOR;

      if (label && typeof label === 'string' && label.trim() !== '') {
        const cleanLabel = label.trim();
        if (!itemsMap.has(cleanLabel)) {
          const itemColor = color || getSeasonColor(cleanLabel);
          itemsMap.set(cleanLabel, { label: cleanLabel, color: itemColor });
        }
      }
    }

    if (itemsMap.size === 0) return null;
    return Array.from(itemsMap.values());
  }, [geoData]);

  // Filter fitur berdasarkan kata kunci pencarian
  const searchResults = useMemo(() => {
    const targetSource = geoData?.features || kabBoundary?.features || [];
    if (!searchQuery.trim() || targetSource.length === 0) return [];
    const q = searchQuery.toLowerCase();

    return targetSource.filter((f: any) => {
      const p = f.properties || {};
      const zom = String(p.ZOM || p.zom || p.kode_zom || "").toLowerCase();
      const nama = String(p.NAMA_ZOM || p.nama_zom || p.nama || p.WADMKK || p.KABUPATEN || "").toLowerCase();
      const awal = String(p.AWAL_MUSIM || p.awal_musim || p.periode || "").toLowerCase();
      return zom.includes(q) || nama.includes(q) || awal.includes(q);
    }).slice(0, 8);
  }, [searchQuery, geoData, kabBoundary]);

  const handleSelectSearchResult = (feature: any) => {
    setSelectedFeature(feature);
    setSearchQuery("");

    if (feature) {
      const featureGeo = L.geoJSON(feature);
      setMapBounds(featureGeo.getBounds());
    }
  };

  const styleGeoJSON = (feature: any) => {
    const p = feature?.properties || {};
    const val = p.AWAL_MUSIM || p.awal_musim || p.AM || p.am || p.PERIODE || p.periode || p.ZOM;
    const customColor = p.fill_color || p.FILL_COLOR || p.color || p.COLOR;
    const color = customColor || getSeasonColor(val);

    return {
      fillColor: color,
      weight: 1.2,
      opacity: 0.9,
      color: "#1e293b",
      fillOpacity: 0.75,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const p = feature.properties || {};
    const zomCode = p.ZOM || p.zom || p.KODE_ZOM || p.id || "-";
    const zomNama = p.NAMA_ZOM || p.nama_zom || p.WADMKK || p.KABUPATEN || "Wilayah ZOM";
    const awalMusim = p.AWAL_MUSIM || p.awal_musim || p.AM || p.am || p.PERIODE || p.periode || "Belum ditentukan";
    const sifat = p.SIFAT || p.sifat || p.SIFAT_MUSIM || "-";

    const popupContent = `
      <div class="p-3 font-sans text-slate-800 min-w-[200px]">
        <div class="flex items-center justify-between border-b pb-2 mb-2">
          <span class="text-xs font-black uppercase text-blue-600 tracking-wider">ZOM ${zomCode}</span>
          <span class="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">${zomNama}</span>
        </div>
        <div class="space-y-1.5 text-xs">
          <div>
            <span class="text-slate-400 font-semibold block text-[10px] uppercase">Prediksi Awal Musim</span>
            <span class="font-black text-slate-900 text-sm">${awalMusim}</span>
          </div>
          ${sifat !== "-" ? `
          <div class="flex justify-between border-t pt-1.5">
            <span class="text-slate-500">Sifat Musim:</span>
            <span class="font-bold text-slate-800">${sifat}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;

    layer.bindPopup(popupContent, { maxWidth: 280 });

    layer.on({
      mouseover: (e) => {
        const l = e.target as L.Path;
        if (l && typeof l.setStyle === 'function') {
          l.setStyle({ fillOpacity: 0.95, weight: 2.5, color: "#2563eb" });
        }
      },
      mouseout: (e) => {
        const l = e.target as L.Path;
        if (l && typeof l.setStyle === 'function') {
          l.setStyle({ fillOpacity: 0.75, weight: 1.2, color: "#1e293b" });
        }
      },
      click: () => {
        setSelectedFeature(feature);
      },
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Area Peta */}
      <div className="flex-1 relative bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-200 h-[560px] lg:h-[640px]">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <span className="text-sm font-bold text-slate-700">Memuat Data Peta...</span>
          </div>
        )}

        {/* Input Pencarian ZOM / Wilayah */}
        <div className="absolute top-4 left-4 z-[400] w-[280px] sm:w-[340px]">
          <div className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 flex items-center px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kecamatan atau kabupaten..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 outline-none font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto">
              {searchResults.map((f: any, idx: number) => {
                const p = f.properties || {};
                const label = p.ZOM || p.NAMA_ZOM || p.WADMKK || p.KABUPATEN || "Wilayah";
                const sub = p.AWAL_MUSIM || p.awal_musim || p.AM || "";

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectSearchResult(f)}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 flex flex-col gap-0.5"
                  >
                    <span className="text-xs font-bold text-slate-800">{label}</span>
                    {sub && <span className="text-[11px] text-primary font-semibold">{sub}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Leaflet Map Canvas */}
        <MapContainer
          center={[-7.7, 112.6]}
          zoom={8}
          zoomControl={false}
          className="w-full h-full z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.bmkg.go.id">BMKG</a> | <a href="https://www.esri.com">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          />
          <MapController bounds={mapBounds} />

          {/* Layer Boundary Kabupaten */}
          {showKab && kabBoundary && (
            <GeoJSON
              data={kabBoundary}
              style={{
                color: "#1e293b",
                weight: 1.8,
                fill: false,
                opacity: 0.9,
              }}
              onEachFeature={(feature, layer) => {
                const name = feature.properties?.KABUPATEN || feature.properties?.kabupaten || feature.properties?.WADMKK || "";
                if (name) {
                  layer.bindTooltip(name, {
                    permanent: true,
                    direction: "center",
                    className: "kabupaten-label"
                  });
                }
              }}
            />
          )}

          {/* Layer Boundary Kecamatan */}
          {showKec && kecBoundary && (
            <GeoJSON
              data={kecBoundary}
              style={{
                color: "#64748b",
                weight: 0.8,
                fill: false,
                dashArray: "3,3",
              }}
            />
          )}

          {/* Layer Utama Data Prediksi Musim */}
          {showData && geoData && (
            <GeoJSON
              key={forecast?.id || "empty-geojson"}
              data={geoData}
              style={styleGeoJSON}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
      </div>

      {/* Sidebar Kontrol & Legenda */}
      <div className="w-full lg:w-[320px] flex flex-col gap-4">
        {/* Kontrol Layer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 border-b pb-3">
            <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
            Kontrol Layer Peta
          </h4>

          <div className="space-y-2.5 pt-1">
            <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700">
              <span>Data Prediksi Musim</span>
              <input
                type="checkbox"
                checked={showData}
                onChange={(e) => setShowData(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700">
              <span>Batas Kabupaten</span>
              <input
                type="checkbox"
                checked={showKab}
                onChange={(e) => setShowKab(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700">
              <span>Batas Kecamatan</span>
              <input
                type="checkbox"
                checked={showKec}
                onChange={(e) => setShowKec(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
              />
            </label>
          </div>
        </div>

        {/* Panel Informasi ZOM Terpilih */}
        {selectedFeature && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-5 rounded-2xl border border-blue-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Detail ZOM Terpilih</span>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-blue-400 hover:text-blue-600 text-xs font-bold"
              >
                Tutup
              </button>
            </div>
            <div className="pt-1 space-y-1">
              <h5 className="font-black text-slate-900 text-base">
                ZOM {selectedFeature.properties?.ZOM || selectedFeature.properties?.zom || "-"}
              </h5>
              <p className="text-xs text-slate-600 font-semibold">
                {selectedFeature.properties?.NAMA_ZOM || selectedFeature.properties?.nama_zom || selectedFeature.properties?.WADMKK || selectedFeature.properties?.KABUPATEN || "-"}
              </p>
              <div className="mt-3 pt-2 border-t border-blue-200/50 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Awal Musim:</span>
                  <span className="font-bold text-blue-700">{selectedFeature.properties?.AWAL_MUSIM || selectedFeature.properties?.awal_musim || selectedFeature.properties?.AM || "-"}</span>
                </div>
                {selectedFeature.properties?.SIFAT && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sifat Musim:</span>
                    <span className="font-bold text-slate-800">{selectedFeature.properties.SIFAT}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Legenda Keterangan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 flex-1">
          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 border-b pb-3">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">palette</span>
            Keterangan (Legend) Awal Musim
          </h4>

          {legendItems ? (
            <div className="space-y-2 text-xs font-semibold text-slate-700 max-h-[360px] overflow-y-auto pr-1">
              {legendItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded border border-black/10 shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="font-bold text-slate-800">{item.label}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ZOM</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 text-xs font-semibold text-slate-700 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded bg-[#d97706] shrink-0 border border-black/10"></span>
                  <span>MAR III</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">Dasarian 3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded bg-[#b45309] shrink-0 border border-black/10"></span>
                  <span>APR I</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">Dasarian 1</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded bg-[#ca8a04] shrink-0 border border-black/10"></span>
                  <span>APR II</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">Dasarian 2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded bg-[#eab308] shrink-0 border border-black/10"></span>
                  <span>APR III</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">Dasarian 3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded bg-[#a3e635] shrink-0 border border-black/10"></span>
                  <span>MEI I</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">Dasarian 1</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded bg-[#84cc16] shrink-0 border border-black/10"></span>
                  <span>MEI II</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">Dasarian 2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded bg-[#22c55e] shrink-0 border border-black/10"></span>
                  <span>JUN I</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">Dasarian 1</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
