"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search } from "lucide-react";

// Fix Leaflet marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function MapBoundsUpdater({ data, geoData }: { data: any[]; geoData: any }) {
  const map = useMap();
  useEffect(() => {
    if (geoData && geoData.features && geoData.features.length > 0) {
      try {
        const bounds = L.geoJSON(geoData).getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [40, 40] });
          map.setMaxBounds(bounds.pad(0.8));
          map.options.maxBoundsViscosity = 1.0;
          return;
        }
      } catch (e) {}
    }

    if (data && data.length > 0) {
      const validPoints = data
        .filter(d => typeof d.lat === 'number' && typeof d.lon === 'number' && !isNaN(d.lat) && !isNaN(d.lon))
        .map(d => L.latLng(d.lat, d.lon));

      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [40, 40] });
        map.setMaxBounds(bounds.pad(0.8));
        map.options.maxBoundsViscosity = 1.0;
      }
    }
  }, [map, data, geoData]);

  return null;
}

function ResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    const container = map.getContainer();
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [map]);
  return null;
}

function SearchControl({ data }: { data: any[] }) {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const [selectedPos, setSelectedPos] = useState<any>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return data.filter(d =>
      d.nama && d.kab && (
        d.nama.toLowerCase().includes(q) ||
        d.kab.toLowerCase().includes(q) ||
        (d.id && d.id.toLowerCase().includes(q))
      )
    ).slice(0, 8);
  }, [data, query]);

  const handleSelect = (pos: any) => {
    if (pos.lat && pos.lon) {
      map.flyTo([pos.lat, pos.lon], 13, { duration: 1.5 });
      setSelectedPos(pos);
    }
    setShow(false);
    setQuery(pos.nama);
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-[1000] w-64 md:w-80 shadow-lg rounded-xl bg-white border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex items-center px-3 py-2 bg-white">
          <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Cari nama pos, ID, atau kabupaten..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShow(e.target.value.length > 0);
            }}
            onFocus={() => { if (query.length > 0) setShow(true); }}
            className="w-full outline-none text-xs font-medium bg-transparent text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {show && results.length > 0 && (
          <div className="max-h-56 overflow-y-auto border-t border-slate-100 bg-white">
            {results.map((pos, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(pos)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between items-center transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">{pos.nama}</span>
                  <span className="text-[10px] text-slate-500">Kab. {pos.kab}</span>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                  {pos.id}
                </span>
              </button>
            ))}
          </div>
        )}

        {show && query.length > 0 && results.length === 0 && (
          <div className="px-4 py-3 text-xs text-slate-400 bg-white border-t border-slate-100 text-center">
            Pos Hujan tidak ditemukan
          </div>
        )}
      </div>

      {selectedPos && (
        <Popup
          position={[selectedPos.lat, selectedPos.lon]}
          eventHandlers={{ remove: () => setSelectedPos(null) }}
        >
          <div className="p-1" style={{ minWidth: '190px', fontFamily: 'sans-serif' }}>
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h6 className="font-bold m-0 text-blue-700" style={{ fontSize: '14px' }}>{selectedPos.nama}</h6>
            </div>
            <div className="mb-2 text-slate-600" style={{ fontSize: '12px' }}>
              <span className="material-symbols-outlined text-[14px] text-red-500 align-middle mr-1">location_on</span>
              Kab. {selectedPos.kab}
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div style={{ fontSize: '11px', color: '#666' }}>ID Stasiun / Pos:</div>
              <div className="font-black text-slate-900 text-base">{selectedPos.id}</div>
            </div>

            <div className="mt-2 text-slate-400 text-right border-t pt-1" style={{ fontSize: '9px' }}>
              Koordinat: {selectedPos.lat}, {selectedPos.lon}
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}

export function AloptamaMap({ onDataLoaded }: { onDataLoaded?: (count: number) => void }) {
  const [posData, setPosData] = useState<any[]>([]);
  const [batasKab, setBatasKab] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resPos, resKab] = await Promise.all([
          fetch(`/data_pos_hujan.json?t=${new Date().getTime()}`),
          fetch(`/batas_kabupaten.json?t=${new Date().getTime()}`).catch(() => null)
        ]);

        if (resPos.ok) {
          const jsonPos = await resPos.json();
          setPosData(jsonPos);
          if (onDataLoaded) onDataLoaded(jsonPos.length);
        }

        if (resKab && resKab.ok) {
          const jsonKab = await resKab.json();
          setBatasKab(jsonKab);
        }
      } catch (err) {
        console.error("Error fetching pos hujan data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [onDataLoaded]);

  if (loading) {
    return (
      <div className="w-full h-[550px] lg:h-[650px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 animate-pulse">Memuat Peta Sebaran Pos Hujan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[550px] lg:h-[650px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
      <MapContainer
        center={[-7.7, 112.5]}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.bmkg.go.id">BMKG</a> | <a href="https://www.esri.com">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />

        <ZoomControl position="bottomright" />
        <ResizeHandler />
        <MapBoundsUpdater data={posData} geoData={batasKab} />
        <SearchControl data={posData} />

        {/* Boundary Lines Overlay */}
        {batasKab && (
          <GeoJSON
            data={batasKab}
            style={() => ({
              fillColor: "#cbd5e1",
              weight: 1,
              opacity: 0.6,
              color: "#64748b",
              fillOpacity: 0.04
            })}
          />
        )}

        {/* Pos Hujan Marker Layer */}
        {posData.map((pos, idx) => (
          <CircleMarker
            key={pos.id || idx}
            center={[pos.lat, pos.lon]}
            radius={6}
            pathOptions={{
              fillColor: "#0d6efd",
              color: "white",
              weight: 1.5,
              opacity: 1,
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <div className="p-1" style={{ minWidth: '180px', fontFamily: 'sans-serif' }}>
                <div className="flex justify-between items-center border-b pb-1.5 mb-1.5">
                  <h6 className="font-bold m-0 text-blue-700" style={{ fontSize: '13px' }}>{pos.nama}</h6>
                </div>
                <div className="mb-1.5 text-slate-700" style={{ fontSize: '11px' }}>
                  <span className="material-symbols-outlined text-[13px] text-red-500 align-middle mr-1">location_on</span>
                  Kab. {pos.kab}
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <div style={{ fontSize: '10px', color: '#666' }}>ID Stasiun / Pos:</div>
                  <div className="font-black text-slate-900 text-sm">{pos.id}</div>
                </div>

                <div className="mt-1.5 text-slate-400 text-right border-t pt-1" style={{ fontSize: '9px' }}>
                  Koordinat: {pos.lat}, {pos.lon}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
