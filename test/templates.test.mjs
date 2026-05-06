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
});
