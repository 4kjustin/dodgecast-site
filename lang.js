// English/French switch for the website. Pages hold both languages (class="en" and class="fr") and style.css
// hides the other one. Loaded in <head> so the right language shows from the first paint.
// Choice order: ?lang=fr or ?lang=en in the link, the visitor's earlier choice, then the phone's language.
(function () {
  var KEY = 'dodgecast.lang', root = document.documentElement, saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var asked = new URLSearchParams(location.search).get('lang');
  var chosen = asked === 'fr' || asked === 'en' ? asked : saved === 'fr' || saved === 'en' ? saved : null;
  if (asked === chosen && chosen) { try { localStorage.setItem(KEY, chosen); } catch (e) {} }
  var lang = chosen || ((navigator.language || '').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en');
  window.dcChosenLang = chosen;   // the trip page uses the language of the trip unless the visitor chose one
  root.lang = lang; root.setAttribute('data-lang', lang);

  var enTitle = null;
  // What can't be written twice in the page: the tab title, placeholders and screen-reader labels.
  function applyAttributes(l) {
    if (enTitle === null) enTitle = document.title;
    var frTitle = root.getAttribute('data-title-fr');
    if (frTitle) document.title = l === 'fr' ? frTitle : enTitle;
    [['placeholder', 'placeholder'], ['aria-label', 'aria-label']].forEach(function (pair) {
      document.querySelectorAll('[data-fr-' + pair[0] + ']').forEach(function (el) {
        if (!el.hasAttribute('data-en-' + pair[0])) el.setAttribute('data-en-' + pair[0], el.getAttribute(pair[1]) || '');
        el.setAttribute(pair[1], el.getAttribute('data-' + l + '-' + pair[0]));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'lang-toggle';
    function label() {
      var now = root.getAttribute('data-lang');
      btn.textContent = now === 'fr' ? 'English' : 'Français';
      btn.lang = now === 'fr' ? 'en' : 'fr';
    }
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-lang') === 'fr' ? 'en' : 'fr';
      try { localStorage.setItem(KEY, next); } catch (e) {}
      window.dcChosenLang = next;
      if (window.dcReloadOnLang) { location.reload(); return; }
      root.lang = next; root.setAttribute('data-lang', next);
      applyAttributes(next); label();
    });
    label(); applyAttributes(root.getAttribute('data-lang'));
    header.appendChild(btn);
  });
})();
