import parse from 'url-parse';
import generateHash from './generateHash';
import popWindow from './popWindow';

let loginWindow = null;

const {
  query: {
    prefix = 'rc',
    hash = generateHash(),
  },
} = parse(window.location.href, true);

/**
 * @function
 * @global
 * @description oAuthCallback allows redirect to call via window.opener.oAuthCallback if window.opener is not blocked.
 * @param {String} callbackUri
 */
window.oAuthCallback = (callbackUri) => {
  window.parent.postMessage({
    callbackUri,
  }, '*');
}

window.addEventListener('message', ({ data = {} }) => {
  const {
    oAuthUri,
  } = data;
  if (oAuthUri && oAuthUri.trim() !== '') {
    const parsedUri = parse(oAuthUri, true);
    const query = parsedUri.query;
    query.state = `${query.state}-${prefix}-${hash}`;
    parsedUri.set('query', query);
    loginWindow = popWindow(parsedUri.toString(), `${prefix}-oauth`, 600, 600);
  }
});

const key = `${prefix}-${hash}-callbackUri`;
window.addEventListener('storage', (e) => {
  if (e.key === key && e.newValue && e.newValue !== '') {
    const callbackUri = e.newValue;
    localStorage.removeItem(key);
    window.parent.postMessage({
      callbackUri,
    }, '*');
  }
});

try {
  window.parent.postMessage({
    proxyLoaded: true,
  }, '*');
} catch(error) {
  /* ignore error */
}
