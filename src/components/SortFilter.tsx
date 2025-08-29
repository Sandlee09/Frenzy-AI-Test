interface Filters {
  brands: string[];
  productTypes: string[];
  sortBy: "PRICE_ASC" | "PRICE_DESC";
}

const SortFilter = ({
  sortBy,
  setFilters,
}: {
  sortBy: string;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) => {
  return (
    <div className="filter-section">
      <p className="filter-sort-label">Sort By:</p>
      <select
        className="filter-button"
        value={sortBy}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            sortBy: e.target.value as "PRICE_ASC" | "PRICE_DESC",
          }))
        }
      >
        <option value="PRICE_ASC">Price (Low to High)</option>
        <option value="PRICE_DESC">Price (High to Low)</option>
      </select>
    </div>
  );
};

export default SortFilter;
