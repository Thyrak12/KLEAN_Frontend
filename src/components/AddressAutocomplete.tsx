import { useRef, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const libraries: ("places")[] = ["places"];

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
}

const AddressAutocomplete = ({
  value,
  onChange,
  placeholder = "Search for an address...",
  className = "",
  hasError = false,
}: AddressAutocompleteProps) => {
  // Load Google Maps script with Places library
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    console.error("Google Maps load error:", loadError);
  }

  return isLoaded ? (
    <AutocompleteInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      hasError={hasError}
    />
  ) : (
    <input
      type="text"
      disabled
      placeholder="Loading Google Maps..."
      className={`w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-gray-400 ${className}`}
    />
  );
};

/** Inner component – only rendered after Google Maps script is loaded */
function AutocompleteInput({
  value,
  onChange,
  placeholder,
  className,
  hasError,
}: AddressAutocompleteProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue: setInputValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "kh" }, // Restrict to Cambodia
    },
    debounce: 300,
  });

  // Debug: log autocomplete state
  useEffect(() => {
    console.log("[AddressAutocomplete] ready:", ready, "| status:", status, "| suggestions:", data.length);
  }, [ready, status, data]);

  // Sync external value into the input (e.g. when navigating back)
  useEffect(() => {
    if (value && !inputValue) {
      setInputValue(value, false);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const handleSelect = async (description: string) => {
    setInputValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = getLatLng(results[0]);
      onChange(description, lat, lng);
    } catch (error) {
      console.error("Error getting geocode:", error);
      onChange(description);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        clearSuggestions();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSuggestions]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInput}
        disabled={!ready}
        placeholder={ready ? placeholder : "Loading..."}
        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
          hasError ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />

      {status === "OK" && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="px-4 py-3 cursor-pointer hover:bg-yellow-50 transition-colors text-sm text-gray-700 border-b border-gray-100 last:border-0"
            >
              <span className="mr-2 text-gray-400">📍</span>
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddressAutocomplete;
