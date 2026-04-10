#!/usr/bin/env bash
# Install "Custom Map by Argon" from this repo's zip using WP-CLI.
#
# Usage (from your WordPress root on your machine):
#   bash /path/to/LumiScapeEn/wordpress-plugin/install-with-wp-cli.sh
#
# Or set WP_PATH to your WordPress directory:
#   WP_PATH=/path/to/wordpress bash install-with-wp-cli.sh
#
# Requires: wp (WP-CLI), unzip optional (wp can install from zip directly)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ZIP="${SCRIPT_DIR}/custom-map-by-argon.zip"

if [[ ! -f "$ZIP" ]]; then
  echo "Missing: $ZIP" >&2
  exit 1
fi

if ! command -v wp >/dev/null 2>&1; then
  echo "WP-CLI (wp) not found. Install from https://wp-cli.org/ or use wp-admin upload." >&2
  exit 1
fi

ROOT="${WP_PATH:-}"
if [[ -z "$ROOT" ]]; then
  if wp core is-installed 2>/dev/null; then
    ROOT="."
  else
    echo "Run this from your WordPress root, or set WP_PATH=/path/to/wordpress" >&2
    exit 1
  fi
fi

echo "Installing Custom Map by Argon from:"
echo "  $ZIP"
wp plugin install "$ZIP" --activate --path="$ROOT"
echo "Done. Shortcode: [custom_map_by_argon]"
