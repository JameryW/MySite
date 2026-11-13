/* Last-resort notice: this site renders its listings and detail pages with
   JavaScript. If app.js never runs — old WebView that cannot parse it, a
   blocked or failed script, a browser extension — the page keeps its static
   hero and silently loses every card, which reads as a broken site. <noscript>
   does not cover this case because JS is enabled, it just failed.

   Keep this file ES5 and dependency-free: it must run on the same engines that
   failed to run app.js. It is loaded with `defer`, so it runs after app.js has
   had its chance, then re-checks for a few seconds in case app.js arrives late. */
(function () {
  var CONTAINERS =
    '[data-home-projects],[data-project-library],[data-note-library],[data-project-detail],[data-note-detail],[data-showcase]';
  var CARDS = '.work-card,.note-card,.repo-card,.note-entry-card,.showcase-card,.track-card';
  var tries = 0;

  function rendered() {
    return document.querySelectorAll(CARDS).length > 0;
  }

  function remove() {
    var box = document.getElementById('boot-guard');
    if (box && box.parentNode) box.parentNode.removeChild(box);
  }

  function show() {
    if (!document.querySelector(CONTAINERS)) return;
    if (rendered()) {
      remove();
      return;
    }
    if (!document.getElementById('boot-guard')) {
      var box = document.createElement('div');
      box.id = 'boot-guard';
      box.className = 'boot-guard';
      box.setAttribute('role', 'status');
      box.innerHTML =
        '<p><strong>内容未能加载。</strong>这些条目由脚本渲染，而脚本在当前浏览器上没有运行成功。' +
        '<a href="./archive.html">查看静态站点索引</a>，或在 <a href="./llms-full.txt">llms-full.txt</a> 读完整文本。</p>' +
        '<p><strong>Content failed to load.</strong> These entries are rendered by JavaScript, ' +
        'which did not run in this browser. Read the <a href="./archive.html">static index</a> ' +
        'or the full text in <a href="./llms-full.txt">llms-full.txt</a>.</p>';
      // First child of <main>: it lands under the nav and inherits the page's
      // horizontal padding, so it lines up with the content it explains.
      var host = document.querySelector('main') || document.querySelector('.site-frame') || document.body;
      host.insertBefore(box, host.firstChild);
    }
    // app.js may still be in flight on a slow link: stop watching once it lands.
    if (tries < 20) {
      tries += 1;
      setTimeout(show, 500);
    }
  }

  function start() {
    setTimeout(show, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
