export default (head, html) => `
<!doctype html>
<html ⚡>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    ${head}
    <link rel="stylesheet" type="text/css" href="/static/bundle.css">
    <script src="/static/init.js"></script>
</head>
<body>
    ${html}
</body>
</html>`