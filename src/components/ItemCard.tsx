import React from 'react';
import type { MissingItem } from '../lib/supabase';
import { MapPin, Clock } from 'lucide-react';
import { formatDistance } from '../utils/geo';

interface ItemCardProps {
  item: MissingItem;
  distance?: number;
  onClick?: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, distance, onClick }) => {
  const typeColor = {
    item: 'bg-blue-100 text-blue-700',
    pet: 'bg-orange-100 text-orange-700',
    person: 'bg-red-100 text-red-700',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-premium-hover transition-all duration-300 cursor-pointer border border-gray-100 group"
    >
      <div className="flex gap-4">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-20 h-20 rounded-xl object-cover bg-gray-100"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
            <MapPin size={24} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${typeColor[item.type]}`}>
              {item.type}
            </span>
            {distance !== undefined && (
              <span className="text-[11px] font-medium text-brand-gray bg-gray-50 px-2 py-0.5 rounded-full">
                {formatDistance(distance)} away
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-brand-blue transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-brand-gray line-clamp-1 mb-2">
            {item.description}
          </p>
          <div className="flex items-center text-[11px] text-gray-400 gap-3">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
