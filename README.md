# eleventy-plugin-redirects
Because [cool URIs don't change](https://www.w3.org/Provider/Style/URI.html)!
  
Automatically generates Vercel- or Netlify-friendly redirects files (or client-side redirects if you prefer) from `aliases` defined in frontmatter.

All redirects are 301 Moved Permanently; this plugin does not support 302 Moved Temporarily. 

---

## Adding the plugin
Install with npm or yarn:
```
npm install eleventy-plugin-redirects
```
```
yarn add eleventy-plugin-redirects
```

Add the plugin into your `.eleventy.js` config. Pass in the options object with the redirects template you want (permitted values are `netlify`, `vercel` or `clientSide`).
```
const redirectsPlugin = require('eleventy-plugin-redirects');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(redirectsPlugin, {
    template: 'netlify'; // netlify, vercel or clientSide
  })
}
```

## Defining redirects
Define redirects in the frontmatter for your pages with the `aliases` key, and this plugin will add them to a `redirects` collection.

```yaml
---
title: My lovely blog post
aliases:
- /2022/02/my-lovely-blog-post
---
```

You can have multiple aliases!

```yaml
---
title: Blog
aliases:
- /posts
- /writing
---
```

## Creating a redirects file 

### Netlify/Vercel
**Warning: if you already have a `vercel.json` file, this plugin will not work and may overwrite your existing config. Don't use this plugin if you already have `vercel.json` config.** 

Create a `redirects.njk` file in the same directory as your index page (it can be called anything, really, as long as it's in the right place). This file will call the `redirects` shortcode with `collections.redirects`. If you're using a different template engine, create a file with the appropriate extension. 

The frontmatter should contain a `permalink` key, which will be:

* `permalink: /_redirects` for Netlify, or
* `permalink: /vercel.json` for Vercel.

You'll also want to add `eleventyExcludeFromCollections: true` to stop your redirects page being added to Eleventy's collections.

Example `_redirects.njk` for Netlify:
```
---
permalink: /_redirects 
eleventyExcludeFromCollections: true
---
{% redirects %}
```


## Client-side redirects

A bit more work is involved to get this set up, but this will generate an `index.html` file for each alias which has a meta tag pointing to the new location.

### Paginate the redirects
We'll use a [Javascript template](https://www.11ty.dev/docs/languages/javascript/), so that we can take advantage of computed values. 
Create the file `redirects.11ty.js` in the same directory as all your other pages. Paste in the following:

```
class Redirects {
  data() {
    return {
      pagination: {
        data: 'collections.redirects',
        size: 1,
        alias: 'redirect',
        addAllPagesToCollections: true,
      },
      tags: 'page',
      layout: 'redirects.njk',
      eleventyComputed: {
        permalink: ({ redirect }) => `${redirect.from}/index.html`,
      },
      eleventyExcludeFromCollections: true,
    };
  }

  render() {
    return null;
  }
}

module.exports = Redirects;

```
NB If you keep your layouts in a subfolder of `_includes`, you'll need to change the `layout: 'redirects.njk'` value to include the subfolder.

This tells Eleventy to paginate the `collections.redirects` collection (which the plugin creates for you), creating a subdirectory with an index.html page for each one. 

### Create the template file
Create a `redirects.njk` file where you keep your layouts (if you're using a different template engine, create a file with the appropriate extension). Call the `redirects` shortcode with `redirect` (the data we paginated). 

```
{% redirects redirect %}
```

## Build your own template
The plugin generates a collection called `redirects` which has two values:

* `from` - the alias you want to redirect from
* `to` - the URL you are redirecting to
* `title` - the title of the page

You can use this collection in a template by accessing `collections.redirects` and iterating through the contents.

---

## Author
Sophie Koonin - [localghost.dev](https://localghost.dev) / [@type__error](https://twitter.com/type__error)

