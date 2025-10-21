import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

const WalletSearchBar: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (next: string) => {
    setLocalValue(next);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => onChange(next), 300);
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search transactions..."
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
      />
    </div>
  );
};


export default WalletSearchBar