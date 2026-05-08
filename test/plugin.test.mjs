import { describe, it, expect, vi }  from 'vitest';
import plugin from '../.eleventy';
import {
  netlifyTemplate,
  vercelTemplate,
  clientSideTemplate,
} from '../templates';

function setupPlugin(options) {
  const collections = {};
  const shortcodes = {};

  const config = {
    addCollection: (name, callback) => {
      collections[name] = callback;
    },
    addShortcode: (name, callback) => {
      shortcodes[name] = callback;
    },
  };

  plugin.configFunction(config, options);

  return { collections, shortcodes };
}

describe('plugin config', () => {
  it('creates redirects collection from aliases and skips pages without aliases', () => {
    const { collections } = setupPlugin();
    const fakeCollection = {
      getAll: vi.fn().mockReturnValue([
        {
          data: { title: 'First post', aliases: ['/old-1', '/older-1'] },
          url: '/first-post',
        },
        {
          data: { title: 'Second post' },
          url: '/second-post',
        },
        {
          data: { title: 'Third post', aliases: ['/old-3'] },
          url: '/third-post',
        },
      ]),
    };

    const redirects = collections.redirects(fakeCollection);

    expect(fakeCollection.getAll).toHaveBeenCalled();
    expect(redirects).toEqual([
      { from: '/old-1', to: '/first-post', title: 'First post' },
      { from: '/older-1', to: '/first-post', title: 'First post' },
      { from: '/old-3', to: '/third-post', title: 'Third post' },
    ]);
  });

  it('includes config-based redirects', () => {
    const { collections } = setupPlugin({
      redirects: {
        '/legacy-page': '/new-page',
        '/another-old': '/another-new',
      },
    });
    const fakeCollection = {
      getAll: vi.fn().mockReturnValue([]),
    };

    const redirects = collections.redirects(fakeCollection);

    expect(redirects).toEqual([
      { from: '/legacy-page', to: '/new-page' },
      { from: '/another-old', to: '/another-new' },
    ]);
  });

  it('merges config-based redirects with alias-based redirects', () => {
    const { collections } = setupPlugin({
      redirects: { '/config-old': '/config-new' },
    });
    const fakeCollection = {
      getAll: vi.fn().mockReturnValue([
        {
          data: { title: 'A post', aliases: ['/alias-old'] },
          url: '/a-post',
        },
      ]),
    };

    const redirects = collections.redirects(fakeCollection);

    expect(redirects).toEqual([
      { from: '/alias-old', to: '/a-post', title: 'A post' },
      { from: '/config-old', to: '/config-new' },
    ]);
  });

  it('uses netlify template by default', () => {
    const { shortcodes } = setupPlugin();
    const redirects = [{ from: '/old', to: '/new' }];

    expect(shortcodes.redirects(redirects)).toBe(netlifyTemplate(redirects));
  });

  it('routes to vercel template when configured', () => {
    const { shortcodes } = setupPlugin({ template: 'vercel' });
    const redirects = [{ from: '/old', to: '/new' }];

    expect(shortcodes.redirects(redirects)).toBe(vercelTemplate(redirects));
  });

  it('routes to client-side template when configured', () => {
    const { shortcodes } = setupPlugin({ template: 'clientSide' });
    const redirect = { from: '/old', to: '/new', title: 'Moved' };

    expect(shortcodes.redirects(redirect)).toBe(clientSideTemplate(redirect));
  });

  it('throws for unknown template value', () => {
    const { shortcodes } = setupPlugin({ template: 'unknown-template' });

    expect(() => shortcodes.redirects([])).toThrow('No template provided');
  });
});
