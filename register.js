(async () => {
  try {
    await navigator.serviceWorker.getRegistrations();
    navigator.serviceWorker.ready.then(() => {
      if (!navigator.serviceWorker.controller) window.location.reload();
    });
    await navigator.serviceWorker.register('/sw.js');
  } catch (error) {
    console.error('Service worker registration failed', error);
  }
})();
