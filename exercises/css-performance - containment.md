# CSS Performance - Containment

In this exercise you will learn how simple css tricks can have a dramatic impact on the
runtime performance of your application.
We are already aware of the browser render pipeline and know what triggers layout, paint
and style recalculations and in some cases how to avoid them completely.

Anyway, there will always be situations where you cannot avoid execution work in order to get the
desired outcome. However, you as a developer still have options to improve whatever will be executed.

By using the new `css containment` API, you can proactively help the browser to determine sections it can
ignore to relayout, repaint or even completely detach it from the render tree.

## Contain Layout for `.ui-toolbar`

Start off by measuring the current state. Open your browser to show you any movie list,
e.g. `http://localhost:4200/list/popular`.

As we want to make sure the layout will be contained inside of `.ui-toolbar`, let's trigger
a layout inside it. Click the `ui-search-bar` component in order to trigger its animation.
As it is expanding by changing its width, we can be sure the browser has to relayout.

**searchbar animation**
![searchbar-animation](images/css-contain/searchbar-animation.gif)

Open the devtools with `F12` or `Ctrl + Shift + I` and open the `Performance Tab`.
Create a recording of the searchbar animation an analyse the created profile.

You should see a bunch `layout` tasks being executed while the animation is ongoing.
Inspect a single layout task in order to see its details.
The following metrics are important:
* runtime in ms
* amount of affected DOM Nodes 
* layout root

You should see a similar result to the following:

![ui-toolbar-layout](images/css-contain/ui-toolbar-layout.png)

As you can see, the layout root is `document` and it had to check > `700` nodes in order to find
out what has to get relayouted and what doesn't.

Your task is to implement a css based solution that improves the layout performance and in best case
sets the `layout root` to `.ui-toolbar`.

You have two options to implement this. You either choose to use `contain: strict` or set proper
dimensions and go with `contain: content`. Either way, implement your changes in `app-shell.component.scss`.

<details>
  <summary>contain: strict</summary>

```scss
// app-shell.component.scss

.ui-toolbar {
  /* other stuff */
  contain: strict;
}
```

</details>

<details>
  <summary>contain: content & dimensions</summary>

```scss
// app-shell.component.scss

.ui-toolbar {
  /* other stuff */
  contain: content;
  width: calc(100vw - 250px); // subtract sidebar width

  @include isMobile {
    width: 100vw;
  }
  
}
```

</details>

When you've finished the implementation, please repeat the measurements from before. Inspect the summary of the 
`layout` task again. You should now notice the `Layout` root being set to the set boundary.
Furthermore, the execution time dropped dramatically as well as the amount of inspected dom nodes.

![search-bar-layout-contained](images/css-contain/search-bar-layout-contained.png)

## Contain Layout for `ui-sidedrawer`

Start off by measuring the current state. Open your browser to show you any movie list,
e.g. `http://localhost:4200/list/popular`.

As we want to make sure the layout will be contained inside of `ui-sidedrawer`, let's trigger
a layout inside it. Hover over any navigation item.
As it is setting its font-weight to `bold`, we can be sure the browser has to relayout.

![sidebar-layout](images/css-contain/sidebar-layout.gif)

You should notice a `layout` task being executed whenever you hover an item.
Inspect a single layout task in order to see its details.
The following metrics are important:
* runtime in ms
* amount of affected DOM Nodes
* layout root

You should see a similar result to the following:

![sidebar-layout](images/css-contain/sidebar-layout.png)

As you can see, the layout root is `document` and it had to check > `700` nodes in order to find
out what has to get relayouted and what doesn't.

Your task is to implement a css based solution that improves the layout performance and in best case
sets the `layout root` to `.side-drawer`.

You have two options to implement this. You either choose to use `contain: strict` or set proper
dimensions and go with `contain: content`. Either way, implement your changes in `side-drawer.component.scss`.

<details>
  <summary>contain: strict</summary>

```scss
// side-drawer.component.scss

.side-drawer {
  /* other stuff */
  contain: strict;
}
```

</details>

<details>
  <summary>contain: content & dimensions</summary>

```scss
// side-drawer.component.scss

.side-drawer {
  /* other stuff */
  contain: content;
  height: 100vh;  
}
```

</details>

When you've finished the implementation, please repeat the measurements from before. Inspect the summary of the
`layout` task again. You should now notice the `Layout` root being set to the configured boundary.
Furthermore, the execution time dropped dramatically as well as the amount of inspected dom nodes.

![side-drawer-layout-contained](images/css-contain/side-drawer-layout-contained.png)

## Native Virtual Scrolling for MovieList

Until now, we've tried to reduce the work the browser has to perform on DOM interaction by proactively
dividing our applications template into layoutable areas.
Anyway, scrollable growing containers are not going to benefit from this solution. The more content
it contains, the higher the layouting effort will be for the browser.

A common solution to this problem is to use `virtual-scrolling`. For dynamic masonry/grid-like
layouts you will have a hard time finding a proper javascript based solution, though. 
However, there are still options to improve heavy content containers and reduce its layouting cost.

Start off by measuring the runtime performance of any movie-list with **small contents** & **large contents**. 
The movie list grows when you scroll down to trigger the pagination.

We want to do two measurements for comparison, one with a small list (no pagination), one with a large list (> 5 pages loaded).
Do a measurement of the `tilt` animation as well as measure the performance of the task
whenever items are added as a result of the pagination for both of the states.

If you compare the two measurements created with small and large amounts of content, you will
immediately spot the difference in terms of executed work. Below you find screenshots of
example measurements. You should see similar results.

**Small List**
![content-visibility-initial-small](images/css-contain/content-visibility-initial-small.png)

**Large List**
![content-visibility-initial-large](images/css-contain/content-visibility-initial-large.png)

**Comparison**
![content-visibility-initial-comparison](images/css-contain/content-visibility-initial-comparison.png)

Now it's your task to implement a css based solution to improve the performance even in situations
where the user has loaded a lot of movies to the DOM.

Assign `content-visibility: auto;` to the `movie-card` in order to make use of the browser
native virtual-scrolling.

> Tip: don't forget about `contain-intrinsic-size` :)

Repeat the measurements from before with a small and a large list. 

If you've done right, you should notice that the amount of DOM Nodes isn't affecting the runtime
performance anymore.

This is the case because every item out of viewport will be detached from the RenderTree.
The browser will even give a hint about that. Try to select an out-of-viewport item via the
`Elements` panel in the dev tools.

![contain-visibility-detached-from-rendering](images/css-contain/contain-visibility-detached-from-rendering.png)

Well done! You've successfully implemented a native virtual scrolling solution :-)
