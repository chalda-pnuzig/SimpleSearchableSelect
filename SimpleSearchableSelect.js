/**!
 * SSS (aka SimpleSearchableSelect aka SmartSelectSystem)
 *
 * @version   v1.1.0
 * @author    Chalda Pnuzig <chalda＠chalda.it>
 * @copyright Chalda Pnuzig 2023
 * {@link     https://github.com/chalda-pnuzig/SimpleSearchableSelect|GitHub}
 * @license   ISC
 */

/**
 * A JavaScript class that enhances standard HTML <select> elements
 * by providing a simple and searchable selection experience.
 * The SimpleSearchableSelect class offers additional features, including autocompletion
 * and dynamic data loading, to improve the user experience when interacting with select elements.
 *
 * @example
 * // Usage:
 * const targetSelect = document.getElementById('your-select-element');
 * const options = {
 *   inputIntervalTimeout: 300,
 *   multiple: true,
 *   // ...other options
 * };
 * const sssInstance = new SSS(targetSelect, options);
 */

export class SSS {

	/**
	 * @type {HTMLInputElement}
	 */
	$input = document.createElement('input');

	/**
	 * @type {HTMLDataListElement}
	 */
	$dataList = document.createElement('datalist');

	/**
	 * @type {HTMLSelectElement}
	 */
	$target;

	/**
	 * @type {HTMLLabelElement}
	 */
	$label;

	/**
	 * @name PromiseCallback
	 * @type function
	 * @param string
	 * @returns {Promise<Object.<string, string>>}
	 *
	 * it should return a Promise resolving to an object with 'value' and 'text' properties.
	 */

	/**
	 * @typedef {'beforebegin'|'afterbegin'|'beforeend'|'afterend'} DOMInsertion
	 */

	/**
	 * Configuration options for the SSS (Smart Select System) instance.
	 *
	 * @typedef {Object} SSSOptions
	 * @property {number}                [inputIntervalTimeout=200]     - Timeout in milliseconds for debouncing input events.
	 * @property {string}                [idPrefix='SSS_']              - Prefix for generating unique element IDs.
	 * @property {DOMInsertion}          [insertPosition='beforebegin'] - DOM insertion position for the input element.
	 * @property {boolean}               [multiple=undefined]           - Indicates whether multiple selections are allowed. Defaults to the value of the select element.
	 * @property {boolean}               [required=undefined]           - Indicates whether the input is required. Defaults to the value of the select element.
	 * @property {string}                [placeholder=undefined]        - Indicates the placeholder to show. Defaults to the value is derived from the option in the select element with an empty string ('') as its value
	 * @property {number}                [swipeOffset=50]               - Threshold for swipe gestures.
	 * @property {number}                [swipeAnimationSpeed=200]      - Speed of swipe animation in milliseconds.
	 * @property {PromiseCallback|false} [promiseData=false]            - Asynchronous data fetching function or false if not used.
	 *
	 */
	options = {
		inputIntervalTimeout : 200,
		idPrefix             : 'SSS_',
		insertPosition       : 'beforebegin',
		swipeOffset          : 50,
		swipeAnimationSpeed  : 200,
		promiseData          : false,
		multiple             : undefined, // Note: multiple and required are intentionally left undefined here
		required             : undefined, // to indicate they will use the values from the input element,
		placeholder          : undefined, // and placeholder is taken from the option in the select with an empty string ('') if present.
	};

	/**
	 * @type {Object.<string, string>}
	 * @private
	 */
	#values = {};

	/**
	 * @type {Object.<string, string>}
	 * @private
	 */
	#refs = {};

	/**
	 * @type {Object.<string, HTMLInputElement>}
	 * @private
	 */
	#clones = {};

	/**
	 * @type {Object.<string, HTMLOptionElement>}
	 * @private
	 */

	#validValues = {};

	/**
	 * Initializes a new instance of the SSS class, associating it with a target element and providing optional configuration options.
	 * If the target element already has an SSS instance, returns the existing instance.
	 *
	 * @param {HTMLSelectElement} target - The target element to associate with the SSS instance.
	 * @param {SSSOptions} options - Optional configuration options for the SSS instance.
	 * @returns {SSS} - The SSS instance associated with the target element.
	 */

