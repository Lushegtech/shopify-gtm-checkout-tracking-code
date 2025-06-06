# shopify-gtm-checkout-tracking-code
# Shopify GTM Checkout Tracking Code

This project provides a complete Google Tag Manager (GTM) integration for Shopify checkout tracking. It pushes detailed checkout and purchase events to the `dataLayer` for use with GTM and Google Analytics 4 (GA4).

## Features

- Tracks all major Shopify checkout events:
  - Checkout started
  - Contact info submitted
  - Address info submitted
  - Shipping info submitted
  - Payment info submitted
  - Checkout completed (purchase)
  - Page views on checkout
  - Checkout alerts and errors
  - Legacy form submissions and click tracking
- Sends detailed product and order data, including discounts, coupons, shipping, and payment info.
- Initializes and loads GTM automatically.

## Usage

1. **Replace the GTM Container ID**

   In [checkout.js](checkout.js), replace `GTM-XXXXXXX` with your actual GTM container ID:

   ```js
   const GTM_CONTAINER_ID = 'GTM-XXXXXXX'; // REPLACE WITH YOUR GTM ID
   ```

2. **Add the Script to Shopify Checkout**

   Add the contents of [checkout.js](checkout.js) to your Shopify checkout scripts or checkout.liquid file.

3. **Configure GTM**

   In your GTM workspace, set up triggers and tags to listen for the custom events pushed to `dataLayer` (e.g., `begin_checkout`, `add_shipping_info`, `purchase`, etc.).

## Events Pushed to dataLayer

- `begin_checkout`
- `add_contact_info`
- `add_address_info`
- `add_shipping_info`
- `add_payment_info`
- `purchase`
- `page_view`
- `checkout_alert`
- `checkout_extension_error`
- `form_submit` (legacy)
- `checkout_click` (legacy)

Each event includes relevant page, user, and ecommerce data.

## Customization

You can modify [checkout.js](checkout.js) to add or remove tracked events, or to customize the data sent to GTM.

## License

MIT License