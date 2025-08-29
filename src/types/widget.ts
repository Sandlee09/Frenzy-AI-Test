export interface WidgetConfig {
  collectionHandle: string;
  shopDomain: string;
  storefrontToken: string;
}

export interface CollectionWidgetProps {
  config: WidgetConfig;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  productType: string;
  vendor: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
}

export interface CollectionData {
  id: string;
  title: string;
  products: {
    edges: Array<{
      node: Product;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}
