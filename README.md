Here's the README for your repository in English:

---

# Ordotype-Front-Utils Library

This is a feature library designed for the Ordotype-Front project. It provides a range of utilities and tools useful for enhancing user experience and overall functionality of the project.

## Description

The Ordotype-Front library includes a variety of features and components specifically designed for easy and efficient integration into the Ordotype-Front project. These features are aimed at improving usability, accessibility, and efficiency of the project.

## Get Started
Follow these steps to get started with the Ordotype-Front-Utils Library:


1. Add the following script tag to your HTML file to include the library:
```html

<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@0.0.1/src/${component}"></script>
```


## Usage

To use a component from the library, import the relevant script:

```html
<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@0.0.1/src/hideElementOnClick.js"></script>
```

On the same page, add the `x-od-utils` attribute followed by the component name to apply the desired functionality to a specific element:

```html
<div x-od-utils="hide-element-onclick">
    <a href="#">I'm a button</a>
</div>
```

## Components
### Hide Element on click


**Code Example**
```html
<script src="https://cdn.jsdelivr.net/gh/dndevs/ordotype-front-utils@0.0.1/src/hideElementOnClick.js"></script>

<div >
    <a x-od-utils="hide-element-onclick" href="#">I'm a button</a> 
</div>
```