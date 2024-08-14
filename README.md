# Ordotype-Front-Utils Library

This is a feature library designed for the Ordotype-Front project. It provides a range of utilities and tools useful for
enhancing user experience and overall functionality of the project.

## Description

The Ordotype-Front library includes a variety of features and components specifically designed for easy and efficient
integration into the Ordotype-Front project. These features are aimed at improving usability, accessibility, and
efficiency of the project.

## Get Started

Follow these steps to get started with the Ordotype-Front-Utils Library:

1. Add the following script tag to your HTML file to include the library of the latest version:

```html
<!--- unminified --->
<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@0.0.1/src/${component}"></script>

<!--- minified --->
<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@0.0.1/dist/${component}"></script>

```

## Installation (for Development Purposes)

Prerequisites

- Node.js
- pnpm

### Steps

1. Download the Project
    - Clone the repository or download the project files.

2. Install Dependencies
    - Navigate to the project directory and run:

```
pnpm install
```

3. Run the Development Server
    - Navigate to the project directory and run:

```
pnpm run dev
```

## Usage

To use a component from the library, import the relevant script:

```html
<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@0.0.1/src/hideElementOnClick.js"></script>
```

On the same page, add the `x-ordo-utils` attribute followed by the component name to apply the desired functionality to
a specific element:

```html
<div x-ordo-utils="hideElementOnClick">
    <a href="#">I'm a button</a>
</div>
```

## Components

### Hide Element on click

**Main Property**

`x-ordo-utils="hideElementOnClick"`

**Secondary Property**
data-element-to-show
`="${querySelector}"`

*Required.* Must add a css class or id of an available element as query selector to target which element is going to be
shown

**Code Example**

```html

<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@0.0.1/dist/hideElementOnClick.js"></script>
...
<div>
    <a x-ordo-utils="hide-element-onclick" href="#">I'm a button</a>
</div>
```

### Toast

**Main Property**

`x-ordo-utils="toast-component`

**Secondary Property**

`data-show-toast-timeout: milliseconds` <br />
Optional parameter. Indicates how long is the alert be displayed on the screen

**Code Example**

```html

<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@0.0.1/dist/toast.js"></script>
...
<div x-ordo-utils="toast-component">
    <span>I'm a toast component and I show whenever they call me</span>
</div>

<div>
    <a x-ordo-utils="show-toast" data-show-toast-timeout="2000">Click me to show the toast</a>
</div>
```

### Toggle Switch

Copy the Webflow component as it's created with custom components and Webflow classes

**Main Property**

`x-ordo-utils="toggleSwitch"`

**Code Example**

```html

<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@0.0.1/dist/toggleSwitch.js"></script>
...
<label x-ordo-utils="toggleSwitch">
    <input type="checkbox">
    <span x-ordo-utils="slider"></span>
</label>
```

### Tabs

Assign the custom property  `x-ordo-utils="tabs"` to a Webflow tabs component and will work on any number of tab
components on the page

**Main Property**

`x-ordo-utils="tabs"`

**Secondary Properties**

`data-default-width=${number}`

Optional. Fixes issue of current tab not displayed on first load, caused because when tabs are not in view. For example, when a tab is inside a hidden tab

`data-default-left=${number}`

Optional. Used alongside `data-default-width` in case there's padding so the tab is not all the way to the left

**Code Example**

```html

<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@0.0.1/dist/tabs.js"></script>
...
<div class="w-tabs">
    <div class="tabs-menu-pr tm_off w-tab-menu" role="tablist" x-ordo-utils="tabs">
        <a aria-controls="w-tabs-0-data-w-pane-0"></a>
        <a aria-controls="w-tabs-1-data-w-pane-1"></a>
        <a aria-controls="w-tabs-3-data-w-pane-3"></a>
    </div>
    <div class="tabs-content_main w-tab-content">
        ...
    </div>

</div>
```

### Show Element On Click

**Main Property**

`x-ordo-utils="showElementOnClick"`

**Secondary Property**

`data-element-to-show="${querySelector}"`

*Required.* Must add a css class or id of an available element as query selector to target which element is going to be
shown

**Code Example**

```html

<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@latest/dist/showElementOnClick.js"></script>
...
<div class="hidden" id="showElementOnClick">Hi, I was a hidden element</div>
<a class="w-button" data-element-to-show="#showElementOnClick" href="#" x-ordo-utils="showElementOnClick">Click
    me!</a>
```

### Hide Element On Click

**Main Property**

`x-ordo-utils="hideElementOnClick"`

**Secondary Property**

`data-element-to-hide="${querySelector}"`

