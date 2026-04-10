<?php
/**
 * Plugin Name: Custom Map by Argon
 * Plugin URI: https://example.com/
 * Description: Dummy placeholder map/location widget. Use shortcode [custom_map_by_argon].
 * Version: 1.0.0
 * Author: Argon
 * License: GPL2+
 * Text Domain: custom-map-by-argon
 */

if (!defined('ABSPATH')) {
    exit;
}

function cmba_enqueue_assets() {
    $css_url = plugin_dir_url(__FILE__) . 'assets/custom-map-by-argon.css';
    wp_enqueue_style('cmba-style', $css_url, array(), '1.0.0');
}

add_action('wp_enqueue_scripts', 'cmba_enqueue_assets');

function cmba_render_widget($atts = array()) {
    $items = array(
        array(
            'title' => 'Placeholder Area A',
            'count' => '00',
            'consumption' => '00.0 kWh',
        ),
        array(
            'title' => 'Placeholder Area B',
            'count' => '00',
            'consumption' => '00.0 kWh',
        ),
        array(
            'title' => 'Placeholder Area C',
            'count' => '00',
            'consumption' => '00.0 kWh',
        ),
        array(
            'title' => 'Placeholder Area D',
            'count' => '00',
            'consumption' => '00.0 kWh',
        ),
    );

    ob_start();
    ?>
    <div class="cmba-widget">
      <div class="cmba-header">
        <h2>Custom Map</h2>
        <p>by Argon</p>
      </div>

      <?php foreach ($items as $item) : ?>
        <div class="cmba-card">
          <div>
            <h3><?php echo esc_html($item['title']); ?></h3>
            <p class="cmba-count"><?php echo esc_html($item['count'] . ' ' . $item['title']); ?></p>
          </div>
          <div class="cmba-right">
            <span class="cmba-arrow">&rsaquo;</span>
            <strong><?php echo esc_html($item['consumption']); ?></strong>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
}

add_shortcode('custom_map_by_argon', 'cmba_render_widget');
