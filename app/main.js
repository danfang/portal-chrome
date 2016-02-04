chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    "id": "portal-app",
    "innerBounds": {
      "width": 800,
      "height": 640
    }
  });
});
