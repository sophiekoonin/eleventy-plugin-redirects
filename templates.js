const netlifyTemplate = (redirects) => {
  return redirects
    .map((redirect) => `${redirect.from} ${redirect.to}`)
    .join('\n');
};

const vercelTemplate = (redirects) =>
  `{
  "redirects": [
    ${redirects
      .map(
        (redirect) =>
          `{ "source":  "${redirect.from}", "destination":"${redirect.to}" }`
      )
      .join(',\n')}
  ]
}`.trim();

const clientSideTemplate = (redirect) => `
<!DOCTYPE html>
<html>
  <head>
    <title>${redirect.title}</title><link rel="canonical" href="${redirect.to}"/><meta name="robots" content="noindex"><meta charset="utf-8"/><meta http-equiv="refresh" content="0; url=${redirect.to}"/>
  </head>
</html>
`;

module.exports = {
  netlifyTemplate,
  vercelTemplate,
  clientSideTemplate,
};
