<?php
/**
 * Plugin Name: Custom Map by Argon
 * Plugin URI: https://example.com/
 * Description: Custom Map widget with editable copy, optional header placement, and no map zoom controls. Shortcode: [custom_map_by_argon].
 * Version: 1.1.0
 * Author: Argon
 * License: GPL2+
 * Text Domain: custom-map-by-argon
 */

if (!defined('ABSPATH')) {
    exit;
}

const CMBA_OPTION_KEY = 'cmba_settings';

function cmba_defaults() {
    return array(
        'heading'            => __('Location', 'custom-map-by-argon'),
        'subheading'         => __('Serving Your Region', 'custom-map-by-argon'),
        'intro_text'         => __('Describe your service area, hours, or what visitors should know. Replace this text with your own copy.', 'custom-map-by-argon'),
        'header_position'    => 'above', // above | right_column
        'areas'              => array(
            __('Example Area One', 'custom-map-by-argon'),
            __('Example Area One', 'custom-map-by-argon'),
            __('Example Area One', 'custom-map-by-argon'),
        ),
        'cta_primary_label'  => __('Get in touch', 'custom-map-by-argon'),
        'cta_primary_url'    => '#contact',
        'cta_phone'          => '(555) 000-0000',
    );
}

function cmba_get_settings() {
    $saved = get_option(CMBA_OPTION_KEY, array());
    return wp_parse_args(is_array($saved) ? $saved : array(), cmba_defaults());
}

function cmba_sanitize_settings($input) {
    $defaults = cmba_defaults();
    $out = array();

    $out['heading'] = isset($input['heading'])
        ? sanitize_text_field(wp_unslash($input['heading']))
        : $defaults['heading'];
    $out['subheading'] = isset($input['subheading'])
        ? sanitize_text_field(wp_unslash($input['subheading']))
        : $defaults['subheading'];
    $out['intro_text'] = isset($input['intro_text'])
        ? sanitize_textarea_field(wp_unslash($input['intro_text']))
        : $defaults['intro_text'];

    $pos = isset($input['header_position']) ? sanitize_key($input['header_position']) : 'above';
    $out['header_position'] = in_array($pos, array('above', 'right_column'), true) ? $pos : 'above';

    $areas_raw = isset($input['areas_text']) ? wp_unslash($input['areas_text']) : '';
    $lines = array_filter(array_map('trim', preg_split("/\r\n|\n|\r/", $areas_raw)));
    $out['areas'] = array();
    foreach ($lines as $line) {
        $out['areas'][] = sanitize_text_field($line);
    }
    if (empty($out['areas'])) {
        $out['areas'] = $defaults['areas'];
    }

    $out['cta_primary_label'] = isset($input['cta_primary_label'])
        ? sanitize_text_field(wp_unslash($input['cta_primary_label']))
        : $defaults['cta_primary_label'];
    $out['cta_primary_url'] = isset($input['cta_primary_url'])
        ? esc_url_raw(wp_unslash($input['cta_primary_url']))
        : $defaults['cta_primary_url'];
    $out['cta_phone'] = isset($input['cta_phone'])
        ? sanitize_text_field(wp_unslash($input['cta_phone']))
        : $defaults['cta_phone'];

    return $out;
}

function cmba_register_settings() {
    register_setting('cmba_settings_group', CMBA_OPTION_KEY, array(
        'type'              => 'array',
        'sanitize_callback' => 'cmba_sanitize_settings',
        'default'           => cmba_defaults(),
    ));
}
add_action('admin_init', 'cmba_register_settings');

function cmba_admin_menu() {
    add_options_page(
        __('Custom Map by Argon', 'custom-map-by-argon'),
        __('Custom Map by Argon', 'custom-map-by-argon'),
        'manage_options',
        'custom-map-by-argon',
        'cmba_render_settings_page'
    );
}
add_action('admin_menu', 'cmba_admin_menu');

