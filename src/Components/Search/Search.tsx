import React from "react";
import { BiSearch } from "react-icons/bi";

// The Search component now accepts a callback to update the search query
interface SearchProps {
  onSearchChange: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value); // Update the search query in parent component
  };

  return (
    <div className="relative mb-6">
      <div className="flex items-center">
        <BiSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="bg-transparent focus:outline-none text-white w-full"
        />
      </div>
    </div>
  );
};

export default Search;
