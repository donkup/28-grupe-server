const _data = require('../data');

async function aboutPageHandler() {
    let headHTML = await _data.readTemplateHTML('head');
    const headerHTML = await _data.readTemplateHTML('header');
    const footerHTML = await _data.readTemplateHTML('footer');
    const aboutHTML = await _data.readTemplateHTML('about');

    headHTML = headHTML.replace('{{page-css}}', 'about');

    return `<!DOCTYPE html>
            <html lang="en">
                ${headHTML}
                <body>
                    ${headerHTML}
                    <main>
                        ${aboutHTML}
                    </main>
                    ${footerHTML}

                    <script src="/js/demo.js" type="module" defer></script>
                </body>
            </html>`;
}

module.exports = aboutPageHandler;