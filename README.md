# viewport

Viewport does not just add jQuery selectors. It gives you comprehensive accees to an elements viewport situation. You can determine if an element is in a particular viewport, and how far it is in it. Also there is not only one viewport, but 5. A main viewport, which will be (at first) the whole screen. And then ther are four more, the top-, bottom-, left- and right-viewport.

## How it works
The viewports are defined when you apply the viewport widget to an element.
```
var elem = $('.my-elem').viewport();
```
If you want ot know if the element is in the viewport, just call the "inViewport" method.
```
var elem = $('.my-elem').viewport();
var isElemInViewport = console.log(elem.viewport('inViewport'));
```
That gives you a true or false. If you add a parameter value true, you will recieve how far the element is in the viewport.
```
var percentElemInViewport = console.log(elem.viewport('inViewport', true));
```
Similar to the method "inViewport" the ar methods for teh top-, bottom-, left-, and right-viewport.
```
var isElemInTopViewport = console.log(elem.viewport('inTopViewport'));
var isElemInBottomViewport = console.log(elem.viewport('inBottomViewport'));
var isElemInLeftViewport = console.log(elem.viewport('inLeftViewport'));
var isElemInRightViewport = console.log(elem.viewport('inRightViewport'));
```
But all that gives you just the current status of an element. What if the user starts to scroll (spooky!)? The widget also provides some events. The most used would be the "positionUpdate"-event. It gives you updated informations, everytime the elements viewport status changes. E.g. this could bue used for a nice opacity effect.
```
var elem = $('.my-elem').viewport({
    positionUpdate: function(event, data) {
        if (data.percent.overall > 0) {
            $(this).css({ opacity: data.percent.overall / 100 });
        } else {
            $(this).css({ opacity: 0 });
        }
    }
});
```
The returning data value gives you plenty of informations regarding the viewport of an element. In this case, we are observing how far the element is in the main-viewport. The effect is, that the opacity decreases if the element leaves the main-viewport, until it has completely left the main-viewport and the opycity is set to 0.

### What about 5 viewports instead of 1?
As said ther is not only the main-viewport. There are four more viewports, the top-, bottom-, left- and right-viewport. With these four more viewports you could do some more functionality to your page using viewport controll. By default all these four viewports are are devided into equal pices for both teh horizontal and the vertical ones. So the top-viewport starts at the top of the body element, and is half the size the body element is. The bottom element also is, but starts from the bottom of the body element. Vice versa the left- and right-viewports are starting form the left (or the right) and are half the size the body element is. This means a 50:50 segmentation.
Now gues what, you can manipulate the segmentation. You can name relative or absolute values for that, and even mix them. So the top-viewport could have a fixed height of 100px, while the bottom-viewport has a relative height of 25%.
```
var elem = $('.my-elem').viewport({
    segmentation: {
        topBottom: '100px:20',
        leftRight: '200px:20'
    },
});
```
As you cann see, if no unit is defined, the widget treats the value as relative. Using this, you can define the four additional viewports as an inner frame of teh main-viewport.

### What if the main area of your website does not cover the whole body element?
Threshold is the key. You cann define a singel threshold, whitch takes affect for all four sides of teh main-viewport.
```
var elem = $('.my-elem').viewport({
  threshold: 50
});
```
This creates a "padding" of 50px around the main-viewport. If you want different thresholds for each side, you can simply define them.
```
var elem = $('.my-elem').viewport({
  threshold: 50,
  thresholdTop: 0,
  thresholdBottom: 0
});
```
This creates a "padding" of 50px on teh left and the right side of the main-viewport, but not at the top or the bottom.

### Debuggin
To debug your viewports, you can use the "showViewports" option. It can take six different values:
- all: shows all viewports
- top: shows the top-viewport only
- bottom: shows the bottom-viewport only
- left: shows the left-viewport only
- right: shows the right-viewport only
- false: shows none of the viewports
```
var elem = $('.my-elem').viewport({
  showViewports: 'all'
});
```
