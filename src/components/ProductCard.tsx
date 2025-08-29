import React from "react";
import type { Product } from "../types/widget";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const handleClick = () => {
    onClick(product);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image">
        {product.images.edges[0] && (
          <img
            src={product.images.edges[0].node.url}
            alt={product.images.edges[0].node.altText || product.title}
          />
        )}
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">
          ${product.priceRange.minVariantPrice.amount}{" "}
          {product.priceRange.minVariantPrice.currencyCode}
        </p>
        <p className="product-brand">{product.vendor}</p>
        <p className="product-type">{product.productType}</p>
      </div>
    </div>
  );
};

export default ProductCard;