function cmba_render_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    $s = cmba_get_settings();
    $areas_text = implode("\n", $s['areas']);
    ?>
    <div class="wrap">
      <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
      <form method="post" action="options.php">
        <?php settings_fields('cmba_settings_group'); ?>
        <table class="form-table" role="presentation">
          <tr>
            <th scope="row"><label for="cmba_heading"><?php esc_html_e('Heading', 'custom-map-by-argon'); ?></label></th>
            <td><input name="<?php echo esc_attr(CMBA_OPTION_KEY); ?>[heading]" id="cmba_heading" type="text" class="regular-text" value="<?php echo esc_attr($s['heading']); ?>"></td>
          </tr>
          <tr>
            <th scope="row"><label for="cmba_subheading"><?php esc_html_e('Subheading', 'custom-map-by-argon'); ?></label></th>
            <td><input name="<?php echo esc_attr(CMBA_OPTION_KEY); ?>[subheading]" id="cmba_subheading" type="text" class="regular-text" value="<?php echo esc_attr($s['subheading']); ?>"></td>
          </tr>
          <tr>
            <th scope="row"><label for="cmba_intro_text"><?php esc_html_e('Intro text', 'custom-map-by-argon'); ?></label></th>
            <td><textarea name="<?php echo esc_attr(CMBA_OPTION_KEY); ?>[intro_text]" id="cmba_intro_text" rows="4" class="large-text"><?php echo esc_textarea($s['intro_text']); ?></textarea></td>
          </tr>
          <tr>
            <th scope="row"><?php esc_html_e('Header position', 'custom-map-by-argon'); ?></th>
            <td>
              <fieldset>
                <label>
                  <input type="radio" name="<?php echo esc_attr(CMBA_OPTION_KEY); ?>[header_position]" value="above" <?php checked($s['header_position'], 'above'); ?>>
                  <?php esc_html_e('Full width above the map and sidebar', 'custom-map-by-argon'); ?>
                </label><br>
                <label>
                  <input type="radio" name="<?php echo esc_attr(CMBA_OPTION_KEY); ?>[header_position]" value="right_column" <?php checked($s['header_position'], 'right_column'); ?>>
                  <?php esc_html_e('Right column only — above the area list', 'custom-map-by-argon'); ?>
                </label>
              </fieldset>
            </td>
          </tr>
          <tr>
            <th scope="row"><label for="cmba_areas_text"><?php esc_html_e('Areas (one per line)', 'custom-map-by-argon'); ?></label></th>
            <td><textarea name="<?php echo esc_attr(CMBA_OPTION_KEY); ?>[areas_text]" id="cmba_areas_text" rows="6" class="large-text code"><?php echo esc_textarea($areas_text); ?></textarea></td>
          </tr>
          <tr>
            <th scope="row"><label for="cmba_cta_primary_label"><?php esc_html_e('Primary button label', 'custom-map-by-argon'); ?></label></th>
            <td><input name="<?php echo esc_attr(CMBA_OPTION_KEY); ?>[cta_primary_label]" id="cmba_cta_primary_label" type="text" class="regular-text" value="<?php echo esc_attr($s['cta_primary_label']); ?>"></td>
          </tr>
          <tr>
            <th scope="row"><label for="cmba_cta_primary_url"><?php esc_html_e('Primary button URL', 'custom-map-by-argon'); ?></label></th>
            <td><input name="<?php echo esc_attr(CMBA_OPTION_KEY); ?>[cta_primary_url]" id="cmba_cta_primary_url" type="url" class="regular-text" value="<?php echo esc_attr($s['cta_primary_url']); ?>"></td>
          </tr>
          <tr>
            <th scope="row"><label for="cmba_cta_phone"><?php esc_html_e('Phone (Call button)', 'custom-map-by-argon'); ?></label></th>
            <td><input name="<?php echo esc_attr(CMBA_OPTION_KEY); ?>[cta_phone]" id="cmba_cta_phone" type="text" class="regular-text" value="<?php echo esc_attr($s['cta_phone']); ?>"></td>
          </tr>
        </table>
        <?php submit_button(__('Save Changes', 'custom-map-by-argon')); ?>
      </form>
    </div>
    <?php
}

function cmba_enqueue_assets() {
    $css_url = plugin_dir_url(__FILE__) . 'assets/custom-map-by-argon.css';
    wp_enqueue_style('cmba-style', $css_url, array(), '1.1.0');
}
add_action('wp_enqueue_scripts', 'cmba_enqueue_assets');

