const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const publicDir = path.resolve(__dirname, '.');

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  try {
    let reqUrl = req.url.split('?')[0] || '/';
    if (reqUrl === '/') reqUrl = '/index.html';
    const safePath = path.normalize(reqUrl).replace(/^\.+/, '');
    const filePath = path.join(publicDir, decodeURIComponent(safePath));

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.end('404 Not Found');
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = mime[ext] || 'application/octet-stream';
      const isText = type.startsWith('text/') || type === 'application/javascript' || type === 'application/json';
      res.setHeader('Content-Type', type + (isText ? '; charset=utf-8' : ''));

      const stream = fs.createReadStream(filePath);
      stream.on('error', () => {
        res.statusCode = 500;
        res.end('500 Server Error');
      });
      stream.pipe(res);
    });
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('500 Server Error');
  }
});

server.listen(port, () => {
  console.log(`Serving ${publicDir} at http://localhost:${port}`);
});