	constructor(target, options = {}) {
		if (target.hasOwnProperty('SSS')) return target.SSS;
		this.$target          = target;
		this.$target["SSS"]   = this;
		this.options.multiple = target.multiple;
		this.options.required = target.required;
		this.options          = {
			...this.options,
			...options
		};
		this.#init();
		return this;
	}

	/**
	 * Adds a value to the SSS instance for multiple selections, creating a visual clone.
	 *
	 * @param {string} value - The value to add.
	 * @param {boolean} [fireChange=true] - If true, triggers a 'change' event on the target element.
	 * @returns {void}
	 */
	#addMultipleValue(value, fireChange = true) {
		// If a clone for the value already exists, focus on it and reset the input value
		if (typeof this.#clones[value] !== 'undefined') {
			this.#clones[value].focus();
			this.$input.value = '';
			return;
		}

		// If the value is falsy, exit early
		if (!value) return;

		// Set the value reference
		this.#values[value] = this.#refs[value];

		// Create a clone of the input element
		const clone     = this.$input.cloneNode(true);
		let touchStartX = 0;
		let touchEndX   = 0;

		// Event listener for touchstart to capture starting touch position
		clone.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);

		// Styling and class for the clone
		clone.classList.add('SSS_clone');
		clone.style.setProperty('--SSS-x', '0');
		clone.style.setProperty('--SSS-s', `${this.options.swipeAnimationSpeed}ms`);

		// Set height for the clone if not already set
		clone.style.height ||= window.getComputedStyle(this.$input).height;

		// Custom function to delete the clone
		clone.SSSDelete = () => {
			// Animation and removal logic
			clone.style.setProperty('--SSS-x', '0');
			clone.style.height     = clone.style.padding = clone.style.border = clone.style.fontSize = clone.style.opacity = '0';
			clone.style.transition = 'all var(--SSS-s)';

			setTimeout(() => {
				clone.remove();
				this.#validValues[this.#refs[value]].selected = false;
				delete this.#values[value];
				delete this.#clones[value];

				// Update input's 'required' attribute if needed
				if (this.options.required) {
					this.$input.required = Object.keys(this.#clones).length === 0;
				}

				// Trigger 'change' event if specified
				if (fireChange) this.$target.dispatchEvent(new Event('change'));
			}, this.options.swipeAnimationSpeed);
		}

		// Styling for the clone's transform property
		clone.style.transform += ' translateX(var(--SSS-x))';

		// Event listeners for touchend and touchmove to handle swipe deletion
		clone.addEventListener('touchend', e => {
			touchEndX = e.changedTouches[0].screenX;
			if (touchStartX - touchEndX >= this.options.swipeOffset) {
				if (touchEndX < touchStartX) {
					clone.SSSDelete();
				}
			} else {
				clone.style.setProperty('--SSS-x', '0');
			}
		});
		clone.addEventListener('touchmove', e => {
			touchEndX   = e.changedTouches[0].screenX;
			const swipe = touchEndX < touchStartX ? -Math.min(touchStartX - touchEndX, this.options.swipeOffset) : 0;
			clone.style.setProperty('--SSS-x', `${swipe}px`);
		});

		// Store the clone in the #clones object
		this.#clones[value] = clone;

		// Set properties for the clone
		clone.readOnly = true;

		// Event listener for keydown to handle backspace/delete key press
		clone.addEventListener('keydown', (e) => {
			if (['Backspace', 'Delete'].includes(e.key)) {
				clone.SSSDelete();
			}
		});

		// Insert the clone before the input element in the DOM
		this.$input.insertAdjacentElement('beforebegin', clone);

		// Reset the input value and remove 'required' attribute
		this.$input.value    = '';
		this.$input.required = false;

		// Update selected status for valid values
		const cloneKeys = Object.keys(this.#clones);
		Object.values(this.#validValues).forEach(o => o.selected = cloneKeys.includes(o.value));

		// Trigger 'change' event if specified
		if (fireChange) this.$target.dispatchEvent(new Event('change'));
	}

	/**
	 * Sets the value of the SSS instance, updating the associated input and triggering a 'change' event if specified.
	 * If the SSS instance is configured for multiple selections, it sets multiple values.
	 *
	 * @param {(string | string[])} value - The value(s) to set.
	 * @param {boolean} [fireChange=true] - If true, triggers a 'change' event on the target element.
	 * @returns {void}
	 */
	setValue(value, fireChange = true) {
		const values = (this.options.multiple ? (Array.isArray(value) ? value : [value]) : [value]);
		values.forEach(v => {
			this.$input.value = this.#refs[v] || '';
			if (this.options.multiple) {
				this.#addMultipleValue(v, false);
			} else {
				this.#values[v]    = this.#refs[v];
				this.$target.value = v;
			}
		});
		if (fireChange) this.$target.dispatchEvent(new Event('change'));
	}

	/**
	 * Clears the value(s) associated with the SSS instance, either for a single or multiple selection.
	 * If the SSS instance is configured for multiple selections, it clears the specified values.
	 * If the SSS instance is configured for a single selection, it clears the value.
	 *
	 * @param {(string | string[] | false)} value - The value(s) to clear. If false, clears all values.
	 * @returns {void}
	 */
	clearValue(value = false) {
		if (this.options.multiple) {
			if (value === false) value = Object.keys(this.#values);
			const valuesToClear = Array.isArray(value) ? value : [value];
			valuesToClear.forEach(v => {
				if (this.#clones[v]) this.#clones[v]["SSSDelete"]();
			});
		} else {
			this.$input.value  = '';
			this.$target.value = '';
		}
	}

	/**
	 * Destroys the SSS instance, restoring the target element to its original state.
	 * If the SSS instance is not attached to the target, the function exits early.
	 * @returns {void}
	 */
	destroy() {
		// Check if the SSS property is not present on the target
		if (!this.$target["SSS"]) return;

		// Restore the visibility of the target element
		this.$target.hidden = false;

		// Remove the reference to this instance from the target object
		delete this.$target["SSS"];

		// Remove associated DOM elements
		this.$dataList.remove();
		this.$input.remove();

		// Restore attributes on the target element
		this.$target.required = this.$target.dataset.sssRequired === '1';
		this.$target.multiple = this.$target.dataset.sssMultiple === '1';
		delete this.$target.dataset.sssRequired;
		delete this.$target.dataset.sssMultiple;

		// Remove cloned elements if the 'multiple' option is enabled
		if (this.options.multiple) Object.values(this.#clones).forEach(el => el.remove());

		// Restore the 'for' attribute of the label, if present
		if (this.$label) {
			this.$label.setAttribute('for', this.$label.dataset.sssOriginal)
			delete this.$label.dataset.sssOriginal;
		}
	}

	/**
	 * Resets the SSS instance, clearing the current value(s) and updating the options based on the target's options.
	 * If the target is a select element with options, it populates the internal data list with valid values.
	 *
	 * @returns {void}
	 */
	resetValue() {
		// Clear current values
		this.clearValue();

		// Array to store selected options
		let selected = [];

		// Iterate over each option in the target element
		this.$target.querySelectorAll('option').forEach(o => {
			let text  = o.textContent;
			let value = o.value;

			// Check if the option is selected and has a value
			if (o.selected && o.value) selected.push(text);

			// Process each option
			if (value) {
				// Create a new Option element and add it to the internal data list
				let newOption = new Option(text);
				this.$dataList.append(newOption);
				this.#validValues[text] = o;
				this.#refs[value]       = text;
			} else {
				// Set the input placeholder if the option has no value
				this.$input.placeholder = text;
			}
		});

		// Check if a custom placeholder is specified in the options
		if (this.options.placeholder) {
			this.$input.placeholder = this.options.placeholder;
		}

		// If there are selected options, set the values accordingly
		if (selected.length) {
			if (this.options.multiple) {
				// If multiple selections are allowed, set each selected value
				[...this.$target.selectedOptions].forEach(o => {
					this.setValue(o.value, false);
				});
			} else {
				// If single selection, set the value of the first selected option
				this.$input.value = selected[0];
			}
		}
	}

	/**
	 * Initializes the SSS instance, setting up the necessary elements and event listeners.
	 *
	 * @private
	 * @returns {void}
	 */
	#init() {
		// Copy attributes from the target element to the input element
		this.$target.getAttributeNames().forEach(attr => {
			if (attr.match(/^(name|id)$/i)) return;
			this.$input.setAttribute(attr, this.$target.getAttribute(attr));
		});
		this.$input.setAttribute('autocomplete', 'off');
		// Hide the target element and store its original required and multiple attributes
		this.$target.hidden              = true;
		this.$target.dataset.sssRequired = this.$target.required ? '1' : '0';
		this.$target.dataset.sssMultiple = this.$target.multiple ? '1' : '0';
		this.$target.required            = this.options.required;
		this.$target.multiple            = this.options.multiple;

		// Generate a unique idPrefix based on the existing ids
		let counter = 1;
		while (document.getElementById(this.options.idPrefix + counter + '_list')) {
			counter++;
		}
		this.options.idPrefix += counter;

		// Update label attributes if it exists
		if (this.$target.id) {
			this.$label = document.querySelector(`label[for="${this.$target.id}"]`);
			if (this.$label) {
				this.$label.dataset.sssOriginal = this.$target.id;
				this.$label.setAttribute('for', this.options.idPrefix + '_input');
			}
		}

		// Set ids and attributes for the input and datalist elements
		this.$dataList.id    = this.options.idPrefix + '_list';
		this.$input.id       = this.options.idPrefix + '_input';
		this.$input.required = this.options.required;
		this.$input.multiple = this.options.multiple;
		this.$input.setAttribute('list', this.options.idPrefix + '_list');
		this.$input.classList.add('SSS_input');

		// Insert input element and append datalist element to the body
		this.$target.insertAdjacentElement(this.options.insertPosition, this.$input);
		document.body.append(this.$dataList);

		// Initialize values based on the existing options in the target element
		this.resetValue();

		// Event listeners for input handling
		let start = false;
		this.$input.addEventListener('input', () => {
			// Clear any existing timeout to debounce input
			if (start) clearTimeout(start)

			// Get the current input value
			let inputValue = this.$input.value;

			if (this.options.promiseData) {
				// Handle logic when promiseData is present
				start = setTimeout(() => {
					if (this.#validValues[inputValue]) {
						// If the value is valid, set it
						this.setValue(this.#validValues[inputValue].value);
					} else {
						// Fetch data from promiseData
						this.options.promiseData(inputValue).then((data) => {
							Object.keys(data).forEach(key => {
								let value = data[key];
								if (typeof this.#validValues[value] === 'undefined') {
									// Create and append new option elements
									let option               = new Option(value, key);
									this.#validValues[value] = option;
									this.$target.append(option);
									this.#refs[key]    = value;
									let dataListOption = new Option(value);
									this.$dataList.append(dataListOption);
								}
							});
						});
					}
				}, this.options.inputIntervalTimeout);

			} else {
				// Handle logic when promiseData is not present
				let regex = new RegExp('^' + inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
				let match = Object.keys(this.#validValues).find(entry => entry.match(regex));
				if (match) {
					// If there is a match, set the value
					start = setTimeout(() => {
						this.setValue(this.#validValues[match].value);
					}, this.options.inputIntervalTimeout);
				}
			}
		});

		// Handle blur event
		this.$input.addEventListener('blur', () => {
			// Get the current input value
			let inputValue = this.$input.value;

			// Check if the input value is present and not in the validValues
			if (inputValue && !Object.keys(this.#validValues).includes(inputValue)) {
				// If not in validValues, clear the input value
				this.setValue('');
			}
		});

		// Handle keydown events (Backspace, Delete, Tab, Enter)
		this.$input.addEventListener('keydown', (e) => {

			switch (e.key) {
				case 'Backspace':
				case 'Delete':
					// Clear the input value on Backspace or Delete key press
					this.setValue('');
					break;
				case 'Tab':
				case 'Enter':
					// Handle Tab or Enter key press
					const inputValue  = this.$input.value;
					const regex       = new RegExp('' + inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
					const matchingKey = Object.keys(this.#validValues).find(key => key.match(regex));
					// If there is a match, set the corresponding value
					if (matchingKey) this.setValue(this.#validValues[matchingKey].value);
					break;
			}
		});
	}

	/**
	 * Retrieves the values associated with the SSS instance.
	 *
	 * @returns {Object<string, string>} - An object containing the values.
	 */
	getValues() {
		return this.#values;
	}
}