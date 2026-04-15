import { useState, useEffect, useMemo } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import AddMissingForm from './components/AddMissingForm';
import { supabase, type MissingItem } from './lib/supabase';
import { MILTON_KEYNES_COORDS, getDistance } from './utils/geo';
import { Plus, Bell, BellOff, MapPin, Search } from 'lucide-react';

function App() {
  const [items, setItems] = useState<MissingItem[]>([]);
  const [userLocation, setUserLocation] = useState(MILTON_KEYNES_COORDS);
  const [mapCenter, setMapCenter] = useState<[number, number]>([MILTON_KEYNES_COORDS.lat, MILTON_KEYNES_COORDS.lng]);
  const [radius, setRadius] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Get user's current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter([latitude, longitude]);
      });
    }

    // Initial fetch
    fetchItems();

    // Real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'missing_items' },
        (payload) => {
          setItems((prev) => [payload.new as MissingItem, ...prev]);
          if (notificationsEnabled) {
            new Notification('New report in MK Found!', {
              body: (payload.new as MissingItem).name,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [notificationsEnabled]);

  const fetchItems = async () => {
    // For demo purposes, if Supabase isn't set up, we'll use mock data
    const { data, error } = await supabase
      .from('missing_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.log('Using mock data...');
      setItems([
        {
          id: '1',
          created_at: new Date().toISOString(),
          type: 'pet',
          name: 'Luna (Golden Retriever)',
          description: 'Last seen near Campbell Park. Wearing a blue collar.',
          last_seen_location: { lat: 52.045, lng: -0.745 },
          status: 'missing',
        },
        {
          id: '2',
          created_at: new Date().toISOString(),
          type: 'item',
          name: 'Black Backpack',
          description: 'Left on a bench near MK Central Station. Contains a laptop.',
          last_seen_location: { lat: 52.038, lng: -0.772 },
          status: 'missing',
        },
        {
          id: '3',
          created_at: new Date().toISOString(),
          type: 'person',
          name: 'Elderly Man (Arthur)',
          description: 'Wearing a grey coat. Last seen near the Shopping Centre.',
          last_seen_location: { lat: 52.042, lng: -0.758 },
          status: 'missing',
        },
      ]);
    } else {
      setItems(data);
    }
  };

  const filteredItems = useMemo(() => {
    return items
      .map((item) => ({
        ...item,
        distance: getDistance(
          userLocation.lat,
          userLocation.lng,
          item.last_seen_location.lat,
          item.last_seen_location.lng
        ),
      }))
      .filter((item) => {
        const matchesRadius = item.distance <= radius;
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRadius && matchesSearch;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [items, userLocation, radius, searchTerm]);

  const handleToggleNotifications = () => {
    if (!notificationsEnabled) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
        }
      });
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter([latitude, longitude]);
      });
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden font-sans relative">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-full sm:w-[400px] transform transition-transform duration-300 ease-in-out bg-white ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <Sidebar
          items={filteredItems}
          onItemClick={(item) => {
            setMapCenter([item.last_seen_location.lat, item.last_seen_location.lng]);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          radius={radius}
          onRadiusChange={setRadius}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClose={() => setIsSidebarOpen(false)}
        />
      </aside>

      {/* Main Map Area */}
      <main className="flex-1 relative z-10 h-full">
        <Map
          items={filteredItems}
          center={mapCenter}
          onMarkerClick={(item) => {
            setMapCenter([item.last_seen_location.lat, item.last_seen_location.lng]);
          }}
        />

        {/* Floating Controls */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex flex-col gap-3 z-[1000]">
          <button
            onClick={handleToggleNotifications}
            title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
            className={`p-3 sm:p-4 rounded-2xl shadow-premium transition-all active:scale-95 ${
              notificationsEnabled
                ? 'bg-brand-blue text-white'
                : 'bg-white text-brand-gray hover:bg-gray-50'
            }`}
          >
            {notificationsEnabled ? <Bell size={24} /> : <BellOff size={24} />}
          </button>

          <button
            onClick={handleLocateMe}
            title="Locate me"
            className="p-3 sm:p-4 bg-white text-brand-gray rounded-2xl shadow-premium hover:bg-gray-50 transition-all active:scale-95"
          >
            <MapPin size={24} />
          </button>

          <button
            onClick={() => setShowAddForm(true)}
            className="p-3 sm:p-5 bg-brand-blue text-white rounded-2xl shadow-xl shadow-brand-blue/30 hover:shadow-brand-blue/50 transition-all active:scale-95 flex items-center justify-center"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        {/* Sidebar Toggle for Mobile/Tablet */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden z-[1000] p-4 bg-white text-brand-blue rounded-2xl shadow-xl border border-brand-blue/5 active:scale-95 transition-all"
          >
            <Search size={24} strokeWidth={2.5} />
          </button>
        )}
      </main>

      {showAddForm && (
        <AddMissingForm
          onClose={() => setShowAddForm(false)}
          userCoords={userLocation}
        />
      )}
    </div>
  );
}

export default App;
