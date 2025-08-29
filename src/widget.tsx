import React from "react";
import ReactDOM from "react-dom/client";
import CollectionWidget from "./components/CollectionWidget";
import "./index.css";

function initShopifyCollectionWidget() {
  const targetElement = document.getElementById("shopify-collection-widget");

  if (!targetElement) {
    console.error("Shopify Collection Widget: Target element not found");
    return;
  }

  const config = {
    collectionHandle:
      targetElement.getAttribute("data-collection-handle") || "all",
    shopDomain: targetElement.getAttribute("data-shop-domain") || "",
    storefrontToken: targetElement.getAttribute("data-storefront-token") || "",
  };

  const root = ReactDOM.createRoot(targetElement);
  root.render(
    <React.StrictMode>
      <CollectionWidget config={config} />
    </React.StrictMode>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShopifyCollectionWidget);
} else {
  initShopifyCollectionWidget();
}

(window as any).initShopifyCollectionWidget = initShopifyCollectionWidget;
