import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axiosInstance from '../../api/axiosConfig';

const SearchInput = ({
  placeholder = "Search",
  className = "",
  value: propValue = "",
  onChange
}) => {
  const [value, setValue] = useState(propValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const fetchSuggestions = async (query) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axiosInstance.get(`/products?q=${encodeURIComponent(query)}&limit=5`);
      setSuggestions(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) onChange(newValue);
    fetchSuggestions(newValue);
    setShowSuggestions(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setValue(suggestion.name);
    navigate(`/search?q=${encodeURIComponent(suggestion.name)}`);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col relative ${className}`}>
      <label className="flex flex-col w-full">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-10 sm:h-12">
          <div
            className="text-[#616f89] flex border-none bg-[#f0f2f4] items-center justify-center pl-3 sm:pl-4 rounded-l-lg border-r-0"
            data-icon="MagnifyingGlass"
            data-size="24px"
            data-weight="regular"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
              ></path>
            </svg>
          </div>
          <input
            placeholder={placeholder}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#616f89] px-3 sm:px-4 rounded-l-none border-l-0 pl-2 text-sm sm:text-base font-normal leading-normal"
            value={value}
            onChange={handleChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            type="search"
          />
        </div>
      </label>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSuggestionClick(item)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500 truncate">{item.category_name}</p>
              </div>
              <span className="text-sm font-bold text-blue-600">${item.price}</span>
            </button>
          ))}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 hover:text-blue-600 text-center transition-colors"
          >
            View all results for "{value}"
          </button>
        </div>
      )}
    </form>
  );
};

// Add PropTypes validation
SearchInput.propTypes = {
  /** Placeholder text for the search input */
  placeholder: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Controlled value for the input */
  value: PropTypes.string,
  /** Callback function when input value changes */
  onChange: PropTypes.func,
};

SearchInput.defaultProps = {
  placeholder: "Search",
  className: "",
  value: "",
  onChange: undefined,
};

export default SearchInput;