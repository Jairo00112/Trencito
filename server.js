const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const rootDir = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const requestedPath = req.url.split('?')[0];
  const normalizedPath = path.normalize(requestedPath === '/' ? '/trencito.html' : requestedPath).replace(/^\.(?:\/|\\)/, '');
  const absolutePath = path.join(rootDir, normalizedPath);

  if (!absolutePath.startsWith(rootDir)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  const serveFile = (targetPath) => {
    fs.readFile(targetPath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Archivo no encontrado');
        } else {
          res.statusCode = 500;
          res.end('Error interno del servidor');
        }
        return;
      }

      const ext = path.extname(targetPath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  };

  if (requestedPath === '/' || requestedPath === '/index.html') {
    serveFile(path.join(rootDir, 'trencito.html'));
    return;
  }

  serveFile(absolutePath);
});

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
