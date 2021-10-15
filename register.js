(async () => {
  try {
    if ((await navigator.serviceWorker.getRegistrations()).length === 0) {
      navigator.serviceWorker.ready.then(() => {
        window.location.reload();
      });
    }
    await navigator.serviceWorker.register('sw.js');
  } catch (error) {
    console.error('Service worker registration failed', error);
  }
})();