*Required.* Must add a css class or id of an available element as query selector to target which element is going to be
hidden

**Code Example**

```html

<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@latest/dist/hideElementOnClick.js"></script>
...
<div id="hideElementOnClick">This is some text inside of a div block.</div>
<a class="w-button" data-element-to-hide="#hideElementOnClick" href="#" x-ordo-utils="hideElementOnClick">Click
    me!</a>
```

### Accordion

**Main Property**

`x-ordo-utils="accordion"`

**Secondary Properties**

`data-accordion-elem="question"`
*Required.* Should be a direct child for the main property and sibling to the answer

`data-accordion-elem="answer"`
*Required.* Should be a direct child for the main property and sibling to the question

`data-accordion-elem="icon"` *Optional.*

**Code Example**

```html

<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@latest/dist/accordion.js"></script>
...
<div x-ordo-utils="accordion" class="accordion">
   <div data-accordion-elem="question" class="faq_question">
      <div>Question 1</div> <i data-accordion-elem="icon">+</i>
   </div>
   <div data-accordion-elem="answer" class="faq_answer">
      <div>This is some text inside of a div block.</div>
   </div>
   <div data-accordion-elem="question" class="faq_question">
      <div>Question 2</div> <i data-accordion-elem="icon">+</i>
   </div>
   <div data-accordion-elem="answer" class="faq_answer">
      <div>This is some more text inside of another div block.</div>
   </div>
</div>
```

### Show element after delay

**Main Property**

`x-ordo-utils="showElementAfterDelay"`


**Secondary Properties**

`data-delay-milliseconds=${milliseconds}"`
*Required.* Number (in milliseconds) of time that should be spent before showing the element


**Code Example**

```html

<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@latest/dist/showElementAfterDelay.js"></script>
...
<div class="hiddenElement" x-ordo-utils="showElementAfterDelay" data-delay-milliseconds="5000">This is the element to show after 5000 milliseconds (5 seconds)</div>
<div class="hiddenElement" x-ordo-utils="showElementAfterDelay" data-delay-milliseconds="10000">This is another element to show after 10000 milliseconds (10 seconds)</div>
```


### Toggle Elements
**Main Property**

`x-ordo-utils="toggleElementsOnClick"`

**Secondary Properties**

`data-element-to-show`
Optional. Selector of the element to show when the button is clicked.

`data-element-to-hide`
Optional. Selector of the element to hide when the button is clicked.

**Code Example**

```html
<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@latest/dist/toggleElementsOnClick.js"></script>
...
<!-- Example with both show and hide functionality -->
<button x-ordo-utils="toggleElementsOnClick" data-element-to-show="#elementToShow" data-element-to-hide="#elementToHide">
    Toggle Elements
</button>

<!-- Example with only show functionality -->
<button x-ordo-utils="toggleElementsOnClick" data-element-to-show="#elementToShowOnly">
    Show Element
</button>

<!-- Example with only hide functionality -->
<button x-ordo-utils="toggleElementsOnClick" data-element-to-hide="#elementToHideOnly">
    Hide Element
</button>

<!-- Elements to show/hide -->
<div id="elementToShow" style="display: none;">
    This element will be shown.
</div>
<div id="elementToHide">
    This element will be hidden.
</div>
<div id="elementToShowOnly" style="display: none;">
    This element will be shown only.
</div>
<div id="elementToHideOnly">
    This element will be hidden only.
</div>
```
Usage Notes:

- Assign the x-ordo-utils="toggleElementsOnClick" attribute to the buttons or elements that will trigger the show/hide actions.
- Use the data-element-to-show attribute to specify the ID of the element that should be shown when the button is clicked.
- Use the data-element-to-hide attribute to specify the ID of the element that should be hidden when the button is clicked.
- Both attributes can be used together or separately depending on the required functionality.


## Toggle Cookies Manager
**Main Properties**

`x-ordo-utils="cookieManagerButton"`
This property should be assigned to the open cookie manager button

`x-ordo-utils="cookieManagerClose"`
This property should be assigned in any element that's going to act as a closing button for the cookie manager panel

`x-ordo-utils="cookieManagerBannerClose"`
This property should be added to the cookie banner buttons to hide the banner

## Show on Scroll

This script will hide the element until the page is scrolled past a specified point, considering any offset provided. If no offset is provided, the default value is 0 (element is shown when its top reaches the viewport).

**Main Properties**

`x-ordo-utils="showOnScroll"` The main attribute used to identify elements that should be shown/hidden on scroll.

`data-scroll-offset` An optional attribute to specify how much before or after the element's position the visibility should toggle.


