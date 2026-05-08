import { describe, it, expect }  from 'vitest';
import {
  netlifyTemplate,
  vercelTemplate,
  clientSideTemplate,
} from '../templates';

describe('templates', () => {
  it('renders netlify redirects output', () => {
    const redirects = [
      { from: '/old-one', to: '/new-one' },
      { from: '/old-two', to: '/new-two' },
    ];

    expect(netlifyTemplate(redirects)).toMatchSnapshot();
  });

  it('renders vercel redirects output', () => {
    const redirects = [
      { from: '/old-one', to: '/new-one' },
      { from: '/old-two', to: '/new-two' },
    ];

    expect(vercelTemplate(redirects)).toMatchSnapshot();
  });

  it('renders client-side redirect html output', () => {
    const redirect = {
      from: '/old-path',
      to: '/new-path',
      title: 'I live somewhere else now',
    };

    expect(clientSideTemplate(redirect)).toMatchSnapshot();
  });

  it('escapes HTML in client-side redirect title', () => {
    const redirect = {
      from: '/old-path',
      to: '/new-path',
      title: '</title><script>alert(1)</script>',
    };

    const result = clientSideTemplate(redirect);
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;/title&gt;&lt;script&gt;');
  });

  it('escapes HTML in client-side redirect URL', () => {
    const redirect = {
      from: '/old-path',
      to: '"/><script>alert(1)</script>',
      title: 'Test',
    };

    const result = clientSideTemplate(redirect);
    expect(result).not.toContain('<script>');
    expect(result).toContain('&quot;/&gt;&lt;script&gt;');
  });

  it('strips newlines from netlify redirect paths', () => {
    const redirects = [
      { from: '/old\n/* https://evil.com 301', to: '/new' },
    ];

    const result = netlifyTemplate(redirects);
    expect(result).not.toContain('\n/*');
  });
  
  it('escapes JSON in vercel redirect paths', () => {
    const redirects = [
      { from: '/old", "extra": "injected', to: '/new' },
    ];

    const result = vercelTemplate(redirects);
    const parsed = JSON.parse(result);
    expect(parsed.redirects[0].source).toBe('/old", "extra": "injected');
  });
});