/**
 * Render header block (heading, subheading, intro).
 *
 * @param array $s Settings.
 */
function cmba_render_header_block($s) {
    ?>
    <div class="cmba-header-block">
      <p class="cmba-kicker"><?php echo esc_html($s['heading']); ?></p>
      <h2 class="cmba-title"><?php echo esc_html($s['subheading']); ?></h2>
      <p class="cmba-intro"><?php echo esc_html($s['intro_text']); ?></p>
    </div>
    <?php
}

/**
 * Map column: static placeholder, no zoom (+/-) controls.
 */
function cmba_render_map_placeholder() {
    ?>
    <div class="cmba-map" role="img" aria-label="<?php esc_attr_e('Map preview', 'custom-map-by-argon'); ?>">
      <div class="cmba-map-inner">
        <span class="cmba-map-pin" aria-hidden="true"></span>
        <span class="cmba-map-label"><?php esc_html_e('Example Area One', 'custom-map-by-argon'); ?></span>
      </div>
    </div>
    <?php
}

function cmba_render_areas($s) {
    ?>
    <ul class="cmba-areas">
      <?php foreach ($s['areas'] as $area) : ?>
        <li class="cmba-area-item">
          <span class="cmba-area-icon" aria-hidden="true"></span>
          <span class="cmba-area-text"><?php echo esc_html($area); ?></span>
        </li>
      <?php endforeach; ?>
    </ul>
    <?php
}

function cmba_render_ctas($s) {
    $tel = preg_replace('/\D+/', '', $s['cta_phone']);
    $href_call = $tel !== '' ? 'tel:' . $tel : '#';
    ?>
    <div class="cmba-actions">
      <a class="cmba-btn cmba-btn-primary" href="<?php echo esc_url($s['cta_primary_url']); ?>">
        <span class="cmba-btn-label"><?php echo esc_html($s['cta_primary_label']); ?></span>
        <span class="cmba-btn-icon" aria-hidden="true">&rarr;</span>
      </a>
      <a class="cmba-btn cmba-btn-call" href="<?php echo esc_url($href_call); ?>">
        <span class="cmba-call-icon" aria-hidden="true"></span>
        <span class="cmba-call-text">
          <span class="cmba-call-prefix"><?php esc_html_e('Call:', 'custom-map-by-argon'); ?></span>
          <span class="cmba-call-num"><?php echo esc_html($s['cta_phone']); ?></span>
        </span>
      </a>
    </div>
    <?php
}

function cmba_render_widget_inner($s) {
    $layout = $s['header_position'] === 'right_column' ? 'cmba-layout--header-right' : 'cmba-layout--header-above';
    ?>
    <div class="cmba-widget <?php echo esc_attr($layout); ?>">
      <?php if ($s['header_position'] === 'above') : ?>
        <div class="cmba-header-row">
          <?php cmba_render_header_block($s); ?>
        </div>
      <?php endif; ?>

      <div class="cmba-columns">
        <div class="cmba-col cmba-col-map">
          <?php cmba_render_map_placeholder(); ?>
        </div>
        <div class="cmba-col cmba-col-side">
          <?php if ($s['header_position'] === 'right_column') : ?>
            <?php cmba_render_header_block($s); ?>
          <?php endif; ?>
          <?php cmba_render_areas($s); ?>
          <?php cmba_render_ctas($s); ?>
        </div>
      </div>
    </div>
    <?php
}

function cmba_render_widget($atts = array()) {
    $s = cmba_get_settings();
    ob_start();
    ?>
    <section class="cmba-root" data-cmba-widget>
      <div class="cmba-brand">
        <h2 class="cmba-brand-title"><?php esc_html_e('Custom Map', 'custom-map-by-argon'); ?></h2>
        <p class="cmba-brand-by"><?php esc_html_e('by Argon', 'custom-map-by-argon'); ?></p>
      </div>
      <?php cmba_render_widget_inner($s); ?>
    </section>
    <?php
    return ob_get_clean();
}

add_shortcode('custom_map_by_argon', 'cmba_render_widget');
