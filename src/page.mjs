export default (head, css, html) => `
<!doctype html>
<html ⚡>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    ${head}
    <link rel="stylesheet" type="text/css" href="../bundle.css">
</head>
<body>
    ${html}
    <script async src="../init.js"></script>
</body>
</html>`