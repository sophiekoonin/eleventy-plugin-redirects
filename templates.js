const sharedTemplate = (inner) => `
{%- for page in collections.all -%}
  {%- if page.url and page.data.aliases.length %}
    {%- for alias in page.data.aliases -%}
    ${inner}
    {%- endfor -%}
  {%- endif -%}
{%- endfor -%}
`;

const netlifyTemplate = sharedTemplate('{{ alias }}  {{ page.url }}');

const vercelTemplate = `
{
  "redirects": [
    ${sharedTemplate(
      `{ "source": {{ alias }}, "destination": {{ page.url }} }{% if not loop.last %},{% endif %}`
    )}
  ]
}`;

const clientSideTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <title>{{ redirect.to }}</title><link rel="canonical" href="{{ redirect.to }}"/><meta name="robots" content="noindex"><meta charset="utf-8"/><meta http-equiv="refresh" content="0; url={{redirect.to}}"/>
  </head>
</html>
`;

module.exports = {
  netlifyTemplate,
  vercelTemplate,
  clientSideTemplate,
};
