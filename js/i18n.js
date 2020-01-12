const translate = (function() {
  const nodes = document.querySelectorAll("[data-i18n]");
  nodes.forEach(
    function(node) {
      node.textContent = browser.i18n.getMessage(
        node.getAttribute('data-i18n')
      )
    }
  )
});

window.addEventListener('DOMContentLoaded', (event) => {
    translate();
});
