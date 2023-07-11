# unicorn-studio-sdk

```
<div class="unicorn-embed" id="unicorn"></div>
<script>
  UnicornStudio.init({
    elementId: 'unicorn',
    fps: 60,
    scale: 1,
    projectId: 'YOUR_VERSION_ID'
  }).then(() => {
    // Scene is ready
  }).catch((err) => {
    console.error(err);
  });
</script>
```
