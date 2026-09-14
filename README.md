# GIRBANA Fully Functional Multi-Brand Catalogue

## Included brands
Mamaearth, SKINQ, BIOM:LOGY, The Derma Co, Dr. Sheth's, Alps Goodness, Aqualogica and Yardley London.

40 products are preloaded (5 per brand).

## Functionality
- Product search
- Brand filtering
- Category filtering
- Sorting
- Product quick-view modal
- Product source links
- LocalStorage cart
- Quantity controls
- 15% / 25% / 40% cart discount engine
- Live bulk calculator
- Smart cart unlock messaging
- WhatsApp cart order
- Email cart order
- Bulk quote form -> WhatsApp
- Contact form -> localStorage
- Responsive mobile navigation
- FAQ accordion
- Product-image fallback if an external image is unavailable

## Important commercial note
Product prices and availability change. The included catalogue is a research/demo snapshot based on current public brand/retailer pages checked on 14 Sep 2026. Re-verify product price, stock, image rights, MRP, ingredients and seller/authorization status before commercial launch.

The site does not claim that GIRBANA is an authorized, exclusive or official partner of any listed brand.

## Run
Keep `index.html`, `styles.css`, `app.js`, and `products.json` in the same folder and open `index.html` in a browser, or serve the folder with a static server.

For production checkout/payment/order storage, connect a backend/API and payment gateway. The front-end order actions currently prepare WhatsApp/email messages and the cart is stored in localStorage.
