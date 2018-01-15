const execa = require('execa');
const path = require('path');
const fs = require('fs-extra');

(async () => {
  await Promise.all([
    execa.shell('npx parcel build --public-url / proxy.html', { stdio: 'inherit' }),
    execa.shell('npx parcel build --public-url / redirect.html', { stdio: 'inherit' })
  ]);
  await Promise.all([
    generateBase64('proxy.html'),
    generateBase64('redirect.html'),
  ]);
})();


async function generateBase64(file) {
  const p = path.resolve('dist', file);
  const content = (await fs.readFile(p, 'utf8')).replace('src="/', 'src="https://apps.ringcentral.com/integrations/oauth/');
  await fs.writeFile(`${p}.base64.txt`, new Buffer(content).toString('base64'));
}

