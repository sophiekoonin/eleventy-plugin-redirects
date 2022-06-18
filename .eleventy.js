const {
  netlifyTemplate,
  vercelTemplate,
  clientSideTemplate,
} = require('./templates');

module.exports = {
  initArguments: {},
  configFunction: (config, options = {}) => {
    const { template = 'netlify' } = options;

    config.addCollection('redirects', (collection) => {
      const pages = collection.getFilteredByGlob('./src/**/*.md');
      const aliases = pages.map((page) => {
        if (!page.data.aliases) return null;
        return page.data.aliases.map((alias) => ({
          from: alias,
          to: page.url,
          title: page.data.title,
        }));
      });

      return aliases.filter(Boolean).flat();
    });

    config.addShortcode('redirects', (redirects) => {
      switch (template) {
        case 'netlify':
          return netlifyTemplate(redirects);
        case 'vercel':
          return vercelTemplate(redirects);
        case 'clientSide':
          return clientSideTemplate(redirects);
        default:
          throw new Error('No template provided');
      }
    });
  },
};
