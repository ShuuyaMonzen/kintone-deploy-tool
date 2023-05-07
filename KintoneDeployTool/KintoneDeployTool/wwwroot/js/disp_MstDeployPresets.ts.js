/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/tom-select/dist/js/tom-select.complete.js":
/*!****************************************************************!*\
  !*** ./node_modules/tom-select/dist/js/tom-select.complete.js ***!
  \****************************************************************/
/***/ (function(module) {

/**
* Tom Select v2.2.2
* Licensed under the Apache License, Version 2.0 (the "License");
*/

(function (global, factory) {
	 true ? module.exports = factory() :
	0;
})(this, (function () { 'use strict';

	/**
	 * MicroEvent - to make any js object an event emitter
	 *
	 * - pure javascript - server compatible, browser compatible
	 * - dont rely on the browser doms
	 * - super simple - you get it immediatly, no mistery, no magic involved
	 *
	 * @author Jerome Etienne (https://github.com/jeromeetienne)
	 */

	/**
	 * Execute callback for each event in space separated list of event names
	 *
	 */
	function forEvents(events, callback) {
	  events.split(/\s+/).forEach(event => {
	    callback(event);
	  });
	}

	class MicroEvent {
	  constructor() {
	    this._events = void 0;
	    this._events = {};
	  }

	  on(events, fct) {
	    forEvents(events, event => {
	      const event_array = this._events[event] || [];
	      event_array.push(fct);
	      this._events[event] = event_array;
	    });
	  }

	  off(events, fct) {
	    var n = arguments.length;

	    if (n === 0) {
	      this._events = {};
	      return;
	    }

	    forEvents(events, event => {
	      if (n === 1) {
	        delete this._events[event];
	        return;
	      }

	      const event_array = this._events[event];
	      if (event_array === undefined) return;
	      event_array.splice(event_array.indexOf(fct), 1);
	      this._events[event] = event_array;
	    });
	  }

	  trigger(events, ...args) {
	    var self = this;
	    forEvents(events, event => {
	      const event_array = self._events[event];
	      if (event_array === undefined) return;
	      event_array.forEach(fct => {
	        fct.apply(self, args);
	      });
	    });
	  }

	}

	/**
	 * microplugin.js
	 * Copyright (c) 2013 Brian Reavis & contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 * @author Brian Reavis <brian@thirdroute.com>
	 */
	function MicroPlugin(Interface) {
	  Interface.plugins = {};
	  return class extends Interface {
	    constructor(...args) {
	      super(...args);
	      this.plugins = {
	        names: [],
	        settings: {},
	        requested: {},
	        loaded: {}
	      };
	    }

	    /**
	     * Registers a plugin.
	     *
	     * @param {function} fn
	     */
	    static define(name, fn) {
	      Interface.plugins[name] = {
	        'name': name,
	        'fn': fn
	      };
	    }
	    /**
	     * Initializes the listed plugins (with options).
	     * Acceptable formats:
	     *
	     * List (without options):
	     *   ['a', 'b', 'c']
	     *
	     * List (with options):
	     *   [{'name': 'a', options: {}}, {'name': 'b', options: {}}]
	     *
	     * Hash (with options):
	     *   {'a': { ... }, 'b': { ... }, 'c': { ... }}
	     *
	     * @param {array|object} plugins
	     */


	    initializePlugins(plugins) {
	      var key, name;
	      const self = this;
	      const queue = [];

	      if (Array.isArray(plugins)) {
	        plugins.forEach(plugin => {
	          if (typeof plugin === 'string') {
	            queue.push(plugin);
	          } else {
	            self.plugins.settings[plugin.name] = plugin.options;
	            queue.push(plugin.name);
	          }
	        });
	      } else if (plugins) {
	        for (key in plugins) {
	          if (plugins.hasOwnProperty(key)) {
	            self.plugins.settings[key] = plugins[key];
	            queue.push(key);
	          }
	        }
	      }

	      while (name = queue.shift()) {
	        self.require(name);
	      }
	    }

	    loadPlugin(name) {
	      var self = this;
	      var plugins = self.plugins;
	      var plugin = Interface.plugins[name];

	      if (!Interface.plugins.hasOwnProperty(name)) {
	        throw new Error('Unable to find "' + name + '" plugin');
	      }

	      plugins.requested[name] = true;
	      plugins.loaded[name] = plugin.fn.apply(self, [self.plugins.settings[name] || {}]);
	      plugins.names.push(name);
	    }
	    /**
	     * Initializes a plugin.
	     *
	     */


	    require(name) {
	      var self = this;
	      var plugins = self.plugins;

	      if (!self.plugins.loaded.hasOwnProperty(name)) {
	        if (plugins.requested[name]) {
	          throw new Error('Plugin has circular dependency ("' + name + '")');
	        }

	        self.loadPlugin(name);
	      }

	      return plugins.loaded[name];
	    }

	  };
	}

	/*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */
	/**
	 * Convert array of strings to a regular expression
	 *	ex ['ab','a'] => (?:ab|a)
	 * 	ex ['a','b'] => [ab]
	 * @param {string[]} chars
	 * @return {string}
	 */
	const arrayToPattern = chars => {
	  chars = chars.filter(Boolean);

	  if (chars.length < 2) {
	    return chars[0] || '';
	  }

	  return maxValueLength(chars) == 1 ? '[' + chars.join('') + ']' : '(?:' + chars.join('|') + ')';
	};
	/**
	 * @param {string[]} array
	 * @return {string}
	 */

	const sequencePattern = array => {
	  if (!hasDuplicates(array)) {
	    return array.join('');
	  }

	  let pattern = '';
	  let prev_char_count = 0;

	  const prev_pattern = () => {
	    if (prev_char_count > 1) {
	      pattern += '{' + prev_char_count + '}';
	    }
	  };

	  array.forEach((char, i) => {
	    if (char === array[i - 1]) {
	      prev_char_count++;
	      return;
	    }

	    prev_pattern();
	    pattern += char;
	    prev_char_count = 1;
	  });
	  prev_pattern();
	  return pattern;
	};
	/**
	 * Convert array of strings to a regular expression
	 *	ex ['ab','a'] => (?:ab|a)
	 * 	ex ['a','b'] => [ab]
	 * @param {Set<string>} chars
	 * @return {string}
	 */

	const setToPattern = chars => {
	  let array = toArray(chars);
	  return arrayToPattern(array);
	};
	/**
	 *
	 * https://stackoverflow.com/questions/7376598/in-javascript-how-do-i-check-if-an-array-has-duplicate-values
	 * @param {any[]} array
	 */

	const hasDuplicates = array => {
	  return new Set(array).size !== array.length;
	};
	/**
	 * https://stackoverflow.com/questions/63006601/why-does-u-throw-an-invalid-escape-error
	 * @param {string} str
	 * @return {string}
	 */

	const escape_regex = str => {
	  return (str + '').replace(/([\$\(\)\*\+\.\?\[\]\^\{\|\}\\])/gu, '\\$1');
	};
	/**
	 * Return the max length of array values
	 * @param {string[]} array
	 *
	 */

	const maxValueLength = array => {
	  return array.reduce((longest, value) => Math.max(longest, unicodeLength(value)), 0);
	};
	/**
	 * @param {string} str
	 */

	const unicodeLength = str => {
	  return toArray(str).length;
	};
	/**
	 * @param {any} p
	 * @return {any[]}
	 */

	const toArray = p => Array.from(p);

	/*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */
	/**
	 * Get all possible combinations of substrings that add up to the given string
	 * https://stackoverflow.com/questions/30169587/find-all-the-combination-of-substrings-that-add-up-to-the-given-string
	 * @param {string} input
	 * @return {string[][]}
	 */
	const allSubstrings = input => {
	  if (input.length === 1) return [[input]];
	  /** @type {string[][]} */

	  let result = [];
	  const start = input.substring(1);
	  const suba = allSubstrings(start);
	  suba.forEach(function (subresult) {
	    let tmp = subresult.slice(0);
	    tmp[0] = input.charAt(0) + tmp[0];
	    result.push(tmp);
	    tmp = subresult.slice(0);
	    tmp.unshift(input.charAt(0));
	    result.push(tmp);
	  });
	  return result;
	};

	/*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */

	/**
	 * @typedef {{[key:string]:string}} TUnicodeMap
	 * @typedef {{[key:string]:Set<string>}} TUnicodeSets
	 * @typedef {[[number,number]]} TCodePoints
	 * @typedef {{folded:string,composed:string,code_point:number}} TCodePointObj
	 * @typedef {{start:number,end:number,length:number,substr:string}} TSequencePart
	 */
	/** @type {TCodePoints} */

	const code_points = [[0, 65535]];
	const accent_pat = '[\u0300-\u036F\u{b7}\u{2be}\u{2bc}]';
	/** @type {TUnicodeMap} */

	let unicode_map;
	/** @type {RegExp} */

	let multi_char_reg;
	const max_char_length = 3;
	/** @type {TUnicodeMap} */

	const latin_convert = {};
	/** @type {TUnicodeMap} */

	const latin_condensed = {
	  '/': '⁄∕',
	  '0': '߀',
	  "a": "ⱥɐɑ",
	  "aa": "ꜳ",
	  "ae": "æǽǣ",
	  "ao": "ꜵ",
	  "au": "ꜷ",
	  "av": "ꜹꜻ",
	  "ay": "ꜽ",
	  "b": "ƀɓƃ",
	  "c": "ꜿƈȼↄ",
	  "d": "đɗɖᴅƌꮷԁɦ",
	  "e": "ɛǝᴇɇ",
	  "f": "ꝼƒ",
	  "g": "ǥɠꞡᵹꝿɢ",
	  "h": "ħⱨⱶɥ",
	  "i": "ɨı",
	  "j": "ɉȷ",
	  "k": "ƙⱪꝁꝃꝅꞣ",
	  "l": "łƚɫⱡꝉꝇꞁɭ",
	  "m": "ɱɯϻ",
	  "n": "ꞥƞɲꞑᴎлԉ",
	  "o": "øǿɔɵꝋꝍᴑ",
	  "oe": "œ",
	  "oi": "ƣ",
	  "oo": "ꝏ",
	  "ou": "ȣ",
	  "p": "ƥᵽꝑꝓꝕρ",
	  "q": "ꝗꝙɋ",
	  "r": "ɍɽꝛꞧꞃ",
	  "s": "ßȿꞩꞅʂ",
	  "t": "ŧƭʈⱦꞇ",
	  "th": "þ",
	  "tz": "ꜩ",
	  "u": "ʉ",
	  "v": "ʋꝟʌ",
	  "vy": "ꝡ",
	  "w": "ⱳ",
	  "y": "ƴɏỿ",
	  "z": "ƶȥɀⱬꝣ",
	  "hv": "ƕ"
	};

	for (let latin in latin_condensed) {
	  let unicode = latin_condensed[latin] || '';

	  for (let i = 0; i < unicode.length; i++) {
	    let char = unicode.substring(i, i + 1);
	    latin_convert[char] = latin;
	  }
	}

	const convert_pat = new RegExp(Object.keys(latin_convert).join('|') + '|' + accent_pat, 'gu');
	/**
	 * Initialize the unicode_map from the give code point ranges
	 *
	 * @param {TCodePoints=} _code_points
	 */

	const initialize = _code_points => {
	  if (unicode_map !== undefined) return;
	  unicode_map = generateMap(_code_points || code_points);
	};
	/**
	 * Helper method for normalize a string
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
	 * @param {string} str
	 * @param {string} form
	 */

	const normalize = (str, form = 'NFKD') => str.normalize(form);
	/**
	 * Remove accents without reordering string
	 * calling str.normalize('NFKD') on \u{594}\u{595}\u{596} becomes \u{596}\u{594}\u{595}
	 * via https://github.com/krisk/Fuse/issues/133#issuecomment-318692703
	 * @param {string} str
	 * @return {string}
	 */

	const asciifold = str => {
	  return toArray(str).reduce(
	  /**
	   * @param {string} result
	   * @param {string} char
	   */
	  (result, char) => {
	    return result + _asciifold(char);
	  }, '');
	};
	/**
	 * @param {string} str
	 * @return {string}
	 */

	const _asciifold = str => {
	  str = normalize(str).toLowerCase().replace(convert_pat, (
	  /** @type {string} */
	  char) => {
	    return latin_convert[char] || '';
	  }); //return str;

	  return normalize(str, 'NFC');
	};
	/**
	 * Generate a list of unicode variants from the list of code points
	 * @param {TCodePoints} code_points
	 * @yield {TCodePointObj}
	 */

	function* generator(code_points) {
	  for (const [code_point_min, code_point_max] of code_points) {
	    for (let i = code_point_min; i <= code_point_max; i++) {
	      let composed = String.fromCharCode(i);
	      let folded = asciifold(composed);

	      if (folded == composed.toLowerCase()) {
	        continue;
	      } // skip when folded is a string longer than 3 characters long
	      // bc the resulting regex patterns will be long
	      // eg:
	      // folded صلى الله عليه وسلم length 18 code point 65018
	      // folded جل جلاله length 8 code point 65019


	      if (folded.length > max_char_length) {
	        continue;
	      }

	      if (folded.length == 0) {
	        continue;
	      }

	      yield {
	        folded: folded,
	        composed: composed,
	        code_point: i
	      };
	    }
	  }
	}
	/**
	 * Generate a unicode map from the list of code points
	 * @param {TCodePoints} code_points
	 * @return {TUnicodeSets}
	 */

	const generateSets = code_points => {
	  /** @type {{[key:string]:Set<string>}} */
	  const unicode_sets = {};
	  /**
	   * @param {string} folded
	   * @param {string} to_add
	   */

	  const addMatching = (folded, to_add) => {
	    /** @type {Set<string>} */
	    const folded_set = unicode_sets[folded] || new Set();
	    const patt = new RegExp('^' + setToPattern(folded_set) + '$', 'iu');

	    if (to_add.match(patt)) {
	      return;
	    }

	    folded_set.add(escape_regex(to_add));
	    unicode_sets[folded] = folded_set;
	  };

	  for (let value of generator(code_points)) {
	    addMatching(value.folded, value.folded);
	    addMatching(value.folded, value.composed);
	  }

	  return unicode_sets;
	};
	/**
	 * Generate a unicode map from the list of code points
	 * ae => (?:(?:ae|Æ|Ǽ|Ǣ)|(?:A|Ⓐ|Ａ...)(?:E|ɛ|Ⓔ...))
	 *
	 * @param {TCodePoints} code_points
	 * @return {TUnicodeMap}
	 */

	const generateMap = code_points => {
	  /** @type {TUnicodeSets} */
	  const unicode_sets = generateSets(code_points);
	  /** @type {TUnicodeMap} */

	  const unicode_map = {};
	  /** @type {string[]} */

	  let multi_char = [];

	  for (let folded in unicode_sets) {
	    let set = unicode_sets[folded];

	    if (set) {
	      unicode_map[folded] = setToPattern(set);
	    }

	    if (folded.length > 1) {
	      multi_char.push(escape_regex(folded));
	    }
	  }

	  multi_char.sort((a, b) => b.length - a.length);
	  const multi_char_patt = arrayToPattern(multi_char);
	  multi_char_reg = new RegExp('^' + multi_char_patt, 'u');
	  return unicode_map;
	};
	/**
	 * Map each element of an array from it's folded value to all possible unicode matches
	 * @param {string[]} strings
	 * @param {number} min_replacement
	 * @return {string}
	 */

	const mapSequence = (strings, min_replacement = 1) => {
	  let chars_replaced = 0;
	  strings = strings.map(str => {
	    if (unicode_map[str]) {
	      chars_replaced += str.length;
	    }

	    return unicode_map[str] || str;
	  });

	  if (chars_replaced >= min_replacement) {
	    return sequencePattern(strings);
	  }

	  return '';
	};
	/**
	 * Convert a short string and split it into all possible patterns
	 * Keep a pattern only if min_replacement is met
	 *
	 * 'abc'
	 * 		=> [['abc'],['ab','c'],['a','bc'],['a','b','c']]
	 *		=> ['abc-pattern','ab-c-pattern'...]
	 *
	 *
	 * @param {string} str
	 * @param {number} min_replacement
	 * @return {string}
	 */

	const substringsToPattern = (str, min_replacement = 1) => {
	  min_replacement = Math.max(min_replacement, str.length - 1);
	  return arrayToPattern(allSubstrings(str).map(sub_pat => {
	    return mapSequence(sub_pat, min_replacement);
	  }));
	};
	/**
	 * Convert an array of sequences into a pattern
	 * [{start:0,end:3,length:3,substr:'iii'}...] => (?:iii...)
	 *
	 * @param {Sequence[]} sequences
	 * @param {boolean} all
	 */

	const sequencesToPattern = (sequences, all = true) => {
	  let min_replacement = sequences.length > 1 ? 1 : 0;
	  return arrayToPattern(sequences.map(sequence => {
	    let seq = [];
	    const len = all ? sequence.length() : sequence.length() - 1;

	    for (let j = 0; j < len; j++) {
	      seq.push(substringsToPattern(sequence.substrs[j] || '', min_replacement));
	    }

	    return sequencePattern(seq);
	  }));
	};
	/**
	 * Return true if the sequence is already in the sequences
	 * @param {Sequence} needle_seq
	 * @param {Sequence[]} sequences
	 */


	const inSequences = (needle_seq, sequences) => {
	  for (const seq of sequences) {
	    if (seq.start != needle_seq.start || seq.end != needle_seq.end) {
	      continue;
	    }

	    if (seq.substrs.join('') !== needle_seq.substrs.join('')) {
	      continue;
	    }

	    let needle_parts = needle_seq.parts;
	    /**
	     * @param {TSequencePart} part
	     */

	    const filter = part => {
	      for (const needle_part of needle_parts) {
	        if (needle_part.start === part.start && needle_part.substr === part.substr) {
	          return false;
	        }

	        if (part.length == 1 || needle_part.length == 1) {
	          continue;
	        } // check for overlapping parts
	        // a = ['::=','==']
	        // b = ['::','===']
	        // a = ['r','sm']
	        // b = ['rs','m']


	        if (part.start < needle_part.start && part.end > needle_part.start) {
	          return true;
	        }

	        if (needle_part.start < part.start && needle_part.end > part.start) {
	          return true;
	        }
	      }

	      return false;
	    };

	    let filtered = seq.parts.filter(filter);

	    if (filtered.length > 0) {
	      continue;
	    }

	    return true;
	  }

	  return false;
	};

	class Sequence {
	  constructor() {
	    /** @type {TSequencePart[]} */
	    this.parts = [];
	    /** @type {string[]} */

	    this.substrs = [];
	    this.start = 0;
	    this.end = 0;
	  }
	  /**
	   * @param {TSequencePart|undefined} part
	   */


	  add(part) {
	    if (part) {
	      this.parts.push(part);
	      this.substrs.push(part.substr);
	      this.start = Math.min(part.start, this.start);
	      this.end = Math.max(part.end, this.end);
	    }
	  }

	  last() {
	    return this.parts[this.parts.length - 1];
	  }

	  length() {
	    return this.parts.length;
	  }
	  /**
	   * @param {number} position
	   * @param {TSequencePart} last_piece
	   */


	  clone(position, last_piece) {
	    let clone = new Sequence();
	    let parts = JSON.parse(JSON.stringify(this.parts));
	    let last_part = parts.pop();

	    for (const part of parts) {
	      clone.add(part);
	    }

	    let last_substr = last_piece.substr.substring(0, position - last_part.start);
	    let clone_last_len = last_substr.length;
	    clone.add({
	      start: last_part.start,
	      end: last_part.start + clone_last_len,
	      length: clone_last_len,
	      substr: last_substr
	    });
	    return clone;
	  }

	}
	/**
	 * Expand a regular expression pattern to include unicode variants
	 * 	eg /a/ becomes /aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑAⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ/
	 *
	 * Issue:
	 *  ﺊﺋ [ 'ﺊ = \\u{fe8a}', 'ﺋ = \\u{fe8b}' ]
	 *	becomes:	ئئ [ 'ي = \\u{64a}', 'ٔ = \\u{654}', 'ي = \\u{64a}', 'ٔ = \\u{654}' ]
	 *
	 *	İĲ = IIJ = ⅡJ
	 *
	 * 	1/2/4
	 *
	 * @param {string} str
	 * @return {string|undefined}
	 */


	const getPattern = str => {
	  initialize();
	  str = asciifold(str);
	  let pattern = '';
	  let sequences = [new Sequence()];

	  for (let i = 0; i < str.length; i++) {
	    let substr = str.substring(i);
	    let match = substr.match(multi_char_reg);
	    const char = str.substring(i, i + 1);
	    const match_str = match ? match[0] : null; // loop through sequences
	    // add either the char or multi_match

	    let overlapping = [];
	    let added_types = new Set();

	    for (const sequence of sequences) {
	      const last_piece = sequence.last();

	      if (!last_piece || last_piece.length == 1 || last_piece.end <= i) {
	        // if we have a multi match
	        if (match_str) {
	          const len = match_str.length;
	          sequence.add({
	            start: i,
	            end: i + len,
	            length: len,
	            substr: match_str
	          });
	          added_types.add('1');
	        } else {
	          sequence.add({
	            start: i,
	            end: i + 1,
	            length: 1,
	            substr: char
	          });
	          added_types.add('2');
	        }
	      } else if (match_str) {
	        let clone = sequence.clone(i, last_piece);
	        const len = match_str.length;
	        clone.add({
	          start: i,
	          end: i + len,
	          length: len,
	          substr: match_str
	        });
	        overlapping.push(clone);
	      } else {
	        // don't add char
	        // adding would create invalid patterns: 234 => [2,34,4]
	        added_types.add('3');
	      }
	    } // if we have overlapping


	    if (overlapping.length > 0) {
	      // ['ii','iii'] before ['i','i','iii']
	      overlapping = overlapping.sort((a, b) => {
	        return a.length() - b.length();
	      });

	      for (let clone of overlapping) {
	        // don't add if we already have an equivalent sequence
	        if (inSequences(clone, sequences)) {
	          continue;
	        }

	        sequences.push(clone);
	      }

	      continue;
	    } // if we haven't done anything unique
	    // clean up the patterns
	    // helps keep patterns smaller
	    // if str = 'r₨㎧aarss', pattern will be 446 instead of 655


	    if (i > 0 && added_types.size == 1 && !added_types.has('3')) {
	      pattern += sequencesToPattern(sequences, false);
	      let new_seq = new Sequence();
	      const old_seq = sequences[0];

	      if (old_seq) {
	        new_seq.add(old_seq.last());
	      }

	      sequences = [new_seq];
	    }
	  }

	  pattern += sequencesToPattern(sequences, true);
	  return pattern;
	};

	/*! sifter.js | https://github.com/orchidjs/sifter.js | Apache License (v2) */

	/**
	 * A property getter resolving dot-notation
	 * @param  {Object}  obj     The root object to fetch property on
	 * @param  {String}  name    The optionally dotted property name to fetch
	 * @return {Object}          The resolved property value
	 */
	const getAttr = (obj, name) => {
	  if (!obj) return;
	  return obj[name];
	};
	/**
	 * A property getter resolving dot-notation
	 * @param  {Object}  obj     The root object to fetch property on
	 * @param  {String}  name    The optionally dotted property name to fetch
	 * @return {Object}          The resolved property value
	 */

	const getAttrNesting = (obj, name) => {
	  if (!obj) return;
	  var part,
	      names = name.split(".");

	  while ((part = names.shift()) && (obj = obj[part]));

	  return obj;
	};
	/**
	 * Calculates how close of a match the
	 * given value is against a search token.
	 *
	 */

	const scoreValue = (value, token, weight) => {
	  var score, pos;
	  if (!value) return 0;
	  value = value + '';
	  if (token.regex == null) return 0;
	  pos = value.search(token.regex);
	  if (pos === -1) return 0;
	  score = token.string.length / value.length;
	  if (pos === 0) score += 0.5;
	  return score * weight;
	};
	/**
	 * Cast object property to an array if it exists and has a value
	 *
	 */

	const propToArray = (obj, key) => {
	  var value = obj[key];
	  if (typeof value == 'function') return value;

	  if (value && !Array.isArray(value)) {
	    obj[key] = [value];
	  }
	};
	/**
	 * Iterates over arrays and hashes.
	 *
	 * ```
	 * iterate(this.items, function(item, id) {
	 *    // invoked for each item
	 * });
	 * ```
	 *
	 */

	const iterate$1 = (object, callback) => {
	  if (Array.isArray(object)) {
	    object.forEach(callback);
	  } else {
	    for (var key in object) {
	      if (object.hasOwnProperty(key)) {
	        callback(object[key], key);
	      }
	    }
	  }
	};
	const cmp = (a, b) => {
	  if (typeof a === 'number' && typeof b === 'number') {
	    return a > b ? 1 : a < b ? -1 : 0;
	  }

	  a = asciifold(a + '').toLowerCase();
	  b = asciifold(b + '').toLowerCase();
	  if (a > b) return 1;
	  if (b > a) return -1;
	  return 0;
	};

	/*! sifter.js | https://github.com/orchidjs/sifter.js | Apache License (v2) */

	/**
	 * sifter.js
	 * Copyright (c) 2013–2020 Brian Reavis & contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 * @author Brian Reavis <brian@thirdroute.com>
	 */

	class Sifter {
	  // []|{};

	  /**
	   * Textually searches arrays and hashes of objects
	   * by property (or multiple properties). Designed
	   * specifically for autocomplete.
	   *
	   */
	  constructor(items, settings) {
	    this.items = void 0;
	    this.settings = void 0;
	    this.items = items;
	    this.settings = settings || {
	      diacritics: true
	    };
	  }

	  /**
	   * Splits a search string into an array of individual
	   * regexps to be used to match results.
	   *
	   */
	  tokenize(query, respect_word_boundaries, weights) {
	    if (!query || !query.length) return [];
	    const tokens = [];
	    const words = query.split(/\s+/);
	    var field_regex;

	    if (weights) {
	      field_regex = new RegExp('^(' + Object.keys(weights).map(escape_regex).join('|') + ')\:(.*)$');
	    }

	    words.forEach(word => {
	      let field_match;
	      let field = null;
	      let regex = null; // look for "field:query" tokens

	      if (field_regex && (field_match = word.match(field_regex))) {
	        field = field_match[1];
	        word = field_match[2];
	      }

	      if (word.length > 0) {
	        if (this.settings.diacritics) {
	          regex = getPattern(word) || null;
	        } else {
	          regex = escape_regex(word);
	        }

	        if (regex && respect_word_boundaries) regex = "\\b" + regex;
	      }

	      tokens.push({
	        string: word,
	        regex: regex ? new RegExp(regex, 'iu') : null,
	        field: field
	      });
	    });
	    return tokens;
	  }

	  /**
	   * Returns a function to be used to score individual results.
	   *
	   * Good matches will have a higher score than poor matches.
	   * If an item is not a match, 0 will be returned by the function.
	   *
	   * @returns {T.ScoreFn}
	   */
	  getScoreFunction(query, options) {
	    var search = this.prepareSearch(query, options);
	    return this._getScoreFunction(search);
	  }
	  /**
	   * @returns {T.ScoreFn}
	   *
	   */


	  _getScoreFunction(search) {
	    const tokens = search.tokens,
	          token_count = tokens.length;

	    if (!token_count) {
	      return function () {
	        return 0;
	      };
	    }

	    const fields = search.options.fields,
	          weights = search.weights,
	          field_count = fields.length,
	          getAttrFn = search.getAttrFn;

	    if (!field_count) {
	      return function () {
	        return 1;
	      };
	    }
	    /**
	     * Calculates the score of an object
	     * against the search query.
	     *
	     */


	    const scoreObject = function () {
	      if (field_count === 1) {
	        return function (token, data) {
	          const field = fields[0].field;
	          return scoreValue(getAttrFn(data, field), token, weights[field] || 1);
	        };
	      }

	      return function (token, data) {
	        var sum = 0; // is the token specific to a field?

	        if (token.field) {
	          const value = getAttrFn(data, token.field);

	          if (!token.regex && value) {
	            sum += 1 / field_count;
	          } else {
	            sum += scoreValue(value, token, 1);
	          }
	        } else {
	          iterate$1(weights, (weight, field) => {
	            sum += scoreValue(getAttrFn(data, field), token, weight);
	          });
	        }

	        return sum / field_count;
	      };
	    }();

	    if (token_count === 1) {
	      return function (data) {
	        return scoreObject(tokens[0], data);
	      };
	    }

	    if (search.options.conjunction === 'and') {
	      return function (data) {
	        var score,
	            sum = 0;

	        for (let token of tokens) {
	          score = scoreObject(token, data);
	          if (score <= 0) return 0;
	          sum += score;
	        }

	        return sum / token_count;
	      };
	    } else {
	      return function (data) {
	        var sum = 0;
	        iterate$1(tokens, token => {
	          sum += scoreObject(token, data);
	        });
	        return sum / token_count;
	      };
	    }
	  }

	  /**
	   * Returns a function that can be used to compare two
	   * results, for sorting purposes. If no sorting should
	   * be performed, `null` will be returned.
	   *
	   * @return function(a,b)
	   */
	  getSortFunction(query, options) {
	    var search = this.prepareSearch(query, options);
	    return this._getSortFunction(search);
	  }

	  _getSortFunction(search) {
	    var implicit_score,
	        sort_flds = [];
	    const self = this,
	          options = search.options,
	          sort = !search.query && options.sort_empty ? options.sort_empty : options.sort;

	    if (typeof sort == 'function') {
	      return sort.bind(this);
	    }
	    /**
	     * Fetches the specified sort field value
	     * from a search result item.
	     *
	     */


	    const get_field = function get_field(name, result) {
	      if (name === '$score') return result.score;
	      return search.getAttrFn(self.items[result.id], name);
	    }; // parse options


	    if (sort) {
	      for (let s of sort) {
	        if (search.query || s.field !== '$score') {
	          sort_flds.push(s);
	        }
	      }
	    } // the "$score" field is implied to be the primary
	    // sort field, unless it's manually specified


	    if (search.query) {
	      implicit_score = true;

	      for (let fld of sort_flds) {
	        if (fld.field === '$score') {
	          implicit_score = false;
	          break;
	        }
	      }

	      if (implicit_score) {
	        sort_flds.unshift({
	          field: '$score',
	          direction: 'desc'
	        });
	      } // without a search.query, all items will have the same score

	    } else {
	      sort_flds = sort_flds.filter(fld => fld.field !== '$score');
	    } // build function


	    const sort_flds_count = sort_flds.length;

	    if (!sort_flds_count) {
	      return null;
	    }

	    return function (a, b) {
	      var result, field;

	      for (let sort_fld of sort_flds) {
	        field = sort_fld.field;
	        let multiplier = sort_fld.direction === 'desc' ? -1 : 1;
	        result = multiplier * cmp(get_field(field, a), get_field(field, b));
	        if (result) return result;
	      }

	      return 0;
	    };
	  }

	  /**
	   * Parses a search query and returns an object
	   * with tokens and fields ready to be populated
	   * with results.
	   *
	   */
	  prepareSearch(query, optsUser) {
	    const weights = {};
	    var options = Object.assign({}, optsUser);
	    propToArray(options, 'sort');
	    propToArray(options, 'sort_empty'); // convert fields to new format

	    if (options.fields) {
	      propToArray(options, 'fields');
	      const fields = [];
	      options.fields.forEach(field => {
	        if (typeof field == 'string') {
	          field = {
	            field: field,
	            weight: 1
	          };
	        }

	        fields.push(field);
	        weights[field.field] = 'weight' in field ? field.weight : 1;
	      });
	      options.fields = fields;
	    }

	    return {
	      options: options,
	      query: query.toLowerCase().trim(),
	      tokens: this.tokenize(query, options.respect_word_boundaries, weights),
	      total: 0,
	      items: [],
	      weights: weights,
	      getAttrFn: options.nesting ? getAttrNesting : getAttr
	    };
	  }

	  /**
	   * Searches through all items and returns a sorted array of matches.
	   *
	   */
	  search(query, options) {
	    var self = this,
	        score,
	        search;
	    search = this.prepareSearch(query, options);
	    options = search.options;
	    query = search.query; // generate result scoring function

	    const fn_score = options.score || self._getScoreFunction(search); // perform search and sort


	    if (query.length) {
	      iterate$1(self.items, (item, id) => {
	        score = fn_score(item);

	        if (options.filter === false || score > 0) {
	          search.items.push({
	            'score': score,
	            'id': id
	          });
	        }
	      });
	    } else {
	      iterate$1(self.items, (_, id) => {
	        search.items.push({
	          'score': 1,
	          'id': id
	        });
	      });
	    }

	    const fn_sort = self._getSortFunction(search);

	    if (fn_sort) search.items.sort(fn_sort); // apply limits

	    search.total = search.items.length;

	    if (typeof options.limit === 'number') {
	      search.items = search.items.slice(0, options.limit);
	    }

	    return search;
	  }

	}

	/**
	 * Iterates over arrays and hashes.
	 *
	 * ```
	 * iterate(this.items, function(item, id) {
	 *    // invoked for each item
	 * });
	 * ```
	 *
	 */

	const iterate = (object, callback) => {
	  if (Array.isArray(object)) {
	    object.forEach(callback);
	  } else {
	    for (var key in object) {
	      if (object.hasOwnProperty(key)) {
	        callback(object[key], key);
	      }
	    }
	  }
	};

	/**
	 * Return a dom element from either a dom query string, jQuery object, a dom element or html string
	 * https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
	 *
	 * param query should be {}
	 */

	const getDom = query => {
	  if (query.jquery) {
	    return query[0];
	  }

	  if (query instanceof HTMLElement) {
	    return query;
	  }

	  if (isHtmlString(query)) {
	    var tpl = document.createElement('template');
	    tpl.innerHTML = query.trim(); // Never return a text node of whitespace as the result

	    return tpl.content.firstChild;
	  }

	  return document.querySelector(query);
	};
	const isHtmlString = arg => {
	  if (typeof arg === 'string' && arg.indexOf('<') > -1) {
	    return true;
	  }

	  return false;
	};
	const escapeQuery = query => {
	  return query.replace(/['"\\]/g, '\\$&');
	};
	/**
	 * Dispatch an event
	 *
	 */

	const triggerEvent = (dom_el, event_name) => {
	  var event = document.createEvent('HTMLEvents');
	  event.initEvent(event_name, true, false);
	  dom_el.dispatchEvent(event);
	};
	/**
	 * Apply CSS rules to a dom element
	 *
	 */

	const applyCSS = (dom_el, css) => {
	  Object.assign(dom_el.style, css);
	};
	/**
	 * Add css classes
	 *
	 */

	const addClasses = (elmts, ...classes) => {
	  var norm_classes = classesArray(classes);
	  elmts = castAsArray(elmts);
	  elmts.map(el => {
	    norm_classes.map(cls => {
	      el.classList.add(cls);
	    });
	  });
	};
	/**
	 * Remove css classes
	 *
	 */

	const removeClasses = (elmts, ...classes) => {
	  var norm_classes = classesArray(classes);
	  elmts = castAsArray(elmts);
	  elmts.map(el => {
	    norm_classes.map(cls => {
	      el.classList.remove(cls);
	    });
	  });
	};
	/**
	 * Return arguments
	 *
	 */

	const classesArray = args => {
	  var classes = [];
	  iterate(args, _classes => {
	    if (typeof _classes === 'string') {
	      _classes = _classes.trim().split(/[\11\12\14\15\40]/);
	    }

	    if (Array.isArray(_classes)) {
	      classes = classes.concat(_classes);
	    }
	  });
	  return classes.filter(Boolean);
	};
	/**
	 * Create an array from arg if it's not already an array
	 *
	 */

	const castAsArray = arg => {
	  if (!Array.isArray(arg)) {
	    arg = [arg];
	  }

	  return arg;
	};
	/**
	 * Get the closest node to the evt.target matching the selector
	 * Stops at wrapper
	 *
	 */

	const parentMatch = (target, selector, wrapper) => {
	  if (wrapper && !wrapper.contains(target)) {
	    return;
	  }

	  while (target && target.matches) {
	    if (target.matches(selector)) {
	      return target;
	    }

	    target = target.parentNode;
	  }
	};
	/**
	 * Get the first or last item from an array
	 *
	 * > 0 - right (last)
	 * <= 0 - left (first)
	 *
	 */

	const getTail = (list, direction = 0) => {
	  if (direction > 0) {
	    return list[list.length - 1];
	  }

	  return list[0];
	};
	/**
	 * Return true if an object is empty
	 *
	 */

	const isEmptyObject = obj => {
	  return Object.keys(obj).length === 0;
	};
	/**
	 * Get the index of an element amongst sibling nodes of the same type
	 *
	 */

	const nodeIndex = (el, amongst) => {
	  if (!el) return -1;
	  amongst = amongst || el.nodeName;
	  var i = 0;

	  while (el = el.previousElementSibling) {
	    if (el.matches(amongst)) {
	      i++;
	    }
	  }

	  return i;
	};
	/**
	 * Set attributes of an element
	 *
	 */

	const setAttr = (el, attrs) => {
	  iterate(attrs, (val, attr) => {
	    if (val == null) {
	      el.removeAttribute(attr);
	    } else {
	      el.setAttribute(attr, '' + val);
	    }
	  });
	};
	/**
	 * Replace a node
	 */

	const replaceNode = (existing, replacement) => {
	  if (existing.parentNode) existing.parentNode.replaceChild(replacement, existing);
	};

	/**
	 * highlight v3 | MIT license | Johann Burkard <jb@eaio.com>
	 * Highlights arbitrary terms in a node.
	 *
	 * - Modified by Marshal <beatgates@gmail.com> 2011-6-24 (added regex)
	 * - Modified by Brian Reavis <brian@thirdroute.com> 2012-8-27 (cleanup)
	 */
	const highlight = (element, regex) => {
	  if (regex === null) return; // convet string to regex

	  if (typeof regex === 'string') {
	    if (!regex.length) return;
	    regex = new RegExp(regex, 'i');
	  } // Wrap matching part of text node with highlighting <span>, e.g.
	  // Soccer  ->  <span class="highlight">Soc</span>cer  for regex = /soc/i


	  const highlightText = node => {
	    var match = node.data.match(regex);

	    if (match && node.data.length > 0) {
	      var spannode = document.createElement('span');
	      spannode.className = 'highlight';
	      var middlebit = node.splitText(match.index);
	      middlebit.splitText(match[0].length);
	      var middleclone = middlebit.cloneNode(true);
	      spannode.appendChild(middleclone);
	      replaceNode(middlebit, spannode);
	      return 1;
	    }

	    return 0;
	  }; // Recurse element node, looking for child text nodes to highlight, unless element
	  // is childless, <script>, <style>, or already highlighted: <span class="hightlight">


	  const highlightChildren = node => {
	    if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName) && (node.className !== 'highlight' || node.tagName !== 'SPAN')) {
	      Array.from(node.childNodes).forEach(element => {
	        highlightRecursive(element);
	      });
	    }
	  };

	  const highlightRecursive = node => {
	    if (node.nodeType === 3) {
	      return highlightText(node);
	    }

	    highlightChildren(node);
	    return 0;
	  };

	  highlightRecursive(element);
	};
	/**
	 * removeHighlight fn copied from highlight v5 and
	 * edited to remove with(), pass js strict mode, and use without jquery
	 */

	const removeHighlight = el => {
	  var elements = el.querySelectorAll("span.highlight");
	  Array.prototype.forEach.call(elements, function (el) {
	    var parent = el.parentNode;
	    parent.replaceChild(el.firstChild, el);
	    parent.normalize();
	  });
	};

	const KEY_A = 65;
	const KEY_RETURN = 13;
	const KEY_ESC = 27;
	const KEY_LEFT = 37;
	const KEY_UP = 38;
	const KEY_RIGHT = 39;
	const KEY_DOWN = 40;
	const KEY_BACKSPACE = 8;
	const KEY_DELETE = 46;
	const KEY_TAB = 9;
	const IS_MAC = typeof navigator === 'undefined' ? false : /Mac/.test(navigator.userAgent);
	const KEY_SHORTCUT = IS_MAC ? 'metaKey' : 'ctrlKey'; // ctrl key or apple key for ma

	var defaults = {
	  options: [],
	  optgroups: [],
	  plugins: [],
	  delimiter: ',',
	  splitOn: null,
	  // regexp or string for splitting up values from a paste command
	  persist: true,
	  diacritics: true,
	  create: null,
	  createOnBlur: false,
	  createFilter: null,
	  highlight: true,
	  openOnFocus: true,
	  shouldOpen: null,
	  maxOptions: 50,
	  maxItems: null,
	  hideSelected: null,
	  duplicates: false,
	  addPrecedence: false,
	  selectOnTab: false,
	  preload: null,
	  allowEmptyOption: false,
	  //closeAfterSelect: false,
	  loadThrottle: 300,
	  loadingClass: 'loading',
	  dataAttr: null,
	  //'data-data',
	  optgroupField: 'optgroup',
	  valueField: 'value',
	  labelField: 'text',
	  disabledField: 'disabled',
	  optgroupLabelField: 'label',
	  optgroupValueField: 'value',
	  lockOptgroupOrder: false,
	  sortField: '$order',
	  searchField: ['text'],
	  searchConjunction: 'and',
	  mode: null,
	  wrapperClass: 'ts-wrapper',
	  controlClass: 'ts-control',
	  dropdownClass: 'ts-dropdown',
	  dropdownContentClass: 'ts-dropdown-content',
	  itemClass: 'item',
	  optionClass: 'option',
	  dropdownParent: null,
	  controlInput: '<input type="text" autocomplete="off" size="1" />',
	  copyClassesToDropdown: false,
	  placeholder: null,
	  hidePlaceholder: null,
	  shouldLoad: function (query) {
	    return query.length > 0;
	  },

	  /*
	  load                 : null, // function(query, callback) { ... }
	  score                : null, // function(search) { ... }
	  onInitialize         : null, // function() { ... }
	  onChange             : null, // function(value) { ... }
	  onItemAdd            : null, // function(value, $item) { ... }
	  onItemRemove         : null, // function(value) { ... }
	  onClear              : null, // function() { ... }
	  onOptionAdd          : null, // function(value, data) { ... }
	  onOptionRemove       : null, // function(value) { ... }
	  onOptionClear        : null, // function() { ... }
	  onOptionGroupAdd     : null, // function(id, data) { ... }
	  onOptionGroupRemove  : null, // function(id) { ... }
	  onOptionGroupClear   : null, // function() { ... }
	  onDropdownOpen       : null, // function(dropdown) { ... }
	  onDropdownClose      : null, // function(dropdown) { ... }
	  onType               : null, // function(str) { ... }
	  onDelete             : null, // function(values) { ... }
	  */
	  render: {
	    /*
	    item: null,
	    optgroup: null,
	    optgroup_header: null,
	    option: null,
	    option_create: null
	    */
	  }
	};

	/**
	 * Converts a scalar to its best string representation
	 * for hash keys and HTML attribute values.
	 *
	 * Transformations:
	 *   'str'     -> 'str'
	 *   null      -> ''
	 *   undefined -> ''
	 *   true      -> '1'
	 *   false     -> '0'
	 *   0         -> '0'
	 *   1         -> '1'
	 *
	 */
	const hash_key = value => {
	  if (typeof value === 'undefined' || value === null) return null;
	  return get_hash(value);
	};
	const get_hash = value => {
	  if (typeof value === 'boolean') return value ? '1' : '0';
	  return value + '';
	};
	/**
	 * Escapes a string for use within HTML.
	 *
	 */

	const escape_html = str => {
	  return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	};
	/**
	 * Debounce the user provided load function
	 *
	 */

	const loadDebounce = (fn, delay) => {
	  var timeout;
	  return function (value, callback) {
	    var self = this;

	    if (timeout) {
	      self.loading = Math.max(self.loading - 1, 0);
	      clearTimeout(timeout);
	    }

	    timeout = setTimeout(function () {
	      timeout = null;
	      self.loadedSearches[value] = true;
	      fn.call(self, value, callback);
	    }, delay);
	  };
	};
	/**
	 * Debounce all fired events types listed in `types`
	 * while executing the provided `fn`.
	 *
	 */

	const debounce_events = (self, types, fn) => {
	  var type;
	  var trigger = self.trigger;
	  var event_args = {}; // override trigger method

	  self.trigger = function () {
	    var type = arguments[0];

	    if (types.indexOf(type) !== -1) {
	      event_args[type] = arguments;
	    } else {
	      return trigger.apply(self, arguments);
	    }
	  }; // invoke provided function


	  fn.apply(self, []);
	  self.trigger = trigger; // trigger queued events

	  for (type of types) {
	    if (type in event_args) {
	      trigger.apply(self, event_args[type]);
	    }
	  }
	};
	/**
	 * Determines the current selection within a text input control.
	 * Returns an object containing:
	 *   - start
	 *   - length
	 *
	 */

	const getSelection = input => {
	  return {
	    start: input.selectionStart || 0,
	    length: (input.selectionEnd || 0) - (input.selectionStart || 0)
	  };
	};
	/**
	 * Prevent default
	 *
	 */

	const preventDefault = (evt, stop = false) => {
	  if (evt) {
	    evt.preventDefault();

	    if (stop) {
	      evt.stopPropagation();
	    }
	  }
	};
	/**
	 * Add event helper
	 *
	 */

	const addEvent = (target, type, callback, options) => {
	  target.addEventListener(type, callback, options);
	};
	/**
	 * Return true if the requested key is down
	 * Will return false if more than one control character is pressed ( when [ctrl+shift+a] != [ctrl+a] )
	 * The current evt may not always set ( eg calling advanceSelection() )
	 *
	 */

	const isKeyDown = (key_name, evt) => {
	  if (!evt) {
	    return false;
	  }

	  if (!evt[key_name]) {
	    return false;
	  }

	  var count = (evt.altKey ? 1 : 0) + (evt.ctrlKey ? 1 : 0) + (evt.shiftKey ? 1 : 0) + (evt.metaKey ? 1 : 0);

	  if (count === 1) {
	    return true;
	  }

	  return false;
	};
	/**
	 * Get the id of an element
	 * If the id attribute is not set, set the attribute with the given id
	 *
	 */

	const getId = (el, id) => {
	  const existing_id = el.getAttribute('id');

	  if (existing_id) {
	    return existing_id;
	  }

	  el.setAttribute('id', id);
	  return id;
	};
	/**
	 * Returns a string with backslashes added before characters that need to be escaped.
	 */

	const addSlashes = str => {
	  return str.replace(/[\\"']/g, '\\$&');
	};
	/**
	 *
	 */

	const append = (parent, node) => {
	  if (node) parent.append(node);
	};

	function getSettings(input, settings_user) {
	  var settings = Object.assign({}, defaults, settings_user);
	  var attr_data = settings.dataAttr;
	  var field_label = settings.labelField;
	  var field_value = settings.valueField;
	  var field_disabled = settings.disabledField;
	  var field_optgroup = settings.optgroupField;
	  var field_optgroup_label = settings.optgroupLabelField;
	  var field_optgroup_value = settings.optgroupValueField;
	  var tag_name = input.tagName.toLowerCase();
	  var placeholder = input.getAttribute('placeholder') || input.getAttribute('data-placeholder');

	  if (!placeholder && !settings.allowEmptyOption) {
	    let option = input.querySelector('option[value=""]');

	    if (option) {
	      placeholder = option.textContent;
	    }
	  }

	  var settings_element = {
	    placeholder: placeholder,
	    options: [],
	    optgroups: [],
	    items: [],
	    maxItems: null
	  };
	  /**
	   * Initialize from a <select> element.
	   *
	   */

	  var init_select = () => {
	    var tagName;
	    var options = settings_element.options;
	    var optionsMap = {};
	    var group_count = 1;

	    var readData = el => {
	      var data = Object.assign({}, el.dataset); // get plain object from DOMStringMap

	      var json = attr_data && data[attr_data];

	      if (typeof json === 'string' && json.length) {
	        data = Object.assign(data, JSON.parse(json));
	      }

	      return data;
	    };

	    var addOption = (option, group) => {
	      var value = hash_key(option.value);
	      if (value == null) return;
	      if (!value && !settings.allowEmptyOption) return; // if the option already exists, it's probably been
	      // duplicated in another optgroup. in this case, push
	      // the current group to the "optgroup" property on the
	      // existing option so that it's rendered in both places.

	      if (optionsMap.hasOwnProperty(value)) {
	        if (group) {
	          var arr = optionsMap[value][field_optgroup];

	          if (!arr) {
	            optionsMap[value][field_optgroup] = group;
	          } else if (!Array.isArray(arr)) {
	            optionsMap[value][field_optgroup] = [arr, group];
	          } else {
	            arr.push(group);
	          }
	        }
	      } else {
	        var option_data = readData(option);
	        option_data[field_label] = option_data[field_label] || option.textContent;
	        option_data[field_value] = option_data[field_value] || value;
	        option_data[field_disabled] = option_data[field_disabled] || option.disabled;
	        option_data[field_optgroup] = option_data[field_optgroup] || group;
	        option_data.$option = option;
	        optionsMap[value] = option_data;
	        options.push(option_data);
	      }

	      if (option.selected) {
	        settings_element.items.push(value);
	      }
	    };

	    var addGroup = optgroup => {
	      var id, optgroup_data;
	      optgroup_data = readData(optgroup);
	      optgroup_data[field_optgroup_label] = optgroup_data[field_optgroup_label] || optgroup.getAttribute('label') || '';
	      optgroup_data[field_optgroup_value] = optgroup_data[field_optgroup_value] || group_count++;
	      optgroup_data[field_disabled] = optgroup_data[field_disabled] || optgroup.disabled;
	      settings_element.optgroups.push(optgroup_data);
	      id = optgroup_data[field_optgroup_value];
	      iterate(optgroup.children, option => {
	        addOption(option, id);
	      });
	    };

	    settings_element.maxItems = input.hasAttribute('multiple') ? null : 1;
	    iterate(input.children, child => {
	      tagName = child.tagName.toLowerCase();

	      if (tagName === 'optgroup') {
	        addGroup(child);
	      } else if (tagName === 'option') {
	        addOption(child);
	      }
	    });
	  };
	  /**
	   * Initialize from a <input type="text"> element.
	   *
	   */


	  var init_textbox = () => {
	    const data_raw = input.getAttribute(attr_data);

	    if (!data_raw) {
	      var value = input.value.trim() || '';
	      if (!settings.allowEmptyOption && !value.length) return;
	      const values = value.split(settings.delimiter);
	      iterate(values, value => {
	        const option = {};
	        option[field_label] = value;
	        option[field_value] = value;
	        settings_element.options.push(option);
	      });
	      settings_element.items = values;
	    } else {
	      settings_element.options = JSON.parse(data_raw);
	      iterate(settings_element.options, opt => {
	        settings_element.items.push(opt[field_value]);
	      });
	    }
	  };

	  if (tag_name === 'select') {
	    init_select();
	  } else {
	    init_textbox();
	  }

	  return Object.assign({}, defaults, settings_element, settings_user);
	}

	var instance_i = 0;
	class TomSelect extends MicroPlugin(MicroEvent) {
	  // @deprecated 1.8
	  constructor(input_arg, user_settings) {
	    super();
	    this.control_input = void 0;
	    this.wrapper = void 0;
	    this.dropdown = void 0;
	    this.control = void 0;
	    this.dropdown_content = void 0;
	    this.focus_node = void 0;
	    this.order = 0;
	    this.settings = void 0;
	    this.input = void 0;
	    this.tabIndex = void 0;
	    this.is_select_tag = void 0;
	    this.rtl = void 0;
	    this.inputId = void 0;
	    this._destroy = void 0;
	    this.sifter = void 0;
	    this.isOpen = false;
	    this.isDisabled = false;
	    this.isRequired = void 0;
	    this.isInvalid = false;
	    this.isValid = true;
	    this.isLocked = false;
	    this.isFocused = false;
	    this.isInputHidden = false;
	    this.isSetup = false;
	    this.ignoreFocus = false;
	    this.ignoreHover = false;
	    this.hasOptions = false;
	    this.currentResults = void 0;
	    this.lastValue = '';
	    this.caretPos = 0;
	    this.loading = 0;
	    this.loadedSearches = {};
	    this.activeOption = null;
	    this.activeItems = [];
	    this.optgroups = {};
	    this.options = {};
	    this.userOptions = {};
	    this.items = [];
	    instance_i++;
	    var dir;
	    var input = getDom(input_arg);

	    if (input.tomselect) {
	      throw new Error('Tom Select already initialized on this element');
	    }

	    input.tomselect = this; // detect rtl environment

	    var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
	    dir = computedStyle.getPropertyValue('direction'); // setup default state

	    const settings = getSettings(input, user_settings);
	    this.settings = settings;
	    this.input = input;
	    this.tabIndex = input.tabIndex || 0;
	    this.is_select_tag = input.tagName.toLowerCase() === 'select';
	    this.rtl = /rtl/i.test(dir);
	    this.inputId = getId(input, 'tomselect-' + instance_i);
	    this.isRequired = input.required; // search system

	    this.sifter = new Sifter(this.options, {
	      diacritics: settings.diacritics
	    }); // option-dependent defaults

	    settings.mode = settings.mode || (settings.maxItems === 1 ? 'single' : 'multi');

	    if (typeof settings.hideSelected !== 'boolean') {
	      settings.hideSelected = settings.mode === 'multi';
	    }

	    if (typeof settings.hidePlaceholder !== 'boolean') {
	      settings.hidePlaceholder = settings.mode !== 'multi';
	    } // set up createFilter callback


	    var filter = settings.createFilter;

	    if (typeof filter !== 'function') {
	      if (typeof filter === 'string') {
	        filter = new RegExp(filter);
	      }

	      if (filter instanceof RegExp) {
	        settings.createFilter = input => filter.test(input);
	      } else {
	        settings.createFilter = value => {
	          return this.settings.duplicates || !this.options[value];
	        };
	      }
	    }

	    this.initializePlugins(settings.plugins);
	    this.setupCallbacks();
	    this.setupTemplates(); // Create all elements

	    const wrapper = getDom('<div>');
	    const control = getDom('<div>');

	    const dropdown = this._render('dropdown');

	    const dropdown_content = getDom(`<div role="listbox" tabindex="-1">`);
	    const classes = this.input.getAttribute('class') || '';
	    const inputMode = settings.mode;
	    var control_input;
	    addClasses(wrapper, settings.wrapperClass, classes, inputMode);
	    addClasses(control, settings.controlClass);
	    append(wrapper, control);
	    addClasses(dropdown, settings.dropdownClass, inputMode);

	    if (settings.copyClassesToDropdown) {
	      addClasses(dropdown, classes);
	    }

	    addClasses(dropdown_content, settings.dropdownContentClass);
	    append(dropdown, dropdown_content);
	    getDom(settings.dropdownParent || wrapper).appendChild(dropdown); // default controlInput

	    if (isHtmlString(settings.controlInput)) {
	      control_input = getDom(settings.controlInput); // set attributes

	      var attrs = ['autocorrect', 'autocapitalize', 'autocomplete'];
	      iterate$1(attrs, attr => {
	        if (input.getAttribute(attr)) {
	          setAttr(control_input, {
	            [attr]: input.getAttribute(attr)
	          });
	        }
	      });
	      control_input.tabIndex = -1;
	      control.appendChild(control_input);
	      this.focus_node = control_input; // dom element
	    } else if (settings.controlInput) {
	      control_input = getDom(settings.controlInput);
	      this.focus_node = control_input;
	    } else {
	      control_input = getDom('<input/>');
	      this.focus_node = control;
	    }

	    this.wrapper = wrapper;
	    this.dropdown = dropdown;
	    this.dropdown_content = dropdown_content;
	    this.control = control;
	    this.control_input = control_input;
	    this.setup();
	  }
	  /**
	   * set up event bindings.
	   *
	   */


	  setup() {
	    const self = this;
	    const settings = self.settings;
	    const control_input = self.control_input;
	    const dropdown = self.dropdown;
	    const dropdown_content = self.dropdown_content;
	    const wrapper = self.wrapper;
	    const control = self.control;
	    const input = self.input;
	    const focus_node = self.focus_node;
	    const passive_event = {
	      passive: true
	    };
	    const listboxId = self.inputId + '-ts-dropdown';
	    setAttr(dropdown_content, {
	      id: listboxId
	    });
	    setAttr(focus_node, {
	      role: 'combobox',
	      'aria-haspopup': 'listbox',
	      'aria-expanded': 'false',
	      'aria-controls': listboxId
	    });
	    const control_id = getId(focus_node, self.inputId + '-ts-control');
	    const query = "label[for='" + escapeQuery(self.inputId) + "']";
	    const label = document.querySelector(query);
	    const label_click = self.focus.bind(self);

	    if (label) {
	      addEvent(label, 'click', label_click);
	      setAttr(label, {
	        for: control_id
	      });
	      const label_id = getId(label, self.inputId + '-ts-label');
	      setAttr(focus_node, {
	        'aria-labelledby': label_id
	      });
	      setAttr(dropdown_content, {
	        'aria-labelledby': label_id
	      });
	    }

	    wrapper.style.width = input.style.width;

	    if (self.plugins.names.length) {
	      const classes_plugins = 'plugin-' + self.plugins.names.join(' plugin-');
	      addClasses([wrapper, dropdown], classes_plugins);
	    }

	    if ((settings.maxItems === null || settings.maxItems > 1) && self.is_select_tag) {
	      setAttr(input, {
	        multiple: 'multiple'
	      });
	    }

	    if (settings.placeholder) {
	      setAttr(control_input, {
	        placeholder: settings.placeholder
	      });
	    } // if splitOn was not passed in, construct it from the delimiter to allow pasting universally


	    if (!settings.splitOn && settings.delimiter) {
	      settings.splitOn = new RegExp('\\s*' + escape_regex(settings.delimiter) + '+\\s*');
	    } // debounce user defined load() if loadThrottle > 0
	    // after initializePlugins() so plugins can create/modify user defined loaders


	    if (settings.load && settings.loadThrottle) {
	      settings.load = loadDebounce(settings.load, settings.loadThrottle);
	    }

	    self.control_input.type = input.type;
	    addEvent(dropdown, 'mousemove', () => {
	      self.ignoreHover = false;
	    });
	    addEvent(dropdown, 'mouseenter', e => {
	      var target_match = parentMatch(e.target, '[data-selectable]', dropdown);
	      if (target_match) self.onOptionHover(e, target_match);
	    }, {
	      capture: true
	    }); // clicking on an option should select it

	    addEvent(dropdown, 'click', evt => {
	      const option = parentMatch(evt.target, '[data-selectable]');

	      if (option) {
	        self.onOptionSelect(evt, option);
	        preventDefault(evt, true);
	      }
	    });
	    addEvent(control, 'click', evt => {
	      var target_match = parentMatch(evt.target, '[data-ts-item]', control);

	      if (target_match && self.onItemSelect(evt, target_match)) {
	        preventDefault(evt, true);
	        return;
	      } // retain focus (see control_input mousedown)


	      if (control_input.value != '') {
	        return;
	      }

	      self.onClick();
	      preventDefault(evt, true);
	    }); // keydown on focus_node for arrow_down/arrow_up

	    addEvent(focus_node, 'keydown', e => self.onKeyDown(e)); // keypress and input/keyup

	    addEvent(control_input, 'keypress', e => self.onKeyPress(e));
	    addEvent(control_input, 'input', e => self.onInput(e));
	    addEvent(focus_node, 'blur', e => self.onBlur(e));
	    addEvent(focus_node, 'focus', e => self.onFocus(e));
	    addEvent(control_input, 'paste', e => self.onPaste(e));

	    const doc_mousedown = evt => {
	      // blur if target is outside of this instance
	      // dropdown is not always inside wrapper
	      const target = evt.composedPath()[0];

	      if (!wrapper.contains(target) && !dropdown.contains(target)) {
	        if (self.isFocused) {
	          self.blur();
	        }

	        self.inputState();
	        return;
	      } // retain focus by preventing native handling. if the
	      // event target is the input it should not be modified.
	      // otherwise, text selection within the input won't work.
	      // Fixes bug #212 which is no covered by tests


	      if (target == control_input && self.isOpen) {
	        evt.stopPropagation(); // clicking anywhere in the control should not blur the control_input (which would close the dropdown)
	      } else {
	        preventDefault(evt, true);
	      }
	    };

	    const win_scroll = () => {
	      if (self.isOpen) {
	        self.positionDropdown();
	      }
	    };

	    addEvent(document, 'mousedown', doc_mousedown);
	    addEvent(window, 'scroll', win_scroll, passive_event);
	    addEvent(window, 'resize', win_scroll, passive_event);

	    this._destroy = () => {
	      document.removeEventListener('mousedown', doc_mousedown);
	      window.removeEventListener('scroll', win_scroll);
	      window.removeEventListener('resize', win_scroll);
	      if (label) label.removeEventListener('click', label_click);
	    }; // store original html and tab index so that they can be
	    // restored when the destroy() method is called.


	    this.revertSettings = {
	      innerHTML: input.innerHTML,
	      tabIndex: input.tabIndex
	    };
	    input.tabIndex = -1;
	    input.insertAdjacentElement('afterend', self.wrapper);
	    self.sync(false);
	    settings.items = [];
	    delete settings.optgroups;
	    delete settings.options;
	    addEvent(input, 'invalid', () => {
	      if (self.isValid) {
	        self.isValid = false;
	        self.isInvalid = true;
	        self.refreshState();
	      }
	    });
	    self.updateOriginalInput();
	    self.refreshItems();
	    self.close(false);
	    self.inputState();
	    self.isSetup = true;

	    if (input.disabled) {
	      self.disable();
	    } else {
	      self.enable(); //sets tabIndex
	    }

	    self.on('change', this.onChange);
	    addClasses(input, 'tomselected', 'ts-hidden-accessible');
	    self.trigger('initialize'); // preload options

	    if (settings.preload === true) {
	      self.preload();
	    }
	  }
	  /**
	   * Register options and optgroups
	   *
	   */


	  setupOptions(options = [], optgroups = []) {
	    // build options table
	    this.addOptions(options); // build optgroup table

	    iterate$1(optgroups, optgroup => {
	      this.registerOptionGroup(optgroup);
	    });
	  }
	  /**
	   * Sets up default rendering functions.
	   */


	  setupTemplates() {
	    var self = this;
	    var field_label = self.settings.labelField;
	    var field_optgroup = self.settings.optgroupLabelField;
	    var templates = {
	      'optgroup': data => {
	        let optgroup = document.createElement('div');
	        optgroup.className = 'optgroup';
	        optgroup.appendChild(data.options);
	        return optgroup;
	      },
	      'optgroup_header': (data, escape) => {
	        return '<div class="optgroup-header">' + escape(data[field_optgroup]) + '</div>';
	      },
	      'option': (data, escape) => {
	        return '<div>' + escape(data[field_label]) + '</div>';
	      },
	      'item': (data, escape) => {
	        return '<div>' + escape(data[field_label]) + '</div>';
	      },
	      'option_create': (data, escape) => {
	        return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>';
	      },
	      'no_results': () => {
	        return '<div class="no-results">No results found</div>';
	      },
	      'loading': () => {
	        return '<div class="spinner"></div>';
	      },
	      'not_loading': () => {},
	      'dropdown': () => {
	        return '<div></div>';
	      }
	    };
	    self.settings.render = Object.assign({}, templates, self.settings.render);
	  }
	  /**
	   * Maps fired events to callbacks provided
	   * in the settings used when creating the control.
	   */


	  setupCallbacks() {
	    var key, fn;
	    var callbacks = {
	      'initialize': 'onInitialize',
	      'change': 'onChange',
	      'item_add': 'onItemAdd',
	      'item_remove': 'onItemRemove',
	      'item_select': 'onItemSelect',
	      'clear': 'onClear',
	      'option_add': 'onOptionAdd',
	      'option_remove': 'onOptionRemove',
	      'option_clear': 'onOptionClear',
	      'optgroup_add': 'onOptionGroupAdd',
	      'optgroup_remove': 'onOptionGroupRemove',
	      'optgroup_clear': 'onOptionGroupClear',
	      'dropdown_open': 'onDropdownOpen',
	      'dropdown_close': 'onDropdownClose',
	      'type': 'onType',
	      'load': 'onLoad',
	      'focus': 'onFocus',
	      'blur': 'onBlur'
	    };

	    for (key in callbacks) {
	      fn = this.settings[callbacks[key]];
	      if (fn) this.on(key, fn);
	    }
	  }
	  /**
	   * Sync the Tom Select instance with the original input or select
	   *
	   */


	  sync(get_settings = true) {
	    const self = this;
	    const settings = get_settings ? getSettings(self.input, {
	      delimiter: self.settings.delimiter
	    }) : self.settings;
	    self.setupOptions(settings.options, settings.optgroups);
	    self.setValue(settings.items || [], true); // silent prevents recursion

	    self.lastQuery = null; // so updated options will be displayed in dropdown
	  }
	  /**
	   * Triggered when the main control element
	   * has a click event.
	   *
	   */


	  onClick() {
	    var self = this;

	    if (self.activeItems.length > 0) {
	      self.clearActiveItems();
	      self.focus();
	      return;
	    }

	    if (self.isFocused && self.isOpen) {
	      self.blur();
	    } else {
	      self.focus();
	    }
	  }
	  /**
	   * @deprecated v1.7
	   *
	   */


	  onMouseDown() {}
	  /**
	   * Triggered when the value of the control has been changed.
	   * This should propagate the event to the original DOM
	   * input / select element.
	   */


	  onChange() {
	    triggerEvent(this.input, 'input');
	    triggerEvent(this.input, 'change');
	  }
	  /**
	   * Triggered on <input> paste.
	   *
	   */


	  onPaste(e) {
	    var self = this;

	    if (self.isInputHidden || self.isLocked) {
	      preventDefault(e);
	      return;
	    } // If a regex or string is included, this will split the pasted
	    // input and create Items for each separate value


	    if (!self.settings.splitOn) {
	      return;
	    } // Wait for pasted text to be recognized in value


	    setTimeout(() => {
	      var pastedText = self.inputValue();

	      if (!pastedText.match(self.settings.splitOn)) {
	        return;
	      }

	      var splitInput = pastedText.trim().split(self.settings.splitOn);
	      iterate$1(splitInput, piece => {
	        const hash = hash_key(piece);

	        if (hash) {
	          if (this.options[piece]) {
	            self.addItem(piece);
	          } else {
	            self.createItem(piece);
	          }
	        }
	      });
	    }, 0);
	  }
	  /**
	   * Triggered on <input> keypress.
	   *
	   */


	  onKeyPress(e) {
	    var self = this;

	    if (self.isLocked) {
	      preventDefault(e);
	      return;
	    }

	    var character = String.fromCharCode(e.keyCode || e.which);

	    if (self.settings.create && self.settings.mode === 'multi' && character === self.settings.delimiter) {
	      self.createItem();
	      preventDefault(e);
	      return;
	    }
	  }
	  /**
	   * Triggered on <input> keydown.
	   *
	   */


	  onKeyDown(e) {
	    var self = this;
	    self.ignoreHover = true;

	    if (self.isLocked) {
	      if (e.keyCode !== KEY_TAB) {
	        preventDefault(e);
	      }

	      return;
	    }

	    switch (e.keyCode) {
	      // ctrl+A: select all
	      case KEY_A:
	        if (isKeyDown(KEY_SHORTCUT, e)) {
	          if (self.control_input.value == '') {
	            preventDefault(e);
	            self.selectAll();
	            return;
	          }
	        }

	        break;
	      // esc: close dropdown

	      case KEY_ESC:
	        if (self.isOpen) {
	          preventDefault(e, true);
	          self.close();
	        }

	        self.clearActiveItems();
	        return;
	      // down: open dropdown or move selection down

	      case KEY_DOWN:
	        if (!self.isOpen && self.hasOptions) {
	          self.open();
	        } else if (self.activeOption) {
	          let next = self.getAdjacent(self.activeOption, 1);
	          if (next) self.setActiveOption(next);
	        }

	        preventDefault(e);
	        return;
	      // up: move selection up

	      case KEY_UP:
	        if (self.activeOption) {
	          let prev = self.getAdjacent(self.activeOption, -1);
	          if (prev) self.setActiveOption(prev);
	        }

	        preventDefault(e);
	        return;
	      // return: select active option

	      case KEY_RETURN:
	        if (self.canSelect(self.activeOption)) {
	          self.onOptionSelect(e, self.activeOption);
	          preventDefault(e); // if the option_create=null, the dropdown might be closed
	        } else if (self.settings.create && self.createItem()) {
	          preventDefault(e); // don't submit form when searching for a value
	        } else if (document.activeElement == self.control_input && self.isOpen) {
	          preventDefault(e);
	        }

	        return;
	      // left: modifiy item selection to the left

	      case KEY_LEFT:
	        self.advanceSelection(-1, e);
	        return;
	      // right: modifiy item selection to the right

	      case KEY_RIGHT:
	        self.advanceSelection(1, e);
	        return;
	      // tab: select active option and/or create item

	      case KEY_TAB:
	        if (self.settings.selectOnTab) {
	          if (self.canSelect(self.activeOption)) {
	            self.onOptionSelect(e, self.activeOption); // prevent default [tab] behaviour of jump to the next field
	            // if select isFull, then the dropdown won't be open and [tab] will work normally

	            preventDefault(e);
	          }

	          if (self.settings.create && self.createItem()) {
	            preventDefault(e);
	          }
	        }

	        return;
	      // delete|backspace: delete items

	      case KEY_BACKSPACE:
	      case KEY_DELETE:
	        self.deleteSelection(e);
	        return;
	    } // don't enter text in the control_input when active items are selected


	    if (self.isInputHidden && !isKeyDown(KEY_SHORTCUT, e)) {
	      preventDefault(e);
	    }
	  }
	  /**
	   * Triggered on <input> keyup.
	   *
	   */


	  onInput(e) {
	    var self = this;

	    if (self.isLocked) {
	      return;
	    }

	    var value = self.inputValue();

	    if (self.lastValue !== value) {
	      self.lastValue = value;

	      if (self.settings.shouldLoad.call(self, value)) {
	        self.load(value);
	      }

	      self.refreshOptions();
	      self.trigger('type', value);
	    }
	  }
	  /**
	   * Triggered when the user rolls over
	   * an option in the autocomplete dropdown menu.
	   *
	   */


	  onOptionHover(evt, option) {
	    if (this.ignoreHover) return;
	    this.setActiveOption(option, false);
	  }
	  /**
	   * Triggered on <input> focus.
	   *
	   */


	  onFocus(e) {
	    var self = this;
	    var wasFocused = self.isFocused;

	    if (self.isDisabled) {
	      self.blur();
	      preventDefault(e);
	      return;
	    }

	    if (self.ignoreFocus) return;
	    self.isFocused = true;
	    if (self.settings.preload === 'focus') self.preload();
	    if (!wasFocused) self.trigger('focus');

	    if (!self.activeItems.length) {
	      self.showInput();
	      self.refreshOptions(!!self.settings.openOnFocus);
	    }

	    self.refreshState();
	  }
	  /**
	   * Triggered on <input> blur.
	   *
	   */


	  onBlur(e) {
	    if (document.hasFocus() === false) return;
	    var self = this;
	    if (!self.isFocused) return;
	    self.isFocused = false;
	    self.ignoreFocus = false;

	    var deactivate = () => {
	      self.close();
	      self.setActiveItem();
	      self.setCaret(self.items.length);
	      self.trigger('blur');
	    };

	    if (self.settings.create && self.settings.createOnBlur) {
	      self.createItem(null, deactivate);
	    } else {
	      deactivate();
	    }
	  }
	  /**
	   * Triggered when the user clicks on an option
	   * in the autocomplete dropdown menu.
	   *
	   */


	  onOptionSelect(evt, option) {
	    var value,
	        self = this; // should not be possible to trigger a option under a disabled optgroup

	    if (option.parentElement && option.parentElement.matches('[data-disabled]')) {
	      return;
	    }

	    if (option.classList.contains('create')) {
	      self.createItem(null, () => {
	        if (self.settings.closeAfterSelect) {
	          self.close();
	        }
	      });
	    } else {
	      value = option.dataset.value;

	      if (typeof value !== 'undefined') {
	        self.lastQuery = null;
	        self.addItem(value);

	        if (self.settings.closeAfterSelect) {
	          self.close();
	        }

	        if (!self.settings.hideSelected && evt.type && /click/.test(evt.type)) {
	          self.setActiveOption(option);
	        }
	      }
	    }
	  }
	  /**
	   * Return true if the given option can be selected
	   *
	   */


	  canSelect(option) {
	    if (this.isOpen && option && this.dropdown_content.contains(option)) {
	      return true;
	    }

	    return false;
	  }
	  /**
	   * Triggered when the user clicks on an item
	   * that has been selected.
	   *
	   */


	  onItemSelect(evt, item) {
	    var self = this;

	    if (!self.isLocked && self.settings.mode === 'multi') {
	      preventDefault(evt);
	      self.setActiveItem(item, evt);
	      return true;
	    }

	    return false;
	  }
	  /**
	   * Determines whether or not to invoke
	   * the user-provided option provider / loader
	   *
	   * Note, there is a subtle difference between
	   * this.canLoad() and this.settings.shouldLoad();
	   *
	   *	- settings.shouldLoad() is a user-input validator.
	   *	When false is returned, the not_loading template
	   *	will be added to the dropdown
	   *
	   *	- canLoad() is lower level validator that checks
	   * 	the Tom Select instance. There is no inherent user
	   *	feedback when canLoad returns false
	   *
	   */


	  canLoad(value) {
	    if (!this.settings.load) return false;
	    if (this.loadedSearches.hasOwnProperty(value)) return false;
	    return true;
	  }
	  /**
	   * Invokes the user-provided option provider / loader.
	   *
	   */


	  load(value) {
	    const self = this;
	    if (!self.canLoad(value)) return;
	    addClasses(self.wrapper, self.settings.loadingClass);
	    self.loading++;
	    const callback = self.loadCallback.bind(self);
	    self.settings.load.call(self, value, callback);
	  }
	  /**
	   * Invoked by the user-provided option provider
	   *
	   */


	  loadCallback(options, optgroups) {
	    const self = this;
	    self.loading = Math.max(self.loading - 1, 0);
	    self.lastQuery = null;
	    self.clearActiveOption(); // when new results load, focus should be on first option

	    self.setupOptions(options, optgroups);
	    self.refreshOptions(self.isFocused && !self.isInputHidden);

	    if (!self.loading) {
	      removeClasses(self.wrapper, self.settings.loadingClass);
	    }

	    self.trigger('load', options, optgroups);
	  }

	  preload() {
	    var classList = this.wrapper.classList;
	    if (classList.contains('preloaded')) return;
	    classList.add('preloaded');
	    this.load('');
	  }
	  /**
	   * Sets the input field of the control to the specified value.
	   *
	   */


	  setTextboxValue(value = '') {
	    var input = this.control_input;
	    var changed = input.value !== value;

	    if (changed) {
	      input.value = value;
	      triggerEvent(input, 'update');
	      this.lastValue = value;
	    }
	  }
	  /**
	   * Returns the value of the control. If multiple items
	   * can be selected (e.g. <select multiple>), this returns
	   * an array. If only one item can be selected, this
	   * returns a string.
	   *
	   */


	  getValue() {
	    if (this.is_select_tag && this.input.hasAttribute('multiple')) {
	      return this.items;
	    }

	    return this.items.join(this.settings.delimiter);
	  }
	  /**
	   * Resets the selected items to the given value.
	   *
	   */


	  setValue(value, silent) {
	    var events = silent ? [] : ['change'];
	    debounce_events(this, events, () => {
	      this.clear(silent);
	      this.addItems(value, silent);
	    });
	  }
	  /**
	   * Resets the number of max items to the given value
	   *
	   */


	  setMaxItems(value) {
	    if (value === 0) value = null; //reset to unlimited items.

	    this.settings.maxItems = value;
	    this.refreshState();
	  }
	  /**
	   * Sets the selected item.
	   *
	   */


	  setActiveItem(item, e) {
	    var self = this;
	    var eventName;
	    var i, begin, end, swap;
	    var last;
	    if (self.settings.mode === 'single') return; // clear the active selection

	    if (!item) {
	      self.clearActiveItems();

	      if (self.isFocused) {
	        self.showInput();
	      }

	      return;
	    } // modify selection


	    eventName = e && e.type.toLowerCase();

	    if (eventName === 'click' && isKeyDown('shiftKey', e) && self.activeItems.length) {
	      last = self.getLastActive();
	      begin = Array.prototype.indexOf.call(self.control.children, last);
	      end = Array.prototype.indexOf.call(self.control.children, item);

	      if (begin > end) {
	        swap = begin;
	        begin = end;
	        end = swap;
	      }

	      for (i = begin; i <= end; i++) {
	        item = self.control.children[i];

	        if (self.activeItems.indexOf(item) === -1) {
	          self.setActiveItemClass(item);
	        }
	      }

	      preventDefault(e);
	    } else if (eventName === 'click' && isKeyDown(KEY_SHORTCUT, e) || eventName === 'keydown' && isKeyDown('shiftKey', e)) {
	      if (item.classList.contains('active')) {
	        self.removeActiveItem(item);
	      } else {
	        self.setActiveItemClass(item);
	      }
	    } else {
	      self.clearActiveItems();
	      self.setActiveItemClass(item);
	    } // ensure control has focus


	    self.hideInput();

	    if (!self.isFocused) {
	      self.focus();
	    }
	  }
	  /**
	   * Set the active and last-active classes
	   *
	   */


	  setActiveItemClass(item) {
	    const self = this;
	    const last_active = self.control.querySelector('.last-active');
	    if (last_active) removeClasses(last_active, 'last-active');
	    addClasses(item, 'active last-active');
	    self.trigger('item_select', item);

	    if (self.activeItems.indexOf(item) == -1) {
	      self.activeItems.push(item);
	    }
	  }
	  /**
	   * Remove active item
	   *
	   */


	  removeActiveItem(item) {
	    var idx = this.activeItems.indexOf(item);
	    this.activeItems.splice(idx, 1);
	    removeClasses(item, 'active');
	  }
	  /**
	   * Clears all the active items
	   *
	   */


	  clearActiveItems() {
	    removeClasses(this.activeItems, 'active');
	    this.activeItems = [];
	  }
	  /**
	   * Sets the selected item in the dropdown menu
	   * of available options.
	   *
	   */


	  setActiveOption(option, scroll = true) {
	    if (option === this.activeOption) {
	      return;
	    }

	    this.clearActiveOption();
	    if (!option) return;
	    this.activeOption = option;
	    setAttr(this.focus_node, {
	      'aria-activedescendant': option.getAttribute('id')
	    });
	    setAttr(option, {
	      'aria-selected': 'true'
	    });
	    addClasses(option, 'active');
	    if (scroll) this.scrollToOption(option);
	  }
	  /**
	   * Sets the dropdown_content scrollTop to display the option
	   *
	   */


	  scrollToOption(option, behavior) {
	    if (!option) return;
	    const content = this.dropdown_content;
	    const height_menu = content.clientHeight;
	    const scrollTop = content.scrollTop || 0;
	    const height_item = option.offsetHeight;
	    const y = option.getBoundingClientRect().top - content.getBoundingClientRect().top + scrollTop;

	    if (y + height_item > height_menu + scrollTop) {
	      this.scroll(y - height_menu + height_item, behavior);
	    } else if (y < scrollTop) {
	      this.scroll(y, behavior);
	    }
	  }
	  /**
	   * Scroll the dropdown to the given position
	   *
	   */


	  scroll(scrollTop, behavior) {
	    const content = this.dropdown_content;

	    if (behavior) {
	      content.style.scrollBehavior = behavior;
	    }

	    content.scrollTop = scrollTop;
	    content.style.scrollBehavior = '';
	  }
	  /**
	   * Clears the active option
	   *
	   */


	  clearActiveOption() {
	    if (this.activeOption) {
	      removeClasses(this.activeOption, 'active');
	      setAttr(this.activeOption, {
	        'aria-selected': null
	      });
	    }

	    this.activeOption = null;
	    setAttr(this.focus_node, {
	      'aria-activedescendant': null
	    });
	  }
	  /**
	   * Selects all items (CTRL + A).
	   */


	  selectAll() {
	    const self = this;
	    if (self.settings.mode === 'single') return;
	    const activeItems = self.controlChildren();
	    if (!activeItems.length) return;
	    self.hideInput();
	    self.close();
	    self.activeItems = activeItems;
	    iterate$1(activeItems, item => {
	      self.setActiveItemClass(item);
	    });
	  }
	  /**
	   * Determines if the control_input should be in a hidden or visible state
	   *
	   */


	  inputState() {
	    var self = this;
	    if (!self.control.contains(self.control_input)) return;
	    setAttr(self.control_input, {
	      placeholder: self.settings.placeholder
	    });

	    if (self.activeItems.length > 0 || !self.isFocused && self.settings.hidePlaceholder && self.items.length > 0) {
	      self.setTextboxValue();
	      self.isInputHidden = true;
	    } else {
	      if (self.settings.hidePlaceholder && self.items.length > 0) {
	        setAttr(self.control_input, {
	          placeholder: ''
	        });
	      }

	      self.isInputHidden = false;
	    }

	    self.wrapper.classList.toggle('input-hidden', self.isInputHidden);
	  }
	  /**
	   * Hides the input element out of view, while
	   * retaining its focus.
	   * @deprecated 1.3
	   */


	  hideInput() {
	    this.inputState();
	  }
	  /**
	   * Restores input visibility.
	   * @deprecated 1.3
	   */


	  showInput() {
	    this.inputState();
	  }
	  /**
	   * Get the input value
	   */


	  inputValue() {
	    return this.control_input.value.trim();
	  }
	  /**
	   * Gives the control focus.
	   */


	  focus() {
	    var self = this;
	    if (self.isDisabled) return;
	    self.ignoreFocus = true;

	    if (self.control_input.offsetWidth) {
	      self.control_input.focus();
	    } else {
	      self.focus_node.focus();
	    }

	    setTimeout(() => {
	      self.ignoreFocus = false;
	      self.onFocus();
	    }, 0);
	  }
	  /**
	   * Forces the control out of focus.
	   *
	   */


	  blur() {
	    this.focus_node.blur();
	    this.onBlur();
	  }
	  /**
	   * Returns a function that scores an object
	   * to show how good of a match it is to the
	   * provided query.
	   *
	   * @return {function}
	   */


	  getScoreFunction(query) {
	    return this.sifter.getScoreFunction(query, this.getSearchOptions());
	  }
	  /**
	   * Returns search options for sifter (the system
	   * for scoring and sorting results).
	   *
	   * @see https://github.com/orchidjs/sifter.js
	   * @return {object}
	   */


	  getSearchOptions() {
	    var settings = this.settings;
	    var sort = settings.sortField;

	    if (typeof settings.sortField === 'string') {
	      sort = [{
	        field: settings.sortField
	      }];
	    }

	    return {
	      fields: settings.searchField,
	      conjunction: settings.searchConjunction,
	      sort: sort,
	      nesting: settings.nesting
	    };
	  }
	  /**
	   * Searches through available options and returns
	   * a sorted array of matches.
	   *
	   */


	  search(query) {
	    var result, calculateScore;
	    var self = this;
	    var options = this.getSearchOptions(); // validate user-provided result scoring function

	    if (self.settings.score) {
	      calculateScore = self.settings.score.call(self, query);

	      if (typeof calculateScore !== 'function') {
	        throw new Error('Tom Select "score" setting must be a function that returns a function');
	      }
	    } // perform search


	    if (query !== self.lastQuery) {
	      self.lastQuery = query;
	      result = self.sifter.search(query, Object.assign(options, {
	        score: calculateScore
	      }));
	      self.currentResults = result;
	    } else {
	      result = Object.assign({}, self.currentResults);
	    } // filter out selected items


	    if (self.settings.hideSelected) {
	      result.items = result.items.filter(item => {
	        let hashed = hash_key(item.id);
	        return !(hashed && self.items.indexOf(hashed) !== -1);
	      });
	    }

	    return result;
	  }
	  /**
	   * Refreshes the list of available options shown
	   * in the autocomplete dropdown menu.
	   *
	   */


	  refreshOptions(triggerDropdown = true) {
	    var i, j, k, n, optgroup, optgroups, html, has_create_option, active_group;
	    var create;
	    const groups = {};
	    const groups_order = [];
	    var self = this;
	    var query = self.inputValue();
	    const same_query = query === self.lastQuery || query == '' && self.lastQuery == null;
	    var results = self.search(query);
	    var active_option = null;
	    var show_dropdown = self.settings.shouldOpen || false;
	    var dropdown_content = self.dropdown_content;

	    if (same_query) {
	      active_option = self.activeOption;

	      if (active_option) {
	        active_group = active_option.closest('[data-group]');
	      }
	    } // build markup


	    n = results.items.length;

	    if (typeof self.settings.maxOptions === 'number') {
	      n = Math.min(n, self.settings.maxOptions);
	    }

	    if (n > 0) {
	      show_dropdown = true;
	    } // render and group available options individually


	    for (i = 0; i < n; i++) {
	      // get option dom element
	      let item = results.items[i];
	      if (!item) continue;
	      let opt_value = item.id;
	      let option = self.options[opt_value];
	      if (option === undefined) continue;
	      let opt_hash = get_hash(opt_value);
	      let option_el = self.getOption(opt_hash, true); // toggle 'selected' class

	      if (!self.settings.hideSelected) {
	        option_el.classList.toggle('selected', self.items.includes(opt_hash));
	      }

	      optgroup = option[self.settings.optgroupField] || '';
	      optgroups = Array.isArray(optgroup) ? optgroup : [optgroup];

	      for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
	        optgroup = optgroups[j];

	        if (!self.optgroups.hasOwnProperty(optgroup)) {
	          optgroup = '';
	        }

	        let group_fragment = groups[optgroup];

	        if (group_fragment === undefined) {
	          group_fragment = document.createDocumentFragment();
	          groups_order.push(optgroup);
	        } // nodes can only have one parent, so if the option is in mutple groups, we need a clone


	        if (j > 0) {
	          option_el = option_el.cloneNode(true);
	          setAttr(option_el, {
	            id: option.$id + '-clone-' + j,
	            'aria-selected': null
	          });
	          option_el.classList.add('ts-cloned');
	          removeClasses(option_el, 'active'); // make sure we keep the activeOption in the same group

	          if (self.activeOption && self.activeOption.dataset.value == opt_value) {
	            if (active_group && active_group.dataset.group === optgroup.toString()) {
	              active_option = option_el;
	            }
	          }
	        }

	        group_fragment.appendChild(option_el);
	        groups[optgroup] = group_fragment;
	      }
	    } // sort optgroups


	    if (self.settings.lockOptgroupOrder) {
	      groups_order.sort((a, b) => {
	        const grp_a = self.optgroups[a];
	        const grp_b = self.optgroups[b];
	        const a_order = grp_a && grp_a.$order || 0;
	        const b_order = grp_b && grp_b.$order || 0;
	        return a_order - b_order;
	      });
	    } // render optgroup headers & join groups


	    html = document.createDocumentFragment();
	    iterate$1(groups_order, optgroup => {
	      let group_fragment = groups[optgroup];
	      if (!group_fragment || !group_fragment.children.length) return;
	      let group_heading = self.optgroups[optgroup];

	      if (group_heading !== undefined) {
	        let group_options = document.createDocumentFragment();
	        let header = self.render('optgroup_header', group_heading);
	        append(group_options, header);
	        append(group_options, group_fragment);
	        let group_html = self.render('optgroup', {
	          group: group_heading,
	          options: group_options
	        });
	        append(html, group_html);
	      } else {
	        append(html, group_fragment);
	      }
	    });
	    dropdown_content.innerHTML = '';
	    append(dropdown_content, html); // highlight matching terms inline

	    if (self.settings.highlight) {
	      removeHighlight(dropdown_content);

	      if (results.query.length && results.tokens.length) {
	        iterate$1(results.tokens, tok => {
	          highlight(dropdown_content, tok.regex);
	        });
	      }
	    } // helper method for adding templates to dropdown


	    var add_template = template => {
	      let content = self.render(template, {
	        input: query
	      });

	      if (content) {
	        show_dropdown = true;
	        dropdown_content.insertBefore(content, dropdown_content.firstChild);
	      }

	      return content;
	    }; // add loading message


	    if (self.loading) {
	      add_template('loading'); // invalid query
	    } else if (!self.settings.shouldLoad.call(self, query)) {
	      add_template('not_loading'); // add no_results message
	    } else if (results.items.length === 0) {
	      add_template('no_results');
	    } // add create option


	    has_create_option = self.canCreate(query);

	    if (has_create_option) {
	      create = add_template('option_create');
	    } // activate


	    self.hasOptions = results.items.length > 0 || has_create_option;

	    if (show_dropdown) {
	      if (results.items.length > 0) {
	        if (!active_option && self.settings.mode === 'single' && self.items[0] != undefined) {
	          active_option = self.getOption(self.items[0]);
	        }

	        if (!dropdown_content.contains(active_option)) {
	          let active_index = 0;

	          if (create && !self.settings.addPrecedence) {
	            active_index = 1;
	          }

	          active_option = self.selectable()[active_index];
	        }
	      } else if (create) {
	        active_option = create;
	      }

	      if (triggerDropdown && !self.isOpen) {
	        self.open();
	        self.scrollToOption(active_option, 'auto');
	      }

	      self.setActiveOption(active_option);
	    } else {
	      self.clearActiveOption();

	      if (triggerDropdown && self.isOpen) {
	        self.close(false); // if create_option=null, we want the dropdown to close but not reset the textbox value
	      }
	    }
	  }
	  /**
	   * Return list of selectable options
	   *
	   */


	  selectable() {
	    return this.dropdown_content.querySelectorAll('[data-selectable]');
	  }
	  /**
	   * Adds an available option. If it already exists,
	   * nothing will happen. Note: this does not refresh
	   * the options list dropdown (use `refreshOptions`
	   * for that).
	   *
	   * Usage:
	   *
	   *   this.addOption(data)
	   *
	   */


	  addOption(data, user_created = false) {
	    const self = this; // @deprecated 1.7.7
	    // use addOptions( array, user_created ) for adding multiple options

	    if (Array.isArray(data)) {
	      self.addOptions(data, user_created);
	      return false;
	    }

	    const key = hash_key(data[self.settings.valueField]);

	    if (key === null || self.options.hasOwnProperty(key)) {
	      return false;
	    }

	    data.$order = data.$order || ++self.order;
	    data.$id = self.inputId + '-opt-' + data.$order;
	    self.options[key] = data;
	    self.lastQuery = null;

	    if (user_created) {
	      self.userOptions[key] = user_created;
	      self.trigger('option_add', key, data);
	    }

	    return key;
	  }
	  /**
	   * Add multiple options
	   *
	   */


	  addOptions(data, user_created = false) {
	    iterate$1(data, dat => {
	      this.addOption(dat, user_created);
	    });
	  }
	  /**
	   * @deprecated 1.7.7
	   */


	  registerOption(data) {
	    return this.addOption(data);
	  }
	  /**
	   * Registers an option group to the pool of option groups.
	   *
	   * @return {boolean|string}
	   */


	  registerOptionGroup(data) {
	    var key = hash_key(data[this.settings.optgroupValueField]);
	    if (key === null) return false;
	    data.$order = data.$order || ++this.order;
	    this.optgroups[key] = data;
	    return key;
	  }
	  /**
	   * Registers a new optgroup for options
	   * to be bucketed into.
	   *
	   */


	  addOptionGroup(id, data) {
	    var hashed_id;
	    data[this.settings.optgroupValueField] = id;

	    if (hashed_id = this.registerOptionGroup(data)) {
	      this.trigger('optgroup_add', hashed_id, data);
	    }
	  }
	  /**
	   * Removes an existing option group.
	   *
	   */


	  removeOptionGroup(id) {
	    if (this.optgroups.hasOwnProperty(id)) {
	      delete this.optgroups[id];
	      this.clearCache();
	      this.trigger('optgroup_remove', id);
	    }
	  }
	  /**
	   * Clears all existing option groups.
	   */


	  clearOptionGroups() {
	    this.optgroups = {};
	    this.clearCache();
	    this.trigger('optgroup_clear');
	  }
	  /**
	   * Updates an option available for selection. If
	   * it is visible in the selected items or options
	   * dropdown, it will be re-rendered automatically.
	   *
	   */


	  updateOption(value, data) {
	    const self = this;
	    var item_new;
	    var index_item;
	    const value_old = hash_key(value);
	    const value_new = hash_key(data[self.settings.valueField]); // sanity checks

	    if (value_old === null) return;
	    const data_old = self.options[value_old];
	    if (data_old == undefined) return;
	    if (typeof value_new !== 'string') throw new Error('Value must be set in option data');
	    const option = self.getOption(value_old);
	    const item = self.getItem(value_old);
	    data.$order = data.$order || data_old.$order;
	    delete self.options[value_old]; // invalidate render cache
	    // don't remove existing node yet, we'll remove it after replacing it

	    self.uncacheValue(value_new);
	    self.options[value_new] = data; // update the option if it's in the dropdown

	    if (option) {
	      if (self.dropdown_content.contains(option)) {
	        const option_new = self._render('option', data);

	        replaceNode(option, option_new);

	        if (self.activeOption === option) {
	          self.setActiveOption(option_new);
	        }
	      }

	      option.remove();
	    } // update the item if we have one


	    if (item) {
	      index_item = self.items.indexOf(value_old);

	      if (index_item !== -1) {
	        self.items.splice(index_item, 1, value_new);
	      }

	      item_new = self._render('item', data);
	      if (item.classList.contains('active')) addClasses(item_new, 'active');
	      replaceNode(item, item_new);
	    } // invalidate last query because we might have updated the sortField


	    self.lastQuery = null;
	  }
	  /**
	   * Removes a single option.
	   *
	   */


	  removeOption(value, silent) {
	    const self = this;
	    value = get_hash(value);
	    self.uncacheValue(value);
	    delete self.userOptions[value];
	    delete self.options[value];
	    self.lastQuery = null;
	    self.trigger('option_remove', value);
	    self.removeItem(value, silent);
	  }
	  /**
	   * Clears all options.
	   */


	  clearOptions(filter) {
	    const boundFilter = (filter || this.clearFilter).bind(this);
	    this.loadedSearches = {};
	    this.userOptions = {};
	    this.clearCache();
	    const selected = {};
	    iterate$1(this.options, (option, key) => {
	      if (boundFilter(option, key)) {
	        selected[key] = option;
	      }
	    });
	    this.options = this.sifter.items = selected;
	    this.lastQuery = null;
	    this.trigger('option_clear');
	  }
	  /**
	   * Used by clearOptions() to decide whether or not an option should be removed
	   * Return true to keep an option, false to remove
	   *
	   */


	  clearFilter(option, value) {
	    if (this.items.indexOf(value) >= 0) {
	      return true;
	    }

	    return false;
	  }
	  /**
	   * Returns the dom element of the option
	   * matching the given value.
	   *
	   */


	  getOption(value, create = false) {
	    const hashed = hash_key(value);
	    if (hashed === null) return null;
	    const option = this.options[hashed];

	    if (option != undefined) {
	      if (option.$div) {
	        return option.$div;
	      }

	      if (create) {
	        return this._render('option', option);
	      }
	    }

	    return null;
	  }
	  /**
	   * Returns the dom element of the next or previous dom element of the same type
	   * Note: adjacent options may not be adjacent DOM elements (optgroups)
	   *
	   */


	  getAdjacent(option, direction, type = 'option') {
	    var self = this,
	        all;

	    if (!option) {
	      return null;
	    }

	    if (type == 'item') {
	      all = self.controlChildren();
	    } else {
	      all = self.dropdown_content.querySelectorAll('[data-selectable]');
	    }

	    for (let i = 0; i < all.length; i++) {
	      if (all[i] != option) {
	        continue;
	      }

	      if (direction > 0) {
	        return all[i + 1];
	      }

	      return all[i - 1];
	    }

	    return null;
	  }
	  /**
	   * Returns the dom element of the item
	   * matching the given value.
	   *
	   */


	  getItem(item) {
	    if (typeof item == 'object') {
	      return item;
	    }

	    var value = hash_key(item);
	    return value !== null ? this.control.querySelector(`[data-value="${addSlashes(value)}"]`) : null;
	  }
	  /**
	   * "Selects" multiple items at once. Adds them to the list
	   * at the current caret position.
	   *
	   */


	  addItems(values, silent) {
	    var self = this;
	    var items = Array.isArray(values) ? values : [values];
	    items = items.filter(x => self.items.indexOf(x) === -1);
	    const last_item = items[items.length - 1];
	    items.forEach(item => {
	      self.isPending = item !== last_item;
	      self.addItem(item, silent);
	    });
	  }
	  /**
	   * "Selects" an item. Adds it to the list
	   * at the current caret position.
	   *
	   */


	  addItem(value, silent) {
	    var events = silent ? [] : ['change', 'dropdown_close'];
	    debounce_events(this, events, () => {
	      var item, wasFull;
	      const self = this;
	      const inputMode = self.settings.mode;
	      const hashed = hash_key(value);

	      if (hashed && self.items.indexOf(hashed) !== -1) {
	        if (inputMode === 'single') {
	          self.close();
	        }

	        if (inputMode === 'single' || !self.settings.duplicates) {
	          return;
	        }
	      }

	      if (hashed === null || !self.options.hasOwnProperty(hashed)) return;
	      if (inputMode === 'single') self.clear(silent);
	      if (inputMode === 'multi' && self.isFull()) return;
	      item = self._render('item', self.options[hashed]);

	      if (self.control.contains(item)) {
	        // duplicates
	        item = item.cloneNode(true);
	      }

	      wasFull = self.isFull();
	      self.items.splice(self.caretPos, 0, hashed);
	      self.insertAtCaret(item);

	      if (self.isSetup) {
	        // update menu / remove the option (if this is not one item being added as part of series)
	        if (!self.isPending && self.settings.hideSelected) {
	          let option = self.getOption(hashed);
	          let next = self.getAdjacent(option, 1);

	          if (next) {
	            self.setActiveOption(next);
	          }
	        } // refreshOptions after setActiveOption(),
	        // otherwise setActiveOption() will be called by refreshOptions() with the wrong value


	        if (!self.isPending && !self.settings.closeAfterSelect) {
	          self.refreshOptions(self.isFocused && inputMode !== 'single');
	        } // hide the menu if the maximum number of items have been selected or no options are left


	        if (self.settings.closeAfterSelect != false && self.isFull()) {
	          self.close();
	        } else if (!self.isPending) {
	          self.positionDropdown();
	        }

	        self.trigger('item_add', hashed, item);

	        if (!self.isPending) {
	          self.updateOriginalInput({
	            silent: silent
	          });
	        }
	      }

	      if (!self.isPending || !wasFull && self.isFull()) {
	        self.inputState();
	        self.refreshState();
	      }
	    });
	  }
	  /**
	   * Removes the selected item matching
	   * the provided value.
	   *
	   */


	  removeItem(item = null, silent) {
	    const self = this;
	    item = self.getItem(item);
	    if (!item) return;
	    var i, idx;
	    const value = item.dataset.value;
	    i = nodeIndex(item);
	    item.remove();

	    if (item.classList.contains('active')) {
	      idx = self.activeItems.indexOf(item);
	      self.activeItems.splice(idx, 1);
	      removeClasses(item, 'active');
	    }

	    self.items.splice(i, 1);
	    self.lastQuery = null;

	    if (!self.settings.persist && self.userOptions.hasOwnProperty(value)) {
	      self.removeOption(value, silent);
	    }

	    if (i < self.caretPos) {
	      self.setCaret(self.caretPos - 1);
	    }

	    self.updateOriginalInput({
	      silent: silent
	    });
	    self.refreshState();
	    self.positionDropdown();
	    self.trigger('item_remove', value, item);
	  }
	  /**
	   * Invokes the `create` method provided in the
	   * TomSelect options that should provide the data
	   * for the new item, given the user input.
	   *
	   * Once this completes, it will be added
	   * to the item list.
	   *
	   */


	  createItem(input = null, callback = () => {}) {
	    // triggerDropdown parameter @deprecated 2.1.1
	    if (arguments.length === 3) {
	      callback = arguments[2];
	    }

	    if (typeof callback != 'function') {
	      callback = () => {};
	    }

	    var self = this;
	    var caret = self.caretPos;
	    var output;
	    input = input || self.inputValue();

	    if (!self.canCreate(input)) {
	      callback();
	      return false;
	    }

	    self.lock();
	    var created = false;

	    var create = data => {
	      self.unlock();
	      if (!data || typeof data !== 'object') return callback();
	      var value = hash_key(data[self.settings.valueField]);

	      if (typeof value !== 'string') {
	        return callback();
	      }

	      self.setTextboxValue();
	      self.addOption(data, true);
	      self.setCaret(caret);
	      self.addItem(value);
	      callback(data);
	      created = true;
	    };

	    if (typeof self.settings.create === 'function') {
	      output = self.settings.create.call(this, input, create);
	    } else {
	      output = {
	        [self.settings.labelField]: input,
	        [self.settings.valueField]: input
	      };
	    }

	    if (!created) {
	      create(output);
	    }

	    return true;
	  }
	  /**
	   * Re-renders the selected item lists.
	   */


	  refreshItems() {
	    var self = this;
	    self.lastQuery = null;

	    if (self.isSetup) {
	      self.addItems(self.items);
	    }

	    self.updateOriginalInput();
	    self.refreshState();
	  }
	  /**
	   * Updates all state-dependent attributes
	   * and CSS classes.
	   */


	  refreshState() {
	    const self = this;
	    self.refreshValidityState();
	    const isFull = self.isFull();
	    const isLocked = self.isLocked;
	    self.wrapper.classList.toggle('rtl', self.rtl);
	    const wrap_classList = self.wrapper.classList;
	    wrap_classList.toggle('focus', self.isFocused);
	    wrap_classList.toggle('disabled', self.isDisabled);
	    wrap_classList.toggle('required', self.isRequired);
	    wrap_classList.toggle('invalid', !self.isValid);
	    wrap_classList.toggle('locked', isLocked);
	    wrap_classList.toggle('full', isFull);
	    wrap_classList.toggle('input-active', self.isFocused && !self.isInputHidden);
	    wrap_classList.toggle('dropdown-active', self.isOpen);
	    wrap_classList.toggle('has-options', isEmptyObject(self.options));
	    wrap_classList.toggle('has-items', self.items.length > 0);
	  }
	  /**
	   * Update the `required` attribute of both input and control input.
	   *
	   * The `required` property needs to be activated on the control input
	   * for the error to be displayed at the right place. `required` also
	   * needs to be temporarily deactivated on the input since the input is
	   * hidden and can't show errors.
	   */


	  refreshValidityState() {
	    var self = this;

	    if (!self.input.validity) {
	      return;
	    }

	    self.isValid = self.input.validity.valid;
	    self.isInvalid = !self.isValid;
	  }
	  /**
	   * Determines whether or not more items can be added
	   * to the control without exceeding the user-defined maximum.
	   *
	   * @returns {boolean}
	   */


	  isFull() {
	    return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
	  }
	  /**
	   * Refreshes the original <select> or <input>
	   * element to reflect the current state.
	   *
	   */


	  updateOriginalInput(opts = {}) {
	    const self = this;
	    var option, label;
	    const empty_option = self.input.querySelector('option[value=""]');

	    if (self.is_select_tag) {
	      const selected = [];
	      const has_selected = self.input.querySelectorAll('option:checked').length;

	      function AddSelected(option_el, value, label) {
	        if (!option_el) {
	          option_el = getDom('<option value="' + escape_html(value) + '">' + escape_html(label) + '</option>');
	        } // don't move empty option from top of list
	        // fixes bug in firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1725293


	        if (option_el != empty_option) {
	          self.input.append(option_el);
	        }

	        selected.push(option_el); // marking empty option as selected can break validation
	        // fixes https://github.com/orchidjs/tom-select/issues/303

	        if (option_el != empty_option || has_selected > 0) {
	          option_el.selected = true;
	        }

	        return option_el;
	      } // unselect all selected options


	      self.input.querySelectorAll('option:checked').forEach(option_el => {
	        option_el.selected = false;
	      }); // nothing selected?

	      if (self.items.length == 0 && self.settings.mode == 'single') {
	        AddSelected(empty_option, "", ""); // order selected <option> tags for values in self.items
	      } else {
	        self.items.forEach(value => {
	          option = self.options[value];
	          label = option[self.settings.labelField] || '';

	          if (selected.includes(option.$option)) {
	            const reuse_opt = self.input.querySelector(`option[value="${addSlashes(value)}"]:not(:checked)`);
	            AddSelected(reuse_opt, value, label);
	          } else {
	            option.$option = AddSelected(option.$option, value, label);
	          }
	        });
	      }
	    } else {
	      self.input.value = self.getValue();
	    }

	    if (self.isSetup) {
	      if (!opts.silent) {
	        self.trigger('change', self.getValue());
	      }
	    }
	  }
	  /**
	   * Shows the autocomplete dropdown containing
	   * the available options.
	   */


	  open() {
	    var self = this;
	    if (self.isLocked || self.isOpen || self.settings.mode === 'multi' && self.isFull()) return;
	    self.isOpen = true;
	    setAttr(self.focus_node, {
	      'aria-expanded': 'true'
	    });
	    self.refreshState();
	    applyCSS(self.dropdown, {
	      visibility: 'hidden',
	      display: 'block'
	    });
	    self.positionDropdown();
	    applyCSS(self.dropdown, {
	      visibility: 'visible',
	      display: 'block'
	    });
	    self.focus();
	    self.trigger('dropdown_open', self.dropdown);
	  }
	  /**
	   * Closes the autocomplete dropdown menu.
	   */


	  close(setTextboxValue = true) {
	    var self = this;
	    var trigger = self.isOpen;

	    if (setTextboxValue) {
	      // before blur() to prevent form onchange event
	      self.setTextboxValue();

	      if (self.settings.mode === 'single' && self.items.length) {
	        self.hideInput();
	      }
	    }

	    self.isOpen = false;
	    setAttr(self.focus_node, {
	      'aria-expanded': 'false'
	    });
	    applyCSS(self.dropdown, {
	      display: 'none'
	    });

	    if (self.settings.hideSelected) {
	      self.clearActiveOption();
	    }

	    self.refreshState();
	    if (trigger) self.trigger('dropdown_close', self.dropdown);
	  }
	  /**
	   * Calculates and applies the appropriate
	   * position of the dropdown if dropdownParent = 'body'.
	   * Otherwise, position is determined by css
	   */


	  positionDropdown() {
	    if (this.settings.dropdownParent !== 'body') {
	      return;
	    }

	    var context = this.control;
	    var rect = context.getBoundingClientRect();
	    var top = context.offsetHeight + rect.top + window.scrollY;
	    var left = rect.left + window.scrollX;
	    applyCSS(this.dropdown, {
	      width: rect.width + 'px',
	      top: top + 'px',
	      left: left + 'px'
	    });
	  }
	  /**
	   * Resets / clears all selected items
	   * from the control.
	   *
	   */


	  clear(silent) {
	    var self = this;
	    if (!self.items.length) return;
	    var items = self.controlChildren();
	    iterate$1(items, item => {
	      self.removeItem(item, true);
	    });
	    self.showInput();
	    if (!silent) self.updateOriginalInput();
	    self.trigger('clear');
	  }
	  /**
	   * A helper method for inserting an element
	   * at the current caret position.
	   *
	   */


	  insertAtCaret(el) {
	    const self = this;
	    const caret = self.caretPos;
	    const target = self.control;
	    target.insertBefore(el, target.children[caret] || null);
	    self.setCaret(caret + 1);
	  }
	  /**
	   * Removes the current selected item(s).
	   *
	   */


	  deleteSelection(e) {
	    var direction, selection, caret, tail;
	    var self = this;
	    direction = e && e.keyCode === KEY_BACKSPACE ? -1 : 1;
	    selection = getSelection(self.control_input); // determine items that will be removed

	    const rm_items = [];

	    if (self.activeItems.length) {
	      tail = getTail(self.activeItems, direction);
	      caret = nodeIndex(tail);

	      if (direction > 0) {
	        caret++;
	      }

	      iterate$1(self.activeItems, item => rm_items.push(item));
	    } else if ((self.isFocused || self.settings.mode === 'single') && self.items.length) {
	      const items = self.controlChildren();
	      let rm_item;

	      if (direction < 0 && selection.start === 0 && selection.length === 0) {
	        rm_item = items[self.caretPos - 1];
	      } else if (direction > 0 && selection.start === self.inputValue().length) {
	        rm_item = items[self.caretPos];
	      }

	      if (rm_item !== undefined) {
	        rm_items.push(rm_item);
	      }
	    }

	    if (!self.shouldDelete(rm_items, e)) {
	      return false;
	    }

	    preventDefault(e, true); // perform removal

	    if (typeof caret !== 'undefined') {
	      self.setCaret(caret);
	    }

	    while (rm_items.length) {
	      self.removeItem(rm_items.pop());
	    }

	    self.showInput();
	    self.positionDropdown();
	    self.refreshOptions(false);
	    return true;
	  }
	  /**
	   * Return true if the items should be deleted
	   */


	  shouldDelete(items, evt) {
	    const values = items.map(item => item.dataset.value); // allow the callback to abort

	    if (!values.length || typeof this.settings.onDelete === 'function' && this.settings.onDelete(values, evt) === false) {
	      return false;
	    }

	    return true;
	  }
	  /**
	   * Selects the previous / next item (depending on the `direction` argument).
	   *
	   * > 0 - right
	   * < 0 - left
	   *
	   */


	  advanceSelection(direction, e) {
	    var last_active,
	        adjacent,
	        self = this;
	    if (self.rtl) direction *= -1;
	    if (self.inputValue().length) return; // add or remove to active items

	    if (isKeyDown(KEY_SHORTCUT, e) || isKeyDown('shiftKey', e)) {
	      last_active = self.getLastActive(direction);

	      if (last_active) {
	        if (!last_active.classList.contains('active')) {
	          adjacent = last_active;
	        } else {
	          adjacent = self.getAdjacent(last_active, direction, 'item');
	        } // if no active item, get items adjacent to the control input

	      } else if (direction > 0) {
	        adjacent = self.control_input.nextElementSibling;
	      } else {
	        adjacent = self.control_input.previousElementSibling;
	      }

	      if (adjacent) {
	        if (adjacent.classList.contains('active')) {
	          self.removeActiveItem(last_active);
	        }

	        self.setActiveItemClass(adjacent); // mark as last_active !! after removeActiveItem() on last_active
	      } // move caret to the left or right

	    } else {
	      self.moveCaret(direction);
	    }
	  }

	  moveCaret(direction) {}
	  /**
	   * Get the last active item
	   *
	   */


	  getLastActive(direction) {
	    let last_active = this.control.querySelector('.last-active');

	    if (last_active) {
	      return last_active;
	    }

	    var result = this.control.querySelectorAll('.active');

	    if (result) {
	      return getTail(result, direction);
	    }
	  }
	  /**
	   * Moves the caret to the specified index.
	   *
	   * The input must be moved by leaving it in place and moving the
	   * siblings, due to the fact that focus cannot be restored once lost
	   * on mobile webkit devices
	   *
	   */


	  setCaret(new_pos) {
	    this.caretPos = this.items.length;
	  }
	  /**
	   * Return list of item dom elements
	   *
	   */


	  controlChildren() {
	    return Array.from(this.control.querySelectorAll('[data-ts-item]'));
	  }
	  /**
	   * Disables user input on the control. Used while
	   * items are being asynchronously created.
	   */


	  lock() {
	    this.isLocked = true;
	    this.refreshState();
	  }
	  /**
	   * Re-enables user input on the control.
	   */


	  unlock() {
	    this.isLocked = false;
	    this.refreshState();
	  }
	  /**
	   * Disables user input on the control completely.
	   * While disabled, it cannot receive focus.
	   */


	  disable() {
	    var self = this;
	    self.input.disabled = true;
	    self.control_input.disabled = true;
	    self.focus_node.tabIndex = -1;
	    self.isDisabled = true;
	    this.close();
	    self.lock();
	  }
	  /**
	   * Enables the control so that it can respond
	   * to focus and user input.
	   */


	  enable() {
	    var self = this;
	    self.input.disabled = false;
	    self.control_input.disabled = false;
	    self.focus_node.tabIndex = self.tabIndex;
	    self.isDisabled = false;
	    self.unlock();
	  }
	  /**
	   * Completely destroys the control and
	   * unbinds all event listeners so that it can
	   * be garbage collected.
	   */


	  destroy() {
	    var self = this;
	    var revertSettings = self.revertSettings;
	    self.trigger('destroy');
	    self.off();
	    self.wrapper.remove();
	    self.dropdown.remove();
	    self.input.innerHTML = revertSettings.innerHTML;
	    self.input.tabIndex = revertSettings.tabIndex;
	    removeClasses(self.input, 'tomselected', 'ts-hidden-accessible');

	    self._destroy();

	    delete self.input.tomselect;
	  }
	  /**
	   * A helper method for rendering "item" and
	   * "option" templates, given the data.
	   *
	   */


	  render(templateName, data) {
	    var id, html;
	    const self = this;

	    if (typeof this.settings.render[templateName] !== 'function') {
	      return null;
	    } // render markup


	    html = self.settings.render[templateName].call(this, data, escape_html);

	    if (!html) {
	      return null;
	    }

	    html = getDom(html); // add mandatory attributes

	    if (templateName === 'option' || templateName === 'option_create') {
	      if (data[self.settings.disabledField]) {
	        setAttr(html, {
	          'aria-disabled': 'true'
	        });
	      } else {
	        setAttr(html, {
	          'data-selectable': ''
	        });
	      }
	    } else if (templateName === 'optgroup') {
	      id = data.group[self.settings.optgroupValueField];
	      setAttr(html, {
	        'data-group': id
	      });

	      if (data.group[self.settings.disabledField]) {
	        setAttr(html, {
	          'data-disabled': ''
	        });
	      }
	    }

	    if (templateName === 'option' || templateName === 'item') {
	      const value = get_hash(data[self.settings.valueField]);
	      setAttr(html, {
	        'data-value': value
	      }); // make sure we have some classes if a template is overwritten

	      if (templateName === 'item') {
	        addClasses(html, self.settings.itemClass);
	        setAttr(html, {
	          'data-ts-item': ''
	        });
	      } else {
	        addClasses(html, self.settings.optionClass);
	        setAttr(html, {
	          role: 'option',
	          id: data.$id
	        }); // update cache

	        data.$div = html;
	        self.options[value] = data;
	      }
	    }

	    return html;
	  }
	  /**
	   * Type guarded rendering
	   *
	   */


	  _render(templateName, data) {
	    const html = this.render(templateName, data);

	    if (html == null) {
	      throw 'HTMLElement expected';
	    }

	    return html;
	  }
	  /**
	   * Clears the render cache for a template. If
	   * no template is given, clears all render
	   * caches.
	   *
	   */


	  clearCache() {
	    iterate$1(this.options, option => {
	      if (option.$div) {
	        option.$div.remove();
	        delete option.$div;
	      }
	    });
	  }
	  /**
	   * Removes a value from item and option caches
	   *
	   */


	  uncacheValue(value) {
	    const option_el = this.getOption(value);
	    if (option_el) option_el.remove();
	  }
	  /**
	   * Determines whether or not to display the
	   * create item prompt, given a user input.
	   *
	   */


	  canCreate(input) {
	    return this.settings.create && input.length > 0 && this.settings.createFilter.call(this, input);
	  }
	  /**
	   * Wraps this.`method` so that `new_fn` can be invoked 'before', 'after', or 'instead' of the original method
	   *
	   * this.hook('instead','onKeyDown',function( arg1, arg2 ...){
	   *
	   * });
	   */


	  hook(when, method, new_fn) {
	    var self = this;
	    var orig_method = self[method];

	    self[method] = function () {
	      var result, result_new;

	      if (when === 'after') {
	        result = orig_method.apply(self, arguments);
	      }

	      result_new = new_fn.apply(self, arguments);

	      if (when === 'instead') {
	        return result_new;
	      }

	      if (when === 'before') {
	        result = orig_method.apply(self, arguments);
	      }

	      return result;
	    };
	  }

	}

	/**
	 * Plugin: "change_listener" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function change_listener () {
	  addEvent(this.input, 'change', () => {
	    this.sync();
	  });
	}

	/**
	 * Plugin: "restore_on_backspace" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function checkbox_options () {
	  var self = this;
	  var orig_onOptionSelect = self.onOptionSelect;
	  self.settings.hideSelected = false; // update the checkbox for an option

	  var UpdateCheckbox = function UpdateCheckbox(option) {
	    setTimeout(() => {
	      var checkbox = option.querySelector('input');

	      if (checkbox instanceof HTMLInputElement) {
	        if (option.classList.contains('selected')) {
	          checkbox.checked = true;
	        } else {
	          checkbox.checked = false;
	        }
	      }
	    }, 1);
	  }; // add checkbox to option template


	  self.hook('after', 'setupTemplates', () => {
	    var orig_render_option = self.settings.render.option;

	    self.settings.render.option = (data, escape_html) => {
	      var rendered = getDom(orig_render_option.call(self, data, escape_html));
	      var checkbox = document.createElement('input');
	      checkbox.addEventListener('click', function (evt) {
	        preventDefault(evt);
	      });
	      checkbox.type = 'checkbox';
	      const hashed = hash_key(data[self.settings.valueField]);

	      if (hashed && self.items.indexOf(hashed) > -1) {
	        checkbox.checked = true;
	      }

	      rendered.prepend(checkbox);
	      return rendered;
	    };
	  }); // uncheck when item removed

	  self.on('item_remove', value => {
	    var option = self.getOption(value);

	    if (option) {
	      // if dropdown hasn't been opened yet, the option won't exist
	      option.classList.remove('selected'); // selected class won't be removed yet

	      UpdateCheckbox(option);
	    }
	  }); // check when item added

	  self.on('item_add', value => {
	    var option = self.getOption(value);

	    if (option) {
	      // if dropdown hasn't been opened yet, the option won't exist
	      UpdateCheckbox(option);
	    }
	  }); // remove items when selected option is clicked

	  self.hook('instead', 'onOptionSelect', (evt, option) => {
	    if (option.classList.contains('selected')) {
	      option.classList.remove('selected');
	      self.removeItem(option.dataset.value);
	      self.refreshOptions();
	      preventDefault(evt, true);
	      return;
	    }

	    orig_onOptionSelect.call(self, evt, option);
	    UpdateCheckbox(option);
	  });
	}

	/**
	 * Plugin: "dropdown_header" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function clear_button (userOptions) {
	  const self = this;
	  const options = Object.assign({
	    className: 'clear-button',
	    title: 'Clear All',
	    html: data => {
	      return `<div class="${data.className}" title="${data.title}">&#10799;</div>`;
	    }
	  }, userOptions);
	  self.on('initialize', () => {
	    var button = getDom(options.html(options));
	    button.addEventListener('click', evt => {
	      if (self.isDisabled) {
	        return;
	      }

	      self.clear();

	      if (self.settings.mode === 'single' && self.settings.allowEmptyOption) {
	        self.addItem('');
	      }

	      evt.preventDefault();
	      evt.stopPropagation();
	    });
	    self.control.appendChild(button);
	  });
	}

	/**
	 * Plugin: "drag_drop" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function drag_drop () {
	  var self = this;
	  if (!$.fn.sortable) throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
	  if (self.settings.mode !== 'multi') return;
	  var orig_lock = self.lock;
	  var orig_unlock = self.unlock;
	  self.hook('instead', 'lock', () => {
	    var sortable = $(self.control).data('sortable');
	    if (sortable) sortable.disable();
	    return orig_lock.call(self);
	  });
	  self.hook('instead', 'unlock', () => {
	    var sortable = $(self.control).data('sortable');
	    if (sortable) sortable.enable();
	    return orig_unlock.call(self);
	  });
	  self.on('initialize', () => {
	    var $control = $(self.control).sortable({
	      items: '[data-value]',
	      forcePlaceholderSize: true,
	      disabled: self.isLocked,
	      start: (e, ui) => {
	        ui.placeholder.css('width', ui.helper.css('width'));
	        $control.css({
	          overflow: 'visible'
	        });
	      },
	      stop: () => {
	        $control.css({
	          overflow: 'hidden'
	        });
	        var values = [];
	        $control.children('[data-value]').each(function () {
	          if (this.dataset.value) values.push(this.dataset.value);
	        });
	        self.setValue(values);
	      }
	    });
	  });
	}

	/**
	 * Plugin: "dropdown_header" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function dropdown_header (userOptions) {
	  const self = this;
	  const options = Object.assign({
	    title: 'Untitled',
	    headerClass: 'dropdown-header',
	    titleRowClass: 'dropdown-header-title',
	    labelClass: 'dropdown-header-label',
	    closeClass: 'dropdown-header-close',
	    html: data => {
	      return '<div class="' + data.headerClass + '">' + '<div class="' + data.titleRowClass + '">' + '<span class="' + data.labelClass + '">' + data.title + '</span>' + '<a class="' + data.closeClass + '">&times;</a>' + '</div>' + '</div>';
	    }
	  }, userOptions);
	  self.on('initialize', () => {
	    var header = getDom(options.html(options));
	    var close_link = header.querySelector('.' + options.closeClass);

	    if (close_link) {
	      close_link.addEventListener('click', evt => {
	        preventDefault(evt, true);
	        self.close();
	      });
	    }

	    self.dropdown.insertBefore(header, self.dropdown.firstChild);
	  });
	}

	/**
	 * Plugin: "dropdown_input" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function caret_position () {
	  var self = this;
	  /**
	   * Moves the caret to the specified index.
	   *
	   * The input must be moved by leaving it in place and moving the
	   * siblings, due to the fact that focus cannot be restored once lost
	   * on mobile webkit devices
	   *
	   */

	  self.hook('instead', 'setCaret', new_pos => {
	    if (self.settings.mode === 'single' || !self.control.contains(self.control_input)) {
	      new_pos = self.items.length;
	    } else {
	      new_pos = Math.max(0, Math.min(self.items.length, new_pos));

	      if (new_pos != self.caretPos && !self.isPending) {
	        self.controlChildren().forEach((child, j) => {
	          if (j < new_pos) {
	            self.control_input.insertAdjacentElement('beforebegin', child);
	          } else {
	            self.control.appendChild(child);
	          }
	        });
	      }
	    }

	    self.caretPos = new_pos;
	  });
	  self.hook('instead', 'moveCaret', direction => {
	    if (!self.isFocused) return; // move caret before or after selected items

	    const last_active = self.getLastActive(direction);

	    if (last_active) {
	      const idx = nodeIndex(last_active);
	      self.setCaret(direction > 0 ? idx + 1 : idx);
	      self.setActiveItem();
	      removeClasses(last_active, 'last-active'); // move caret left or right of current position
	    } else {
	      self.setCaret(self.caretPos + direction);
	    }
	  });
	}

	/**
	 * Plugin: "dropdown_input" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function dropdown_input () {
	  const self = this;
	  self.settings.shouldOpen = true; // make sure the input is shown even if there are no options to display in the dropdown

	  self.hook('before', 'setup', () => {
	    self.focus_node = self.control;
	    addClasses(self.control_input, 'dropdown-input');
	    const div = getDom('<div class="dropdown-input-wrap">');
	    div.append(self.control_input);
	    self.dropdown.insertBefore(div, self.dropdown.firstChild); // set a placeholder in the select control

	    const placeholder = getDom('<input class="items-placeholder" tabindex="-1" />');
	    placeholder.placeholder = self.settings.placeholder || '';
	    self.control.append(placeholder);
	  });
	  self.on('initialize', () => {
	    // set tabIndex on control to -1, otherwise [shift+tab] will put focus right back on control_input
	    self.control_input.addEventListener('keydown', evt => {
	      //addEvent(self.control_input,'keydown' as const,(evt:KeyboardEvent) =>{
	      switch (evt.keyCode) {
	        case KEY_ESC:
	          if (self.isOpen) {
	            preventDefault(evt, true);
	            self.close();
	          }

	          self.clearActiveItems();
	          return;

	        case KEY_TAB:
	          self.focus_node.tabIndex = -1;
	          break;
	      }

	      return self.onKeyDown.call(self, evt);
	    });
	    self.on('blur', () => {
	      self.focus_node.tabIndex = self.isDisabled ? -1 : self.tabIndex;
	    }); // give the control_input focus when the dropdown is open

	    self.on('dropdown_open', () => {
	      self.control_input.focus();
	    }); // prevent onBlur from closing when focus is on the control_input

	    const orig_onBlur = self.onBlur;
	    self.hook('instead', 'onBlur', evt => {
	      if (evt && evt.relatedTarget == self.control_input) return;
	      return orig_onBlur.call(self);
	    });
	    addEvent(self.control_input, 'blur', () => self.onBlur()); // return focus to control to allow further keyboard input

	    self.hook('before', 'close', () => {
	      if (!self.isOpen) return;
	      self.focus_node.focus({
	        preventScroll: true
	      });
	    });
	  });
	}

	/**
	 * Plugin: "input_autogrow" (Tom Select)
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function input_autogrow () {
	  var self = this;
	  self.on('initialize', () => {
	    var test_input = document.createElement('span');
	    var control = self.control_input;
	    test_input.style.cssText = 'position:absolute; top:-99999px; left:-99999px; width:auto; padding:0; white-space:pre; ';
	    self.wrapper.appendChild(test_input);
	    var transfer_styles = ['letterSpacing', 'fontSize', 'fontFamily', 'fontWeight', 'textTransform'];

	    for (const style_name of transfer_styles) {
	      // @ts-ignore TS7015 https://stackoverflow.com/a/50506154/697576
	      test_input.style[style_name] = control.style[style_name];
	    }
	    /**
	     * Set the control width
	     *
	     */


	    var resize = () => {
	      test_input.textContent = control.value;
	      control.style.width = test_input.clientWidth + 'px';
	    };

	    resize();
	    self.on('update item_add item_remove', resize);
	    addEvent(control, 'input', resize);
	    addEvent(control, 'keyup', resize);
	    addEvent(control, 'blur', resize);
	    addEvent(control, 'update', resize);
	  });
	}

	/**
	 * Plugin: "input_autogrow" (Tom Select)
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function no_backspace_delete () {
	  var self = this;
	  var orig_deleteSelection = self.deleteSelection;
	  this.hook('instead', 'deleteSelection', evt => {
	    if (self.activeItems.length) {
	      return orig_deleteSelection.call(self, evt);
	    }

	    return false;
	  });
	}

	/**
	 * Plugin: "no_active_items" (Tom Select)
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function no_active_items () {
	  this.hook('instead', 'setActiveItem', () => {});
	  this.hook('instead', 'selectAll', () => {});
	}

	/**
	 * Plugin: "optgroup_columns" (Tom Select.js)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function optgroup_columns () {
	  var self = this;
	  var orig_keydown = self.onKeyDown;
	  self.hook('instead', 'onKeyDown', evt => {
	    var index, option, options, optgroup;

	    if (!self.isOpen || !(evt.keyCode === KEY_LEFT || evt.keyCode === KEY_RIGHT)) {
	      return orig_keydown.call(self, evt);
	    }

	    self.ignoreHover = true;
	    optgroup = parentMatch(self.activeOption, '[data-group]');
	    index = nodeIndex(self.activeOption, '[data-selectable]');

	    if (!optgroup) {
	      return;
	    }

	    if (evt.keyCode === KEY_LEFT) {
	      optgroup = optgroup.previousSibling;
	    } else {
	      optgroup = optgroup.nextSibling;
	    }

	    if (!optgroup) {
	      return;
	    }

	    options = optgroup.querySelectorAll('[data-selectable]');
	    option = options[Math.min(options.length - 1, index)];

	    if (option) {
	      self.setActiveOption(option);
	    }
	  });
	}

	/**
	 * Plugin: "remove_button" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function remove_button (userOptions) {
	  const options = Object.assign({
	    label: '&times;',
	    title: 'Remove',
	    className: 'remove',
	    append: true
	  }, userOptions); //options.className = 'remove-single';

	  var self = this; // override the render method to add remove button to each item

	  if (!options.append) {
	    return;
	  }

	  var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
	  self.hook('after', 'setupTemplates', () => {
	    var orig_render_item = self.settings.render.item;

	    self.settings.render.item = (data, escape) => {
	      var item = getDom(orig_render_item.call(self, data, escape));
	      var close_button = getDom(html);
	      item.appendChild(close_button);
	      addEvent(close_button, 'mousedown', evt => {
	        preventDefault(evt, true);
	      });
	      addEvent(close_button, 'click', evt => {
	        // propagating will trigger the dropdown to show for single mode
	        preventDefault(evt, true);
	        if (self.isLocked) return;
	        if (!self.shouldDelete([item], evt)) return;
	        self.removeItem(item);
	        self.refreshOptions(false);
	        self.inputState();
	      });
	      return item;
	    };
	  });
	}

	/**
	 * Plugin: "restore_on_backspace" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function restore_on_backspace (userOptions) {
	  const self = this;
	  const options = Object.assign({
	    text: option => {
	      return option[self.settings.labelField];
	    }
	  }, userOptions);
	  self.on('item_remove', function (value) {
	    if (!self.isFocused) {
	      return;
	    }

	    if (self.control_input.value.trim() === '') {
	      var option = self.options[value];

	      if (option) {
	        self.setTextboxValue(options.text.call(self, option));
	      }
	    }
	  });
	}

	/**
	 * Plugin: "restore_on_backspace" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function virtual_scroll () {
	  const self = this;
	  const orig_canLoad = self.canLoad;
	  const orig_clearActiveOption = self.clearActiveOption;
	  const orig_loadCallback = self.loadCallback;
	  var pagination = {};
	  var dropdown_content;
	  var loading_more = false;
	  var load_more_opt;
	  var default_values = [];

	  if (!self.settings.shouldLoadMore) {
	    // return true if additional results should be loaded
	    self.settings.shouldLoadMore = () => {
	      const scroll_percent = dropdown_content.clientHeight / (dropdown_content.scrollHeight - dropdown_content.scrollTop);

	      if (scroll_percent > 0.9) {
	        return true;
	      }

	      if (self.activeOption) {
	        var selectable = self.selectable();
	        var index = Array.from(selectable).indexOf(self.activeOption);

	        if (index >= selectable.length - 2) {
	          return true;
	        }
	      }

	      return false;
	    };
	  }

	  if (!self.settings.firstUrl) {
	    throw 'virtual_scroll plugin requires a firstUrl() method';
	  } // in order for virtual scrolling to work,
	  // options need to be ordered the same way they're returned from the remote data source


	  self.settings.sortField = [{
	    field: '$order'
	  }, {
	    field: '$score'
	  }]; // can we load more results for given query?

	  const canLoadMore = query => {
	    if (typeof self.settings.maxOptions === 'number' && dropdown_content.children.length >= self.settings.maxOptions) {
	      return false;
	    }

	    if (query in pagination && pagination[query]) {
	      return true;
	    }

	    return false;
	  };

	  const clearFilter = (option, value) => {
	    if (self.items.indexOf(value) >= 0 || default_values.indexOf(value) >= 0) {
	      return true;
	    }

	    return false;
	  }; // set the next url that will be


	  self.setNextUrl = (value, next_url) => {
	    pagination[value] = next_url;
	  }; // getUrl() to be used in settings.load()


	  self.getUrl = query => {
	    if (query in pagination) {
	      const next_url = pagination[query];
	      pagination[query] = false;
	      return next_url;
	    } // if the user goes back to a previous query
	    // we need to load the first page again


	    pagination = {};
	    return self.settings.firstUrl.call(self, query);
	  }; // don't clear the active option (and cause unwanted dropdown scroll)
	  // while loading more results


	  self.hook('instead', 'clearActiveOption', () => {
	    if (loading_more) {
	      return;
	    }

	    return orig_clearActiveOption.call(self);
	  }); // override the canLoad method

	  self.hook('instead', 'canLoad', query => {
	    // first time the query has been seen
	    if (!(query in pagination)) {
	      return orig_canLoad.call(self, query);
	    }

	    return canLoadMore(query);
	  }); // wrap the load

	  self.hook('instead', 'loadCallback', (options, optgroups) => {
	    if (!loading_more) {
	      self.clearOptions(clearFilter);
	    } else if (load_more_opt) {
	      const first_option = options[0];

	      if (first_option !== undefined) {
	        load_more_opt.dataset.value = first_option[self.settings.valueField];
	      }
	    }

	    orig_loadCallback.call(self, options, optgroups);
	    loading_more = false;
	  }); // add templates to dropdown
	  //	loading_more if we have another url in the queue
	  //	no_more_results if we don't have another url in the queue

	  self.hook('after', 'refreshOptions', () => {
	    const query = self.lastValue;
	    var option;

	    if (canLoadMore(query)) {
	      option = self.render('loading_more', {
	        query: query
	      });

	      if (option) {
	        option.setAttribute('data-selectable', ''); // so that navigating dropdown with [down] keypresses can navigate to this node

	        load_more_opt = option;
	      }
	    } else if (query in pagination && !dropdown_content.querySelector('.no-results')) {
	      option = self.render('no_more_results', {
	        query: query
	      });
	    }

	    if (option) {
	      addClasses(option, self.settings.optionClass);
	      dropdown_content.append(option);
	    }
	  }); // add scroll listener and default templates

	  self.on('initialize', () => {
	    default_values = Object.keys(self.options);
	    dropdown_content = self.dropdown_content; // default templates

	    self.settings.render = Object.assign({}, {
	      loading_more: () => {
	        return `<div class="loading-more-results">Loading more results ... </div>`;
	      },
	      no_more_results: () => {
	        return `<div class="no-more-results">No more results</div>`;
	      }
	    }, self.settings.render); // watch dropdown content scroll position

	    dropdown_content.addEventListener('scroll', () => {
	      if (!self.settings.shouldLoadMore.call(self)) {
	        return;
	      } // !important: this will get checked again in load() but we still need to check here otherwise loading_more will be set to true


	      if (!canLoadMore(self.lastValue)) {
	        return;
	      } // don't call load() too much


	      if (loading_more) return;
	      loading_more = true;
	      self.load.call(self, self.lastValue);
	    });
	  });
	}

	TomSelect.define('change_listener', change_listener);
	TomSelect.define('checkbox_options', checkbox_options);
	TomSelect.define('clear_button', clear_button);
	TomSelect.define('drag_drop', drag_drop);
	TomSelect.define('dropdown_header', dropdown_header);
	TomSelect.define('caret_position', caret_position);
	TomSelect.define('dropdown_input', dropdown_input);
	TomSelect.define('input_autogrow', input_autogrow);
	TomSelect.define('no_backspace_delete', no_backspace_delete);
	TomSelect.define('no_active_items', no_active_items);
	TomSelect.define('optgroup_columns', optgroup_columns);
	TomSelect.define('remove_button', remove_button);
	TomSelect.define('restore_on_backspace', restore_on_backspace);
	TomSelect.define('virtual_scroll', virtual_scroll);

	return TomSelect;

}));
var tomSelect=function(el,opts){return new TomSelect(el,opts);} 
//# sourceMappingURL=tom-select.complete.js.map


/***/ }),

/***/ "./Scripts/common/disp_common.ts":
/*!***************************************!*\
  !*** ./Scripts/common/disp_common.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "common": () => (/* binding */ common)
/* harmony export */ });
/* harmony import */ var tom_select__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tom-select */ "./node_modules/tom-select/dist/js/tom-select.complete.js");
/* harmony import */ var tom_select__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tom_select__WEBPACK_IMPORTED_MODULE_0__);

document.addEventListener('DOMContentLoaded', function () {
    var _a;
    //.tom-selectがあればTomSelect要素(コンボボックス)に置き換える
    document.querySelectorAll('.tom-select').forEach(function (el) {
        new (tom_select__WEBPACK_IMPORTED_MODULE_0___default())(el, {});
    });
    //行削除をする
    var buttons = document.getElementsByClassName('deleteRow');
    for (var i = 0; (_a = i < (buttons === null || buttons === void 0 ? void 0 : buttons.length)) !== null && _a !== void 0 ? _a : 0; i++) {
        var button = buttons[i];
        button.addEventListener('click', function (event) {
            var buttonElement = event.target;
            var rowElement = buttonElement.closest("tr");
            rowElement === null || rowElement === void 0 ? void 0 : rowElement.remove();
            event.stopPropagation();
        });
    }
});
var common = /** @class */ (function () {
    function common() {
        this.replaceTomSelect();
    }
    /**
     * .tom-selectの要素をTomSelect要素(コンボボックス)に置き換える
     * */
    common.prototype.replaceTomSelect = function () {
        document.addEventListener('DOMContentLoaded', function () {
            //.tom-selectがあればTomSelect要素(コンボボックス)に置き換える
            document.querySelectorAll('.tom-select').forEach(function (el) {
                new (tom_select__WEBPACK_IMPORTED_MODULE_0___default())(el, {});
            });
        });
    };
    return common;
}());

;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************!*\
  !*** ./Scripts/entries/disp_MstDeployPresets.ts ***!
  \**************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_disp_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/disp_common */ "./Scripts/common/disp_common.ts");

new _common_disp_common__WEBPACK_IMPORTED_MODULE_0__.common();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFZO0FBQ1o7QUFDQSxRQUFRO0FBQ1IsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLFFBQVE7QUFDUjs7QUFFQTs7QUFFQSw4Q0FBOEM7O0FBRTlDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQzs7QUFFbkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCOztBQUUvQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDs7QUFFdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0EsK0RBQStEO0FBQy9ELHNEQUFzRDtBQUN0RCxnREFBZ0Q7QUFDaEQscURBQXFEO0FBQ3JELDREQUE0RDtBQUM1RCxxREFBcUQ7QUFDckQsZ0RBQWdEO0FBQ2hELDJEQUEyRDtBQUMzRCxxREFBcUQ7QUFDckQsZ0RBQWdEO0FBQ2hELHdEQUF3RDtBQUN4RCxrREFBa0Q7QUFDbEQsZ0RBQWdEO0FBQ2hELHdEQUF3RDtBQUN4RCx3REFBd0Q7QUFDeEQsbURBQW1EO0FBQ25ELHNEQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5Q0FBeUMsc0JBQXNCLHNCQUFzQix3QkFBd0I7QUFDN0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7O0FBRXhCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsTUFBTTs7O0FBR047QUFDQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLGVBQWU7O0FBRWpEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSwwQkFBMEI7QUFDMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDZCQUE2Qjs7QUFFN0I7QUFDQSx3REFBd0Q7O0FBRXhEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2QztBQUNBO0FBQ0EsTUFBTSxHQUFHOztBQUVUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVFQUF1RTs7QUFFdkU7QUFDQSxzREFBc0Q7O0FBRXREO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLHdDQUF3QztBQUN4QyxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSLE9BQU87OztBQUdQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTSxHQUFHOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0sR0FBRzs7QUFFVCw4REFBOEQ7O0FBRTlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsZ0NBQWdDO0FBQ2hDLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztB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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7O0FBRS9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDs7QUFFbEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPOzs7QUFHUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QixVQUFVO0FBQ2pDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsT0FBTztBQUNQLGdDQUFnQztBQUNo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QUdQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQSxxQkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3RUFBd0Usa0JBQWtCO0FBQzFGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7O0FBR0E7QUFDQTtBQUNBLFdBQVc7OztBQUdYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87OztBQUdQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLFNBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFFBQVE7O0FBRVI7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLEdBQUc7O0FBRVg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxHQUFHOztBQUViO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0wsYUFBQztBQUFELENBQUM7O0FBQUEsQ0FBQzs7Ozs7OztVQzNDRjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ04rQztBQUUvQyxJQUFJLHVEQUFNLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvdG9tLXNlbGVjdC9kaXN0L2pzL3RvbS1zZWxlY3QuY29tcGxldGUuanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL1NjcmlwdHMvY29tbW9uL2Rpc3BfY29tbW9uLnRzIiwid2VicGFjazovL2FzcC5uZXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYXNwLm5ldC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9hc3AubmV0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hc3AubmV0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXNwLm5ldC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2FzcC5uZXQvLi9TY3JpcHRzL2VudHJpZXMvZGlzcF9Nc3REZXBsb3lQcmVzZXRzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuKiBUb20gU2VsZWN0IHYyLjIuMlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKi9cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsVGhpcyA6IGdsb2JhbCB8fCBzZWxmLCBnbG9iYWwuVG9tU2VsZWN0ID0gZmFjdG9yeSgpKTtcbn0pKHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuXHQvKipcblx0ICogTWljcm9FdmVudCAtIHRvIG1ha2UgYW55IGpzIG9iamVjdCBhbiBldmVudCBlbWl0dGVyXG5cdCAqXG5cdCAqIC0gcHVyZSBqYXZhc2NyaXB0IC0gc2VydmVyIGNvbXBhdGlibGUsIGJyb3dzZXIgY29tcGF0aWJsZVxuXHQgKiAtIGRvbnQgcmVseSBvbiB0aGUgYnJvd3NlciBkb21zXG5cdCAqIC0gc3VwZXIgc2ltcGxlIC0geW91IGdldCBpdCBpbW1lZGlhdGx5LCBubyBtaXN0ZXJ5LCBubyBtYWdpYyBpbnZvbHZlZFxuXHQgKlxuXHQgKiBAYXV0aG9yIEplcm9tZSBFdGllbm5lIChodHRwczovL2dpdGh1Yi5jb20vamVyb21lZXRpZW5uZSlcblx0ICovXG5cblx0LyoqXG5cdCAqIEV4ZWN1dGUgY2FsbGJhY2sgZm9yIGVhY2ggZXZlbnQgaW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgZXZlbnQgbmFtZXNcblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGZvckV2ZW50cyhldmVudHMsIGNhbGxiYWNrKSB7XG5cdCAgZXZlbnRzLnNwbGl0KC9cXHMrLykuZm9yRWFjaChldmVudCA9PiB7XG5cdCAgICBjYWxsYmFjayhldmVudCk7XG5cdCAgfSk7XG5cdH1cblxuXHRjbGFzcyBNaWNyb0V2ZW50IHtcblx0ICBjb25zdHJ1Y3RvcigpIHtcblx0ICAgIHRoaXMuX2V2ZW50cyA9IHZvaWQgMDtcblx0ICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXHQgIH1cblxuXHQgIG9uKGV2ZW50cywgZmN0KSB7XG5cdCAgICBmb3JFdmVudHMoZXZlbnRzLCBldmVudCA9PiB7XG5cdCAgICAgIGNvbnN0IGV2ZW50X2FycmF5ID0gdGhpcy5fZXZlbnRzW2V2ZW50XSB8fCBbXTtcblx0ICAgICAgZXZlbnRfYXJyYXkucHVzaChmY3QpO1xuXHQgICAgICB0aGlzLl9ldmVudHNbZXZlbnRdID0gZXZlbnRfYXJyYXk7XG5cdCAgICB9KTtcblx0ICB9XG5cblx0ICBvZmYoZXZlbnRzLCBmY3QpIHtcblx0ICAgIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHQgICAgaWYgKG4gPT09IDApIHtcblx0ICAgICAgdGhpcy5fZXZlbnRzID0ge307XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgZm9yRXZlbnRzKGV2ZW50cywgZXZlbnQgPT4ge1xuXHQgICAgICBpZiAobiA9PT0gMSkge1xuXHQgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXG5cdCAgICAgIGNvbnN0IGV2ZW50X2FycmF5ID0gdGhpcy5fZXZlbnRzW2V2ZW50XTtcblx0ICAgICAgaWYgKGV2ZW50X2FycmF5ID09PSB1bmRlZmluZWQpIHJldHVybjtcblx0ICAgICAgZXZlbnRfYXJyYXkuc3BsaWNlKGV2ZW50X2FycmF5LmluZGV4T2YoZmN0KSwgMSk7XG5cdCAgICAgIHRoaXMuX2V2ZW50c1tldmVudF0gPSBldmVudF9hcnJheTtcblx0ICAgIH0pO1xuXHQgIH1cblxuXHQgIHRyaWdnZXIoZXZlbnRzLCAuLi5hcmdzKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBmb3JFdmVudHMoZXZlbnRzLCBldmVudCA9PiB7XG5cdCAgICAgIGNvbnN0IGV2ZW50X2FycmF5ID0gc2VsZi5fZXZlbnRzW2V2ZW50XTtcblx0ICAgICAgaWYgKGV2ZW50X2FycmF5ID09PSB1bmRlZmluZWQpIHJldHVybjtcblx0ICAgICAgZXZlbnRfYXJyYXkuZm9yRWFjaChmY3QgPT4ge1xuXHQgICAgICAgIGZjdC5hcHBseShzZWxmLCBhcmdzKTtcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0ICB9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBtaWNyb3BsdWdpbi5qc1xuXHQgKiBDb3B5cmlnaHQgKGMpIDIwMTMgQnJpYW4gUmVhdmlzICYgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKiBAYXV0aG9yIEJyaWFuIFJlYXZpcyA8YnJpYW5AdGhpcmRyb3V0ZS5jb20+XG5cdCAqL1xuXHRmdW5jdGlvbiBNaWNyb1BsdWdpbihJbnRlcmZhY2UpIHtcblx0ICBJbnRlcmZhY2UucGx1Z2lucyA9IHt9O1xuXHQgIHJldHVybiBjbGFzcyBleHRlbmRzIEludGVyZmFjZSB7XG5cdCAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG5cdCAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuXHQgICAgICB0aGlzLnBsdWdpbnMgPSB7XG5cdCAgICAgICAgbmFtZXM6IFtdLFxuXHQgICAgICAgIHNldHRpbmdzOiB7fSxcblx0ICAgICAgICByZXF1ZXN0ZWQ6IHt9LFxuXHQgICAgICAgIGxvYWRlZDoge31cblx0ICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgLyoqXG5cdCAgICAgKiBSZWdpc3RlcnMgYSBwbHVnaW4uXG5cdCAgICAgKlxuXHQgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm5cblx0ICAgICAqL1xuXHQgICAgc3RhdGljIGRlZmluZShuYW1lLCBmbikge1xuXHQgICAgICBJbnRlcmZhY2UucGx1Z2luc1tuYW1lXSA9IHtcblx0ICAgICAgICAnbmFtZSc6IG5hbWUsXG5cdCAgICAgICAgJ2ZuJzogZm5cblx0ICAgICAgfTtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogSW5pdGlhbGl6ZXMgdGhlIGxpc3RlZCBwbHVnaW5zICh3aXRoIG9wdGlvbnMpLlxuXHQgICAgICogQWNjZXB0YWJsZSBmb3JtYXRzOlxuXHQgICAgICpcblx0ICAgICAqIExpc3QgKHdpdGhvdXQgb3B0aW9ucyk6XG5cdCAgICAgKiAgIFsnYScsICdiJywgJ2MnXVxuXHQgICAgICpcblx0ICAgICAqIExpc3QgKHdpdGggb3B0aW9ucyk6XG5cdCAgICAgKiAgIFt7J25hbWUnOiAnYScsIG9wdGlvbnM6IHt9fSwgeyduYW1lJzogJ2InLCBvcHRpb25zOiB7fX1dXG5cdCAgICAgKlxuXHQgICAgICogSGFzaCAod2l0aCBvcHRpb25zKTpcblx0ICAgICAqICAgeydhJzogeyAuLi4gfSwgJ2InOiB7IC4uLiB9LCAnYyc6IHsgLi4uIH19XG5cdCAgICAgKlxuXHQgICAgICogQHBhcmFtIHthcnJheXxvYmplY3R9IHBsdWdpbnNcblx0ICAgICAqL1xuXG5cblx0ICAgIGluaXRpYWxpemVQbHVnaW5zKHBsdWdpbnMpIHtcblx0ICAgICAgdmFyIGtleSwgbmFtZTtcblx0ICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICAgIGNvbnN0IHF1ZXVlID0gW107XG5cblx0ICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGx1Z2lucykpIHtcblx0ICAgICAgICBwbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHtcblx0ICAgICAgICAgIGlmICh0eXBlb2YgcGx1Z2luID09PSAnc3RyaW5nJykge1xuXHQgICAgICAgICAgICBxdWV1ZS5wdXNoKHBsdWdpbik7XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBzZWxmLnBsdWdpbnMuc2V0dGluZ3NbcGx1Z2luLm5hbWVdID0gcGx1Z2luLm9wdGlvbnM7XG5cdCAgICAgICAgICAgIHF1ZXVlLnB1c2gocGx1Z2luLm5hbWUpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXHQgICAgICB9IGVsc2UgaWYgKHBsdWdpbnMpIHtcblx0ICAgICAgICBmb3IgKGtleSBpbiBwbHVnaW5zKSB7XG5cdCAgICAgICAgICBpZiAocGx1Z2lucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdCAgICAgICAgICAgIHNlbGYucGx1Z2lucy5zZXR0aW5nc1trZXldID0gcGx1Z2luc1trZXldO1xuXHQgICAgICAgICAgICBxdWV1ZS5wdXNoKGtleSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgd2hpbGUgKG5hbWUgPSBxdWV1ZS5zaGlmdCgpKSB7XG5cdCAgICAgICAgc2VsZi5yZXF1aXJlKG5hbWUpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGxvYWRQbHVnaW4obmFtZSkge1xuXHQgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICAgIHZhciBwbHVnaW5zID0gc2VsZi5wbHVnaW5zO1xuXHQgICAgICB2YXIgcGx1Z2luID0gSW50ZXJmYWNlLnBsdWdpbnNbbmFtZV07XG5cblx0ICAgICAgaWYgKCFJbnRlcmZhY2UucGx1Z2lucy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgXCInICsgbmFtZSArICdcIiBwbHVnaW4nKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHBsdWdpbnMucmVxdWVzdGVkW25hbWVdID0gdHJ1ZTtcblx0ICAgICAgcGx1Z2lucy5sb2FkZWRbbmFtZV0gPSBwbHVnaW4uZm4uYXBwbHkoc2VsZiwgW3NlbGYucGx1Z2lucy5zZXR0aW5nc1tuYW1lXSB8fCB7fV0pO1xuXHQgICAgICBwbHVnaW5zLm5hbWVzLnB1c2gobmFtZSk7XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIEluaXRpYWxpemVzIGEgcGx1Z2luLlxuXHQgICAgICpcblx0ICAgICAqL1xuXG5cblx0ICAgIHJlcXVpcmUobmFtZSkge1xuXHQgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICAgIHZhciBwbHVnaW5zID0gc2VsZi5wbHVnaW5zO1xuXG5cdCAgICAgIGlmICghc2VsZi5wbHVnaW5zLmxvYWRlZC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuXHQgICAgICAgIGlmIChwbHVnaW5zLnJlcXVlc3RlZFtuYW1lXSkge1xuXHQgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbHVnaW4gaGFzIGNpcmN1bGFyIGRlcGVuZGVuY3kgKFwiJyArIG5hbWUgKyAnXCIpJyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VsZi5sb2FkUGx1Z2luKG5hbWUpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIHBsdWdpbnMubG9hZGVkW25hbWVdO1xuXHQgICAgfVxuXG5cdCAgfTtcblx0fVxuXG5cdC8qISBAb3JjaGlkanMvdW5pY29kZS12YXJpYW50cyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9vcmNoaWRqcy91bmljb2RlLXZhcmlhbnRzIHwgQXBhY2hlIExpY2Vuc2UgKHYyKSAqL1xuXHQvKipcblx0ICogQ29udmVydCBhcnJheSBvZiBzdHJpbmdzIHRvIGEgcmVndWxhciBleHByZXNzaW9uXG5cdCAqXHRleCBbJ2FiJywnYSddID0+ICg/OmFifGEpXG5cdCAqIFx0ZXggWydhJywnYiddID0+IFthYl1cblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gY2hhcnNcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblx0Y29uc3QgYXJyYXlUb1BhdHRlcm4gPSBjaGFycyA9PiB7XG5cdCAgY2hhcnMgPSBjaGFycy5maWx0ZXIoQm9vbGVhbik7XG5cblx0ICBpZiAoY2hhcnMubGVuZ3RoIDwgMikge1xuXHQgICAgcmV0dXJuIGNoYXJzWzBdIHx8ICcnO1xuXHQgIH1cblxuXHQgIHJldHVybiBtYXhWYWx1ZUxlbmd0aChjaGFycykgPT0gMSA/ICdbJyArIGNoYXJzLmpvaW4oJycpICsgJ10nIDogJyg/OicgKyBjaGFycy5qb2luKCd8JykgKyAnKSc7XG5cdH07XG5cdC8qKlxuXHQgKiBAcGFyYW0ge3N0cmluZ1tdfSBhcnJheVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXG5cdGNvbnN0IHNlcXVlbmNlUGF0dGVybiA9IGFycmF5ID0+IHtcblx0ICBpZiAoIWhhc0R1cGxpY2F0ZXMoYXJyYXkpKSB7XG5cdCAgICByZXR1cm4gYXJyYXkuam9pbignJyk7XG5cdCAgfVxuXG5cdCAgbGV0IHBhdHRlcm4gPSAnJztcblx0ICBsZXQgcHJldl9jaGFyX2NvdW50ID0gMDtcblxuXHQgIGNvbnN0IHByZXZfcGF0dGVybiA9ICgpID0+IHtcblx0ICAgIGlmIChwcmV2X2NoYXJfY291bnQgPiAxKSB7XG5cdCAgICAgIHBhdHRlcm4gKz0gJ3snICsgcHJldl9jaGFyX2NvdW50ICsgJ30nO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICBhcnJheS5mb3JFYWNoKChjaGFyLCBpKSA9PiB7XG5cdCAgICBpZiAoY2hhciA9PT0gYXJyYXlbaSAtIDFdKSB7XG5cdCAgICAgIHByZXZfY2hhcl9jb3VudCsrO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHByZXZfcGF0dGVybigpO1xuXHQgICAgcGF0dGVybiArPSBjaGFyO1xuXHQgICAgcHJldl9jaGFyX2NvdW50ID0gMTtcblx0ICB9KTtcblx0ICBwcmV2X3BhdHRlcm4oKTtcblx0ICByZXR1cm4gcGF0dGVybjtcblx0fTtcblx0LyoqXG5cdCAqIENvbnZlcnQgYXJyYXkgb2Ygc3RyaW5ncyB0byBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuXHQgKlx0ZXggWydhYicsJ2EnXSA9PiAoPzphYnxhKVxuXHQgKiBcdGV4IFsnYScsJ2InXSA9PiBbYWJdXG5cdCAqIEBwYXJhbSB7U2V0PHN0cmluZz59IGNoYXJzXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cblx0Y29uc3Qgc2V0VG9QYXR0ZXJuID0gY2hhcnMgPT4ge1xuXHQgIGxldCBhcnJheSA9IHRvQXJyYXkoY2hhcnMpO1xuXHQgIHJldHVybiBhcnJheVRvUGF0dGVybihhcnJheSk7XG5cdH07XG5cdC8qKlxuXHQgKlxuXHQgKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83Mzc2NTk4L2luLWphdmFzY3JpcHQtaG93LWRvLWktY2hlY2staWYtYW4tYXJyYXktaGFzLWR1cGxpY2F0ZS12YWx1ZXNcblx0ICogQHBhcmFtIHthbnlbXX0gYXJyYXlcblx0ICovXG5cblx0Y29uc3QgaGFzRHVwbGljYXRlcyA9IGFycmF5ID0+IHtcblx0ICByZXR1cm4gbmV3IFNldChhcnJheSkuc2l6ZSAhPT0gYXJyYXkubGVuZ3RoO1xuXHR9O1xuXHQvKipcblx0ICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjMwMDY2MDEvd2h5LWRvZXMtdS10aHJvdy1hbi1pbnZhbGlkLWVzY2FwZS1lcnJvclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cblx0Y29uc3QgZXNjYXBlX3JlZ2V4ID0gc3RyID0+IHtcblx0ICByZXR1cm4gKHN0ciArICcnKS5yZXBsYWNlKC8oW1xcJFxcKFxcKVxcKlxcK1xcLlxcP1xcW1xcXVxcXlxce1xcfFxcfVxcXFxdKS9ndSwgJ1xcXFwkMScpO1xuXHR9O1xuXHQvKipcblx0ICogUmV0dXJuIHRoZSBtYXggbGVuZ3RoIG9mIGFycmF5IHZhbHVlc1xuXHQgKiBAcGFyYW0ge3N0cmluZ1tdfSBhcnJheVxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBtYXhWYWx1ZUxlbmd0aCA9IGFycmF5ID0+IHtcblx0ICByZXR1cm4gYXJyYXkucmVkdWNlKChsb25nZXN0LCB2YWx1ZSkgPT4gTWF0aC5tYXgobG9uZ2VzdCwgdW5pY29kZUxlbmd0aCh2YWx1ZSkpLCAwKTtcblx0fTtcblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICovXG5cblx0Y29uc3QgdW5pY29kZUxlbmd0aCA9IHN0ciA9PiB7XG5cdCAgcmV0dXJuIHRvQXJyYXkoc3RyKS5sZW5ndGg7XG5cdH07XG5cdC8qKlxuXHQgKiBAcGFyYW0ge2FueX0gcFxuXHQgKiBAcmV0dXJuIHthbnlbXX1cblx0ICovXG5cblx0Y29uc3QgdG9BcnJheSA9IHAgPT4gQXJyYXkuZnJvbShwKTtcblxuXHQvKiEgQG9yY2hpZGpzL3VuaWNvZGUtdmFyaWFudHMgfCBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvdW5pY29kZS12YXJpYW50cyB8IEFwYWNoZSBMaWNlbnNlICh2MikgKi9cblx0LyoqXG5cdCAqIEdldCBhbGwgcG9zc2libGUgY29tYmluYXRpb25zIG9mIHN1YnN0cmluZ3MgdGhhdCBhZGQgdXAgdG8gdGhlIGdpdmVuIHN0cmluZ1xuXHQgKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMDE2OTU4Ny9maW5kLWFsbC10aGUtY29tYmluYXRpb24tb2Ytc3Vic3RyaW5ncy10aGF0LWFkZC11cC10by10aGUtZ2l2ZW4tc3RyaW5nXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFxuXHQgKiBAcmV0dXJuIHtzdHJpbmdbXVtdfVxuXHQgKi9cblx0Y29uc3QgYWxsU3Vic3RyaW5ncyA9IGlucHV0ID0+IHtcblx0ICBpZiAoaW5wdXQubGVuZ3RoID09PSAxKSByZXR1cm4gW1tpbnB1dF1dO1xuXHQgIC8qKiBAdHlwZSB7c3RyaW5nW11bXX0gKi9cblxuXHQgIGxldCByZXN1bHQgPSBbXTtcblx0ICBjb25zdCBzdGFydCA9IGlucHV0LnN1YnN0cmluZygxKTtcblx0ICBjb25zdCBzdWJhID0gYWxsU3Vic3RyaW5ncyhzdGFydCk7XG5cdCAgc3ViYS5mb3JFYWNoKGZ1bmN0aW9uIChzdWJyZXN1bHQpIHtcblx0ICAgIGxldCB0bXAgPSBzdWJyZXN1bHQuc2xpY2UoMCk7XG5cdCAgICB0bXBbMF0gPSBpbnB1dC5jaGFyQXQoMCkgKyB0bXBbMF07XG5cdCAgICByZXN1bHQucHVzaCh0bXApO1xuXHQgICAgdG1wID0gc3VicmVzdWx0LnNsaWNlKDApO1xuXHQgICAgdG1wLnVuc2hpZnQoaW5wdXQuY2hhckF0KDApKTtcblx0ICAgIHJlc3VsdC5wdXNoKHRtcCk7XG5cdCAgfSk7XG5cdCAgcmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHQvKiEgQG9yY2hpZGpzL3VuaWNvZGUtdmFyaWFudHMgfCBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvdW5pY29kZS12YXJpYW50cyB8IEFwYWNoZSBMaWNlbnNlICh2MikgKi9cblxuXHQvKipcblx0ICogQHR5cGVkZWYge3tba2V5OnN0cmluZ106c3RyaW5nfX0gVFVuaWNvZGVNYXBcblx0ICogQHR5cGVkZWYge3tba2V5OnN0cmluZ106U2V0PHN0cmluZz59fSBUVW5pY29kZVNldHNcblx0ICogQHR5cGVkZWYge1tbbnVtYmVyLG51bWJlcl1dfSBUQ29kZVBvaW50c1xuXHQgKiBAdHlwZWRlZiB7e2ZvbGRlZDpzdHJpbmcsY29tcG9zZWQ6c3RyaW5nLGNvZGVfcG9pbnQ6bnVtYmVyfX0gVENvZGVQb2ludE9ialxuXHQgKiBAdHlwZWRlZiB7e3N0YXJ0Om51bWJlcixlbmQ6bnVtYmVyLGxlbmd0aDpudW1iZXIsc3Vic3RyOnN0cmluZ319IFRTZXF1ZW5jZVBhcnRcblx0ICovXG5cdC8qKiBAdHlwZSB7VENvZGVQb2ludHN9ICovXG5cblx0Y29uc3QgY29kZV9wb2ludHMgPSBbWzAsIDY1NTM1XV07XG5cdGNvbnN0IGFjY2VudF9wYXQgPSAnW1xcdTAzMDAtXFx1MDM2RlxcdXtiN31cXHV7MmJlfVxcdXsyYmN9XSc7XG5cdC8qKiBAdHlwZSB7VFVuaWNvZGVNYXB9ICovXG5cblx0bGV0IHVuaWNvZGVfbWFwO1xuXHQvKiogQHR5cGUge1JlZ0V4cH0gKi9cblxuXHRsZXQgbXVsdGlfY2hhcl9yZWc7XG5cdGNvbnN0IG1heF9jaGFyX2xlbmd0aCA9IDM7XG5cdC8qKiBAdHlwZSB7VFVuaWNvZGVNYXB9ICovXG5cblx0Y29uc3QgbGF0aW5fY29udmVydCA9IHt9O1xuXHQvKiogQHR5cGUge1RVbmljb2RlTWFwfSAqL1xuXG5cdGNvbnN0IGxhdGluX2NvbmRlbnNlZCA9IHtcblx0ICAnLyc6ICfigYTiiJUnLFxuXHQgICcwJzogJ9+AJyxcblx0ICBcImFcIjogXCLisaXJkMmRXCIsXG5cdCAgXCJhYVwiOiBcIuqcs1wiLFxuXHQgIFwiYWVcIjogXCLDpse9x6NcIixcblx0ICBcImFvXCI6IFwi6py1XCIsXG5cdCAgXCJhdVwiOiBcIuqct1wiLFxuXHQgIFwiYXZcIjogXCLqnLnqnLtcIixcblx0ICBcImF5XCI6IFwi6py9XCIsXG5cdCAgXCJiXCI6IFwixoDJk8aDXCIsXG5cdCAgXCJjXCI6IFwi6py/xojIvOKGhFwiLFxuXHQgIFwiZFwiOiBcIsSRyZfJluG0hcaM6q631IHJplwiLFxuXHQgIFwiZVwiOiBcIsmbx53htIfJh1wiLFxuXHQgIFwiZlwiOiBcIuqdvMaSXCIsXG5cdCAgXCJnXCI6IFwix6XJoOqeoeG1ueqdv8miXCIsXG5cdCAgXCJoXCI6IFwixKfisajisbbJpVwiLFxuXHQgIFwiaVwiOiBcIsmoxLFcIixcblx0ICBcImpcIjogXCLJici3XCIsXG5cdCAgXCJrXCI6IFwixpnisarqnYHqnYPqnYXqnqNcIixcblx0ICBcImxcIjogXCLFgsaayavisaHqnYnqnYfqnoHJrVwiLFxuXHQgIFwibVwiOiBcIsmxya/Pu1wiLFxuXHQgIFwiblwiOiBcIuqepcaeybLqnpHhtI7Qu9SJXCIsXG5cdCAgXCJvXCI6IFwiw7jHv8mUybXqnYvqnY3htJFcIixcblx0ICBcIm9lXCI6IFwixZNcIixcblx0ICBcIm9pXCI6IFwixqNcIixcblx0ICBcIm9vXCI6IFwi6p2PXCIsXG5cdCAgXCJvdVwiOiBcIsijXCIsXG5cdCAgXCJwXCI6IFwixqXhtb3qnZHqnZPqnZXPgVwiLFxuXHQgIFwicVwiOiBcIuqdl+qdmcmLXCIsXG5cdCAgXCJyXCI6IFwiyY3Jveqdm+qep+qeg1wiLFxuXHQgIFwic1wiOiBcIsOfyL/qnqnqnoXKglwiLFxuXHQgIFwidFwiOiBcIsWnxq3KiOKxpuqeh1wiLFxuXHQgIFwidGhcIjogXCLDvlwiLFxuXHQgIFwidHpcIjogXCLqnKlcIixcblx0ICBcInVcIjogXCLKiVwiLFxuXHQgIFwidlwiOiBcIsqL6p2fyoxcIixcblx0ICBcInZ5XCI6IFwi6p2hXCIsXG5cdCAgXCJ3XCI6IFwi4rGzXCIsXG5cdCAgXCJ5XCI6IFwixrTJj+G7v1wiLFxuXHQgIFwielwiOiBcIsa2yKXJgOKxrOqdo1wiLFxuXHQgIFwiaHZcIjogXCLGlVwiXG5cdH07XG5cblx0Zm9yIChsZXQgbGF0aW4gaW4gbGF0aW5fY29uZGVuc2VkKSB7XG5cdCAgbGV0IHVuaWNvZGUgPSBsYXRpbl9jb25kZW5zZWRbbGF0aW5dIHx8ICcnO1xuXG5cdCAgZm9yIChsZXQgaSA9IDA7IGkgPCB1bmljb2RlLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBsZXQgY2hhciA9IHVuaWNvZGUuc3Vic3RyaW5nKGksIGkgKyAxKTtcblx0ICAgIGxhdGluX2NvbnZlcnRbY2hhcl0gPSBsYXRpbjtcblx0ICB9XG5cdH1cblxuXHRjb25zdCBjb252ZXJ0X3BhdCA9IG5ldyBSZWdFeHAoT2JqZWN0LmtleXMobGF0aW5fY29udmVydCkuam9pbignfCcpICsgJ3wnICsgYWNjZW50X3BhdCwgJ2d1Jyk7XG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHRoZSB1bmljb2RlX21hcCBmcm9tIHRoZSBnaXZlIGNvZGUgcG9pbnQgcmFuZ2VzXG5cdCAqXG5cdCAqIEBwYXJhbSB7VENvZGVQb2ludHM9fSBfY29kZV9wb2ludHNcblx0ICovXG5cblx0Y29uc3QgaW5pdGlhbGl6ZSA9IF9jb2RlX3BvaW50cyA9PiB7XG5cdCAgaWYgKHVuaWNvZGVfbWFwICE9PSB1bmRlZmluZWQpIHJldHVybjtcblx0ICB1bmljb2RlX21hcCA9IGdlbmVyYXRlTWFwKF9jb2RlX3BvaW50cyB8fCBjb2RlX3BvaW50cyk7XG5cdH07XG5cdC8qKlxuXHQgKiBIZWxwZXIgbWV0aG9kIGZvciBub3JtYWxpemUgYSBzdHJpbmdcblx0ICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU3RyaW5nL25vcm1hbGl6ZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtXG5cdCAqL1xuXG5cdGNvbnN0IG5vcm1hbGl6ZSA9IChzdHIsIGZvcm0gPSAnTkZLRCcpID0+IHN0ci5ub3JtYWxpemUoZm9ybSk7XG5cdC8qKlxuXHQgKiBSZW1vdmUgYWNjZW50cyB3aXRob3V0IHJlb3JkZXJpbmcgc3RyaW5nXG5cdCAqIGNhbGxpbmcgc3RyLm5vcm1hbGl6ZSgnTkZLRCcpIG9uIFxcdXs1OTR9XFx1ezU5NX1cXHV7NTk2fSBiZWNvbWVzIFxcdXs1OTZ9XFx1ezU5NH1cXHV7NTk1fVxuXHQgKiB2aWEgaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrL0Z1c2UvaXNzdWVzLzEzMyNpc3N1ZWNvbW1lbnQtMzE4NjkyNzAzXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblxuXHRjb25zdCBhc2NpaWZvbGQgPSBzdHIgPT4ge1xuXHQgIHJldHVybiB0b0FycmF5KHN0cikucmVkdWNlKFxuXHQgIC8qKlxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfSByZXN1bHRcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhclxuXHQgICAqL1xuXHQgIChyZXN1bHQsIGNoYXIpID0+IHtcblx0ICAgIHJldHVybiByZXN1bHQgKyBfYXNjaWlmb2xkKGNoYXIpO1xuXHQgIH0sICcnKTtcblx0fTtcblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblxuXHRjb25zdCBfYXNjaWlmb2xkID0gc3RyID0+IHtcblx0ICBzdHIgPSBub3JtYWxpemUoc3RyKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoY29udmVydF9wYXQsIChcblx0ICAvKiogQHR5cGUge3N0cmluZ30gKi9cblx0ICBjaGFyKSA9PiB7XG5cdCAgICByZXR1cm4gbGF0aW5fY29udmVydFtjaGFyXSB8fCAnJztcblx0ICB9KTsgLy9yZXR1cm4gc3RyO1xuXG5cdCAgcmV0dXJuIG5vcm1hbGl6ZShzdHIsICdORkMnKTtcblx0fTtcblx0LyoqXG5cdCAqIEdlbmVyYXRlIGEgbGlzdCBvZiB1bmljb2RlIHZhcmlhbnRzIGZyb20gdGhlIGxpc3Qgb2YgY29kZSBwb2ludHNcblx0ICogQHBhcmFtIHtUQ29kZVBvaW50c30gY29kZV9wb2ludHNcblx0ICogQHlpZWxkIHtUQ29kZVBvaW50T2JqfVxuXHQgKi9cblxuXHRmdW5jdGlvbiogZ2VuZXJhdG9yKGNvZGVfcG9pbnRzKSB7XG5cdCAgZm9yIChjb25zdCBbY29kZV9wb2ludF9taW4sIGNvZGVfcG9pbnRfbWF4XSBvZiBjb2RlX3BvaW50cykge1xuXHQgICAgZm9yIChsZXQgaSA9IGNvZGVfcG9pbnRfbWluOyBpIDw9IGNvZGVfcG9pbnRfbWF4OyBpKyspIHtcblx0ICAgICAgbGV0IGNvbXBvc2VkID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcblx0ICAgICAgbGV0IGZvbGRlZCA9IGFzY2lpZm9sZChjb21wb3NlZCk7XG5cblx0ICAgICAgaWYgKGZvbGRlZCA9PSBjb21wb3NlZC50b0xvd2VyQ2FzZSgpKSB7XG5cdCAgICAgICAgY29udGludWU7XG5cdCAgICAgIH0gLy8gc2tpcCB3aGVuIGZvbGRlZCBpcyBhIHN0cmluZyBsb25nZXIgdGhhbiAzIGNoYXJhY3RlcnMgbG9uZ1xuXHQgICAgICAvLyBiYyB0aGUgcmVzdWx0aW5nIHJlZ2V4IHBhdHRlcm5zIHdpbGwgYmUgbG9uZ1xuXHQgICAgICAvLyBlZzpcblx0ICAgICAgLy8gZm9sZGVkINi12YTZiSDYp9mE2YTZhyDYudmE2YrZhyDZiNiz2YTZhSBsZW5ndGggMTggY29kZSBwb2ludCA2NTAxOFxuXHQgICAgICAvLyBmb2xkZWQg2KzZhCDYrNmE2KfZhNmHIGxlbmd0aCA4IGNvZGUgcG9pbnQgNjUwMTlcblxuXG5cdCAgICAgIGlmIChmb2xkZWQubGVuZ3RoID4gbWF4X2NoYXJfbGVuZ3RoKSB7XG5cdCAgICAgICAgY29udGludWU7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoZm9sZGVkLmxlbmd0aCA9PSAwKSB7XG5cdCAgICAgICAgY29udGludWU7XG5cdCAgICAgIH1cblxuXHQgICAgICB5aWVsZCB7XG5cdCAgICAgICAgZm9sZGVkOiBmb2xkZWQsXG5cdCAgICAgICAgY29tcG9zZWQ6IGNvbXBvc2VkLFxuXHQgICAgICAgIGNvZGVfcG9pbnQ6IGlcblx0ICAgICAgfTtcblx0ICAgIH1cblx0ICB9XG5cdH1cblx0LyoqXG5cdCAqIEdlbmVyYXRlIGEgdW5pY29kZSBtYXAgZnJvbSB0aGUgbGlzdCBvZiBjb2RlIHBvaW50c1xuXHQgKiBAcGFyYW0ge1RDb2RlUG9pbnRzfSBjb2RlX3BvaW50c1xuXHQgKiBAcmV0dXJuIHtUVW5pY29kZVNldHN9XG5cdCAqL1xuXG5cdGNvbnN0IGdlbmVyYXRlU2V0cyA9IGNvZGVfcG9pbnRzID0+IHtcblx0ICAvKiogQHR5cGUge3tba2V5OnN0cmluZ106U2V0PHN0cmluZz59fSAqL1xuXHQgIGNvbnN0IHVuaWNvZGVfc2V0cyA9IHt9O1xuXHQgIC8qKlxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfSBmb2xkZWRcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gdG9fYWRkXG5cdCAgICovXG5cblx0ICBjb25zdCBhZGRNYXRjaGluZyA9IChmb2xkZWQsIHRvX2FkZCkgPT4ge1xuXHQgICAgLyoqIEB0eXBlIHtTZXQ8c3RyaW5nPn0gKi9cblx0ICAgIGNvbnN0IGZvbGRlZF9zZXQgPSB1bmljb2RlX3NldHNbZm9sZGVkXSB8fCBuZXcgU2V0KCk7XG5cdCAgICBjb25zdCBwYXR0ID0gbmV3IFJlZ0V4cCgnXicgKyBzZXRUb1BhdHRlcm4oZm9sZGVkX3NldCkgKyAnJCcsICdpdScpO1xuXG5cdCAgICBpZiAodG9fYWRkLm1hdGNoKHBhdHQpKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgZm9sZGVkX3NldC5hZGQoZXNjYXBlX3JlZ2V4KHRvX2FkZCkpO1xuXHQgICAgdW5pY29kZV9zZXRzW2ZvbGRlZF0gPSBmb2xkZWRfc2V0O1xuXHQgIH07XG5cblx0ICBmb3IgKGxldCB2YWx1ZSBvZiBnZW5lcmF0b3IoY29kZV9wb2ludHMpKSB7XG5cdCAgICBhZGRNYXRjaGluZyh2YWx1ZS5mb2xkZWQsIHZhbHVlLmZvbGRlZCk7XG5cdCAgICBhZGRNYXRjaGluZyh2YWx1ZS5mb2xkZWQsIHZhbHVlLmNvbXBvc2VkKTtcblx0ICB9XG5cblx0ICByZXR1cm4gdW5pY29kZV9zZXRzO1xuXHR9O1xuXHQvKipcblx0ICogR2VuZXJhdGUgYSB1bmljb2RlIG1hcCBmcm9tIHRoZSBsaXN0IG9mIGNvZGUgcG9pbnRzXG5cdCAqIGFlID0+ICg/Oig/OmFlfMOGfMe8fMeiKXwoPzpBfOKStnzvvKEuLi4pKD86RXzJm3zikrouLi4pKVxuXHQgKlxuXHQgKiBAcGFyYW0ge1RDb2RlUG9pbnRzfSBjb2RlX3BvaW50c1xuXHQgKiBAcmV0dXJuIHtUVW5pY29kZU1hcH1cblx0ICovXG5cblx0Y29uc3QgZ2VuZXJhdGVNYXAgPSBjb2RlX3BvaW50cyA9PiB7XG5cdCAgLyoqIEB0eXBlIHtUVW5pY29kZVNldHN9ICovXG5cdCAgY29uc3QgdW5pY29kZV9zZXRzID0gZ2VuZXJhdGVTZXRzKGNvZGVfcG9pbnRzKTtcblx0ICAvKiogQHR5cGUge1RVbmljb2RlTWFwfSAqL1xuXG5cdCAgY29uc3QgdW5pY29kZV9tYXAgPSB7fTtcblx0ICAvKiogQHR5cGUge3N0cmluZ1tdfSAqL1xuXG5cdCAgbGV0IG11bHRpX2NoYXIgPSBbXTtcblxuXHQgIGZvciAobGV0IGZvbGRlZCBpbiB1bmljb2RlX3NldHMpIHtcblx0ICAgIGxldCBzZXQgPSB1bmljb2RlX3NldHNbZm9sZGVkXTtcblxuXHQgICAgaWYgKHNldCkge1xuXHQgICAgICB1bmljb2RlX21hcFtmb2xkZWRdID0gc2V0VG9QYXR0ZXJuKHNldCk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChmb2xkZWQubGVuZ3RoID4gMSkge1xuXHQgICAgICBtdWx0aV9jaGFyLnB1c2goZXNjYXBlX3JlZ2V4KGZvbGRlZCkpO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIG11bHRpX2NoYXIuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cdCAgY29uc3QgbXVsdGlfY2hhcl9wYXR0ID0gYXJyYXlUb1BhdHRlcm4obXVsdGlfY2hhcik7XG5cdCAgbXVsdGlfY2hhcl9yZWcgPSBuZXcgUmVnRXhwKCdeJyArIG11bHRpX2NoYXJfcGF0dCwgJ3UnKTtcblx0ICByZXR1cm4gdW5pY29kZV9tYXA7XG5cdH07XG5cdC8qKlxuXHQgKiBNYXAgZWFjaCBlbGVtZW50IG9mIGFuIGFycmF5IGZyb20gaXQncyBmb2xkZWQgdmFsdWUgdG8gYWxsIHBvc3NpYmxlIHVuaWNvZGUgbWF0Y2hlc1xuXHQgKiBAcGFyYW0ge3N0cmluZ1tdfSBzdHJpbmdzXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBtaW5fcmVwbGFjZW1lbnRcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblxuXHRjb25zdCBtYXBTZXF1ZW5jZSA9IChzdHJpbmdzLCBtaW5fcmVwbGFjZW1lbnQgPSAxKSA9PiB7XG5cdCAgbGV0IGNoYXJzX3JlcGxhY2VkID0gMDtcblx0ICBzdHJpbmdzID0gc3RyaW5ncy5tYXAoc3RyID0+IHtcblx0ICAgIGlmICh1bmljb2RlX21hcFtzdHJdKSB7XG5cdCAgICAgIGNoYXJzX3JlcGxhY2VkICs9IHN0ci5sZW5ndGg7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB1bmljb2RlX21hcFtzdHJdIHx8IHN0cjtcblx0ICB9KTtcblxuXHQgIGlmIChjaGFyc19yZXBsYWNlZCA+PSBtaW5fcmVwbGFjZW1lbnQpIHtcblx0ICAgIHJldHVybiBzZXF1ZW5jZVBhdHRlcm4oc3RyaW5ncyk7XG5cdCAgfVxuXG5cdCAgcmV0dXJuICcnO1xuXHR9O1xuXHQvKipcblx0ICogQ29udmVydCBhIHNob3J0IHN0cmluZyBhbmQgc3BsaXQgaXQgaW50byBhbGwgcG9zc2libGUgcGF0dGVybnNcblx0ICogS2VlcCBhIHBhdHRlcm4gb25seSBpZiBtaW5fcmVwbGFjZW1lbnQgaXMgbWV0XG5cdCAqXG5cdCAqICdhYmMnXG5cdCAqIFx0XHQ9PiBbWydhYmMnXSxbJ2FiJywnYyddLFsnYScsJ2JjJ10sWydhJywnYicsJ2MnXV1cblx0ICpcdFx0PT4gWydhYmMtcGF0dGVybicsJ2FiLWMtcGF0dGVybicuLi5dXG5cdCAqXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IG1pbl9yZXBsYWNlbWVudFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXG5cdGNvbnN0IHN1YnN0cmluZ3NUb1BhdHRlcm4gPSAoc3RyLCBtaW5fcmVwbGFjZW1lbnQgPSAxKSA9PiB7XG5cdCAgbWluX3JlcGxhY2VtZW50ID0gTWF0aC5tYXgobWluX3JlcGxhY2VtZW50LCBzdHIubGVuZ3RoIC0gMSk7XG5cdCAgcmV0dXJuIGFycmF5VG9QYXR0ZXJuKGFsbFN1YnN0cmluZ3Moc3RyKS5tYXAoc3ViX3BhdCA9PiB7XG5cdCAgICByZXR1cm4gbWFwU2VxdWVuY2Uoc3ViX3BhdCwgbWluX3JlcGxhY2VtZW50KTtcblx0ICB9KSk7XG5cdH07XG5cdC8qKlxuXHQgKiBDb252ZXJ0IGFuIGFycmF5IG9mIHNlcXVlbmNlcyBpbnRvIGEgcGF0dGVyblxuXHQgKiBbe3N0YXJ0OjAsZW5kOjMsbGVuZ3RoOjMsc3Vic3RyOidpaWknfS4uLl0gPT4gKD86aWlpLi4uKVxuXHQgKlxuXHQgKiBAcGFyYW0ge1NlcXVlbmNlW119IHNlcXVlbmNlc1xuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IGFsbFxuXHQgKi9cblxuXHRjb25zdCBzZXF1ZW5jZXNUb1BhdHRlcm4gPSAoc2VxdWVuY2VzLCBhbGwgPSB0cnVlKSA9PiB7XG5cdCAgbGV0IG1pbl9yZXBsYWNlbWVudCA9IHNlcXVlbmNlcy5sZW5ndGggPiAxID8gMSA6IDA7XG5cdCAgcmV0dXJuIGFycmF5VG9QYXR0ZXJuKHNlcXVlbmNlcy5tYXAoc2VxdWVuY2UgPT4ge1xuXHQgICAgbGV0IHNlcSA9IFtdO1xuXHQgICAgY29uc3QgbGVuID0gYWxsID8gc2VxdWVuY2UubGVuZ3RoKCkgOiBzZXF1ZW5jZS5sZW5ndGgoKSAtIDE7XG5cblx0ICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGVuOyBqKyspIHtcblx0ICAgICAgc2VxLnB1c2goc3Vic3RyaW5nc1RvUGF0dGVybihzZXF1ZW5jZS5zdWJzdHJzW2pdIHx8ICcnLCBtaW5fcmVwbGFjZW1lbnQpKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHNlcXVlbmNlUGF0dGVybihzZXEpO1xuXHQgIH0pKTtcblx0fTtcblx0LyoqXG5cdCAqIFJldHVybiB0cnVlIGlmIHRoZSBzZXF1ZW5jZSBpcyBhbHJlYWR5IGluIHRoZSBzZXF1ZW5jZXNcblx0ICogQHBhcmFtIHtTZXF1ZW5jZX0gbmVlZGxlX3NlcVxuXHQgKiBAcGFyYW0ge1NlcXVlbmNlW119IHNlcXVlbmNlc1xuXHQgKi9cblxuXG5cdGNvbnN0IGluU2VxdWVuY2VzID0gKG5lZWRsZV9zZXEsIHNlcXVlbmNlcykgPT4ge1xuXHQgIGZvciAoY29uc3Qgc2VxIG9mIHNlcXVlbmNlcykge1xuXHQgICAgaWYgKHNlcS5zdGFydCAhPSBuZWVkbGVfc2VxLnN0YXJ0IHx8IHNlcS5lbmQgIT0gbmVlZGxlX3NlcS5lbmQpIHtcblx0ICAgICAgY29udGludWU7XG5cdCAgICB9XG5cblx0ICAgIGlmIChzZXEuc3Vic3Rycy5qb2luKCcnKSAhPT0gbmVlZGxlX3NlcS5zdWJzdHJzLmpvaW4oJycpKSB7XG5cdCAgICAgIGNvbnRpbnVlO1xuXHQgICAgfVxuXG5cdCAgICBsZXQgbmVlZGxlX3BhcnRzID0gbmVlZGxlX3NlcS5wYXJ0cztcblx0ICAgIC8qKlxuXHQgICAgICogQHBhcmFtIHtUU2VxdWVuY2VQYXJ0fSBwYXJ0XG5cdCAgICAgKi9cblxuXHQgICAgY29uc3QgZmlsdGVyID0gcGFydCA9PiB7XG5cdCAgICAgIGZvciAoY29uc3QgbmVlZGxlX3BhcnQgb2YgbmVlZGxlX3BhcnRzKSB7XG5cdCAgICAgICAgaWYgKG5lZWRsZV9wYXJ0LnN0YXJ0ID09PSBwYXJ0LnN0YXJ0ICYmIG5lZWRsZV9wYXJ0LnN1YnN0ciA9PT0gcGFydC5zdWJzdHIpIHtcblx0ICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZiAocGFydC5sZW5ndGggPT0gMSB8fCBuZWVkbGVfcGFydC5sZW5ndGggPT0gMSkge1xuXHQgICAgICAgICAgY29udGludWU7XG5cdCAgICAgICAgfSAvLyBjaGVjayBmb3Igb3ZlcmxhcHBpbmcgcGFydHNcblx0ICAgICAgICAvLyBhID0gWyc6Oj0nLCc9PSddXG5cdCAgICAgICAgLy8gYiA9IFsnOjonLCc9PT0nXVxuXHQgICAgICAgIC8vIGEgPSBbJ3InLCdzbSddXG5cdCAgICAgICAgLy8gYiA9IFsncnMnLCdtJ11cblxuXG5cdCAgICAgICAgaWYgKHBhcnQuc3RhcnQgPCBuZWVkbGVfcGFydC5zdGFydCAmJiBwYXJ0LmVuZCA+IG5lZWRsZV9wYXJ0LnN0YXJ0KSB7XG5cdCAgICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZiAobmVlZGxlX3BhcnQuc3RhcnQgPCBwYXJ0LnN0YXJ0ICYmIG5lZWRsZV9wYXJ0LmVuZCA+IHBhcnQuc3RhcnQpIHtcblx0ICAgICAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH07XG5cblx0ICAgIGxldCBmaWx0ZXJlZCA9IHNlcS5wYXJ0cy5maWx0ZXIoZmlsdGVyKTtcblxuXHQgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA+IDApIHtcblx0ICAgICAgY29udGludWU7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblxuXHQgIHJldHVybiBmYWxzZTtcblx0fTtcblxuXHRjbGFzcyBTZXF1ZW5jZSB7XG5cdCAgY29uc3RydWN0b3IoKSB7XG5cdCAgICAvKiogQHR5cGUge1RTZXF1ZW5jZVBhcnRbXX0gKi9cblx0ICAgIHRoaXMucGFydHMgPSBbXTtcblx0ICAgIC8qKiBAdHlwZSB7c3RyaW5nW119ICovXG5cblx0ICAgIHRoaXMuc3Vic3RycyA9IFtdO1xuXHQgICAgdGhpcy5zdGFydCA9IDA7XG5cdCAgICB0aGlzLmVuZCA9IDA7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEBwYXJhbSB7VFNlcXVlbmNlUGFydHx1bmRlZmluZWR9IHBhcnRcblx0ICAgKi9cblxuXG5cdCAgYWRkKHBhcnQpIHtcblx0ICAgIGlmIChwYXJ0KSB7XG5cdCAgICAgIHRoaXMucGFydHMucHVzaChwYXJ0KTtcblx0ICAgICAgdGhpcy5zdWJzdHJzLnB1c2gocGFydC5zdWJzdHIpO1xuXHQgICAgICB0aGlzLnN0YXJ0ID0gTWF0aC5taW4ocGFydC5zdGFydCwgdGhpcy5zdGFydCk7XG5cdCAgICAgIHRoaXMuZW5kID0gTWF0aC5tYXgocGFydC5lbmQsIHRoaXMuZW5kKTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBsYXN0KCkge1xuXHQgICAgcmV0dXJuIHRoaXMucGFydHNbdGhpcy5wYXJ0cy5sZW5ndGggLSAxXTtcblx0ICB9XG5cblx0ICBsZW5ndGgoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5wYXJ0cy5sZW5ndGg7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvblxuXHQgICAqIEBwYXJhbSB7VFNlcXVlbmNlUGFydH0gbGFzdF9waWVjZVxuXHQgICAqL1xuXG5cblx0ICBjbG9uZShwb3NpdGlvbiwgbGFzdF9waWVjZSkge1xuXHQgICAgbGV0IGNsb25lID0gbmV3IFNlcXVlbmNlKCk7XG5cdCAgICBsZXQgcGFydHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMucGFydHMpKTtcblx0ICAgIGxldCBsYXN0X3BhcnQgPSBwYXJ0cy5wb3AoKTtcblxuXHQgICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG5cdCAgICAgIGNsb25lLmFkZChwYXJ0KTtcblx0ICAgIH1cblxuXHQgICAgbGV0IGxhc3Rfc3Vic3RyID0gbGFzdF9waWVjZS5zdWJzdHIuc3Vic3RyaW5nKDAsIHBvc2l0aW9uIC0gbGFzdF9wYXJ0LnN0YXJ0KTtcblx0ICAgIGxldCBjbG9uZV9sYXN0X2xlbiA9IGxhc3Rfc3Vic3RyLmxlbmd0aDtcblx0ICAgIGNsb25lLmFkZCh7XG5cdCAgICAgIHN0YXJ0OiBsYXN0X3BhcnQuc3RhcnQsXG5cdCAgICAgIGVuZDogbGFzdF9wYXJ0LnN0YXJ0ICsgY2xvbmVfbGFzdF9sZW4sXG5cdCAgICAgIGxlbmd0aDogY2xvbmVfbGFzdF9sZW4sXG5cdCAgICAgIHN1YnN0cjogbGFzdF9zdWJzdHJcblx0ICAgIH0pO1xuXHQgICAgcmV0dXJuIGNsb25lO1xuXHQgIH1cblxuXHR9XG5cdC8qKlxuXHQgKiBFeHBhbmQgYSByZWd1bGFyIGV4cHJlc3Npb24gcGF0dGVybiB0byBpbmNsdWRlIHVuaWNvZGUgdmFyaWFudHNcblx0ICogXHRlZyAvYS8gYmVjb21lcyAvYeKTkO+9geG6msOgw6HDouG6p+G6peG6q+G6qcOjxIHEg+G6seG6r+G6teG6s8inx6HDpMef4bqjw6XHu8eOyIHIg+G6oeG6reG6t+G4gcSF4rGlyZDJkUHikrbvvKHDgMOBw4LhuqbhuqThuqrhuqjDg8SAxILhurDhuq7hurThurLIpsegw4THnuG6osOFx7rHjciAyILhuqDhuqzhurbhuIDEhMi64rGvL1xuXHQgKlxuXHQgKiBJc3N1ZTpcblx0ICogIO+6iu+6iyBbICfvuoogPSBcXFxcdXtmZThhfScsICfvuosgPSBcXFxcdXtmZThifScgXVxuXHQgKlx0YmVjb21lczpcdNmK2ZTZitmUIFsgJ9mKID0gXFxcXHV7NjRhfScsICfZlCA9IFxcXFx1ezY1NH0nLCAn2YogPSBcXFxcdXs2NGF9JywgJ9mUID0gXFxcXHV7NjU0fScgXVxuXHQgKlxuXHQgKlx0xLDEsiA9IElJSiA9IOKFoUpcblx0ICpcblx0ICogXHQxLzIvNFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG5cdCAqIEByZXR1cm4ge3N0cmluZ3x1bmRlZmluZWR9XG5cdCAqL1xuXG5cblx0Y29uc3QgZ2V0UGF0dGVybiA9IHN0ciA9PiB7XG5cdCAgaW5pdGlhbGl6ZSgpO1xuXHQgIHN0ciA9IGFzY2lpZm9sZChzdHIpO1xuXHQgIGxldCBwYXR0ZXJuID0gJyc7XG5cdCAgbGV0IHNlcXVlbmNlcyA9IFtuZXcgU2VxdWVuY2UoKV07XG5cblx0ICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuXHQgICAgbGV0IHN1YnN0ciA9IHN0ci5zdWJzdHJpbmcoaSk7XG5cdCAgICBsZXQgbWF0Y2ggPSBzdWJzdHIubWF0Y2gobXVsdGlfY2hhcl9yZWcpO1xuXHQgICAgY29uc3QgY2hhciA9IHN0ci5zdWJzdHJpbmcoaSwgaSArIDEpO1xuXHQgICAgY29uc3QgbWF0Y2hfc3RyID0gbWF0Y2ggPyBtYXRjaFswXSA6IG51bGw7IC8vIGxvb3AgdGhyb3VnaCBzZXF1ZW5jZXNcblx0ICAgIC8vIGFkZCBlaXRoZXIgdGhlIGNoYXIgb3IgbXVsdGlfbWF0Y2hcblxuXHQgICAgbGV0IG92ZXJsYXBwaW5nID0gW107XG5cdCAgICBsZXQgYWRkZWRfdHlwZXMgPSBuZXcgU2V0KCk7XG5cblx0ICAgIGZvciAoY29uc3Qgc2VxdWVuY2Ugb2Ygc2VxdWVuY2VzKSB7XG5cdCAgICAgIGNvbnN0IGxhc3RfcGllY2UgPSBzZXF1ZW5jZS5sYXN0KCk7XG5cblx0ICAgICAgaWYgKCFsYXN0X3BpZWNlIHx8IGxhc3RfcGllY2UubGVuZ3RoID09IDEgfHwgbGFzdF9waWVjZS5lbmQgPD0gaSkge1xuXHQgICAgICAgIC8vIGlmIHdlIGhhdmUgYSBtdWx0aSBtYXRjaFxuXHQgICAgICAgIGlmIChtYXRjaF9zdHIpIHtcblx0ICAgICAgICAgIGNvbnN0IGxlbiA9IG1hdGNoX3N0ci5sZW5ndGg7XG5cdCAgICAgICAgICBzZXF1ZW5jZS5hZGQoe1xuXHQgICAgICAgICAgICBzdGFydDogaSxcblx0ICAgICAgICAgICAgZW5kOiBpICsgbGVuLFxuXHQgICAgICAgICAgICBsZW5ndGg6IGxlbixcblx0ICAgICAgICAgICAgc3Vic3RyOiBtYXRjaF9zdHJcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgYWRkZWRfdHlwZXMuYWRkKCcxJyk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHNlcXVlbmNlLmFkZCh7XG5cdCAgICAgICAgICAgIHN0YXJ0OiBpLFxuXHQgICAgICAgICAgICBlbmQ6IGkgKyAxLFxuXHQgICAgICAgICAgICBsZW5ndGg6IDEsXG5cdCAgICAgICAgICAgIHN1YnN0cjogY2hhclxuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgICBhZGRlZF90eXBlcy5hZGQoJzInKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSBpZiAobWF0Y2hfc3RyKSB7XG5cdCAgICAgICAgbGV0IGNsb25lID0gc2VxdWVuY2UuY2xvbmUoaSwgbGFzdF9waWVjZSk7XG5cdCAgICAgICAgY29uc3QgbGVuID0gbWF0Y2hfc3RyLmxlbmd0aDtcblx0ICAgICAgICBjbG9uZS5hZGQoe1xuXHQgICAgICAgICAgc3RhcnQ6IGksXG5cdCAgICAgICAgICBlbmQ6IGkgKyBsZW4sXG5cdCAgICAgICAgICBsZW5ndGg6IGxlbixcblx0ICAgICAgICAgIHN1YnN0cjogbWF0Y2hfc3RyXG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgb3ZlcmxhcHBpbmcucHVzaChjbG9uZSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgLy8gZG9uJ3QgYWRkIGNoYXJcblx0ICAgICAgICAvLyBhZGRpbmcgd291bGQgY3JlYXRlIGludmFsaWQgcGF0dGVybnM6IDIzNCA9PiBbMiwzNCw0XVxuXHQgICAgICAgIGFkZGVkX3R5cGVzLmFkZCgnMycpO1xuXHQgICAgICB9XG5cdCAgICB9IC8vIGlmIHdlIGhhdmUgb3ZlcmxhcHBpbmdcblxuXG5cdCAgICBpZiAob3ZlcmxhcHBpbmcubGVuZ3RoID4gMCkge1xuXHQgICAgICAvLyBbJ2lpJywnaWlpJ10gYmVmb3JlIFsnaScsJ2knLCdpaWknXVxuXHQgICAgICBvdmVybGFwcGluZyA9IG92ZXJsYXBwaW5nLnNvcnQoKGEsIGIpID0+IHtcblx0ICAgICAgICByZXR1cm4gYS5sZW5ndGgoKSAtIGIubGVuZ3RoKCk7XG5cdCAgICAgIH0pO1xuXG5cdCAgICAgIGZvciAobGV0IGNsb25lIG9mIG92ZXJsYXBwaW5nKSB7XG5cdCAgICAgICAgLy8gZG9uJ3QgYWRkIGlmIHdlIGFscmVhZHkgaGF2ZSBhbiBlcXVpdmFsZW50IHNlcXVlbmNlXG5cdCAgICAgICAgaWYgKGluU2VxdWVuY2VzKGNsb25lLCBzZXF1ZW5jZXMpKSB7XG5cdCAgICAgICAgICBjb250aW51ZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZXF1ZW5jZXMucHVzaChjbG9uZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICBjb250aW51ZTtcblx0ICAgIH0gLy8gaWYgd2UgaGF2ZW4ndCBkb25lIGFueXRoaW5nIHVuaXF1ZVxuXHQgICAgLy8gY2xlYW4gdXAgdGhlIHBhdHRlcm5zXG5cdCAgICAvLyBoZWxwcyBrZWVwIHBhdHRlcm5zIHNtYWxsZXJcblx0ICAgIC8vIGlmIHN0ciA9ICdy4oKo446nYWFyc3MnLCBwYXR0ZXJuIHdpbGwgYmUgNDQ2IGluc3RlYWQgb2YgNjU1XG5cblxuXHQgICAgaWYgKGkgPiAwICYmIGFkZGVkX3R5cGVzLnNpemUgPT0gMSAmJiAhYWRkZWRfdHlwZXMuaGFzKCczJykpIHtcblx0ICAgICAgcGF0dGVybiArPSBzZXF1ZW5jZXNUb1BhdHRlcm4oc2VxdWVuY2VzLCBmYWxzZSk7XG5cdCAgICAgIGxldCBuZXdfc2VxID0gbmV3IFNlcXVlbmNlKCk7XG5cdCAgICAgIGNvbnN0IG9sZF9zZXEgPSBzZXF1ZW5jZXNbMF07XG5cblx0ICAgICAgaWYgKG9sZF9zZXEpIHtcblx0ICAgICAgICBuZXdfc2VxLmFkZChvbGRfc2VxLmxhc3QoKSk7XG5cdCAgICAgIH1cblxuXHQgICAgICBzZXF1ZW5jZXMgPSBbbmV3X3NlcV07XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgcGF0dGVybiArPSBzZXF1ZW5jZXNUb1BhdHRlcm4oc2VxdWVuY2VzLCB0cnVlKTtcblx0ICByZXR1cm4gcGF0dGVybjtcblx0fTtcblxuXHQvKiEgc2lmdGVyLmpzIHwgaHR0cHM6Ly9naXRodWIuY29tL29yY2hpZGpzL3NpZnRlci5qcyB8IEFwYWNoZSBMaWNlbnNlICh2MikgKi9cblxuXHQvKipcblx0ICogQSBwcm9wZXJ0eSBnZXR0ZXIgcmVzb2x2aW5nIGRvdC1ub3RhdGlvblxuXHQgKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogICAgIFRoZSByb290IG9iamVjdCB0byBmZXRjaCBwcm9wZXJ0eSBvblxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICBuYW1lICAgIFRoZSBvcHRpb25hbGx5IGRvdHRlZCBwcm9wZXJ0eSBuYW1lIHRvIGZldGNoXG5cdCAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgVGhlIHJlc29sdmVkIHByb3BlcnR5IHZhbHVlXG5cdCAqL1xuXHRjb25zdCBnZXRBdHRyID0gKG9iaiwgbmFtZSkgPT4ge1xuXHQgIGlmICghb2JqKSByZXR1cm47XG5cdCAgcmV0dXJuIG9ialtuYW1lXTtcblx0fTtcblx0LyoqXG5cdCAqIEEgcHJvcGVydHkgZ2V0dGVyIHJlc29sdmluZyBkb3Qtbm90YXRpb25cblx0ICogQHBhcmFtICB7T2JqZWN0fSAgb2JqICAgICBUaGUgcm9vdCBvYmplY3QgdG8gZmV0Y2ggcHJvcGVydHkgb25cblx0ICogQHBhcmFtICB7U3RyaW5nfSAgbmFtZSAgICBUaGUgb3B0aW9uYWxseSBkb3R0ZWQgcHJvcGVydHkgbmFtZSB0byBmZXRjaFxuXHQgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgIFRoZSByZXNvbHZlZCBwcm9wZXJ0eSB2YWx1ZVxuXHQgKi9cblxuXHRjb25zdCBnZXRBdHRyTmVzdGluZyA9IChvYmosIG5hbWUpID0+IHtcblx0ICBpZiAoIW9iaikgcmV0dXJuO1xuXHQgIHZhciBwYXJ0LFxuXHQgICAgICBuYW1lcyA9IG5hbWUuc3BsaXQoXCIuXCIpO1xuXG5cdCAgd2hpbGUgKChwYXJ0ID0gbmFtZXMuc2hpZnQoKSkgJiYgKG9iaiA9IG9ialtwYXJ0XSkpO1xuXG5cdCAgcmV0dXJuIG9iajtcblx0fTtcblx0LyoqXG5cdCAqIENhbGN1bGF0ZXMgaG93IGNsb3NlIG9mIGEgbWF0Y2ggdGhlXG5cdCAqIGdpdmVuIHZhbHVlIGlzIGFnYWluc3QgYSBzZWFyY2ggdG9rZW4uXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IHNjb3JlVmFsdWUgPSAodmFsdWUsIHRva2VuLCB3ZWlnaHQpID0+IHtcblx0ICB2YXIgc2NvcmUsIHBvcztcblx0ICBpZiAoIXZhbHVlKSByZXR1cm4gMDtcblx0ICB2YWx1ZSA9IHZhbHVlICsgJyc7XG5cdCAgaWYgKHRva2VuLnJlZ2V4ID09IG51bGwpIHJldHVybiAwO1xuXHQgIHBvcyA9IHZhbHVlLnNlYXJjaCh0b2tlbi5yZWdleCk7XG5cdCAgaWYgKHBvcyA9PT0gLTEpIHJldHVybiAwO1xuXHQgIHNjb3JlID0gdG9rZW4uc3RyaW5nLmxlbmd0aCAvIHZhbHVlLmxlbmd0aDtcblx0ICBpZiAocG9zID09PSAwKSBzY29yZSArPSAwLjU7XG5cdCAgcmV0dXJuIHNjb3JlICogd2VpZ2h0O1xuXHR9O1xuXHQvKipcblx0ICogQ2FzdCBvYmplY3QgcHJvcGVydHkgdG8gYW4gYXJyYXkgaWYgaXQgZXhpc3RzIGFuZCBoYXMgYSB2YWx1ZVxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBwcm9wVG9BcnJheSA9IChvYmosIGtleSkgPT4ge1xuXHQgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuXHQgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHZhbHVlO1xuXG5cdCAgaWYgKHZhbHVlICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHQgICAgb2JqW2tleV0gPSBbdmFsdWVdO1xuXHQgIH1cblx0fTtcblx0LyoqXG5cdCAqIEl0ZXJhdGVzIG92ZXIgYXJyYXlzIGFuZCBoYXNoZXMuXG5cdCAqXG5cdCAqIGBgYFxuXHQgKiBpdGVyYXRlKHRoaXMuaXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGlkKSB7XG5cdCAqICAgIC8vIGludm9rZWQgZm9yIGVhY2ggaXRlbVxuXHQgKiB9KTtcblx0ICogYGBgXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGl0ZXJhdGUkMSA9IChvYmplY3QsIGNhbGxiYWNrKSA9PiB7XG5cdCAgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xuXHQgICAgb2JqZWN0LmZvckVhY2goY2FsbGJhY2spO1xuXHQgIH0gZWxzZSB7XG5cdCAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG5cdCAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHQgICAgICAgIGNhbGxiYWNrKG9iamVjdFtrZXldLCBrZXkpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXHRjb25zdCBjbXAgPSAoYSwgYikgPT4ge1xuXHQgIGlmICh0eXBlb2YgYSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGIgPT09ICdudW1iZXInKSB7XG5cdCAgICByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7XG5cdCAgfVxuXG5cdCAgYSA9IGFzY2lpZm9sZChhICsgJycpLnRvTG93ZXJDYXNlKCk7XG5cdCAgYiA9IGFzY2lpZm9sZChiICsgJycpLnRvTG93ZXJDYXNlKCk7XG5cdCAgaWYgKGEgPiBiKSByZXR1cm4gMTtcblx0ICBpZiAoYiA+IGEpIHJldHVybiAtMTtcblx0ICByZXR1cm4gMDtcblx0fTtcblxuXHQvKiEgc2lmdGVyLmpzIHwgaHR0cHM6Ly9naXRodWIuY29tL29yY2hpZGpzL3NpZnRlci5qcyB8IEFwYWNoZSBMaWNlbnNlICh2MikgKi9cblxuXHQvKipcblx0ICogc2lmdGVyLmpzXG5cdCAqIENvcHlyaWdodCAoYykgMjAxM+KAkzIwMjAgQnJpYW4gUmVhdmlzICYgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKiBAYXV0aG9yIEJyaWFuIFJlYXZpcyA8YnJpYW5AdGhpcmRyb3V0ZS5jb20+XG5cdCAqL1xuXG5cdGNsYXNzIFNpZnRlciB7XG5cdCAgLy8gW118e307XG5cblx0ICAvKipcblx0ICAgKiBUZXh0dWFsbHkgc2VhcmNoZXMgYXJyYXlzIGFuZCBoYXNoZXMgb2Ygb2JqZWN0c1xuXHQgICAqIGJ5IHByb3BlcnR5IChvciBtdWx0aXBsZSBwcm9wZXJ0aWVzKS4gRGVzaWduZWRcblx0ICAgKiBzcGVjaWZpY2FsbHkgZm9yIGF1dG9jb21wbGV0ZS5cblx0ICAgKlxuXHQgICAqL1xuXHQgIGNvbnN0cnVjdG9yKGl0ZW1zLCBzZXR0aW5ncykge1xuXHQgICAgdGhpcy5pdGVtcyA9IHZvaWQgMDtcblx0ICAgIHRoaXMuc2V0dGluZ3MgPSB2b2lkIDA7XG5cdCAgICB0aGlzLml0ZW1zID0gaXRlbXM7XG5cdCAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3MgfHwge1xuXHQgICAgICBkaWFjcml0aWNzOiB0cnVlXG5cdCAgICB9O1xuXHQgIH1cblxuXHQgIC8qKlxuXHQgICAqIFNwbGl0cyBhIHNlYXJjaCBzdHJpbmcgaW50byBhbiBhcnJheSBvZiBpbmRpdmlkdWFsXG5cdCAgICogcmVnZXhwcyB0byBiZSB1c2VkIHRvIG1hdGNoIHJlc3VsdHMuXG5cdCAgICpcblx0ICAgKi9cblx0ICB0b2tlbml6ZShxdWVyeSwgcmVzcGVjdF93b3JkX2JvdW5kYXJpZXMsIHdlaWdodHMpIHtcblx0ICAgIGlmICghcXVlcnkgfHwgIXF1ZXJ5Lmxlbmd0aCkgcmV0dXJuIFtdO1xuXHQgICAgY29uc3QgdG9rZW5zID0gW107XG5cdCAgICBjb25zdCB3b3JkcyA9IHF1ZXJ5LnNwbGl0KC9cXHMrLyk7XG5cdCAgICB2YXIgZmllbGRfcmVnZXg7XG5cblx0ICAgIGlmICh3ZWlnaHRzKSB7XG5cdCAgICAgIGZpZWxkX3JlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgT2JqZWN0LmtleXMod2VpZ2h0cykubWFwKGVzY2FwZV9yZWdleCkuam9pbignfCcpICsgJylcXDooLiopJCcpO1xuXHQgICAgfVxuXG5cdCAgICB3b3Jkcy5mb3JFYWNoKHdvcmQgPT4ge1xuXHQgICAgICBsZXQgZmllbGRfbWF0Y2g7XG5cdCAgICAgIGxldCBmaWVsZCA9IG51bGw7XG5cdCAgICAgIGxldCByZWdleCA9IG51bGw7IC8vIGxvb2sgZm9yIFwiZmllbGQ6cXVlcnlcIiB0b2tlbnNcblxuXHQgICAgICBpZiAoZmllbGRfcmVnZXggJiYgKGZpZWxkX21hdGNoID0gd29yZC5tYXRjaChmaWVsZF9yZWdleCkpKSB7XG5cdCAgICAgICAgZmllbGQgPSBmaWVsZF9tYXRjaFsxXTtcblx0ICAgICAgICB3b3JkID0gZmllbGRfbWF0Y2hbMl07XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAod29yZC5sZW5ndGggPiAwKSB7XG5cdCAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZGlhY3JpdGljcykge1xuXHQgICAgICAgICAgcmVnZXggPSBnZXRQYXR0ZXJuKHdvcmQpIHx8IG51bGw7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHJlZ2V4ID0gZXNjYXBlX3JlZ2V4KHdvcmQpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmIChyZWdleCAmJiByZXNwZWN0X3dvcmRfYm91bmRhcmllcykgcmVnZXggPSBcIlxcXFxiXCIgKyByZWdleDtcblx0ICAgICAgfVxuXG5cdCAgICAgIHRva2Vucy5wdXNoKHtcblx0ICAgICAgICBzdHJpbmc6IHdvcmQsXG5cdCAgICAgICAgcmVnZXg6IHJlZ2V4ID8gbmV3IFJlZ0V4cChyZWdleCwgJ2l1JykgOiBudWxsLFxuXHQgICAgICAgIGZpZWxkOiBmaWVsZFxuXHQgICAgICB9KTtcblx0ICAgIH0pO1xuXHQgICAgcmV0dXJuIHRva2Vucztcblx0ICB9XG5cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gYmUgdXNlZCB0byBzY29yZSBpbmRpdmlkdWFsIHJlc3VsdHMuXG5cdCAgICpcblx0ICAgKiBHb29kIG1hdGNoZXMgd2lsbCBoYXZlIGEgaGlnaGVyIHNjb3JlIHRoYW4gcG9vciBtYXRjaGVzLlxuXHQgICAqIElmIGFuIGl0ZW0gaXMgbm90IGEgbWF0Y2gsIDAgd2lsbCBiZSByZXR1cm5lZCBieSB0aGUgZnVuY3Rpb24uXG5cdCAgICpcblx0ICAgKiBAcmV0dXJucyB7VC5TY29yZUZufVxuXHQgICAqL1xuXHQgIGdldFNjb3JlRnVuY3Rpb24ocXVlcnksIG9wdGlvbnMpIHtcblx0ICAgIHZhciBzZWFyY2ggPSB0aGlzLnByZXBhcmVTZWFyY2gocXVlcnksIG9wdGlvbnMpO1xuXHQgICAgcmV0dXJuIHRoaXMuX2dldFNjb3JlRnVuY3Rpb24oc2VhcmNoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQHJldHVybnMge1QuU2NvcmVGbn1cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBfZ2V0U2NvcmVGdW5jdGlvbihzZWFyY2gpIHtcblx0ICAgIGNvbnN0IHRva2VucyA9IHNlYXJjaC50b2tlbnMsXG5cdCAgICAgICAgICB0b2tlbl9jb3VudCA9IHRva2Vucy5sZW5ndGg7XG5cblx0ICAgIGlmICghdG9rZW5fY291bnQpIHtcblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gMDtcblx0ICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgY29uc3QgZmllbGRzID0gc2VhcmNoLm9wdGlvbnMuZmllbGRzLFxuXHQgICAgICAgICAgd2VpZ2h0cyA9IHNlYXJjaC53ZWlnaHRzLFxuXHQgICAgICAgICAgZmllbGRfY291bnQgPSBmaWVsZHMubGVuZ3RoLFxuXHQgICAgICAgICAgZ2V0QXR0ckZuID0gc2VhcmNoLmdldEF0dHJGbjtcblxuXHQgICAgaWYgKCFmaWVsZF9jb3VudCkge1xuXHQgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiAxO1xuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBDYWxjdWxhdGVzIHRoZSBzY29yZSBvZiBhbiBvYmplY3Rcblx0ICAgICAqIGFnYWluc3QgdGhlIHNlYXJjaCBxdWVyeS5cblx0ICAgICAqXG5cdCAgICAgKi9cblxuXG5cdCAgICBjb25zdCBzY29yZU9iamVjdCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKGZpZWxkX2NvdW50ID09PSAxKSB7XG5cdCAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0b2tlbiwgZGF0YSkge1xuXHQgICAgICAgICAgY29uc3QgZmllbGQgPSBmaWVsZHNbMF0uZmllbGQ7XG5cdCAgICAgICAgICByZXR1cm4gc2NvcmVWYWx1ZShnZXRBdHRyRm4oZGF0YSwgZmllbGQpLCB0b2tlbiwgd2VpZ2h0c1tmaWVsZF0gfHwgMSk7XG5cdCAgICAgICAgfTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiAodG9rZW4sIGRhdGEpIHtcblx0ICAgICAgICB2YXIgc3VtID0gMDsgLy8gaXMgdGhlIHRva2VuIHNwZWNpZmljIHRvIGEgZmllbGQ/XG5cblx0ICAgICAgICBpZiAodG9rZW4uZmllbGQpIHtcblx0ICAgICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0QXR0ckZuKGRhdGEsIHRva2VuLmZpZWxkKTtcblxuXHQgICAgICAgICAgaWYgKCF0b2tlbi5yZWdleCAmJiB2YWx1ZSkge1xuXHQgICAgICAgICAgICBzdW0gKz0gMSAvIGZpZWxkX2NvdW50O1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgc3VtICs9IHNjb3JlVmFsdWUodmFsdWUsIHRva2VuLCAxKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgaXRlcmF0ZSQxKHdlaWdodHMsICh3ZWlnaHQsIGZpZWxkKSA9PiB7XG5cdCAgICAgICAgICAgIHN1bSArPSBzY29yZVZhbHVlKGdldEF0dHJGbihkYXRhLCBmaWVsZCksIHRva2VuLCB3ZWlnaHQpO1xuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHN1bSAvIGZpZWxkX2NvdW50O1xuXHQgICAgICB9O1xuXHQgICAgfSgpO1xuXG5cdCAgICBpZiAodG9rZW5fY291bnQgPT09IDEpIHtcblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhKSB7XG5cdCAgICAgICAgcmV0dXJuIHNjb3JlT2JqZWN0KHRva2Vuc1swXSwgZGF0YSk7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cblx0ICAgIGlmIChzZWFyY2gub3B0aW9ucy5jb25qdW5jdGlvbiA9PT0gJ2FuZCcpIHtcblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhKSB7XG5cdCAgICAgICAgdmFyIHNjb3JlLFxuXHQgICAgICAgICAgICBzdW0gPSAwO1xuXG5cdCAgICAgICAgZm9yIChsZXQgdG9rZW4gb2YgdG9rZW5zKSB7XG5cdCAgICAgICAgICBzY29yZSA9IHNjb3JlT2JqZWN0KHRva2VuLCBkYXRhKTtcblx0ICAgICAgICAgIGlmIChzY29yZSA8PSAwKSByZXR1cm4gMDtcblx0ICAgICAgICAgIHN1bSArPSBzY29yZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gc3VtIC8gdG9rZW5fY291bnQ7XG5cdCAgICAgIH07XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcblx0ICAgICAgICB2YXIgc3VtID0gMDtcblx0ICAgICAgICBpdGVyYXRlJDEodG9rZW5zLCB0b2tlbiA9PiB7XG5cdCAgICAgICAgICBzdW0gKz0gc2NvcmVPYmplY3QodG9rZW4sIGRhdGEpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIHJldHVybiBzdW0gLyB0b2tlbl9jb3VudDtcblx0ICAgICAgfTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBjb21wYXJlIHR3b1xuXHQgICAqIHJlc3VsdHMsIGZvciBzb3J0aW5nIHB1cnBvc2VzLiBJZiBubyBzb3J0aW5nIHNob3VsZFxuXHQgICAqIGJlIHBlcmZvcm1lZCwgYG51bGxgIHdpbGwgYmUgcmV0dXJuZWQuXG5cdCAgICpcblx0ICAgKiBAcmV0dXJuIGZ1bmN0aW9uKGEsYilcblx0ICAgKi9cblx0ICBnZXRTb3J0RnVuY3Rpb24ocXVlcnksIG9wdGlvbnMpIHtcblx0ICAgIHZhciBzZWFyY2ggPSB0aGlzLnByZXBhcmVTZWFyY2gocXVlcnksIG9wdGlvbnMpO1xuXHQgICAgcmV0dXJuIHRoaXMuX2dldFNvcnRGdW5jdGlvbihzZWFyY2gpO1xuXHQgIH1cblxuXHQgIF9nZXRTb3J0RnVuY3Rpb24oc2VhcmNoKSB7XG5cdCAgICB2YXIgaW1wbGljaXRfc2NvcmUsXG5cdCAgICAgICAgc29ydF9mbGRzID0gW107XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcyxcblx0ICAgICAgICAgIG9wdGlvbnMgPSBzZWFyY2gub3B0aW9ucyxcblx0ICAgICAgICAgIHNvcnQgPSAhc2VhcmNoLnF1ZXJ5ICYmIG9wdGlvbnMuc29ydF9lbXB0eSA/IG9wdGlvbnMuc29ydF9lbXB0eSA6IG9wdGlvbnMuc29ydDtcblxuXHQgICAgaWYgKHR5cGVvZiBzb3J0ID09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgcmV0dXJuIHNvcnQuYmluZCh0aGlzKTtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogRmV0Y2hlcyB0aGUgc3BlY2lmaWVkIHNvcnQgZmllbGQgdmFsdWVcblx0ICAgICAqIGZyb20gYSBzZWFyY2ggcmVzdWx0IGl0ZW0uXG5cdCAgICAgKlxuXHQgICAgICovXG5cblxuXHQgICAgY29uc3QgZ2V0X2ZpZWxkID0gZnVuY3Rpb24gZ2V0X2ZpZWxkKG5hbWUsIHJlc3VsdCkge1xuXHQgICAgICBpZiAobmFtZSA9PT0gJyRzY29yZScpIHJldHVybiByZXN1bHQuc2NvcmU7XG5cdCAgICAgIHJldHVybiBzZWFyY2guZ2V0QXR0ckZuKHNlbGYuaXRlbXNbcmVzdWx0LmlkXSwgbmFtZSk7XG5cdCAgICB9OyAvLyBwYXJzZSBvcHRpb25zXG5cblxuXHQgICAgaWYgKHNvcnQpIHtcblx0ICAgICAgZm9yIChsZXQgcyBvZiBzb3J0KSB7XG5cdCAgICAgICAgaWYgKHNlYXJjaC5xdWVyeSB8fCBzLmZpZWxkICE9PSAnJHNjb3JlJykge1xuXHQgICAgICAgICAgc29ydF9mbGRzLnB1c2gocyk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9IC8vIHRoZSBcIiRzY29yZVwiIGZpZWxkIGlzIGltcGxpZWQgdG8gYmUgdGhlIHByaW1hcnlcblx0ICAgIC8vIHNvcnQgZmllbGQsIHVubGVzcyBpdCdzIG1hbnVhbGx5IHNwZWNpZmllZFxuXG5cblx0ICAgIGlmIChzZWFyY2gucXVlcnkpIHtcblx0ICAgICAgaW1wbGljaXRfc2NvcmUgPSB0cnVlO1xuXG5cdCAgICAgIGZvciAobGV0IGZsZCBvZiBzb3J0X2ZsZHMpIHtcblx0ICAgICAgICBpZiAoZmxkLmZpZWxkID09PSAnJHNjb3JlJykge1xuXHQgICAgICAgICAgaW1wbGljaXRfc2NvcmUgPSBmYWxzZTtcblx0ICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChpbXBsaWNpdF9zY29yZSkge1xuXHQgICAgICAgIHNvcnRfZmxkcy51bnNoaWZ0KHtcblx0ICAgICAgICAgIGZpZWxkOiAnJHNjb3JlJyxcblx0ICAgICAgICAgIGRpcmVjdGlvbjogJ2Rlc2MnXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0gLy8gd2l0aG91dCBhIHNlYXJjaC5xdWVyeSwgYWxsIGl0ZW1zIHdpbGwgaGF2ZSB0aGUgc2FtZSBzY29yZVxuXG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzb3J0X2ZsZHMgPSBzb3J0X2ZsZHMuZmlsdGVyKGZsZCA9PiBmbGQuZmllbGQgIT09ICckc2NvcmUnKTtcblx0ICAgIH0gLy8gYnVpbGQgZnVuY3Rpb25cblxuXG5cdCAgICBjb25zdCBzb3J0X2ZsZHNfY291bnQgPSBzb3J0X2ZsZHMubGVuZ3RoO1xuXG5cdCAgICBpZiAoIXNvcnRfZmxkc19jb3VudCkge1xuXHQgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG5cdCAgICAgIHZhciByZXN1bHQsIGZpZWxkO1xuXG5cdCAgICAgIGZvciAobGV0IHNvcnRfZmxkIG9mIHNvcnRfZmxkcykge1xuXHQgICAgICAgIGZpZWxkID0gc29ydF9mbGQuZmllbGQ7XG5cdCAgICAgICAgbGV0IG11bHRpcGxpZXIgPSBzb3J0X2ZsZC5kaXJlY3Rpb24gPT09ICdkZXNjJyA/IC0xIDogMTtcblx0ICAgICAgICByZXN1bHQgPSBtdWx0aXBsaWVyICogY21wKGdldF9maWVsZChmaWVsZCwgYSksIGdldF9maWVsZChmaWVsZCwgYikpO1xuXHQgICAgICAgIGlmIChyZXN1bHQpIHJldHVybiByZXN1bHQ7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gMDtcblx0ICAgIH07XG5cdCAgfVxuXG5cdCAgLyoqXG5cdCAgICogUGFyc2VzIGEgc2VhcmNoIHF1ZXJ5IGFuZCByZXR1cm5zIGFuIG9iamVjdFxuXHQgICAqIHdpdGggdG9rZW5zIGFuZCBmaWVsZHMgcmVhZHkgdG8gYmUgcG9wdWxhdGVkXG5cdCAgICogd2l0aCByZXN1bHRzLlxuXHQgICAqXG5cdCAgICovXG5cdCAgcHJlcGFyZVNlYXJjaChxdWVyeSwgb3B0c1VzZXIpIHtcblx0ICAgIGNvbnN0IHdlaWdodHMgPSB7fTtcblx0ICAgIHZhciBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0c1VzZXIpO1xuXHQgICAgcHJvcFRvQXJyYXkob3B0aW9ucywgJ3NvcnQnKTtcblx0ICAgIHByb3BUb0FycmF5KG9wdGlvbnMsICdzb3J0X2VtcHR5Jyk7IC8vIGNvbnZlcnQgZmllbGRzIHRvIG5ldyBmb3JtYXRcblxuXHQgICAgaWYgKG9wdGlvbnMuZmllbGRzKSB7XG5cdCAgICAgIHByb3BUb0FycmF5KG9wdGlvbnMsICdmaWVsZHMnKTtcblx0ICAgICAgY29uc3QgZmllbGRzID0gW107XG5cdCAgICAgIG9wdGlvbnMuZmllbGRzLmZvckVhY2goZmllbGQgPT4ge1xuXHQgICAgICAgIGlmICh0eXBlb2YgZmllbGQgPT0gJ3N0cmluZycpIHtcblx0ICAgICAgICAgIGZpZWxkID0ge1xuXHQgICAgICAgICAgICBmaWVsZDogZmllbGQsXG5cdCAgICAgICAgICAgIHdlaWdodDogMVxuXHQgICAgICAgICAgfTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBmaWVsZHMucHVzaChmaWVsZCk7XG5cdCAgICAgICAgd2VpZ2h0c1tmaWVsZC5maWVsZF0gPSAnd2VpZ2h0JyBpbiBmaWVsZCA/IGZpZWxkLndlaWdodCA6IDE7XG5cdCAgICAgIH0pO1xuXHQgICAgICBvcHRpb25zLmZpZWxkcyA9IGZpZWxkcztcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgb3B0aW9uczogb3B0aW9ucyxcblx0ICAgICAgcXVlcnk6IHF1ZXJ5LnRvTG93ZXJDYXNlKCkudHJpbSgpLFxuXHQgICAgICB0b2tlbnM6IHRoaXMudG9rZW5pemUocXVlcnksIG9wdGlvbnMucmVzcGVjdF93b3JkX2JvdW5kYXJpZXMsIHdlaWdodHMpLFxuXHQgICAgICB0b3RhbDogMCxcblx0ICAgICAgaXRlbXM6IFtdLFxuXHQgICAgICB3ZWlnaHRzOiB3ZWlnaHRzLFxuXHQgICAgICBnZXRBdHRyRm46IG9wdGlvbnMubmVzdGluZyA/IGdldEF0dHJOZXN0aW5nIDogZ2V0QXR0clxuXHQgICAgfTtcblx0ICB9XG5cblx0ICAvKipcblx0ICAgKiBTZWFyY2hlcyB0aHJvdWdoIGFsbCBpdGVtcyBhbmQgcmV0dXJucyBhIHNvcnRlZCBhcnJheSBvZiBtYXRjaGVzLlxuXHQgICAqXG5cdCAgICovXG5cdCAgc2VhcmNoKHF1ZXJ5LCBvcHRpb25zKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXMsXG5cdCAgICAgICAgc2NvcmUsXG5cdCAgICAgICAgc2VhcmNoO1xuXHQgICAgc2VhcmNoID0gdGhpcy5wcmVwYXJlU2VhcmNoKHF1ZXJ5LCBvcHRpb25zKTtcblx0ICAgIG9wdGlvbnMgPSBzZWFyY2gub3B0aW9ucztcblx0ICAgIHF1ZXJ5ID0gc2VhcmNoLnF1ZXJ5OyAvLyBnZW5lcmF0ZSByZXN1bHQgc2NvcmluZyBmdW5jdGlvblxuXG5cdCAgICBjb25zdCBmbl9zY29yZSA9IG9wdGlvbnMuc2NvcmUgfHwgc2VsZi5fZ2V0U2NvcmVGdW5jdGlvbihzZWFyY2gpOyAvLyBwZXJmb3JtIHNlYXJjaCBhbmQgc29ydFxuXG5cblx0ICAgIGlmIChxdWVyeS5sZW5ndGgpIHtcblx0ICAgICAgaXRlcmF0ZSQxKHNlbGYuaXRlbXMsIChpdGVtLCBpZCkgPT4ge1xuXHQgICAgICAgIHNjb3JlID0gZm5fc2NvcmUoaXRlbSk7XG5cblx0ICAgICAgICBpZiAob3B0aW9ucy5maWx0ZXIgPT09IGZhbHNlIHx8IHNjb3JlID4gMCkge1xuXHQgICAgICAgICAgc2VhcmNoLml0ZW1zLnB1c2goe1xuXHQgICAgICAgICAgICAnc2NvcmUnOiBzY29yZSxcblx0ICAgICAgICAgICAgJ2lkJzogaWRcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBpdGVyYXRlJDEoc2VsZi5pdGVtcywgKF8sIGlkKSA9PiB7XG5cdCAgICAgICAgc2VhcmNoLml0ZW1zLnB1c2goe1xuXHQgICAgICAgICAgJ3Njb3JlJzogMSxcblx0ICAgICAgICAgICdpZCc6IGlkXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICBjb25zdCBmbl9zb3J0ID0gc2VsZi5fZ2V0U29ydEZ1bmN0aW9uKHNlYXJjaCk7XG5cblx0ICAgIGlmIChmbl9zb3J0KSBzZWFyY2guaXRlbXMuc29ydChmbl9zb3J0KTsgLy8gYXBwbHkgbGltaXRzXG5cblx0ICAgIHNlYXJjaC50b3RhbCA9IHNlYXJjaC5pdGVtcy5sZW5ndGg7XG5cblx0ICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5saW1pdCA9PT0gJ251bWJlcicpIHtcblx0ICAgICAgc2VhcmNoLml0ZW1zID0gc2VhcmNoLml0ZW1zLnNsaWNlKDAsIG9wdGlvbnMubGltaXQpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gc2VhcmNoO1xuXHQgIH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEl0ZXJhdGVzIG92ZXIgYXJyYXlzIGFuZCBoYXNoZXMuXG5cdCAqXG5cdCAqIGBgYFxuXHQgKiBpdGVyYXRlKHRoaXMuaXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGlkKSB7XG5cdCAqICAgIC8vIGludm9rZWQgZm9yIGVhY2ggaXRlbVxuXHQgKiB9KTtcblx0ICogYGBgXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGl0ZXJhdGUgPSAob2JqZWN0LCBjYWxsYmFjaykgPT4ge1xuXHQgIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcblx0ICAgIG9iamVjdC5mb3JFYWNoKGNhbGxiYWNrKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuXHQgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcblx0ICAgICAgICBjYWxsYmFjayhvYmplY3Rba2V5XSwga2V5KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0fTtcblxuXHQvKipcblx0ICogUmV0dXJuIGEgZG9tIGVsZW1lbnQgZnJvbSBlaXRoZXIgYSBkb20gcXVlcnkgc3RyaW5nLCBqUXVlcnkgb2JqZWN0LCBhIGRvbSBlbGVtZW50IG9yIGh0bWwgc3RyaW5nXG5cdCAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5NDE0My9jcmVhdGluZy1hLW5ldy1kb20tZWxlbWVudC1mcm9tLWFuLWh0bWwtc3RyaW5nLXVzaW5nLWJ1aWx0LWluLWRvbS1tZXRob2RzLW9yLXByby8zNTM4NTUxOCMzNTM4NTUxOFxuXHQgKlxuXHQgKiBwYXJhbSBxdWVyeSBzaG91bGQgYmUge31cblx0ICovXG5cblx0Y29uc3QgZ2V0RG9tID0gcXVlcnkgPT4ge1xuXHQgIGlmIChxdWVyeS5qcXVlcnkpIHtcblx0ICAgIHJldHVybiBxdWVyeVswXTtcblx0ICB9XG5cblx0ICBpZiAocXVlcnkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuXHQgICAgcmV0dXJuIHF1ZXJ5O1xuXHQgIH1cblxuXHQgIGlmIChpc0h0bWxTdHJpbmcocXVlcnkpKSB7XG5cdCAgICB2YXIgdHBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcblx0ICAgIHRwbC5pbm5lckhUTUwgPSBxdWVyeS50cmltKCk7IC8vIE5ldmVyIHJldHVybiBhIHRleHQgbm9kZSBvZiB3aGl0ZXNwYWNlIGFzIHRoZSByZXN1bHRcblxuXHQgICAgcmV0dXJuIHRwbC5jb250ZW50LmZpcnN0Q2hpbGQ7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocXVlcnkpO1xuXHR9O1xuXHRjb25zdCBpc0h0bWxTdHJpbmcgPSBhcmcgPT4ge1xuXHQgIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJyAmJiBhcmcuaW5kZXhPZignPCcpID4gLTEpIHtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblxuXHQgIHJldHVybiBmYWxzZTtcblx0fTtcblx0Y29uc3QgZXNjYXBlUXVlcnkgPSBxdWVyeSA9PiB7XG5cdCAgcmV0dXJuIHF1ZXJ5LnJlcGxhY2UoL1snXCJcXFxcXS9nLCAnXFxcXCQmJyk7XG5cdH07XG5cdC8qKlxuXHQgKiBEaXNwYXRjaCBhbiBldmVudFxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCB0cmlnZ2VyRXZlbnQgPSAoZG9tX2VsLCBldmVudF9uYW1lKSA9PiB7XG5cdCAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0ICBldmVudC5pbml0RXZlbnQoZXZlbnRfbmFtZSwgdHJ1ZSwgZmFsc2UpO1xuXHQgIGRvbV9lbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0fTtcblx0LyoqXG5cdCAqIEFwcGx5IENTUyBydWxlcyB0byBhIGRvbSBlbGVtZW50XG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGFwcGx5Q1NTID0gKGRvbV9lbCwgY3NzKSA9PiB7XG5cdCAgT2JqZWN0LmFzc2lnbihkb21fZWwuc3R5bGUsIGNzcyk7XG5cdH07XG5cdC8qKlxuXHQgKiBBZGQgY3NzIGNsYXNzZXNcblx0ICpcblx0ICovXG5cblx0Y29uc3QgYWRkQ2xhc3NlcyA9IChlbG10cywgLi4uY2xhc3NlcykgPT4ge1xuXHQgIHZhciBub3JtX2NsYXNzZXMgPSBjbGFzc2VzQXJyYXkoY2xhc3Nlcyk7XG5cdCAgZWxtdHMgPSBjYXN0QXNBcnJheShlbG10cyk7XG5cdCAgZWxtdHMubWFwKGVsID0+IHtcblx0ICAgIG5vcm1fY2xhc3Nlcy5tYXAoY2xzID0+IHtcblx0ICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbHMpO1xuXHQgICAgfSk7XG5cdCAgfSk7XG5cdH07XG5cdC8qKlxuXHQgKiBSZW1vdmUgY3NzIGNsYXNzZXNcblx0ICpcblx0ICovXG5cblx0Y29uc3QgcmVtb3ZlQ2xhc3NlcyA9IChlbG10cywgLi4uY2xhc3NlcykgPT4ge1xuXHQgIHZhciBub3JtX2NsYXNzZXMgPSBjbGFzc2VzQXJyYXkoY2xhc3Nlcyk7XG5cdCAgZWxtdHMgPSBjYXN0QXNBcnJheShlbG10cyk7XG5cdCAgZWxtdHMubWFwKGVsID0+IHtcblx0ICAgIG5vcm1fY2xhc3Nlcy5tYXAoY2xzID0+IHtcblx0ICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuXHQgICAgfSk7XG5cdCAgfSk7XG5cdH07XG5cdC8qKlxuXHQgKiBSZXR1cm4gYXJndW1lbnRzXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGNsYXNzZXNBcnJheSA9IGFyZ3MgPT4ge1xuXHQgIHZhciBjbGFzc2VzID0gW107XG5cdCAgaXRlcmF0ZShhcmdzLCBfY2xhc3NlcyA9PiB7XG5cdCAgICBpZiAodHlwZW9mIF9jbGFzc2VzID09PSAnc3RyaW5nJykge1xuXHQgICAgICBfY2xhc3NlcyA9IF9jbGFzc2VzLnRyaW0oKS5zcGxpdCgvW1xcMTFcXDEyXFwxNFxcMTVcXDQwXS8pO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoQXJyYXkuaXNBcnJheShfY2xhc3NlcykpIHtcblx0ICAgICAgY2xhc3NlcyA9IGNsYXNzZXMuY29uY2F0KF9jbGFzc2VzKTtcblx0ICAgIH1cblx0ICB9KTtcblx0ICByZXR1cm4gY2xhc3Nlcy5maWx0ZXIoQm9vbGVhbik7XG5cdH07XG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gYXJyYXkgZnJvbSBhcmcgaWYgaXQncyBub3QgYWxyZWFkeSBhbiBhcnJheVxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBjYXN0QXNBcnJheSA9IGFyZyA9PiB7XG5cdCAgaWYgKCFBcnJheS5pc0FycmF5KGFyZykpIHtcblx0ICAgIGFyZyA9IFthcmddO1xuXHQgIH1cblxuXHQgIHJldHVybiBhcmc7XG5cdH07XG5cdC8qKlxuXHQgKiBHZXQgdGhlIGNsb3Nlc3Qgbm9kZSB0byB0aGUgZXZ0LnRhcmdldCBtYXRjaGluZyB0aGUgc2VsZWN0b3Jcblx0ICogU3RvcHMgYXQgd3JhcHBlclxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBwYXJlbnRNYXRjaCA9ICh0YXJnZXQsIHNlbGVjdG9yLCB3cmFwcGVyKSA9PiB7XG5cdCAgaWYgKHdyYXBwZXIgJiYgIXdyYXBwZXIuY29udGFpbnModGFyZ2V0KSkge1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblxuXHQgIHdoaWxlICh0YXJnZXQgJiYgdGFyZ2V0Lm1hdGNoZXMpIHtcblx0ICAgIGlmICh0YXJnZXQubWF0Y2hlcyhzZWxlY3RvcikpIHtcblx0ICAgICAgcmV0dXJuIHRhcmdldDtcblx0ICAgIH1cblxuXHQgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cdCAgfVxuXHR9O1xuXHQvKipcblx0ICogR2V0IHRoZSBmaXJzdCBvciBsYXN0IGl0ZW0gZnJvbSBhbiBhcnJheVxuXHQgKlxuXHQgKiA+IDAgLSByaWdodCAobGFzdClcblx0ICogPD0gMCAtIGxlZnQgKGZpcnN0KVxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBnZXRUYWlsID0gKGxpc3QsIGRpcmVjdGlvbiA9IDApID0+IHtcblx0ICBpZiAoZGlyZWN0aW9uID4gMCkge1xuXHQgICAgcmV0dXJuIGxpc3RbbGlzdC5sZW5ndGggLSAxXTtcblx0ICB9XG5cblx0ICByZXR1cm4gbGlzdFswXTtcblx0fTtcblx0LyoqXG5cdCAqIFJldHVybiB0cnVlIGlmIGFuIG9iamVjdCBpcyBlbXB0eVxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBpc0VtcHR5T2JqZWN0ID0gb2JqID0+IHtcblx0ICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG5cdH07XG5cdC8qKlxuXHQgKiBHZXQgdGhlIGluZGV4IG9mIGFuIGVsZW1lbnQgYW1vbmdzdCBzaWJsaW5nIG5vZGVzIG9mIHRoZSBzYW1lIHR5cGVcblx0ICpcblx0ICovXG5cblx0Y29uc3Qgbm9kZUluZGV4ID0gKGVsLCBhbW9uZ3N0KSA9PiB7XG5cdCAgaWYgKCFlbCkgcmV0dXJuIC0xO1xuXHQgIGFtb25nc3QgPSBhbW9uZ3N0IHx8IGVsLm5vZGVOYW1lO1xuXHQgIHZhciBpID0gMDtcblxuXHQgIHdoaWxlIChlbCA9IGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHtcblx0ICAgIGlmIChlbC5tYXRjaGVzKGFtb25nc3QpKSB7XG5cdCAgICAgIGkrKztcblx0ICAgIH1cblx0ICB9XG5cblx0ICByZXR1cm4gaTtcblx0fTtcblx0LyoqXG5cdCAqIFNldCBhdHRyaWJ1dGVzIG9mIGFuIGVsZW1lbnRcblx0ICpcblx0ICovXG5cblx0Y29uc3Qgc2V0QXR0ciA9IChlbCwgYXR0cnMpID0+IHtcblx0ICBpdGVyYXRlKGF0dHJzLCAodmFsLCBhdHRyKSA9PiB7XG5cdCAgICBpZiAodmFsID09IG51bGwpIHtcblx0ICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHIsICcnICsgdmFsKTtcblx0ICAgIH1cblx0ICB9KTtcblx0fTtcblx0LyoqXG5cdCAqIFJlcGxhY2UgYSBub2RlXG5cdCAqL1xuXG5cdGNvbnN0IHJlcGxhY2VOb2RlID0gKGV4aXN0aW5nLCByZXBsYWNlbWVudCkgPT4ge1xuXHQgIGlmIChleGlzdGluZy5wYXJlbnROb2RlKSBleGlzdGluZy5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChyZXBsYWNlbWVudCwgZXhpc3RpbmcpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBoaWdobGlnaHQgdjMgfCBNSVQgbGljZW5zZSB8IEpvaGFubiBCdXJrYXJkIDxqYkBlYWlvLmNvbT5cblx0ICogSGlnaGxpZ2h0cyBhcmJpdHJhcnkgdGVybXMgaW4gYSBub2RlLlxuXHQgKlxuXHQgKiAtIE1vZGlmaWVkIGJ5IE1hcnNoYWwgPGJlYXRnYXRlc0BnbWFpbC5jb20+IDIwMTEtNi0yNCAoYWRkZWQgcmVnZXgpXG5cdCAqIC0gTW9kaWZpZWQgYnkgQnJpYW4gUmVhdmlzIDxicmlhbkB0aGlyZHJvdXRlLmNvbT4gMjAxMi04LTI3IChjbGVhbnVwKVxuXHQgKi9cblx0Y29uc3QgaGlnaGxpZ2h0ID0gKGVsZW1lbnQsIHJlZ2V4KSA9PiB7XG5cdCAgaWYgKHJlZ2V4ID09PSBudWxsKSByZXR1cm47IC8vIGNvbnZldCBzdHJpbmcgdG8gcmVnZXhcblxuXHQgIGlmICh0eXBlb2YgcmVnZXggPT09ICdzdHJpbmcnKSB7XG5cdCAgICBpZiAoIXJlZ2V4Lmxlbmd0aCkgcmV0dXJuO1xuXHQgICAgcmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4LCAnaScpO1xuXHQgIH0gLy8gV3JhcCBtYXRjaGluZyBwYXJ0IG9mIHRleHQgbm9kZSB3aXRoIGhpZ2hsaWdodGluZyA8c3Bhbj4sIGUuZy5cblx0ICAvLyBTb2NjZXIgIC0+ICA8c3BhbiBjbGFzcz1cImhpZ2hsaWdodFwiPlNvYzwvc3Bhbj5jZXIgIGZvciByZWdleCA9IC9zb2MvaVxuXG5cblx0ICBjb25zdCBoaWdobGlnaHRUZXh0ID0gbm9kZSA9PiB7XG5cdCAgICB2YXIgbWF0Y2ggPSBub2RlLmRhdGEubWF0Y2gocmVnZXgpO1xuXG5cdCAgICBpZiAobWF0Y2ggJiYgbm9kZS5kYXRhLmxlbmd0aCA+IDApIHtcblx0ICAgICAgdmFyIHNwYW5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHQgICAgICBzcGFubm9kZS5jbGFzc05hbWUgPSAnaGlnaGxpZ2h0Jztcblx0ICAgICAgdmFyIG1pZGRsZWJpdCA9IG5vZGUuc3BsaXRUZXh0KG1hdGNoLmluZGV4KTtcblx0ICAgICAgbWlkZGxlYml0LnNwbGl0VGV4dChtYXRjaFswXS5sZW5ndGgpO1xuXHQgICAgICB2YXIgbWlkZGxlY2xvbmUgPSBtaWRkbGViaXQuY2xvbmVOb2RlKHRydWUpO1xuXHQgICAgICBzcGFubm9kZS5hcHBlbmRDaGlsZChtaWRkbGVjbG9uZSk7XG5cdCAgICAgIHJlcGxhY2VOb2RlKG1pZGRsZWJpdCwgc3Bhbm5vZGUpO1xuXHQgICAgICByZXR1cm4gMTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIDA7XG5cdCAgfTsgLy8gUmVjdXJzZSBlbGVtZW50IG5vZGUsIGxvb2tpbmcgZm9yIGNoaWxkIHRleHQgbm9kZXMgdG8gaGlnaGxpZ2h0LCB1bmxlc3MgZWxlbWVudFxuXHQgIC8vIGlzIGNoaWxkbGVzcywgPHNjcmlwdD4sIDxzdHlsZT4sIG9yIGFscmVhZHkgaGlnaGxpZ2h0ZWQ6IDxzcGFuIGNsYXNzPVwiaGlnaHRsaWdodFwiPlxuXG5cblx0ICBjb25zdCBoaWdobGlnaHRDaGlsZHJlbiA9IG5vZGUgPT4ge1xuXHQgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEgJiYgbm9kZS5jaGlsZE5vZGVzICYmICEvKHNjcmlwdHxzdHlsZSkvaS50ZXN0KG5vZGUudGFnTmFtZSkgJiYgKG5vZGUuY2xhc3NOYW1lICE9PSAnaGlnaGxpZ2h0JyB8fCBub2RlLnRhZ05hbWUgIT09ICdTUEFOJykpIHtcblx0ICAgICAgQXJyYXkuZnJvbShub2RlLmNoaWxkTm9kZXMpLmZvckVhY2goZWxlbWVudCA9PiB7XG5cdCAgICAgICAgaGlnaGxpZ2h0UmVjdXJzaXZlKGVsZW1lbnQpO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgY29uc3QgaGlnaGxpZ2h0UmVjdXJzaXZlID0gbm9kZSA9PiB7XG5cdCAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuXHQgICAgICByZXR1cm4gaGlnaGxpZ2h0VGV4dChub2RlKTtcblx0ICAgIH1cblxuXHQgICAgaGlnaGxpZ2h0Q2hpbGRyZW4obm9kZSk7XG5cdCAgICByZXR1cm4gMDtcblx0ICB9O1xuXG5cdCAgaGlnaGxpZ2h0UmVjdXJzaXZlKGVsZW1lbnQpO1xuXHR9O1xuXHQvKipcblx0ICogcmVtb3ZlSGlnaGxpZ2h0IGZuIGNvcGllZCBmcm9tIGhpZ2hsaWdodCB2NSBhbmRcblx0ICogZWRpdGVkIHRvIHJlbW92ZSB3aXRoKCksIHBhc3MganMgc3RyaWN0IG1vZGUsIGFuZCB1c2Ugd2l0aG91dCBqcXVlcnlcblx0ICovXG5cblx0Y29uc3QgcmVtb3ZlSGlnaGxpZ2h0ID0gZWwgPT4ge1xuXHQgIHZhciBlbGVtZW50cyA9IGVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuLmhpZ2hsaWdodFwiKTtcblx0ICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGVsZW1lbnRzLCBmdW5jdGlvbiAoZWwpIHtcblx0ICAgIHZhciBwYXJlbnQgPSBlbC5wYXJlbnROb2RlO1xuXHQgICAgcGFyZW50LnJlcGxhY2VDaGlsZChlbC5maXJzdENoaWxkLCBlbCk7XG5cdCAgICBwYXJlbnQubm9ybWFsaXplKCk7XG5cdCAgfSk7XG5cdH07XG5cblx0Y29uc3QgS0VZX0EgPSA2NTtcblx0Y29uc3QgS0VZX1JFVFVSTiA9IDEzO1xuXHRjb25zdCBLRVlfRVNDID0gMjc7XG5cdGNvbnN0IEtFWV9MRUZUID0gMzc7XG5cdGNvbnN0IEtFWV9VUCA9IDM4O1xuXHRjb25zdCBLRVlfUklHSFQgPSAzOTtcblx0Y29uc3QgS0VZX0RPV04gPSA0MDtcblx0Y29uc3QgS0VZX0JBQ0tTUEFDRSA9IDg7XG5cdGNvbnN0IEtFWV9ERUxFVEUgPSA0Njtcblx0Y29uc3QgS0VZX1RBQiA9IDk7XG5cdGNvbnN0IElTX01BQyA9IHR5cGVvZiBuYXZpZ2F0b3IgPT09ICd1bmRlZmluZWQnID8gZmFsc2UgOiAvTWFjLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXHRjb25zdCBLRVlfU0hPUlRDVVQgPSBJU19NQUMgPyAnbWV0YUtleScgOiAnY3RybEtleSc7IC8vIGN0cmwga2V5IG9yIGFwcGxlIGtleSBmb3IgbWFcblxuXHR2YXIgZGVmYXVsdHMgPSB7XG5cdCAgb3B0aW9uczogW10sXG5cdCAgb3B0Z3JvdXBzOiBbXSxcblx0ICBwbHVnaW5zOiBbXSxcblx0ICBkZWxpbWl0ZXI6ICcsJyxcblx0ICBzcGxpdE9uOiBudWxsLFxuXHQgIC8vIHJlZ2V4cCBvciBzdHJpbmcgZm9yIHNwbGl0dGluZyB1cCB2YWx1ZXMgZnJvbSBhIHBhc3RlIGNvbW1hbmRcblx0ICBwZXJzaXN0OiB0cnVlLFxuXHQgIGRpYWNyaXRpY3M6IHRydWUsXG5cdCAgY3JlYXRlOiBudWxsLFxuXHQgIGNyZWF0ZU9uQmx1cjogZmFsc2UsXG5cdCAgY3JlYXRlRmlsdGVyOiBudWxsLFxuXHQgIGhpZ2hsaWdodDogdHJ1ZSxcblx0ICBvcGVuT25Gb2N1czogdHJ1ZSxcblx0ICBzaG91bGRPcGVuOiBudWxsLFxuXHQgIG1heE9wdGlvbnM6IDUwLFxuXHQgIG1heEl0ZW1zOiBudWxsLFxuXHQgIGhpZGVTZWxlY3RlZDogbnVsbCxcblx0ICBkdXBsaWNhdGVzOiBmYWxzZSxcblx0ICBhZGRQcmVjZWRlbmNlOiBmYWxzZSxcblx0ICBzZWxlY3RPblRhYjogZmFsc2UsXG5cdCAgcHJlbG9hZDogbnVsbCxcblx0ICBhbGxvd0VtcHR5T3B0aW9uOiBmYWxzZSxcblx0ICAvL2Nsb3NlQWZ0ZXJTZWxlY3Q6IGZhbHNlLFxuXHQgIGxvYWRUaHJvdHRsZTogMzAwLFxuXHQgIGxvYWRpbmdDbGFzczogJ2xvYWRpbmcnLFxuXHQgIGRhdGFBdHRyOiBudWxsLFxuXHQgIC8vJ2RhdGEtZGF0YScsXG5cdCAgb3B0Z3JvdXBGaWVsZDogJ29wdGdyb3VwJyxcblx0ICB2YWx1ZUZpZWxkOiAndmFsdWUnLFxuXHQgIGxhYmVsRmllbGQ6ICd0ZXh0Jyxcblx0ICBkaXNhYmxlZEZpZWxkOiAnZGlzYWJsZWQnLFxuXHQgIG9wdGdyb3VwTGFiZWxGaWVsZDogJ2xhYmVsJyxcblx0ICBvcHRncm91cFZhbHVlRmllbGQ6ICd2YWx1ZScsXG5cdCAgbG9ja09wdGdyb3VwT3JkZXI6IGZhbHNlLFxuXHQgIHNvcnRGaWVsZDogJyRvcmRlcicsXG5cdCAgc2VhcmNoRmllbGQ6IFsndGV4dCddLFxuXHQgIHNlYXJjaENvbmp1bmN0aW9uOiAnYW5kJyxcblx0ICBtb2RlOiBudWxsLFxuXHQgIHdyYXBwZXJDbGFzczogJ3RzLXdyYXBwZXInLFxuXHQgIGNvbnRyb2xDbGFzczogJ3RzLWNvbnRyb2wnLFxuXHQgIGRyb3Bkb3duQ2xhc3M6ICd0cy1kcm9wZG93bicsXG5cdCAgZHJvcGRvd25Db250ZW50Q2xhc3M6ICd0cy1kcm9wZG93bi1jb250ZW50Jyxcblx0ICBpdGVtQ2xhc3M6ICdpdGVtJyxcblx0ICBvcHRpb25DbGFzczogJ29wdGlvbicsXG5cdCAgZHJvcGRvd25QYXJlbnQ6IG51bGwsXG5cdCAgY29udHJvbElucHV0OiAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgc2l6ZT1cIjFcIiAvPicsXG5cdCAgY29weUNsYXNzZXNUb0Ryb3Bkb3duOiBmYWxzZSxcblx0ICBwbGFjZWhvbGRlcjogbnVsbCxcblx0ICBoaWRlUGxhY2Vob2xkZXI6IG51bGwsXG5cdCAgc2hvdWxkTG9hZDogZnVuY3Rpb24gKHF1ZXJ5KSB7XG5cdCAgICByZXR1cm4gcXVlcnkubGVuZ3RoID4gMDtcblx0ICB9LFxuXG5cdCAgLypcblx0ICBsb2FkICAgICAgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHF1ZXJ5LCBjYWxsYmFjaykgeyAuLi4gfVxuXHQgIHNjb3JlICAgICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oc2VhcmNoKSB7IC4uLiB9XG5cdCAgb25Jbml0aWFsaXplICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbigpIHsgLi4uIH1cblx0ICBvbkNoYW5nZSAgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHZhbHVlKSB7IC4uLiB9XG5cdCAgb25JdGVtQWRkICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbih2YWx1ZSwgJGl0ZW0pIHsgLi4uIH1cblx0ICBvbkl0ZW1SZW1vdmUgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHZhbHVlKSB7IC4uLiB9XG5cdCAgb25DbGVhciAgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbigpIHsgLi4uIH1cblx0ICBvbk9wdGlvbkFkZCAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHZhbHVlLCBkYXRhKSB7IC4uLiB9XG5cdCAgb25PcHRpb25SZW1vdmUgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbih2YWx1ZSkgeyAuLi4gfVxuXHQgIG9uT3B0aW9uQ2xlYXIgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oKSB7IC4uLiB9XG5cdCAgb25PcHRpb25Hcm91cEFkZCAgICAgOiBudWxsLCAvLyBmdW5jdGlvbihpZCwgZGF0YSkgeyAuLi4gfVxuXHQgIG9uT3B0aW9uR3JvdXBSZW1vdmUgIDogbnVsbCwgLy8gZnVuY3Rpb24oaWQpIHsgLi4uIH1cblx0ICBvbk9wdGlvbkdyb3VwQ2xlYXIgICA6IG51bGwsIC8vIGZ1bmN0aW9uKCkgeyAuLi4gfVxuXHQgIG9uRHJvcGRvd25PcGVuICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oZHJvcGRvd24pIHsgLi4uIH1cblx0ICBvbkRyb3Bkb3duQ2xvc2UgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKGRyb3Bkb3duKSB7IC4uLiB9XG5cdCAgb25UeXBlICAgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbihzdHIpIHsgLi4uIH1cblx0ICBvbkRlbGV0ZSAgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHZhbHVlcykgeyAuLi4gfVxuXHQgICovXG5cdCAgcmVuZGVyOiB7XG5cdCAgICAvKlxuXHQgICAgaXRlbTogbnVsbCxcblx0ICAgIG9wdGdyb3VwOiBudWxsLFxuXHQgICAgb3B0Z3JvdXBfaGVhZGVyOiBudWxsLFxuXHQgICAgb3B0aW9uOiBudWxsLFxuXHQgICAgb3B0aW9uX2NyZWF0ZTogbnVsbFxuXHQgICAgKi9cblx0ICB9XG5cdH07XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgc2NhbGFyIHRvIGl0cyBiZXN0IHN0cmluZyByZXByZXNlbnRhdGlvblxuXHQgKiBmb3IgaGFzaCBrZXlzIGFuZCBIVE1MIGF0dHJpYnV0ZSB2YWx1ZXMuXG5cdCAqXG5cdCAqIFRyYW5zZm9ybWF0aW9uczpcblx0ICogICAnc3RyJyAgICAgLT4gJ3N0cidcblx0ICogICBudWxsICAgICAgLT4gJydcblx0ICogICB1bmRlZmluZWQgLT4gJydcblx0ICogICB0cnVlICAgICAgLT4gJzEnXG5cdCAqICAgZmFsc2UgICAgIC0+ICcwJ1xuXHQgKiAgIDAgICAgICAgICAtPiAnMCdcblx0ICogICAxICAgICAgICAgLT4gJzEnXG5cdCAqXG5cdCAqL1xuXHRjb25zdCBoYXNoX2tleSA9IHZhbHVlID0+IHtcblx0ICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdCAgcmV0dXJuIGdldF9oYXNoKHZhbHVlKTtcblx0fTtcblx0Y29uc3QgZ2V0X2hhc2ggPSB2YWx1ZSA9PiB7XG5cdCAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSByZXR1cm4gdmFsdWUgPyAnMScgOiAnMCc7XG5cdCAgcmV0dXJuIHZhbHVlICsgJyc7XG5cdH07XG5cdC8qKlxuXHQgKiBFc2NhcGVzIGEgc3RyaW5nIGZvciB1c2Ugd2l0aGluIEhUTUwuXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGVzY2FwZV9odG1sID0gc3RyID0+IHtcblx0ICByZXR1cm4gKHN0ciArICcnKS5yZXBsYWNlKC8mL2csICcmYW1wOycpLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7JykucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuXHR9O1xuXHQvKipcblx0ICogRGVib3VuY2UgdGhlIHVzZXIgcHJvdmlkZWQgbG9hZCBmdW5jdGlvblxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBsb2FkRGVib3VuY2UgPSAoZm4sIGRlbGF5KSA9PiB7XG5cdCAgdmFyIHRpbWVvdXQ7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSwgY2FsbGJhY2spIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKHRpbWVvdXQpIHtcblx0ICAgICAgc2VsZi5sb2FkaW5nID0gTWF0aC5tYXgoc2VsZi5sb2FkaW5nIC0gMSwgMCk7XG5cdCAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0ICAgIH1cblxuXHQgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHQgICAgICB0aW1lb3V0ID0gbnVsbDtcblx0ICAgICAgc2VsZi5sb2FkZWRTZWFyY2hlc1t2YWx1ZV0gPSB0cnVlO1xuXHQgICAgICBmbi5jYWxsKHNlbGYsIHZhbHVlLCBjYWxsYmFjayk7XG5cdCAgICB9LCBkZWxheSk7XG5cdCAgfTtcblx0fTtcblx0LyoqXG5cdCAqIERlYm91bmNlIGFsbCBmaXJlZCBldmVudHMgdHlwZXMgbGlzdGVkIGluIGB0eXBlc2Bcblx0ICogd2hpbGUgZXhlY3V0aW5nIHRoZSBwcm92aWRlZCBgZm5gLlxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBkZWJvdW5jZV9ldmVudHMgPSAoc2VsZiwgdHlwZXMsIGZuKSA9PiB7XG5cdCAgdmFyIHR5cGU7XG5cdCAgdmFyIHRyaWdnZXIgPSBzZWxmLnRyaWdnZXI7XG5cdCAgdmFyIGV2ZW50X2FyZ3MgPSB7fTsgLy8gb3ZlcnJpZGUgdHJpZ2dlciBtZXRob2RcblxuXHQgIHNlbGYudHJpZ2dlciA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciB0eXBlID0gYXJndW1lbnRzWzBdO1xuXG5cdCAgICBpZiAodHlwZXMuaW5kZXhPZih0eXBlKSAhPT0gLTEpIHtcblx0ICAgICAgZXZlbnRfYXJnc1t0eXBlXSA9IGFyZ3VtZW50cztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiB0cmlnZ2VyLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cdCAgICB9XG5cdCAgfTsgLy8gaW52b2tlIHByb3ZpZGVkIGZ1bmN0aW9uXG5cblxuXHQgIGZuLmFwcGx5KHNlbGYsIFtdKTtcblx0ICBzZWxmLnRyaWdnZXIgPSB0cmlnZ2VyOyAvLyB0cmlnZ2VyIHF1ZXVlZCBldmVudHNcblxuXHQgIGZvciAodHlwZSBvZiB0eXBlcykge1xuXHQgICAgaWYgKHR5cGUgaW4gZXZlbnRfYXJncykge1xuXHQgICAgICB0cmlnZ2VyLmFwcGx5KHNlbGYsIGV2ZW50X2FyZ3NbdHlwZV0pO1xuXHQgICAgfVxuXHQgIH1cblx0fTtcblx0LyoqXG5cdCAqIERldGVybWluZXMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIHdpdGhpbiBhIHRleHQgaW5wdXQgY29udHJvbC5cblx0ICogUmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZzpcblx0ICogICAtIHN0YXJ0XG5cdCAqICAgLSBsZW5ndGhcblx0ICpcblx0ICovXG5cblx0Y29uc3QgZ2V0U2VsZWN0aW9uID0gaW5wdXQgPT4ge1xuXHQgIHJldHVybiB7XG5cdCAgICBzdGFydDogaW5wdXQuc2VsZWN0aW9uU3RhcnQgfHwgMCxcblx0ICAgIGxlbmd0aDogKGlucHV0LnNlbGVjdGlvbkVuZCB8fCAwKSAtIChpbnB1dC5zZWxlY3Rpb25TdGFydCB8fCAwKVxuXHQgIH07XG5cdH07XG5cdC8qKlxuXHQgKiBQcmV2ZW50IGRlZmF1bHRcblx0ICpcblx0ICovXG5cblx0Y29uc3QgcHJldmVudERlZmF1bHQgPSAoZXZ0LCBzdG9wID0gZmFsc2UpID0+IHtcblx0ICBpZiAoZXZ0KSB7XG5cdCAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuXHQgICAgaWYgKHN0b3ApIHtcblx0ICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgfVxuXHQgIH1cblx0fTtcblx0LyoqXG5cdCAqIEFkZCBldmVudCBoZWxwZXJcblx0ICpcblx0ICovXG5cblx0Y29uc3QgYWRkRXZlbnQgPSAodGFyZ2V0LCB0eXBlLCBjYWxsYmFjaywgb3B0aW9ucykgPT4ge1xuXHQgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblx0fTtcblx0LyoqXG5cdCAqIFJldHVybiB0cnVlIGlmIHRoZSByZXF1ZXN0ZWQga2V5IGlzIGRvd25cblx0ICogV2lsbCByZXR1cm4gZmFsc2UgaWYgbW9yZSB0aGFuIG9uZSBjb250cm9sIGNoYXJhY3RlciBpcyBwcmVzc2VkICggd2hlbiBbY3RybCtzaGlmdCthXSAhPSBbY3RybCthXSApXG5cdCAqIFRoZSBjdXJyZW50IGV2dCBtYXkgbm90IGFsd2F5cyBzZXQgKCBlZyBjYWxsaW5nIGFkdmFuY2VTZWxlY3Rpb24oKSApXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGlzS2V5RG93biA9IChrZXlfbmFtZSwgZXZ0KSA9PiB7XG5cdCAgaWYgKCFldnQpIHtcblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9XG5cblx0ICBpZiAoIWV2dFtrZXlfbmFtZV0pIHtcblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9XG5cblx0ICB2YXIgY291bnQgPSAoZXZ0LmFsdEtleSA/IDEgOiAwKSArIChldnQuY3RybEtleSA/IDEgOiAwKSArIChldnQuc2hpZnRLZXkgPyAxIDogMCkgKyAoZXZ0Lm1ldGFLZXkgPyAxIDogMCk7XG5cblx0ICBpZiAoY291bnQgPT09IDEpIHtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblxuXHQgIHJldHVybiBmYWxzZTtcblx0fTtcblx0LyoqXG5cdCAqIEdldCB0aGUgaWQgb2YgYW4gZWxlbWVudFxuXHQgKiBJZiB0aGUgaWQgYXR0cmlidXRlIGlzIG5vdCBzZXQsIHNldCB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIGlkXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGdldElkID0gKGVsLCBpZCkgPT4ge1xuXHQgIGNvbnN0IGV4aXN0aW5nX2lkID0gZWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXG5cdCAgaWYgKGV4aXN0aW5nX2lkKSB7XG5cdCAgICByZXR1cm4gZXhpc3RpbmdfaWQ7XG5cdCAgfVxuXG5cdCAgZWwuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcblx0ICByZXR1cm4gaWQ7XG5cdH07XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgc3RyaW5nIHdpdGggYmFja3NsYXNoZXMgYWRkZWQgYmVmb3JlIGNoYXJhY3RlcnMgdGhhdCBuZWVkIHRvIGJlIGVzY2FwZWQuXG5cdCAqL1xuXG5cdGNvbnN0IGFkZFNsYXNoZXMgPSBzdHIgPT4ge1xuXHQgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcXFxcIiddL2csICdcXFxcJCYnKTtcblx0fTtcblx0LyoqXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGFwcGVuZCA9IChwYXJlbnQsIG5vZGUpID0+IHtcblx0ICBpZiAobm9kZSkgcGFyZW50LmFwcGVuZChub2RlKTtcblx0fTtcblxuXHRmdW5jdGlvbiBnZXRTZXR0aW5ncyhpbnB1dCwgc2V0dGluZ3NfdXNlcikge1xuXHQgIHZhciBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBzZXR0aW5nc191c2VyKTtcblx0ICB2YXIgYXR0cl9kYXRhID0gc2V0dGluZ3MuZGF0YUF0dHI7XG5cdCAgdmFyIGZpZWxkX2xhYmVsID0gc2V0dGluZ3MubGFiZWxGaWVsZDtcblx0ICB2YXIgZmllbGRfdmFsdWUgPSBzZXR0aW5ncy52YWx1ZUZpZWxkO1xuXHQgIHZhciBmaWVsZF9kaXNhYmxlZCA9IHNldHRpbmdzLmRpc2FibGVkRmllbGQ7XG5cdCAgdmFyIGZpZWxkX29wdGdyb3VwID0gc2V0dGluZ3Mub3B0Z3JvdXBGaWVsZDtcblx0ICB2YXIgZmllbGRfb3B0Z3JvdXBfbGFiZWwgPSBzZXR0aW5ncy5vcHRncm91cExhYmVsRmllbGQ7XG5cdCAgdmFyIGZpZWxkX29wdGdyb3VwX3ZhbHVlID0gc2V0dGluZ3Mub3B0Z3JvdXBWYWx1ZUZpZWxkO1xuXHQgIHZhciB0YWdfbmFtZSA9IGlucHV0LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0ICB2YXIgcGxhY2Vob2xkZXIgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJykgfHwgaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJyk7XG5cblx0ICBpZiAoIXBsYWNlaG9sZGVyICYmICFzZXR0aW5ncy5hbGxvd0VtcHR5T3B0aW9uKSB7XG5cdCAgICBsZXQgb3B0aW9uID0gaW5wdXQucXVlcnlTZWxlY3Rvcignb3B0aW9uW3ZhbHVlPVwiXCJdJyk7XG5cblx0ICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgcGxhY2Vob2xkZXIgPSBvcHRpb24udGV4dENvbnRlbnQ7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgdmFyIHNldHRpbmdzX2VsZW1lbnQgPSB7XG5cdCAgICBwbGFjZWhvbGRlcjogcGxhY2Vob2xkZXIsXG5cdCAgICBvcHRpb25zOiBbXSxcblx0ICAgIG9wdGdyb3VwczogW10sXG5cdCAgICBpdGVtczogW10sXG5cdCAgICBtYXhJdGVtczogbnVsbFxuXHQgIH07XG5cdCAgLyoqXG5cdCAgICogSW5pdGlhbGl6ZSBmcm9tIGEgPHNlbGVjdD4gZWxlbWVudC5cblx0ICAgKlxuXHQgICAqL1xuXG5cdCAgdmFyIGluaXRfc2VsZWN0ID0gKCkgPT4ge1xuXHQgICAgdmFyIHRhZ05hbWU7XG5cdCAgICB2YXIgb3B0aW9ucyA9IHNldHRpbmdzX2VsZW1lbnQub3B0aW9ucztcblx0ICAgIHZhciBvcHRpb25zTWFwID0ge307XG5cdCAgICB2YXIgZ3JvdXBfY291bnQgPSAxO1xuXG5cdCAgICB2YXIgcmVhZERhdGEgPSBlbCA9PiB7XG5cdCAgICAgIHZhciBkYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgZWwuZGF0YXNldCk7IC8vIGdldCBwbGFpbiBvYmplY3QgZnJvbSBET01TdHJpbmdNYXBcblxuXHQgICAgICB2YXIganNvbiA9IGF0dHJfZGF0YSAmJiBkYXRhW2F0dHJfZGF0YV07XG5cblx0ICAgICAgaWYgKHR5cGVvZiBqc29uID09PSAnc3RyaW5nJyAmJiBqc29uLmxlbmd0aCkge1xuXHQgICAgICAgIGRhdGEgPSBPYmplY3QuYXNzaWduKGRhdGEsIEpTT04ucGFyc2UoanNvbikpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGRhdGE7XG5cdCAgICB9O1xuXG5cdCAgICB2YXIgYWRkT3B0aW9uID0gKG9wdGlvbiwgZ3JvdXApID0+IHtcblx0ICAgICAgdmFyIHZhbHVlID0gaGFzaF9rZXkob3B0aW9uLnZhbHVlKTtcblx0ICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybjtcblx0ICAgICAgaWYgKCF2YWx1ZSAmJiAhc2V0dGluZ3MuYWxsb3dFbXB0eU9wdGlvbikgcmV0dXJuOyAvLyBpZiB0aGUgb3B0aW9uIGFscmVhZHkgZXhpc3RzLCBpdCdzIHByb2JhYmx5IGJlZW5cblx0ICAgICAgLy8gZHVwbGljYXRlZCBpbiBhbm90aGVyIG9wdGdyb3VwLiBpbiB0aGlzIGNhc2UsIHB1c2hcblx0ICAgICAgLy8gdGhlIGN1cnJlbnQgZ3JvdXAgdG8gdGhlIFwib3B0Z3JvdXBcIiBwcm9wZXJ0eSBvbiB0aGVcblx0ICAgICAgLy8gZXhpc3Rpbmcgb3B0aW9uIHNvIHRoYXQgaXQncyByZW5kZXJlZCBpbiBib3RoIHBsYWNlcy5cblxuXHQgICAgICBpZiAob3B0aW9uc01hcC5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcblx0ICAgICAgICBpZiAoZ3JvdXApIHtcblx0ICAgICAgICAgIHZhciBhcnIgPSBvcHRpb25zTWFwW3ZhbHVlXVtmaWVsZF9vcHRncm91cF07XG5cblx0ICAgICAgICAgIGlmICghYXJyKSB7XG5cdCAgICAgICAgICAgIG9wdGlvbnNNYXBbdmFsdWVdW2ZpZWxkX29wdGdyb3VwXSA9IGdyb3VwO1xuXHQgICAgICAgICAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG5cdCAgICAgICAgICAgIG9wdGlvbnNNYXBbdmFsdWVdW2ZpZWxkX29wdGdyb3VwXSA9IFthcnIsIGdyb3VwXTtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIGFyci5wdXNoKGdyb3VwKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFyIG9wdGlvbl9kYXRhID0gcmVhZERhdGEob3B0aW9uKTtcblx0ICAgICAgICBvcHRpb25fZGF0YVtmaWVsZF9sYWJlbF0gPSBvcHRpb25fZGF0YVtmaWVsZF9sYWJlbF0gfHwgb3B0aW9uLnRleHRDb250ZW50O1xuXHQgICAgICAgIG9wdGlvbl9kYXRhW2ZpZWxkX3ZhbHVlXSA9IG9wdGlvbl9kYXRhW2ZpZWxkX3ZhbHVlXSB8fCB2YWx1ZTtcblx0ICAgICAgICBvcHRpb25fZGF0YVtmaWVsZF9kaXNhYmxlZF0gPSBvcHRpb25fZGF0YVtmaWVsZF9kaXNhYmxlZF0gfHwgb3B0aW9uLmRpc2FibGVkO1xuXHQgICAgICAgIG9wdGlvbl9kYXRhW2ZpZWxkX29wdGdyb3VwXSA9IG9wdGlvbl9kYXRhW2ZpZWxkX29wdGdyb3VwXSB8fCBncm91cDtcblx0ICAgICAgICBvcHRpb25fZGF0YS4kb3B0aW9uID0gb3B0aW9uO1xuXHQgICAgICAgIG9wdGlvbnNNYXBbdmFsdWVdID0gb3B0aW9uX2RhdGE7XG5cdCAgICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbl9kYXRhKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChvcHRpb24uc2VsZWN0ZWQpIHtcblx0ICAgICAgICBzZXR0aW5nc19lbGVtZW50Lml0ZW1zLnB1c2godmFsdWUpO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXG5cdCAgICB2YXIgYWRkR3JvdXAgPSBvcHRncm91cCA9PiB7XG5cdCAgICAgIHZhciBpZCwgb3B0Z3JvdXBfZGF0YTtcblx0ICAgICAgb3B0Z3JvdXBfZGF0YSA9IHJlYWREYXRhKG9wdGdyb3VwKTtcblx0ICAgICAgb3B0Z3JvdXBfZGF0YVtmaWVsZF9vcHRncm91cF9sYWJlbF0gPSBvcHRncm91cF9kYXRhW2ZpZWxkX29wdGdyb3VwX2xhYmVsXSB8fCBvcHRncm91cC5nZXRBdHRyaWJ1dGUoJ2xhYmVsJykgfHwgJyc7XG5cdCAgICAgIG9wdGdyb3VwX2RhdGFbZmllbGRfb3B0Z3JvdXBfdmFsdWVdID0gb3B0Z3JvdXBfZGF0YVtmaWVsZF9vcHRncm91cF92YWx1ZV0gfHwgZ3JvdXBfY291bnQrKztcblx0ICAgICAgb3B0Z3JvdXBfZGF0YVtmaWVsZF9kaXNhYmxlZF0gPSBvcHRncm91cF9kYXRhW2ZpZWxkX2Rpc2FibGVkXSB8fCBvcHRncm91cC5kaXNhYmxlZDtcblx0ICAgICAgc2V0dGluZ3NfZWxlbWVudC5vcHRncm91cHMucHVzaChvcHRncm91cF9kYXRhKTtcblx0ICAgICAgaWQgPSBvcHRncm91cF9kYXRhW2ZpZWxkX29wdGdyb3VwX3ZhbHVlXTtcblx0ICAgICAgaXRlcmF0ZShvcHRncm91cC5jaGlsZHJlbiwgb3B0aW9uID0+IHtcblx0ICAgICAgICBhZGRPcHRpb24ob3B0aW9uLCBpZCk7XG5cdCAgICAgIH0pO1xuXHQgICAgfTtcblxuXHQgICAgc2V0dGluZ3NfZWxlbWVudC5tYXhJdGVtcyA9IGlucHV0Lmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKSA/IG51bGwgOiAxO1xuXHQgICAgaXRlcmF0ZShpbnB1dC5jaGlsZHJlbiwgY2hpbGQgPT4ge1xuXHQgICAgICB0YWdOYW1lID0gY2hpbGQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG5cdCAgICAgIGlmICh0YWdOYW1lID09PSAnb3B0Z3JvdXAnKSB7XG5cdCAgICAgICAgYWRkR3JvdXAoY2hpbGQpO1xuXHQgICAgICB9IGVsc2UgaWYgKHRhZ05hbWUgPT09ICdvcHRpb24nKSB7XG5cdCAgICAgICAgYWRkT3B0aW9uKGNoaWxkKTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfTtcblx0ICAvKipcblx0ICAgKiBJbml0aWFsaXplIGZyb20gYSA8aW5wdXQgdHlwZT1cInRleHRcIj4gZWxlbWVudC5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICB2YXIgaW5pdF90ZXh0Ym94ID0gKCkgPT4ge1xuXHQgICAgY29uc3QgZGF0YV9yYXcgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoYXR0cl9kYXRhKTtcblxuXHQgICAgaWYgKCFkYXRhX3Jhdykge1xuXHQgICAgICB2YXIgdmFsdWUgPSBpbnB1dC52YWx1ZS50cmltKCkgfHwgJyc7XG5cdCAgICAgIGlmICghc2V0dGluZ3MuYWxsb3dFbXB0eU9wdGlvbiAmJiAhdmFsdWUubGVuZ3RoKSByZXR1cm47XG5cdCAgICAgIGNvbnN0IHZhbHVlcyA9IHZhbHVlLnNwbGl0KHNldHRpbmdzLmRlbGltaXRlcik7XG5cdCAgICAgIGl0ZXJhdGUodmFsdWVzLCB2YWx1ZSA9PiB7XG5cdCAgICAgICAgY29uc3Qgb3B0aW9uID0ge307XG5cdCAgICAgICAgb3B0aW9uW2ZpZWxkX2xhYmVsXSA9IHZhbHVlO1xuXHQgICAgICAgIG9wdGlvbltmaWVsZF92YWx1ZV0gPSB2YWx1ZTtcblx0ICAgICAgICBzZXR0aW5nc19lbGVtZW50Lm9wdGlvbnMucHVzaChvcHRpb24pO1xuXHQgICAgICB9KTtcblx0ICAgICAgc2V0dGluZ3NfZWxlbWVudC5pdGVtcyA9IHZhbHVlcztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNldHRpbmdzX2VsZW1lbnQub3B0aW9ucyA9IEpTT04ucGFyc2UoZGF0YV9yYXcpO1xuXHQgICAgICBpdGVyYXRlKHNldHRpbmdzX2VsZW1lbnQub3B0aW9ucywgb3B0ID0+IHtcblx0ICAgICAgICBzZXR0aW5nc19lbGVtZW50Lml0ZW1zLnB1c2gob3B0W2ZpZWxkX3ZhbHVlXSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICBpZiAodGFnX25hbWUgPT09ICdzZWxlY3QnKSB7XG5cdCAgICBpbml0X3NlbGVjdCgpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICBpbml0X3RleHRib3goKTtcblx0ICB9XG5cblx0ICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIHNldHRpbmdzX2VsZW1lbnQsIHNldHRpbmdzX3VzZXIpO1xuXHR9XG5cblx0dmFyIGluc3RhbmNlX2kgPSAwO1xuXHRjbGFzcyBUb21TZWxlY3QgZXh0ZW5kcyBNaWNyb1BsdWdpbihNaWNyb0V2ZW50KSB7XG5cdCAgLy8gQGRlcHJlY2F0ZWQgMS44XG5cdCAgY29uc3RydWN0b3IoaW5wdXRfYXJnLCB1c2VyX3NldHRpbmdzKSB7XG5cdCAgICBzdXBlcigpO1xuXHQgICAgdGhpcy5jb250cm9sX2lucHV0ID0gdm9pZCAwO1xuXHQgICAgdGhpcy53cmFwcGVyID0gdm9pZCAwO1xuXHQgICAgdGhpcy5kcm9wZG93biA9IHZvaWQgMDtcblx0ICAgIHRoaXMuY29udHJvbCA9IHZvaWQgMDtcblx0ICAgIHRoaXMuZHJvcGRvd25fY29udGVudCA9IHZvaWQgMDtcblx0ICAgIHRoaXMuZm9jdXNfbm9kZSA9IHZvaWQgMDtcblx0ICAgIHRoaXMub3JkZXIgPSAwO1xuXHQgICAgdGhpcy5zZXR0aW5ncyA9IHZvaWQgMDtcblx0ICAgIHRoaXMuaW5wdXQgPSB2b2lkIDA7XG5cdCAgICB0aGlzLnRhYkluZGV4ID0gdm9pZCAwO1xuXHQgICAgdGhpcy5pc19zZWxlY3RfdGFnID0gdm9pZCAwO1xuXHQgICAgdGhpcy5ydGwgPSB2b2lkIDA7XG5cdCAgICB0aGlzLmlucHV0SWQgPSB2b2lkIDA7XG5cdCAgICB0aGlzLl9kZXN0cm95ID0gdm9pZCAwO1xuXHQgICAgdGhpcy5zaWZ0ZXIgPSB2b2lkIDA7XG5cdCAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuXHQgICAgdGhpcy5pc0Rpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmlzUmVxdWlyZWQgPSB2b2lkIDA7XG5cdCAgICB0aGlzLmlzSW52YWxpZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5pc1ZhbGlkID0gdHJ1ZTtcblx0ICAgIHRoaXMuaXNMb2NrZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2U7XG5cdCAgICB0aGlzLmlzSW5wdXRIaWRkZW4gPSBmYWxzZTtcblx0ICAgIHRoaXMuaXNTZXR1cCA9IGZhbHNlO1xuXHQgICAgdGhpcy5pZ25vcmVGb2N1cyA9IGZhbHNlO1xuXHQgICAgdGhpcy5pZ25vcmVIb3ZlciA9IGZhbHNlO1xuXHQgICAgdGhpcy5oYXNPcHRpb25zID0gZmFsc2U7XG5cdCAgICB0aGlzLmN1cnJlbnRSZXN1bHRzID0gdm9pZCAwO1xuXHQgICAgdGhpcy5sYXN0VmFsdWUgPSAnJztcblx0ICAgIHRoaXMuY2FyZXRQb3MgPSAwO1xuXHQgICAgdGhpcy5sb2FkaW5nID0gMDtcblx0ICAgIHRoaXMubG9hZGVkU2VhcmNoZXMgPSB7fTtcblx0ICAgIHRoaXMuYWN0aXZlT3B0aW9uID0gbnVsbDtcblx0ICAgIHRoaXMuYWN0aXZlSXRlbXMgPSBbXTtcblx0ICAgIHRoaXMub3B0Z3JvdXBzID0ge307XG5cdCAgICB0aGlzLm9wdGlvbnMgPSB7fTtcblx0ICAgIHRoaXMudXNlck9wdGlvbnMgPSB7fTtcblx0ICAgIHRoaXMuaXRlbXMgPSBbXTtcblx0ICAgIGluc3RhbmNlX2krKztcblx0ICAgIHZhciBkaXI7XG5cdCAgICB2YXIgaW5wdXQgPSBnZXREb20oaW5wdXRfYXJnKTtcblxuXHQgICAgaWYgKGlucHV0LnRvbXNlbGVjdCkge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvbSBTZWxlY3QgYWxyZWFkeSBpbml0aWFsaXplZCBvbiB0aGlzIGVsZW1lbnQnKTtcblx0ICAgIH1cblxuXHQgICAgaW5wdXQudG9tc2VsZWN0ID0gdGhpczsgLy8gZGV0ZWN0IHJ0bCBlbnZpcm9ubWVudFxuXG5cdCAgICB2YXIgY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlICYmIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGlucHV0LCBudWxsKTtcblx0ICAgIGRpciA9IGNvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnZGlyZWN0aW9uJyk7IC8vIHNldHVwIGRlZmF1bHQgc3RhdGVcblxuXHQgICAgY29uc3Qgc2V0dGluZ3MgPSBnZXRTZXR0aW5ncyhpbnB1dCwgdXNlcl9zZXR0aW5ncyk7XG5cdCAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG5cdCAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XG5cdCAgICB0aGlzLnRhYkluZGV4ID0gaW5wdXQudGFiSW5kZXggfHwgMDtcblx0ICAgIHRoaXMuaXNfc2VsZWN0X3RhZyA9IGlucHV0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG5cdCAgICB0aGlzLnJ0bCA9IC9ydGwvaS50ZXN0KGRpcik7XG5cdCAgICB0aGlzLmlucHV0SWQgPSBnZXRJZChpbnB1dCwgJ3RvbXNlbGVjdC0nICsgaW5zdGFuY2VfaSk7XG5cdCAgICB0aGlzLmlzUmVxdWlyZWQgPSBpbnB1dC5yZXF1aXJlZDsgLy8gc2VhcmNoIHN5c3RlbVxuXG5cdCAgICB0aGlzLnNpZnRlciA9IG5ldyBTaWZ0ZXIodGhpcy5vcHRpb25zLCB7XG5cdCAgICAgIGRpYWNyaXRpY3M6IHNldHRpbmdzLmRpYWNyaXRpY3Ncblx0ICAgIH0pOyAvLyBvcHRpb24tZGVwZW5kZW50IGRlZmF1bHRzXG5cblx0ICAgIHNldHRpbmdzLm1vZGUgPSBzZXR0aW5ncy5tb2RlIHx8IChzZXR0aW5ncy5tYXhJdGVtcyA9PT0gMSA/ICdzaW5nbGUnIDogJ211bHRpJyk7XG5cblx0ICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MuaGlkZVNlbGVjdGVkICE9PSAnYm9vbGVhbicpIHtcblx0ICAgICAgc2V0dGluZ3MuaGlkZVNlbGVjdGVkID0gc2V0dGluZ3MubW9kZSA9PT0gJ211bHRpJztcblx0ICAgIH1cblxuXHQgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5oaWRlUGxhY2Vob2xkZXIgIT09ICdib29sZWFuJykge1xuXHQgICAgICBzZXR0aW5ncy5oaWRlUGxhY2Vob2xkZXIgPSBzZXR0aW5ncy5tb2RlICE9PSAnbXVsdGknO1xuXHQgICAgfSAvLyBzZXQgdXAgY3JlYXRlRmlsdGVyIGNhbGxiYWNrXG5cblxuXHQgICAgdmFyIGZpbHRlciA9IHNldHRpbmdzLmNyZWF0ZUZpbHRlcjtcblxuXHQgICAgaWYgKHR5cGVvZiBmaWx0ZXIgIT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgICAgZmlsdGVyID0gbmV3IFJlZ0V4cChmaWx0ZXIpO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGZpbHRlciBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuXHQgICAgICAgIHNldHRpbmdzLmNyZWF0ZUZpbHRlciA9IGlucHV0ID0+IGZpbHRlci50ZXN0KGlucHV0KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBzZXR0aW5ncy5jcmVhdGVGaWx0ZXIgPSB2YWx1ZSA9PiB7XG5cdCAgICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5kdXBsaWNhdGVzIHx8ICF0aGlzLm9wdGlvbnNbdmFsdWVdO1xuXHQgICAgICAgIH07XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgdGhpcy5pbml0aWFsaXplUGx1Z2lucyhzZXR0aW5ncy5wbHVnaW5zKTtcblx0ICAgIHRoaXMuc2V0dXBDYWxsYmFja3MoKTtcblx0ICAgIHRoaXMuc2V0dXBUZW1wbGF0ZXMoKTsgLy8gQ3JlYXRlIGFsbCBlbGVtZW50c1xuXG5cdCAgICBjb25zdCB3cmFwcGVyID0gZ2V0RG9tKCc8ZGl2PicpO1xuXHQgICAgY29uc3QgY29udHJvbCA9IGdldERvbSgnPGRpdj4nKTtcblxuXHQgICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLl9yZW5kZXIoJ2Ryb3Bkb3duJyk7XG5cblx0ICAgIGNvbnN0IGRyb3Bkb3duX2NvbnRlbnQgPSBnZXREb20oYDxkaXYgcm9sZT1cImxpc3Rib3hcIiB0YWJpbmRleD1cIi0xXCI+YCk7XG5cdCAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5pbnB1dC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgJyc7XG5cdCAgICBjb25zdCBpbnB1dE1vZGUgPSBzZXR0aW5ncy5tb2RlO1xuXHQgICAgdmFyIGNvbnRyb2xfaW5wdXQ7XG5cdCAgICBhZGRDbGFzc2VzKHdyYXBwZXIsIHNldHRpbmdzLndyYXBwZXJDbGFzcywgY2xhc3NlcywgaW5wdXRNb2RlKTtcblx0ICAgIGFkZENsYXNzZXMoY29udHJvbCwgc2V0dGluZ3MuY29udHJvbENsYXNzKTtcblx0ICAgIGFwcGVuZCh3cmFwcGVyLCBjb250cm9sKTtcblx0ICAgIGFkZENsYXNzZXMoZHJvcGRvd24sIHNldHRpbmdzLmRyb3Bkb3duQ2xhc3MsIGlucHV0TW9kZSk7XG5cblx0ICAgIGlmIChzZXR0aW5ncy5jb3B5Q2xhc3Nlc1RvRHJvcGRvd24pIHtcblx0ICAgICAgYWRkQ2xhc3Nlcyhkcm9wZG93biwgY2xhc3Nlcyk7XG5cdCAgICB9XG5cblx0ICAgIGFkZENsYXNzZXMoZHJvcGRvd25fY29udGVudCwgc2V0dGluZ3MuZHJvcGRvd25Db250ZW50Q2xhc3MpO1xuXHQgICAgYXBwZW5kKGRyb3Bkb3duLCBkcm9wZG93bl9jb250ZW50KTtcblx0ICAgIGdldERvbShzZXR0aW5ncy5kcm9wZG93blBhcmVudCB8fCB3cmFwcGVyKS5hcHBlbmRDaGlsZChkcm9wZG93bik7IC8vIGRlZmF1bHQgY29udHJvbElucHV0XG5cblx0ICAgIGlmIChpc0h0bWxTdHJpbmcoc2V0dGluZ3MuY29udHJvbElucHV0KSkge1xuXHQgICAgICBjb250cm9sX2lucHV0ID0gZ2V0RG9tKHNldHRpbmdzLmNvbnRyb2xJbnB1dCk7IC8vIHNldCBhdHRyaWJ1dGVzXG5cblx0ICAgICAgdmFyIGF0dHJzID0gWydhdXRvY29ycmVjdCcsICdhdXRvY2FwaXRhbGl6ZScsICdhdXRvY29tcGxldGUnXTtcblx0ICAgICAgaXRlcmF0ZSQxKGF0dHJzLCBhdHRyID0+IHtcblx0ICAgICAgICBpZiAoaW5wdXQuZ2V0QXR0cmlidXRlKGF0dHIpKSB7XG5cdCAgICAgICAgICBzZXRBdHRyKGNvbnRyb2xfaW5wdXQsIHtcblx0ICAgICAgICAgICAgW2F0dHJdOiBpbnB1dC5nZXRBdHRyaWJ1dGUoYXR0cilcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICAgIGNvbnRyb2xfaW5wdXQudGFiSW5kZXggPSAtMTtcblx0ICAgICAgY29udHJvbC5hcHBlbmRDaGlsZChjb250cm9sX2lucHV0KTtcblx0ICAgICAgdGhpcy5mb2N1c19ub2RlID0gY29udHJvbF9pbnB1dDsgLy8gZG9tIGVsZW1lbnRcblx0ICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MuY29udHJvbElucHV0KSB7XG5cdCAgICAgIGNvbnRyb2xfaW5wdXQgPSBnZXREb20oc2V0dGluZ3MuY29udHJvbElucHV0KTtcblx0ICAgICAgdGhpcy5mb2N1c19ub2RlID0gY29udHJvbF9pbnB1dDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGNvbnRyb2xfaW5wdXQgPSBnZXREb20oJzxpbnB1dC8+Jyk7XG5cdCAgICAgIHRoaXMuZm9jdXNfbm9kZSA9IGNvbnRyb2w7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMud3JhcHBlciA9IHdyYXBwZXI7XG5cdCAgICB0aGlzLmRyb3Bkb3duID0gZHJvcGRvd247XG5cdCAgICB0aGlzLmRyb3Bkb3duX2NvbnRlbnQgPSBkcm9wZG93bl9jb250ZW50O1xuXHQgICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcblx0ICAgIHRoaXMuY29udHJvbF9pbnB1dCA9IGNvbnRyb2xfaW5wdXQ7XG5cdCAgICB0aGlzLnNldHVwKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIHNldCB1cCBldmVudCBiaW5kaW5ncy5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXR1cCgpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgY29uc3Qgc2V0dGluZ3MgPSBzZWxmLnNldHRpbmdzO1xuXHQgICAgY29uc3QgY29udHJvbF9pbnB1dCA9IHNlbGYuY29udHJvbF9pbnB1dDtcblx0ICAgIGNvbnN0IGRyb3Bkb3duID0gc2VsZi5kcm9wZG93bjtcblx0ICAgIGNvbnN0IGRyb3Bkb3duX2NvbnRlbnQgPSBzZWxmLmRyb3Bkb3duX2NvbnRlbnQ7XG5cdCAgICBjb25zdCB3cmFwcGVyID0gc2VsZi53cmFwcGVyO1xuXHQgICAgY29uc3QgY29udHJvbCA9IHNlbGYuY29udHJvbDtcblx0ICAgIGNvbnN0IGlucHV0ID0gc2VsZi5pbnB1dDtcblx0ICAgIGNvbnN0IGZvY3VzX25vZGUgPSBzZWxmLmZvY3VzX25vZGU7XG5cdCAgICBjb25zdCBwYXNzaXZlX2V2ZW50ID0ge1xuXHQgICAgICBwYXNzaXZlOiB0cnVlXG5cdCAgICB9O1xuXHQgICAgY29uc3QgbGlzdGJveElkID0gc2VsZi5pbnB1dElkICsgJy10cy1kcm9wZG93bic7XG5cdCAgICBzZXRBdHRyKGRyb3Bkb3duX2NvbnRlbnQsIHtcblx0ICAgICAgaWQ6IGxpc3Rib3hJZFxuXHQgICAgfSk7XG5cdCAgICBzZXRBdHRyKGZvY3VzX25vZGUsIHtcblx0ICAgICAgcm9sZTogJ2NvbWJvYm94Jyxcblx0ICAgICAgJ2FyaWEtaGFzcG9wdXAnOiAnbGlzdGJveCcsXG5cdCAgICAgICdhcmlhLWV4cGFuZGVkJzogJ2ZhbHNlJyxcblx0ICAgICAgJ2FyaWEtY29udHJvbHMnOiBsaXN0Ym94SWRcblx0ICAgIH0pO1xuXHQgICAgY29uc3QgY29udHJvbF9pZCA9IGdldElkKGZvY3VzX25vZGUsIHNlbGYuaW5wdXRJZCArICctdHMtY29udHJvbCcpO1xuXHQgICAgY29uc3QgcXVlcnkgPSBcImxhYmVsW2Zvcj0nXCIgKyBlc2NhcGVRdWVyeShzZWxmLmlucHV0SWQpICsgXCInXVwiO1xuXHQgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHF1ZXJ5KTtcblx0ICAgIGNvbnN0IGxhYmVsX2NsaWNrID0gc2VsZi5mb2N1cy5iaW5kKHNlbGYpO1xuXG5cdCAgICBpZiAobGFiZWwpIHtcblx0ICAgICAgYWRkRXZlbnQobGFiZWwsICdjbGljaycsIGxhYmVsX2NsaWNrKTtcblx0ICAgICAgc2V0QXR0cihsYWJlbCwge1xuXHQgICAgICAgIGZvcjogY29udHJvbF9pZFxuXHQgICAgICB9KTtcblx0ICAgICAgY29uc3QgbGFiZWxfaWQgPSBnZXRJZChsYWJlbCwgc2VsZi5pbnB1dElkICsgJy10cy1sYWJlbCcpO1xuXHQgICAgICBzZXRBdHRyKGZvY3VzX25vZGUsIHtcblx0ICAgICAgICAnYXJpYS1sYWJlbGxlZGJ5JzogbGFiZWxfaWRcblx0ICAgICAgfSk7XG5cdCAgICAgIHNldEF0dHIoZHJvcGRvd25fY29udGVudCwge1xuXHQgICAgICAgICdhcmlhLWxhYmVsbGVkYnknOiBsYWJlbF9pZFxuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgd3JhcHBlci5zdHlsZS53aWR0aCA9IGlucHV0LnN0eWxlLndpZHRoO1xuXG5cdCAgICBpZiAoc2VsZi5wbHVnaW5zLm5hbWVzLmxlbmd0aCkge1xuXHQgICAgICBjb25zdCBjbGFzc2VzX3BsdWdpbnMgPSAncGx1Z2luLScgKyBzZWxmLnBsdWdpbnMubmFtZXMuam9pbignIHBsdWdpbi0nKTtcblx0ICAgICAgYWRkQ2xhc3Nlcyhbd3JhcHBlciwgZHJvcGRvd25dLCBjbGFzc2VzX3BsdWdpbnMpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoKHNldHRpbmdzLm1heEl0ZW1zID09PSBudWxsIHx8IHNldHRpbmdzLm1heEl0ZW1zID4gMSkgJiYgc2VsZi5pc19zZWxlY3RfdGFnKSB7XG5cdCAgICAgIHNldEF0dHIoaW5wdXQsIHtcblx0ICAgICAgICBtdWx0aXBsZTogJ211bHRpcGxlJ1xuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNldHRpbmdzLnBsYWNlaG9sZGVyKSB7XG5cdCAgICAgIHNldEF0dHIoY29udHJvbF9pbnB1dCwge1xuXHQgICAgICAgIHBsYWNlaG9sZGVyOiBzZXR0aW5ncy5wbGFjZWhvbGRlclxuXHQgICAgICB9KTtcblx0ICAgIH0gLy8gaWYgc3BsaXRPbiB3YXMgbm90IHBhc3NlZCBpbiwgY29uc3RydWN0IGl0IGZyb20gdGhlIGRlbGltaXRlciB0byBhbGxvdyBwYXN0aW5nIHVuaXZlcnNhbGx5XG5cblxuXHQgICAgaWYgKCFzZXR0aW5ncy5zcGxpdE9uICYmIHNldHRpbmdzLmRlbGltaXRlcikge1xuXHQgICAgICBzZXR0aW5ncy5zcGxpdE9uID0gbmV3IFJlZ0V4cCgnXFxcXHMqJyArIGVzY2FwZV9yZWdleChzZXR0aW5ncy5kZWxpbWl0ZXIpICsgJytcXFxccyonKTtcblx0ICAgIH0gLy8gZGVib3VuY2UgdXNlciBkZWZpbmVkIGxvYWQoKSBpZiBsb2FkVGhyb3R0bGUgPiAwXG5cdCAgICAvLyBhZnRlciBpbml0aWFsaXplUGx1Z2lucygpIHNvIHBsdWdpbnMgY2FuIGNyZWF0ZS9tb2RpZnkgdXNlciBkZWZpbmVkIGxvYWRlcnNcblxuXG5cdCAgICBpZiAoc2V0dGluZ3MubG9hZCAmJiBzZXR0aW5ncy5sb2FkVGhyb3R0bGUpIHtcblx0ICAgICAgc2V0dGluZ3MubG9hZCA9IGxvYWREZWJvdW5jZShzZXR0aW5ncy5sb2FkLCBzZXR0aW5ncy5sb2FkVGhyb3R0bGUpO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLmNvbnRyb2xfaW5wdXQudHlwZSA9IGlucHV0LnR5cGU7XG5cdCAgICBhZGRFdmVudChkcm9wZG93biwgJ21vdXNlbW92ZScsICgpID0+IHtcblx0ICAgICAgc2VsZi5pZ25vcmVIb3ZlciA9IGZhbHNlO1xuXHQgICAgfSk7XG5cdCAgICBhZGRFdmVudChkcm9wZG93biwgJ21vdXNlZW50ZXInLCBlID0+IHtcblx0ICAgICAgdmFyIHRhcmdldF9tYXRjaCA9IHBhcmVudE1hdGNoKGUudGFyZ2V0LCAnW2RhdGEtc2VsZWN0YWJsZV0nLCBkcm9wZG93bik7XG5cdCAgICAgIGlmICh0YXJnZXRfbWF0Y2gpIHNlbGYub25PcHRpb25Ib3ZlcihlLCB0YXJnZXRfbWF0Y2gpO1xuXHQgICAgfSwge1xuXHQgICAgICBjYXB0dXJlOiB0cnVlXG5cdCAgICB9KTsgLy8gY2xpY2tpbmcgb24gYW4gb3B0aW9uIHNob3VsZCBzZWxlY3QgaXRcblxuXHQgICAgYWRkRXZlbnQoZHJvcGRvd24sICdjbGljaycsIGV2dCA9PiB7XG5cdCAgICAgIGNvbnN0IG9wdGlvbiA9IHBhcmVudE1hdGNoKGV2dC50YXJnZXQsICdbZGF0YS1zZWxlY3RhYmxlXScpO1xuXG5cdCAgICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgICBzZWxmLm9uT3B0aW9uU2VsZWN0KGV2dCwgb3B0aW9uKTtcblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChldnQsIHRydWUpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICAgIGFkZEV2ZW50KGNvbnRyb2wsICdjbGljaycsIGV2dCA9PiB7XG5cdCAgICAgIHZhciB0YXJnZXRfbWF0Y2ggPSBwYXJlbnRNYXRjaChldnQudGFyZ2V0LCAnW2RhdGEtdHMtaXRlbV0nLCBjb250cm9sKTtcblxuXHQgICAgICBpZiAodGFyZ2V0X21hdGNoICYmIHNlbGYub25JdGVtU2VsZWN0KGV2dCwgdGFyZ2V0X21hdGNoKSkge1xuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9IC8vIHJldGFpbiBmb2N1cyAoc2VlIGNvbnRyb2xfaW5wdXQgbW91c2Vkb3duKVxuXG5cblx0ICAgICAgaWYgKGNvbnRyb2xfaW5wdXQudmFsdWUgIT0gJycpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblxuXHQgICAgICBzZWxmLm9uQ2xpY2soKTtcblx0ICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgIH0pOyAvLyBrZXlkb3duIG9uIGZvY3VzX25vZGUgZm9yIGFycm93X2Rvd24vYXJyb3dfdXBcblxuXHQgICAgYWRkRXZlbnQoZm9jdXNfbm9kZSwgJ2tleWRvd24nLCBlID0+IHNlbGYub25LZXlEb3duKGUpKTsgLy8ga2V5cHJlc3MgYW5kIGlucHV0L2tleXVwXG5cblx0ICAgIGFkZEV2ZW50KGNvbnRyb2xfaW5wdXQsICdrZXlwcmVzcycsIGUgPT4gc2VsZi5vbktleVByZXNzKGUpKTtcblx0ICAgIGFkZEV2ZW50KGNvbnRyb2xfaW5wdXQsICdpbnB1dCcsIGUgPT4gc2VsZi5vbklucHV0KGUpKTtcblx0ICAgIGFkZEV2ZW50KGZvY3VzX25vZGUsICdibHVyJywgZSA9PiBzZWxmLm9uQmx1cihlKSk7XG5cdCAgICBhZGRFdmVudChmb2N1c19ub2RlLCAnZm9jdXMnLCBlID0+IHNlbGYub25Gb2N1cyhlKSk7XG5cdCAgICBhZGRFdmVudChjb250cm9sX2lucHV0LCAncGFzdGUnLCBlID0+IHNlbGYub25QYXN0ZShlKSk7XG5cblx0ICAgIGNvbnN0IGRvY19tb3VzZWRvd24gPSBldnQgPT4ge1xuXHQgICAgICAvLyBibHVyIGlmIHRhcmdldCBpcyBvdXRzaWRlIG9mIHRoaXMgaW5zdGFuY2Vcblx0ICAgICAgLy8gZHJvcGRvd24gaXMgbm90IGFsd2F5cyBpbnNpZGUgd3JhcHBlclxuXHQgICAgICBjb25zdCB0YXJnZXQgPSBldnQuY29tcG9zZWRQYXRoKClbMF07XG5cblx0ICAgICAgaWYgKCF3cmFwcGVyLmNvbnRhaW5zKHRhcmdldCkgJiYgIWRyb3Bkb3duLmNvbnRhaW5zKHRhcmdldCkpIHtcblx0ICAgICAgICBpZiAoc2VsZi5pc0ZvY3VzZWQpIHtcblx0ICAgICAgICAgIHNlbGYuYmx1cigpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHNlbGYuaW5wdXRTdGF0ZSgpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfSAvLyByZXRhaW4gZm9jdXMgYnkgcHJldmVudGluZyBuYXRpdmUgaGFuZGxpbmcuIGlmIHRoZVxuXHQgICAgICAvLyBldmVudCB0YXJnZXQgaXMgdGhlIGlucHV0IGl0IHNob3VsZCBub3QgYmUgbW9kaWZpZWQuXG5cdCAgICAgIC8vIG90aGVyd2lzZSwgdGV4dCBzZWxlY3Rpb24gd2l0aGluIHRoZSBpbnB1dCB3b24ndCB3b3JrLlxuXHQgICAgICAvLyBGaXhlcyBidWcgIzIxMiB3aGljaCBpcyBubyBjb3ZlcmVkIGJ5IHRlc3RzXG5cblxuXHQgICAgICBpZiAodGFyZ2V0ID09IGNvbnRyb2xfaW5wdXQgJiYgc2VsZi5pc09wZW4pIHtcblx0ICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIGNsaWNraW5nIGFueXdoZXJlIGluIHRoZSBjb250cm9sIHNob3VsZCBub3QgYmx1ciB0aGUgY29udHJvbF9pbnB1dCAod2hpY2ggd291bGQgY2xvc2UgdGhlIGRyb3Bkb3duKVxuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIGNvbnN0IHdpbl9zY3JvbGwgPSAoKSA9PiB7XG5cdCAgICAgIGlmIChzZWxmLmlzT3Blbikge1xuXHQgICAgICAgIHNlbGYucG9zaXRpb25Ecm9wZG93bigpO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXG5cdCAgICBhZGRFdmVudChkb2N1bWVudCwgJ21vdXNlZG93bicsIGRvY19tb3VzZWRvd24pO1xuXHQgICAgYWRkRXZlbnQod2luZG93LCAnc2Nyb2xsJywgd2luX3Njcm9sbCwgcGFzc2l2ZV9ldmVudCk7XG5cdCAgICBhZGRFdmVudCh3aW5kb3csICdyZXNpemUnLCB3aW5fc2Nyb2xsLCBwYXNzaXZlX2V2ZW50KTtcblxuXHQgICAgdGhpcy5fZGVzdHJveSA9ICgpID0+IHtcblx0ICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZG9jX21vdXNlZG93bik7XG5cdCAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB3aW5fc2Nyb2xsKTtcblx0ICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHdpbl9zY3JvbGwpO1xuXHQgICAgICBpZiAobGFiZWwpIGxhYmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbGFiZWxfY2xpY2spO1xuXHQgICAgfTsgLy8gc3RvcmUgb3JpZ2luYWwgaHRtbCBhbmQgdGFiIGluZGV4IHNvIHRoYXQgdGhleSBjYW4gYmVcblx0ICAgIC8vIHJlc3RvcmVkIHdoZW4gdGhlIGRlc3Ryb3koKSBtZXRob2QgaXMgY2FsbGVkLlxuXG5cblx0ICAgIHRoaXMucmV2ZXJ0U2V0dGluZ3MgPSB7XG5cdCAgICAgIGlubmVySFRNTDogaW5wdXQuaW5uZXJIVE1MLFxuXHQgICAgICB0YWJJbmRleDogaW5wdXQudGFiSW5kZXhcblx0ICAgIH07XG5cdCAgICBpbnB1dC50YWJJbmRleCA9IC0xO1xuXHQgICAgaW5wdXQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmVuZCcsIHNlbGYud3JhcHBlcik7XG5cdCAgICBzZWxmLnN5bmMoZmFsc2UpO1xuXHQgICAgc2V0dGluZ3MuaXRlbXMgPSBbXTtcblx0ICAgIGRlbGV0ZSBzZXR0aW5ncy5vcHRncm91cHM7XG5cdCAgICBkZWxldGUgc2V0dGluZ3Mub3B0aW9ucztcblx0ICAgIGFkZEV2ZW50KGlucHV0LCAnaW52YWxpZCcsICgpID0+IHtcblx0ICAgICAgaWYgKHNlbGYuaXNWYWxpZCkge1xuXHQgICAgICAgIHNlbGYuaXNWYWxpZCA9IGZhbHNlO1xuXHQgICAgICAgIHNlbGYuaXNJbnZhbGlkID0gdHJ1ZTtcblx0ICAgICAgICBzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICAgIHNlbGYudXBkYXRlT3JpZ2luYWxJbnB1dCgpO1xuXHQgICAgc2VsZi5yZWZyZXNoSXRlbXMoKTtcblx0ICAgIHNlbGYuY2xvc2UoZmFsc2UpO1xuXHQgICAgc2VsZi5pbnB1dFN0YXRlKCk7XG5cdCAgICBzZWxmLmlzU2V0dXAgPSB0cnVlO1xuXG5cdCAgICBpZiAoaW5wdXQuZGlzYWJsZWQpIHtcblx0ICAgICAgc2VsZi5kaXNhYmxlKCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZWxmLmVuYWJsZSgpOyAvL3NldHMgdGFiSW5kZXhcblx0ICAgIH1cblxuXHQgICAgc2VsZi5vbignY2hhbmdlJywgdGhpcy5vbkNoYW5nZSk7XG5cdCAgICBhZGRDbGFzc2VzKGlucHV0LCAndG9tc2VsZWN0ZWQnLCAndHMtaGlkZGVuLWFjY2Vzc2libGUnKTtcblx0ICAgIHNlbGYudHJpZ2dlcignaW5pdGlhbGl6ZScpOyAvLyBwcmVsb2FkIG9wdGlvbnNcblxuXHQgICAgaWYgKHNldHRpbmdzLnByZWxvYWQgPT09IHRydWUpIHtcblx0ICAgICAgc2VsZi5wcmVsb2FkKCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlZ2lzdGVyIG9wdGlvbnMgYW5kIG9wdGdyb3Vwc1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldHVwT3B0aW9ucyhvcHRpb25zID0gW10sIG9wdGdyb3VwcyA9IFtdKSB7XG5cdCAgICAvLyBidWlsZCBvcHRpb25zIHRhYmxlXG5cdCAgICB0aGlzLmFkZE9wdGlvbnMob3B0aW9ucyk7IC8vIGJ1aWxkIG9wdGdyb3VwIHRhYmxlXG5cblx0ICAgIGl0ZXJhdGUkMShvcHRncm91cHMsIG9wdGdyb3VwID0+IHtcblx0ICAgICAgdGhpcy5yZWdpc3Rlck9wdGlvbkdyb3VwKG9wdGdyb3VwKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZXRzIHVwIGRlZmF1bHQgcmVuZGVyaW5nIGZ1bmN0aW9ucy5cblx0ICAgKi9cblxuXG5cdCAgc2V0dXBUZW1wbGF0ZXMoKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgZmllbGRfbGFiZWwgPSBzZWxmLnNldHRpbmdzLmxhYmVsRmllbGQ7XG5cdCAgICB2YXIgZmllbGRfb3B0Z3JvdXAgPSBzZWxmLnNldHRpbmdzLm9wdGdyb3VwTGFiZWxGaWVsZDtcblx0ICAgIHZhciB0ZW1wbGF0ZXMgPSB7XG5cdCAgICAgICdvcHRncm91cCc6IGRhdGEgPT4ge1xuXHQgICAgICAgIGxldCBvcHRncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHQgICAgICAgIG9wdGdyb3VwLmNsYXNzTmFtZSA9ICdvcHRncm91cCc7XG5cdCAgICAgICAgb3B0Z3JvdXAuYXBwZW5kQ2hpbGQoZGF0YS5vcHRpb25zKTtcblx0ICAgICAgICByZXR1cm4gb3B0Z3JvdXA7XG5cdCAgICAgIH0sXG5cdCAgICAgICdvcHRncm91cF9oZWFkZXInOiAoZGF0YSwgZXNjYXBlKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwib3B0Z3JvdXAtaGVhZGVyXCI+JyArIGVzY2FwZShkYXRhW2ZpZWxkX29wdGdyb3VwXSkgKyAnPC9kaXY+Jztcblx0ICAgICAgfSxcblx0ICAgICAgJ29wdGlvbic6IChkYXRhLCBlc2NhcGUpID0+IHtcblx0ICAgICAgICByZXR1cm4gJzxkaXY+JyArIGVzY2FwZShkYXRhW2ZpZWxkX2xhYmVsXSkgKyAnPC9kaXY+Jztcblx0ICAgICAgfSxcblx0ICAgICAgJ2l0ZW0nOiAoZGF0YSwgZXNjYXBlKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuICc8ZGl2PicgKyBlc2NhcGUoZGF0YVtmaWVsZF9sYWJlbF0pICsgJzwvZGl2Pic7XG5cdCAgICAgIH0sXG5cdCAgICAgICdvcHRpb25fY3JlYXRlJzogKGRhdGEsIGVzY2FwZSkgPT4ge1xuXHQgICAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNyZWF0ZVwiPkFkZCA8c3Ryb25nPicgKyBlc2NhcGUoZGF0YS5pbnB1dCkgKyAnPC9zdHJvbmc+JmhlbGxpcDs8L2Rpdj4nO1xuXHQgICAgICB9LFxuXHQgICAgICAnbm9fcmVzdWx0cyc6ICgpID0+IHtcblx0ICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJuby1yZXN1bHRzXCI+Tm8gcmVzdWx0cyBmb3VuZDwvZGl2Pic7XG5cdCAgICAgIH0sXG5cdCAgICAgICdsb2FkaW5nJzogKCkgPT4ge1xuXHQgICAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cInNwaW5uZXJcIj48L2Rpdj4nO1xuXHQgICAgICB9LFxuXHQgICAgICAnbm90X2xvYWRpbmcnOiAoKSA9PiB7fSxcblx0ICAgICAgJ2Ryb3Bkb3duJzogKCkgPT4ge1xuXHQgICAgICAgIHJldHVybiAnPGRpdj48L2Rpdj4nO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAgc2VsZi5zZXR0aW5ncy5yZW5kZXIgPSBPYmplY3QuYXNzaWduKHt9LCB0ZW1wbGF0ZXMsIHNlbGYuc2V0dGluZ3MucmVuZGVyKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogTWFwcyBmaXJlZCBldmVudHMgdG8gY2FsbGJhY2tzIHByb3ZpZGVkXG5cdCAgICogaW4gdGhlIHNldHRpbmdzIHVzZWQgd2hlbiBjcmVhdGluZyB0aGUgY29udHJvbC5cblx0ICAgKi9cblxuXG5cdCAgc2V0dXBDYWxsYmFja3MoKSB7XG5cdCAgICB2YXIga2V5LCBmbjtcblx0ICAgIHZhciBjYWxsYmFja3MgPSB7XG5cdCAgICAgICdpbml0aWFsaXplJzogJ29uSW5pdGlhbGl6ZScsXG5cdCAgICAgICdjaGFuZ2UnOiAnb25DaGFuZ2UnLFxuXHQgICAgICAnaXRlbV9hZGQnOiAnb25JdGVtQWRkJyxcblx0ICAgICAgJ2l0ZW1fcmVtb3ZlJzogJ29uSXRlbVJlbW92ZScsXG5cdCAgICAgICdpdGVtX3NlbGVjdCc6ICdvbkl0ZW1TZWxlY3QnLFxuXHQgICAgICAnY2xlYXInOiAnb25DbGVhcicsXG5cdCAgICAgICdvcHRpb25fYWRkJzogJ29uT3B0aW9uQWRkJyxcblx0ICAgICAgJ29wdGlvbl9yZW1vdmUnOiAnb25PcHRpb25SZW1vdmUnLFxuXHQgICAgICAnb3B0aW9uX2NsZWFyJzogJ29uT3B0aW9uQ2xlYXInLFxuXHQgICAgICAnb3B0Z3JvdXBfYWRkJzogJ29uT3B0aW9uR3JvdXBBZGQnLFxuXHQgICAgICAnb3B0Z3JvdXBfcmVtb3ZlJzogJ29uT3B0aW9uR3JvdXBSZW1vdmUnLFxuXHQgICAgICAnb3B0Z3JvdXBfY2xlYXInOiAnb25PcHRpb25Hcm91cENsZWFyJyxcblx0ICAgICAgJ2Ryb3Bkb3duX29wZW4nOiAnb25Ecm9wZG93bk9wZW4nLFxuXHQgICAgICAnZHJvcGRvd25fY2xvc2UnOiAnb25Ecm9wZG93bkNsb3NlJyxcblx0ICAgICAgJ3R5cGUnOiAnb25UeXBlJyxcblx0ICAgICAgJ2xvYWQnOiAnb25Mb2FkJyxcblx0ICAgICAgJ2ZvY3VzJzogJ29uRm9jdXMnLFxuXHQgICAgICAnYmx1cic6ICdvbkJsdXInXG5cdCAgICB9O1xuXG5cdCAgICBmb3IgKGtleSBpbiBjYWxsYmFja3MpIHtcblx0ICAgICAgZm4gPSB0aGlzLnNldHRpbmdzW2NhbGxiYWNrc1trZXldXTtcblx0ICAgICAgaWYgKGZuKSB0aGlzLm9uKGtleSwgZm4pO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTeW5jIHRoZSBUb20gU2VsZWN0IGluc3RhbmNlIHdpdGggdGhlIG9yaWdpbmFsIGlucHV0IG9yIHNlbGVjdFxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHN5bmMoZ2V0X3NldHRpbmdzID0gdHJ1ZSkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBjb25zdCBzZXR0aW5ncyA9IGdldF9zZXR0aW5ncyA/IGdldFNldHRpbmdzKHNlbGYuaW5wdXQsIHtcblx0ICAgICAgZGVsaW1pdGVyOiBzZWxmLnNldHRpbmdzLmRlbGltaXRlclxuXHQgICAgfSkgOiBzZWxmLnNldHRpbmdzO1xuXHQgICAgc2VsZi5zZXR1cE9wdGlvbnMoc2V0dGluZ3Mub3B0aW9ucywgc2V0dGluZ3Mub3B0Z3JvdXBzKTtcblx0ICAgIHNlbGYuc2V0VmFsdWUoc2V0dGluZ3MuaXRlbXMgfHwgW10sIHRydWUpOyAvLyBzaWxlbnQgcHJldmVudHMgcmVjdXJzaW9uXG5cblx0ICAgIHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDsgLy8gc28gdXBkYXRlZCBvcHRpb25zIHdpbGwgYmUgZGlzcGxheWVkIGluIGRyb3Bkb3duXG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCB3aGVuIHRoZSBtYWluIGNvbnRyb2wgZWxlbWVudFxuXHQgICAqIGhhcyBhIGNsaWNrIGV2ZW50LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uQ2xpY2soKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cblx0ICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW1zLmxlbmd0aCA+IDApIHtcblx0ICAgICAgc2VsZi5jbGVhckFjdGl2ZUl0ZW1zKCk7XG5cdCAgICAgIHNlbGYuZm9jdXMoKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoc2VsZi5pc0ZvY3VzZWQgJiYgc2VsZi5pc09wZW4pIHtcblx0ICAgICAgc2VsZi5ibHVyKCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZWxmLmZvY3VzKCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEBkZXByZWNhdGVkIHYxLjdcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbk1vdXNlRG93bigpIHt9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sIGhhcyBiZWVuIGNoYW5nZWQuXG5cdCAgICogVGhpcyBzaG91bGQgcHJvcGFnYXRlIHRoZSBldmVudCB0byB0aGUgb3JpZ2luYWwgRE9NXG5cdCAgICogaW5wdXQgLyBzZWxlY3QgZWxlbWVudC5cblx0ICAgKi9cblxuXG5cdCAgb25DaGFuZ2UoKSB7XG5cdCAgICB0cmlnZ2VyRXZlbnQodGhpcy5pbnB1dCwgJ2lucHV0Jyk7XG5cdCAgICB0cmlnZ2VyRXZlbnQodGhpcy5pbnB1dCwgJ2NoYW5nZScpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBwYXN0ZS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvblBhc3RlKGUpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKHNlbGYuaXNJbnB1dEhpZGRlbiB8fCBzZWxmLmlzTG9ja2VkKSB7XG5cdCAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9IC8vIElmIGEgcmVnZXggb3Igc3RyaW5nIGlzIGluY2x1ZGVkLCB0aGlzIHdpbGwgc3BsaXQgdGhlIHBhc3RlZFxuXHQgICAgLy8gaW5wdXQgYW5kIGNyZWF0ZSBJdGVtcyBmb3IgZWFjaCBzZXBhcmF0ZSB2YWx1ZVxuXG5cblx0ICAgIGlmICghc2VsZi5zZXR0aW5ncy5zcGxpdE9uKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH0gLy8gV2FpdCBmb3IgcGFzdGVkIHRleHQgdG8gYmUgcmVjb2duaXplZCBpbiB2YWx1ZVxuXG5cblx0ICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuXHQgICAgICB2YXIgcGFzdGVkVGV4dCA9IHNlbGYuaW5wdXRWYWx1ZSgpO1xuXG5cdCAgICAgIGlmICghcGFzdGVkVGV4dC5tYXRjaChzZWxmLnNldHRpbmdzLnNwbGl0T24pKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cblx0ICAgICAgdmFyIHNwbGl0SW5wdXQgPSBwYXN0ZWRUZXh0LnRyaW0oKS5zcGxpdChzZWxmLnNldHRpbmdzLnNwbGl0T24pO1xuXHQgICAgICBpdGVyYXRlJDEoc3BsaXRJbnB1dCwgcGllY2UgPT4ge1xuXHQgICAgICAgIGNvbnN0IGhhc2ggPSBoYXNoX2tleShwaWVjZSk7XG5cblx0ICAgICAgICBpZiAoaGFzaCkge1xuXHQgICAgICAgICAgaWYgKHRoaXMub3B0aW9uc1twaWVjZV0pIHtcblx0ICAgICAgICAgICAgc2VsZi5hZGRJdGVtKHBpZWNlKTtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHNlbGYuY3JlYXRlSXRlbShwaWVjZSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgIH0sIDApO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBrZXlwcmVzcy5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbktleVByZXNzKGUpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKHNlbGYuaXNMb2NrZWQpIHtcblx0ICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgdmFyIGNoYXJhY3RlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlIHx8IGUud2hpY2gpO1xuXG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5jcmVhdGUgJiYgc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnbXVsdGknICYmIGNoYXJhY3RlciA9PT0gc2VsZi5zZXR0aW5ncy5kZWxpbWl0ZXIpIHtcblx0ICAgICAgc2VsZi5jcmVhdGVJdGVtKCk7XG5cdCAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IGtleWRvd24uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25LZXlEb3duKGUpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHNlbGYuaWdub3JlSG92ZXIgPSB0cnVlO1xuXG5cdCAgICBpZiAoc2VsZi5pc0xvY2tlZCkge1xuXHQgICAgICBpZiAoZS5rZXlDb2RlICE9PSBLRVlfVEFCKSB7XG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG5cdCAgICAgIC8vIGN0cmwrQTogc2VsZWN0IGFsbFxuXHQgICAgICBjYXNlIEtFWV9BOlxuXHQgICAgICAgIGlmIChpc0tleURvd24oS0VZX1NIT1JUQ1VULCBlKSkge1xuXHQgICAgICAgICAgaWYgKHNlbGYuY29udHJvbF9pbnB1dC52YWx1ZSA9PSAnJykge1xuXHQgICAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgICAgICAgc2VsZi5zZWxlY3RBbGwoKTtcblx0ICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGJyZWFrO1xuXHQgICAgICAvLyBlc2M6IGNsb3NlIGRyb3Bkb3duXG5cblx0ICAgICAgY2FzZSBLRVlfRVNDOlxuXHQgICAgICAgIGlmIChzZWxmLmlzT3Blbikge1xuXHQgICAgICAgICAgcHJldmVudERlZmF1bHQoZSwgdHJ1ZSk7XG5cdCAgICAgICAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VsZi5jbGVhckFjdGl2ZUl0ZW1zKCk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICAvLyBkb3duOiBvcGVuIGRyb3Bkb3duIG9yIG1vdmUgc2VsZWN0aW9uIGRvd25cblxuXHQgICAgICBjYXNlIEtFWV9ET1dOOlxuXHQgICAgICAgIGlmICghc2VsZi5pc09wZW4gJiYgc2VsZi5oYXNPcHRpb25zKSB7XG5cdCAgICAgICAgICBzZWxmLm9wZW4oKTtcblx0ICAgICAgICB9IGVsc2UgaWYgKHNlbGYuYWN0aXZlT3B0aW9uKSB7XG5cdCAgICAgICAgICBsZXQgbmV4dCA9IHNlbGYuZ2V0QWRqYWNlbnQoc2VsZi5hY3RpdmVPcHRpb24sIDEpO1xuXHQgICAgICAgICAgaWYgKG5leHQpIHNlbGYuc2V0QWN0aXZlT3B0aW9uKG5leHQpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgLy8gdXA6IG1vdmUgc2VsZWN0aW9uIHVwXG5cblx0ICAgICAgY2FzZSBLRVlfVVA6XG5cdCAgICAgICAgaWYgKHNlbGYuYWN0aXZlT3B0aW9uKSB7XG5cdCAgICAgICAgICBsZXQgcHJldiA9IHNlbGYuZ2V0QWRqYWNlbnQoc2VsZi5hY3RpdmVPcHRpb24sIC0xKTtcblx0ICAgICAgICAgIGlmIChwcmV2KSBzZWxmLnNldEFjdGl2ZU9wdGlvbihwcmV2KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIC8vIHJldHVybjogc2VsZWN0IGFjdGl2ZSBvcHRpb25cblxuXHQgICAgICBjYXNlIEtFWV9SRVRVUk46XG5cdCAgICAgICAgaWYgKHNlbGYuY2FuU2VsZWN0KHNlbGYuYWN0aXZlT3B0aW9uKSkge1xuXHQgICAgICAgICAgc2VsZi5vbk9wdGlvblNlbGVjdChlLCBzZWxmLmFjdGl2ZU9wdGlvbik7XG5cdCAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTsgLy8gaWYgdGhlIG9wdGlvbl9jcmVhdGU9bnVsbCwgdGhlIGRyb3Bkb3duIG1pZ2h0IGJlIGNsb3NlZFxuXHQgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5zZXR0aW5ncy5jcmVhdGUgJiYgc2VsZi5jcmVhdGVJdGVtKCkpIHtcblx0ICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpOyAvLyBkb24ndCBzdWJtaXQgZm9ybSB3aGVuIHNlYXJjaGluZyBmb3IgYSB2YWx1ZVxuXHQgICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PSBzZWxmLmNvbnRyb2xfaW5wdXQgJiYgc2VsZi5pc09wZW4pIHtcblx0ICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgLy8gbGVmdDogbW9kaWZpeSBpdGVtIHNlbGVjdGlvbiB0byB0aGUgbGVmdFxuXG5cdCAgICAgIGNhc2UgS0VZX0xFRlQ6XG5cdCAgICAgICAgc2VsZi5hZHZhbmNlU2VsZWN0aW9uKC0xLCBlKTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIC8vIHJpZ2h0OiBtb2RpZml5IGl0ZW0gc2VsZWN0aW9uIHRvIHRoZSByaWdodFxuXG5cdCAgICAgIGNhc2UgS0VZX1JJR0hUOlxuXHQgICAgICAgIHNlbGYuYWR2YW5jZVNlbGVjdGlvbigxLCBlKTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIC8vIHRhYjogc2VsZWN0IGFjdGl2ZSBvcHRpb24gYW5kL29yIGNyZWF0ZSBpdGVtXG5cblx0ICAgICAgY2FzZSBLRVlfVEFCOlxuXHQgICAgICAgIGlmIChzZWxmLnNldHRpbmdzLnNlbGVjdE9uVGFiKSB7XG5cdCAgICAgICAgICBpZiAoc2VsZi5jYW5TZWxlY3Qoc2VsZi5hY3RpdmVPcHRpb24pKSB7XG5cdCAgICAgICAgICAgIHNlbGYub25PcHRpb25TZWxlY3QoZSwgc2VsZi5hY3RpdmVPcHRpb24pOyAvLyBwcmV2ZW50IGRlZmF1bHQgW3RhYl0gYmVoYXZpb3VyIG9mIGp1bXAgdG8gdGhlIG5leHQgZmllbGRcblx0ICAgICAgICAgICAgLy8gaWYgc2VsZWN0IGlzRnVsbCwgdGhlbiB0aGUgZHJvcGRvd24gd29uJ3QgYmUgb3BlbiBhbmQgW3RhYl0gd2lsbCB3b3JrIG5vcm1hbGx5XG5cblx0ICAgICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgICAgICB9XG5cblx0ICAgICAgICAgIGlmIChzZWxmLnNldHRpbmdzLmNyZWF0ZSAmJiBzZWxmLmNyZWF0ZUl0ZW0oKSkge1xuXHQgICAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIC8vIGRlbGV0ZXxiYWNrc3BhY2U6IGRlbGV0ZSBpdGVtc1xuXG5cdCAgICAgIGNhc2UgS0VZX0JBQ0tTUEFDRTpcblx0ICAgICAgY2FzZSBLRVlfREVMRVRFOlxuXHQgICAgICAgIHNlbGYuZGVsZXRlU2VsZWN0aW9uKGUpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgIH0gLy8gZG9uJ3QgZW50ZXIgdGV4dCBpbiB0aGUgY29udHJvbF9pbnB1dCB3aGVuIGFjdGl2ZSBpdGVtcyBhcmUgc2VsZWN0ZWRcblxuXG5cdCAgICBpZiAoc2VsZi5pc0lucHV0SGlkZGVuICYmICFpc0tleURvd24oS0VZX1NIT1JUQ1VULCBlKSkge1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4ga2V5dXAuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25JbnB1dChlKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cblx0ICAgIGlmIChzZWxmLmlzTG9ja2VkKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgdmFyIHZhbHVlID0gc2VsZi5pbnB1dFZhbHVlKCk7XG5cblx0ICAgIGlmIChzZWxmLmxhc3RWYWx1ZSAhPT0gdmFsdWUpIHtcblx0ICAgICAgc2VsZi5sYXN0VmFsdWUgPSB2YWx1ZTtcblxuXHQgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5zaG91bGRMb2FkLmNhbGwoc2VsZiwgdmFsdWUpKSB7XG5cdCAgICAgICAgc2VsZi5sb2FkKHZhbHVlKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlbGYucmVmcmVzaE9wdGlvbnMoKTtcblx0ICAgICAgc2VsZi50cmlnZ2VyKCd0eXBlJywgdmFsdWUpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgd2hlbiB0aGUgdXNlciByb2xscyBvdmVyXG5cdCAgICogYW4gb3B0aW9uIGluIHRoZSBhdXRvY29tcGxldGUgZHJvcGRvd24gbWVudS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbk9wdGlvbkhvdmVyKGV2dCwgb3B0aW9uKSB7XG5cdCAgICBpZiAodGhpcy5pZ25vcmVIb3ZlcikgcmV0dXJuO1xuXHQgICAgdGhpcy5zZXRBY3RpdmVPcHRpb24ob3B0aW9uLCBmYWxzZSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IGZvY3VzLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uRm9jdXMoZSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIHdhc0ZvY3VzZWQgPSBzZWxmLmlzRm9jdXNlZDtcblxuXHQgICAgaWYgKHNlbGYuaXNEaXNhYmxlZCkge1xuXHQgICAgICBzZWxmLmJsdXIoKTtcblx0ICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNlbGYuaWdub3JlRm9jdXMpIHJldHVybjtcblx0ICAgIHNlbGYuaXNGb2N1c2VkID0gdHJ1ZTtcblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLnByZWxvYWQgPT09ICdmb2N1cycpIHNlbGYucHJlbG9hZCgpO1xuXHQgICAgaWYgKCF3YXNGb2N1c2VkKSBzZWxmLnRyaWdnZXIoJ2ZvY3VzJyk7XG5cblx0ICAgIGlmICghc2VsZi5hY3RpdmVJdGVtcy5sZW5ndGgpIHtcblx0ICAgICAgc2VsZi5zaG93SW5wdXQoKTtcblx0ICAgICAgc2VsZi5yZWZyZXNoT3B0aW9ucyghIXNlbGYuc2V0dGluZ3Mub3Blbk9uRm9jdXMpO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBibHVyLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uQmx1cihlKSB7XG5cdCAgICBpZiAoZG9jdW1lbnQuaGFzRm9jdXMoKSA9PT0gZmFsc2UpIHJldHVybjtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIGlmICghc2VsZi5pc0ZvY3VzZWQpIHJldHVybjtcblx0ICAgIHNlbGYuaXNGb2N1c2VkID0gZmFsc2U7XG5cdCAgICBzZWxmLmlnbm9yZUZvY3VzID0gZmFsc2U7XG5cblx0ICAgIHZhciBkZWFjdGl2YXRlID0gKCkgPT4ge1xuXHQgICAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICAgIHNlbGYuc2V0QWN0aXZlSXRlbSgpO1xuXHQgICAgICBzZWxmLnNldENhcmV0KHNlbGYuaXRlbXMubGVuZ3RoKTtcblx0ICAgICAgc2VsZi50cmlnZ2VyKCdibHVyJyk7XG5cdCAgICB9O1xuXG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5jcmVhdGUgJiYgc2VsZi5zZXR0aW5ncy5jcmVhdGVPbkJsdXIpIHtcblx0ICAgICAgc2VsZi5jcmVhdGVJdGVtKG51bGwsIGRlYWN0aXZhdGUpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgZGVhY3RpdmF0ZSgpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgd2hlbiB0aGUgdXNlciBjbGlja3Mgb24gYW4gb3B0aW9uXG5cdCAgICogaW4gdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93biBtZW51LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uT3B0aW9uU2VsZWN0KGV2dCwgb3B0aW9uKSB7XG5cdCAgICB2YXIgdmFsdWUsXG5cdCAgICAgICAgc2VsZiA9IHRoaXM7IC8vIHNob3VsZCBub3QgYmUgcG9zc2libGUgdG8gdHJpZ2dlciBhIG9wdGlvbiB1bmRlciBhIGRpc2FibGVkIG9wdGdyb3VwXG5cblx0ICAgIGlmIChvcHRpb24ucGFyZW50RWxlbWVudCAmJiBvcHRpb24ucGFyZW50RWxlbWVudC5tYXRjaGVzKCdbZGF0YS1kaXNhYmxlZF0nKSkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIGlmIChvcHRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdjcmVhdGUnKSkge1xuXHQgICAgICBzZWxmLmNyZWF0ZUl0ZW0obnVsbCwgKCkgPT4ge1xuXHQgICAgICAgIGlmIChzZWxmLnNldHRpbmdzLmNsb3NlQWZ0ZXJTZWxlY3QpIHtcblx0ICAgICAgICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdmFsdWUgPSBvcHRpb24uZGF0YXNldC52YWx1ZTtcblxuXHQgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgIHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblx0ICAgICAgICBzZWxmLmFkZEl0ZW0odmFsdWUpO1xuXG5cdCAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3MuY2xvc2VBZnRlclNlbGVjdCkge1xuXHQgICAgICAgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmICghc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQgJiYgZXZ0LnR5cGUgJiYgL2NsaWNrLy50ZXN0KGV2dC50eXBlKSkge1xuXHQgICAgICAgICAgc2VsZi5zZXRBY3RpdmVPcHRpb24ob3B0aW9uKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJuIHRydWUgaWYgdGhlIGdpdmVuIG9wdGlvbiBjYW4gYmUgc2VsZWN0ZWRcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjYW5TZWxlY3Qob3B0aW9uKSB7XG5cdCAgICBpZiAodGhpcy5pc09wZW4gJiYgb3B0aW9uICYmIHRoaXMuZHJvcGRvd25fY29udGVudC5jb250YWlucyhvcHRpb24pKSB7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvbiBhbiBpdGVtXG5cdCAgICogdGhhdCBoYXMgYmVlbiBzZWxlY3RlZC5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbkl0ZW1TZWxlY3QoZXZ0LCBpdGVtKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cblx0ICAgIGlmICghc2VsZi5pc0xvY2tlZCAmJiBzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdtdWx0aScpIHtcblx0ICAgICAgcHJldmVudERlZmF1bHQoZXZ0KTtcblx0ICAgICAgc2VsZi5zZXRBY3RpdmVJdGVtKGl0ZW0sIGV2dCk7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIERldGVybWluZXMgd2hldGhlciBvciBub3QgdG8gaW52b2tlXG5cdCAgICogdGhlIHVzZXItcHJvdmlkZWQgb3B0aW9uIHByb3ZpZGVyIC8gbG9hZGVyXG5cdCAgICpcblx0ICAgKiBOb3RlLCB0aGVyZSBpcyBhIHN1YnRsZSBkaWZmZXJlbmNlIGJldHdlZW5cblx0ICAgKiB0aGlzLmNhbkxvYWQoKSBhbmQgdGhpcy5zZXR0aW5ncy5zaG91bGRMb2FkKCk7XG5cdCAgICpcblx0ICAgKlx0LSBzZXR0aW5ncy5zaG91bGRMb2FkKCkgaXMgYSB1c2VyLWlucHV0IHZhbGlkYXRvci5cblx0ICAgKlx0V2hlbiBmYWxzZSBpcyByZXR1cm5lZCwgdGhlIG5vdF9sb2FkaW5nIHRlbXBsYXRlXG5cdCAgICpcdHdpbGwgYmUgYWRkZWQgdG8gdGhlIGRyb3Bkb3duXG5cdCAgICpcblx0ICAgKlx0LSBjYW5Mb2FkKCkgaXMgbG93ZXIgbGV2ZWwgdmFsaWRhdG9yIHRoYXQgY2hlY2tzXG5cdCAgICogXHR0aGUgVG9tIFNlbGVjdCBpbnN0YW5jZS4gVGhlcmUgaXMgbm8gaW5oZXJlbnQgdXNlclxuXHQgICAqXHRmZWVkYmFjayB3aGVuIGNhbkxvYWQgcmV0dXJucyBmYWxzZVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNhbkxvYWQodmFsdWUpIHtcblx0ICAgIGlmICghdGhpcy5zZXR0aW5ncy5sb2FkKSByZXR1cm4gZmFsc2U7XG5cdCAgICBpZiAodGhpcy5sb2FkZWRTZWFyY2hlcy5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHJldHVybiBmYWxzZTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBJbnZva2VzIHRoZSB1c2VyLXByb3ZpZGVkIG9wdGlvbiBwcm92aWRlciAvIGxvYWRlci5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBsb2FkKHZhbHVlKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIGlmICghc2VsZi5jYW5Mb2FkKHZhbHVlKSkgcmV0dXJuO1xuXHQgICAgYWRkQ2xhc3NlcyhzZWxmLndyYXBwZXIsIHNlbGYuc2V0dGluZ3MubG9hZGluZ0NsYXNzKTtcblx0ICAgIHNlbGYubG9hZGluZysrO1xuXHQgICAgY29uc3QgY2FsbGJhY2sgPSBzZWxmLmxvYWRDYWxsYmFjay5iaW5kKHNlbGYpO1xuXHQgICAgc2VsZi5zZXR0aW5ncy5sb2FkLmNhbGwoc2VsZiwgdmFsdWUsIGNhbGxiYWNrKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogSW52b2tlZCBieSB0aGUgdXNlci1wcm92aWRlZCBvcHRpb24gcHJvdmlkZXJcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBsb2FkQ2FsbGJhY2sob3B0aW9ucywgb3B0Z3JvdXBzKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIHNlbGYubG9hZGluZyA9IE1hdGgubWF4KHNlbGYubG9hZGluZyAtIDEsIDApO1xuXHQgICAgc2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXHQgICAgc2VsZi5jbGVhckFjdGl2ZU9wdGlvbigpOyAvLyB3aGVuIG5ldyByZXN1bHRzIGxvYWQsIGZvY3VzIHNob3VsZCBiZSBvbiBmaXJzdCBvcHRpb25cblxuXHQgICAgc2VsZi5zZXR1cE9wdGlvbnMob3B0aW9ucywgb3B0Z3JvdXBzKTtcblx0ICAgIHNlbGYucmVmcmVzaE9wdGlvbnMoc2VsZi5pc0ZvY3VzZWQgJiYgIXNlbGYuaXNJbnB1dEhpZGRlbik7XG5cblx0ICAgIGlmICghc2VsZi5sb2FkaW5nKSB7XG5cdCAgICAgIHJlbW92ZUNsYXNzZXMoc2VsZi53cmFwcGVyLCBzZWxmLnNldHRpbmdzLmxvYWRpbmdDbGFzcyk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYudHJpZ2dlcignbG9hZCcsIG9wdGlvbnMsIG9wdGdyb3Vwcyk7XG5cdCAgfVxuXG5cdCAgcHJlbG9hZCgpIHtcblx0ICAgIHZhciBjbGFzc0xpc3QgPSB0aGlzLndyYXBwZXIuY2xhc3NMaXN0O1xuXHQgICAgaWYgKGNsYXNzTGlzdC5jb250YWlucygncHJlbG9hZGVkJykpIHJldHVybjtcblx0ICAgIGNsYXNzTGlzdC5hZGQoJ3ByZWxvYWRlZCcpO1xuXHQgICAgdGhpcy5sb2FkKCcnKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2V0cyB0aGUgaW5wdXQgZmllbGQgb2YgdGhlIGNvbnRyb2wgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXRUZXh0Ym94VmFsdWUodmFsdWUgPSAnJykge1xuXHQgICAgdmFyIGlucHV0ID0gdGhpcy5jb250cm9sX2lucHV0O1xuXHQgICAgdmFyIGNoYW5nZWQgPSBpbnB1dC52YWx1ZSAhPT0gdmFsdWU7XG5cblx0ICAgIGlmIChjaGFuZ2VkKSB7XG5cdCAgICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XG5cdCAgICAgIHRyaWdnZXJFdmVudChpbnB1dCwgJ3VwZGF0ZScpO1xuXHQgICAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbC4gSWYgbXVsdGlwbGUgaXRlbXNcblx0ICAgKiBjYW4gYmUgc2VsZWN0ZWQgKGUuZy4gPHNlbGVjdCBtdWx0aXBsZT4pLCB0aGlzIHJldHVybnNcblx0ICAgKiBhbiBhcnJheS4gSWYgb25seSBvbmUgaXRlbSBjYW4gYmUgc2VsZWN0ZWQsIHRoaXNcblx0ICAgKiByZXR1cm5zIGEgc3RyaW5nLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGdldFZhbHVlKCkge1xuXHQgICAgaWYgKHRoaXMuaXNfc2VsZWN0X3RhZyAmJiB0aGlzLmlucHV0Lmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKSkge1xuXHQgICAgICByZXR1cm4gdGhpcy5pdGVtcztcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHRoaXMuaXRlbXMuam9pbih0aGlzLnNldHRpbmdzLmRlbGltaXRlcik7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlc2V0cyB0aGUgc2VsZWN0ZWQgaXRlbXMgdG8gdGhlIGdpdmVuIHZhbHVlLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldFZhbHVlKHZhbHVlLCBzaWxlbnQpIHtcblx0ICAgIHZhciBldmVudHMgPSBzaWxlbnQgPyBbXSA6IFsnY2hhbmdlJ107XG5cdCAgICBkZWJvdW5jZV9ldmVudHModGhpcywgZXZlbnRzLCAoKSA9PiB7XG5cdCAgICAgIHRoaXMuY2xlYXIoc2lsZW50KTtcblx0ICAgICAgdGhpcy5hZGRJdGVtcyh2YWx1ZSwgc2lsZW50KTtcblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXNldHMgdGhlIG51bWJlciBvZiBtYXggaXRlbXMgdG8gdGhlIGdpdmVuIHZhbHVlXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2V0TWF4SXRlbXModmFsdWUpIHtcblx0ICAgIGlmICh2YWx1ZSA9PT0gMCkgdmFsdWUgPSBudWxsOyAvL3Jlc2V0IHRvIHVubGltaXRlZCBpdGVtcy5cblxuXHQgICAgdGhpcy5zZXR0aW5ncy5tYXhJdGVtcyA9IHZhbHVlO1xuXHQgICAgdGhpcy5yZWZyZXNoU3RhdGUoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2V0cyB0aGUgc2VsZWN0ZWQgaXRlbS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXRBY3RpdmVJdGVtKGl0ZW0sIGUpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBldmVudE5hbWU7XG5cdCAgICB2YXIgaSwgYmVnaW4sIGVuZCwgc3dhcDtcblx0ICAgIHZhciBsYXN0O1xuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScpIHJldHVybjsgLy8gY2xlYXIgdGhlIGFjdGl2ZSBzZWxlY3Rpb25cblxuXHQgICAgaWYgKCFpdGVtKSB7XG5cdCAgICAgIHNlbGYuY2xlYXJBY3RpdmVJdGVtcygpO1xuXG5cdCAgICAgIGlmIChzZWxmLmlzRm9jdXNlZCkge1xuXHQgICAgICAgIHNlbGYuc2hvd0lucHV0KCk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm47XG5cdCAgICB9IC8vIG1vZGlmeSBzZWxlY3Rpb25cblxuXG5cdCAgICBldmVudE5hbWUgPSBlICYmIGUudHlwZS50b0xvd2VyQ2FzZSgpO1xuXG5cdCAgICBpZiAoZXZlbnROYW1lID09PSAnY2xpY2snICYmIGlzS2V5RG93bignc2hpZnRLZXknLCBlKSAmJiBzZWxmLmFjdGl2ZUl0ZW1zLmxlbmd0aCkge1xuXHQgICAgICBsYXN0ID0gc2VsZi5nZXRMYXN0QWN0aXZlKCk7XG5cdCAgICAgIGJlZ2luID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChzZWxmLmNvbnRyb2wuY2hpbGRyZW4sIGxhc3QpO1xuXHQgICAgICBlbmQgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHNlbGYuY29udHJvbC5jaGlsZHJlbiwgaXRlbSk7XG5cblx0ICAgICAgaWYgKGJlZ2luID4gZW5kKSB7XG5cdCAgICAgICAgc3dhcCA9IGJlZ2luO1xuXHQgICAgICAgIGJlZ2luID0gZW5kO1xuXHQgICAgICAgIGVuZCA9IHN3YXA7XG5cdCAgICAgIH1cblxuXHQgICAgICBmb3IgKGkgPSBiZWdpbjsgaSA8PSBlbmQ7IGkrKykge1xuXHQgICAgICAgIGl0ZW0gPSBzZWxmLmNvbnRyb2wuY2hpbGRyZW5baV07XG5cblx0ICAgICAgICBpZiAoc2VsZi5hY3RpdmVJdGVtcy5pbmRleE9mKGl0ZW0pID09PSAtMSkge1xuXHQgICAgICAgICAgc2VsZi5zZXRBY3RpdmVJdGVtQ2xhc3MoaXRlbSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gJ2NsaWNrJyAmJiBpc0tleURvd24oS0VZX1NIT1JUQ1VULCBlKSB8fCBldmVudE5hbWUgPT09ICdrZXlkb3duJyAmJiBpc0tleURvd24oJ3NoaWZ0S2V5JywgZSkpIHtcblx0ICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHQgICAgICAgIHNlbGYucmVtb3ZlQWN0aXZlSXRlbShpdGVtKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW1DbGFzcyhpdGVtKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2VsZi5jbGVhckFjdGl2ZUl0ZW1zKCk7XG5cdCAgICAgIHNlbGYuc2V0QWN0aXZlSXRlbUNsYXNzKGl0ZW0pO1xuXHQgICAgfSAvLyBlbnN1cmUgY29udHJvbCBoYXMgZm9jdXNcblxuXG5cdCAgICBzZWxmLmhpZGVJbnB1dCgpO1xuXG5cdCAgICBpZiAoIXNlbGYuaXNGb2N1c2VkKSB7XG5cdCAgICAgIHNlbGYuZm9jdXMoKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2V0IHRoZSBhY3RpdmUgYW5kIGxhc3QtYWN0aXZlIGNsYXNzZXNcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXRBY3RpdmVJdGVtQ2xhc3MoaXRlbSkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBjb25zdCBsYXN0X2FjdGl2ZSA9IHNlbGYuY29udHJvbC5xdWVyeVNlbGVjdG9yKCcubGFzdC1hY3RpdmUnKTtcblx0ICAgIGlmIChsYXN0X2FjdGl2ZSkgcmVtb3ZlQ2xhc3NlcyhsYXN0X2FjdGl2ZSwgJ2xhc3QtYWN0aXZlJyk7XG5cdCAgICBhZGRDbGFzc2VzKGl0ZW0sICdhY3RpdmUgbGFzdC1hY3RpdmUnKTtcblx0ICAgIHNlbGYudHJpZ2dlcignaXRlbV9zZWxlY3QnLCBpdGVtKTtcblxuXHQgICAgaWYgKHNlbGYuYWN0aXZlSXRlbXMuaW5kZXhPZihpdGVtKSA9PSAtMSkge1xuXHQgICAgICBzZWxmLmFjdGl2ZUl0ZW1zLnB1c2goaXRlbSk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlbW92ZSBhY3RpdmUgaXRlbVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHJlbW92ZUFjdGl2ZUl0ZW0oaXRlbSkge1xuXHQgICAgdmFyIGlkeCA9IHRoaXMuYWN0aXZlSXRlbXMuaW5kZXhPZihpdGVtKTtcblx0ICAgIHRoaXMuYWN0aXZlSXRlbXMuc3BsaWNlKGlkeCwgMSk7XG5cdCAgICByZW1vdmVDbGFzc2VzKGl0ZW0sICdhY3RpdmUnKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQ2xlYXJzIGFsbCB0aGUgYWN0aXZlIGl0ZW1zXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY2xlYXJBY3RpdmVJdGVtcygpIHtcblx0ICAgIHJlbW92ZUNsYXNzZXModGhpcy5hY3RpdmVJdGVtcywgJ2FjdGl2ZScpO1xuXHQgICAgdGhpcy5hY3RpdmVJdGVtcyA9IFtdO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZXRzIHRoZSBzZWxlY3RlZCBpdGVtIGluIHRoZSBkcm9wZG93biBtZW51XG5cdCAgICogb2YgYXZhaWxhYmxlIG9wdGlvbnMuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2V0QWN0aXZlT3B0aW9uKG9wdGlvbiwgc2Nyb2xsID0gdHJ1ZSkge1xuXHQgICAgaWYgKG9wdGlvbiA9PT0gdGhpcy5hY3RpdmVPcHRpb24pIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLmNsZWFyQWN0aXZlT3B0aW9uKCk7XG5cdCAgICBpZiAoIW9wdGlvbikgcmV0dXJuO1xuXHQgICAgdGhpcy5hY3RpdmVPcHRpb24gPSBvcHRpb247XG5cdCAgICBzZXRBdHRyKHRoaXMuZm9jdXNfbm9kZSwge1xuXHQgICAgICAnYXJpYS1hY3RpdmVkZXNjZW5kYW50Jzogb3B0aW9uLmdldEF0dHJpYnV0ZSgnaWQnKVxuXHQgICAgfSk7XG5cdCAgICBzZXRBdHRyKG9wdGlvbiwge1xuXHQgICAgICAnYXJpYS1zZWxlY3RlZCc6ICd0cnVlJ1xuXHQgICAgfSk7XG5cdCAgICBhZGRDbGFzc2VzKG9wdGlvbiwgJ2FjdGl2ZScpO1xuXHQgICAgaWYgKHNjcm9sbCkgdGhpcy5zY3JvbGxUb09wdGlvbihvcHRpb24pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZXRzIHRoZSBkcm9wZG93bl9jb250ZW50IHNjcm9sbFRvcCB0byBkaXNwbGF5IHRoZSBvcHRpb25cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzY3JvbGxUb09wdGlvbihvcHRpb24sIGJlaGF2aW9yKSB7XG5cdCAgICBpZiAoIW9wdGlvbikgcmV0dXJuO1xuXHQgICAgY29uc3QgY29udGVudCA9IHRoaXMuZHJvcGRvd25fY29udGVudDtcblx0ICAgIGNvbnN0IGhlaWdodF9tZW51ID0gY29udGVudC5jbGllbnRIZWlnaHQ7XG5cdCAgICBjb25zdCBzY3JvbGxUb3AgPSBjb250ZW50LnNjcm9sbFRvcCB8fCAwO1xuXHQgICAgY29uc3QgaGVpZ2h0X2l0ZW0gPSBvcHRpb24ub2Zmc2V0SGVpZ2h0O1xuXHQgICAgY29uc3QgeSA9IG9wdGlvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBjb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHNjcm9sbFRvcDtcblxuXHQgICAgaWYgKHkgKyBoZWlnaHRfaXRlbSA+IGhlaWdodF9tZW51ICsgc2Nyb2xsVG9wKSB7XG5cdCAgICAgIHRoaXMuc2Nyb2xsKHkgLSBoZWlnaHRfbWVudSArIGhlaWdodF9pdGVtLCBiZWhhdmlvcik7XG5cdCAgICB9IGVsc2UgaWYgKHkgPCBzY3JvbGxUb3ApIHtcblx0ICAgICAgdGhpcy5zY3JvbGwoeSwgYmVoYXZpb3IpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTY3JvbGwgdGhlIGRyb3Bkb3duIHRvIHRoZSBnaXZlbiBwb3NpdGlvblxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNjcm9sbChzY3JvbGxUb3AsIGJlaGF2aW9yKSB7XG5cdCAgICBjb25zdCBjb250ZW50ID0gdGhpcy5kcm9wZG93bl9jb250ZW50O1xuXG5cdCAgICBpZiAoYmVoYXZpb3IpIHtcblx0ICAgICAgY29udGVudC5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IGJlaGF2aW9yO1xuXHQgICAgfVxuXG5cdCAgICBjb250ZW50LnNjcm9sbFRvcCA9IHNjcm9sbFRvcDtcblx0ICAgIGNvbnRlbnQuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnJztcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQ2xlYXJzIHRoZSBhY3RpdmUgb3B0aW9uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY2xlYXJBY3RpdmVPcHRpb24oKSB7XG5cdCAgICBpZiAodGhpcy5hY3RpdmVPcHRpb24pIHtcblx0ICAgICAgcmVtb3ZlQ2xhc3Nlcyh0aGlzLmFjdGl2ZU9wdGlvbiwgJ2FjdGl2ZScpO1xuXHQgICAgICBzZXRBdHRyKHRoaXMuYWN0aXZlT3B0aW9uLCB7XG5cdCAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiBudWxsXG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLmFjdGl2ZU9wdGlvbiA9IG51bGw7XG5cdCAgICBzZXRBdHRyKHRoaXMuZm9jdXNfbm9kZSwge1xuXHQgICAgICAnYXJpYS1hY3RpdmVkZXNjZW5kYW50JzogbnVsbFxuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNlbGVjdHMgYWxsIGl0ZW1zIChDVFJMICsgQSkuXG5cdCAgICovXG5cblxuXHQgIHNlbGVjdEFsbCgpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScpIHJldHVybjtcblx0ICAgIGNvbnN0IGFjdGl2ZUl0ZW1zID0gc2VsZi5jb250cm9sQ2hpbGRyZW4oKTtcblx0ICAgIGlmICghYWN0aXZlSXRlbXMubGVuZ3RoKSByZXR1cm47XG5cdCAgICBzZWxmLmhpZGVJbnB1dCgpO1xuXHQgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgc2VsZi5hY3RpdmVJdGVtcyA9IGFjdGl2ZUl0ZW1zO1xuXHQgICAgaXRlcmF0ZSQxKGFjdGl2ZUl0ZW1zLCBpdGVtID0+IHtcblx0ICAgICAgc2VsZi5zZXRBY3RpdmVJdGVtQ2xhc3MoaXRlbSk7XG5cdCAgICB9KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogRGV0ZXJtaW5lcyBpZiB0aGUgY29udHJvbF9pbnB1dCBzaG91bGQgYmUgaW4gYSBoaWRkZW4gb3IgdmlzaWJsZSBzdGF0ZVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGlucHV0U3RhdGUoKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBpZiAoIXNlbGYuY29udHJvbC5jb250YWlucyhzZWxmLmNvbnRyb2xfaW5wdXQpKSByZXR1cm47XG5cdCAgICBzZXRBdHRyKHNlbGYuY29udHJvbF9pbnB1dCwge1xuXHQgICAgICBwbGFjZWhvbGRlcjogc2VsZi5zZXR0aW5ncy5wbGFjZWhvbGRlclxuXHQgICAgfSk7XG5cblx0ICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW1zLmxlbmd0aCA+IDAgfHwgIXNlbGYuaXNGb2N1c2VkICYmIHNlbGYuc2V0dGluZ3MuaGlkZVBsYWNlaG9sZGVyICYmIHNlbGYuaXRlbXMubGVuZ3RoID4gMCkge1xuXHQgICAgICBzZWxmLnNldFRleHRib3hWYWx1ZSgpO1xuXHQgICAgICBzZWxmLmlzSW5wdXRIaWRkZW4gPSB0cnVlO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKHNlbGYuc2V0dGluZ3MuaGlkZVBsYWNlaG9sZGVyICYmIHNlbGYuaXRlbXMubGVuZ3RoID4gMCkge1xuXHQgICAgICAgIHNldEF0dHIoc2VsZi5jb250cm9sX2lucHV0LCB7XG5cdCAgICAgICAgICBwbGFjZWhvbGRlcjogJydcblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlbGYuaXNJbnB1dEhpZGRlbiA9IGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLndyYXBwZXIuY2xhc3NMaXN0LnRvZ2dsZSgnaW5wdXQtaGlkZGVuJywgc2VsZi5pc0lucHV0SGlkZGVuKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogSGlkZXMgdGhlIGlucHV0IGVsZW1lbnQgb3V0IG9mIHZpZXcsIHdoaWxlXG5cdCAgICogcmV0YWluaW5nIGl0cyBmb2N1cy5cblx0ICAgKiBAZGVwcmVjYXRlZCAxLjNcblx0ICAgKi9cblxuXG5cdCAgaGlkZUlucHV0KCkge1xuXHQgICAgdGhpcy5pbnB1dFN0YXRlKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlc3RvcmVzIGlucHV0IHZpc2liaWxpdHkuXG5cdCAgICogQGRlcHJlY2F0ZWQgMS4zXG5cdCAgICovXG5cblxuXHQgIHNob3dJbnB1dCgpIHtcblx0ICAgIHRoaXMuaW5wdXRTdGF0ZSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBHZXQgdGhlIGlucHV0IHZhbHVlXG5cdCAgICovXG5cblxuXHQgIGlucHV0VmFsdWUoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5jb250cm9sX2lucHV0LnZhbHVlLnRyaW0oKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogR2l2ZXMgdGhlIGNvbnRyb2wgZm9jdXMuXG5cdCAgICovXG5cblxuXHQgIGZvY3VzKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKHNlbGYuaXNEaXNhYmxlZCkgcmV0dXJuO1xuXHQgICAgc2VsZi5pZ25vcmVGb2N1cyA9IHRydWU7XG5cblx0ICAgIGlmIChzZWxmLmNvbnRyb2xfaW5wdXQub2Zmc2V0V2lkdGgpIHtcblx0ICAgICAgc2VsZi5jb250cm9sX2lucHV0LmZvY3VzKCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZWxmLmZvY3VzX25vZGUuZm9jdXMoKTtcblx0ICAgIH1cblxuXHQgICAgc2V0VGltZW91dCgoKSA9PiB7XG5cdCAgICAgIHNlbGYuaWdub3JlRm9jdXMgPSBmYWxzZTtcblx0ICAgICAgc2VsZi5vbkZvY3VzKCk7XG5cdCAgICB9LCAwKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogRm9yY2VzIHRoZSBjb250cm9sIG91dCBvZiBmb2N1cy5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBibHVyKCkge1xuXHQgICAgdGhpcy5mb2N1c19ub2RlLmJsdXIoKTtcblx0ICAgIHRoaXMub25CbHVyKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHNjb3JlcyBhbiBvYmplY3Rcblx0ICAgKiB0byBzaG93IGhvdyBnb29kIG9mIGEgbWF0Y2ggaXQgaXMgdG8gdGhlXG5cdCAgICogcHJvdmlkZWQgcXVlcnkuXG5cdCAgICpcblx0ICAgKiBAcmV0dXJuIHtmdW5jdGlvbn1cblx0ICAgKi9cblxuXG5cdCAgZ2V0U2NvcmVGdW5jdGlvbihxdWVyeSkge1xuXHQgICAgcmV0dXJuIHRoaXMuc2lmdGVyLmdldFNjb3JlRnVuY3Rpb24ocXVlcnksIHRoaXMuZ2V0U2VhcmNoT3B0aW9ucygpKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJucyBzZWFyY2ggb3B0aW9ucyBmb3Igc2lmdGVyICh0aGUgc3lzdGVtXG5cdCAgICogZm9yIHNjb3JpbmcgYW5kIHNvcnRpbmcgcmVzdWx0cykuXG5cdCAgICpcblx0ICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9vcmNoaWRqcy9zaWZ0ZXIuanNcblx0ICAgKiBAcmV0dXJuIHtvYmplY3R9XG5cdCAgICovXG5cblxuXHQgIGdldFNlYXJjaE9wdGlvbnMoKSB7XG5cdCAgICB2YXIgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzO1xuXHQgICAgdmFyIHNvcnQgPSBzZXR0aW5ncy5zb3J0RmllbGQ7XG5cblx0ICAgIGlmICh0eXBlb2Ygc2V0dGluZ3Muc29ydEZpZWxkID09PSAnc3RyaW5nJykge1xuXHQgICAgICBzb3J0ID0gW3tcblx0ICAgICAgICBmaWVsZDogc2V0dGluZ3Muc29ydEZpZWxkXG5cdCAgICAgIH1dO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICBmaWVsZHM6IHNldHRpbmdzLnNlYXJjaEZpZWxkLFxuXHQgICAgICBjb25qdW5jdGlvbjogc2V0dGluZ3Muc2VhcmNoQ29uanVuY3Rpb24sXG5cdCAgICAgIHNvcnQ6IHNvcnQsXG5cdCAgICAgIG5lc3Rpbmc6IHNldHRpbmdzLm5lc3Rpbmdcblx0ICAgIH07XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNlYXJjaGVzIHRocm91Z2ggYXZhaWxhYmxlIG9wdGlvbnMgYW5kIHJldHVybnNcblx0ICAgKiBhIHNvcnRlZCBhcnJheSBvZiBtYXRjaGVzLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNlYXJjaChxdWVyeSkge1xuXHQgICAgdmFyIHJlc3VsdCwgY2FsY3VsYXRlU2NvcmU7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgb3B0aW9ucyA9IHRoaXMuZ2V0U2VhcmNoT3B0aW9ucygpOyAvLyB2YWxpZGF0ZSB1c2VyLXByb3ZpZGVkIHJlc3VsdCBzY29yaW5nIGZ1bmN0aW9uXG5cblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLnNjb3JlKSB7XG5cdCAgICAgIGNhbGN1bGF0ZVNjb3JlID0gc2VsZi5zZXR0aW5ncy5zY29yZS5jYWxsKHNlbGYsIHF1ZXJ5KTtcblxuXHQgICAgICBpZiAodHlwZW9mIGNhbGN1bGF0ZVNjb3JlICE9PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUb20gU2VsZWN0IFwic2NvcmVcIiBzZXR0aW5nIG11c3QgYmUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBmdW5jdGlvbicpO1xuXHQgICAgICB9XG5cdCAgICB9IC8vIHBlcmZvcm0gc2VhcmNoXG5cblxuXHQgICAgaWYgKHF1ZXJ5ICE9PSBzZWxmLmxhc3RRdWVyeSkge1xuXHQgICAgICBzZWxmLmxhc3RRdWVyeSA9IHF1ZXJ5O1xuXHQgICAgICByZXN1bHQgPSBzZWxmLnNpZnRlci5zZWFyY2gocXVlcnksIE9iamVjdC5hc3NpZ24ob3B0aW9ucywge1xuXHQgICAgICAgIHNjb3JlOiBjYWxjdWxhdGVTY29yZVxuXHQgICAgICB9KSk7XG5cdCAgICAgIHNlbGYuY3VycmVudFJlc3VsdHMgPSByZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXN1bHQgPSBPYmplY3QuYXNzaWduKHt9LCBzZWxmLmN1cnJlbnRSZXN1bHRzKTtcblx0ICAgIH0gLy8gZmlsdGVyIG91dCBzZWxlY3RlZCBpdGVtc1xuXG5cblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLmhpZGVTZWxlY3RlZCkge1xuXHQgICAgICByZXN1bHQuaXRlbXMgPSByZXN1bHQuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xuXHQgICAgICAgIGxldCBoYXNoZWQgPSBoYXNoX2tleShpdGVtLmlkKTtcblx0ICAgICAgICByZXR1cm4gIShoYXNoZWQgJiYgc2VsZi5pdGVtcy5pbmRleE9mKGhhc2hlZCkgIT09IC0xKTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlZnJlc2hlcyB0aGUgbGlzdCBvZiBhdmFpbGFibGUgb3B0aW9ucyBzaG93blxuXHQgICAqIGluIHRoZSBhdXRvY29tcGxldGUgZHJvcGRvd24gbWVudS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICByZWZyZXNoT3B0aW9ucyh0cmlnZ2VyRHJvcGRvd24gPSB0cnVlKSB7XG5cdCAgICB2YXIgaSwgaiwgaywgbiwgb3B0Z3JvdXAsIG9wdGdyb3VwcywgaHRtbCwgaGFzX2NyZWF0ZV9vcHRpb24sIGFjdGl2ZV9ncm91cDtcblx0ICAgIHZhciBjcmVhdGU7XG5cdCAgICBjb25zdCBncm91cHMgPSB7fTtcblx0ICAgIGNvbnN0IGdyb3Vwc19vcmRlciA9IFtdO1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIHF1ZXJ5ID0gc2VsZi5pbnB1dFZhbHVlKCk7XG5cdCAgICBjb25zdCBzYW1lX3F1ZXJ5ID0gcXVlcnkgPT09IHNlbGYubGFzdFF1ZXJ5IHx8IHF1ZXJ5ID09ICcnICYmIHNlbGYubGFzdFF1ZXJ5ID09IG51bGw7XG5cdCAgICB2YXIgcmVzdWx0cyA9IHNlbGYuc2VhcmNoKHF1ZXJ5KTtcblx0ICAgIHZhciBhY3RpdmVfb3B0aW9uID0gbnVsbDtcblx0ICAgIHZhciBzaG93X2Ryb3Bkb3duID0gc2VsZi5zZXR0aW5ncy5zaG91bGRPcGVuIHx8IGZhbHNlO1xuXHQgICAgdmFyIGRyb3Bkb3duX2NvbnRlbnQgPSBzZWxmLmRyb3Bkb3duX2NvbnRlbnQ7XG5cblx0ICAgIGlmIChzYW1lX3F1ZXJ5KSB7XG5cdCAgICAgIGFjdGl2ZV9vcHRpb24gPSBzZWxmLmFjdGl2ZU9wdGlvbjtcblxuXHQgICAgICBpZiAoYWN0aXZlX29wdGlvbikge1xuXHQgICAgICAgIGFjdGl2ZV9ncm91cCA9IGFjdGl2ZV9vcHRpb24uY2xvc2VzdCgnW2RhdGEtZ3JvdXBdJyk7XG5cdCAgICAgIH1cblx0ICAgIH0gLy8gYnVpbGQgbWFya3VwXG5cblxuXHQgICAgbiA9IHJlc3VsdHMuaXRlbXMubGVuZ3RoO1xuXG5cdCAgICBpZiAodHlwZW9mIHNlbGYuc2V0dGluZ3MubWF4T3B0aW9ucyA9PT0gJ251bWJlcicpIHtcblx0ICAgICAgbiA9IE1hdGgubWluKG4sIHNlbGYuc2V0dGluZ3MubWF4T3B0aW9ucyk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChuID4gMCkge1xuXHQgICAgICBzaG93X2Ryb3Bkb3duID0gdHJ1ZTtcblx0ICAgIH0gLy8gcmVuZGVyIGFuZCBncm91cCBhdmFpbGFibGUgb3B0aW9ucyBpbmRpdmlkdWFsbHlcblxuXG5cdCAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG5cdCAgICAgIC8vIGdldCBvcHRpb24gZG9tIGVsZW1lbnRcblx0ICAgICAgbGV0IGl0ZW0gPSByZXN1bHRzLml0ZW1zW2ldO1xuXHQgICAgICBpZiAoIWl0ZW0pIGNvbnRpbnVlO1xuXHQgICAgICBsZXQgb3B0X3ZhbHVlID0gaXRlbS5pZDtcblx0ICAgICAgbGV0IG9wdGlvbiA9IHNlbGYub3B0aW9uc1tvcHRfdmFsdWVdO1xuXHQgICAgICBpZiAob3B0aW9uID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuXHQgICAgICBsZXQgb3B0X2hhc2ggPSBnZXRfaGFzaChvcHRfdmFsdWUpO1xuXHQgICAgICBsZXQgb3B0aW9uX2VsID0gc2VsZi5nZXRPcHRpb24ob3B0X2hhc2gsIHRydWUpOyAvLyB0b2dnbGUgJ3NlbGVjdGVkJyBjbGFzc1xuXG5cdCAgICAgIGlmICghc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQpIHtcblx0ICAgICAgICBvcHRpb25fZWwuY2xhc3NMaXN0LnRvZ2dsZSgnc2VsZWN0ZWQnLCBzZWxmLml0ZW1zLmluY2x1ZGVzKG9wdF9oYXNoKSk7XG5cdCAgICAgIH1cblxuXHQgICAgICBvcHRncm91cCA9IG9wdGlvbltzZWxmLnNldHRpbmdzLm9wdGdyb3VwRmllbGRdIHx8ICcnO1xuXHQgICAgICBvcHRncm91cHMgPSBBcnJheS5pc0FycmF5KG9wdGdyb3VwKSA/IG9wdGdyb3VwIDogW29wdGdyb3VwXTtcblxuXHQgICAgICBmb3IgKGogPSAwLCBrID0gb3B0Z3JvdXBzICYmIG9wdGdyb3Vwcy5sZW5ndGg7IGogPCBrOyBqKyspIHtcblx0ICAgICAgICBvcHRncm91cCA9IG9wdGdyb3Vwc1tqXTtcblxuXHQgICAgICAgIGlmICghc2VsZi5vcHRncm91cHMuaGFzT3duUHJvcGVydHkob3B0Z3JvdXApKSB7XG5cdCAgICAgICAgICBvcHRncm91cCA9ICcnO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGxldCBncm91cF9mcmFnbWVudCA9IGdyb3Vwc1tvcHRncm91cF07XG5cblx0ICAgICAgICBpZiAoZ3JvdXBfZnJhZ21lbnQgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgZ3JvdXBfZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdCAgICAgICAgICBncm91cHNfb3JkZXIucHVzaChvcHRncm91cCk7XG5cdCAgICAgICAgfSAvLyBub2RlcyBjYW4gb25seSBoYXZlIG9uZSBwYXJlbnQsIHNvIGlmIHRoZSBvcHRpb24gaXMgaW4gbXV0cGxlIGdyb3Vwcywgd2UgbmVlZCBhIGNsb25lXG5cblxuXHQgICAgICAgIGlmIChqID4gMCkge1xuXHQgICAgICAgICAgb3B0aW9uX2VsID0gb3B0aW9uX2VsLmNsb25lTm9kZSh0cnVlKTtcblx0ICAgICAgICAgIHNldEF0dHIob3B0aW9uX2VsLCB7XG5cdCAgICAgICAgICAgIGlkOiBvcHRpb24uJGlkICsgJy1jbG9uZS0nICsgaixcblx0ICAgICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiBudWxsXG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICAgIG9wdGlvbl9lbC5jbGFzc0xpc3QuYWRkKCd0cy1jbG9uZWQnKTtcblx0ICAgICAgICAgIHJlbW92ZUNsYXNzZXMob3B0aW9uX2VsLCAnYWN0aXZlJyk7IC8vIG1ha2Ugc3VyZSB3ZSBrZWVwIHRoZSBhY3RpdmVPcHRpb24gaW4gdGhlIHNhbWUgZ3JvdXBcblxuXHQgICAgICAgICAgaWYgKHNlbGYuYWN0aXZlT3B0aW9uICYmIHNlbGYuYWN0aXZlT3B0aW9uLmRhdGFzZXQudmFsdWUgPT0gb3B0X3ZhbHVlKSB7XG5cdCAgICAgICAgICAgIGlmIChhY3RpdmVfZ3JvdXAgJiYgYWN0aXZlX2dyb3VwLmRhdGFzZXQuZ3JvdXAgPT09IG9wdGdyb3VwLnRvU3RyaW5nKCkpIHtcblx0ICAgICAgICAgICAgICBhY3RpdmVfb3B0aW9uID0gb3B0aW9uX2VsO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgZ3JvdXBfZnJhZ21lbnQuYXBwZW5kQ2hpbGQob3B0aW9uX2VsKTtcblx0ICAgICAgICBncm91cHNbb3B0Z3JvdXBdID0gZ3JvdXBfZnJhZ21lbnQ7XG5cdCAgICAgIH1cblx0ICAgIH0gLy8gc29ydCBvcHRncm91cHNcblxuXG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5sb2NrT3B0Z3JvdXBPcmRlcikge1xuXHQgICAgICBncm91cHNfb3JkZXIuc29ydCgoYSwgYikgPT4ge1xuXHQgICAgICAgIGNvbnN0IGdycF9hID0gc2VsZi5vcHRncm91cHNbYV07XG5cdCAgICAgICAgY29uc3QgZ3JwX2IgPSBzZWxmLm9wdGdyb3Vwc1tiXTtcblx0ICAgICAgICBjb25zdCBhX29yZGVyID0gZ3JwX2EgJiYgZ3JwX2EuJG9yZGVyIHx8IDA7XG5cdCAgICAgICAgY29uc3QgYl9vcmRlciA9IGdycF9iICYmIGdycF9iLiRvcmRlciB8fCAwO1xuXHQgICAgICAgIHJldHVybiBhX29yZGVyIC0gYl9vcmRlcjtcblx0ICAgICAgfSk7XG5cdCAgICB9IC8vIHJlbmRlciBvcHRncm91cCBoZWFkZXJzICYgam9pbiBncm91cHNcblxuXG5cdCAgICBodG1sID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHQgICAgaXRlcmF0ZSQxKGdyb3Vwc19vcmRlciwgb3B0Z3JvdXAgPT4ge1xuXHQgICAgICBsZXQgZ3JvdXBfZnJhZ21lbnQgPSBncm91cHNbb3B0Z3JvdXBdO1xuXHQgICAgICBpZiAoIWdyb3VwX2ZyYWdtZW50IHx8ICFncm91cF9mcmFnbWVudC5jaGlsZHJlbi5sZW5ndGgpIHJldHVybjtcblx0ICAgICAgbGV0IGdyb3VwX2hlYWRpbmcgPSBzZWxmLm9wdGdyb3Vwc1tvcHRncm91cF07XG5cblx0ICAgICAgaWYgKGdyb3VwX2hlYWRpbmcgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIGxldCBncm91cF9vcHRpb25zID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHQgICAgICAgIGxldCBoZWFkZXIgPSBzZWxmLnJlbmRlcignb3B0Z3JvdXBfaGVhZGVyJywgZ3JvdXBfaGVhZGluZyk7XG5cdCAgICAgICAgYXBwZW5kKGdyb3VwX29wdGlvbnMsIGhlYWRlcik7XG5cdCAgICAgICAgYXBwZW5kKGdyb3VwX29wdGlvbnMsIGdyb3VwX2ZyYWdtZW50KTtcblx0ICAgICAgICBsZXQgZ3JvdXBfaHRtbCA9IHNlbGYucmVuZGVyKCdvcHRncm91cCcsIHtcblx0ICAgICAgICAgIGdyb3VwOiBncm91cF9oZWFkaW5nLFxuXHQgICAgICAgICAgb3B0aW9uczogZ3JvdXBfb3B0aW9uc1xuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIGFwcGVuZChodG1sLCBncm91cF9odG1sKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBhcHBlbmQoaHRtbCwgZ3JvdXBfZnJhZ21lbnQpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICAgIGRyb3Bkb3duX2NvbnRlbnQuaW5uZXJIVE1MID0gJyc7XG5cdCAgICBhcHBlbmQoZHJvcGRvd25fY29udGVudCwgaHRtbCk7IC8vIGhpZ2hsaWdodCBtYXRjaGluZyB0ZXJtcyBpbmxpbmVcblxuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MuaGlnaGxpZ2h0KSB7XG5cdCAgICAgIHJlbW92ZUhpZ2hsaWdodChkcm9wZG93bl9jb250ZW50KTtcblxuXHQgICAgICBpZiAocmVzdWx0cy5xdWVyeS5sZW5ndGggJiYgcmVzdWx0cy50b2tlbnMubGVuZ3RoKSB7XG5cdCAgICAgICAgaXRlcmF0ZSQxKHJlc3VsdHMudG9rZW5zLCB0b2sgPT4ge1xuXHQgICAgICAgICAgaGlnaGxpZ2h0KGRyb3Bkb3duX2NvbnRlbnQsIHRvay5yZWdleCk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH0gLy8gaGVscGVyIG1ldGhvZCBmb3IgYWRkaW5nIHRlbXBsYXRlcyB0byBkcm9wZG93blxuXG5cblx0ICAgIHZhciBhZGRfdGVtcGxhdGUgPSB0ZW1wbGF0ZSA9PiB7XG5cdCAgICAgIGxldCBjb250ZW50ID0gc2VsZi5yZW5kZXIodGVtcGxhdGUsIHtcblx0ICAgICAgICBpbnB1dDogcXVlcnlcblx0ICAgICAgfSk7XG5cblx0ICAgICAgaWYgKGNvbnRlbnQpIHtcblx0ICAgICAgICBzaG93X2Ryb3Bkb3duID0gdHJ1ZTtcblx0ICAgICAgICBkcm9wZG93bl9jb250ZW50Lmluc2VydEJlZm9yZShjb250ZW50LCBkcm9wZG93bl9jb250ZW50LmZpcnN0Q2hpbGQpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGNvbnRlbnQ7XG5cdCAgICB9OyAvLyBhZGQgbG9hZGluZyBtZXNzYWdlXG5cblxuXHQgICAgaWYgKHNlbGYubG9hZGluZykge1xuXHQgICAgICBhZGRfdGVtcGxhdGUoJ2xvYWRpbmcnKTsgLy8gaW52YWxpZCBxdWVyeVxuXHQgICAgfSBlbHNlIGlmICghc2VsZi5zZXR0aW5ncy5zaG91bGRMb2FkLmNhbGwoc2VsZiwgcXVlcnkpKSB7XG5cdCAgICAgIGFkZF90ZW1wbGF0ZSgnbm90X2xvYWRpbmcnKTsgLy8gYWRkIG5vX3Jlc3VsdHMgbWVzc2FnZVxuXHQgICAgfSBlbHNlIGlmIChyZXN1bHRzLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgICBhZGRfdGVtcGxhdGUoJ25vX3Jlc3VsdHMnKTtcblx0ICAgIH0gLy8gYWRkIGNyZWF0ZSBvcHRpb25cblxuXG5cdCAgICBoYXNfY3JlYXRlX29wdGlvbiA9IHNlbGYuY2FuQ3JlYXRlKHF1ZXJ5KTtcblxuXHQgICAgaWYgKGhhc19jcmVhdGVfb3B0aW9uKSB7XG5cdCAgICAgIGNyZWF0ZSA9IGFkZF90ZW1wbGF0ZSgnb3B0aW9uX2NyZWF0ZScpO1xuXHQgICAgfSAvLyBhY3RpdmF0ZVxuXG5cblx0ICAgIHNlbGYuaGFzT3B0aW9ucyA9IHJlc3VsdHMuaXRlbXMubGVuZ3RoID4gMCB8fCBoYXNfY3JlYXRlX29wdGlvbjtcblxuXHQgICAgaWYgKHNob3dfZHJvcGRvd24pIHtcblx0ICAgICAgaWYgKHJlc3VsdHMuaXRlbXMubGVuZ3RoID4gMCkge1xuXHQgICAgICAgIGlmICghYWN0aXZlX29wdGlvbiAmJiBzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdzaW5nbGUnICYmIHNlbGYuaXRlbXNbMF0gIT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICBhY3RpdmVfb3B0aW9uID0gc2VsZi5nZXRPcHRpb24oc2VsZi5pdGVtc1swXSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKCFkcm9wZG93bl9jb250ZW50LmNvbnRhaW5zKGFjdGl2ZV9vcHRpb24pKSB7XG5cdCAgICAgICAgICBsZXQgYWN0aXZlX2luZGV4ID0gMDtcblxuXHQgICAgICAgICAgaWYgKGNyZWF0ZSAmJiAhc2VsZi5zZXR0aW5ncy5hZGRQcmVjZWRlbmNlKSB7XG5cdCAgICAgICAgICAgIGFjdGl2ZV9pbmRleCA9IDE7XG5cdCAgICAgICAgICB9XG5cblx0ICAgICAgICAgIGFjdGl2ZV9vcHRpb24gPSBzZWxmLnNlbGVjdGFibGUoKVthY3RpdmVfaW5kZXhdO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIGlmIChjcmVhdGUpIHtcblx0ICAgICAgICBhY3RpdmVfb3B0aW9uID0gY3JlYXRlO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKHRyaWdnZXJEcm9wZG93biAmJiAhc2VsZi5pc09wZW4pIHtcblx0ICAgICAgICBzZWxmLm9wZW4oKTtcblx0ICAgICAgICBzZWxmLnNjcm9sbFRvT3B0aW9uKGFjdGl2ZV9vcHRpb24sICdhdXRvJyk7XG5cdCAgICAgIH1cblxuXHQgICAgICBzZWxmLnNldEFjdGl2ZU9wdGlvbihhY3RpdmVfb3B0aW9uKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYuY2xlYXJBY3RpdmVPcHRpb24oKTtcblxuXHQgICAgICBpZiAodHJpZ2dlckRyb3Bkb3duICYmIHNlbGYuaXNPcGVuKSB7XG5cdCAgICAgICAgc2VsZi5jbG9zZShmYWxzZSk7IC8vIGlmIGNyZWF0ZV9vcHRpb249bnVsbCwgd2Ugd2FudCB0aGUgZHJvcGRvd24gdG8gY2xvc2UgYnV0IG5vdCByZXNldCB0aGUgdGV4dGJveCB2YWx1ZVxuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybiBsaXN0IG9mIHNlbGVjdGFibGUgb3B0aW9uc1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNlbGVjdGFibGUoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5kcm9wZG93bl9jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXNlbGVjdGFibGVdJyk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEFkZHMgYW4gYXZhaWxhYmxlIG9wdGlvbi4gSWYgaXQgYWxyZWFkeSBleGlzdHMsXG5cdCAgICogbm90aGluZyB3aWxsIGhhcHBlbi4gTm90ZTogdGhpcyBkb2VzIG5vdCByZWZyZXNoXG5cdCAgICogdGhlIG9wdGlvbnMgbGlzdCBkcm9wZG93biAodXNlIGByZWZyZXNoT3B0aW9uc2Bcblx0ICAgKiBmb3IgdGhhdCkuXG5cdCAgICpcblx0ICAgKiBVc2FnZTpcblx0ICAgKlxuXHQgICAqICAgdGhpcy5hZGRPcHRpb24oZGF0YSlcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBhZGRPcHRpb24oZGF0YSwgdXNlcl9jcmVhdGVkID0gZmFsc2UpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzOyAvLyBAZGVwcmVjYXRlZCAxLjcuN1xuXHQgICAgLy8gdXNlIGFkZE9wdGlvbnMoIGFycmF5LCB1c2VyX2NyZWF0ZWQgKSBmb3IgYWRkaW5nIG11bHRpcGxlIG9wdGlvbnNcblxuXHQgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcblx0ICAgICAgc2VsZi5hZGRPcHRpb25zKGRhdGEsIHVzZXJfY3JlYXRlZCk7XG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgY29uc3Qga2V5ID0gaGFzaF9rZXkoZGF0YVtzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdKTtcblxuXHQgICAgaWYgKGtleSA9PT0gbnVsbCB8fCBzZWxmLm9wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIGRhdGEuJG9yZGVyID0gZGF0YS4kb3JkZXIgfHwgKytzZWxmLm9yZGVyO1xuXHQgICAgZGF0YS4kaWQgPSBzZWxmLmlucHV0SWQgKyAnLW9wdC0nICsgZGF0YS4kb3JkZXI7XG5cdCAgICBzZWxmLm9wdGlvbnNba2V5XSA9IGRhdGE7XG5cdCAgICBzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cblx0ICAgIGlmICh1c2VyX2NyZWF0ZWQpIHtcblx0ICAgICAgc2VsZi51c2VyT3B0aW9uc1trZXldID0gdXNlcl9jcmVhdGVkO1xuXHQgICAgICBzZWxmLnRyaWdnZXIoJ29wdGlvbl9hZGQnLCBrZXksIGRhdGEpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4ga2V5O1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBBZGQgbXVsdGlwbGUgb3B0aW9uc1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGFkZE9wdGlvbnMoZGF0YSwgdXNlcl9jcmVhdGVkID0gZmFsc2UpIHtcblx0ICAgIGl0ZXJhdGUkMShkYXRhLCBkYXQgPT4ge1xuXHQgICAgICB0aGlzLmFkZE9wdGlvbihkYXQsIHVzZXJfY3JlYXRlZCk7XG5cdCAgICB9KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQGRlcHJlY2F0ZWQgMS43Ljdcblx0ICAgKi9cblxuXG5cdCAgcmVnaXN0ZXJPcHRpb24oZGF0YSkge1xuXHQgICAgcmV0dXJuIHRoaXMuYWRkT3B0aW9uKGRhdGEpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZWdpc3RlcnMgYW4gb3B0aW9uIGdyb3VwIHRvIHRoZSBwb29sIG9mIG9wdGlvbiBncm91cHMuXG5cdCAgICpcblx0ICAgKiBAcmV0dXJuIHtib29sZWFufHN0cmluZ31cblx0ICAgKi9cblxuXG5cdCAgcmVnaXN0ZXJPcHRpb25Hcm91cChkYXRhKSB7XG5cdCAgICB2YXIga2V5ID0gaGFzaF9rZXkoZGF0YVt0aGlzLnNldHRpbmdzLm9wdGdyb3VwVmFsdWVGaWVsZF0pO1xuXHQgICAgaWYgKGtleSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHQgICAgZGF0YS4kb3JkZXIgPSBkYXRhLiRvcmRlciB8fCArK3RoaXMub3JkZXI7XG5cdCAgICB0aGlzLm9wdGdyb3Vwc1trZXldID0gZGF0YTtcblx0ICAgIHJldHVybiBrZXk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlZ2lzdGVycyBhIG5ldyBvcHRncm91cCBmb3Igb3B0aW9uc1xuXHQgICAqIHRvIGJlIGJ1Y2tldGVkIGludG8uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgYWRkT3B0aW9uR3JvdXAoaWQsIGRhdGEpIHtcblx0ICAgIHZhciBoYXNoZWRfaWQ7XG5cdCAgICBkYXRhW3RoaXMuc2V0dGluZ3Mub3B0Z3JvdXBWYWx1ZUZpZWxkXSA9IGlkO1xuXG5cdCAgICBpZiAoaGFzaGVkX2lkID0gdGhpcy5yZWdpc3Rlck9wdGlvbkdyb3VwKGRhdGEpKSB7XG5cdCAgICAgIHRoaXMudHJpZ2dlcignb3B0Z3JvdXBfYWRkJywgaGFzaGVkX2lkLCBkYXRhKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVtb3ZlcyBhbiBleGlzdGluZyBvcHRpb24gZ3JvdXAuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgcmVtb3ZlT3B0aW9uR3JvdXAoaWQpIHtcblx0ICAgIGlmICh0aGlzLm9wdGdyb3Vwcy5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblx0ICAgICAgZGVsZXRlIHRoaXMub3B0Z3JvdXBzW2lkXTtcblx0ICAgICAgdGhpcy5jbGVhckNhY2hlKCk7XG5cdCAgICAgIHRoaXMudHJpZ2dlcignb3B0Z3JvdXBfcmVtb3ZlJywgaWQpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDbGVhcnMgYWxsIGV4aXN0aW5nIG9wdGlvbiBncm91cHMuXG5cdCAgICovXG5cblxuXHQgIGNsZWFyT3B0aW9uR3JvdXBzKCkge1xuXHQgICAgdGhpcy5vcHRncm91cHMgPSB7fTtcblx0ICAgIHRoaXMuY2xlYXJDYWNoZSgpO1xuXHQgICAgdGhpcy50cmlnZ2VyKCdvcHRncm91cF9jbGVhcicpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBVcGRhdGVzIGFuIG9wdGlvbiBhdmFpbGFibGUgZm9yIHNlbGVjdGlvbi4gSWZcblx0ICAgKiBpdCBpcyB2aXNpYmxlIGluIHRoZSBzZWxlY3RlZCBpdGVtcyBvciBvcHRpb25zXG5cdCAgICogZHJvcGRvd24sIGl0IHdpbGwgYmUgcmUtcmVuZGVyZWQgYXV0b21hdGljYWxseS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICB1cGRhdGVPcHRpb24odmFsdWUsIGRhdGEpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIGl0ZW1fbmV3O1xuXHQgICAgdmFyIGluZGV4X2l0ZW07XG5cdCAgICBjb25zdCB2YWx1ZV9vbGQgPSBoYXNoX2tleSh2YWx1ZSk7XG5cdCAgICBjb25zdCB2YWx1ZV9uZXcgPSBoYXNoX2tleShkYXRhW3NlbGYuc2V0dGluZ3MudmFsdWVGaWVsZF0pOyAvLyBzYW5pdHkgY2hlY2tzXG5cblx0ICAgIGlmICh2YWx1ZV9vbGQgPT09IG51bGwpIHJldHVybjtcblx0ICAgIGNvbnN0IGRhdGFfb2xkID0gc2VsZi5vcHRpb25zW3ZhbHVlX29sZF07XG5cdCAgICBpZiAoZGF0YV9vbGQgPT0gdW5kZWZpbmVkKSByZXR1cm47XG5cdCAgICBpZiAodHlwZW9mIHZhbHVlX25ldyAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBFcnJvcignVmFsdWUgbXVzdCBiZSBzZXQgaW4gb3B0aW9uIGRhdGEnKTtcblx0ICAgIGNvbnN0IG9wdGlvbiA9IHNlbGYuZ2V0T3B0aW9uKHZhbHVlX29sZCk7XG5cdCAgICBjb25zdCBpdGVtID0gc2VsZi5nZXRJdGVtKHZhbHVlX29sZCk7XG5cdCAgICBkYXRhLiRvcmRlciA9IGRhdGEuJG9yZGVyIHx8IGRhdGFfb2xkLiRvcmRlcjtcblx0ICAgIGRlbGV0ZSBzZWxmLm9wdGlvbnNbdmFsdWVfb2xkXTsgLy8gaW52YWxpZGF0ZSByZW5kZXIgY2FjaGVcblx0ICAgIC8vIGRvbid0IHJlbW92ZSBleGlzdGluZyBub2RlIHlldCwgd2UnbGwgcmVtb3ZlIGl0IGFmdGVyIHJlcGxhY2luZyBpdFxuXG5cdCAgICBzZWxmLnVuY2FjaGVWYWx1ZSh2YWx1ZV9uZXcpO1xuXHQgICAgc2VsZi5vcHRpb25zW3ZhbHVlX25ld10gPSBkYXRhOyAvLyB1cGRhdGUgdGhlIG9wdGlvbiBpZiBpdCdzIGluIHRoZSBkcm9wZG93blxuXG5cdCAgICBpZiAob3B0aW9uKSB7XG5cdCAgICAgIGlmIChzZWxmLmRyb3Bkb3duX2NvbnRlbnQuY29udGFpbnMob3B0aW9uKSkge1xuXHQgICAgICAgIGNvbnN0IG9wdGlvbl9uZXcgPSBzZWxmLl9yZW5kZXIoJ29wdGlvbicsIGRhdGEpO1xuXG5cdCAgICAgICAgcmVwbGFjZU5vZGUob3B0aW9uLCBvcHRpb25fbmV3KTtcblxuXHQgICAgICAgIGlmIChzZWxmLmFjdGl2ZU9wdGlvbiA9PT0gb3B0aW9uKSB7XG5cdCAgICAgICAgICBzZWxmLnNldEFjdGl2ZU9wdGlvbihvcHRpb25fbmV3KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICBvcHRpb24ucmVtb3ZlKCk7XG5cdCAgICB9IC8vIHVwZGF0ZSB0aGUgaXRlbSBpZiB3ZSBoYXZlIG9uZVxuXG5cblx0ICAgIGlmIChpdGVtKSB7XG5cdCAgICAgIGluZGV4X2l0ZW0gPSBzZWxmLml0ZW1zLmluZGV4T2YodmFsdWVfb2xkKTtcblxuXHQgICAgICBpZiAoaW5kZXhfaXRlbSAhPT0gLTEpIHtcblx0ICAgICAgICBzZWxmLml0ZW1zLnNwbGljZShpbmRleF9pdGVtLCAxLCB2YWx1ZV9uZXcpO1xuXHQgICAgICB9XG5cblx0ICAgICAgaXRlbV9uZXcgPSBzZWxmLl9yZW5kZXIoJ2l0ZW0nLCBkYXRhKTtcblx0ICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkgYWRkQ2xhc3NlcyhpdGVtX25ldywgJ2FjdGl2ZScpO1xuXHQgICAgICByZXBsYWNlTm9kZShpdGVtLCBpdGVtX25ldyk7XG5cdCAgICB9IC8vIGludmFsaWRhdGUgbGFzdCBxdWVyeSBiZWNhdXNlIHdlIG1pZ2h0IGhhdmUgdXBkYXRlZCB0aGUgc29ydEZpZWxkXG5cblxuXHQgICAgc2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZW1vdmVzIGEgc2luZ2xlIG9wdGlvbi5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICByZW1vdmVPcHRpb24odmFsdWUsIHNpbGVudCkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICB2YWx1ZSA9IGdldF9oYXNoKHZhbHVlKTtcblx0ICAgIHNlbGYudW5jYWNoZVZhbHVlKHZhbHVlKTtcblx0ICAgIGRlbGV0ZSBzZWxmLnVzZXJPcHRpb25zW3ZhbHVlXTtcblx0ICAgIGRlbGV0ZSBzZWxmLm9wdGlvbnNbdmFsdWVdO1xuXHQgICAgc2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXHQgICAgc2VsZi50cmlnZ2VyKCdvcHRpb25fcmVtb3ZlJywgdmFsdWUpO1xuXHQgICAgc2VsZi5yZW1vdmVJdGVtKHZhbHVlLCBzaWxlbnQpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDbGVhcnMgYWxsIG9wdGlvbnMuXG5cdCAgICovXG5cblxuXHQgIGNsZWFyT3B0aW9ucyhmaWx0ZXIpIHtcblx0ICAgIGNvbnN0IGJvdW5kRmlsdGVyID0gKGZpbHRlciB8fCB0aGlzLmNsZWFyRmlsdGVyKS5iaW5kKHRoaXMpO1xuXHQgICAgdGhpcy5sb2FkZWRTZWFyY2hlcyA9IHt9O1xuXHQgICAgdGhpcy51c2VyT3B0aW9ucyA9IHt9O1xuXHQgICAgdGhpcy5jbGVhckNhY2hlKCk7XG5cdCAgICBjb25zdCBzZWxlY3RlZCA9IHt9O1xuXHQgICAgaXRlcmF0ZSQxKHRoaXMub3B0aW9ucywgKG9wdGlvbiwga2V5KSA9PiB7XG5cdCAgICAgIGlmIChib3VuZEZpbHRlcihvcHRpb24sIGtleSkpIHtcblx0ICAgICAgICBzZWxlY3RlZFtrZXldID0gb3B0aW9uO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICAgIHRoaXMub3B0aW9ucyA9IHRoaXMuc2lmdGVyLml0ZW1zID0gc2VsZWN0ZWQ7XG5cdCAgICB0aGlzLmxhc3RRdWVyeSA9IG51bGw7XG5cdCAgICB0aGlzLnRyaWdnZXIoJ29wdGlvbl9jbGVhcicpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBVc2VkIGJ5IGNsZWFyT3B0aW9ucygpIHRvIGRlY2lkZSB3aGV0aGVyIG9yIG5vdCBhbiBvcHRpb24gc2hvdWxkIGJlIHJlbW92ZWRcblx0ICAgKiBSZXR1cm4gdHJ1ZSB0byBrZWVwIGFuIG9wdGlvbiwgZmFsc2UgdG8gcmVtb3ZlXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY2xlYXJGaWx0ZXIob3B0aW9uLCB2YWx1ZSkge1xuXHQgICAgaWYgKHRoaXMuaXRlbXMuaW5kZXhPZih2YWx1ZSkgPj0gMCkge1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIHRoZSBkb20gZWxlbWVudCBvZiB0aGUgb3B0aW9uXG5cdCAgICogbWF0Y2hpbmcgdGhlIGdpdmVuIHZhbHVlLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGdldE9wdGlvbih2YWx1ZSwgY3JlYXRlID0gZmFsc2UpIHtcblx0ICAgIGNvbnN0IGhhc2hlZCA9IGhhc2hfa2V5KHZhbHVlKTtcblx0ICAgIGlmIChoYXNoZWQgPT09IG51bGwpIHJldHVybiBudWxsO1xuXHQgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5vcHRpb25zW2hhc2hlZF07XG5cblx0ICAgIGlmIChvcHRpb24gIT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgIGlmIChvcHRpb24uJGRpdikge1xuXHQgICAgICAgIHJldHVybiBvcHRpb24uJGRpdjtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChjcmVhdGUpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyKCdvcHRpb24nLCBvcHRpb24pO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBudWxsO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIHRoZSBkb20gZWxlbWVudCBvZiB0aGUgbmV4dCBvciBwcmV2aW91cyBkb20gZWxlbWVudCBvZiB0aGUgc2FtZSB0eXBlXG5cdCAgICogTm90ZTogYWRqYWNlbnQgb3B0aW9ucyBtYXkgbm90IGJlIGFkamFjZW50IERPTSBlbGVtZW50cyAob3B0Z3JvdXBzKVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGdldEFkamFjZW50KG9wdGlvbiwgZGlyZWN0aW9uLCB0eXBlID0gJ29wdGlvbicpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcyxcblx0ICAgICAgICBhbGw7XG5cblx0ICAgIGlmICghb3B0aW9uKSB7XG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXG5cdCAgICBpZiAodHlwZSA9PSAnaXRlbScpIHtcblx0ICAgICAgYWxsID0gc2VsZi5jb250cm9sQ2hpbGRyZW4oKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGFsbCA9IHNlbGYuZHJvcGRvd25fY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1zZWxlY3RhYmxlXScpO1xuXHQgICAgfVxuXG5cdCAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbC5sZW5ndGg7IGkrKykge1xuXHQgICAgICBpZiAoYWxsW2ldICE9IG9wdGlvbikge1xuXHQgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGRpcmVjdGlvbiA+IDApIHtcblx0ICAgICAgICByZXR1cm4gYWxsW2kgKyAxXTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBhbGxbaSAtIDFdO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gbnVsbDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJucyB0aGUgZG9tIGVsZW1lbnQgb2YgdGhlIGl0ZW1cblx0ICAgKiBtYXRjaGluZyB0aGUgZ2l2ZW4gdmFsdWUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgZ2V0SXRlbShpdGVtKSB7XG5cdCAgICBpZiAodHlwZW9mIGl0ZW0gPT0gJ29iamVjdCcpIHtcblx0ICAgICAgcmV0dXJuIGl0ZW07XG5cdCAgICB9XG5cblx0ICAgIHZhciB2YWx1ZSA9IGhhc2hfa2V5KGl0ZW0pO1xuXHQgICAgcmV0dXJuIHZhbHVlICE9PSBudWxsID8gdGhpcy5jb250cm9sLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXZhbHVlPVwiJHthZGRTbGFzaGVzKHZhbHVlKX1cIl1gKSA6IG51bGw7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFwiU2VsZWN0c1wiIG11bHRpcGxlIGl0ZW1zIGF0IG9uY2UuIEFkZHMgdGhlbSB0byB0aGUgbGlzdFxuXHQgICAqIGF0IHRoZSBjdXJyZW50IGNhcmV0IHBvc2l0aW9uLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGFkZEl0ZW1zKHZhbHVlcywgc2lsZW50KSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgaXRlbXMgPSBBcnJheS5pc0FycmF5KHZhbHVlcykgPyB2YWx1ZXMgOiBbdmFsdWVzXTtcblx0ICAgIGl0ZW1zID0gaXRlbXMuZmlsdGVyKHggPT4gc2VsZi5pdGVtcy5pbmRleE9mKHgpID09PSAtMSk7XG5cdCAgICBjb25zdCBsYXN0X2l0ZW0gPSBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXTtcblx0ICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG5cdCAgICAgIHNlbGYuaXNQZW5kaW5nID0gaXRlbSAhPT0gbGFzdF9pdGVtO1xuXHQgICAgICBzZWxmLmFkZEl0ZW0oaXRlbSwgc2lsZW50KTtcblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBcIlNlbGVjdHNcIiBhbiBpdGVtLiBBZGRzIGl0IHRvIHRoZSBsaXN0XG5cdCAgICogYXQgdGhlIGN1cnJlbnQgY2FyZXQgcG9zaXRpb24uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgYWRkSXRlbSh2YWx1ZSwgc2lsZW50KSB7XG5cdCAgICB2YXIgZXZlbnRzID0gc2lsZW50ID8gW10gOiBbJ2NoYW5nZScsICdkcm9wZG93bl9jbG9zZSddO1xuXHQgICAgZGVib3VuY2VfZXZlbnRzKHRoaXMsIGV2ZW50cywgKCkgPT4ge1xuXHQgICAgICB2YXIgaXRlbSwgd2FzRnVsbDtcblx0ICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICAgIGNvbnN0IGlucHV0TW9kZSA9IHNlbGYuc2V0dGluZ3MubW9kZTtcblx0ICAgICAgY29uc3QgaGFzaGVkID0gaGFzaF9rZXkodmFsdWUpO1xuXG5cdCAgICAgIGlmIChoYXNoZWQgJiYgc2VsZi5pdGVtcy5pbmRleE9mKGhhc2hlZCkgIT09IC0xKSB7XG5cdCAgICAgICAgaWYgKGlucHV0TW9kZSA9PT0gJ3NpbmdsZScpIHtcblx0ICAgICAgICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZiAoaW5wdXRNb2RlID09PSAnc2luZ2xlJyB8fCAhc2VsZi5zZXR0aW5ncy5kdXBsaWNhdGVzKSB7XG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGhhc2hlZCA9PT0gbnVsbCB8fCAhc2VsZi5vcHRpb25zLmhhc093blByb3BlcnR5KGhhc2hlZCkpIHJldHVybjtcblx0ICAgICAgaWYgKGlucHV0TW9kZSA9PT0gJ3NpbmdsZScpIHNlbGYuY2xlYXIoc2lsZW50KTtcblx0ICAgICAgaWYgKGlucHV0TW9kZSA9PT0gJ211bHRpJyAmJiBzZWxmLmlzRnVsbCgpKSByZXR1cm47XG5cdCAgICAgIGl0ZW0gPSBzZWxmLl9yZW5kZXIoJ2l0ZW0nLCBzZWxmLm9wdGlvbnNbaGFzaGVkXSk7XG5cblx0ICAgICAgaWYgKHNlbGYuY29udHJvbC5jb250YWlucyhpdGVtKSkge1xuXHQgICAgICAgIC8vIGR1cGxpY2F0ZXNcblx0ICAgICAgICBpdGVtID0gaXRlbS5jbG9uZU5vZGUodHJ1ZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICB3YXNGdWxsID0gc2VsZi5pc0Z1bGwoKTtcblx0ICAgICAgc2VsZi5pdGVtcy5zcGxpY2Uoc2VsZi5jYXJldFBvcywgMCwgaGFzaGVkKTtcblx0ICAgICAgc2VsZi5pbnNlcnRBdENhcmV0KGl0ZW0pO1xuXG5cdCAgICAgIGlmIChzZWxmLmlzU2V0dXApIHtcblx0ICAgICAgICAvLyB1cGRhdGUgbWVudSAvIHJlbW92ZSB0aGUgb3B0aW9uIChpZiB0aGlzIGlzIG5vdCBvbmUgaXRlbSBiZWluZyBhZGRlZCBhcyBwYXJ0IG9mIHNlcmllcylcblx0ICAgICAgICBpZiAoIXNlbGYuaXNQZW5kaW5nICYmIHNlbGYuc2V0dGluZ3MuaGlkZVNlbGVjdGVkKSB7XG5cdCAgICAgICAgICBsZXQgb3B0aW9uID0gc2VsZi5nZXRPcHRpb24oaGFzaGVkKTtcblx0ICAgICAgICAgIGxldCBuZXh0ID0gc2VsZi5nZXRBZGphY2VudChvcHRpb24sIDEpO1xuXG5cdCAgICAgICAgICBpZiAobmV4dCkge1xuXHQgICAgICAgICAgICBzZWxmLnNldEFjdGl2ZU9wdGlvbihuZXh0KTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9IC8vIHJlZnJlc2hPcHRpb25zIGFmdGVyIHNldEFjdGl2ZU9wdGlvbigpLFxuXHQgICAgICAgIC8vIG90aGVyd2lzZSBzZXRBY3RpdmVPcHRpb24oKSB3aWxsIGJlIGNhbGxlZCBieSByZWZyZXNoT3B0aW9ucygpIHdpdGggdGhlIHdyb25nIHZhbHVlXG5cblxuXHQgICAgICAgIGlmICghc2VsZi5pc1BlbmRpbmcgJiYgIXNlbGYuc2V0dGluZ3MuY2xvc2VBZnRlclNlbGVjdCkge1xuXHQgICAgICAgICAgc2VsZi5yZWZyZXNoT3B0aW9ucyhzZWxmLmlzRm9jdXNlZCAmJiBpbnB1dE1vZGUgIT09ICdzaW5nbGUnKTtcblx0ICAgICAgICB9IC8vIGhpZGUgdGhlIG1lbnUgaWYgdGhlIG1heGltdW0gbnVtYmVyIG9mIGl0ZW1zIGhhdmUgYmVlbiBzZWxlY3RlZCBvciBubyBvcHRpb25zIGFyZSBsZWZ0XG5cblxuXHQgICAgICAgIGlmIChzZWxmLnNldHRpbmdzLmNsb3NlQWZ0ZXJTZWxlY3QgIT0gZmFsc2UgJiYgc2VsZi5pc0Z1bGwoKSkge1xuXHQgICAgICAgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuaXNQZW5kaW5nKSB7XG5cdCAgICAgICAgICBzZWxmLnBvc2l0aW9uRHJvcGRvd24oKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZWxmLnRyaWdnZXIoJ2l0ZW1fYWRkJywgaGFzaGVkLCBpdGVtKTtcblxuXHQgICAgICAgIGlmICghc2VsZi5pc1BlbmRpbmcpIHtcblx0ICAgICAgICAgIHNlbGYudXBkYXRlT3JpZ2luYWxJbnB1dCh7XG5cdCAgICAgICAgICAgIHNpbGVudDogc2lsZW50XG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoIXNlbGYuaXNQZW5kaW5nIHx8ICF3YXNGdWxsICYmIHNlbGYuaXNGdWxsKCkpIHtcblx0ICAgICAgICBzZWxmLmlucHV0U3RhdGUoKTtcblx0ICAgICAgICBzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVtb3ZlcyB0aGUgc2VsZWN0ZWQgaXRlbSBtYXRjaGluZ1xuXHQgICAqIHRoZSBwcm92aWRlZCB2YWx1ZS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICByZW1vdmVJdGVtKGl0ZW0gPSBudWxsLCBzaWxlbnQpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgaXRlbSA9IHNlbGYuZ2V0SXRlbShpdGVtKTtcblx0ICAgIGlmICghaXRlbSkgcmV0dXJuO1xuXHQgICAgdmFyIGksIGlkeDtcblx0ICAgIGNvbnN0IHZhbHVlID0gaXRlbS5kYXRhc2V0LnZhbHVlO1xuXHQgICAgaSA9IG5vZGVJbmRleChpdGVtKTtcblx0ICAgIGl0ZW0ucmVtb3ZlKCk7XG5cblx0ICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0ICAgICAgaWR4ID0gc2VsZi5hY3RpdmVJdGVtcy5pbmRleE9mKGl0ZW0pO1xuXHQgICAgICBzZWxmLmFjdGl2ZUl0ZW1zLnNwbGljZShpZHgsIDEpO1xuXHQgICAgICByZW1vdmVDbGFzc2VzKGl0ZW0sICdhY3RpdmUnKTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi5pdGVtcy5zcGxpY2UoaSwgMSk7XG5cdCAgICBzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cblx0ICAgIGlmICghc2VsZi5zZXR0aW5ncy5wZXJzaXN0ICYmIHNlbGYudXNlck9wdGlvbnMuaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG5cdCAgICAgIHNlbGYucmVtb3ZlT3B0aW9uKHZhbHVlLCBzaWxlbnQpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoaSA8IHNlbGYuY2FyZXRQb3MpIHtcblx0ICAgICAgc2VsZi5zZXRDYXJldChzZWxmLmNhcmV0UG9zIC0gMSk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYudXBkYXRlT3JpZ2luYWxJbnB1dCh7XG5cdCAgICAgIHNpbGVudDogc2lsZW50XG5cdCAgICB9KTtcblx0ICAgIHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdCAgICBzZWxmLnBvc2l0aW9uRHJvcGRvd24oKTtcblx0ICAgIHNlbGYudHJpZ2dlcignaXRlbV9yZW1vdmUnLCB2YWx1ZSwgaXRlbSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEludm9rZXMgdGhlIGBjcmVhdGVgIG1ldGhvZCBwcm92aWRlZCBpbiB0aGVcblx0ICAgKiBUb21TZWxlY3Qgb3B0aW9ucyB0aGF0IHNob3VsZCBwcm92aWRlIHRoZSBkYXRhXG5cdCAgICogZm9yIHRoZSBuZXcgaXRlbSwgZ2l2ZW4gdGhlIHVzZXIgaW5wdXQuXG5cdCAgICpcblx0ICAgKiBPbmNlIHRoaXMgY29tcGxldGVzLCBpdCB3aWxsIGJlIGFkZGVkXG5cdCAgICogdG8gdGhlIGl0ZW0gbGlzdC5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjcmVhdGVJdGVtKGlucHV0ID0gbnVsbCwgY2FsbGJhY2sgPSAoKSA9PiB7fSkge1xuXHQgICAgLy8gdHJpZ2dlckRyb3Bkb3duIHBhcmFtZXRlciBAZGVwcmVjYXRlZCAyLjEuMVxuXHQgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcblx0ICAgICAgY2FsbGJhY2sgPSBhcmd1bWVudHNbMl07XG5cdCAgICB9XG5cblx0ICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICBjYWxsYmFjayA9ICgpID0+IHt9O1xuXHQgICAgfVxuXG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgY2FyZXQgPSBzZWxmLmNhcmV0UG9zO1xuXHQgICAgdmFyIG91dHB1dDtcblx0ICAgIGlucHV0ID0gaW5wdXQgfHwgc2VsZi5pbnB1dFZhbHVlKCk7XG5cblx0ICAgIGlmICghc2VsZi5jYW5DcmVhdGUoaW5wdXQpKSB7XG5cdCAgICAgIGNhbGxiYWNrKCk7XG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi5sb2NrKCk7XG5cdCAgICB2YXIgY3JlYXRlZCA9IGZhbHNlO1xuXG5cdCAgICB2YXIgY3JlYXRlID0gZGF0YSA9PiB7XG5cdCAgICAgIHNlbGYudW5sb2NrKCk7XG5cdCAgICAgIGlmICghZGF0YSB8fCB0eXBlb2YgZGF0YSAhPT0gJ29iamVjdCcpIHJldHVybiBjYWxsYmFjaygpO1xuXHQgICAgICB2YXIgdmFsdWUgPSBoYXNoX2tleShkYXRhW3NlbGYuc2V0dGluZ3MudmFsdWVGaWVsZF0pO1xuXG5cdCAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG5cdCAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG5cdCAgICAgIH1cblxuXHQgICAgICBzZWxmLnNldFRleHRib3hWYWx1ZSgpO1xuXHQgICAgICBzZWxmLmFkZE9wdGlvbihkYXRhLCB0cnVlKTtcblx0ICAgICAgc2VsZi5zZXRDYXJldChjYXJldCk7XG5cdCAgICAgIHNlbGYuYWRkSXRlbSh2YWx1ZSk7XG5cdCAgICAgIGNhbGxiYWNrKGRhdGEpO1xuXHQgICAgICBjcmVhdGVkID0gdHJ1ZTtcblx0ICAgIH07XG5cblx0ICAgIGlmICh0eXBlb2Ygc2VsZi5zZXR0aW5ncy5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgb3V0cHV0ID0gc2VsZi5zZXR0aW5ncy5jcmVhdGUuY2FsbCh0aGlzLCBpbnB1dCwgY3JlYXRlKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIG91dHB1dCA9IHtcblx0ICAgICAgICBbc2VsZi5zZXR0aW5ncy5sYWJlbEZpZWxkXTogaW5wdXQsXG5cdCAgICAgICAgW3NlbGYuc2V0dGluZ3MudmFsdWVGaWVsZF06IGlucHV0XG5cdCAgICAgIH07XG5cdCAgICB9XG5cblx0ICAgIGlmICghY3JlYXRlZCkge1xuXHQgICAgICBjcmVhdGUob3V0cHV0KTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlLXJlbmRlcnMgdGhlIHNlbGVjdGVkIGl0ZW0gbGlzdHMuXG5cdCAgICovXG5cblxuXHQgIHJlZnJlc2hJdGVtcygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblxuXHQgICAgaWYgKHNlbGYuaXNTZXR1cCkge1xuXHQgICAgICBzZWxmLmFkZEl0ZW1zKHNlbGYuaXRlbXMpO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLnVwZGF0ZU9yaWdpbmFsSW5wdXQoKTtcblx0ICAgIHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFVwZGF0ZXMgYWxsIHN0YXRlLWRlcGVuZGVudCBhdHRyaWJ1dGVzXG5cdCAgICogYW5kIENTUyBjbGFzc2VzLlxuXHQgICAqL1xuXG5cblx0ICByZWZyZXNoU3RhdGUoKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIHNlbGYucmVmcmVzaFZhbGlkaXR5U3RhdGUoKTtcblx0ICAgIGNvbnN0IGlzRnVsbCA9IHNlbGYuaXNGdWxsKCk7XG5cdCAgICBjb25zdCBpc0xvY2tlZCA9IHNlbGYuaXNMb2NrZWQ7XG5cdCAgICBzZWxmLndyYXBwZXIuY2xhc3NMaXN0LnRvZ2dsZSgncnRsJywgc2VsZi5ydGwpO1xuXHQgICAgY29uc3Qgd3JhcF9jbGFzc0xpc3QgPSBzZWxmLndyYXBwZXIuY2xhc3NMaXN0O1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdmb2N1cycsIHNlbGYuaXNGb2N1c2VkKTtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCBzZWxmLmlzRGlzYWJsZWQpO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdyZXF1aXJlZCcsIHNlbGYuaXNSZXF1aXJlZCk7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2ludmFsaWQnLCAhc2VsZi5pc1ZhbGlkKTtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgnbG9ja2VkJywgaXNMb2NrZWQpO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdmdWxsJywgaXNGdWxsKTtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgnaW5wdXQtYWN0aXZlJywgc2VsZi5pc0ZvY3VzZWQgJiYgIXNlbGYuaXNJbnB1dEhpZGRlbik7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2Ryb3Bkb3duLWFjdGl2ZScsIHNlbGYuaXNPcGVuKTtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgnaGFzLW9wdGlvbnMnLCBpc0VtcHR5T2JqZWN0KHNlbGYub3B0aW9ucykpO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdoYXMtaXRlbXMnLCBzZWxmLml0ZW1zLmxlbmd0aCA+IDApO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBVcGRhdGUgdGhlIGByZXF1aXJlZGAgYXR0cmlidXRlIG9mIGJvdGggaW5wdXQgYW5kIGNvbnRyb2wgaW5wdXQuXG5cdCAgICpcblx0ICAgKiBUaGUgYHJlcXVpcmVkYCBwcm9wZXJ0eSBuZWVkcyB0byBiZSBhY3RpdmF0ZWQgb24gdGhlIGNvbnRyb2wgaW5wdXRcblx0ICAgKiBmb3IgdGhlIGVycm9yIHRvIGJlIGRpc3BsYXllZCBhdCB0aGUgcmlnaHQgcGxhY2UuIGByZXF1aXJlZGAgYWxzb1xuXHQgICAqIG5lZWRzIHRvIGJlIHRlbXBvcmFyaWx5IGRlYWN0aXZhdGVkIG9uIHRoZSBpbnB1dCBzaW5jZSB0aGUgaW5wdXQgaXNcblx0ICAgKiBoaWRkZW4gYW5kIGNhbid0IHNob3cgZXJyb3JzLlxuXHQgICAqL1xuXG5cblx0ICByZWZyZXNoVmFsaWRpdHlTdGF0ZSgpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKCFzZWxmLmlucHV0LnZhbGlkaXR5KSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgc2VsZi5pc1ZhbGlkID0gc2VsZi5pbnB1dC52YWxpZGl0eS52YWxpZDtcblx0ICAgIHNlbGYuaXNJbnZhbGlkID0gIXNlbGYuaXNWYWxpZDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCBtb3JlIGl0ZW1zIGNhbiBiZSBhZGRlZFxuXHQgICAqIHRvIHRoZSBjb250cm9sIHdpdGhvdXQgZXhjZWVkaW5nIHRoZSB1c2VyLWRlZmluZWQgbWF4aW11bS5cblx0ICAgKlxuXHQgICAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgICAqL1xuXG5cblx0ICBpc0Z1bGwoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5tYXhJdGVtcyAhPT0gbnVsbCAmJiB0aGlzLml0ZW1zLmxlbmd0aCA+PSB0aGlzLnNldHRpbmdzLm1heEl0ZW1zO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZWZyZXNoZXMgdGhlIG9yaWdpbmFsIDxzZWxlY3Q+IG9yIDxpbnB1dD5cblx0ICAgKiBlbGVtZW50IHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgc3RhdGUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgdXBkYXRlT3JpZ2luYWxJbnB1dChvcHRzID0ge30pIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIG9wdGlvbiwgbGFiZWw7XG5cdCAgICBjb25zdCBlbXB0eV9vcHRpb24gPSBzZWxmLmlucHV0LnF1ZXJ5U2VsZWN0b3IoJ29wdGlvblt2YWx1ZT1cIlwiXScpO1xuXG5cdCAgICBpZiAoc2VsZi5pc19zZWxlY3RfdGFnKSB7XG5cdCAgICAgIGNvbnN0IHNlbGVjdGVkID0gW107XG5cdCAgICAgIGNvbnN0IGhhc19zZWxlY3RlZCA9IHNlbGYuaW5wdXQucXVlcnlTZWxlY3RvckFsbCgnb3B0aW9uOmNoZWNrZWQnKS5sZW5ndGg7XG5cblx0ICAgICAgZnVuY3Rpb24gQWRkU2VsZWN0ZWQob3B0aW9uX2VsLCB2YWx1ZSwgbGFiZWwpIHtcblx0ICAgICAgICBpZiAoIW9wdGlvbl9lbCkge1xuXHQgICAgICAgICAgb3B0aW9uX2VsID0gZ2V0RG9tKCc8b3B0aW9uIHZhbHVlPVwiJyArIGVzY2FwZV9odG1sKHZhbHVlKSArICdcIj4nICsgZXNjYXBlX2h0bWwobGFiZWwpICsgJzwvb3B0aW9uPicpO1xuXHQgICAgICAgIH0gLy8gZG9uJ3QgbW92ZSBlbXB0eSBvcHRpb24gZnJvbSB0b3Agb2YgbGlzdFxuXHQgICAgICAgIC8vIGZpeGVzIGJ1ZyBpbiBmaXJlZm94IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTE3MjUyOTNcblxuXG5cdCAgICAgICAgaWYgKG9wdGlvbl9lbCAhPSBlbXB0eV9vcHRpb24pIHtcblx0ICAgICAgICAgIHNlbGYuaW5wdXQuYXBwZW5kKG9wdGlvbl9lbCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VsZWN0ZWQucHVzaChvcHRpb25fZWwpOyAvLyBtYXJraW5nIGVtcHR5IG9wdGlvbiBhcyBzZWxlY3RlZCBjYW4gYnJlYWsgdmFsaWRhdGlvblxuXHQgICAgICAgIC8vIGZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9vcmNoaWRqcy90b20tc2VsZWN0L2lzc3Vlcy8zMDNcblxuXHQgICAgICAgIGlmIChvcHRpb25fZWwgIT0gZW1wdHlfb3B0aW9uIHx8IGhhc19zZWxlY3RlZCA+IDApIHtcblx0ICAgICAgICAgIG9wdGlvbl9lbC5zZWxlY3RlZCA9IHRydWU7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIG9wdGlvbl9lbDtcblx0ICAgICAgfSAvLyB1bnNlbGVjdCBhbGwgc2VsZWN0ZWQgb3B0aW9uc1xuXG5cblx0ICAgICAgc2VsZi5pbnB1dC5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb246Y2hlY2tlZCcpLmZvckVhY2gob3B0aW9uX2VsID0+IHtcblx0ICAgICAgICBvcHRpb25fZWwuc2VsZWN0ZWQgPSBmYWxzZTtcblx0ICAgICAgfSk7IC8vIG5vdGhpbmcgc2VsZWN0ZWQ/XG5cblx0ICAgICAgaWYgKHNlbGYuaXRlbXMubGVuZ3RoID09IDAgJiYgc2VsZi5zZXR0aW5ncy5tb2RlID09ICdzaW5nbGUnKSB7XG5cdCAgICAgICAgQWRkU2VsZWN0ZWQoZW1wdHlfb3B0aW9uLCBcIlwiLCBcIlwiKTsgLy8gb3JkZXIgc2VsZWN0ZWQgPG9wdGlvbj4gdGFncyBmb3IgdmFsdWVzIGluIHNlbGYuaXRlbXNcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBzZWxmLml0ZW1zLmZvckVhY2godmFsdWUgPT4ge1xuXHQgICAgICAgICAgb3B0aW9uID0gc2VsZi5vcHRpb25zW3ZhbHVlXTtcblx0ICAgICAgICAgIGxhYmVsID0gb3B0aW9uW3NlbGYuc2V0dGluZ3MubGFiZWxGaWVsZF0gfHwgJyc7XG5cblx0ICAgICAgICAgIGlmIChzZWxlY3RlZC5pbmNsdWRlcyhvcHRpb24uJG9wdGlvbikpIHtcblx0ICAgICAgICAgICAgY29uc3QgcmV1c2Vfb3B0ID0gc2VsZi5pbnB1dC5xdWVyeVNlbGVjdG9yKGBvcHRpb25bdmFsdWU9XCIke2FkZFNsYXNoZXModmFsdWUpfVwiXTpub3QoOmNoZWNrZWQpYCk7XG5cdCAgICAgICAgICAgIEFkZFNlbGVjdGVkKHJldXNlX29wdCwgdmFsdWUsIGxhYmVsKTtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIG9wdGlvbi4kb3B0aW9uID0gQWRkU2VsZWN0ZWQob3B0aW9uLiRvcHRpb24sIHZhbHVlLCBsYWJlbCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYuaW5wdXQudmFsdWUgPSBzZWxmLmdldFZhbHVlKCk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChzZWxmLmlzU2V0dXApIHtcblx0ICAgICAgaWYgKCFvcHRzLnNpbGVudCkge1xuXHQgICAgICAgIHNlbGYudHJpZ2dlcignY2hhbmdlJywgc2VsZi5nZXRWYWx1ZSgpKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTaG93cyB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duIGNvbnRhaW5pbmdcblx0ICAgKiB0aGUgYXZhaWxhYmxlIG9wdGlvbnMuXG5cdCAgICovXG5cblxuXHQgIG9wZW4oKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBpZiAoc2VsZi5pc0xvY2tlZCB8fCBzZWxmLmlzT3BlbiB8fCBzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdtdWx0aScgJiYgc2VsZi5pc0Z1bGwoKSkgcmV0dXJuO1xuXHQgICAgc2VsZi5pc09wZW4gPSB0cnVlO1xuXHQgICAgc2V0QXR0cihzZWxmLmZvY3VzX25vZGUsIHtcblx0ICAgICAgJ2FyaWEtZXhwYW5kZWQnOiAndHJ1ZSdcblx0ICAgIH0pO1xuXHQgICAgc2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0ICAgIGFwcGx5Q1NTKHNlbGYuZHJvcGRvd24sIHtcblx0ICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbicsXG5cdCAgICAgIGRpc3BsYXk6ICdibG9jaydcblx0ICAgIH0pO1xuXHQgICAgc2VsZi5wb3NpdGlvbkRyb3Bkb3duKCk7XG5cdCAgICBhcHBseUNTUyhzZWxmLmRyb3Bkb3duLCB7XG5cdCAgICAgIHZpc2liaWxpdHk6ICd2aXNpYmxlJyxcblx0ICAgICAgZGlzcGxheTogJ2Jsb2NrJ1xuXHQgICAgfSk7XG5cdCAgICBzZWxmLmZvY3VzKCk7XG5cdCAgICBzZWxmLnRyaWdnZXIoJ2Ryb3Bkb3duX29wZW4nLCBzZWxmLmRyb3Bkb3duKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQ2xvc2VzIHRoZSBhdXRvY29tcGxldGUgZHJvcGRvd24gbWVudS5cblx0ICAgKi9cblxuXG5cdCAgY2xvc2Uoc2V0VGV4dGJveFZhbHVlID0gdHJ1ZSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIHRyaWdnZXIgPSBzZWxmLmlzT3BlbjtcblxuXHQgICAgaWYgKHNldFRleHRib3hWYWx1ZSkge1xuXHQgICAgICAvLyBiZWZvcmUgYmx1cigpIHRvIHByZXZlbnQgZm9ybSBvbmNoYW5nZSBldmVudFxuXHQgICAgICBzZWxmLnNldFRleHRib3hWYWx1ZSgpO1xuXG5cdCAgICAgIGlmIChzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdzaW5nbGUnICYmIHNlbGYuaXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgICAgc2VsZi5oaWRlSW5wdXQoKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBzZWxmLmlzT3BlbiA9IGZhbHNlO1xuXHQgICAgc2V0QXR0cihzZWxmLmZvY3VzX25vZGUsIHtcblx0ICAgICAgJ2FyaWEtZXhwYW5kZWQnOiAnZmFsc2UnXG5cdCAgICB9KTtcblx0ICAgIGFwcGx5Q1NTKHNlbGYuZHJvcGRvd24sIHtcblx0ICAgICAgZGlzcGxheTogJ25vbmUnXG5cdCAgICB9KTtcblxuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MuaGlkZVNlbGVjdGVkKSB7XG5cdCAgICAgIHNlbGYuY2xlYXJBY3RpdmVPcHRpb24oKTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0ICAgIGlmICh0cmlnZ2VyKSBzZWxmLnRyaWdnZXIoJ2Ryb3Bkb3duX2Nsb3NlJywgc2VsZi5kcm9wZG93bik7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIENhbGN1bGF0ZXMgYW5kIGFwcGxpZXMgdGhlIGFwcHJvcHJpYXRlXG5cdCAgICogcG9zaXRpb24gb2YgdGhlIGRyb3Bkb3duIGlmIGRyb3Bkb3duUGFyZW50ID0gJ2JvZHknLlxuXHQgICAqIE90aGVyd2lzZSwgcG9zaXRpb24gaXMgZGV0ZXJtaW5lZCBieSBjc3Ncblx0ICAgKi9cblxuXG5cdCAgcG9zaXRpb25Ecm9wZG93bigpIHtcblx0ICAgIGlmICh0aGlzLnNldHRpbmdzLmRyb3Bkb3duUGFyZW50ICE9PSAnYm9keScpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udHJvbDtcblx0ICAgIHZhciByZWN0ID0gY29udGV4dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgIHZhciB0b3AgPSBjb250ZXh0Lm9mZnNldEhlaWdodCArIHJlY3QudG9wICsgd2luZG93LnNjcm9sbFk7XG5cdCAgICB2YXIgbGVmdCA9IHJlY3QubGVmdCArIHdpbmRvdy5zY3JvbGxYO1xuXHQgICAgYXBwbHlDU1ModGhpcy5kcm9wZG93biwge1xuXHQgICAgICB3aWR0aDogcmVjdC53aWR0aCArICdweCcsXG5cdCAgICAgIHRvcDogdG9wICsgJ3B4Jyxcblx0ICAgICAgbGVmdDogbGVmdCArICdweCdcblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXNldHMgLyBjbGVhcnMgYWxsIHNlbGVjdGVkIGl0ZW1zXG5cdCAgICogZnJvbSB0aGUgY29udHJvbC5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjbGVhcihzaWxlbnQpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIGlmICghc2VsZi5pdGVtcy5sZW5ndGgpIHJldHVybjtcblx0ICAgIHZhciBpdGVtcyA9IHNlbGYuY29udHJvbENoaWxkcmVuKCk7XG5cdCAgICBpdGVyYXRlJDEoaXRlbXMsIGl0ZW0gPT4ge1xuXHQgICAgICBzZWxmLnJlbW92ZUl0ZW0oaXRlbSwgdHJ1ZSk7XG5cdCAgICB9KTtcblx0ICAgIHNlbGYuc2hvd0lucHV0KCk7XG5cdCAgICBpZiAoIXNpbGVudCkgc2VsZi51cGRhdGVPcmlnaW5hbElucHV0KCk7XG5cdCAgICBzZWxmLnRyaWdnZXIoJ2NsZWFyJyk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEEgaGVscGVyIG1ldGhvZCBmb3IgaW5zZXJ0aW5nIGFuIGVsZW1lbnRcblx0ICAgKiBhdCB0aGUgY3VycmVudCBjYXJldCBwb3NpdGlvbi5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBpbnNlcnRBdENhcmV0KGVsKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIGNvbnN0IGNhcmV0ID0gc2VsZi5jYXJldFBvcztcblx0ICAgIGNvbnN0IHRhcmdldCA9IHNlbGYuY29udHJvbDtcblx0ICAgIHRhcmdldC5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldC5jaGlsZHJlbltjYXJldF0gfHwgbnVsbCk7XG5cdCAgICBzZWxmLnNldENhcmV0KGNhcmV0ICsgMSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlbW92ZXMgdGhlIGN1cnJlbnQgc2VsZWN0ZWQgaXRlbShzKS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBkZWxldGVTZWxlY3Rpb24oZSkge1xuXHQgICAgdmFyIGRpcmVjdGlvbiwgc2VsZWN0aW9uLCBjYXJldCwgdGFpbDtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIGRpcmVjdGlvbiA9IGUgJiYgZS5rZXlDb2RlID09PSBLRVlfQkFDS1NQQUNFID8gLTEgOiAxO1xuXHQgICAgc2VsZWN0aW9uID0gZ2V0U2VsZWN0aW9uKHNlbGYuY29udHJvbF9pbnB1dCk7IC8vIGRldGVybWluZSBpdGVtcyB0aGF0IHdpbGwgYmUgcmVtb3ZlZFxuXG5cdCAgICBjb25zdCBybV9pdGVtcyA9IFtdO1xuXG5cdCAgICBpZiAoc2VsZi5hY3RpdmVJdGVtcy5sZW5ndGgpIHtcblx0ICAgICAgdGFpbCA9IGdldFRhaWwoc2VsZi5hY3RpdmVJdGVtcywgZGlyZWN0aW9uKTtcblx0ICAgICAgY2FyZXQgPSBub2RlSW5kZXgodGFpbCk7XG5cblx0ICAgICAgaWYgKGRpcmVjdGlvbiA+IDApIHtcblx0ICAgICAgICBjYXJldCsrO1xuXHQgICAgICB9XG5cblx0ICAgICAgaXRlcmF0ZSQxKHNlbGYuYWN0aXZlSXRlbXMsIGl0ZW0gPT4gcm1faXRlbXMucHVzaChpdGVtKSk7XG5cdCAgICB9IGVsc2UgaWYgKChzZWxmLmlzRm9jdXNlZCB8fCBzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdzaW5nbGUnKSAmJiBzZWxmLml0ZW1zLmxlbmd0aCkge1xuXHQgICAgICBjb25zdCBpdGVtcyA9IHNlbGYuY29udHJvbENoaWxkcmVuKCk7XG5cdCAgICAgIGxldCBybV9pdGVtO1xuXG5cdCAgICAgIGlmIChkaXJlY3Rpb24gPCAwICYmIHNlbGVjdGlvbi5zdGFydCA9PT0gMCAmJiBzZWxlY3Rpb24ubGVuZ3RoID09PSAwKSB7XG5cdCAgICAgICAgcm1faXRlbSA9IGl0ZW1zW3NlbGYuY2FyZXRQb3MgLSAxXTtcblx0ICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPiAwICYmIHNlbGVjdGlvbi5zdGFydCA9PT0gc2VsZi5pbnB1dFZhbHVlKCkubGVuZ3RoKSB7XG5cdCAgICAgICAgcm1faXRlbSA9IGl0ZW1zW3NlbGYuY2FyZXRQb3NdO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKHJtX2l0ZW0gIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIHJtX2l0ZW1zLnB1c2gocm1faXRlbSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgaWYgKCFzZWxmLnNob3VsZERlbGV0ZShybV9pdGVtcywgZSkpIHtcblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICBwcmV2ZW50RGVmYXVsdChlLCB0cnVlKTsgLy8gcGVyZm9ybSByZW1vdmFsXG5cblx0ICAgIGlmICh0eXBlb2YgY2FyZXQgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHNlbGYuc2V0Q2FyZXQoY2FyZXQpO1xuXHQgICAgfVxuXG5cdCAgICB3aGlsZSAocm1faXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgIHNlbGYucmVtb3ZlSXRlbShybV9pdGVtcy5wb3AoKSk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuc2hvd0lucHV0KCk7XG5cdCAgICBzZWxmLnBvc2l0aW9uRHJvcGRvd24oKTtcblx0ICAgIHNlbGYucmVmcmVzaE9wdGlvbnMoZmFsc2UpO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybiB0cnVlIGlmIHRoZSBpdGVtcyBzaG91bGQgYmUgZGVsZXRlZFxuXHQgICAqL1xuXG5cblx0ICBzaG91bGREZWxldGUoaXRlbXMsIGV2dCkge1xuXHQgICAgY29uc3QgdmFsdWVzID0gaXRlbXMubWFwKGl0ZW0gPT4gaXRlbS5kYXRhc2V0LnZhbHVlKTsgLy8gYWxsb3cgdGhlIGNhbGxiYWNrIHRvIGFib3J0XG5cblx0ICAgIGlmICghdmFsdWVzLmxlbmd0aCB8fCB0eXBlb2YgdGhpcy5zZXR0aW5ncy5vbkRlbGV0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLnNldHRpbmdzLm9uRGVsZXRlKHZhbHVlcywgZXZ0KSA9PT0gZmFsc2UpIHtcblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2VsZWN0cyB0aGUgcHJldmlvdXMgLyBuZXh0IGl0ZW0gKGRlcGVuZGluZyBvbiB0aGUgYGRpcmVjdGlvbmAgYXJndW1lbnQpLlxuXHQgICAqXG5cdCAgICogPiAwIC0gcmlnaHRcblx0ICAgKiA8IDAgLSBsZWZ0XG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgYWR2YW5jZVNlbGVjdGlvbihkaXJlY3Rpb24sIGUpIHtcblx0ICAgIHZhciBsYXN0X2FjdGl2ZSxcblx0ICAgICAgICBhZGphY2VudCxcblx0ICAgICAgICBzZWxmID0gdGhpcztcblx0ICAgIGlmIChzZWxmLnJ0bCkgZGlyZWN0aW9uICo9IC0xO1xuXHQgICAgaWYgKHNlbGYuaW5wdXRWYWx1ZSgpLmxlbmd0aCkgcmV0dXJuOyAvLyBhZGQgb3IgcmVtb3ZlIHRvIGFjdGl2ZSBpdGVtc1xuXG5cdCAgICBpZiAoaXNLZXlEb3duKEtFWV9TSE9SVENVVCwgZSkgfHwgaXNLZXlEb3duKCdzaGlmdEtleScsIGUpKSB7XG5cdCAgICAgIGxhc3RfYWN0aXZlID0gc2VsZi5nZXRMYXN0QWN0aXZlKGRpcmVjdGlvbik7XG5cblx0ICAgICAgaWYgKGxhc3RfYWN0aXZlKSB7XG5cdCAgICAgICAgaWYgKCFsYXN0X2FjdGl2ZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdCAgICAgICAgICBhZGphY2VudCA9IGxhc3RfYWN0aXZlO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBhZGphY2VudCA9IHNlbGYuZ2V0QWRqYWNlbnQobGFzdF9hY3RpdmUsIGRpcmVjdGlvbiwgJ2l0ZW0nKTtcblx0ICAgICAgICB9IC8vIGlmIG5vIGFjdGl2ZSBpdGVtLCBnZXQgaXRlbXMgYWRqYWNlbnQgdG8gdGhlIGNvbnRyb2wgaW5wdXRcblxuXHQgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA+IDApIHtcblx0ICAgICAgICBhZGphY2VudCA9IHNlbGYuY29udHJvbF9pbnB1dC5uZXh0RWxlbWVudFNpYmxpbmc7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgYWRqYWNlbnQgPSBzZWxmLmNvbnRyb2xfaW5wdXQucHJldmlvdXNFbGVtZW50U2libGluZztcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChhZGphY2VudCkge1xuXHQgICAgICAgIGlmIChhZGphY2VudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdCAgICAgICAgICBzZWxmLnJlbW92ZUFjdGl2ZUl0ZW0obGFzdF9hY3RpdmUpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHNlbGYuc2V0QWN0aXZlSXRlbUNsYXNzKGFkamFjZW50KTsgLy8gbWFyayBhcyBsYXN0X2FjdGl2ZSAhISBhZnRlciByZW1vdmVBY3RpdmVJdGVtKCkgb24gbGFzdF9hY3RpdmVcblx0ICAgICAgfSAvLyBtb3ZlIGNhcmV0IHRvIHRoZSBsZWZ0IG9yIHJpZ2h0XG5cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYubW92ZUNhcmV0KGRpcmVjdGlvbik7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgbW92ZUNhcmV0KGRpcmVjdGlvbikge31cblx0ICAvKipcblx0ICAgKiBHZXQgdGhlIGxhc3QgYWN0aXZlIGl0ZW1cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBnZXRMYXN0QWN0aXZlKGRpcmVjdGlvbikge1xuXHQgICAgbGV0IGxhc3RfYWN0aXZlID0gdGhpcy5jb250cm9sLnF1ZXJ5U2VsZWN0b3IoJy5sYXN0LWFjdGl2ZScpO1xuXG5cdCAgICBpZiAobGFzdF9hY3RpdmUpIHtcblx0ICAgICAgcmV0dXJuIGxhc3RfYWN0aXZlO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgcmVzdWx0ID0gdGhpcy5jb250cm9sLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY3RpdmUnKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgICByZXR1cm4gZ2V0VGFpbChyZXN1bHQsIGRpcmVjdGlvbik7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIE1vdmVzIHRoZSBjYXJldCB0byB0aGUgc3BlY2lmaWVkIGluZGV4LlxuXHQgICAqXG5cdCAgICogVGhlIGlucHV0IG11c3QgYmUgbW92ZWQgYnkgbGVhdmluZyBpdCBpbiBwbGFjZSBhbmQgbW92aW5nIHRoZVxuXHQgICAqIHNpYmxpbmdzLCBkdWUgdG8gdGhlIGZhY3QgdGhhdCBmb2N1cyBjYW5ub3QgYmUgcmVzdG9yZWQgb25jZSBsb3N0XG5cdCAgICogb24gbW9iaWxlIHdlYmtpdCBkZXZpY2VzXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2V0Q2FyZXQobmV3X3Bvcykge1xuXHQgICAgdGhpcy5jYXJldFBvcyA9IHRoaXMuaXRlbXMubGVuZ3RoO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm4gbGlzdCBvZiBpdGVtIGRvbSBlbGVtZW50c1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNvbnRyb2xDaGlsZHJlbigpIHtcblx0ICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuY29udHJvbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10cy1pdGVtXScpKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogRGlzYWJsZXMgdXNlciBpbnB1dCBvbiB0aGUgY29udHJvbC4gVXNlZCB3aGlsZVxuXHQgICAqIGl0ZW1zIGFyZSBiZWluZyBhc3luY2hyb25vdXNseSBjcmVhdGVkLlxuXHQgICAqL1xuXG5cblx0ICBsb2NrKCkge1xuXHQgICAgdGhpcy5pc0xvY2tlZCA9IHRydWU7XG5cdCAgICB0aGlzLnJlZnJlc2hTdGF0ZSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZS1lbmFibGVzIHVzZXIgaW5wdXQgb24gdGhlIGNvbnRyb2wuXG5cdCAgICovXG5cblxuXHQgIHVubG9jaygpIHtcblx0ICAgIHRoaXMuaXNMb2NrZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMucmVmcmVzaFN0YXRlKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIERpc2FibGVzIHVzZXIgaW5wdXQgb24gdGhlIGNvbnRyb2wgY29tcGxldGVseS5cblx0ICAgKiBXaGlsZSBkaXNhYmxlZCwgaXQgY2Fubm90IHJlY2VpdmUgZm9jdXMuXG5cdCAgICovXG5cblxuXHQgIGRpc2FibGUoKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBzZWxmLmlucHV0LmRpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHNlbGYuY29udHJvbF9pbnB1dC5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICBzZWxmLmZvY3VzX25vZGUudGFiSW5kZXggPSAtMTtcblx0ICAgIHNlbGYuaXNEaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLmNsb3NlKCk7XG5cdCAgICBzZWxmLmxvY2soKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogRW5hYmxlcyB0aGUgY29udHJvbCBzbyB0aGF0IGl0IGNhbiByZXNwb25kXG5cdCAgICogdG8gZm9jdXMgYW5kIHVzZXIgaW5wdXQuXG5cdCAgICovXG5cblxuXHQgIGVuYWJsZSgpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHNlbGYuaW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIHNlbGYuY29udHJvbF9pbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgc2VsZi5mb2N1c19ub2RlLnRhYkluZGV4ID0gc2VsZi50YWJJbmRleDtcblx0ICAgIHNlbGYuaXNEaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgc2VsZi51bmxvY2soKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQ29tcGxldGVseSBkZXN0cm95cyB0aGUgY29udHJvbCBhbmRcblx0ICAgKiB1bmJpbmRzIGFsbCBldmVudCBsaXN0ZW5lcnMgc28gdGhhdCBpdCBjYW5cblx0ICAgKiBiZSBnYXJiYWdlIGNvbGxlY3RlZC5cblx0ICAgKi9cblxuXG5cdCAgZGVzdHJveSgpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciByZXZlcnRTZXR0aW5ncyA9IHNlbGYucmV2ZXJ0U2V0dGluZ3M7XG5cdCAgICBzZWxmLnRyaWdnZXIoJ2Rlc3Ryb3knKTtcblx0ICAgIHNlbGYub2ZmKCk7XG5cdCAgICBzZWxmLndyYXBwZXIucmVtb3ZlKCk7XG5cdCAgICBzZWxmLmRyb3Bkb3duLnJlbW92ZSgpO1xuXHQgICAgc2VsZi5pbnB1dC5pbm5lckhUTUwgPSByZXZlcnRTZXR0aW5ncy5pbm5lckhUTUw7XG5cdCAgICBzZWxmLmlucHV0LnRhYkluZGV4ID0gcmV2ZXJ0U2V0dGluZ3MudGFiSW5kZXg7XG5cdCAgICByZW1vdmVDbGFzc2VzKHNlbGYuaW5wdXQsICd0b21zZWxlY3RlZCcsICd0cy1oaWRkZW4tYWNjZXNzaWJsZScpO1xuXG5cdCAgICBzZWxmLl9kZXN0cm95KCk7XG5cblx0ICAgIGRlbGV0ZSBzZWxmLmlucHV0LnRvbXNlbGVjdDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQSBoZWxwZXIgbWV0aG9kIGZvciByZW5kZXJpbmcgXCJpdGVtXCIgYW5kXG5cdCAgICogXCJvcHRpb25cIiB0ZW1wbGF0ZXMsIGdpdmVuIHRoZSBkYXRhLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHJlbmRlcih0ZW1wbGF0ZU5hbWUsIGRhdGEpIHtcblx0ICAgIHZhciBpZCwgaHRtbDtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAodHlwZW9mIHRoaXMuc2V0dGluZ3MucmVuZGVyW3RlbXBsYXRlTmFtZV0gIT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9IC8vIHJlbmRlciBtYXJrdXBcblxuXG5cdCAgICBodG1sID0gc2VsZi5zZXR0aW5ncy5yZW5kZXJbdGVtcGxhdGVOYW1lXS5jYWxsKHRoaXMsIGRhdGEsIGVzY2FwZV9odG1sKTtcblxuXHQgICAgaWYgKCFodG1sKSB7XG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXG5cdCAgICBodG1sID0gZ2V0RG9tKGh0bWwpOyAvLyBhZGQgbWFuZGF0b3J5IGF0dHJpYnV0ZXNcblxuXHQgICAgaWYgKHRlbXBsYXRlTmFtZSA9PT0gJ29wdGlvbicgfHwgdGVtcGxhdGVOYW1lID09PSAnb3B0aW9uX2NyZWF0ZScpIHtcblx0ICAgICAgaWYgKGRhdGFbc2VsZi5zZXR0aW5ncy5kaXNhYmxlZEZpZWxkXSkge1xuXHQgICAgICAgIHNldEF0dHIoaHRtbCwge1xuXHQgICAgICAgICAgJ2FyaWEtZGlzYWJsZWQnOiAndHJ1ZSdcblx0ICAgICAgICB9KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBzZXRBdHRyKGh0bWwsIHtcblx0ICAgICAgICAgICdkYXRhLXNlbGVjdGFibGUnOiAnJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2UgaWYgKHRlbXBsYXRlTmFtZSA9PT0gJ29wdGdyb3VwJykge1xuXHQgICAgICBpZCA9IGRhdGEuZ3JvdXBbc2VsZi5zZXR0aW5ncy5vcHRncm91cFZhbHVlRmllbGRdO1xuXHQgICAgICBzZXRBdHRyKGh0bWwsIHtcblx0ICAgICAgICAnZGF0YS1ncm91cCc6IGlkXG5cdCAgICAgIH0pO1xuXG5cdCAgICAgIGlmIChkYXRhLmdyb3VwW3NlbGYuc2V0dGluZ3MuZGlzYWJsZWRGaWVsZF0pIHtcblx0ICAgICAgICBzZXRBdHRyKGh0bWwsIHtcblx0ICAgICAgICAgICdkYXRhLWRpc2FibGVkJzogJydcblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBpZiAodGVtcGxhdGVOYW1lID09PSAnb3B0aW9uJyB8fCB0ZW1wbGF0ZU5hbWUgPT09ICdpdGVtJykge1xuXHQgICAgICBjb25zdCB2YWx1ZSA9IGdldF9oYXNoKGRhdGFbc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXSk7XG5cdCAgICAgIHNldEF0dHIoaHRtbCwge1xuXHQgICAgICAgICdkYXRhLXZhbHVlJzogdmFsdWVcblx0ICAgICAgfSk7IC8vIG1ha2Ugc3VyZSB3ZSBoYXZlIHNvbWUgY2xhc3NlcyBpZiBhIHRlbXBsYXRlIGlzIG92ZXJ3cml0dGVuXG5cblx0ICAgICAgaWYgKHRlbXBsYXRlTmFtZSA9PT0gJ2l0ZW0nKSB7XG5cdCAgICAgICAgYWRkQ2xhc3NlcyhodG1sLCBzZWxmLnNldHRpbmdzLml0ZW1DbGFzcyk7XG5cdCAgICAgICAgc2V0QXR0cihodG1sLCB7XG5cdCAgICAgICAgICAnZGF0YS10cy1pdGVtJzogJydcblx0ICAgICAgICB9KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBhZGRDbGFzc2VzKGh0bWwsIHNlbGYuc2V0dGluZ3Mub3B0aW9uQ2xhc3MpO1xuXHQgICAgICAgIHNldEF0dHIoaHRtbCwge1xuXHQgICAgICAgICAgcm9sZTogJ29wdGlvbicsXG5cdCAgICAgICAgICBpZDogZGF0YS4kaWRcblx0ICAgICAgICB9KTsgLy8gdXBkYXRlIGNhY2hlXG5cblx0ICAgICAgICBkYXRhLiRkaXYgPSBodG1sO1xuXHQgICAgICAgIHNlbGYub3B0aW9uc1t2YWx1ZV0gPSBkYXRhO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBodG1sO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUeXBlIGd1YXJkZWQgcmVuZGVyaW5nXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgX3JlbmRlcih0ZW1wbGF0ZU5hbWUsIGRhdGEpIHtcblx0ICAgIGNvbnN0IGh0bWwgPSB0aGlzLnJlbmRlcih0ZW1wbGF0ZU5hbWUsIGRhdGEpO1xuXG5cdCAgICBpZiAoaHRtbCA9PSBudWxsKSB7XG5cdCAgICAgIHRocm93ICdIVE1MRWxlbWVudCBleHBlY3RlZCc7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBodG1sO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDbGVhcnMgdGhlIHJlbmRlciBjYWNoZSBmb3IgYSB0ZW1wbGF0ZS4gSWZcblx0ICAgKiBubyB0ZW1wbGF0ZSBpcyBnaXZlbiwgY2xlYXJzIGFsbCByZW5kZXJcblx0ICAgKiBjYWNoZXMuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY2xlYXJDYWNoZSgpIHtcblx0ICAgIGl0ZXJhdGUkMSh0aGlzLm9wdGlvbnMsIG9wdGlvbiA9PiB7XG5cdCAgICAgIGlmIChvcHRpb24uJGRpdikge1xuXHQgICAgICAgIG9wdGlvbi4kZGl2LnJlbW92ZSgpO1xuXHQgICAgICAgIGRlbGV0ZSBvcHRpb24uJGRpdjtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlbW92ZXMgYSB2YWx1ZSBmcm9tIGl0ZW0gYW5kIG9wdGlvbiBjYWNoZXNcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICB1bmNhY2hlVmFsdWUodmFsdWUpIHtcblx0ICAgIGNvbnN0IG9wdGlvbl9lbCA9IHRoaXMuZ2V0T3B0aW9uKHZhbHVlKTtcblx0ICAgIGlmIChvcHRpb25fZWwpIG9wdGlvbl9lbC5yZW1vdmUoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0byBkaXNwbGF5IHRoZVxuXHQgICAqIGNyZWF0ZSBpdGVtIHByb21wdCwgZ2l2ZW4gYSB1c2VyIGlucHV0LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNhbkNyZWF0ZShpbnB1dCkge1xuXHQgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuY3JlYXRlICYmIGlucHV0Lmxlbmd0aCA+IDAgJiYgdGhpcy5zZXR0aW5ncy5jcmVhdGVGaWx0ZXIuY2FsbCh0aGlzLCBpbnB1dCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFdyYXBzIHRoaXMuYG1ldGhvZGAgc28gdGhhdCBgbmV3X2ZuYCBjYW4gYmUgaW52b2tlZCAnYmVmb3JlJywgJ2FmdGVyJywgb3IgJ2luc3RlYWQnIG9mIHRoZSBvcmlnaW5hbCBtZXRob2Rcblx0ICAgKlxuXHQgICAqIHRoaXMuaG9vaygnaW5zdGVhZCcsJ29uS2V5RG93bicsZnVuY3Rpb24oIGFyZzEsIGFyZzIgLi4uKXtcblx0ICAgKlxuXHQgICAqIH0pO1xuXHQgICAqL1xuXG5cblx0ICBob29rKHdoZW4sIG1ldGhvZCwgbmV3X2ZuKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgb3JpZ19tZXRob2QgPSBzZWxmW21ldGhvZF07XG5cblx0ICAgIHNlbGZbbWV0aG9kXSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgdmFyIHJlc3VsdCwgcmVzdWx0X25ldztcblxuXHQgICAgICBpZiAod2hlbiA9PT0gJ2FmdGVyJykge1xuXHQgICAgICAgIHJlc3VsdCA9IG9yaWdfbWV0aG9kLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXN1bHRfbmV3ID0gbmV3X2ZuLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cblx0ICAgICAgaWYgKHdoZW4gPT09ICdpbnN0ZWFkJykge1xuXHQgICAgICAgIHJldHVybiByZXN1bHRfbmV3O1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKHdoZW4gPT09ICdiZWZvcmUnKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gb3JpZ19tZXRob2QuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiByZXN1bHQ7XG5cdCAgICB9O1xuXHQgIH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJjaGFuZ2VfbGlzdGVuZXJcIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBjaGFuZ2VfbGlzdGVuZXIgKCkge1xuXHQgIGFkZEV2ZW50KHRoaXMuaW5wdXQsICdjaGFuZ2UnLCAoKSA9PiB7XG5cdCAgICB0aGlzLnN5bmMoKTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwicmVzdG9yZV9vbl9iYWNrc3BhY2VcIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja2JveF9vcHRpb25zICgpIHtcblx0ICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgdmFyIG9yaWdfb25PcHRpb25TZWxlY3QgPSBzZWxmLm9uT3B0aW9uU2VsZWN0O1xuXHQgIHNlbGYuc2V0dGluZ3MuaGlkZVNlbGVjdGVkID0gZmFsc2U7IC8vIHVwZGF0ZSB0aGUgY2hlY2tib3ggZm9yIGFuIG9wdGlvblxuXG5cdCAgdmFyIFVwZGF0ZUNoZWNrYm94ID0gZnVuY3Rpb24gVXBkYXRlQ2hlY2tib3gob3B0aW9uKSB7XG5cdCAgICBzZXRUaW1lb3V0KCgpID0+IHtcblx0ICAgICAgdmFyIGNoZWNrYm94ID0gb3B0aW9uLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG5cblx0ICAgICAgaWYgKGNoZWNrYm94IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuXHQgICAgICAgIGlmIChvcHRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpKSB7XG5cdCAgICAgICAgICBjaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSwgMSk7XG5cdCAgfTsgLy8gYWRkIGNoZWNrYm94IHRvIG9wdGlvbiB0ZW1wbGF0ZVxuXG5cblx0ICBzZWxmLmhvb2soJ2FmdGVyJywgJ3NldHVwVGVtcGxhdGVzJywgKCkgPT4ge1xuXHQgICAgdmFyIG9yaWdfcmVuZGVyX29wdGlvbiA9IHNlbGYuc2V0dGluZ3MucmVuZGVyLm9wdGlvbjtcblxuXHQgICAgc2VsZi5zZXR0aW5ncy5yZW5kZXIub3B0aW9uID0gKGRhdGEsIGVzY2FwZV9odG1sKSA9PiB7XG5cdCAgICAgIHZhciByZW5kZXJlZCA9IGdldERvbShvcmlnX3JlbmRlcl9vcHRpb24uY2FsbChzZWxmLCBkYXRhLCBlc2NhcGVfaHRtbCkpO1xuXHQgICAgICB2YXIgY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHQgICAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldnQpIHtcblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChldnQpO1xuXHQgICAgICB9KTtcblx0ICAgICAgY2hlY2tib3gudHlwZSA9ICdjaGVja2JveCc7XG5cdCAgICAgIGNvbnN0IGhhc2hlZCA9IGhhc2hfa2V5KGRhdGFbc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXSk7XG5cblx0ICAgICAgaWYgKGhhc2hlZCAmJiBzZWxmLml0ZW1zLmluZGV4T2YoaGFzaGVkKSA+IC0xKSB7XG5cdCAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG5cdCAgICAgIH1cblxuXHQgICAgICByZW5kZXJlZC5wcmVwZW5kKGNoZWNrYm94KTtcblx0ICAgICAgcmV0dXJuIHJlbmRlcmVkO1xuXHQgICAgfTtcblx0ICB9KTsgLy8gdW5jaGVjayB3aGVuIGl0ZW0gcmVtb3ZlZFxuXG5cdCAgc2VsZi5vbignaXRlbV9yZW1vdmUnLCB2YWx1ZSA9PiB7XG5cdCAgICB2YXIgb3B0aW9uID0gc2VsZi5nZXRPcHRpb24odmFsdWUpO1xuXG5cdCAgICBpZiAob3B0aW9uKSB7XG5cdCAgICAgIC8vIGlmIGRyb3Bkb3duIGhhc24ndCBiZWVuIG9wZW5lZCB5ZXQsIHRoZSBvcHRpb24gd29uJ3QgZXhpc3Rcblx0ICAgICAgb3B0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7IC8vIHNlbGVjdGVkIGNsYXNzIHdvbid0IGJlIHJlbW92ZWQgeWV0XG5cblx0ICAgICAgVXBkYXRlQ2hlY2tib3gob3B0aW9uKTtcblx0ICAgIH1cblx0ICB9KTsgLy8gY2hlY2sgd2hlbiBpdGVtIGFkZGVkXG5cblx0ICBzZWxmLm9uKCdpdGVtX2FkZCcsIHZhbHVlID0+IHtcblx0ICAgIHZhciBvcHRpb24gPSBzZWxmLmdldE9wdGlvbih2YWx1ZSk7XG5cblx0ICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgLy8gaWYgZHJvcGRvd24gaGFzbid0IGJlZW4gb3BlbmVkIHlldCwgdGhlIG9wdGlvbiB3b24ndCBleGlzdFxuXHQgICAgICBVcGRhdGVDaGVja2JveChvcHRpb24pO1xuXHQgICAgfVxuXHQgIH0pOyAvLyByZW1vdmUgaXRlbXMgd2hlbiBzZWxlY3RlZCBvcHRpb24gaXMgY2xpY2tlZFxuXG5cdCAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ29uT3B0aW9uU2VsZWN0JywgKGV2dCwgb3B0aW9uKSA9PiB7XG5cdCAgICBpZiAob3B0aW9uLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSkge1xuXHQgICAgICBvcHRpb24uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcblx0ICAgICAgc2VsZi5yZW1vdmVJdGVtKG9wdGlvbi5kYXRhc2V0LnZhbHVlKTtcblx0ICAgICAgc2VsZi5yZWZyZXNoT3B0aW9ucygpO1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChldnQsIHRydWUpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIG9yaWdfb25PcHRpb25TZWxlY3QuY2FsbChzZWxmLCBldnQsIG9wdGlvbik7XG5cdCAgICBVcGRhdGVDaGVja2JveChvcHRpb24pO1xuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJkcm9wZG93bl9oZWFkZXJcIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBjbGVhcl9idXR0b24gKHVzZXJPcHRpb25zKSB7XG5cdCAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuXHQgICAgY2xhc3NOYW1lOiAnY2xlYXItYnV0dG9uJyxcblx0ICAgIHRpdGxlOiAnQ2xlYXIgQWxsJyxcblx0ICAgIGh0bWw6IGRhdGEgPT4ge1xuXHQgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCIke2RhdGEuY2xhc3NOYW1lfVwiIHRpdGxlPVwiJHtkYXRhLnRpdGxlfVwiPiYjMTA3OTk7PC9kaXY+YDtcblx0ICAgIH1cblx0ICB9LCB1c2VyT3B0aW9ucyk7XG5cdCAgc2VsZi5vbignaW5pdGlhbGl6ZScsICgpID0+IHtcblx0ICAgIHZhciBidXR0b24gPSBnZXREb20ob3B0aW9ucy5odG1sKG9wdGlvbnMpKTtcblx0ICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2dCA9PiB7XG5cdCAgICAgIGlmIChzZWxmLmlzRGlzYWJsZWQpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblxuXHQgICAgICBzZWxmLmNsZWFyKCk7XG5cblx0ICAgICAgaWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScgJiYgc2VsZi5zZXR0aW5ncy5hbGxvd0VtcHR5T3B0aW9uKSB7XG5cdCAgICAgICAgc2VsZi5hZGRJdGVtKCcnKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICB9KTtcblx0ICAgIHNlbGYuY29udHJvbC5hcHBlbmRDaGlsZChidXR0b24pO1xuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJkcmFnX2Ryb3BcIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBkcmFnX2Ryb3AgKCkge1xuXHQgIHZhciBzZWxmID0gdGhpcztcblx0ICBpZiAoISQuZm4uc29ydGFibGUpIHRocm93IG5ldyBFcnJvcignVGhlIFwiZHJhZ19kcm9wXCIgcGx1Z2luIHJlcXVpcmVzIGpRdWVyeSBVSSBcInNvcnRhYmxlXCIuJyk7XG5cdCAgaWYgKHNlbGYuc2V0dGluZ3MubW9kZSAhPT0gJ211bHRpJykgcmV0dXJuO1xuXHQgIHZhciBvcmlnX2xvY2sgPSBzZWxmLmxvY2s7XG5cdCAgdmFyIG9yaWdfdW5sb2NrID0gc2VsZi51bmxvY2s7XG5cdCAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ2xvY2snLCAoKSA9PiB7XG5cdCAgICB2YXIgc29ydGFibGUgPSAkKHNlbGYuY29udHJvbCkuZGF0YSgnc29ydGFibGUnKTtcblx0ICAgIGlmIChzb3J0YWJsZSkgc29ydGFibGUuZGlzYWJsZSgpO1xuXHQgICAgcmV0dXJuIG9yaWdfbG9jay5jYWxsKHNlbGYpO1xuXHQgIH0pO1xuXHQgIHNlbGYuaG9vaygnaW5zdGVhZCcsICd1bmxvY2snLCAoKSA9PiB7XG5cdCAgICB2YXIgc29ydGFibGUgPSAkKHNlbGYuY29udHJvbCkuZGF0YSgnc29ydGFibGUnKTtcblx0ICAgIGlmIChzb3J0YWJsZSkgc29ydGFibGUuZW5hYmxlKCk7XG5cdCAgICByZXR1cm4gb3JpZ191bmxvY2suY2FsbChzZWxmKTtcblx0ICB9KTtcblx0ICBzZWxmLm9uKCdpbml0aWFsaXplJywgKCkgPT4ge1xuXHQgICAgdmFyICRjb250cm9sID0gJChzZWxmLmNvbnRyb2wpLnNvcnRhYmxlKHtcblx0ICAgICAgaXRlbXM6ICdbZGF0YS12YWx1ZV0nLFxuXHQgICAgICBmb3JjZVBsYWNlaG9sZGVyU2l6ZTogdHJ1ZSxcblx0ICAgICAgZGlzYWJsZWQ6IHNlbGYuaXNMb2NrZWQsXG5cdCAgICAgIHN0YXJ0OiAoZSwgdWkpID0+IHtcblx0ICAgICAgICB1aS5wbGFjZWhvbGRlci5jc3MoJ3dpZHRoJywgdWkuaGVscGVyLmNzcygnd2lkdGgnKSk7XG5cdCAgICAgICAgJGNvbnRyb2wuY3NzKHtcblx0ICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZSdcblx0ICAgICAgICB9KTtcblx0ICAgICAgfSxcblx0ICAgICAgc3RvcDogKCkgPT4ge1xuXHQgICAgICAgICRjb250cm9sLmNzcyh7XG5cdCAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcblx0ICAgICAgICB9KTtcblx0ICAgICAgICB2YXIgdmFsdWVzID0gW107XG5cdCAgICAgICAgJGNvbnRyb2wuY2hpbGRyZW4oJ1tkYXRhLXZhbHVlXScpLmVhY2goZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgaWYgKHRoaXMuZGF0YXNldC52YWx1ZSkgdmFsdWVzLnB1c2godGhpcy5kYXRhc2V0LnZhbHVlKTtcblx0ICAgICAgICB9KTtcblx0ICAgICAgICBzZWxmLnNldFZhbHVlKHZhbHVlcyk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJkcm9wZG93bl9oZWFkZXJcIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBkcm9wZG93bl9oZWFkZXIgKHVzZXJPcHRpb25zKSB7XG5cdCAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuXHQgICAgdGl0bGU6ICdVbnRpdGxlZCcsXG5cdCAgICBoZWFkZXJDbGFzczogJ2Ryb3Bkb3duLWhlYWRlcicsXG5cdCAgICB0aXRsZVJvd0NsYXNzOiAnZHJvcGRvd24taGVhZGVyLXRpdGxlJyxcblx0ICAgIGxhYmVsQ2xhc3M6ICdkcm9wZG93bi1oZWFkZXItbGFiZWwnLFxuXHQgICAgY2xvc2VDbGFzczogJ2Ryb3Bkb3duLWhlYWRlci1jbG9zZScsXG5cdCAgICBodG1sOiBkYXRhID0+IHtcblx0ICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiJyArIGRhdGEuaGVhZGVyQ2xhc3MgKyAnXCI+JyArICc8ZGl2IGNsYXNzPVwiJyArIGRhdGEudGl0bGVSb3dDbGFzcyArICdcIj4nICsgJzxzcGFuIGNsYXNzPVwiJyArIGRhdGEubGFiZWxDbGFzcyArICdcIj4nICsgZGF0YS50aXRsZSArICc8L3NwYW4+JyArICc8YSBjbGFzcz1cIicgKyBkYXRhLmNsb3NlQ2xhc3MgKyAnXCI+JnRpbWVzOzwvYT4nICsgJzwvZGl2PicgKyAnPC9kaXY+Jztcblx0ICAgIH1cblx0ICB9LCB1c2VyT3B0aW9ucyk7XG5cdCAgc2VsZi5vbignaW5pdGlhbGl6ZScsICgpID0+IHtcblx0ICAgIHZhciBoZWFkZXIgPSBnZXREb20ob3B0aW9ucy5odG1sKG9wdGlvbnMpKTtcblx0ICAgIHZhciBjbG9zZV9saW5rID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy4nICsgb3B0aW9ucy5jbG9zZUNsYXNzKTtcblxuXHQgICAgaWYgKGNsb3NlX2xpbmspIHtcblx0ICAgICAgY2xvc2VfbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2dCA9PiB7XG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgICAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLmRyb3Bkb3duLmluc2VydEJlZm9yZShoZWFkZXIsIHNlbGYuZHJvcGRvd24uZmlyc3RDaGlsZCk7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImRyb3Bkb3duX2lucHV0XCIgKFRvbSBTZWxlY3QpXG5cdCAqIENvcHlyaWdodCAoYykgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gY2FyZXRfcG9zaXRpb24gKCkge1xuXHQgIHZhciBzZWxmID0gdGhpcztcblx0ICAvKipcblx0ICAgKiBNb3ZlcyB0aGUgY2FyZXQgdG8gdGhlIHNwZWNpZmllZCBpbmRleC5cblx0ICAgKlxuXHQgICAqIFRoZSBpbnB1dCBtdXN0IGJlIG1vdmVkIGJ5IGxlYXZpbmcgaXQgaW4gcGxhY2UgYW5kIG1vdmluZyB0aGVcblx0ICAgKiBzaWJsaW5ncywgZHVlIHRvIHRoZSBmYWN0IHRoYXQgZm9jdXMgY2Fubm90IGJlIHJlc3RvcmVkIG9uY2UgbG9zdFxuXHQgICAqIG9uIG1vYmlsZSB3ZWJraXQgZGV2aWNlc1xuXHQgICAqXG5cdCAgICovXG5cblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnc2V0Q2FyZXQnLCBuZXdfcG9zID0+IHtcblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdzaW5nbGUnIHx8ICFzZWxmLmNvbnRyb2wuY29udGFpbnMoc2VsZi5jb250cm9sX2lucHV0KSkge1xuXHQgICAgICBuZXdfcG9zID0gc2VsZi5pdGVtcy5sZW5ndGg7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBuZXdfcG9zID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oc2VsZi5pdGVtcy5sZW5ndGgsIG5ld19wb3MpKTtcblxuXHQgICAgICBpZiAobmV3X3BvcyAhPSBzZWxmLmNhcmV0UG9zICYmICFzZWxmLmlzUGVuZGluZykge1xuXHQgICAgICAgIHNlbGYuY29udHJvbENoaWxkcmVuKCkuZm9yRWFjaCgoY2hpbGQsIGopID0+IHtcblx0ICAgICAgICAgIGlmIChqIDwgbmV3X3Bvcykge1xuXHQgICAgICAgICAgICBzZWxmLmNvbnRyb2xfaW5wdXQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdiZWZvcmViZWdpbicsIGNoaWxkKTtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHNlbGYuY29udHJvbC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgc2VsZi5jYXJldFBvcyA9IG5ld19wb3M7XG5cdCAgfSk7XG5cdCAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ21vdmVDYXJldCcsIGRpcmVjdGlvbiA9PiB7XG5cdCAgICBpZiAoIXNlbGYuaXNGb2N1c2VkKSByZXR1cm47IC8vIG1vdmUgY2FyZXQgYmVmb3JlIG9yIGFmdGVyIHNlbGVjdGVkIGl0ZW1zXG5cblx0ICAgIGNvbnN0IGxhc3RfYWN0aXZlID0gc2VsZi5nZXRMYXN0QWN0aXZlKGRpcmVjdGlvbik7XG5cblx0ICAgIGlmIChsYXN0X2FjdGl2ZSkge1xuXHQgICAgICBjb25zdCBpZHggPSBub2RlSW5kZXgobGFzdF9hY3RpdmUpO1xuXHQgICAgICBzZWxmLnNldENhcmV0KGRpcmVjdGlvbiA+IDAgPyBpZHggKyAxIDogaWR4KTtcblx0ICAgICAgc2VsZi5zZXRBY3RpdmVJdGVtKCk7XG5cdCAgICAgIHJlbW92ZUNsYXNzZXMobGFzdF9hY3RpdmUsICdsYXN0LWFjdGl2ZScpOyAvLyBtb3ZlIGNhcmV0IGxlZnQgb3IgcmlnaHQgb2YgY3VycmVudCBwb3NpdGlvblxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2VsZi5zZXRDYXJldChzZWxmLmNhcmV0UG9zICsgZGlyZWN0aW9uKTtcblx0ICAgIH1cblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwiZHJvcGRvd25faW5wdXRcIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBkcm9wZG93bl9pbnB1dCAoKSB7XG5cdCAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgc2VsZi5zZXR0aW5ncy5zaG91bGRPcGVuID0gdHJ1ZTsgLy8gbWFrZSBzdXJlIHRoZSBpbnB1dCBpcyBzaG93biBldmVuIGlmIHRoZXJlIGFyZSBubyBvcHRpb25zIHRvIGRpc3BsYXkgaW4gdGhlIGRyb3Bkb3duXG5cblx0ICBzZWxmLmhvb2soJ2JlZm9yZScsICdzZXR1cCcsICgpID0+IHtcblx0ICAgIHNlbGYuZm9jdXNfbm9kZSA9IHNlbGYuY29udHJvbDtcblx0ICAgIGFkZENsYXNzZXMoc2VsZi5jb250cm9sX2lucHV0LCAnZHJvcGRvd24taW5wdXQnKTtcblx0ICAgIGNvbnN0IGRpdiA9IGdldERvbSgnPGRpdiBjbGFzcz1cImRyb3Bkb3duLWlucHV0LXdyYXBcIj4nKTtcblx0ICAgIGRpdi5hcHBlbmQoc2VsZi5jb250cm9sX2lucHV0KTtcblx0ICAgIHNlbGYuZHJvcGRvd24uaW5zZXJ0QmVmb3JlKGRpdiwgc2VsZi5kcm9wZG93bi5maXJzdENoaWxkKTsgLy8gc2V0IGEgcGxhY2Vob2xkZXIgaW4gdGhlIHNlbGVjdCBjb250cm9sXG5cblx0ICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gZ2V0RG9tKCc8aW5wdXQgY2xhc3M9XCJpdGVtcy1wbGFjZWhvbGRlclwiIHRhYmluZGV4PVwiLTFcIiAvPicpO1xuXHQgICAgcGxhY2Vob2xkZXIucGxhY2Vob2xkZXIgPSBzZWxmLnNldHRpbmdzLnBsYWNlaG9sZGVyIHx8ICcnO1xuXHQgICAgc2VsZi5jb250cm9sLmFwcGVuZChwbGFjZWhvbGRlcik7XG5cdCAgfSk7XG5cdCAgc2VsZi5vbignaW5pdGlhbGl6ZScsICgpID0+IHtcblx0ICAgIC8vIHNldCB0YWJJbmRleCBvbiBjb250cm9sIHRvIC0xLCBvdGhlcndpc2UgW3NoaWZ0K3RhYl0gd2lsbCBwdXQgZm9jdXMgcmlnaHQgYmFjayBvbiBjb250cm9sX2lucHV0XG5cdCAgICBzZWxmLmNvbnRyb2xfaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2dCA9PiB7XG5cdCAgICAgIC8vYWRkRXZlbnQoc2VsZi5jb250cm9sX2lucHV0LCdrZXlkb3duJyBhcyBjb25zdCwoZXZ0OktleWJvYXJkRXZlbnQpID0+e1xuXHQgICAgICBzd2l0Y2ggKGV2dC5rZXlDb2RlKSB7XG5cdCAgICAgICAgY2FzZSBLRVlfRVNDOlxuXHQgICAgICAgICAgaWYgKHNlbGYuaXNPcGVuKSB7XG5cdCAgICAgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgICAgICAgIH1cblxuXHQgICAgICAgICAgc2VsZi5jbGVhckFjdGl2ZUl0ZW1zKCk7XG5cdCAgICAgICAgICByZXR1cm47XG5cblx0ICAgICAgICBjYXNlIEtFWV9UQUI6XG5cdCAgICAgICAgICBzZWxmLmZvY3VzX25vZGUudGFiSW5kZXggPSAtMTtcblx0ICAgICAgICAgIGJyZWFrO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIHNlbGYub25LZXlEb3duLmNhbGwoc2VsZiwgZXZ0KTtcblx0ICAgIH0pO1xuXHQgICAgc2VsZi5vbignYmx1cicsICgpID0+IHtcblx0ICAgICAgc2VsZi5mb2N1c19ub2RlLnRhYkluZGV4ID0gc2VsZi5pc0Rpc2FibGVkID8gLTEgOiBzZWxmLnRhYkluZGV4O1xuXHQgICAgfSk7IC8vIGdpdmUgdGhlIGNvbnRyb2xfaW5wdXQgZm9jdXMgd2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlblxuXG5cdCAgICBzZWxmLm9uKCdkcm9wZG93bl9vcGVuJywgKCkgPT4ge1xuXHQgICAgICBzZWxmLmNvbnRyb2xfaW5wdXQuZm9jdXMoKTtcblx0ICAgIH0pOyAvLyBwcmV2ZW50IG9uQmx1ciBmcm9tIGNsb3Npbmcgd2hlbiBmb2N1cyBpcyBvbiB0aGUgY29udHJvbF9pbnB1dFxuXG5cdCAgICBjb25zdCBvcmlnX29uQmx1ciA9IHNlbGYub25CbHVyO1xuXHQgICAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ29uQmx1cicsIGV2dCA9PiB7XG5cdCAgICAgIGlmIChldnQgJiYgZXZ0LnJlbGF0ZWRUYXJnZXQgPT0gc2VsZi5jb250cm9sX2lucHV0KSByZXR1cm47XG5cdCAgICAgIHJldHVybiBvcmlnX29uQmx1ci5jYWxsKHNlbGYpO1xuXHQgICAgfSk7XG5cdCAgICBhZGRFdmVudChzZWxmLmNvbnRyb2xfaW5wdXQsICdibHVyJywgKCkgPT4gc2VsZi5vbkJsdXIoKSk7IC8vIHJldHVybiBmb2N1cyB0byBjb250cm9sIHRvIGFsbG93IGZ1cnRoZXIga2V5Ym9hcmQgaW5wdXRcblxuXHQgICAgc2VsZi5ob29rKCdiZWZvcmUnLCAnY2xvc2UnLCAoKSA9PiB7XG5cdCAgICAgIGlmICghc2VsZi5pc09wZW4pIHJldHVybjtcblx0ICAgICAgc2VsZi5mb2N1c19ub2RlLmZvY3VzKHtcblx0ICAgICAgICBwcmV2ZW50U2Nyb2xsOiB0cnVlXG5cdCAgICAgIH0pO1xuXHQgICAgfSk7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImlucHV0X2F1dG9ncm93XCIgKFRvbSBTZWxlY3QpXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gaW5wdXRfYXV0b2dyb3cgKCkge1xuXHQgIHZhciBzZWxmID0gdGhpcztcblx0ICBzZWxmLm9uKCdpbml0aWFsaXplJywgKCkgPT4ge1xuXHQgICAgdmFyIHRlc3RfaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdCAgICB2YXIgY29udHJvbCA9IHNlbGYuY29udHJvbF9pbnB1dDtcblx0ICAgIHRlc3RfaW5wdXQuc3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjphYnNvbHV0ZTsgdG9wOi05OTk5OXB4OyBsZWZ0Oi05OTk5OXB4OyB3aWR0aDphdXRvOyBwYWRkaW5nOjA7IHdoaXRlLXNwYWNlOnByZTsgJztcblx0ICAgIHNlbGYud3JhcHBlci5hcHBlbmRDaGlsZCh0ZXN0X2lucHV0KTtcblx0ICAgIHZhciB0cmFuc2Zlcl9zdHlsZXMgPSBbJ2xldHRlclNwYWNpbmcnLCAnZm9udFNpemUnLCAnZm9udEZhbWlseScsICdmb250V2VpZ2h0JywgJ3RleHRUcmFuc2Zvcm0nXTtcblxuXHQgICAgZm9yIChjb25zdCBzdHlsZV9uYW1lIG9mIHRyYW5zZmVyX3N0eWxlcykge1xuXHQgICAgICAvLyBAdHMtaWdub3JlIFRTNzAxNSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTA1MDYxNTQvNjk3NTc2XG5cdCAgICAgIHRlc3RfaW5wdXQuc3R5bGVbc3R5bGVfbmFtZV0gPSBjb250cm9sLnN0eWxlW3N0eWxlX25hbWVdO1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBTZXQgdGhlIGNvbnRyb2wgd2lkdGhcblx0ICAgICAqXG5cdCAgICAgKi9cblxuXG5cdCAgICB2YXIgcmVzaXplID0gKCkgPT4ge1xuXHQgICAgICB0ZXN0X2lucHV0LnRleHRDb250ZW50ID0gY29udHJvbC52YWx1ZTtcblx0ICAgICAgY29udHJvbC5zdHlsZS53aWR0aCA9IHRlc3RfaW5wdXQuY2xpZW50V2lkdGggKyAncHgnO1xuXHQgICAgfTtcblxuXHQgICAgcmVzaXplKCk7XG5cdCAgICBzZWxmLm9uKCd1cGRhdGUgaXRlbV9hZGQgaXRlbV9yZW1vdmUnLCByZXNpemUpO1xuXHQgICAgYWRkRXZlbnQoY29udHJvbCwgJ2lucHV0JywgcmVzaXplKTtcblx0ICAgIGFkZEV2ZW50KGNvbnRyb2wsICdrZXl1cCcsIHJlc2l6ZSk7XG5cdCAgICBhZGRFdmVudChjb250cm9sLCAnYmx1cicsIHJlc2l6ZSk7XG5cdCAgICBhZGRFdmVudChjb250cm9sLCAndXBkYXRlJywgcmVzaXplKTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwiaW5wdXRfYXV0b2dyb3dcIiAoVG9tIFNlbGVjdClcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBub19iYWNrc3BhY2VfZGVsZXRlICgpIHtcblx0ICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgdmFyIG9yaWdfZGVsZXRlU2VsZWN0aW9uID0gc2VsZi5kZWxldGVTZWxlY3Rpb247XG5cdCAgdGhpcy5ob29rKCdpbnN0ZWFkJywgJ2RlbGV0ZVNlbGVjdGlvbicsIGV2dCA9PiB7XG5cdCAgICBpZiAoc2VsZi5hY3RpdmVJdGVtcy5sZW5ndGgpIHtcblx0ICAgICAgcmV0dXJuIG9yaWdfZGVsZXRlU2VsZWN0aW9uLmNhbGwoc2VsZiwgZXZ0KTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJub19hY3RpdmVfaXRlbXNcIiAoVG9tIFNlbGVjdClcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBub19hY3RpdmVfaXRlbXMgKCkge1xuXHQgIHRoaXMuaG9vaygnaW5zdGVhZCcsICdzZXRBY3RpdmVJdGVtJywgKCkgPT4ge30pO1xuXHQgIHRoaXMuaG9vaygnaW5zdGVhZCcsICdzZWxlY3RBbGwnLCAoKSA9PiB7fSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcIm9wdGdyb3VwX2NvbHVtbnNcIiAoVG9tIFNlbGVjdC5qcylcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBvcHRncm91cF9jb2x1bW5zICgpIHtcblx0ICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgdmFyIG9yaWdfa2V5ZG93biA9IHNlbGYub25LZXlEb3duO1xuXHQgIHNlbGYuaG9vaygnaW5zdGVhZCcsICdvbktleURvd24nLCBldnQgPT4ge1xuXHQgICAgdmFyIGluZGV4LCBvcHRpb24sIG9wdGlvbnMsIG9wdGdyb3VwO1xuXG5cdCAgICBpZiAoIXNlbGYuaXNPcGVuIHx8ICEoZXZ0LmtleUNvZGUgPT09IEtFWV9MRUZUIHx8IGV2dC5rZXlDb2RlID09PSBLRVlfUklHSFQpKSB7XG5cdCAgICAgIHJldHVybiBvcmlnX2tleWRvd24uY2FsbChzZWxmLCBldnQpO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLmlnbm9yZUhvdmVyID0gdHJ1ZTtcblx0ICAgIG9wdGdyb3VwID0gcGFyZW50TWF0Y2goc2VsZi5hY3RpdmVPcHRpb24sICdbZGF0YS1ncm91cF0nKTtcblx0ICAgIGluZGV4ID0gbm9kZUluZGV4KHNlbGYuYWN0aXZlT3B0aW9uLCAnW2RhdGEtc2VsZWN0YWJsZV0nKTtcblxuXHQgICAgaWYgKCFvcHRncm91cCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIGlmIChldnQua2V5Q29kZSA9PT0gS0VZX0xFRlQpIHtcblx0ICAgICAgb3B0Z3JvdXAgPSBvcHRncm91cC5wcmV2aW91c1NpYmxpbmc7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBvcHRncm91cCA9IG9wdGdyb3VwLm5leHRTaWJsaW5nO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoIW9wdGdyb3VwKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgb3B0aW9ucyA9IG9wdGdyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXNlbGVjdGFibGVdJyk7XG5cdCAgICBvcHRpb24gPSBvcHRpb25zW01hdGgubWluKG9wdGlvbnMubGVuZ3RoIC0gMSwgaW5kZXgpXTtcblxuXHQgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICBzZWxmLnNldEFjdGl2ZU9wdGlvbihvcHRpb24pO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJyZW1vdmVfYnV0dG9uXCIgKFRvbSBTZWxlY3QpXG5cdCAqIENvcHlyaWdodCAoYykgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gcmVtb3ZlX2J1dHRvbiAodXNlck9wdGlvbnMpIHtcblx0ICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cdCAgICBsYWJlbDogJyZ0aW1lczsnLFxuXHQgICAgdGl0bGU6ICdSZW1vdmUnLFxuXHQgICAgY2xhc3NOYW1lOiAncmVtb3ZlJyxcblx0ICAgIGFwcGVuZDogdHJ1ZVxuXHQgIH0sIHVzZXJPcHRpb25zKTsgLy9vcHRpb25zLmNsYXNzTmFtZSA9ICdyZW1vdmUtc2luZ2xlJztcblxuXHQgIHZhciBzZWxmID0gdGhpczsgLy8gb3ZlcnJpZGUgdGhlIHJlbmRlciBtZXRob2QgdG8gYWRkIHJlbW92ZSBidXR0b24gdG8gZWFjaCBpdGVtXG5cblx0ICBpZiAoIW9wdGlvbnMuYXBwZW5kKSB7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXG5cdCAgdmFyIGh0bWwgPSAnPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIGNsYXNzPVwiJyArIG9wdGlvbnMuY2xhc3NOYW1lICsgJ1wiIHRhYmluZGV4PVwiLTFcIiB0aXRsZT1cIicgKyBlc2NhcGVfaHRtbChvcHRpb25zLnRpdGxlKSArICdcIj4nICsgb3B0aW9ucy5sYWJlbCArICc8L2E+Jztcblx0ICBzZWxmLmhvb2soJ2FmdGVyJywgJ3NldHVwVGVtcGxhdGVzJywgKCkgPT4ge1xuXHQgICAgdmFyIG9yaWdfcmVuZGVyX2l0ZW0gPSBzZWxmLnNldHRpbmdzLnJlbmRlci5pdGVtO1xuXG5cdCAgICBzZWxmLnNldHRpbmdzLnJlbmRlci5pdGVtID0gKGRhdGEsIGVzY2FwZSkgPT4ge1xuXHQgICAgICB2YXIgaXRlbSA9IGdldERvbShvcmlnX3JlbmRlcl9pdGVtLmNhbGwoc2VsZiwgZGF0YSwgZXNjYXBlKSk7XG5cdCAgICAgIHZhciBjbG9zZV9idXR0b24gPSBnZXREb20oaHRtbCk7XG5cdCAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoY2xvc2VfYnV0dG9uKTtcblx0ICAgICAgYWRkRXZlbnQoY2xvc2VfYnV0dG9uLCAnbW91c2Vkb3duJywgZXZ0ID0+IHtcblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChldnQsIHRydWUpO1xuXHQgICAgICB9KTtcblx0ICAgICAgYWRkRXZlbnQoY2xvc2VfYnV0dG9uLCAnY2xpY2snLCBldnQgPT4ge1xuXHQgICAgICAgIC8vIHByb3BhZ2F0aW5nIHdpbGwgdHJpZ2dlciB0aGUgZHJvcGRvd24gdG8gc2hvdyBmb3Igc2luZ2xlIG1vZGVcblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChldnQsIHRydWUpO1xuXHQgICAgICAgIGlmIChzZWxmLmlzTG9ja2VkKSByZXR1cm47XG5cdCAgICAgICAgaWYgKCFzZWxmLnNob3VsZERlbGV0ZShbaXRlbV0sIGV2dCkpIHJldHVybjtcblx0ICAgICAgICBzZWxmLnJlbW92ZUl0ZW0oaXRlbSk7XG5cdCAgICAgICAgc2VsZi5yZWZyZXNoT3B0aW9ucyhmYWxzZSk7XG5cdCAgICAgICAgc2VsZi5pbnB1dFN0YXRlKCk7XG5cdCAgICAgIH0pO1xuXHQgICAgICByZXR1cm4gaXRlbTtcblx0ICAgIH07XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcInJlc3RvcmVfb25fYmFja3NwYWNlXCIgKFRvbSBTZWxlY3QpXG5cdCAqIENvcHlyaWdodCAoYykgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gcmVzdG9yZV9vbl9iYWNrc3BhY2UgKHVzZXJPcHRpb25zKSB7XG5cdCAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuXHQgICAgdGV4dDogb3B0aW9uID0+IHtcblx0ICAgICAgcmV0dXJuIG9wdGlvbltzZWxmLnNldHRpbmdzLmxhYmVsRmllbGRdO1xuXHQgICAgfVxuXHQgIH0sIHVzZXJPcHRpb25zKTtcblx0ICBzZWxmLm9uKCdpdGVtX3JlbW92ZScsIGZ1bmN0aW9uICh2YWx1ZSkge1xuXHQgICAgaWYgKCFzZWxmLmlzRm9jdXNlZCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIGlmIChzZWxmLmNvbnRyb2xfaW5wdXQudmFsdWUudHJpbSgpID09PSAnJykge1xuXHQgICAgICB2YXIgb3B0aW9uID0gc2VsZi5vcHRpb25zW3ZhbHVlXTtcblxuXHQgICAgICBpZiAob3B0aW9uKSB7XG5cdCAgICAgICAgc2VsZi5zZXRUZXh0Ym94VmFsdWUob3B0aW9ucy50ZXh0LmNhbGwoc2VsZiwgb3B0aW9uKSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwicmVzdG9yZV9vbl9iYWNrc3BhY2VcIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiB2aXJ0dWFsX3Njcm9sbCAoKSB7XG5cdCAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgY29uc3Qgb3JpZ19jYW5Mb2FkID0gc2VsZi5jYW5Mb2FkO1xuXHQgIGNvbnN0IG9yaWdfY2xlYXJBY3RpdmVPcHRpb24gPSBzZWxmLmNsZWFyQWN0aXZlT3B0aW9uO1xuXHQgIGNvbnN0IG9yaWdfbG9hZENhbGxiYWNrID0gc2VsZi5sb2FkQ2FsbGJhY2s7XG5cdCAgdmFyIHBhZ2luYXRpb24gPSB7fTtcblx0ICB2YXIgZHJvcGRvd25fY29udGVudDtcblx0ICB2YXIgbG9hZGluZ19tb3JlID0gZmFsc2U7XG5cdCAgdmFyIGxvYWRfbW9yZV9vcHQ7XG5cdCAgdmFyIGRlZmF1bHRfdmFsdWVzID0gW107XG5cblx0ICBpZiAoIXNlbGYuc2V0dGluZ3Muc2hvdWxkTG9hZE1vcmUpIHtcblx0ICAgIC8vIHJldHVybiB0cnVlIGlmIGFkZGl0aW9uYWwgcmVzdWx0cyBzaG91bGQgYmUgbG9hZGVkXG5cdCAgICBzZWxmLnNldHRpbmdzLnNob3VsZExvYWRNb3JlID0gKCkgPT4ge1xuXHQgICAgICBjb25zdCBzY3JvbGxfcGVyY2VudCA9IGRyb3Bkb3duX2NvbnRlbnQuY2xpZW50SGVpZ2h0IC8gKGRyb3Bkb3duX2NvbnRlbnQuc2Nyb2xsSGVpZ2h0IC0gZHJvcGRvd25fY29udGVudC5zY3JvbGxUb3ApO1xuXG5cdCAgICAgIGlmIChzY3JvbGxfcGVyY2VudCA+IDAuOSkge1xuXHQgICAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKHNlbGYuYWN0aXZlT3B0aW9uKSB7XG5cdCAgICAgICAgdmFyIHNlbGVjdGFibGUgPSBzZWxmLnNlbGVjdGFibGUoKTtcblx0ICAgICAgICB2YXIgaW5kZXggPSBBcnJheS5mcm9tKHNlbGVjdGFibGUpLmluZGV4T2Yoc2VsZi5hY3RpdmVPcHRpb24pO1xuXG5cdCAgICAgICAgaWYgKGluZGV4ID49IHNlbGVjdGFibGUubGVuZ3RoIC0gMikge1xuXHQgICAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfTtcblx0ICB9XG5cblx0ICBpZiAoIXNlbGYuc2V0dGluZ3MuZmlyc3RVcmwpIHtcblx0ICAgIHRocm93ICd2aXJ0dWFsX3Njcm9sbCBwbHVnaW4gcmVxdWlyZXMgYSBmaXJzdFVybCgpIG1ldGhvZCc7XG5cdCAgfSAvLyBpbiBvcmRlciBmb3IgdmlydHVhbCBzY3JvbGxpbmcgdG8gd29yayxcblx0ICAvLyBvcHRpb25zIG5lZWQgdG8gYmUgb3JkZXJlZCB0aGUgc2FtZSB3YXkgdGhleSdyZSByZXR1cm5lZCBmcm9tIHRoZSByZW1vdGUgZGF0YSBzb3VyY2VcblxuXG5cdCAgc2VsZi5zZXR0aW5ncy5zb3J0RmllbGQgPSBbe1xuXHQgICAgZmllbGQ6ICckb3JkZXInXG5cdCAgfSwge1xuXHQgICAgZmllbGQ6ICckc2NvcmUnXG5cdCAgfV07IC8vIGNhbiB3ZSBsb2FkIG1vcmUgcmVzdWx0cyBmb3IgZ2l2ZW4gcXVlcnk/XG5cblx0ICBjb25zdCBjYW5Mb2FkTW9yZSA9IHF1ZXJ5ID0+IHtcblx0ICAgIGlmICh0eXBlb2Ygc2VsZi5zZXR0aW5ncy5tYXhPcHRpb25zID09PSAnbnVtYmVyJyAmJiBkcm9wZG93bl9jb250ZW50LmNoaWxkcmVuLmxlbmd0aCA+PSBzZWxmLnNldHRpbmdzLm1heE9wdGlvbnMpIHtcblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICBpZiAocXVlcnkgaW4gcGFnaW5hdGlvbiAmJiBwYWdpbmF0aW9uW3F1ZXJ5XSkge1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH07XG5cblx0ICBjb25zdCBjbGVhckZpbHRlciA9IChvcHRpb24sIHZhbHVlKSA9PiB7XG5cdCAgICBpZiAoc2VsZi5pdGVtcy5pbmRleE9mKHZhbHVlKSA+PSAwIHx8IGRlZmF1bHRfdmFsdWVzLmluZGV4T2YodmFsdWUpID49IDApIHtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9OyAvLyBzZXQgdGhlIG5leHQgdXJsIHRoYXQgd2lsbCBiZVxuXG5cblx0ICBzZWxmLnNldE5leHRVcmwgPSAodmFsdWUsIG5leHRfdXJsKSA9PiB7XG5cdCAgICBwYWdpbmF0aW9uW3ZhbHVlXSA9IG5leHRfdXJsO1xuXHQgIH07IC8vIGdldFVybCgpIHRvIGJlIHVzZWQgaW4gc2V0dGluZ3MubG9hZCgpXG5cblxuXHQgIHNlbGYuZ2V0VXJsID0gcXVlcnkgPT4ge1xuXHQgICAgaWYgKHF1ZXJ5IGluIHBhZ2luYXRpb24pIHtcblx0ICAgICAgY29uc3QgbmV4dF91cmwgPSBwYWdpbmF0aW9uW3F1ZXJ5XTtcblx0ICAgICAgcGFnaW5hdGlvbltxdWVyeV0gPSBmYWxzZTtcblx0ICAgICAgcmV0dXJuIG5leHRfdXJsO1xuXHQgICAgfSAvLyBpZiB0aGUgdXNlciBnb2VzIGJhY2sgdG8gYSBwcmV2aW91cyBxdWVyeVxuXHQgICAgLy8gd2UgbmVlZCB0byBsb2FkIHRoZSBmaXJzdCBwYWdlIGFnYWluXG5cblxuXHQgICAgcGFnaW5hdGlvbiA9IHt9O1xuXHQgICAgcmV0dXJuIHNlbGYuc2V0dGluZ3MuZmlyc3RVcmwuY2FsbChzZWxmLCBxdWVyeSk7XG5cdCAgfTsgLy8gZG9uJ3QgY2xlYXIgdGhlIGFjdGl2ZSBvcHRpb24gKGFuZCBjYXVzZSB1bndhbnRlZCBkcm9wZG93biBzY3JvbGwpXG5cdCAgLy8gd2hpbGUgbG9hZGluZyBtb3JlIHJlc3VsdHNcblxuXG5cdCAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ2NsZWFyQWN0aXZlT3B0aW9uJywgKCkgPT4ge1xuXHQgICAgaWYgKGxvYWRpbmdfbW9yZSkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBvcmlnX2NsZWFyQWN0aXZlT3B0aW9uLmNhbGwoc2VsZik7XG5cdCAgfSk7IC8vIG92ZXJyaWRlIHRoZSBjYW5Mb2FkIG1ldGhvZFxuXG5cdCAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ2NhbkxvYWQnLCBxdWVyeSA9PiB7XG5cdCAgICAvLyBmaXJzdCB0aW1lIHRoZSBxdWVyeSBoYXMgYmVlbiBzZWVuXG5cdCAgICBpZiAoIShxdWVyeSBpbiBwYWdpbmF0aW9uKSkge1xuXHQgICAgICByZXR1cm4gb3JpZ19jYW5Mb2FkLmNhbGwoc2VsZiwgcXVlcnkpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gY2FuTG9hZE1vcmUocXVlcnkpO1xuXHQgIH0pOyAvLyB3cmFwIHRoZSBsb2FkXG5cblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnbG9hZENhbGxiYWNrJywgKG9wdGlvbnMsIG9wdGdyb3VwcykgPT4ge1xuXHQgICAgaWYgKCFsb2FkaW5nX21vcmUpIHtcblx0ICAgICAgc2VsZi5jbGVhck9wdGlvbnMoY2xlYXJGaWx0ZXIpO1xuXHQgICAgfSBlbHNlIGlmIChsb2FkX21vcmVfb3B0KSB7XG5cdCAgICAgIGNvbnN0IGZpcnN0X29wdGlvbiA9IG9wdGlvbnNbMF07XG5cblx0ICAgICAgaWYgKGZpcnN0X29wdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgbG9hZF9tb3JlX29wdC5kYXRhc2V0LnZhbHVlID0gZmlyc3Rfb3B0aW9uW3NlbGYuc2V0dGluZ3MudmFsdWVGaWVsZF07XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgb3JpZ19sb2FkQ2FsbGJhY2suY2FsbChzZWxmLCBvcHRpb25zLCBvcHRncm91cHMpO1xuXHQgICAgbG9hZGluZ19tb3JlID0gZmFsc2U7XG5cdCAgfSk7IC8vIGFkZCB0ZW1wbGF0ZXMgdG8gZHJvcGRvd25cblx0ICAvL1x0bG9hZGluZ19tb3JlIGlmIHdlIGhhdmUgYW5vdGhlciB1cmwgaW4gdGhlIHF1ZXVlXG5cdCAgLy9cdG5vX21vcmVfcmVzdWx0cyBpZiB3ZSBkb24ndCBoYXZlIGFub3RoZXIgdXJsIGluIHRoZSBxdWV1ZVxuXG5cdCAgc2VsZi5ob29rKCdhZnRlcicsICdyZWZyZXNoT3B0aW9ucycsICgpID0+IHtcblx0ICAgIGNvbnN0IHF1ZXJ5ID0gc2VsZi5sYXN0VmFsdWU7XG5cdCAgICB2YXIgb3B0aW9uO1xuXG5cdCAgICBpZiAoY2FuTG9hZE1vcmUocXVlcnkpKSB7XG5cdCAgICAgIG9wdGlvbiA9IHNlbGYucmVuZGVyKCdsb2FkaW5nX21vcmUnLCB7XG5cdCAgICAgICAgcXVlcnk6IHF1ZXJ5XG5cdCAgICAgIH0pO1xuXG5cdCAgICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgICBvcHRpb24uc2V0QXR0cmlidXRlKCdkYXRhLXNlbGVjdGFibGUnLCAnJyk7IC8vIHNvIHRoYXQgbmF2aWdhdGluZyBkcm9wZG93biB3aXRoIFtkb3duXSBrZXlwcmVzc2VzIGNhbiBuYXZpZ2F0ZSB0byB0aGlzIG5vZGVcblxuXHQgICAgICAgIGxvYWRfbW9yZV9vcHQgPSBvcHRpb247XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSBpZiAocXVlcnkgaW4gcGFnaW5hdGlvbiAmJiAhZHJvcGRvd25fY29udGVudC5xdWVyeVNlbGVjdG9yKCcubm8tcmVzdWx0cycpKSB7XG5cdCAgICAgIG9wdGlvbiA9IHNlbGYucmVuZGVyKCdub19tb3JlX3Jlc3VsdHMnLCB7XG5cdCAgICAgICAgcXVlcnk6IHF1ZXJ5XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICBpZiAob3B0aW9uKSB7XG5cdCAgICAgIGFkZENsYXNzZXMob3B0aW9uLCBzZWxmLnNldHRpbmdzLm9wdGlvbkNsYXNzKTtcblx0ICAgICAgZHJvcGRvd25fY29udGVudC5hcHBlbmQob3B0aW9uKTtcblx0ICAgIH1cblx0ICB9KTsgLy8gYWRkIHNjcm9sbCBsaXN0ZW5lciBhbmQgZGVmYXVsdCB0ZW1wbGF0ZXNcblxuXHQgIHNlbGYub24oJ2luaXRpYWxpemUnLCAoKSA9PiB7XG5cdCAgICBkZWZhdWx0X3ZhbHVlcyA9IE9iamVjdC5rZXlzKHNlbGYub3B0aW9ucyk7XG5cdCAgICBkcm9wZG93bl9jb250ZW50ID0gc2VsZi5kcm9wZG93bl9jb250ZW50OyAvLyBkZWZhdWx0IHRlbXBsYXRlc1xuXG5cdCAgICBzZWxmLnNldHRpbmdzLnJlbmRlciA9IE9iamVjdC5hc3NpZ24oe30sIHtcblx0ICAgICAgbG9hZGluZ19tb3JlOiAoKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibG9hZGluZy1tb3JlLXJlc3VsdHNcIj5Mb2FkaW5nIG1vcmUgcmVzdWx0cyAuLi4gPC9kaXY+YDtcblx0ICAgICAgfSxcblx0ICAgICAgbm9fbW9yZV9yZXN1bHRzOiAoKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibm8tbW9yZS1yZXN1bHRzXCI+Tm8gbW9yZSByZXN1bHRzPC9kaXY+YDtcblx0ICAgICAgfVxuXHQgICAgfSwgc2VsZi5zZXR0aW5ncy5yZW5kZXIpOyAvLyB3YXRjaCBkcm9wZG93biBjb250ZW50IHNjcm9sbCBwb3NpdGlvblxuXG5cdCAgICBkcm9wZG93bl9jb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcblx0ICAgICAgaWYgKCFzZWxmLnNldHRpbmdzLnNob3VsZExvYWRNb3JlLmNhbGwoc2VsZikpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH0gLy8gIWltcG9ydGFudDogdGhpcyB3aWxsIGdldCBjaGVja2VkIGFnYWluIGluIGxvYWQoKSBidXQgd2Ugc3RpbGwgbmVlZCB0byBjaGVjayBoZXJlIG90aGVyd2lzZSBsb2FkaW5nX21vcmUgd2lsbCBiZSBzZXQgdG8gdHJ1ZVxuXG5cblx0ICAgICAgaWYgKCFjYW5Mb2FkTW9yZShzZWxmLmxhc3RWYWx1ZSkpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH0gLy8gZG9uJ3QgY2FsbCBsb2FkKCkgdG9vIG11Y2hcblxuXG5cdCAgICAgIGlmIChsb2FkaW5nX21vcmUpIHJldHVybjtcblx0ICAgICAgbG9hZGluZ19tb3JlID0gdHJ1ZTtcblx0ICAgICAgc2VsZi5sb2FkLmNhbGwoc2VsZiwgc2VsZi5sYXN0VmFsdWUpO1xuXHQgICAgfSk7XG5cdCAgfSk7XG5cdH1cblxuXHRUb21TZWxlY3QuZGVmaW5lKCdjaGFuZ2VfbGlzdGVuZXInLCBjaGFuZ2VfbGlzdGVuZXIpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdjaGVja2JveF9vcHRpb25zJywgY2hlY2tib3hfb3B0aW9ucyk7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ2NsZWFyX2J1dHRvbicsIGNsZWFyX2J1dHRvbik7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ2RyYWdfZHJvcCcsIGRyYWdfZHJvcCk7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ2Ryb3Bkb3duX2hlYWRlcicsIGRyb3Bkb3duX2hlYWRlcik7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ2NhcmV0X3Bvc2l0aW9uJywgY2FyZXRfcG9zaXRpb24pO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdkcm9wZG93bl9pbnB1dCcsIGRyb3Bkb3duX2lucHV0KTtcblx0VG9tU2VsZWN0LmRlZmluZSgnaW5wdXRfYXV0b2dyb3cnLCBpbnB1dF9hdXRvZ3Jvdyk7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ25vX2JhY2tzcGFjZV9kZWxldGUnLCBub19iYWNrc3BhY2VfZGVsZXRlKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnbm9fYWN0aXZlX2l0ZW1zJywgbm9fYWN0aXZlX2l0ZW1zKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnb3B0Z3JvdXBfY29sdW1ucycsIG9wdGdyb3VwX2NvbHVtbnMpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdyZW1vdmVfYnV0dG9uJywgcmVtb3ZlX2J1dHRvbik7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ3Jlc3RvcmVfb25fYmFja3NwYWNlJywgcmVzdG9yZV9vbl9iYWNrc3BhY2UpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCd2aXJ0dWFsX3Njcm9sbCcsIHZpcnR1YWxfc2Nyb2xsKTtcblxuXHRyZXR1cm4gVG9tU2VsZWN0O1xuXG59KSk7XG52YXIgdG9tU2VsZWN0PWZ1bmN0aW9uKGVsLG9wdHMpe3JldHVybiBuZXcgVG9tU2VsZWN0KGVsLG9wdHMpO30gXG4vLyMgc291cmNlTWFwcGluZ1VSTD10b20tc2VsZWN0LmNvbXBsZXRlLmpzLm1hcFxuIiwiaW1wb3J0IFRvbVNlbGVjdCBmcm9tIFwidG9tLXNlbGVjdFwiXHJcbmltcG9ydCB7IFRvbUlucHV0IH0gZnJvbSBcInRvbS1zZWxlY3QvZGlzdC90eXBlcy90eXBlc1wiO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgIC8vLnRvbS1zZWxlY3TjgYzjgYLjgozjgbBUb21TZWxlY3TopoHntKAo44Kz44Oz44Oc44Oc44OD44Kv44K5KeOBq+e9ruOBjeaPm+OBiOOCi1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvbS1zZWxlY3QnKS5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgIG5ldyBUb21TZWxlY3QoZWwgYXMgVG9tSW5wdXQsIHt9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8v6KGM5YmK6Zmk44KS44GZ44KLXHJcbiAgICBsZXQgYnV0dG9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlbGV0ZVJvdycpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidXR0b25zPy5sZW5ndGggPz8gMDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGJ1dHRvbnNbaV07XHJcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBidXR0b25FbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgICB2YXIgcm93RWxlbWVudCA9IGJ1dHRvbkVsZW1lbnQuY2xvc2VzdChcInRyXCIpO1xyXG4gICAgICAgICAgICByb3dFbGVtZW50Py5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIGNvbW1vbiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlcGxhY2VUb21TZWxlY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIC50b20tc2VsZWN044Gu6KaB57Sg44KSVG9tU2VsZWN06KaB57SgKOOCs+ODs+ODnOODnOODg+OCr+OCuSnjgavnva7jgY3mj5vjgYjjgotcclxuICAgICAqICovXHJcbiAgICByZXBsYWNlVG9tU2VsZWN0KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vLnRvbS1zZWxlY3TjgYzjgYLjgozjgbBUb21TZWxlY3TopoHntKAo44Kz44Oz44Oc44Oc44OD44Kv44K5KeOBq+e9ruOBjeaPm+OBiOOCi1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9tLXNlbGVjdCcpLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXcgVG9tU2VsZWN0KGVsIGFzIFRvbUlucHV0LCB7fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbn07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNvbW1vbiB9IGZyb20gJy4uL2NvbW1vbi9kaXNwX2NvbW1vbic7XHJcblxyXG5uZXcgY29tbW9uKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9