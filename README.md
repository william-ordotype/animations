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
<div x-ordo-utils="hide-element-onclick">
    <a href="#">I'm a button</a>
</div>
```

## Components

### Hide Element on click

**Main Property**

`x-ordo-utils="hide-element-onclick"`

**Secondary Property**

`data-element-to-show="${querySelector}"`

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

