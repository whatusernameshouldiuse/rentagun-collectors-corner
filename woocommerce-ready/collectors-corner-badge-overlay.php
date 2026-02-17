<?php
/**
 * Collector's Corner Badge Overlay
 *
 * Adds the Collector's Corner shield badge to the top-right corner
 * of product thumbnails for any product in the "Collectors Corner" category.
 *
 * INSTALLATION:
 * Option A: Add this code to your theme's functions.php
 * Option B: Add via Code Snippets plugin (recommended — survives theme updates)
 *
 * REQUIRES:
 * Upload collectors-corner-badge.png to WordPress Media Library
 * and update the $badge_url below with the actual URL.
 */

add_action( 'woocommerce_before_shop_loop_item_title', 'rentagun_collectors_corner_badge', 9 );
add_action( 'woocommerce_before_single_product_summary', 'rentagun_collectors_corner_badge_single', 5 );

/**
 * Show badge on shop/category archive pages
 */
function rentagun_collectors_corner_badge() {
    global $product;

    if ( ! $product ) return;

    // Check if product is in the "Collectors Corner" category
    // Uses the category slug — adjust if your slug is different
    if ( has_term( 'collectors-corner', 'product_cat', $product->get_id() ) ) {
        rentagun_render_cc_badge();
    }
}

/**
 * Show badge on single product page
 */
function rentagun_collectors_corner_badge_single() {
    global $product;

    if ( ! $product ) return;

    if ( has_term( 'collectors-corner', 'product_cat', $product->get_id() ) ) {
        rentagun_render_cc_badge( 'single' );
    }
}

/**
 * Render the badge HTML
 */
function rentagun_render_cc_badge( $context = 'loop' ) {
    // UPDATE THIS URL after uploading badge to WordPress Media Library
    $badge_url = '/wp-content/uploads/2026/02/collectors-corner-badge.png';

    $size_class = ( $context === 'single' ) ? 'cc-badge--single' : 'cc-badge--loop';

    printf(
        '<div class="cc-badge-overlay %s"><img src="%s" alt="Collector\'s Corner" class="cc-badge-img" /></div>',
        esc_attr( $size_class ),
        esc_url( $badge_url )
    );
}

/**
 * Enqueue the badge CSS
 */
add_action( 'wp_head', 'rentagun_collectors_corner_badge_css' );

function rentagun_collectors_corner_badge_css() {
    ?>
    <style>
    /* ── Collector's Corner Badge Overlay ────────── */

    /* Make product thumbnail container relative for badge positioning */
    .woocommerce ul.products li.product .woocommerce-loop-product__link,
    .woocommerce ul.products li.product a.woocommerce-LoopProduct-link {
        position: relative;
        display: block;
    }

    /* Single product gallery needs relative positioning */
    .woocommerce div.product div.images {
        position: relative;
    }

    /* Badge container — top right corner */
    .cc-badge-overlay {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 10;
        pointer-events: none;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        transition: transform 0.2s ease;
    }

    /* Hover effect — subtle scale */
    .woocommerce ul.products li.product:hover .cc-badge-overlay {
        transform: scale(1.05);
    }

    /* Badge image sizing — shop/archive pages */
    .cc-badge--loop .cc-badge-img {
        width: 64px;
        height: auto;
        display: block;
    }

    /* Badge image sizing — single product page */
    .cc-badge--single .cc-badge-img {
        width: 80px;
        height: auto;
        display: block;
    }

    /* Responsive — slightly smaller on mobile */
    @media (max-width: 767px) {
        .cc-badge--loop .cc-badge-img {
            width: 48px;
        }
        .cc-badge--single .cc-badge-img {
            width: 64px;
        }
    }

    /* If your theme uses a different product card structure,
       you may need to add position: relative to the
       thumbnail wrapper. Common selectors: */
    /*
    .woocommerce ul.products li.product .attachment-woocommerce_thumbnail,
    .woocommerce ul.products li.product .wp-post-image {
        position: relative;
    }
    */
    </style>
    <?php
}
