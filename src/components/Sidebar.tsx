import React from 'react';
import type { MissingItem } from '../lib/supabase';
import ItemCard from './ItemCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SidebarProps {
  items: (MissingItem & { distance: number })[];
  onItemClick: (item: MissingItem) => void;
  radius: number;
  onRadiusChange: (radius: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  onItemClick,
  radius,
  onRadiusChange,
  searchTerm,
  onSearchChange,
  onClose,
}) => {
  return (
    <div className="h-full flex flex-col bg-white/80 backdrop-blur-md border-r border-gray-100">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
              <Search className="text-white" size={20} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 lg:hidden hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-4 px-1">
          <SlidersHorizontal size={14} className="text-brand-gray shrink-0" />
          <input
            type="range"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => onRadiusChange(parseInt(e.target.value))}
            className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
          />
          <span className="text-[10px] font-bold text-brand-gray w-8 text-right">{radius}km</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              distance={item.distance}
              onClick={() => onItemClick(item)}
            />
          ))
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-center p-6 text-brand-gray">
            <p className="text-sm font-medium mb-1">Nothing found nearby</p>
            <p className="text-xs opacity-60">Try increasing the radius or searching for something else.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
