<?php
/**
 * Collector's Corner — Flatsome Homepage Featured Products Override
 *
 * Two options below. Use whichever fits your setup:
 *
 * OPTION A: Shortcode (paste into UX Builder or any page)
 * OPTION B: PHP override of Flatsome's featured products query
 *
 * ═══════════════════════════════════════════════════════════════
 */


/**
 * ─── OPTION A: SHORTCODE ────────────────────────────────────
 *
 * Paste this shortcode into UX Builder where you want the
 * Collector's Corner products to appear:
 *
 * [ux_products cat="collectors-corner" products="6" columns="3" title="Collector's Corner" show="featured"]
 *
 * Or with the badge and custom styling:
 *
 * [section bg_color="#FAF8F5" padding="60px"]
 *   [row]
 *     [col span="12" align="center"]
 *       [ux_image id="BADGE_MEDIA_ID" width="80"]
 *       [gap height="15px"]
 *       [ux_text font_size="2.5" text_color="#1A1A1A"]
 *         <h2 style="font-family: 'Bebas Neue', sans-serif;">Collector's Corner</h2>
 *       [/ux_text]
 *       [ux_text text_color="#6B6B6B"]
 *         <p style="font-family: 'Playfair Display', serif; font-style: italic;">
 *           Rare and discontinued firearms. Rent the guns you've always wanted to shoot.
 *         </p>
 *       [/ux_text]
 *       [gap height="30px"]
 *       [ux_products cat="collectors-corner" products="6" columns="3" orderby="menu_order"]
 *       [gap height="20px"]
 *       [button text="Browse the Full Collection" color="alert" link="/product-category/collectors-corner/" size="larger"]
 *     [/col]
 *   [/row]
 * [/section]
 *
 * NOTE: Replace BADGE_MEDIA_ID with the actual media ID of the
 * uploaded collectors-corner-badge.png
 */


/**
 * ─── OPTION B: OVERRIDE FEATURED PRODUCTS QUERY ─────────────
 *
 * This hooks into Flatsome's featured products section and
 * replaces it with Collector's Corner products.
 *
 * Add to functions.php or Code Snippets plugin.
 */

/**
 * Override the featured products query on the homepage
 * to show only Collector's Corner products
 */
add_filter( 'woocommerce_shortcode_products_query', 'rentagun_cc_featured_override', 20, 3 );

function rentagun_cc_featured_override( $query_args, $atts, $type ) {
    // Only modify on the homepage
    if ( ! is_front_page() && ! is_page( 'home' ) ) {
        return $query_args;
    }

    // Only modify 'featured' product queries (leave other shortcodes alone)
    if ( $type !== 'featured_products' && ! isset( $atts['show'] ) ) {
        return $query_args;
    }

    // Override to show Collector's Corner products
    $query_args['tax_query'][] = array(
        'taxonomy' => 'product_cat',
        'field'    => 'slug',
        'terms'    => 'collectors-corner',
    );

    // Show 6 products
    $query_args['posts_per_page'] = 6;

    // Order by menu order (so you can control display order in WP admin)
    $query_args['orderby'] = 'menu_order';
    $query_args['order']   = 'ASC';

    return $query_args;
}


/**
 * ─── OPTION C: REPLACE ENTIRE SECTION WITH CUSTOM HTML ──────
 *
 * If Options A and B don't work with your Flatsome setup,
 * use this to add a completely custom Collector's Corner
 * section via a shortcode you can place anywhere.
 *
 * Usage: [collectors_corner_showcase]
 */

add_shortcode( 'collectors_corner_showcase', 'rentagun_cc_showcase' );

function rentagun_cc_showcase() {
    // Get Collector's Corner products
    $args = array(
        'post_type'      => 'product',
        'posts_per_page' => 6,
        'tax_query'      => array(
            array(
                'taxonomy' => 'product_cat',
                'field'    => 'slug',
                'terms'    => 'collectors-corner',
            ),
        ),
        'orderby' => 'menu_order',
        'order'   => 'ASC',
    );

    $products = new WP_Query( $args );

    if ( ! $products->have_posts() ) {
        return '<p>No Collector\'s Corner products found.</p>';
    }

    // Badge URL — UPDATE THIS after uploading to media library
    $badge_url = '/wp-content/uploads/2026/02/collectors-corner-badge.png';

    ob_start();
    ?>
    <div class="cc-showcase" style="background: #FAF8F5; padding: 60px 20px; text-align: center;">
        <div style="max-width: 1200px; margin: 0 auto;">

            <!-- Badge -->
            <img src="<?php echo esc_url( $badge_url ); ?>"
                 alt="Collector's Corner"
                 style="width: 100px; height: auto; margin: 0 auto 15px; display: block;" />

            <!-- Heading -->
            <h2 style="font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; color: #1A1A1A; margin-bottom: 8px;">
                Collector's Corner
            </h2>
            <p style="font-family: 'Playfair Display', serif; font-style: italic; color: #6B6B6B; margin-bottom: 40px;">
                Rare and discontinued firearms. Rent the guns you've always wanted to shoot.
            </p>

            <!-- Product Grid -->
            <div class="row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 30px;">
                <?php
                while ( $products->have_posts() ) :
                    $products->the_post();
                    global $product;
                    $image   = wp_get_attachment_url( $product->get_image_id() );
                    $link    = get_permalink();
                    $name    = $product->get_name();
                    $price   = $product->get_price_html();
                    ?>
                    <a href="<?php echo esc_url( $link ); ?>" class="cc-product-card" style="
                        display: block;
                        background: #fff;
                        border: 1px solid #E8E3DC;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 8px rgba(44,24,16,0.06);
                        transition: transform 0.3s, box-shadow 0.3s;
                        text-decoration: none;
                        color: inherit;
                    ">
                        <div style="position: relative; aspect-ratio: 4/3; overflow: hidden; background: #EDE8E0;">
                            <?php if ( $image ) : ?>
                                <img src="<?php echo esc_url( $image ); ?>"
                                     alt="<?php echo esc_attr( $name ); ?>"
                                     style="width: 100%; height: 100%; object-fit: cover;" />
                            <?php endif; ?>
                            <!-- CC Badge overlay -->
                            <img src="<?php echo esc_url( $badge_url ); ?>"
                                 alt="Collector's Corner"
                                 style="position: absolute; top: 8px; right: 8px; width: 48px; height: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));" />
                        </div>
                        <div style="padding: 16px; text-align: left;">
                            <h3 style="font-size: 16px; font-weight: 700; color: #1A1A1A; margin-bottom: 8px;">
                                <?php echo esc_html( $name ); ?>
                            </h3>
                            <div style="font-size: 16px; font-weight: 700; color: #CC0000;">
                                <?php echo $price; ?>
                            </div>
                        </div>
                    </a>
                    <?php
                endwhile;
                wp_reset_postdata();
                ?>
            </div>

            <!-- CTA -->
            <a href="/product-category/collectors-corner/"
               style="display: inline-block; background: #CC0000; color: #fff; font-weight: 700;
                      text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px;
                      padding: 16px 32px; border-radius: 6px; text-decoration: none;
                      transition: background 0.15s;">
                Browse the Full Collection
            </a>
        </div>
    </div>
    <style>
        .cc-product-card:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 8px 30px rgba(44,24,16,0.12) !important;
        }
    </style>
    <?php
    return ob_get_clean();
}
