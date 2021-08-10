const http = require('http');
const _data = require('./data');

const server = {}

server.httpServer = http.createServer((req, res) => {
    const baseURL = `http${req.socket.encrypted ? 's' : ''}://${req.headers.host}`;
    const parsedURL = new URL(req.url, baseURL);
    const parsedPathName = parsedURL.pathname;
    let trimmedPath = parsedPathName.replace(/^\/+|\/+$/g, '');

    req.on('data', (data) => {
        console.log('uzklausa atsiunte duomenu...');
        console.log(data);
    })

    req.on('end', async (data) => {

        const textFileExtensions = ['css', 'js', 'svg'];
        const binaryFileExtensions = ['woff2', 'woff', 'ttf', 'eot', 'otf', 'png', 'jpg', 'jpeg'];
        const urlParts = trimmedPath.split('.');
        const fileExtension = urlParts[urlParts.length - 1];
        const isTextFile = textFileExtensions.includes(fileExtension);
        const isBinaryFile = binaryFileExtensions.includes(fileExtension);

        const MIMES = {
            css: 'text/css',
            js: 'text/javascript',
            svg: 'image/svg+xml',
            woff2: 'font/woff2',
            woff: 'font/woff',
            ttf: 'font/ttf',
            eot: 'application/vnd.ms-fontobject',
            otf: 'font/otf',
            png: 'image/png',
            jpeg: 'image/jpeg',
            jpg: 'image/jpg',
        }

        if (isTextFile || isBinaryFile) {
            let fileContent = '';
            if (isTextFile) {
                fileContent = await _data.readStaticTextFile(trimmedPath);
            } else {
                fileContent = await _data.readStaticBinaryFile(trimmedPath);
            }

            if (fileContent === '') {
                res.writeHead(404, {
                    'Content-Type': MIMES[fileExtension],
                })
            } else {
                res.writeHead(200, {
                    'Content-Type': MIMES[fileExtension],
                })
            }
            return res.end(fileContent);
        } else {
            // PAGES
            if (trimmedPath === '') {
                // HOME PAGE: http://www.example.com
                const html = await _data.readHTML('index');
                if (html === '') {
                    res.writeHead(404, {
                        'Content-Type': 'text/html',
                    })
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    })
                }
                return res.end(html);
            }

            if (trimmedPath === 'about') {
                // ABOUT PAGE http://www.example.com/about
                const html = await _data.readHTML('about');
                if (html === '') {
                    res.writeHead(404, {
                        'Content-Type': 'text/html',
                    })
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    })
                }
                return res.end(html);
            }
        }

        res.writeHead(404, {
            'Content-Type': 'text/plain',
        })
        return res.end('Content/file not found.');
    })
});

server.init = () => {
    server.httpServer.listen(3000, () => {
        console.log('Tavo serveris yra pasiekiamas http://localhost:3000');
    })
}

module.exports = server;
