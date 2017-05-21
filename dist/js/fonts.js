function loadFont(fontName, woffUrl, woff2Url) {
  const nua = navigator.userAgent;
  const noSupport = !window.addEventListener  || (nua.match(/(Android (2|3|4.0|4.1|4.2|4.3))|(Opera (Mini|Mobi))/) && !nua.match(/Chrome/));
  if (noSupport) {
    return;
  }
  let loSto = {};
  try {
    loSto = localStorage || {};
  } catch(ex) {}
  const localStoragePrefix = 'x-font-' + fontName;
  const localStorageUrlKey = localStoragePrefix + 'url';
  const localStorageCssKey = localStoragePrefix + 'css';
  const storedFontUrl = loSto[localStorageUrlKey];
  const storedFontCss = loSto[localStorageCssKey];
  const styleElement = document.createElement('style');
  styleElement.rel = 'stylesheet';
  document.head.appendChild(styleElement);
  if (storedFontCss && (storedFontUrl === woffUrl || storedFontUrl === woff2Url)) {
    styleElement.textContent = storedFontCss;
  } else {
    const url = (woff2Url && supportsWoff2()) ? woff2Url : woffUrl;
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        loSto[localStorageUrlKey] = url;
        loSto[localStorageCssKey] = styleElement.textContent = request.responseText;
      }
    };
    request.send();
  }

  function supportsWoff2() {
    if (!window.FontFace) {
      return false;
    }
    const f = new FontFace('t', 'url("data:application/font-woff2,") format("woff2")', {});
    f.load();
    return f.status === 'loading';
  }
}
