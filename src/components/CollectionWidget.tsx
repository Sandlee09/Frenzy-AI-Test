import React, { useState, useEffect, useCallback, useRef } from "react";
import SortFilter from "./SortFilter";
import CollectionFilter from "./CollectionFilter";
import ProductCard from "./ProductCard";
import { ChevronDown } from "lucide-react";
import { fetchProducts } from "../graphql/queries";
import type {
  CollectionWidgetProps,
  CollectionData,
  Product,
} from "../types/widget";

export default function CollectionWidget({ config }: CollectionWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collectionData, setCollectionData] = useState<CollectionData | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    brands: [] as string[],
    productTypes: [] as string[],
    sortBy: "PRICE_ASC" as "PRICE_ASC" | "PRICE_DESC",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const handleFetchProducts = async (after: string | null = null) => {
    try {
      setLoading(true);
      setError(null);

      const collection = await fetchProducts(config, after);
      setCollectionData(collection);

      const newProducts = collection.products.edges.map(
        (edge: any) => edge.node
      );
      if (after) {
        setProducts((prev) => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      config.shopDomain &&
      config.storefrontToken &&
      config.collectionHandle
    ) {
      handleFetchProducts();
    } else {
      setError(
        "Missing required configuration: shopDomain, storefrontToken, or collectionHandle"
      );
    }
  }, [config]);

  const availableBrands = [...new Set(products.map((p) => p.vendor))].filter(
    Boolean
  );
  const availableProductTypes = [
    ...new Set(products.map((p) => p.productType)),
  ].filter(Boolean);

  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products;

    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => filters.brands.includes(p.vendor));
    }

    if (filters.productTypes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.productTypes.includes(p.productType)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);

      return filters.sortBy === "PRICE_ASC" ? priceA - priceB : priceB - priceA;
    });

    return sorted;
  }, [products, filters]);

  const handleProductClick = (product: Product) => {
    window.location.href = `/products/${product.handle}`;
  };

  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => {
        const newCount = prev + 8;
        if (newCount >= filteredAndSortedProducts.length) {
          setHasMore(false);
          return filteredAndSortedProducts.length;
        }
        return newCount;
      });
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMore, filteredAndSortedProducts.length]);

  useEffect(() => {
    if (loadingRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
            loadMoreProducts();
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreProducts, hasMore, isLoadingMore]);

  useEffect(() => {
    setVisibleCount(8);
    setHasMore(true);
  }, [filters]);

  if (loading && products.length === 0) {
    return <div className="widget-loading">Loading products...</div>;
  }

  if (error) {
    return <div className="widget-error">Error loading products: {error}</div>;
  }

  if (!collectionData) {
    return <div className="widget-error">Collection not found</div>;
  }

  return (
    <div className="shopify-collection-widget">
      <CollectionFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        availableBrands={availableBrands}
        availableProductTypes={availableProductTypes}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="widget-filters">
        <div className="filter-section">
          <button
            className="filter-button"
            onClick={() => setIsFilterOpen(true)}
          >
            Brand <ChevronDown />
          </button>
          <button
            className="filter-button"
            onClick={() => setIsFilterOpen(true)}
          >
            Product Type <ChevronDown />
          </button>
        </div>

        <SortFilter sortBy={filters.sortBy} setFilters={setFilters} />
      </div>

      <div className="widget-products">
        {filteredAndSortedProducts.slice(0, visibleCount).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))}

        {hasMore && (
          <div ref={loadingRef} className="loading-indicator">
            {isLoadingMore ? (
              <div className="loading-spinner">Loading more products...</div>
            ) : (
              <div className="scroll-hint">Scroll to load more</div>
            )}
          </div>
        )}
      </div>

      {filteredAndSortedProducts.length === 0 && !loading && (
        <div className="no-products">
          No products found matching your filters.
        </div>
      )}
    </div>
  );
}
