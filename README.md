# SimpleSearchableSelect (SSS)

SimpleSearchableSelect (SSS) is a lightweight JavaScript library that enhances standard HTML `<select>` elements by providing a simple and searchable selection experience. Notably, this library:

- **Requires No Additional CSS:**
    - SimpleSearchableSelect seamlessly integrates with your existing styles, utilizing the same classes as the original `<select>` element. This means you don't need to add extra CSS to achieve a consistent and cohesive look.

- **No Framework Dependencies:**
    - SimpleSearchableSelect is a standalone library and does not rely on any external JavaScript frameworks. It's designed to be lightweight and easy to integrate into your projects without introducing unnecessary dependencies.

- **Utilizes Native `datalist` Functionality:**
    - The library harnesses the native browser `datalist` functionality to display suggestions, ensuring a familiar and standardized user experience across different platforms.

Enjoy the enhanced selection capabilities without the need for extra styling or external frameworks.

Demo:

- Simple demo: [chalda-pnuzig.github.io/SimpleSearchableSelect/demo/](https://chalda-pnuzig.github.io/SimpleSearchableSelect/demo/)
- Bootstrap 5:  [chalda-pnuzig.github.io/SimpleSearchableSelect/demo/bootstrap5.html](https://chalda-pnuzig.github.io/SimpleSearchableSelect/demo/bootstrap5.html)
- UIkit:  [chalda-pnuzig.github.io/SimpleSearchableSelect/demo/uikit.html](https://chalda-pnuzig.github.io/SimpleSearchableSelect/demo/uikit.html)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Options](#options)
- API
    - [setValue()](#setvaluevalue-firechange--true)
    - [getValues()](#getvalues)
    - [clearValue()](#clearvaluevalue--false)
    - [resetValue()](#resetvalue)
    - [destroy()](#destroy)

## Features

- Simple and searchable selection experience for HTML `<select>` elements.
- Autocompletion of input based on available options.
- Support for multiple selections.
- Swipe gestures for removing multiple selections.
- Asynchronous data fetching for dynamic option loading.
- Debouncing of input events for improved performance.

## Installation

SimpleSearchableSelect can be installed via NPM npm install

```bash
npm install @chalda/simple-searchable-select
```

## Getting Started

To use SimpleSearchableSelect, include the library in your project and create an instance of the `SimpleSearchableSelect` class, passing the target `<select>` element as an argument.

```javascript
import {SSS} from './SimpleSearchableSelect.min.js';

const targetSelect = document.getElementById('your-select-element');
const sssInstance  = new SSS(targetSelect);
```

## Usage

After creating an instance of SimpleSearchableSelect, the enhanced functionality will be applied to the target `<select>` element. You can customize the behavior by providing options during instantiation.

```javascript
const targetSelect = document.getElementById('your-select-element');
const options      = {
	inputIntervalTimeout : 300,
	multiple             : true,
	// ...other options
};
const sssInstance  = new SimpleSearchableSelect(targetSelect, options);
```

## Options

When creating an instance of SimpleSearchableSelect, you can customize its behavior by providing options during instantiation. Here are the available options:

- **`inputIntervalTimeout`** (default: `200`):
    - Timeout in milliseconds for debouncing input events. Helps improve performance by delaying processing until after the user has stopped typing.

- **`idPrefix`** (default: `'SSS_'`):
    - Prefix for generating unique element IDs. Each instance of SimpleSearchableSelect will have its own set of unique IDs.

- **`insertPosition`** (default: `'beforebegin'`):
    - DOM insertion position for the input element. Determines where the enhanced input element is inserted relative to the original `<select>` element.

- **`multiple`** (default: same as select):
    - Indicates whether multiple selections are allowed. If not specified, the value is derived from the original `<select>` element.

- **`required`** (default: same as select):
    - Indicates whether the input is required. If not specified, the value is derived from the original `<select>` element.

- **`swipeOffset`** (default: `50`):
    - Threshold for swipe gestures. Determines the distance a swipe must cover to trigger removal of a multiple selection.

- **`swipeAnimationSpeed`** (default: `200`):
    - Speed of swipe animation in milliseconds. Controls the duration of the animation when removing a multiple selection with a swipe.

- **`promiseData`** (default: `false`):
    - Asynchronous data fetching function or `false` if not used. If a function, it should return a Promise resolving to an object with 'key' and 'value' properties.

These options allow you to tailor the behavior of SimpleSearchableSelect to suit your specific requirements.

## `setValue(value, fireChange = true)`

Sets the value of the SimpleSearchableSelect instance.

### Parameters

- **`value`**: `string | Array<string>` - The value(s) to set. If the instance is in multiple selection mode, you can pass an array of values.

- **`fireChange`**: `boolean` (optional, default: `true`) - Whether to dispatch a 'change' event after setting the value. If set to `false`, the 'change' event will not be triggered.

### Usage Example

```javascript
// Set a single value
sssInstance.setValue('option-value');

// Set multiple values
sssInstance.setValue(['value1', 'value2']);

// Set value without triggering 'change' event
sssInstance.setValue('new-value', false);
```

### Notes

- If the instance is in multiple selection mode, setting a single value will add that value to the existing selection.
- If the fireChange parameter is set to false, the 'change' event will not be dispatched.

This function is useful for programmatically setting the value of the SimpleSearchableSelect instance, providing flexibility in handling both single and multiple selections.

## `getValues()`

Gets the values currently selected in the SimpleSearchableSelect instance.

### Returns

- **`Object`**: An object containing the selected values. The keys represent the selected values, and the values represent the corresponding display labels.

### Usage Example

```javascript
// Retrieve selected values
const selectedValues = sssInstance.getValues();
console.log(selectedValues);
```

### Notes

- The returned object provides a mapping of selected values to their corresponding display labels.

This function is useful for programmatically retrieving the selected values in the SimpleSearchableSelect instance, allowing you to access the current state of the selection.

## `clearValue(value = false)`

Clears the value of the SimpleSearchableSelect instance.

### Parameters

- **`value`**: `string | Array<string> | false` (optional, default: `false`) - The value(s) to clear. If not specified or set to `false`, the function clears all selected values.

### Usage Example

```javascript
// Clear all selected values
sssInstance.clearValue();

// Clear a specific value
sssInstance.clearValue('value-to-clear');

// Clear multiple values
sssInstance.clearValue(['value1', 'value2']);
```

### Notes

- If the instance is in multiple selection mode, clearing a specific value will remove that value from the selection.

This function is useful for programmatically clearing the selected values in the SimpleSearchableSelect instance, providing flexibility to clear all values or specific ones.

## `resetValue()`

Resets the value of the SimpleSearchableSelect instance, restoring it to the original state.

### Usage Example

```javascript
// Reset the value to the original state
sssInstance.resetValue();
```

### Notes

- This function restores the value of the SimpleSearchableSelect instance to its initial state, based on the original options provided during instantiation.
- If the instance is in multiple selection mode, this function removes all added values and restores the selection to its original state.
- If the instance is in single selection mode, this function resets the selected value to its original state.

This function is useful for reverting the SimpleSearchableSelect instance to its initial state, undoing any modifications made during user interactions or programmatically.

## `destroy()`

Destroys the SimpleSearchableSelect instance, removing all enhancements and restoring the original `<select>` element.

### Usage Example

```javascript
// Destroy the SimpleSearchableSelect instance
sssInstance.destroy();
```

### Notes

- This function removes all enhancements made by SimpleSearchableSelect, reverting the target `<select>` element to its original state.
- It deletes any added elements, event listeners, and data associated with the instance.
- If the target `<select>` element had additional attributes, they are restored to their original values.
- If the target `<select>` element had a <label> associated with it, the association is restored.

This function is useful for cleaning up and removing the enhancements made by SimpleSearchableSelect when the functionality is no longer needed.