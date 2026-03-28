import { Search, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useControls } from "react-zoom-pan-pinch";
import { useState } from "react";

interface GenealogyFiltersProps {
  onSearch: (id: string) => void;
  onReset?: () => void;
  onOpenInfo?: () => void;
  hasSearch: boolean;
}

export function GenealogyFilters({
  onSearch,
  onReset,
  // onOpenInfo,
  hasSearch,
}: GenealogyFiltersProps) {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const [searchId, setSearchId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      onSearch(searchId.trim());
    }
  };

  const handleReset = () => {
    setSearchId("");
    if (onReset) onReset();
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 w-full md:w-auto"
      >
        <div className="relative flex-1 md:w-80">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by ID"
            className="w-full bg-white border border-dash-border rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dash-accent/20 focus:border-dash-accent transition-all shadow-sm text-slate-900"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dash-muted"
            size={18}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="bg-[#1a365d] text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-navy transition-colors shadow-sm cursor-pointer"
          >
            GET
          </button>
          {/* 
          <button
            type="button"
            onClick={onOpenInfo}
            className="bg-[#f1f5f9] text-[#1a365d] p-2.5 rounded-lg hover:bg-slate-200 transition-colors shadow-sm cursor-pointer"
            title="View Profile Details"
          >
            <Info size={20} />
          </button> */}

          {hasSearch && (
            <button
              type="button"
              onClick={handleReset}
              className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors shadow-sm cursor-pointer border border-slate-200"
            >
              RESET
            </button>
          )}
        </div>
      </form>

      {/* Controls */}
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <button
          onClick={() => zoomIn()}
          className="flex items-center gap-2 bg-[#f1f5f9] hover:bg-dash-border text-[#1a365d] px-4 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm cursor-pointer"
        >
          <ZoomIn size={16} /> ZOOM IN
        </button>
        <button
          onClick={() => zoomOut()}
          className="flex items-center gap-2 bg-[#f1f5f9] hover:bg-dash-border text-[#1a365d] px-4 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm cursor-pointer"
        >
          <ZoomOut size={16} /> ZOOM OUT
        </button>
        <button
          onClick={() => resetTransform()}
          className="flex items-center gap-2 bg-[#f1f5f9] hover:bg-dash-border text-[#1a365d] px-4 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm uppercase cursor-pointer"
        >
          <Maximize2 size={16} /> Go full screen
        </button>
      </div>
    </div>
  );
}
