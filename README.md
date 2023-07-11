# unicorn-studio-sdk

Add the script tag to the `<head>` of your page
```html
<script src="https://cdn.unicorn.studio/unicornStudio.umd.js"></script>
```

Initialize your scene:
```html
<div class="unicorn-embed" id="unicorn"></div>
<script>
  UnicornStudio.init({
    elementId: 'unicorn', // id of the HTML element to render your scene in (the scene will use its dimensions)
    fps: 60, // frames per second (0-120)
    scale: 1, // rendering scale, use smaller values for performance boost (0-1)
    dpi: 1 // pixel ratio
    projectId: 'YOUR_PROJECT_EMBED_ID' // the id string for your embed (get this from "embed" export)
  }).then(() => {
    // Scene is ready
  }).catch((err) => {
    console.error(err);
  });
</script>
```
