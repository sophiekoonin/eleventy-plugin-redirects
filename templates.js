const escapeHtml = (str) =>
  str.replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;');


const stripNewlines = (str) => str.replace(/[\r\n]/g, '');

const netlifyTemplate = (redirects) => {
  return redirects
    .map((redirect) => `${stripNewlines(redirect.from)} ${stripNewlines(redirect.to)}`)
    .join('\n');
};

const vercelTemplate = (redirects) =>
  `{
  "redirects": [
    ${redirects
      .map(
        (redirect) =>
          `{ "source": ${JSON.stringify(redirect.from)}, "destination": ${JSON.stringify(redirect.to)} }`
      )
      .join(',\n')}
  ]
}`.trim();

const clientSideTemplate = (redirect) => `
<!DOCTYPE html>
<html>
  <head>
    <title>${escapeHtml(redirect.title)}</title><link rel="canonical" href="${escapeHtml(redirect.to)}"/><meta name="robots" content="noindex"><meta charset="utf-8"/><meta http-equiv="refresh" content="0; url=${escapeHtml(redirect.to)}"/>
  </head>
</html>
`;

module.exports = {
  netlifyTemplate,
  vercelTemplate,
  clientSideTemplate,
};
