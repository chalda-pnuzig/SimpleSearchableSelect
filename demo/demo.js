import {SSS} from '../SimpleSearchableSelect.min.js';

const demos = {
	defaultDemo         : () => {
		new SSS(document.getElementById('selectDefault'));
	},
	defaultDemoMultiple : () => {
		new SSS(document.getElementById('selectDefaultMultiple'));
	},
	methods             : () => {
		let btnGetValues   = document.getElementById('btn__getValues') // hide
		let btnDestroy     = document.getElementById('btn__destroy') // hide
		let btnRestart     = document.getElementById('btn__restart') // hide
		let btnClear       = document.getElementById('btn__clear1') // hide
		let btnClearSingle = document.getElementById('btn__clear2') // hide
		let btnClearMulti  = document.getElementById('btn__clear3') // hide
		let btnSetValue    = document.getElementById('btn__set1') // hide
		let btnSetMultiple = document.getElementById('btn__set2') // hide

		const selectMethods         = document.getElementById('selectMethods');
		const selectMethodsMultiple = document.getElementById('selectMethodsMultiple');
		new SSS(selectMethods);
		new SSS(selectMethodsMultiple, {placeholder : 'Select one or more characters...'});

		btnGetValues.addEventListener('click', () => {
			alert('selectMethods: ' + JSON.stringify(selectMethods.SSS.getValues(), null, 4) +
				"\n\n" +
				'selectMethodsMultiple: ' + JSON.stringify(selectMethodsMultiple.SSS.getValues(), null, 4) +
				'');
		});
		btnSetValue.addEventListener('click', () => {
			selectMethods.SSS.setValue('Hoagie');
			selectMethodsMultiple.SSS.setValue('Hoagie');
		});
		btnSetMultiple.addEventListener('click', () => {
			selectMethods.SSS.setValue(['Hoagie', 'Laverne', 'BernardBernoulli']);
			selectMethodsMultiple.SSS.setValue(['Hoagie', 'Laverne', 'BernardBernoulli']);
		});
		btnClear.addEventListener('click', () => {
			selectMethods.SSS.clearValue();
			selectMethodsMultiple.SSS.clearValue();
		});
		btnClearSingle.addEventListener('click', () => {
			selectMethods.SSS.clearValue('Laverne');
			selectMethodsMultiple.SSS.clearValue('Laverne');
		});
		btnClearMulti.addEventListener('click', () => {
			selectMethods.SSS.clearValue(['Laverne', 'Hoagie']);
			selectMethodsMultiple.SSS.clearValue(['Laverne', 'Hoagie']);
		});
		btnDestroy.addEventListener('click', () => {
			document.querySelectorAll('.buttons_methods button').forEach(b => b.disabled = !b.disabled); // hide
			selectMethods.SSS.destroy();
			selectMethodsMultiple.SSS.destroy();
		});
		btnRestart.addEventListener('click', () => {
			document.querySelectorAll('.buttons_methods button').forEach(b => b.disabled = !b.disabled); // hide
			new SSS(selectMethods)
			new SSS(selectMethodsMultiple)
		});

	},
	dynamicData         : () => {
		const selectDynamicData         = document.getElementById('selectDynamicData');
		const selectDynamicDataMultiple = document.getElementById('selectDynamicDataMultiple');

		const SSSOptions = {
			promiseData : () => {
				return new Promise((resolve) => {
					resolve({
						BenjaminFranklin : 'Benjamin Franklin',
						BernardBernoulli : 'Bernard Bernoulli',
						ChuckThePlant    : 'Chuck the Plant',
						CousinTed        : 'Cousin Ted',
						DrFredEdison     : 'Dr. Fred Edison',
						DrRedEdison      : 'Dr. Red Edison',
						GeorgeWashington : 'George Washington',
						GreenTentacle    : 'Green Tentacle',
						Hoagie           : 'Hoagie',
						Laverne          : 'Laverne',
						NurseEdna        : 'Nurse Edna',
						PurpleTentacle   : 'Purple Tentacle',
						ThomasJefferson  : 'Thomas Jefferson',
						VedEdison        : 'Ved Edison',
						WeirdEdEdison    : 'Weird Ed Edison',
						ZedEdison        : 'Zed Edison',
						ZednaEdison      : 'Zedna Edison',
					})
				})
			}
		};
		new SSS(selectDynamicData, SSSOptions);
		new SSS(selectDynamicDataMultiple, SSSOptions);
	},
	ajaxData            : () => {
		const selectAjax         = document.getElementById('selectAjax');
		const selectAjaxMultiple = document.getElementById('selectAjaxMultiple');
		const SSSOptions         = {
			promiseData : (search) => {
				return fetch(`https://dummyjson.com/products/search?q=${search}`)
					.then(res => res.json())
					.then(json => {
						let options = {};
						json.products.forEach(product => {
							options[product.id] = `${product.category} | ${product.brand} - ${product.title}`;
						});
						return options;
					})
			}
		};
		new SSS(selectAjax, SSSOptions);
		new SSS(selectAjaxMultiple, SSSOptions);
	},
	selectOption        : () => {
		new SSS(document.getElementById('selectSelectedOptionDefault'), {
			// standard behavior
			selectedStyle : false
		});

		// Bold text
		new SSS(document.getElementById('selectSelectedOptionBold'), {
			selectedStyle : (text) => text.split('').map(t => {
				let c = t.codePointAt(0);
				if (c >= 0x41 && c <= 0x5A) c = c + 0x1D468 - 0x41;
				else if (c >= 0x61 && c <= 0x7A) c = c + 0x1D482 - 0x61;
				return String.fromCodePoint(c)
			}).join(''),
		});

		// Stroked text
		new SSS(document.getElementById('selectSelectedOptionStroke'), {
			selectedStyle : (text) => text.split('').map(t => t + String.fromCodePoint(0x335)).join(''),
		});

		// Arrow before text
		new SSS(document.getElementById('selectSelectedOptionArrow'), {
			selectedStyle : (text) => `   ▶ ${text}`,
		});
	}
}

