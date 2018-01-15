const execa = require('execa');
const path = require('path');

execa.shell('npx parcel watch --public-url / proxy.html', { stdio: 'inherit' });
execa.shell('npx parcel watch --public-url / redirect.html', { stdio: 'inherit' });
execa.shell('npx http-server -p 8201', { stdio: 'inherit', cwd: path.resolve('dist') });
