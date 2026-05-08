# Changelog: eleventy-plugin-redirects

## Version 1.1.0 
Thanks to @nfriedly for your contributions!

### Added
- You can now define specific redirects in config as well as in frontmatter. Great if you want to redirect to external pages. (@nfriedly)

### Changed
- Redirects are now sanitized (HTML escaped for client-side, JSON-stringified for Netlify/Vercel.)

### Fixed
- We now use `collection.getAll()` instead of just filtering for `md` files in `src/**` - so if your directory structure doesn't match that, it'll work now. (@nfriedly)


