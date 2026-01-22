const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

let goBackButton = document.getElementById('go-back-button');

goBackButton.addEventListener('click', () => {
  window.history.back();
});
