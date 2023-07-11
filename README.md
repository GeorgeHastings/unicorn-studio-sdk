# unicorn-studio-sdk

Add the script tag to the `<head>` of your page
```html
<script src="https://embed-unicorn-studio.vercel.app/unicornStudio.umd.js"></script>
```

Initialize your scene:
```html
<div class="unicorn-embed" id="unicorn"></div>
<script>
  UnicornStudio.init({
    elementId: 'unicorn',
    fps: 60,
    scale: 1,
    projectId: 'YOUR_PROJECT_EMBED_ID'
  }).then(() => {
    // Scene is ready
  }).catch((err) => {
    console.error(err);
  });
</script>
```
