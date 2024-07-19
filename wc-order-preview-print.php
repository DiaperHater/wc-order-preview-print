<?php

/**
 * Plugin Name:     WC Order Preview Print
 * Plugin URI:      PLUGIN SITE HERE
 * Description:     Makes WC order preview to be printed out
 * Author:          vxlerypronin
 * Author URI:      https://valerypronin.com
 * Text Domain:     wc-order-preview-print
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Wc_Order_Preview_Print
 */

if (is_admin()) {
  function wc_order_preview_print_setup() {
    wp_enqueue_script('wc-order-preview-print-script', plugin_dir_url(__FILE__) . '/assets/js/main.js', array(), '0.1.0', true);
  }
  add_action('woocommerce_admin_order_preview_end', 'wc_order_preview_print_setup');
}
