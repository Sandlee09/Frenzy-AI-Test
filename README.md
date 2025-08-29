Widget Install Instructions

1. npm install
2. npm run build

3. copy files shopify-collection-widget.css and shopify-collection-widget.js from dist folder into asset's folder in shopify theme

4. copy the below code to the main-collection-product-grid.liquid and replace current code

<!-- Load widget styles -->

{{ 'shopify-collection-widget.css' | asset_url | stylesheet_tag }}

<!-- Widget container -->
<div 
  id="shopify-collection-widget"
  data-collection-handle="{{ collection.handle }}"
  data-shop-domain="{{ shop.permanent_domain }}"
  data-storefront-token="STOREFRONT-API-TOKEN"
></div>

<!-- Load widget script -->

{{ 'shopify-collection-widget.js' | asset_url | script_tag }}

5. replace data-storefront-token with actual app storefront token
