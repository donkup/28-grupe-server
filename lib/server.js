const http = require('http');
const _data = require('./data');

const config = require('../config');

const adminPageHandler = require('./handlers/admin-main');
const adminServicesPageHandler = require('./handlers/admin-services');
const adminAddServicesPageHandler = require('./handlers/admin-add-service');
const homePageHandler = require('./handlers/home-page');
const aboutPageHandler = require('./handlers/about-page');
const notFoundPageHandler = require('./handlers/404-page');
const loginPageHandler = require('./handlers/login-page');
const registerPageHandler = require('./handlers/register-page');

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
        const binaryFileExtensions = ['woff2', 'woff', 'ttf', 'eot', 'otf', 'png', 'jpg', 'ico'];
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
            jpg: 'image/jpeg',
            ico: 'image/x-icon',
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
                    // 'Cache-Control': 'max-age=3000000',
                })
            }
            return res.end(fileContent);
        } else {
            // PAGES
            let handler = server.routes[trimmedPath];
            handler = typeof handler === 'function' ? handler : server.routes['404'];

            const html = await handler();
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

        // res.writeHead(404, {
        //     'Content-Type': 'text/plain',
        // })
        // return res.end('Content/file not found.');
    })
});

server.routes = {
    '': homePageHandler,
    '404': notFoundPageHandler,
    'about': aboutPageHandler,
    'login': loginPageHandler,
    'register': registerPageHandler,
    'admin': adminPageHandler,
    'admin/services': adminServicesPageHandler,
    'admin/add-service': adminAddServicesPageHandler,
}

server.init = () => {
    server.httpServer.listen(config.httpPort, () => {
        console.log(`Tavo serveris yra pasiekiamas http://localhost:${config.httpPort}`);
    })
}

module.exports = server;