"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap, ZoomControl, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Search } from "lucide-react";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import { getBMKGSeasonColor } from "@/lib/seasonColors";

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
  categoryLabel?: string; // e.g. "Sifat Musim", "Puncak Musim"
}

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

export function SeasonMap({ forecast, categoryLabel }: SeasonMapProps) {
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

  // User location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

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

  // Handle Geolocation (Lokasi Saya Saat Ini)
  const handleGetLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Fitur lokasi tidak didukung oleh browser Anda.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        setIsLocating(false);

        // Center map to user position
        const latLng: L.LatLngExpression = [lat, lng];
        setMapBounds(L.latLngBounds([latLng, latLng]));

        // Check point in polygon against geoData features to auto-select ZOM
        if (geoData?.features) {
          const pt = turf.point([lng, lat]);
          const found = geoData.features.find((f: any) => {
            try {
              return turf.booleanPointInPolygon(pt, f);
            } catch {
              return false;
            }
          });
          if (found) {
            setSelectedFeature(found);
          }
        }
      },
      (err) => {
        setIsLocating(false);
        alert("Gagal mendapatkan lokasi saat ini. Pastikan izin lokasi diizinkan di peramban Anda.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const legendItems = useMemo(() => {
    if (!geoData || !geoData.features || geoData.features.length === 0) return null;

    const itemsMap = new Map<string, { label: string; color: string }>();
    const cat = forecast?.category || "";

    for (const f of geoData.features) {
      const p = f.properties || {};
      const dataColumn = p._data_column;
      let label: string | undefined;
      if (dataColumn && p[dataColumn]) {
        label = String(p[dataColumn]);
      } else if (cat.includes("curah_hujan")) {
        label = p.curah_MK || p.CH || p.CURAH_HUJAN || p.ch || p.KET || p.ket || p.INFO || p.info;
      } else if (cat.includes("perbandingan")) {
        label = p.Mamun_PMH || p.Mamun_PMK || p.PERB || p.PERBANDINGAN || p.BAND || p.KET || p.ket;
      } else {
        label = p.PMK || p.pmk || p.PMH || p.pmh || p.AWAL_MUSIM || p.awal_musim || p.AM || p.am || p.SIFAT || p.sifat || p.Sifat_MK || p.PUNCAK || p.puncak || p.Puncak_MK || p.Mamun_PMK || p.curah_MK || p.PERB || p.CH || p.info || p.INFO || p.ket || p.KET;
      }

      if (label && typeof label === 'string' && label.trim() !== '') {
        const cleanLabel = label.trim();
        if (!itemsMap.has(cleanLabel)) {
          const itemColor = getBMKGSeasonColor(cleanLabel, cat);
          itemsMap.set(cleanLabel, { label: cleanLabel, color: itemColor });
        }
      }
    }

    if (itemsMap.size === 0) return null;
    return Array.from(itemsMap.values());
  }, [geoData, forecast]);

  // Filter fitur berdasarkan kata kunci pencarian
  const searchResults = useMemo(() => {
    const targetSource = geoData?.features || kabBoundary?.features || [];
    if (!searchQuery.trim() || targetSource.length === 0) return [];
    const q = searchQuery.toLowerCase();

    return targetSource.filter((f: any) => {
      const p = f.properties || {};
      const zom = String(p.NO_ZOM_NAS || p.no_zom_nas || p.ZOM || p.zom || p.kode_zom || "").toLowerCase();
      const nama = String(p.NAMA_ZOM || p.nama_zom || p.nama || p.WADMKK || p.KABUPATEN || "").toLowerCase();
      const awal = String(p.PMK || p.pmk || p.PMH || p.pmh || p.AWAL_MUSIM || p.awal_musim || p.periode || "").toLowerCase();
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
    const cat = p._category || forecast?.category || "";
    const dataColumn = p._data_column;
    let val: string | undefined;
    if (dataColumn && p[dataColumn]) {
      val = String(p[dataColumn]);
    } else if (cat.includes("curah_hujan")) {
      // Untuk curah hujan, prioritaskan kolom nilai CH, bukan periode musim
      val = p.curah_MK || p.CH || p.CURAH_HUJAN || p.ch || p.KET || p.ket || p.INFO || p.info;
    } else if (cat.includes("perbandingan")) {
      // Untuk perbandingan, prioritaskan Mamun_PMH / Mamun_PMK / PERB
      val = p.Mamun_PMH || p.Mamun_PMK || p.PERB || p.PERBANDINGAN || p.BAND || p.KET || p.ket;
    } else {
      val = p.PMK || p.pmk || p.PMH || p.pmh || p.AWAL_MUSIM || p.awal_musim || p.AM || p.am || p.PERIODE || p.periode || p.SIFAT || p.sifat || p.Sifat_MK || p.PUNCAK || p.puncak || p.Puncak_MK || p.Mamun_PMK || p.curah_MK || p.PERB || p.CH || p.ZOM;
    }
    // Always compute dynamically so color library changes take effect without re-upload
    const color = getBMKGSeasonColor(val, cat || forecast?.category);

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
    const zomCode = p.NO_ZOM_NAS || p.no_zom_nas || p.ZOM || p.zom || p.KODE_ZOM || p.id || "-";
    const zomNama = p.NAMA_ZOM || p.nama_zom || p.WADMKK || p.KABUPATEN || "Wilayah ZOM";

    // Determine primary data field based on category or _data_column stored in properties
    const dataColumn = p._data_column;
    const cat = p._category || forecast?.category || "";
    let dataValue = "-";
    if (dataColumn && p[dataColumn]) {
      dataValue = String(p[dataColumn]);
    } else if (cat.includes("curah_hujan")) {
      dataValue = p.curah_MK || p.CH || p.CURAH_HUJAN || p.ch || p.KET || p.ket || p.INFO || p.info || "Belum ditentukan";
    } else if (cat.includes("perbandingan")) {
      dataValue = p.Mamun_PMH || p.Mamun_PMK || p.PERB || p.PERBANDINGAN || p.BAND || p.KET || p.ket || "Belum ditentukan";
    } else {
      dataValue = p.PMK || p.pmk || p.PMH || p.pmh || p.AWAL_MUSIM || p.awal_musim || p.SIFAT || p.sifat || p.Sifat_MK || p.PUNCAK || p.puncak || p.Puncak_MK || p.Mamun_PMK || p.curah_MK || p.PERB || p.CH || p.AM || p.am || p.PERIODE || p.periode || p.KET || p.ket || p.INFO || p.info || "Belum ditentukan";
    }

    // Determine label for the main field
    const mainFieldLabel = cat.includes("sifat") ? "Sifat Musim" :
      cat.includes("puncak") ? "Puncak Musim" :
      cat.includes("perbandingan") ? "Perbandingan Musim" :
      cat.includes("curah_hujan") ? "Curah Hujan Musim" :
      "Prediksi Awal Musim";

    const popupContent = `
      <div class="p-3 font-sans text-slate-800 min-w-[200px]">
        <div class="flex items-center justify-between border-b pb-2 mb-2">
          <span class="text-xs font-black uppercase text-blue-600 tracking-wider">ZOM ${zomCode}</span>
          <span class="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">${zomNama}</span>
        </div>
        <div class="space-y-1.5 text-xs">
          <div>
            <span class="text-slate-400 font-semibold block text-[10px] uppercase">${mainFieldLabel}</span>
            <span class="font-black text-slate-900 text-sm">${dataValue}</span>
          </div>
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
      <style dangerouslySetInnerHTML={{__html: `
        .kabupaten-label {
          background: transparent;
          border: none;
          box-shadow: none;
          color: #1f2937;
          font-weight: 800;
          font-size: 11px;
          text-shadow: 1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white;
          text-align: center;
          pointer-events: none;
        }
        .custom-bmkg-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        .custom-bmkg-popup .leaflet-popup-content {
          margin: 0;
          width: 250px !important;
        }
        .custom-bmkg-popup .leaflet-popup-close-button {
          color: white !important;
          padding: 8px 8px 0 0 !important;
          font-weight: bold;
        }
      `}} />

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
              placeholder="Cari ZOM, kecamatan, atau kabupaten..."
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
                const zomNum = p.NO_ZOM_NAS || p.no_zom_nas || p.ZOM || p.zom;
                const label = zomNum
                  ? `ZOM ${zomNum} - ${p.NAMA_ZOM || p.nama_zom || p.WADMKK || p.KABUPATEN || "Wilayah"}`
                  : (p.NAMA_ZOM || p.nama_zom || p.WADMKK || p.KABUPATEN || "Wilayah");
                const sub = p.PMK || p.pmk || p.PMH || p.pmh || p.AWAL_MUSIM || p.awal_musim || p.AM || "";

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectSearchResult(f)}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 flex flex-col gap-0.5"
                  >
                    <span className="text-xs font-bold text-slate-800">{label}</span>
                    {sub && <span className="text-[11px] text-primary font-semibold">Awal Musim: {sub}</span>}
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

          {/* Marker Lokasi Pengguna */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={L.divIcon({
                className: "custom-user-location-marker",
                html: `<div class="w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg animate-ping"></div><div class="w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg absolute inset-0"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            >
              <Popup className="custom-bmkg-popup">
                <div style={{ minWidth: "220px", padding: 0, fontFamily: "sans-serif" }}>
                  <div style={{ backgroundColor: "#0d6efd", color: "white", padding: "10px 15px", fontWeight: "bold", textAlign: "center", fontSize: "14px" }}>
                    DETAIL INFO
                  </div>
                  <div style={{ padding: "15px", background: "white" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "8px", marginBottom: "10px", fontSize: "13px" }}>
                      <span style={{ color: "#475569" }}>Wilayah:</span>
                      <span style={{ color: "#0d6efd", fontWeight: "bold" }}>
                        {selectedFeature?.properties ? (selectedFeature.properties?.NAMA_ZOM || selectedFeature.properties?.nama_zom || selectedFeature.properties?.KABUPATEN || "Wilayah Anda") : "Lokasi Anda"}
                      </span>
                    </div>
                    {selectedFeature?.properties && (
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "8px", marginBottom: "10px", fontSize: "12px" }}>
                        <span style={{ color: "#475569" }}>Kode ZOM:</span>
                        <span style={{ color: "#1e293b", fontWeight: "600" }}>
                          ZOM {selectedFeature.properties?.NO_ZOM_NAS || selectedFeature.properties?.no_zom_nas || selectedFeature.properties?.ZOM || "-"}
                        </span>
                      </div>
                    )}
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                      <span style={{ color: "#64748b", fontSize: "11px", display: "block", marginBottom: "6px" }}>Prediksi Awal Musim</span>
                      <div style={{
                        backgroundColor: selectedFeature?.properties ? (selectedFeature.properties.fill_color || getBMKGSeasonColor(selectedFeature.properties.PMK || selectedFeature.properties.AWAL_MUSIM, forecast?.category)) : "#0d6efd",
                        color: "white",
                        textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        display: "inline-block",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        fontSize: "13px"
                      }}>
                        {selectedFeature?.properties ? (selectedFeature.properties.PMK || selectedFeature.properties.pmk || selectedFeature.properties.PMH || selectedFeature.properties.AWAL_MUSIM || "Terdeteksi") : "Lokasi Ditemukan"}
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
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

          <hr className="my-1 border-slate-100" />

          {/* Tombol Lokasi Saya Saat Ini di Bawah Kontrol Layer */}
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isLocating}
            className="w-full py-3 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer shadow-sm"
          >
            <span className={`material-symbols-outlined text-[20px] ${isLocating ? "animate-spin" : ""}`}>
              {isLocating ? "progress_activity" : "my_location"}
            </span>
            <span>{isLocating ? "Mencari Lokasi..." : "Lokasi Saya Saat Ini"}</span>
          </button>
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
                ZOM {selectedFeature.properties?.NO_ZOM_NAS || selectedFeature.properties?.no_zom_nas || selectedFeature.properties?.ZOM || selectedFeature.properties?.zom || "-"}
              </h5>
              <p className="text-xs text-slate-600 font-semibold">
                {selectedFeature.properties?.NAMA_ZOM || selectedFeature.properties?.nama_zom || selectedFeature.properties?.WADMKK || selectedFeature.properties?.KABUPATEN || "-"}
              </p>
              <div className="mt-3 pt-2 border-t border-blue-200/50 space-y-1 text-xs">
                {/* Render all meaningful properties */}
                {Object.entries(selectedFeature.properties || {}).filter(([k]) =>
                  !['fill_color','FILL_COLOR','color','COLOR','_data_column','_category'].includes(k)
                ).slice(0, 8).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-slate-500 font-mono uppercase text-[10px]">{key}:</span>
                    <span className="font-bold text-slate-800 text-right max-w-[60%] truncate">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Legenda Keterangan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 flex-1">
          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 border-b pb-3">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">palette</span>
            Keterangan ({categoryLabel || "Prediksi Musim"})
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
