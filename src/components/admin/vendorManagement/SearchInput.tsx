// Search Component
export const SearchInput = ({ searchTerm, handleSearch }: any) => (
  <div className="relative lg:w-80">
    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      placeholder="Search vendors..."
      value={searchTerm}
      onChange={handleSearch}
      className="pl-10 pr-4 py-2 w-full bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
    />
  </div>
);