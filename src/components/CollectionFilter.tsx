import React from "react";

interface Filters {
  brands: string[];
  productTypes: string[];
  sortBy: "PRICE_ASC" | "PRICE_DESC";
}

interface CollectionFilterProps {
  isOpen: boolean;
  onClose: () => void;
  availableBrands: string[];
  availableProductTypes: string[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const CollectionFilter: React.FC<CollectionFilterProps> = ({
  isOpen,
  onClose,
  availableBrands,
  availableProductTypes,
  filters,
  setFilters,
}) => {
  const handleBrandFilter = (brand: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      brands: checked
        ? [...prev.brands, brand]
        : prev.brands.filter((b) => b !== brand),
    }));
  };

  const handleProductTypeFilter = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      productTypes: checked
        ? [...prev.productTypes, type]
        : prev.productTypes.filter((t) => t !== type),
    }));
  };

  const clearAllFilters = () => {
    setFilters((prev) => ({
      ...prev,
      brands: [],
      productTypes: [],
    }));
  };

  return (
    <>
      {isOpen && <div className="filter-backdrop" onClick={onClose} />}

      <div className={`collection-filter ${isOpen ? "open" : ""}`}>
        <div className="filter-header">
          <h2>Filters</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="filter-content">
          <div className="filter-actions">
            <button
              className="clear-filters-btn"
              onClick={clearAllFilters}
              disabled={
                filters.brands.length === 0 && filters.productTypes.length === 0
              }
            >
              Clear All Filters
            </button>
          </div>

          {availableBrands.length > 0 && (
            <div className="collectionFilter-filter-section">
              <h3>Brands</h3>
              <div className="filter-options">
                {availableBrands.map((brand) => (
                  <label key={brand} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={(e) =>
                        handleBrandFilter(brand, e.target.checked)
                      }
                    />
                    <span className="checkmark"></span>
                    <span className="label-text">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {availableProductTypes.length > 0 && (
            <div className="collectionFilter-filter-section">
              <h3>Product Types</h3>
              <div className="filter-options">
                {availableProductTypes.map((type) => (
                  <label key={type} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.productTypes.includes(type)}
                      onChange={(e) =>
                        handleProductTypeFilter(type, e.target.checked)
                      }
                    />
                    <span className="checkmark"></span>
                    <span className="label-text">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {(filters.brands.length > 0 || filters.productTypes.length > 0) && (
            <div className="active-filters">
              <h4>Active Filters</h4>
              <div className="active-filter-tags">
                {filters.brands.map((brand) => (
                  <span key={`brand-${brand}`} className="filter-tag">
                    {brand}
                    <button
                      onClick={() => handleBrandFilter(brand, false)}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.productTypes.map((type) => (
                  <span key={`type-${type}`} className="filter-tag">
                    {type}
                    <button
                      onClick={() => handleProductTypeFilter(type, false)}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CollectionFilter;