export function initDemo(preClasses = []) {

	Object.keys(demos).forEach(demoKey => {
		let fn = demos[demoKey];
		fn();
		let fnString = fn.toString();
		let tab      = fnString.match(/^(\t+)/m)[0];
		let s        = fnString
			.replace(/^\s*\(\)\s*=>\s*\{/, '')
			.replace(/\s*}\s*$/, '')
			.split("\n" + tab).join("\n")
			.replace(/^.*\/\/ hide[\n\r]*/mg, '')
			.replace(/\s*$/g, '')
			.replace(/^\s*/g, '')
			.replace(/\t/g, '    ')
			.replace(/[\u00A0-\u9999<>&]/g, i => '&#' + i.charCodeAt(0) + ';') // Encode HTML
			.replace(/(['"`])(.*?)\1/g, '<span style="color:#98c379">$1$2$1</span>') // String
			.replace(/\b([\w-]+)(\()/g, '<span style="color:#61aeee">$1</span>$2') // Functions
			.replace(/\b([\w-]+)(\s*=\s|\s*:\s)/g, '<span style="color:#e6c07b">$1</span>$2') // variables/properties
			.replace(/(\s\d+(\.\d+)?)\b/g, '<span style="color:#d19a66">$1</span>') // numbers
			.replace(/\b(0x[\da-fA-F]+)\b/g, '<span style="color:#d19a66">$1</span>') // exa numbers
			.replace(/(\$\{\w+})/g, '<span style="color:#e06c75">$1</span>') // variables in string
			.replace(/^([ \t]*\/\/.*)/gm, '<span style="color:#999">$1</span>') // comments
			.replace(/\b(abstract|arguments|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|volatile|while|with|yield)\b/g, '<span style="color:#c678dd">$1</span>')
			.replace(/\b(AggregateError|Array|ArrayBuffer|AsyncFunction|AsyncGenerator|AsyncGeneratorFunction|AsyncIterator|Atomics|BigInt|BigInt64Array|BigUint64Array|Boolean|DataView|Date|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|Error|escapeDeprecated|eval|EvalError|FinalizationRegistry|Float32Array|Float64Array|Function|Generator|GeneratorFunction|globalThis|Infinity|Int16Array|Int32Array|Int8Array|InternalErrorNon-standard|Intl|isFinite|isNaN|Iterator|JSON|Map|Math|NaN|Number|Object|parseFloat|parseInt|Promise|Proxy|RangeError|ReferenceError|Reflect|RegExp|Set|SharedArrayBuffer|String|Symbol|SyntaxError|TypedArray|TypeError|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|undefined|unescapeDeprecated|URIError|WeakMap|WeakRef|WeakSet)\b/g, '<span style="color:#e6c07b">$1</span>')
		;
		let pre      = document.createElement('pre');
		if (preClasses.length) pre.classList.add(...preClasses)
		pre.innerHTML = s;
		document.getElementById(demoKey).appendChild(pre);
	});

	document.querySelectorAll('form').forEach(f => {
		f.addEventListener('submit', e => {
			e.preventDefault();
			let data = {};

			[...new FormData(f)].forEach(v => {
				if (data[v[0]]) {
					if (typeof data[v[0]] === 'string') data[v[0]] = [data[v[0]]];
					data[v[0]].push(v[1])
				} else {
					data[v[0]] = v[1];
				}
			});

			alert(JSON.stringify(data, null, 4));
			return false;
		});
	});

}