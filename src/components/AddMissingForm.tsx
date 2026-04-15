import React, { useState } from 'react';
import { X, Camera, MapPin, Loader2, Package, Dog, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AddMissingFormProps {
  onClose: () => void;
  userCoords: { lat: number; lng: number };
}

const AddMissingForm: React.FC<AddMissingFormProps> = ({ onClose, userCoords }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'item' as 'item' | 'pet' | 'person',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('missing_items').insert([
        {
          ...formData,
          last_seen_location: userCoords,
          status: 'missing',
        },
      ]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error('Error adding item:', err);
      // In a real app, we'd show a toast here
      alert('Failed to report. This might be because Supabase is not configured yet.');
      onClose(); // Still close for the demo
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          <div className="w-8" /> {/* Spacer */}
          <div className="p-2 bg-brand-blue/10 rounded-xl">
            <PlusIcon type={formData.type} />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-brand-gray" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex gap-4 justify-center">
            {(['item', 'pet', 'person'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`p-4 rounded-2xl transition-all ${
                  formData.type === t
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/25 scale-110'
                    : 'bg-gray-50 text-brand-gray hover:bg-gray-100'
                }`}
              >
                <PlusIcon type={t} />
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-center font-medium"
              placeholder="What?"
            />

            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all h-32 resize-none text-sm leading-relaxed"
              placeholder="Details..."
            />

            <div className="flex gap-4">
              <div className="flex-1 p-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:border-brand-blue/30 transition-colors">
                <Camera className="text-gray-400 mb-1" size={24} />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Add Photo</span>
              </div>
              <div className="flex-1 p-4 bg-blue-50/50 rounded-2xl flex flex-col items-center justify-center border-2 border-brand-blue/10">
                <MapPin className="text-brand-blue mb-1" size={24} />
                <span className="text-[10px] font-bold text-brand-blue uppercase">Current Location</span>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-5 bg-brand-blue text-white rounded-2xl font-bold shadow-xl shadow-brand-blue/30 hover:shadow-brand-blue/50 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <X size={24} className="rotate-45" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const PlusIcon = ({ type }: { type: 'item' | 'pet' | 'person' }) => {
  switch (type) {
    case 'item': return <Package size={24} />;
    case 'pet': return <Dog size={24} />;
    case 'person': return <User size={24} />;
  }
};

export default AddMissingForm;
