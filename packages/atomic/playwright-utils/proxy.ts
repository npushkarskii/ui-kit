import * as http from 'http';
import {createProxyServer} from 'http-proxy';

// Create a proxy server
const proxy = createProxyServer();

// Create an HTTP server to listen for requests
const server = http.createServer((req, res) => {
  // Log the intercepted request
  console.log(`Intercepted request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);

  // Proxy the request to the target server
  // PROXY POC
  proxy.web(req, res, {
    target: 'https://platform.cloud.coveo.com',
    changeOrigin: true,
  });
});

// Listen on port 8000
server.listen(8000, () => {
  console.log('Proxy server is running on http://localhost:8000');
});
