const { netlifyTemplate } = require('./templates');

module.exports = (config, option = {}) => {
  config.addCollection('redirects', (collection) => {
    const pages = collection.getFilteredByGlob('./src/**/*.md');
    const aliases = pages.map((page) => {
      if (!page.data.aliases) return null;
      return page.data.aliases.map((alias) => ({
        from: alias,
        to: page.url,
      }));
    });

    return aliases.filter(Boolean).flat();
  });

  config.addShortcode('redirectsPage', (options = {}) => {
    const { template = 'netlify' } = options;

    switch (template) {
      case 'netlify':
        return netlifyTemplate;
      case 'vercel':
        return vercelTemplate;
      case 'clientSide':
        return clientSideTemplate;
      default:
        throw new Error('No template provided');
    }
  });
};
