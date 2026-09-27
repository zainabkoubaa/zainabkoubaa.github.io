// Retain the current section when switching the homepage language.
for (const link of document.querySelectorAll('.language-switch a')) {
  link.addEventListener('click', () => {
    if (location.hash && document.querySelector(location.hash)) link.hash = location.hash;
  });
}
