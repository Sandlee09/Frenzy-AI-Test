import type { WidgetConfig, CollectionData } from "../types/widget";

const GET_COLLECTION_PRODUCTS = `
  query getCollectionProducts($handle: String!, $first: Int!, $after: String) {
    collectionByHandle(handle: $handle) {
      id
      title
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            productType
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const GET_ALL_PRODUCTS = `
  query getAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          productType
          vendor
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const fetchProducts = async (
  config: WidgetConfig,
  after: string | null = null
): Promise<CollectionData> => {
  const isAllProducts = config.collectionHandle === "all";

  const response = await fetch(
    `https://${config.shopDomain}/api/2024-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": config.storefrontToken,
      },
      body: JSON.stringify({
        query: isAllProducts ? GET_ALL_PRODUCTS : GET_COLLECTION_PRODUCTS,
        variables: isAllProducts
          ? { first: 12, after: after }
          : { handle: config.collectionHandle, first: 12, after: after },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  let collection;
  if (isAllProducts) {
    // For "all" products, create a mock collection structure
    collection = {
      id: "all-products",
      title: "All Products",
      products: data.data.products,
    };
  } else {
    collection = data.data.collectionByHandle;
  }

  if (!collection) {
    throw new Error("Collection not found");
  }

  return collection;
};

export { GET_COLLECTION_PRODUCTS, GET_ALL_PRODUCTS, fetchProducts };
