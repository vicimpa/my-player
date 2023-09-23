import App from "app.svelte";

new App({
  target: document.getElementById('app')
});

addEventListener('contextmenu', e => e.preventDefault());