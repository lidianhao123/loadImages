# loadImages
用于Html5预加载图片资源插件，具备加载进度功能

```javascript
* @description loadImages can preload images and after each image load completed can callback process
 * @param  {object} options - past setting parameters
 * @param  {string[]} options.data - images url array
 * @callback options.step - each step callback function
 *          @param {number} - process number
 * @callback options.complete - all images are loaded
 * @param {boolean} needOneStep - increase by 1 each time
 * @param {string} path - images data string common path
 * @return {boolean}
 * @example
 * loadImages({
 *      data:["1.png", "2.png", "3.png"],
 *      step:function(num){},
 *      compelte: function(){},
 *      needOneStep: true,
 *      path:"/images"
 * });
```
