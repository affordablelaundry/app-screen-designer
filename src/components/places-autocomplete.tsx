import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Check, X, Search, Building } from "lucide-react";

const POPULAR_KNUST_LOCATIONS = [
  { name: "Unity Hall (Conti)", area: "KNUST Campus", type: "hall" },
  { name: "University Hall (Katanga)", area: "KNUST Campus", type: "hall" },
  { name: "Queen Elizabeth II Hall", area: "KNUST Campus", type: "hall" },
  { name: "Independence Hall", area: "KNUST Campus", type: "hall" },
  { name: "Republic Hall", area: "KNUST Campus", type: "hall" },
  { name: "Africa Hall", area: "KNUST Campus", type: "hall" },
  { name: "Brunei Complex / Hall 7", area: "KNUST Campus", type: "hostel" },
  { name: "SRC Hostel", area: "KNUST Campus", type: "hostel" },
  { name: "Evandy Hostel", area: "Ayeduase, Kumasi", type: "hostel" },
  { name: "Frontline Hostel", area: "Ayeduase, Kumasi", type: "hostel" },
  { name: "Standard Hostel", area: "Ayeduase, Kumasi", type: "hostel" },
  { name: "Crystal Rose Hostel", area: "Ayeduase, Kumasi", type: "hostel" },
  { name: "Shalom Hostel", area: "Ayeduase, Kumasi", type: "hostel" },
  { name: "Gaza Hostel", area: "Kotei, Kumasi", type: "hostel" },
  { name: "White House Hostel", area: "Kotei, Kumasi", type: "hostel" },
  { name: "Chancellor Hall Hostel", area: "Kotei, Kumasi", type: "hostel" },
  { name: "Splendor Hostel", area: "Kotei, Kumasi", type: "hostel" },
  { name: "Amamoma Hostel", area: "Kotei, Kumasi", type: "hostel" },
  { name: "Ayeduase New Site", area: "Ayeduase, Kumasi", type: "area" },
  { name: "Kotei Town", area: "Kotei, Kumasi", type: "area" },
  { name: "Gyinyase", area: "Kumasi", type: "area" },
  { name: "Bomso", area: "Kumasi", type: "area" },
  { name: "Kentinkrono", area: "Kumasi", type: "area" },
  { name: "Boadi", area: "Kumasi", type: "area" },
  { name: "Deduako", area: "Kumasi", type: "area" },
  { name: "Tech Junction", area: "KNUST, Kumasi", type: "area" },
  { name: "KNUST Main Gate", area: "KNUST Campus", type: "area" },
  { name: "KNUST Commercial Area", area: "KNUST Campus", type: "area" },
  { name: "KNUST Botanical Garden", area: "KNUST Campus", type: "area" },
];

interface PlacesAutocompleteProps {
  value?: string;
  onChange?: (val: string) => void;
  name?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

interface GooglePrediction {
  description: string;
}

interface GoogleAutocompleteService {
  getPlacePredictions: (
    request: {
      input: string;
      componentRestrictions?: { country: string | string[] };
      locationBias?: {
        center: { lat: number; lng: number };
        radius: number;
      };
    },
    callback: (predictions: GooglePrediction[] | null, status: string) => void,
  ) => void;
}

export function PlacesAutocomplete({
  value: initialValue = "",
  onChange,
  name = "location",
  required = false,
  placeholder = "Type your hall, hostel, or house address...",
  className = "",
  id = "pickup-location-input",
}: PlacesAutocompleteProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [googlePredictions, setGooglePredictions] = useState<string[]>([]);
  const autocompleteServiceRef = useRef<GoogleAutocompleteService | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  // Try to bind Google Maps Places Autocomplete if Google script is loaded
  useEffect(() => {
    if (typeof window !== "undefined") {
      const gMaps = (
        window as unknown as {
          google?: {
            maps?: { places?: { AutocompleteService: new () => GoogleAutocompleteService } };
          };
        }
      ).google?.maps?.places;
      if (gMaps?.AutocompleteService) {
        try {
          autocompleteServiceRef.current = new gMaps.AutocompleteService();
        } catch (err) {
          console.warn("Google AutocompleteService init:", err);
        }
      }
    }
  }, []);

  // Filter local & google places when input changes
  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setGooglePredictions([]);
      return;
    }

    if (autocompleteServiceRef.current) {
      try {
        autocompleteServiceRef.current.getPlacePredictions(
          {
            input: inputValue,
            componentRestrictions: { country: "gh" },
            locationBias: {
              center: { lat: 6.6745, lng: -1.567 },
              radius: 20000,
            },
          },
          (predictions: GooglePrediction[] | null, status: string) => {
            if (status === "OK" && predictions) {
              setGooglePredictions(predictions.map((p) => p.description));
            } else {
              setGooglePredictions([]);
            }
          },
        );
      } catch {
        setGooglePredictions([]);
      }
    }
  }, [inputValue]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const filteredLocal = POPULAR_KNUST_LOCATIONS.filter((item) => {
    if (!inputValue.trim()) return true;
    const q = inputValue.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.area.toLowerCase().includes(q);
  }).slice(0, 6);

  const handleSelect = (placeName: string) => {
    setInputValue(placeName);
    onChange?.(placeName);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setInputValue(nextVal);
    onChange?.(nextVal);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 w-4 h-4 text-primary pointer-events-none shrink-0" />
        <input
          id={id}
          type="text"
          name={name}
          required={required}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full h-11 pl-9 pr-9 rounded-2xl border border-input bg-background text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all shadow-xs ${className}`}
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue("");
              onChange?.("");
            }}
            className="absolute right-3 p-1 text-muted-foreground hover:text-foreground rounded-full"
            aria-label="Clear location input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown with Glassmorphic styling */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-64 overflow-y-auto bg-card/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40 pb-1.5 mb-1">
            <span className="flex items-center gap-1">
              <Navigation className="w-3 h-3 text-primary" />
              Suggested KNUST & Kumasi Locations
            </span>
            <span>Tap to fill</span>
          </div>

          {/* Google Places Results if available */}
          {googlePredictions.length > 0 && (
            <div className="space-y-1 mb-2">
              <span className="text-[10px] font-bold text-primary px-2 block">Google Places:</span>
              {googlePredictions.map((pred) => (
                <button
                  key={pred}
                  type="button"
                  onClick={() => handleSelect(pred)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">{pred}</span>
                </button>
              ))}
            </div>
          )}

          {/* Local KNUST Verified Halls & Hostels */}
          {filteredLocal.map((loc) => (
            <button
              key={`${loc.name}-${loc.area}`}
              type="button"
              onClick={() => handleSelect(`${loc.name}, ${loc.area}`)}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted/80 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Building className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-foreground block truncate">{loc.name}</span>
                  <span className="text-[10px] text-muted-foreground truncate block">
                    {loc.area}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                Select
              </span>
            </button>
          ))}

          {filteredLocal.length === 0 && googlePredictions.length === 0 && (
            <div className="px-3 py-3 text-center text-xs text-muted-foreground">
              <p>Type your exact address, hall, or room number above.</p>
              <p className="text-[11px] text-primary font-medium mt-1">
                Our rider will call your phone when arriving.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
