// COMPLETE SHOPIFY GTM CHECKOUT TRACKING CODE
// Replace GTM-XXXXXXX with your actual GTM Container ID

const GTM_CONTAINER_ID = 'GTM-XXXXXXX'; // REPLACE WITH YOUR GTM ID

// Initialize dataLayer
window.dataLayer = window.dataLayer || [];

// Push initial page data
const initContextData = init.context?.document;
dataLayer.push({
    page_location: initContextData?.location?.href,
    page_referrer: initContextData?.referrer,
    page_title: initContextData?.title,
});

// Load GTM
(function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', GTM_CONTAINER_ID);

// Helper function to process checkout products
function processCheckoutProducts(lineItems) {
    if (!lineItems) return [];
    
    return lineItems.map((item, index) => {
        let itemDiscountAmount = 0;
        let orderCoupons = [];
        
        // Process discounts
        if (item.discountAllocations) {
            item.discountAllocations.forEach((allocation) => {
                const discount = allocation.discountApplication;
                if (discount.title && !orderCoupons.includes(discount.title)) {
                    orderCoupons.push(discount.title);
                }
                itemDiscountAmount += allocation.amount.amount;
            });
        }
        
        // Calculate price after discount
        const itemPrice = item.variant.price.amount;
        const priceAfterDiscount = Math.max(itemPrice - (itemDiscountAmount / item.quantity), 0);
        
        return {
            item_id: item.variant?.product?.id,
            item_name: item.variant?.product?.title,
            affiliation: init.data?.shop?.name || 'Shopify Store',
            coupon: orderCoupons.join(',') || undefined,
            discount: itemDiscountAmount / item.quantity,
            index: index,
            item_brand: item.variant?.product?.vendor,
            item_category: item.variant?.product?.type,
            item_variant: item.variant?.title,
            price: priceAfterDiscount,
            quantity: item.quantity
        };
    });
}

// Helper function to calculate order totals
function calculateOrderTotals(checkout) {
    const orderDiscountAmount = checkout.discountsAmount?.amount || 0;
    const totalPrice = checkout.totalPrice.amount;
    const shipping = checkout.shippingLine?.price?.amount || 0;
    const tax = checkout.totalTax?.amount || 0;
    const totalOrderValue = totalPrice - shipping - tax;
    
    return {
        orderDiscountAmount,
        totalPrice,
        shipping,
        tax,
        totalOrderValue
    };
}

// Track all checkout events
const checkoutEvents = [
    'checkout_started',
    'checkout_contact_info_submitted', 
    'checkout_address_info_submitted',
    'checkout_shipping_info_submitted',
    'payment_info_submitted',
    'checkout_completed',
    'page_viewed',
    'alert_displayed',
    'ui_extension_errored'
];

// CHECKOUT_STARTED
analytics.subscribe('checkout_started', (event) => {
    const checkout = event.data?.checkout;
    const eventContextData = event.context?.document;
    
    if (!checkout) return;
    
    const totals = calculateOrderTotals(checkout);
    const processedProducts = processCheckoutProducts(checkout.lineItems);
    
    const dataLayerObj = {
        event: 'begin_checkout',
        page_location: eventContextData?.location?.href,
        page_referrer: eventContextData?.referrer,
        page_title: eventContextData?.title,
        ecommerce: {
            currency: checkout.currencyCode,
            value: totals.totalOrderValue,
            coupon: checkout.discountApplications?.map(d => d.title).filter(Boolean).join(',') || undefined,
            discount: totals.orderDiscountAmount,
            items: processedProducts
        }
    };
    
    window.dataLayer.push({ 'ecommerce': null });
    window.dataLayer.push(dataLayerObj);
});

// CHECKOUT_CONTACT_INFO_SUBMITTED
analytics.subscribe('checkout_contact_info_submitted', (event) => {
    const checkout = event.data?.checkout;
    const eventContextData = event.context?.document;
    
    if (!checkout) return;
    
    const totals = calculateOrderTotals(checkout);
    const processedProducts = processCheckoutProducts(checkout.lineItems);
    
    const dataLayerObj = {
        event: 'add_contact_info',
        page_location: eventContextData?.location?.href,
        page_referrer: eventContextData?.referrer,
        page_title: eventContextData?.title,
        user_email: checkout.email,
        ecommerce: {
            currency: checkout.currencyCode,
            value: totals.totalOrderValue,
            items: processedProducts
        }
    };
    
    window.dataLayer.push({ 'ecommerce': null });
    window.dataLayer.push(dataLayerObj);
});

// CHECKOUT_ADDRESS_INFO_SUBMITTED
analytics.subscribe('checkout_address_info_submitted', (event) => {
    const checkout = event.data?.checkout;
    const eventContextData = event.context?.document;
    
    if (!checkout) return;
    
    const totals = calculateOrderTotals(checkout);
    const processedProducts = processCheckoutProducts(checkout.lineItems);
    
    const dataLayerObj = {
        event: 'add_address_info',
        page_location: eventContextData?.location?.href,
        page_referrer: eventContextData?.referrer,
        page_title: eventContextData?.title,
        ecommerce: {
            currency: checkout.currencyCode,
            value: totals.totalOrderValue,
            items: processedProducts
        }
    };
    
    window.dataLayer.push({ 'ecommerce': null });
    window.dataLayer.push(dataLayerObj);
});

// CHECKOUT_SHIPPING_INFO_SUBMITTED
analytics.subscribe('checkout_shipping_info_submitted', (event) => {
    const checkout = event.data?.checkout;
    const eventContextData = event.context?.document;
    
    if (!checkout) return;
    
    const totals = calculateOrderTotals(checkout);
    const processedProducts = processCheckoutProducts(checkout.lineItems);
    
    const dataLayerObj = {
        event: 'add_shipping_info',
        page_location: eventContextData?.location?.href,
        page_referrer: eventContextData?.referrer,
        page_title: eventContextData?.title,
        ecommerce: {
            currency: checkout.currencyCode,
            value: totals.totalOrderValue,
            coupon: checkout.discountApplications?.map(d => d.title).filter(Boolean).join(',') || undefined,
            discount: totals.orderDiscountAmount,
            shipping_tier: checkout.delivery?.selectedDeliveryOptions?.[0]?.title || undefined,
            items: processedProducts
        }
    };
    
    window.dataLayer.push({ 'ecommerce': null });
    window.dataLayer.push(dataLayerObj);
});

// PAYMENT_INFO_SUBMITTED
analytics.subscribe('payment_info_submitted', (event) => {
    const checkout = event.data?.checkout;
    const eventContextData = event.context?.document;
    
    if (!checkout) return;
    
    const totals = calculateOrderTotals(checkout);
    const processedProducts = processCheckoutProducts(checkout.lineItems);
    
    const dataLayerObj = {
        event: 'add_payment_info',
        page_location: eventContextData?.location?.href,
        page_referrer: eventContextData?.referrer,
        page_title: eventContextData?.title,
        ecommerce: {
            currency: checkout.currencyCode,
            value: totals.totalOrderValue,
            coupon: checkout.discountApplications?.map(d => d.title).filter(Boolean).join(',') || undefined,
            discount: totals.orderDiscountAmount,
            items: processedProducts
        }
    };
    
    window.dataLayer.push({ 'ecommerce': null });
    window.dataLayer.push(dataLayerObj);
});

// CHECKOUT_COMPLETED
analytics.subscribe('checkout_completed', (event) => {
    const checkout = event.data?.checkout;
    const eventContextData = event.context?.document;
    
    if (!checkout) return;
    
    const totals = calculateOrderTotals(checkout);
    const processedProducts = processCheckoutProducts(checkout.lineItems);
    const paymentType = checkout.transactions?.[0]?.gateway || 'unknown';
    
    const dataLayerObj = {
        event: 'purchase',
        page_location: eventContextData?.location?.href,
        page_referrer: eventContextData?.referrer,
        page_title: eventContextData?.title,
        user_email: checkout.email,
        user_data: checkout.shippingAddress,
        ecommerce: {
            transaction_id: checkout.order?.id,
            currency: checkout.currencyCode,
            value: totals.totalOrderValue,
            tax: totals.tax,
            shipping: totals.shipping,
            shipping_tier: checkout.delivery?.selectedDeliveryOptions?.[0]?.title || undefined,
            coupon: checkout.discountApplications?.map(d => d.title).filter(Boolean).join(',') || undefined,
            discount: totals.orderDiscountAmount,
            payment_type: paymentType,
            items: processedProducts
        }
    };
    
    window.dataLayer.push({ 'ecommerce': null });
    window.dataLayer.push(dataLayerObj);
});

// PAGE_VIEWED (on checkout pages)
analytics.subscribe('page_viewed', (event) => {
    const eventContextData = event.context?.document;
    
    const dataLayerObj = {
        event: 'page_view',
        page_location: eventContextData?.location?.href,
        page_referrer: eventContextData?.referrer,
        page_title: eventContextData?.title,
        page_type: 'checkout'
    };
    
    window.dataLayer.push(dataLayerObj);
});

// ALERT_DISPLAYED (checkout validation errors)
analytics.subscribe('alert_displayed', (event) => {
    const eventContextData = event.context?.document;
    
    const dataLayerObj = {
        event: 'checkout_alert',
        page_location: eventContextData?.location?.href,
        page_title: eventContextData?.title,
        alert_type: event.data?.type || 'unknown',
        alert_message: event.data?.message || 'Alert displayed'
    };
    
    window.dataLayer.push(dataLayerObj);
});

// UI_EXTENSION_ERRORED (checkout extension errors)
analytics.subscribe('ui_extension_errored', (event) => {
    const eventContextData = event.context?.document;
    
    const dataLayerObj = {
        event: 'checkout_extension_error',
        page_location: eventContextData?.location?.href,
        page_title: eventContextData?.title,
        error_type: 'ui_extension_error',
        extension_id: event.data?.extensionId || 'unknown'
    };
    
    window.dataLayer.push(dataLayerObj);
});

// ADDITIONAL EVENTS FOR LEGACY CHECKOUTS

// Form submissions (for older checkouts)
analytics.subscribe('form_submitted', (event) => {
    const eventContextData = event.context?.document;
    const decodedAction = decodeURIComponent(event.data?.element?.action || '');
    
    // Only track non-cart forms
    if (!decodedAction.includes('/cart/add')) {
        const dataLayerObj = {
            event: 'form_submit',
            page_location: eventContextData?.location?.href,
            page_title: eventContextData?.title,
            form_action: event.data?.element?.action,
            form_id: event.data?.element?.id
        };
        
        window.dataLayer.push(dataLayerObj);
    }
});

// Click tracking (for older checkouts)
if (initContextData?.location?.href.includes('/checkouts/')) {
    analytics.subscribe('clicked', (event) => {
        const element = event.data?.element;
        const eventContextData = event.context?.document;
        
        const dataLayerObj = {
            event: 'checkout_click',
            page_location: eventContextData?.location?.href,
            page_title: eventContextData?.title,
            click_element: element?.type || '',
            click_id: element?.id || '',
            click_text: element?.value || '',
            click_url: element?.href || ''
        };
        
        window.dataLayer.push(dataLayerObj);
    });
}