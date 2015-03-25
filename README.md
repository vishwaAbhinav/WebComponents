# WebComponents
Experiments with webcomponents

This repository hosts a filter web-component which can be used by importing it in your document like below : 
```html
<link rel="import" href="/path/to/custom-filter.html">
```
Here is a declarative way to use it :

```html
<custom-filter>
  <title-holder>test filter</title-holder>
  <ul>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
    <li>item 4</li>
    <li>item 5</li>
</custom-filter>
```

Here is another way to use it via javascript :

```javascript
var Bundles = new CustomFilter();
Bundles.header = "Bundles";

var listElements = ["Bundle 1", "Bundle 2", "Bundle 3", "Bundle 4","Bundle 5", "Bundle 6", "Bundle 7", "Bundle 8", "Bundle 9", "Bundle 10"];
Bundles.universe = listElements;
Bundles.visibleElements = 7;
document.body.appendChild(Bundles);
```
