#!/usr/bin/env bash
# Set proper encoding for Jekyll build
export RUBYOPT="-E UTF-8:UTF-8"

# Run Jekyll build directly (for local development)
# Note: GitHub Pages will handle its own build process
/opt/rbenv/versions/3.3.6/lib/ruby/gems/3.3.0/gems/jekyll-3.10.0/exe/jekyll build "$@"
