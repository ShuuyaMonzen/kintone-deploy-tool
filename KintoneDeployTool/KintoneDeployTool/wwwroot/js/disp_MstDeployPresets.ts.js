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
    //.tom-selectがあればTomSelect要素(コンボボックス)に置き換える
    document.querySelectorAll('.tom-select').forEach(function (el) {
        new (tom_select__WEBPACK_IMPORTED_MODULE_0___default())(el, {});
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFZO0FBQ1o7QUFDQSxRQUFRO0FBQ1IsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLFFBQVE7QUFDUjs7QUFFQTs7QUFFQSw4Q0FBOEM7O0FBRTlDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQzs7QUFFbkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCOztBQUUvQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDs7QUFFdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0EsK0RBQStEO0FBQy9ELHNEQUFzRDtBQUN0RCxnREFBZ0Q7QUFDaEQscURBQXFEO0FBQ3JELDREQUE0RDtBQUM1RCxxREFBcUQ7QUFDckQsZ0RBQWdEO0FBQ2hELDJEQUEyRDtBQUMzRCxxREFBcUQ7QUFDckQsZ0RBQWdEO0FBQ2hELHdEQUF3RDtBQUN4RCxrREFBa0Q7QUFDbEQsZ0RBQWdEO0FBQ2hELHdEQUF3RDtBQUN4RCx3REFBd0Q7QUFDeEQsbURBQW1EO0FBQ25ELHNEQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5Q0FBeUMsc0JBQXNCLHNCQUFzQix3QkFBd0I7QUFDN0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7O0FBRXhCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsTUFBTTs7O0FBR047QUFDQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLGVBQWU7O0FBRWpEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSwwQkFBMEI7QUFDMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDZCQUE2Qjs7QUFFN0I7QUFDQSx3REFBd0Q7O0FBRXhEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2QztBQUNBO0FBQ0EsTUFBTSxHQUFHOztBQUVUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVFQUF1RTs7QUFFdkU7QUFDQSxzREFBc0Q7O0FBRXREO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLHdDQUF3QztBQUN4QyxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSLE9BQU87OztBQUdQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTSxHQUFHOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0sR0FBRzs7QUFFVCw4REFBOEQ7O0FBRTlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsZ0NBQWdDO0FBQ2hDLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztB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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7O0FBRS9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDs7QUFFbEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPOzs7QUFHUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QixVQUFVO0FBQ2pDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsT0FBTztBQUNQLGdDQUFnQztBQUNoQyxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUCxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDs7QUFFdkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsc0RBQXNELE9BQU87QUFDN0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7OztBQUdYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSwrQ0FBK0M7O0FBRS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLHFDQUFxQzs7QUFFckM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQSxRQUFROztBQUVSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUTs7O0FBR1I7QUFDQSxnQ0FBZ0M7QUFDaEMsT0FBTztBQUNQLG9DQUFvQztBQUNwQyxPQUFPO0FBQ1A7QUFDQSxPQUFPOzs7QUFHUDs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0Esd0JBQXdCO0FBQ3hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRTs7QUFFakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7O0FBRUE7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQSxxQkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3RUFBd0Usa0JBQWtCO0FBQzFGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7O0FBR0E7QUFDQTtBQUNBLFdBQVc7OztBQUdYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87OztBQUdQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLFNBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFFBQVE7O0FBRVI7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLEdBQUc7O0FBRVg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxHQUFHOztBQUViO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QUEyQztJQUMzQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRTtRQUNoRCxJQUFJLG1EQUFTLENBQUMsRUFBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUM7QUFFSDtJQUNJO1FBQ0ksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVEOztTQUVLO0lBQ0wsaUNBQWdCLEdBQWhCO1FBQ0ksUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO1lBQzFDLDJDQUEyQztZQUMzQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRTtnQkFDaEQsSUFBSSxtREFBUyxDQUFDLEVBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdMLGFBQUM7QUFBRCxDQUFDOztBQUFBLENBQUM7Ozs7Ozs7VUM1QkY7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOK0M7QUFFL0MsSUFBSSx1REFBTSxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL3RvbS1zZWxlY3QvZGlzdC9qcy90b20tc2VsZWN0LmNvbXBsZXRlLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9TY3JpcHRzL2NvbW1vbi9kaXNwX2NvbW1vbi50cyIsIndlYnBhY2s6Ly9hc3AubmV0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FzcC5uZXQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYXNwLm5ldC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FzcC5uZXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vU2NyaXB0cy9lbnRyaWVzL2Rpc3BfTXN0RGVwbG95UHJlc2V0cy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiogVG9tIFNlbGVjdCB2Mi4yLjJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbCA9IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFRoaXMgOiBnbG9iYWwgfHwgc2VsZiwgZ2xvYmFsLlRvbVNlbGVjdCA9IGZhY3RvcnkoKSk7XG59KSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cblx0LyoqXG5cdCAqIE1pY3JvRXZlbnQgLSB0byBtYWtlIGFueSBqcyBvYmplY3QgYW4gZXZlbnQgZW1pdHRlclxuXHQgKlxuXHQgKiAtIHB1cmUgamF2YXNjcmlwdCAtIHNlcnZlciBjb21wYXRpYmxlLCBicm93c2VyIGNvbXBhdGlibGVcblx0ICogLSBkb250IHJlbHkgb24gdGhlIGJyb3dzZXIgZG9tc1xuXHQgKiAtIHN1cGVyIHNpbXBsZSAtIHlvdSBnZXQgaXQgaW1tZWRpYXRseSwgbm8gbWlzdGVyeSwgbm8gbWFnaWMgaW52b2x2ZWRcblx0ICpcblx0ICogQGF1dGhvciBKZXJvbWUgRXRpZW5uZSAoaHR0cHM6Ly9naXRodWIuY29tL2plcm9tZWV0aWVubmUpXG5cdCAqL1xuXG5cdC8qKlxuXHQgKiBFeGVjdXRlIGNhbGxiYWNrIGZvciBlYWNoIGV2ZW50IGluIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGV2ZW50IG5hbWVzXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBmb3JFdmVudHMoZXZlbnRzLCBjYWxsYmFjaykge1xuXHQgIGV2ZW50cy5zcGxpdCgvXFxzKy8pLmZvckVhY2goZXZlbnQgPT4ge1xuXHQgICAgY2FsbGJhY2soZXZlbnQpO1xuXHQgIH0pO1xuXHR9XG5cblx0Y2xhc3MgTWljcm9FdmVudCB7XG5cdCAgY29uc3RydWN0b3IoKSB7XG5cdCAgICB0aGlzLl9ldmVudHMgPSB2b2lkIDA7XG5cdCAgICB0aGlzLl9ldmVudHMgPSB7fTtcblx0ICB9XG5cblx0ICBvbihldmVudHMsIGZjdCkge1xuXHQgICAgZm9yRXZlbnRzKGV2ZW50cywgZXZlbnQgPT4ge1xuXHQgICAgICBjb25zdCBldmVudF9hcnJheSA9IHRoaXMuX2V2ZW50c1tldmVudF0gfHwgW107XG5cdCAgICAgIGV2ZW50X2FycmF5LnB1c2goZmN0KTtcblx0ICAgICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IGV2ZW50X2FycmF5O1xuXHQgICAgfSk7XG5cdCAgfVxuXG5cdCAgb2ZmKGV2ZW50cywgZmN0KSB7XG5cdCAgICB2YXIgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cblx0ICAgIGlmIChuID09PSAwKSB7XG5cdCAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIGZvckV2ZW50cyhldmVudHMsIGV2ZW50ID0+IHtcblx0ICAgICAgaWYgKG4gPT09IDEpIHtcblx0ICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50XTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblxuXHQgICAgICBjb25zdCBldmVudF9hcnJheSA9IHRoaXMuX2V2ZW50c1tldmVudF07XG5cdCAgICAgIGlmIChldmVudF9hcnJheSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cdCAgICAgIGV2ZW50X2FycmF5LnNwbGljZShldmVudF9hcnJheS5pbmRleE9mKGZjdCksIDEpO1xuXHQgICAgICB0aGlzLl9ldmVudHNbZXZlbnRdID0gZXZlbnRfYXJyYXk7XG5cdCAgICB9KTtcblx0ICB9XG5cblx0ICB0cmlnZ2VyKGV2ZW50cywgLi4uYXJncykge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgZm9yRXZlbnRzKGV2ZW50cywgZXZlbnQgPT4ge1xuXHQgICAgICBjb25zdCBldmVudF9hcnJheSA9IHNlbGYuX2V2ZW50c1tldmVudF07XG5cdCAgICAgIGlmIChldmVudF9hcnJheSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cdCAgICAgIGV2ZW50X2FycmF5LmZvckVhY2goZmN0ID0+IHtcblx0ICAgICAgICBmY3QuYXBwbHkoc2VsZiwgYXJncyk7XG5cdCAgICAgIH0pO1xuXHQgICAgfSk7XG5cdCAgfVxuXG5cdH1cblxuXHQvKipcblx0ICogbWljcm9wbHVnaW4uanNcblx0ICogQ29weXJpZ2h0IChjKSAyMDEzIEJyaWFuIFJlYXZpcyAmIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICogQGF1dGhvciBCcmlhbiBSZWF2aXMgPGJyaWFuQHRoaXJkcm91dGUuY29tPlxuXHQgKi9cblx0ZnVuY3Rpb24gTWljcm9QbHVnaW4oSW50ZXJmYWNlKSB7XG5cdCAgSW50ZXJmYWNlLnBsdWdpbnMgPSB7fTtcblx0ICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBJbnRlcmZhY2Uge1xuXHQgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuXHQgICAgICBzdXBlciguLi5hcmdzKTtcblx0ICAgICAgdGhpcy5wbHVnaW5zID0ge1xuXHQgICAgICAgIG5hbWVzOiBbXSxcblx0ICAgICAgICBzZXR0aW5nczoge30sXG5cdCAgICAgICAgcmVxdWVzdGVkOiB7fSxcblx0ICAgICAgICBsb2FkZWQ6IHt9XG5cdCAgICAgIH07XG5cdCAgICB9XG5cblx0ICAgIC8qKlxuXHQgICAgICogUmVnaXN0ZXJzIGEgcGx1Z2luLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXG5cdCAgICAgKi9cblx0ICAgIHN0YXRpYyBkZWZpbmUobmFtZSwgZm4pIHtcblx0ICAgICAgSW50ZXJmYWNlLnBsdWdpbnNbbmFtZV0gPSB7XG5cdCAgICAgICAgJ25hbWUnOiBuYW1lLFxuXHQgICAgICAgICdmbic6IGZuXG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIEluaXRpYWxpemVzIHRoZSBsaXN0ZWQgcGx1Z2lucyAod2l0aCBvcHRpb25zKS5cblx0ICAgICAqIEFjY2VwdGFibGUgZm9ybWF0czpcblx0ICAgICAqXG5cdCAgICAgKiBMaXN0ICh3aXRob3V0IG9wdGlvbnMpOlxuXHQgICAgICogICBbJ2EnLCAnYicsICdjJ11cblx0ICAgICAqXG5cdCAgICAgKiBMaXN0ICh3aXRoIG9wdGlvbnMpOlxuXHQgICAgICogICBbeyduYW1lJzogJ2EnLCBvcHRpb25zOiB7fX0sIHsnbmFtZSc6ICdiJywgb3B0aW9uczoge319XVxuXHQgICAgICpcblx0ICAgICAqIEhhc2ggKHdpdGggb3B0aW9ucyk6XG5cdCAgICAgKiAgIHsnYSc6IHsgLi4uIH0sICdiJzogeyAuLi4gfSwgJ2MnOiB7IC4uLiB9fVxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSB7YXJyYXl8b2JqZWN0fSBwbHVnaW5zXG5cdCAgICAgKi9cblxuXG5cdCAgICBpbml0aWFsaXplUGx1Z2lucyhwbHVnaW5zKSB7XG5cdCAgICAgIHZhciBrZXksIG5hbWU7XG5cdCAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgICBjb25zdCBxdWV1ZSA9IFtdO1xuXG5cdCAgICAgIGlmIChBcnJheS5pc0FycmF5KHBsdWdpbnMpKSB7XG5cdCAgICAgICAgcGx1Z2lucy5mb3JFYWNoKHBsdWdpbiA9PiB7XG5cdCAgICAgICAgICBpZiAodHlwZW9mIHBsdWdpbiA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgICAgICAgcXVldWUucHVzaChwbHVnaW4pO1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgc2VsZi5wbHVnaW5zLnNldHRpbmdzW3BsdWdpbi5uYW1lXSA9IHBsdWdpbi5vcHRpb25zO1xuXHQgICAgICAgICAgICBxdWV1ZS5wdXNoKHBsdWdpbi5uYW1lKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgfSBlbHNlIGlmIChwbHVnaW5zKSB7XG5cdCAgICAgICAgZm9yIChrZXkgaW4gcGx1Z2lucykge1xuXHQgICAgICAgICAgaWYgKHBsdWdpbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHQgICAgICAgICAgICBzZWxmLnBsdWdpbnMuc2V0dGluZ3Nba2V5XSA9IHBsdWdpbnNba2V5XTtcblx0ICAgICAgICAgICAgcXVldWUucHVzaChrZXkpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIHdoaWxlIChuYW1lID0gcXVldWUuc2hpZnQoKSkge1xuXHQgICAgICAgIHNlbGYucmVxdWlyZShuYW1lKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBsb2FkUGx1Z2luKG5hbWUpIHtcblx0ICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgICB2YXIgcGx1Z2lucyA9IHNlbGYucGx1Z2lucztcblx0ICAgICAgdmFyIHBsdWdpbiA9IEludGVyZmFjZS5wbHVnaW5zW25hbWVdO1xuXG5cdCAgICAgIGlmICghSW50ZXJmYWNlLnBsdWdpbnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIFwiJyArIG5hbWUgKyAnXCIgcGx1Z2luJyk7XG5cdCAgICAgIH1cblxuXHQgICAgICBwbHVnaW5zLnJlcXVlc3RlZFtuYW1lXSA9IHRydWU7XG5cdCAgICAgIHBsdWdpbnMubG9hZGVkW25hbWVdID0gcGx1Z2luLmZuLmFwcGx5KHNlbGYsIFtzZWxmLnBsdWdpbnMuc2V0dGluZ3NbbmFtZV0gfHwge31dKTtcblx0ICAgICAgcGx1Z2lucy5uYW1lcy5wdXNoKG5hbWUpO1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBJbml0aWFsaXplcyBhIHBsdWdpbi5cblx0ICAgICAqXG5cdCAgICAgKi9cblxuXG5cdCAgICByZXF1aXJlKG5hbWUpIHtcblx0ICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgICB2YXIgcGx1Z2lucyA9IHNlbGYucGx1Z2lucztcblxuXHQgICAgICBpZiAoIXNlbGYucGx1Z2lucy5sb2FkZWQuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcblx0ICAgICAgICBpZiAocGx1Z2lucy5yZXF1ZXN0ZWRbbmFtZV0pIHtcblx0ICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGx1Z2luIGhhcyBjaXJjdWxhciBkZXBlbmRlbmN5IChcIicgKyBuYW1lICsgJ1wiKScpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHNlbGYubG9hZFBsdWdpbihuYW1lKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBwbHVnaW5zLmxvYWRlZFtuYW1lXTtcblx0ICAgIH1cblxuXHQgIH07XG5cdH1cblxuXHQvKiEgQG9yY2hpZGpzL3VuaWNvZGUtdmFyaWFudHMgfCBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvdW5pY29kZS12YXJpYW50cyB8IEFwYWNoZSBMaWNlbnNlICh2MikgKi9cblx0LyoqXG5cdCAqIENvbnZlcnQgYXJyYXkgb2Ygc3RyaW5ncyB0byBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuXHQgKlx0ZXggWydhYicsJ2EnXSA9PiAoPzphYnxhKVxuXHQgKiBcdGV4IFsnYScsJ2InXSA9PiBbYWJdXG5cdCAqIEBwYXJhbSB7c3RyaW5nW119IGNoYXJzXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cdGNvbnN0IGFycmF5VG9QYXR0ZXJuID0gY2hhcnMgPT4ge1xuXHQgIGNoYXJzID0gY2hhcnMuZmlsdGVyKEJvb2xlYW4pO1xuXG5cdCAgaWYgKGNoYXJzLmxlbmd0aCA8IDIpIHtcblx0ICAgIHJldHVybiBjaGFyc1swXSB8fCAnJztcblx0ICB9XG5cblx0ICByZXR1cm4gbWF4VmFsdWVMZW5ndGgoY2hhcnMpID09IDEgPyAnWycgKyBjaGFycy5qb2luKCcnKSArICddJyA6ICcoPzonICsgY2hhcnMuam9pbignfCcpICsgJyknO1xuXHR9O1xuXHQvKipcblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblxuXHRjb25zdCBzZXF1ZW5jZVBhdHRlcm4gPSBhcnJheSA9PiB7XG5cdCAgaWYgKCFoYXNEdXBsaWNhdGVzKGFycmF5KSkge1xuXHQgICAgcmV0dXJuIGFycmF5LmpvaW4oJycpO1xuXHQgIH1cblxuXHQgIGxldCBwYXR0ZXJuID0gJyc7XG5cdCAgbGV0IHByZXZfY2hhcl9jb3VudCA9IDA7XG5cblx0ICBjb25zdCBwcmV2X3BhdHRlcm4gPSAoKSA9PiB7XG5cdCAgICBpZiAocHJldl9jaGFyX2NvdW50ID4gMSkge1xuXHQgICAgICBwYXR0ZXJuICs9ICd7JyArIHByZXZfY2hhcl9jb3VudCArICd9Jztcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgYXJyYXkuZm9yRWFjaCgoY2hhciwgaSkgPT4ge1xuXHQgICAgaWYgKGNoYXIgPT09IGFycmF5W2kgLSAxXSkge1xuXHQgICAgICBwcmV2X2NoYXJfY291bnQrKztcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBwcmV2X3BhdHRlcm4oKTtcblx0ICAgIHBhdHRlcm4gKz0gY2hhcjtcblx0ICAgIHByZXZfY2hhcl9jb3VudCA9IDE7XG5cdCAgfSk7XG5cdCAgcHJldl9wYXR0ZXJuKCk7XG5cdCAgcmV0dXJuIHBhdHRlcm47XG5cdH07XG5cdC8qKlxuXHQgKiBDb252ZXJ0IGFycmF5IG9mIHN0cmluZ3MgdG8gYSByZWd1bGFyIGV4cHJlc3Npb25cblx0ICpcdGV4IFsnYWInLCdhJ10gPT4gKD86YWJ8YSlcblx0ICogXHRleCBbJ2EnLCdiJ10gPT4gW2FiXVxuXHQgKiBAcGFyYW0ge1NldDxzdHJpbmc+fSBjaGFyc1xuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXG5cdGNvbnN0IHNldFRvUGF0dGVybiA9IGNoYXJzID0+IHtcblx0ICBsZXQgYXJyYXkgPSB0b0FycmF5KGNoYXJzKTtcblx0ICByZXR1cm4gYXJyYXlUb1BhdHRlcm4oYXJyYXkpO1xuXHR9O1xuXHQvKipcblx0ICpcblx0ICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzM3NjU5OC9pbi1qYXZhc2NyaXB0LWhvdy1kby1pLWNoZWNrLWlmLWFuLWFycmF5LWhhcy1kdXBsaWNhdGUtdmFsdWVzXG5cdCAqIEBwYXJhbSB7YW55W119IGFycmF5XG5cdCAqL1xuXG5cdGNvbnN0IGhhc0R1cGxpY2F0ZXMgPSBhcnJheSA9PiB7XG5cdCAgcmV0dXJuIG5ldyBTZXQoYXJyYXkpLnNpemUgIT09IGFycmF5Lmxlbmd0aDtcblx0fTtcblx0LyoqXG5cdCAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYzMDA2NjAxL3doeS1kb2VzLXUtdGhyb3ctYW4taW52YWxpZC1lc2NhcGUtZXJyb3Jcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXG5cdGNvbnN0IGVzY2FwZV9yZWdleCA9IHN0ciA9PiB7XG5cdCAgcmV0dXJuIChzdHIgKyAnJykucmVwbGFjZSgvKFtcXCRcXChcXClcXCpcXCtcXC5cXD9cXFtcXF1cXF5cXHtcXHxcXH1cXFxcXSkvZ3UsICdcXFxcJDEnKTtcblx0fTtcblx0LyoqXG5cdCAqIFJldHVybiB0aGUgbWF4IGxlbmd0aCBvZiBhcnJheSB2YWx1ZXNcblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gYXJyYXlcblx0ICpcblx0ICovXG5cblx0Y29uc3QgbWF4VmFsdWVMZW5ndGggPSBhcnJheSA9PiB7XG5cdCAgcmV0dXJuIGFycmF5LnJlZHVjZSgobG9uZ2VzdCwgdmFsdWUpID0+IE1hdGgubWF4KGxvbmdlc3QsIHVuaWNvZGVMZW5ndGgodmFsdWUpKSwgMCk7XG5cdH07XG5cdC8qKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG5cdCAqL1xuXG5cdGNvbnN0IHVuaWNvZGVMZW5ndGggPSBzdHIgPT4ge1xuXHQgIHJldHVybiB0b0FycmF5KHN0cikubGVuZ3RoO1xuXHR9O1xuXHQvKipcblx0ICogQHBhcmFtIHthbnl9IHBcblx0ICogQHJldHVybiB7YW55W119XG5cdCAqL1xuXG5cdGNvbnN0IHRvQXJyYXkgPSBwID0+IEFycmF5LmZyb20ocCk7XG5cblx0LyohIEBvcmNoaWRqcy91bmljb2RlLXZhcmlhbnRzIHwgaHR0cHM6Ly9naXRodWIuY29tL29yY2hpZGpzL3VuaWNvZGUtdmFyaWFudHMgfCBBcGFjaGUgTGljZW5zZSAodjIpICovXG5cdC8qKlxuXHQgKiBHZXQgYWxsIHBvc3NpYmxlIGNvbWJpbmF0aW9ucyBvZiBzdWJzdHJpbmdzIHRoYXQgYWRkIHVwIHRvIHRoZSBnaXZlbiBzdHJpbmdcblx0ICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzAxNjk1ODcvZmluZC1hbGwtdGhlLWNvbWJpbmF0aW9uLW9mLXN1YnN0cmluZ3MtdGhhdC1hZGQtdXAtdG8tdGhlLWdpdmVuLXN0cmluZ1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gaW5wdXRcblx0ICogQHJldHVybiB7c3RyaW5nW11bXX1cblx0ICovXG5cdGNvbnN0IGFsbFN1YnN0cmluZ3MgPSBpbnB1dCA9PiB7XG5cdCAgaWYgKGlucHV0Lmxlbmd0aCA9PT0gMSkgcmV0dXJuIFtbaW5wdXRdXTtcblx0ICAvKiogQHR5cGUge3N0cmluZ1tdW119ICovXG5cblx0ICBsZXQgcmVzdWx0ID0gW107XG5cdCAgY29uc3Qgc3RhcnQgPSBpbnB1dC5zdWJzdHJpbmcoMSk7XG5cdCAgY29uc3Qgc3ViYSA9IGFsbFN1YnN0cmluZ3Moc3RhcnQpO1xuXHQgIHN1YmEuZm9yRWFjaChmdW5jdGlvbiAoc3VicmVzdWx0KSB7XG5cdCAgICBsZXQgdG1wID0gc3VicmVzdWx0LnNsaWNlKDApO1xuXHQgICAgdG1wWzBdID0gaW5wdXQuY2hhckF0KDApICsgdG1wWzBdO1xuXHQgICAgcmVzdWx0LnB1c2godG1wKTtcblx0ICAgIHRtcCA9IHN1YnJlc3VsdC5zbGljZSgwKTtcblx0ICAgIHRtcC51bnNoaWZ0KGlucHV0LmNoYXJBdCgwKSk7XG5cdCAgICByZXN1bHQucHVzaCh0bXApO1xuXHQgIH0pO1xuXHQgIHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0LyohIEBvcmNoaWRqcy91bmljb2RlLXZhcmlhbnRzIHwgaHR0cHM6Ly9naXRodWIuY29tL29yY2hpZGpzL3VuaWNvZGUtdmFyaWFudHMgfCBBcGFjaGUgTGljZW5zZSAodjIpICovXG5cblx0LyoqXG5cdCAqIEB0eXBlZGVmIHt7W2tleTpzdHJpbmddOnN0cmluZ319IFRVbmljb2RlTWFwXG5cdCAqIEB0eXBlZGVmIHt7W2tleTpzdHJpbmddOlNldDxzdHJpbmc+fX0gVFVuaWNvZGVTZXRzXG5cdCAqIEB0eXBlZGVmIHtbW251bWJlcixudW1iZXJdXX0gVENvZGVQb2ludHNcblx0ICogQHR5cGVkZWYge3tmb2xkZWQ6c3RyaW5nLGNvbXBvc2VkOnN0cmluZyxjb2RlX3BvaW50Om51bWJlcn19IFRDb2RlUG9pbnRPYmpcblx0ICogQHR5cGVkZWYge3tzdGFydDpudW1iZXIsZW5kOm51bWJlcixsZW5ndGg6bnVtYmVyLHN1YnN0cjpzdHJpbmd9fSBUU2VxdWVuY2VQYXJ0XG5cdCAqL1xuXHQvKiogQHR5cGUge1RDb2RlUG9pbnRzfSAqL1xuXG5cdGNvbnN0IGNvZGVfcG9pbnRzID0gW1swLCA2NTUzNV1dO1xuXHRjb25zdCBhY2NlbnRfcGF0ID0gJ1tcXHUwMzAwLVxcdTAzNkZcXHV7Yjd9XFx1ezJiZX1cXHV7MmJjfV0nO1xuXHQvKiogQHR5cGUge1RVbmljb2RlTWFwfSAqL1xuXG5cdGxldCB1bmljb2RlX21hcDtcblx0LyoqIEB0eXBlIHtSZWdFeHB9ICovXG5cblx0bGV0IG11bHRpX2NoYXJfcmVnO1xuXHRjb25zdCBtYXhfY2hhcl9sZW5ndGggPSAzO1xuXHQvKiogQHR5cGUge1RVbmljb2RlTWFwfSAqL1xuXG5cdGNvbnN0IGxhdGluX2NvbnZlcnQgPSB7fTtcblx0LyoqIEB0eXBlIHtUVW5pY29kZU1hcH0gKi9cblxuXHRjb25zdCBsYXRpbl9jb25kZW5zZWQgPSB7XG5cdCAgJy8nOiAn4oGE4oiVJyxcblx0ICAnMCc6ICffgCcsXG5cdCAgXCJhXCI6IFwi4rGlyZDJkVwiLFxuXHQgIFwiYWFcIjogXCLqnLNcIixcblx0ICBcImFlXCI6IFwiw6bHvcejXCIsXG5cdCAgXCJhb1wiOiBcIuqctVwiLFxuXHQgIFwiYXVcIjogXCLqnLdcIixcblx0ICBcImF2XCI6IFwi6py56py7XCIsXG5cdCAgXCJheVwiOiBcIuqcvVwiLFxuXHQgIFwiYlwiOiBcIsaAyZPGg1wiLFxuXHQgIFwiY1wiOiBcIuqcv8aIyLzihoRcIixcblx0ICBcImRcIjogXCLEkcmXyZbhtIXGjOqut9SByaZcIixcblx0ICBcImVcIjogXCLJm8ed4bSHyYdcIixcblx0ICBcImZcIjogXCLqnbzGklwiLFxuXHQgIFwiZ1wiOiBcIselyaDqnqHhtbnqnb/JolwiLFxuXHQgIFwiaFwiOiBcIsSn4rGo4rG2yaVcIixcblx0ICBcImlcIjogXCLJqMSxXCIsXG5cdCAgXCJqXCI6IFwiyYnIt1wiLFxuXHQgIFwia1wiOiBcIsaZ4rGq6p2B6p2D6p2F6p6jXCIsXG5cdCAgXCJsXCI6IFwixYLGmsmr4rGh6p2J6p2H6p6Bya1cIixcblx0ICBcIm1cIjogXCLJscmvz7tcIixcblx0ICBcIm5cIjogXCLqnqXGnsmy6p6R4bSO0LvUiVwiLFxuXHQgIFwib1wiOiBcIsO4x7/JlMm16p2L6p2N4bSRXCIsXG5cdCAgXCJvZVwiOiBcIsWTXCIsXG5cdCAgXCJvaVwiOiBcIsajXCIsXG5cdCAgXCJvb1wiOiBcIuqdj1wiLFxuXHQgIFwib3VcIjogXCLIo1wiLFxuXHQgIFwicFwiOiBcIsal4bW96p2R6p2T6p2Vz4FcIixcblx0ICBcInFcIjogXCLqnZfqnZnJi1wiLFxuXHQgIFwiclwiOiBcIsmNyb3qnZvqnqfqnoNcIixcblx0ICBcInNcIjogXCLDn8i/6p6p6p6FyoJcIixcblx0ICBcInRcIjogXCLFp8atyojisabqnodcIixcblx0ICBcInRoXCI6IFwiw75cIixcblx0ICBcInR6XCI6IFwi6pypXCIsXG5cdCAgXCJ1XCI6IFwiyolcIixcblx0ICBcInZcIjogXCLKi+qdn8qMXCIsXG5cdCAgXCJ2eVwiOiBcIuqdoVwiLFxuXHQgIFwid1wiOiBcIuKxs1wiLFxuXHQgIFwieVwiOiBcIsa0yY/hu79cIixcblx0ICBcInpcIjogXCLGtsilyYDisazqnaNcIixcblx0ICBcImh2XCI6IFwixpVcIlxuXHR9O1xuXG5cdGZvciAobGV0IGxhdGluIGluIGxhdGluX2NvbmRlbnNlZCkge1xuXHQgIGxldCB1bmljb2RlID0gbGF0aW5fY29uZGVuc2VkW2xhdGluXSB8fCAnJztcblxuXHQgIGZvciAobGV0IGkgPSAwOyBpIDwgdW5pY29kZS5sZW5ndGg7IGkrKykge1xuXHQgICAgbGV0IGNoYXIgPSB1bmljb2RlLnN1YnN0cmluZyhpLCBpICsgMSk7XG5cdCAgICBsYXRpbl9jb252ZXJ0W2NoYXJdID0gbGF0aW47XG5cdCAgfVxuXHR9XG5cblx0Y29uc3QgY29udmVydF9wYXQgPSBuZXcgUmVnRXhwKE9iamVjdC5rZXlzKGxhdGluX2NvbnZlcnQpLmpvaW4oJ3wnKSArICd8JyArIGFjY2VudF9wYXQsICdndScpO1xuXHQvKipcblx0ICogSW5pdGlhbGl6ZSB0aGUgdW5pY29kZV9tYXAgZnJvbSB0aGUgZ2l2ZSBjb2RlIHBvaW50IHJhbmdlc1xuXHQgKlxuXHQgKiBAcGFyYW0ge1RDb2RlUG9pbnRzPX0gX2NvZGVfcG9pbnRzXG5cdCAqL1xuXG5cdGNvbnN0IGluaXRpYWxpemUgPSBfY29kZV9wb2ludHMgPT4ge1xuXHQgIGlmICh1bmljb2RlX21hcCAhPT0gdW5kZWZpbmVkKSByZXR1cm47XG5cdCAgdW5pY29kZV9tYXAgPSBnZW5lcmF0ZU1hcChfY29kZV9wb2ludHMgfHwgY29kZV9wb2ludHMpO1xuXHR9O1xuXHQvKipcblx0ICogSGVscGVyIG1ldGhvZCBmb3Igbm9ybWFsaXplIGEgc3RyaW5nXG5cdCAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N0cmluZy9ub3JtYWxpemVcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZm9ybVxuXHQgKi9cblxuXHRjb25zdCBub3JtYWxpemUgPSAoc3RyLCBmb3JtID0gJ05GS0QnKSA9PiBzdHIubm9ybWFsaXplKGZvcm0pO1xuXHQvKipcblx0ICogUmVtb3ZlIGFjY2VudHMgd2l0aG91dCByZW9yZGVyaW5nIHN0cmluZ1xuXHQgKiBjYWxsaW5nIHN0ci5ub3JtYWxpemUoJ05GS0QnKSBvbiBcXHV7NTk0fVxcdXs1OTV9XFx1ezU5Nn0gYmVjb21lcyBcXHV7NTk2fVxcdXs1OTR9XFx1ezU5NX1cblx0ICogdmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlzay9GdXNlL2lzc3Vlcy8xMzMjaXNzdWVjb21tZW50LTMxODY5MjcwM1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cblx0Y29uc3QgYXNjaWlmb2xkID0gc3RyID0+IHtcblx0ICByZXR1cm4gdG9BcnJheShzdHIpLnJlZHVjZShcblx0ICAvKipcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzdWx0XG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXJcblx0ICAgKi9cblx0ICAocmVzdWx0LCBjaGFyKSA9PiB7XG5cdCAgICByZXR1cm4gcmVzdWx0ICsgX2FzY2lpZm9sZChjaGFyKTtcblx0ICB9LCAnJyk7XG5cdH07XG5cdC8qKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cblx0Y29uc3QgX2FzY2lpZm9sZCA9IHN0ciA9PiB7XG5cdCAgc3RyID0gbm9ybWFsaXplKHN0cikudG9Mb3dlckNhc2UoKS5yZXBsYWNlKGNvbnZlcnRfcGF0LCAoXG5cdCAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXG5cdCAgY2hhcikgPT4ge1xuXHQgICAgcmV0dXJuIGxhdGluX2NvbnZlcnRbY2hhcl0gfHwgJyc7XG5cdCAgfSk7IC8vcmV0dXJuIHN0cjtcblxuXHQgIHJldHVybiBub3JtYWxpemUoc3RyLCAnTkZDJyk7XG5cdH07XG5cdC8qKlxuXHQgKiBHZW5lcmF0ZSBhIGxpc3Qgb2YgdW5pY29kZSB2YXJpYW50cyBmcm9tIHRoZSBsaXN0IG9mIGNvZGUgcG9pbnRzXG5cdCAqIEBwYXJhbSB7VENvZGVQb2ludHN9IGNvZGVfcG9pbnRzXG5cdCAqIEB5aWVsZCB7VENvZGVQb2ludE9ian1cblx0ICovXG5cblx0ZnVuY3Rpb24qIGdlbmVyYXRvcihjb2RlX3BvaW50cykge1xuXHQgIGZvciAoY29uc3QgW2NvZGVfcG9pbnRfbWluLCBjb2RlX3BvaW50X21heF0gb2YgY29kZV9wb2ludHMpIHtcblx0ICAgIGZvciAobGV0IGkgPSBjb2RlX3BvaW50X21pbjsgaSA8PSBjb2RlX3BvaW50X21heDsgaSsrKSB7XG5cdCAgICAgIGxldCBjb21wb3NlZCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG5cdCAgICAgIGxldCBmb2xkZWQgPSBhc2NpaWZvbGQoY29tcG9zZWQpO1xuXG5cdCAgICAgIGlmIChmb2xkZWQgPT0gY29tcG9zZWQudG9Mb3dlckNhc2UoKSkge1xuXHQgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICB9IC8vIHNraXAgd2hlbiBmb2xkZWQgaXMgYSBzdHJpbmcgbG9uZ2VyIHRoYW4gMyBjaGFyYWN0ZXJzIGxvbmdcblx0ICAgICAgLy8gYmMgdGhlIHJlc3VsdGluZyByZWdleCBwYXR0ZXJucyB3aWxsIGJlIGxvbmdcblx0ICAgICAgLy8gZWc6XG5cdCAgICAgIC8vIGZvbGRlZCDYtdmE2Ykg2KfZhNmE2Ycg2LnZhNmK2Ycg2YjYs9mE2YUgbGVuZ3RoIDE4IGNvZGUgcG9pbnQgNjUwMThcblx0ICAgICAgLy8gZm9sZGVkINis2YQg2KzZhNin2YTZhyBsZW5ndGggOCBjb2RlIHBvaW50IDY1MDE5XG5cblxuXHQgICAgICBpZiAoZm9sZGVkLmxlbmd0aCA+IG1heF9jaGFyX2xlbmd0aCkge1xuXHQgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGZvbGRlZC5sZW5ndGggPT0gMCkge1xuXHQgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICB9XG5cblx0ICAgICAgeWllbGQge1xuXHQgICAgICAgIGZvbGRlZDogZm9sZGVkLFxuXHQgICAgICAgIGNvbXBvc2VkOiBjb21wb3NlZCxcblx0ICAgICAgICBjb2RlX3BvaW50OiBpXG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfVxuXHR9XG5cdC8qKlxuXHQgKiBHZW5lcmF0ZSBhIHVuaWNvZGUgbWFwIGZyb20gdGhlIGxpc3Qgb2YgY29kZSBwb2ludHNcblx0ICogQHBhcmFtIHtUQ29kZVBvaW50c30gY29kZV9wb2ludHNcblx0ICogQHJldHVybiB7VFVuaWNvZGVTZXRzfVxuXHQgKi9cblxuXHRjb25zdCBnZW5lcmF0ZVNldHMgPSBjb2RlX3BvaW50cyA9PiB7XG5cdCAgLyoqIEB0eXBlIHt7W2tleTpzdHJpbmddOlNldDxzdHJpbmc+fX0gKi9cblx0ICBjb25zdCB1bmljb2RlX3NldHMgPSB7fTtcblx0ICAvKipcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gZm9sZGVkXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IHRvX2FkZFxuXHQgICAqL1xuXG5cdCAgY29uc3QgYWRkTWF0Y2hpbmcgPSAoZm9sZGVkLCB0b19hZGQpID0+IHtcblx0ICAgIC8qKiBAdHlwZSB7U2V0PHN0cmluZz59ICovXG5cdCAgICBjb25zdCBmb2xkZWRfc2V0ID0gdW5pY29kZV9zZXRzW2ZvbGRlZF0gfHwgbmV3IFNldCgpO1xuXHQgICAgY29uc3QgcGF0dCA9IG5ldyBSZWdFeHAoJ14nICsgc2V0VG9QYXR0ZXJuKGZvbGRlZF9zZXQpICsgJyQnLCAnaXUnKTtcblxuXHQgICAgaWYgKHRvX2FkZC5tYXRjaChwYXR0KSkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIGZvbGRlZF9zZXQuYWRkKGVzY2FwZV9yZWdleCh0b19hZGQpKTtcblx0ICAgIHVuaWNvZGVfc2V0c1tmb2xkZWRdID0gZm9sZGVkX3NldDtcblx0ICB9O1xuXG5cdCAgZm9yIChsZXQgdmFsdWUgb2YgZ2VuZXJhdG9yKGNvZGVfcG9pbnRzKSkge1xuXHQgICAgYWRkTWF0Y2hpbmcodmFsdWUuZm9sZGVkLCB2YWx1ZS5mb2xkZWQpO1xuXHQgICAgYWRkTWF0Y2hpbmcodmFsdWUuZm9sZGVkLCB2YWx1ZS5jb21wb3NlZCk7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIHVuaWNvZGVfc2V0cztcblx0fTtcblx0LyoqXG5cdCAqIEdlbmVyYXRlIGEgdW5pY29kZSBtYXAgZnJvbSB0aGUgbGlzdCBvZiBjb2RlIHBvaW50c1xuXHQgKiBhZSA9PiAoPzooPzphZXzDhnzHvHzHoil8KD86QXzikrZ877yhLi4uKSg/OkV8yZt84pK6Li4uKSlcblx0ICpcblx0ICogQHBhcmFtIHtUQ29kZVBvaW50c30gY29kZV9wb2ludHNcblx0ICogQHJldHVybiB7VFVuaWNvZGVNYXB9XG5cdCAqL1xuXG5cdGNvbnN0IGdlbmVyYXRlTWFwID0gY29kZV9wb2ludHMgPT4ge1xuXHQgIC8qKiBAdHlwZSB7VFVuaWNvZGVTZXRzfSAqL1xuXHQgIGNvbnN0IHVuaWNvZGVfc2V0cyA9IGdlbmVyYXRlU2V0cyhjb2RlX3BvaW50cyk7XG5cdCAgLyoqIEB0eXBlIHtUVW5pY29kZU1hcH0gKi9cblxuXHQgIGNvbnN0IHVuaWNvZGVfbWFwID0ge307XG5cdCAgLyoqIEB0eXBlIHtzdHJpbmdbXX0gKi9cblxuXHQgIGxldCBtdWx0aV9jaGFyID0gW107XG5cblx0ICBmb3IgKGxldCBmb2xkZWQgaW4gdW5pY29kZV9zZXRzKSB7XG5cdCAgICBsZXQgc2V0ID0gdW5pY29kZV9zZXRzW2ZvbGRlZF07XG5cblx0ICAgIGlmIChzZXQpIHtcblx0ICAgICAgdW5pY29kZV9tYXBbZm9sZGVkXSA9IHNldFRvUGF0dGVybihzZXQpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoZm9sZGVkLmxlbmd0aCA+IDEpIHtcblx0ICAgICAgbXVsdGlfY2hhci5wdXNoKGVzY2FwZV9yZWdleChmb2xkZWQpKTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBtdWx0aV9jaGFyLnNvcnQoKGEsIGIpID0+IGIubGVuZ3RoIC0gYS5sZW5ndGgpO1xuXHQgIGNvbnN0IG11bHRpX2NoYXJfcGF0dCA9IGFycmF5VG9QYXR0ZXJuKG11bHRpX2NoYXIpO1xuXHQgIG11bHRpX2NoYXJfcmVnID0gbmV3IFJlZ0V4cCgnXicgKyBtdWx0aV9jaGFyX3BhdHQsICd1Jyk7XG5cdCAgcmV0dXJuIHVuaWNvZGVfbWFwO1xuXHR9O1xuXHQvKipcblx0ICogTWFwIGVhY2ggZWxlbWVudCBvZiBhbiBhcnJheSBmcm9tIGl0J3MgZm9sZGVkIHZhbHVlIHRvIGFsbCBwb3NzaWJsZSB1bmljb2RlIG1hdGNoZXNcblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gc3RyaW5nc1xuXHQgKiBAcGFyYW0ge251bWJlcn0gbWluX3JlcGxhY2VtZW50XG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cblx0Y29uc3QgbWFwU2VxdWVuY2UgPSAoc3RyaW5ncywgbWluX3JlcGxhY2VtZW50ID0gMSkgPT4ge1xuXHQgIGxldCBjaGFyc19yZXBsYWNlZCA9IDA7XG5cdCAgc3RyaW5ncyA9IHN0cmluZ3MubWFwKHN0ciA9PiB7XG5cdCAgICBpZiAodW5pY29kZV9tYXBbc3RyXSkge1xuXHQgICAgICBjaGFyc19yZXBsYWNlZCArPSBzdHIubGVuZ3RoO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdW5pY29kZV9tYXBbc3RyXSB8fCBzdHI7XG5cdCAgfSk7XG5cblx0ICBpZiAoY2hhcnNfcmVwbGFjZWQgPj0gbWluX3JlcGxhY2VtZW50KSB7XG5cdCAgICByZXR1cm4gc2VxdWVuY2VQYXR0ZXJuKHN0cmluZ3MpO1xuXHQgIH1cblxuXHQgIHJldHVybiAnJztcblx0fTtcblx0LyoqXG5cdCAqIENvbnZlcnQgYSBzaG9ydCBzdHJpbmcgYW5kIHNwbGl0IGl0IGludG8gYWxsIHBvc3NpYmxlIHBhdHRlcm5zXG5cdCAqIEtlZXAgYSBwYXR0ZXJuIG9ubHkgaWYgbWluX3JlcGxhY2VtZW50IGlzIG1ldFxuXHQgKlxuXHQgKiAnYWJjJ1xuXHQgKiBcdFx0PT4gW1snYWJjJ10sWydhYicsJ2MnXSxbJ2EnLCdiYyddLFsnYScsJ2InLCdjJ11dXG5cdCAqXHRcdD0+IFsnYWJjLXBhdHRlcm4nLCdhYi1jLXBhdHRlcm4nLi4uXVxuXHQgKlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBtaW5fcmVwbGFjZW1lbnRcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblxuXHRjb25zdCBzdWJzdHJpbmdzVG9QYXR0ZXJuID0gKHN0ciwgbWluX3JlcGxhY2VtZW50ID0gMSkgPT4ge1xuXHQgIG1pbl9yZXBsYWNlbWVudCA9IE1hdGgubWF4KG1pbl9yZXBsYWNlbWVudCwgc3RyLmxlbmd0aCAtIDEpO1xuXHQgIHJldHVybiBhcnJheVRvUGF0dGVybihhbGxTdWJzdHJpbmdzKHN0cikubWFwKHN1Yl9wYXQgPT4ge1xuXHQgICAgcmV0dXJuIG1hcFNlcXVlbmNlKHN1Yl9wYXQsIG1pbl9yZXBsYWNlbWVudCk7XG5cdCAgfSkpO1xuXHR9O1xuXHQvKipcblx0ICogQ29udmVydCBhbiBhcnJheSBvZiBzZXF1ZW5jZXMgaW50byBhIHBhdHRlcm5cblx0ICogW3tzdGFydDowLGVuZDozLGxlbmd0aDozLHN1YnN0cjonaWlpJ30uLi5dID0+ICg/OmlpaS4uLilcblx0ICpcblx0ICogQHBhcmFtIHtTZXF1ZW5jZVtdfSBzZXF1ZW5jZXNcblx0ICogQHBhcmFtIHtib29sZWFufSBhbGxcblx0ICovXG5cblx0Y29uc3Qgc2VxdWVuY2VzVG9QYXR0ZXJuID0gKHNlcXVlbmNlcywgYWxsID0gdHJ1ZSkgPT4ge1xuXHQgIGxldCBtaW5fcmVwbGFjZW1lbnQgPSBzZXF1ZW5jZXMubGVuZ3RoID4gMSA/IDEgOiAwO1xuXHQgIHJldHVybiBhcnJheVRvUGF0dGVybihzZXF1ZW5jZXMubWFwKHNlcXVlbmNlID0+IHtcblx0ICAgIGxldCBzZXEgPSBbXTtcblx0ICAgIGNvbnN0IGxlbiA9IGFsbCA/IHNlcXVlbmNlLmxlbmd0aCgpIDogc2VxdWVuY2UubGVuZ3RoKCkgLSAxO1xuXG5cdCAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxlbjsgaisrKSB7XG5cdCAgICAgIHNlcS5wdXNoKHN1YnN0cmluZ3NUb1BhdHRlcm4oc2VxdWVuY2Uuc3Vic3Ryc1tqXSB8fCAnJywgbWluX3JlcGxhY2VtZW50KSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBzZXF1ZW5jZVBhdHRlcm4oc2VxKTtcblx0ICB9KSk7XG5cdH07XG5cdC8qKlxuXHQgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgc2VxdWVuY2UgaXMgYWxyZWFkeSBpbiB0aGUgc2VxdWVuY2VzXG5cdCAqIEBwYXJhbSB7U2VxdWVuY2V9IG5lZWRsZV9zZXFcblx0ICogQHBhcmFtIHtTZXF1ZW5jZVtdfSBzZXF1ZW5jZXNcblx0ICovXG5cblxuXHRjb25zdCBpblNlcXVlbmNlcyA9IChuZWVkbGVfc2VxLCBzZXF1ZW5jZXMpID0+IHtcblx0ICBmb3IgKGNvbnN0IHNlcSBvZiBzZXF1ZW5jZXMpIHtcblx0ICAgIGlmIChzZXEuc3RhcnQgIT0gbmVlZGxlX3NlcS5zdGFydCB8fCBzZXEuZW5kICE9IG5lZWRsZV9zZXEuZW5kKSB7XG5cdCAgICAgIGNvbnRpbnVlO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoc2VxLnN1YnN0cnMuam9pbignJykgIT09IG5lZWRsZV9zZXEuc3Vic3Rycy5qb2luKCcnKSkge1xuXHQgICAgICBjb250aW51ZTtcblx0ICAgIH1cblxuXHQgICAgbGV0IG5lZWRsZV9wYXJ0cyA9IG5lZWRsZV9zZXEucGFydHM7XG5cdCAgICAvKipcblx0ICAgICAqIEBwYXJhbSB7VFNlcXVlbmNlUGFydH0gcGFydFxuXHQgICAgICovXG5cblx0ICAgIGNvbnN0IGZpbHRlciA9IHBhcnQgPT4ge1xuXHQgICAgICBmb3IgKGNvbnN0IG5lZWRsZV9wYXJ0IG9mIG5lZWRsZV9wYXJ0cykge1xuXHQgICAgICAgIGlmIChuZWVkbGVfcGFydC5zdGFydCA9PT0gcGFydC5zdGFydCAmJiBuZWVkbGVfcGFydC5zdWJzdHIgPT09IHBhcnQuc3Vic3RyKSB7XG5cdCAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKHBhcnQubGVuZ3RoID09IDEgfHwgbmVlZGxlX3BhcnQubGVuZ3RoID09IDEpIHtcblx0ICAgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICAgIH0gLy8gY2hlY2sgZm9yIG92ZXJsYXBwaW5nIHBhcnRzXG5cdCAgICAgICAgLy8gYSA9IFsnOjo9JywnPT0nXVxuXHQgICAgICAgIC8vIGIgPSBbJzo6JywnPT09J11cblx0ICAgICAgICAvLyBhID0gWydyJywnc20nXVxuXHQgICAgICAgIC8vIGIgPSBbJ3JzJywnbSddXG5cblxuXHQgICAgICAgIGlmIChwYXJ0LnN0YXJ0IDwgbmVlZGxlX3BhcnQuc3RhcnQgJiYgcGFydC5lbmQgPiBuZWVkbGVfcGFydC5zdGFydCkge1xuXHQgICAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKG5lZWRsZV9wYXJ0LnN0YXJ0IDwgcGFydC5zdGFydCAmJiBuZWVkbGVfcGFydC5lbmQgPiBwYXJ0LnN0YXJ0KSB7XG5cdCAgICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9O1xuXG5cdCAgICBsZXQgZmlsdGVyZWQgPSBzZXEucGFydHMuZmlsdGVyKGZpbHRlcik7XG5cblx0ICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPiAwKSB7XG5cdCAgICAgIGNvbnRpbnVlO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cblx0ICByZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0Y2xhc3MgU2VxdWVuY2Uge1xuXHQgIGNvbnN0cnVjdG9yKCkge1xuXHQgICAgLyoqIEB0eXBlIHtUU2VxdWVuY2VQYXJ0W119ICovXG5cdCAgICB0aGlzLnBhcnRzID0gW107XG5cdCAgICAvKiogQHR5cGUge3N0cmluZ1tdfSAqL1xuXG5cdCAgICB0aGlzLnN1YnN0cnMgPSBbXTtcblx0ICAgIHRoaXMuc3RhcnQgPSAwO1xuXHQgICAgdGhpcy5lbmQgPSAwO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBAcGFyYW0ge1RTZXF1ZW5jZVBhcnR8dW5kZWZpbmVkfSBwYXJ0XG5cdCAgICovXG5cblxuXHQgIGFkZChwYXJ0KSB7XG5cdCAgICBpZiAocGFydCkge1xuXHQgICAgICB0aGlzLnBhcnRzLnB1c2gocGFydCk7XG5cdCAgICAgIHRoaXMuc3Vic3Rycy5wdXNoKHBhcnQuc3Vic3RyKTtcblx0ICAgICAgdGhpcy5zdGFydCA9IE1hdGgubWluKHBhcnQuc3RhcnQsIHRoaXMuc3RhcnQpO1xuXHQgICAgICB0aGlzLmVuZCA9IE1hdGgubWF4KHBhcnQuZW5kLCB0aGlzLmVuZCk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgbGFzdCgpIHtcblx0ICAgIHJldHVybiB0aGlzLnBhcnRzW3RoaXMucGFydHMubGVuZ3RoIC0gMV07XG5cdCAgfVxuXG5cdCAgbGVuZ3RoKCkge1xuXHQgICAgcmV0dXJuIHRoaXMucGFydHMubGVuZ3RoO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb25cblx0ICAgKiBAcGFyYW0ge1RTZXF1ZW5jZVBhcnR9IGxhc3RfcGllY2Vcblx0ICAgKi9cblxuXG5cdCAgY2xvbmUocG9zaXRpb24sIGxhc3RfcGllY2UpIHtcblx0ICAgIGxldCBjbG9uZSA9IG5ldyBTZXF1ZW5jZSgpO1xuXHQgICAgbGV0IHBhcnRzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLnBhcnRzKSk7XG5cdCAgICBsZXQgbGFzdF9wYXJ0ID0gcGFydHMucG9wKCk7XG5cblx0ICAgIGZvciAoY29uc3QgcGFydCBvZiBwYXJ0cykge1xuXHQgICAgICBjbG9uZS5hZGQocGFydCk7XG5cdCAgICB9XG5cblx0ICAgIGxldCBsYXN0X3N1YnN0ciA9IGxhc3RfcGllY2Uuc3Vic3RyLnN1YnN0cmluZygwLCBwb3NpdGlvbiAtIGxhc3RfcGFydC5zdGFydCk7XG5cdCAgICBsZXQgY2xvbmVfbGFzdF9sZW4gPSBsYXN0X3N1YnN0ci5sZW5ndGg7XG5cdCAgICBjbG9uZS5hZGQoe1xuXHQgICAgICBzdGFydDogbGFzdF9wYXJ0LnN0YXJ0LFxuXHQgICAgICBlbmQ6IGxhc3RfcGFydC5zdGFydCArIGNsb25lX2xhc3RfbGVuLFxuXHQgICAgICBsZW5ndGg6IGNsb25lX2xhc3RfbGVuLFxuXHQgICAgICBzdWJzdHI6IGxhc3Rfc3Vic3RyXG5cdCAgICB9KTtcblx0ICAgIHJldHVybiBjbG9uZTtcblx0ICB9XG5cblx0fVxuXHQvKipcblx0ICogRXhwYW5kIGEgcmVndWxhciBleHByZXNzaW9uIHBhdHRlcm4gdG8gaW5jbHVkZSB1bmljb2RlIHZhcmlhbnRzXG5cdCAqIFx0ZWcgL2EvIGJlY29tZXMgL2Hik5DvvYHhuprDoMOhw6LhuqfhuqXhuqvhuqnDo8SBxIPhurHhuq/hurXhurPIp8ehw6THn+G6o8Olx7vHjsiByIPhuqHhuq3hurfhuIHEheKxpcmQyZFB4pK277yhw4DDgcOC4bqm4bqk4bqq4bqow4PEgMSC4bqw4bqu4bq04bqyyKbHoMOEx57huqLDhce6x43IgMiC4bqg4bqs4bq24biAxITIuuKxry9cblx0ICpcblx0ICogSXNzdWU6XG5cdCAqICDvuorvuosgWyAn77qKID0gXFxcXHV7ZmU4YX0nLCAn77qLID0gXFxcXHV7ZmU4Yn0nIF1cblx0ICpcdGJlY29tZXM6XHTZitmU2YrZlCBbICfZiiA9IFxcXFx1ezY0YX0nLCAn2ZQgPSBcXFxcdXs2NTR9JywgJ9mKID0gXFxcXHV7NjRhfScsICfZlCA9IFxcXFx1ezY1NH0nIF1cblx0ICpcblx0ICpcdMSwxLIgPSBJSUogPSDihaFKXG5cdCAqXG5cdCAqIFx0MS8yLzRcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcmV0dXJuIHtzdHJpbmd8dW5kZWZpbmVkfVxuXHQgKi9cblxuXG5cdGNvbnN0IGdldFBhdHRlcm4gPSBzdHIgPT4ge1xuXHQgIGluaXRpYWxpemUoKTtcblx0ICBzdHIgPSBhc2NpaWZvbGQoc3RyKTtcblx0ICBsZXQgcGF0dGVybiA9ICcnO1xuXHQgIGxldCBzZXF1ZW5jZXMgPSBbbmV3IFNlcXVlbmNlKCldO1xuXG5cdCAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcblx0ICAgIGxldCBzdWJzdHIgPSBzdHIuc3Vic3RyaW5nKGkpO1xuXHQgICAgbGV0IG1hdGNoID0gc3Vic3RyLm1hdGNoKG11bHRpX2NoYXJfcmVnKTtcblx0ICAgIGNvbnN0IGNoYXIgPSBzdHIuc3Vic3RyaW5nKGksIGkgKyAxKTtcblx0ICAgIGNvbnN0IG1hdGNoX3N0ciA9IG1hdGNoID8gbWF0Y2hbMF0gOiBudWxsOyAvLyBsb29wIHRocm91Z2ggc2VxdWVuY2VzXG5cdCAgICAvLyBhZGQgZWl0aGVyIHRoZSBjaGFyIG9yIG11bHRpX21hdGNoXG5cblx0ICAgIGxldCBvdmVybGFwcGluZyA9IFtdO1xuXHQgICAgbGV0IGFkZGVkX3R5cGVzID0gbmV3IFNldCgpO1xuXG5cdCAgICBmb3IgKGNvbnN0IHNlcXVlbmNlIG9mIHNlcXVlbmNlcykge1xuXHQgICAgICBjb25zdCBsYXN0X3BpZWNlID0gc2VxdWVuY2UubGFzdCgpO1xuXG5cdCAgICAgIGlmICghbGFzdF9waWVjZSB8fCBsYXN0X3BpZWNlLmxlbmd0aCA9PSAxIHx8IGxhc3RfcGllY2UuZW5kIDw9IGkpIHtcblx0ICAgICAgICAvLyBpZiB3ZSBoYXZlIGEgbXVsdGkgbWF0Y2hcblx0ICAgICAgICBpZiAobWF0Y2hfc3RyKSB7XG5cdCAgICAgICAgICBjb25zdCBsZW4gPSBtYXRjaF9zdHIubGVuZ3RoO1xuXHQgICAgICAgICAgc2VxdWVuY2UuYWRkKHtcblx0ICAgICAgICAgICAgc3RhcnQ6IGksXG5cdCAgICAgICAgICAgIGVuZDogaSArIGxlbixcblx0ICAgICAgICAgICAgbGVuZ3RoOiBsZW4sXG5cdCAgICAgICAgICAgIHN1YnN0cjogbWF0Y2hfc3RyXG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICAgIGFkZGVkX3R5cGVzLmFkZCgnMScpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBzZXF1ZW5jZS5hZGQoe1xuXHQgICAgICAgICAgICBzdGFydDogaSxcblx0ICAgICAgICAgICAgZW5kOiBpICsgMSxcblx0ICAgICAgICAgICAgbGVuZ3RoOiAxLFxuXHQgICAgICAgICAgICBzdWJzdHI6IGNoYXJcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgYWRkZWRfdHlwZXMuYWRkKCcyJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGVsc2UgaWYgKG1hdGNoX3N0cikge1xuXHQgICAgICAgIGxldCBjbG9uZSA9IHNlcXVlbmNlLmNsb25lKGksIGxhc3RfcGllY2UpO1xuXHQgICAgICAgIGNvbnN0IGxlbiA9IG1hdGNoX3N0ci5sZW5ndGg7XG5cdCAgICAgICAgY2xvbmUuYWRkKHtcblx0ICAgICAgICAgIHN0YXJ0OiBpLFxuXHQgICAgICAgICAgZW5kOiBpICsgbGVuLFxuXHQgICAgICAgICAgbGVuZ3RoOiBsZW4sXG5cdCAgICAgICAgICBzdWJzdHI6IG1hdGNoX3N0clxuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIG92ZXJsYXBwaW5nLnB1c2goY2xvbmUpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIC8vIGRvbid0IGFkZCBjaGFyXG5cdCAgICAgICAgLy8gYWRkaW5nIHdvdWxkIGNyZWF0ZSBpbnZhbGlkIHBhdHRlcm5zOiAyMzQgPT4gWzIsMzQsNF1cblx0ICAgICAgICBhZGRlZF90eXBlcy5hZGQoJzMnKTtcblx0ICAgICAgfVxuXHQgICAgfSAvLyBpZiB3ZSBoYXZlIG92ZXJsYXBwaW5nXG5cblxuXHQgICAgaWYgKG92ZXJsYXBwaW5nLmxlbmd0aCA+IDApIHtcblx0ICAgICAgLy8gWydpaScsJ2lpaSddIGJlZm9yZSBbJ2knLCdpJywnaWlpJ11cblx0ICAgICAgb3ZlcmxhcHBpbmcgPSBvdmVybGFwcGluZy5zb3J0KChhLCBiKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuIGEubGVuZ3RoKCkgLSBiLmxlbmd0aCgpO1xuXHQgICAgICB9KTtcblxuXHQgICAgICBmb3IgKGxldCBjbG9uZSBvZiBvdmVybGFwcGluZykge1xuXHQgICAgICAgIC8vIGRvbid0IGFkZCBpZiB3ZSBhbHJlYWR5IGhhdmUgYW4gZXF1aXZhbGVudCBzZXF1ZW5jZVxuXHQgICAgICAgIGlmIChpblNlcXVlbmNlcyhjbG9uZSwgc2VxdWVuY2VzKSkge1xuXHQgICAgICAgICAgY29udGludWU7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VxdWVuY2VzLnB1c2goY2xvbmUpO1xuXHQgICAgICB9XG5cblx0ICAgICAgY29udGludWU7XG5cdCAgICB9IC8vIGlmIHdlIGhhdmVuJ3QgZG9uZSBhbnl0aGluZyB1bmlxdWVcblx0ICAgIC8vIGNsZWFuIHVwIHRoZSBwYXR0ZXJuc1xuXHQgICAgLy8gaGVscHMga2VlcCBwYXR0ZXJucyBzbWFsbGVyXG5cdCAgICAvLyBpZiBzdHIgPSAncuKCqOOOp2FhcnNzJywgcGF0dGVybiB3aWxsIGJlIDQ0NiBpbnN0ZWFkIG9mIDY1NVxuXG5cblx0ICAgIGlmIChpID4gMCAmJiBhZGRlZF90eXBlcy5zaXplID09IDEgJiYgIWFkZGVkX3R5cGVzLmhhcygnMycpKSB7XG5cdCAgICAgIHBhdHRlcm4gKz0gc2VxdWVuY2VzVG9QYXR0ZXJuKHNlcXVlbmNlcywgZmFsc2UpO1xuXHQgICAgICBsZXQgbmV3X3NlcSA9IG5ldyBTZXF1ZW5jZSgpO1xuXHQgICAgICBjb25zdCBvbGRfc2VxID0gc2VxdWVuY2VzWzBdO1xuXG5cdCAgICAgIGlmIChvbGRfc2VxKSB7XG5cdCAgICAgICAgbmV3X3NlcS5hZGQob2xkX3NlcS5sYXN0KCkpO1xuXHQgICAgICB9XG5cblx0ICAgICAgc2VxdWVuY2VzID0gW25ld19zZXFdO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIHBhdHRlcm4gKz0gc2VxdWVuY2VzVG9QYXR0ZXJuKHNlcXVlbmNlcywgdHJ1ZSk7XG5cdCAgcmV0dXJuIHBhdHRlcm47XG5cdH07XG5cblx0LyohIHNpZnRlci5qcyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9vcmNoaWRqcy9zaWZ0ZXIuanMgfCBBcGFjaGUgTGljZW5zZSAodjIpICovXG5cblx0LyoqXG5cdCAqIEEgcHJvcGVydHkgZ2V0dGVyIHJlc29sdmluZyBkb3Qtbm90YXRpb25cblx0ICogQHBhcmFtICB7T2JqZWN0fSAgb2JqICAgICBUaGUgcm9vdCBvYmplY3QgdG8gZmV0Y2ggcHJvcGVydHkgb25cblx0ICogQHBhcmFtICB7U3RyaW5nfSAgbmFtZSAgICBUaGUgb3B0aW9uYWxseSBkb3R0ZWQgcHJvcGVydHkgbmFtZSB0byBmZXRjaFxuXHQgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgIFRoZSByZXNvbHZlZCBwcm9wZXJ0eSB2YWx1ZVxuXHQgKi9cblx0Y29uc3QgZ2V0QXR0ciA9IChvYmosIG5hbWUpID0+IHtcblx0ICBpZiAoIW9iaikgcmV0dXJuO1xuXHQgIHJldHVybiBvYmpbbmFtZV07XG5cdH07XG5cdC8qKlxuXHQgKiBBIHByb3BlcnR5IGdldHRlciByZXNvbHZpbmcgZG90LW5vdGF0aW9uXG5cdCAqIEBwYXJhbSAge09iamVjdH0gIG9iaiAgICAgVGhlIHJvb3Qgb2JqZWN0IHRvIGZldGNoIHByb3BlcnR5IG9uXG5cdCAqIEBwYXJhbSAge1N0cmluZ30gIG5hbWUgICAgVGhlIG9wdGlvbmFsbHkgZG90dGVkIHByb3BlcnR5IG5hbWUgdG8gZmV0Y2hcblx0ICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICBUaGUgcmVzb2x2ZWQgcHJvcGVydHkgdmFsdWVcblx0ICovXG5cblx0Y29uc3QgZ2V0QXR0ck5lc3RpbmcgPSAob2JqLCBuYW1lKSA9PiB7XG5cdCAgaWYgKCFvYmopIHJldHVybjtcblx0ICB2YXIgcGFydCxcblx0ICAgICAgbmFtZXMgPSBuYW1lLnNwbGl0KFwiLlwiKTtcblxuXHQgIHdoaWxlICgocGFydCA9IG5hbWVzLnNoaWZ0KCkpICYmIChvYmogPSBvYmpbcGFydF0pKTtcblxuXHQgIHJldHVybiBvYmo7XG5cdH07XG5cdC8qKlxuXHQgKiBDYWxjdWxhdGVzIGhvdyBjbG9zZSBvZiBhIG1hdGNoIHRoZVxuXHQgKiBnaXZlbiB2YWx1ZSBpcyBhZ2FpbnN0IGEgc2VhcmNoIHRva2VuLlxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBzY29yZVZhbHVlID0gKHZhbHVlLCB0b2tlbiwgd2VpZ2h0KSA9PiB7XG5cdCAgdmFyIHNjb3JlLCBwb3M7XG5cdCAgaWYgKCF2YWx1ZSkgcmV0dXJuIDA7XG5cdCAgdmFsdWUgPSB2YWx1ZSArICcnO1xuXHQgIGlmICh0b2tlbi5yZWdleCA9PSBudWxsKSByZXR1cm4gMDtcblx0ICBwb3MgPSB2YWx1ZS5zZWFyY2godG9rZW4ucmVnZXgpO1xuXHQgIGlmIChwb3MgPT09IC0xKSByZXR1cm4gMDtcblx0ICBzY29yZSA9IHRva2VuLnN0cmluZy5sZW5ndGggLyB2YWx1ZS5sZW5ndGg7XG5cdCAgaWYgKHBvcyA9PT0gMCkgc2NvcmUgKz0gMC41O1xuXHQgIHJldHVybiBzY29yZSAqIHdlaWdodDtcblx0fTtcblx0LyoqXG5cdCAqIENhc3Qgb2JqZWN0IHByb3BlcnR5IHRvIGFuIGFycmF5IGlmIGl0IGV4aXN0cyBhbmQgaGFzIGEgdmFsdWVcblx0ICpcblx0ICovXG5cblx0Y29uc3QgcHJvcFRvQXJyYXkgPSAob2JqLCBrZXkpID0+IHtcblx0ICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcblx0ICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHJldHVybiB2YWx1ZTtcblxuXHQgIGlmICh2YWx1ZSAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0ICAgIG9ialtrZXldID0gW3ZhbHVlXTtcblx0ICB9XG5cdH07XG5cdC8qKlxuXHQgKiBJdGVyYXRlcyBvdmVyIGFycmF5cyBhbmQgaGFzaGVzLlxuXHQgKlxuXHQgKiBgYGBcblx0ICogaXRlcmF0ZSh0aGlzLml0ZW1zLCBmdW5jdGlvbihpdGVtLCBpZCkge1xuXHQgKiAgICAvLyBpbnZva2VkIGZvciBlYWNoIGl0ZW1cblx0ICogfSk7XG5cdCAqIGBgYFxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBpdGVyYXRlJDEgPSAob2JqZWN0LCBjYWxsYmFjaykgPT4ge1xuXHQgIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcblx0ICAgIG9iamVjdC5mb3JFYWNoKGNhbGxiYWNrKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuXHQgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcblx0ICAgICAgICBjYWxsYmFjayhvYmplY3Rba2V5XSwga2V5KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0fTtcblx0Y29uc3QgY21wID0gKGEsIGIpID0+IHtcblx0ICBpZiAodHlwZW9mIGEgPT09ICdudW1iZXInICYmIHR5cGVvZiBiID09PSAnbnVtYmVyJykge1xuXHQgICAgcmV0dXJuIGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwO1xuXHQgIH1cblxuXHQgIGEgPSBhc2NpaWZvbGQoYSArICcnKS50b0xvd2VyQ2FzZSgpO1xuXHQgIGIgPSBhc2NpaWZvbGQoYiArICcnKS50b0xvd2VyQ2FzZSgpO1xuXHQgIGlmIChhID4gYikgcmV0dXJuIDE7XG5cdCAgaWYgKGIgPiBhKSByZXR1cm4gLTE7XG5cdCAgcmV0dXJuIDA7XG5cdH07XG5cblx0LyohIHNpZnRlci5qcyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9vcmNoaWRqcy9zaWZ0ZXIuanMgfCBBcGFjaGUgTGljZW5zZSAodjIpICovXG5cblx0LyoqXG5cdCAqIHNpZnRlci5qc1xuXHQgKiBDb3B5cmlnaHQgKGMpIDIwMTPigJMyMDIwIEJyaWFuIFJlYXZpcyAmIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICogQGF1dGhvciBCcmlhbiBSZWF2aXMgPGJyaWFuQHRoaXJkcm91dGUuY29tPlxuXHQgKi9cblxuXHRjbGFzcyBTaWZ0ZXIge1xuXHQgIC8vIFtdfHt9O1xuXG5cdCAgLyoqXG5cdCAgICogVGV4dHVhbGx5IHNlYXJjaGVzIGFycmF5cyBhbmQgaGFzaGVzIG9mIG9iamVjdHNcblx0ICAgKiBieSBwcm9wZXJ0eSAob3IgbXVsdGlwbGUgcHJvcGVydGllcykuIERlc2lnbmVkXG5cdCAgICogc3BlY2lmaWNhbGx5IGZvciBhdXRvY29tcGxldGUuXG5cdCAgICpcblx0ICAgKi9cblx0ICBjb25zdHJ1Y3RvcihpdGVtcywgc2V0dGluZ3MpIHtcblx0ICAgIHRoaXMuaXRlbXMgPSB2b2lkIDA7XG5cdCAgICB0aGlzLnNldHRpbmdzID0gdm9pZCAwO1xuXHQgICAgdGhpcy5pdGVtcyA9IGl0ZW1zO1xuXHQgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzIHx8IHtcblx0ICAgICAgZGlhY3JpdGljczogdHJ1ZVxuXHQgICAgfTtcblx0ICB9XG5cblx0ICAvKipcblx0ICAgKiBTcGxpdHMgYSBzZWFyY2ggc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgaW5kaXZpZHVhbFxuXHQgICAqIHJlZ2V4cHMgdG8gYmUgdXNlZCB0byBtYXRjaCByZXN1bHRzLlxuXHQgICAqXG5cdCAgICovXG5cdCAgdG9rZW5pemUocXVlcnksIHJlc3BlY3Rfd29yZF9ib3VuZGFyaWVzLCB3ZWlnaHRzKSB7XG5cdCAgICBpZiAoIXF1ZXJ5IHx8ICFxdWVyeS5sZW5ndGgpIHJldHVybiBbXTtcblx0ICAgIGNvbnN0IHRva2VucyA9IFtdO1xuXHQgICAgY29uc3Qgd29yZHMgPSBxdWVyeS5zcGxpdCgvXFxzKy8pO1xuXHQgICAgdmFyIGZpZWxkX3JlZ2V4O1xuXG5cdCAgICBpZiAod2VpZ2h0cykge1xuXHQgICAgICBmaWVsZF9yZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIE9iamVjdC5rZXlzKHdlaWdodHMpLm1hcChlc2NhcGVfcmVnZXgpLmpvaW4oJ3wnKSArICcpXFw6KC4qKSQnKTtcblx0ICAgIH1cblxuXHQgICAgd29yZHMuZm9yRWFjaCh3b3JkID0+IHtcblx0ICAgICAgbGV0IGZpZWxkX21hdGNoO1xuXHQgICAgICBsZXQgZmllbGQgPSBudWxsO1xuXHQgICAgICBsZXQgcmVnZXggPSBudWxsOyAvLyBsb29rIGZvciBcImZpZWxkOnF1ZXJ5XCIgdG9rZW5zXG5cblx0ICAgICAgaWYgKGZpZWxkX3JlZ2V4ICYmIChmaWVsZF9tYXRjaCA9IHdvcmQubWF0Y2goZmllbGRfcmVnZXgpKSkge1xuXHQgICAgICAgIGZpZWxkID0gZmllbGRfbWF0Y2hbMV07XG5cdCAgICAgICAgd29yZCA9IGZpZWxkX21hdGNoWzJdO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKHdvcmQubGVuZ3RoID4gMCkge1xuXHQgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmRpYWNyaXRpY3MpIHtcblx0ICAgICAgICAgIHJlZ2V4ID0gZ2V0UGF0dGVybih3b3JkKSB8fCBudWxsO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICByZWdleCA9IGVzY2FwZV9yZWdleCh3b3JkKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZiAocmVnZXggJiYgcmVzcGVjdF93b3JkX2JvdW5kYXJpZXMpIHJlZ2V4ID0gXCJcXFxcYlwiICsgcmVnZXg7XG5cdCAgICAgIH1cblxuXHQgICAgICB0b2tlbnMucHVzaCh7XG5cdCAgICAgICAgc3RyaW5nOiB3b3JkLFxuXHQgICAgICAgIHJlZ2V4OiByZWdleCA/IG5ldyBSZWdFeHAocmVnZXgsICdpdScpIDogbnVsbCxcblx0ICAgICAgICBmaWVsZDogZmllbGRcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0ICAgIHJldHVybiB0b2tlbnM7XG5cdCAgfVxuXG5cdCAgLyoqXG5cdCAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIGJlIHVzZWQgdG8gc2NvcmUgaW5kaXZpZHVhbCByZXN1bHRzLlxuXHQgICAqXG5cdCAgICogR29vZCBtYXRjaGVzIHdpbGwgaGF2ZSBhIGhpZ2hlciBzY29yZSB0aGFuIHBvb3IgbWF0Y2hlcy5cblx0ICAgKiBJZiBhbiBpdGVtIGlzIG5vdCBhIG1hdGNoLCAwIHdpbGwgYmUgcmV0dXJuZWQgYnkgdGhlIGZ1bmN0aW9uLlxuXHQgICAqXG5cdCAgICogQHJldHVybnMge1QuU2NvcmVGbn1cblx0ICAgKi9cblx0ICBnZXRTY29yZUZ1bmN0aW9uKHF1ZXJ5LCBvcHRpb25zKSB7XG5cdCAgICB2YXIgc2VhcmNoID0gdGhpcy5wcmVwYXJlU2VhcmNoKHF1ZXJ5LCBvcHRpb25zKTtcblx0ICAgIHJldHVybiB0aGlzLl9nZXRTY29yZUZ1bmN0aW9uKHNlYXJjaCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEByZXR1cm5zIHtULlNjb3JlRm59XG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgX2dldFNjb3JlRnVuY3Rpb24oc2VhcmNoKSB7XG5cdCAgICBjb25zdCB0b2tlbnMgPSBzZWFyY2gudG9rZW5zLFxuXHQgICAgICAgICAgdG9rZW5fY291bnQgPSB0b2tlbnMubGVuZ3RoO1xuXG5cdCAgICBpZiAoIXRva2VuX2NvdW50KSB7XG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuIDA7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cblx0ICAgIGNvbnN0IGZpZWxkcyA9IHNlYXJjaC5vcHRpb25zLmZpZWxkcyxcblx0ICAgICAgICAgIHdlaWdodHMgPSBzZWFyY2gud2VpZ2h0cyxcblx0ICAgICAgICAgIGZpZWxkX2NvdW50ID0gZmllbGRzLmxlbmd0aCxcblx0ICAgICAgICAgIGdldEF0dHJGbiA9IHNlYXJjaC5nZXRBdHRyRm47XG5cblx0ICAgIGlmICghZmllbGRfY291bnQpIHtcblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gMTtcblx0ICAgICAgfTtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogQ2FsY3VsYXRlcyB0aGUgc2NvcmUgb2YgYW4gb2JqZWN0XG5cdCAgICAgKiBhZ2FpbnN0IHRoZSBzZWFyY2ggcXVlcnkuXG5cdCAgICAgKlxuXHQgICAgICovXG5cblxuXHQgICAgY29uc3Qgc2NvcmVPYmplY3QgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmIChmaWVsZF9jb3VudCA9PT0gMSkge1xuXHQgICAgICAgIHJldHVybiBmdW5jdGlvbiAodG9rZW4sIGRhdGEpIHtcblx0ICAgICAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRzWzBdLmZpZWxkO1xuXHQgICAgICAgICAgcmV0dXJuIHNjb3JlVmFsdWUoZ2V0QXR0ckZuKGRhdGEsIGZpZWxkKSwgdG9rZW4sIHdlaWdodHNbZmllbGRdIHx8IDEpO1xuXHQgICAgICAgIH07XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gZnVuY3Rpb24gKHRva2VuLCBkYXRhKSB7XG5cdCAgICAgICAgdmFyIHN1bSA9IDA7IC8vIGlzIHRoZSB0b2tlbiBzcGVjaWZpYyB0byBhIGZpZWxkP1xuXG5cdCAgICAgICAgaWYgKHRva2VuLmZpZWxkKSB7XG5cdCAgICAgICAgICBjb25zdCB2YWx1ZSA9IGdldEF0dHJGbihkYXRhLCB0b2tlbi5maWVsZCk7XG5cblx0ICAgICAgICAgIGlmICghdG9rZW4ucmVnZXggJiYgdmFsdWUpIHtcblx0ICAgICAgICAgICAgc3VtICs9IDEgLyBmaWVsZF9jb3VudDtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHN1bSArPSBzY29yZVZhbHVlKHZhbHVlLCB0b2tlbiwgMSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIGl0ZXJhdGUkMSh3ZWlnaHRzLCAod2VpZ2h0LCBmaWVsZCkgPT4ge1xuXHQgICAgICAgICAgICBzdW0gKz0gc2NvcmVWYWx1ZShnZXRBdHRyRm4oZGF0YSwgZmllbGQpLCB0b2tlbiwgd2VpZ2h0KTtcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBzdW0gLyBmaWVsZF9jb3VudDtcblx0ICAgICAgfTtcblx0ICAgIH0oKTtcblxuXHQgICAgaWYgKHRva2VuX2NvdW50ID09PSAxKSB7XG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSkge1xuXHQgICAgICAgIHJldHVybiBzY29yZU9iamVjdCh0b2tlbnNbMF0sIGRhdGEpO1xuXHQgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICBpZiAoc2VhcmNoLm9wdGlvbnMuY29uanVuY3Rpb24gPT09ICdhbmQnKSB7XG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSkge1xuXHQgICAgICAgIHZhciBzY29yZSxcblx0ICAgICAgICAgICAgc3VtID0gMDtcblxuXHQgICAgICAgIGZvciAobGV0IHRva2VuIG9mIHRva2Vucykge1xuXHQgICAgICAgICAgc2NvcmUgPSBzY29yZU9iamVjdCh0b2tlbiwgZGF0YSk7XG5cdCAgICAgICAgICBpZiAoc2NvcmUgPD0gMCkgcmV0dXJuIDA7XG5cdCAgICAgICAgICBzdW0gKz0gc2NvcmU7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHN1bSAvIHRva2VuX2NvdW50O1xuXHQgICAgICB9O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhKSB7XG5cdCAgICAgICAgdmFyIHN1bSA9IDA7XG5cdCAgICAgICAgaXRlcmF0ZSQxKHRva2VucywgdG9rZW4gPT4ge1xuXHQgICAgICAgICAgc3VtICs9IHNjb3JlT2JqZWN0KHRva2VuLCBkYXRhKTtcblx0ICAgICAgICB9KTtcblx0ICAgICAgICByZXR1cm4gc3VtIC8gdG9rZW5fY291bnQ7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgLyoqXG5cdCAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29tcGFyZSB0d29cblx0ICAgKiByZXN1bHRzLCBmb3Igc29ydGluZyBwdXJwb3Nlcy4gSWYgbm8gc29ydGluZyBzaG91bGRcblx0ICAgKiBiZSBwZXJmb3JtZWQsIGBudWxsYCB3aWxsIGJlIHJldHVybmVkLlxuXHQgICAqXG5cdCAgICogQHJldHVybiBmdW5jdGlvbihhLGIpXG5cdCAgICovXG5cdCAgZ2V0U29ydEZ1bmN0aW9uKHF1ZXJ5LCBvcHRpb25zKSB7XG5cdCAgICB2YXIgc2VhcmNoID0gdGhpcy5wcmVwYXJlU2VhcmNoKHF1ZXJ5LCBvcHRpb25zKTtcblx0ICAgIHJldHVybiB0aGlzLl9nZXRTb3J0RnVuY3Rpb24oc2VhcmNoKTtcblx0ICB9XG5cblx0ICBfZ2V0U29ydEZ1bmN0aW9uKHNlYXJjaCkge1xuXHQgICAgdmFyIGltcGxpY2l0X3Njb3JlLFxuXHQgICAgICAgIHNvcnRfZmxkcyA9IFtdO1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXMsXG5cdCAgICAgICAgICBvcHRpb25zID0gc2VhcmNoLm9wdGlvbnMsXG5cdCAgICAgICAgICBzb3J0ID0gIXNlYXJjaC5xdWVyeSAmJiBvcHRpb25zLnNvcnRfZW1wdHkgPyBvcHRpb25zLnNvcnRfZW1wdHkgOiBvcHRpb25zLnNvcnQ7XG5cblx0ICAgIGlmICh0eXBlb2Ygc29ydCA9PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIHJldHVybiBzb3J0LmJpbmQodGhpcyk7XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIEZldGNoZXMgdGhlIHNwZWNpZmllZCBzb3J0IGZpZWxkIHZhbHVlXG5cdCAgICAgKiBmcm9tIGEgc2VhcmNoIHJlc3VsdCBpdGVtLlxuXHQgICAgICpcblx0ICAgICAqL1xuXG5cblx0ICAgIGNvbnN0IGdldF9maWVsZCA9IGZ1bmN0aW9uIGdldF9maWVsZChuYW1lLCByZXN1bHQpIHtcblx0ICAgICAgaWYgKG5hbWUgPT09ICckc2NvcmUnKSByZXR1cm4gcmVzdWx0LnNjb3JlO1xuXHQgICAgICByZXR1cm4gc2VhcmNoLmdldEF0dHJGbihzZWxmLml0ZW1zW3Jlc3VsdC5pZF0sIG5hbWUpO1xuXHQgICAgfTsgLy8gcGFyc2Ugb3B0aW9uc1xuXG5cblx0ICAgIGlmIChzb3J0KSB7XG5cdCAgICAgIGZvciAobGV0IHMgb2Ygc29ydCkge1xuXHQgICAgICAgIGlmIChzZWFyY2gucXVlcnkgfHwgcy5maWVsZCAhPT0gJyRzY29yZScpIHtcblx0ICAgICAgICAgIHNvcnRfZmxkcy5wdXNoKHMpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSAvLyB0aGUgXCIkc2NvcmVcIiBmaWVsZCBpcyBpbXBsaWVkIHRvIGJlIHRoZSBwcmltYXJ5XG5cdCAgICAvLyBzb3J0IGZpZWxkLCB1bmxlc3MgaXQncyBtYW51YWxseSBzcGVjaWZpZWRcblxuXG5cdCAgICBpZiAoc2VhcmNoLnF1ZXJ5KSB7XG5cdCAgICAgIGltcGxpY2l0X3Njb3JlID0gdHJ1ZTtcblxuXHQgICAgICBmb3IgKGxldCBmbGQgb2Ygc29ydF9mbGRzKSB7XG5cdCAgICAgICAgaWYgKGZsZC5maWVsZCA9PT0gJyRzY29yZScpIHtcblx0ICAgICAgICAgIGltcGxpY2l0X3Njb3JlID0gZmFsc2U7XG5cdCAgICAgICAgICBicmVhaztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoaW1wbGljaXRfc2NvcmUpIHtcblx0ICAgICAgICBzb3J0X2ZsZHMudW5zaGlmdCh7XG5cdCAgICAgICAgICBmaWVsZDogJyRzY29yZScsXG5cdCAgICAgICAgICBkaXJlY3Rpb246ICdkZXNjJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9IC8vIHdpdGhvdXQgYSBzZWFyY2gucXVlcnksIGFsbCBpdGVtcyB3aWxsIGhhdmUgdGhlIHNhbWUgc2NvcmVcblxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc29ydF9mbGRzID0gc29ydF9mbGRzLmZpbHRlcihmbGQgPT4gZmxkLmZpZWxkICE9PSAnJHNjb3JlJyk7XG5cdCAgICB9IC8vIGJ1aWxkIGZ1bmN0aW9uXG5cblxuXHQgICAgY29uc3Qgc29ydF9mbGRzX2NvdW50ID0gc29ydF9mbGRzLmxlbmd0aDtcblxuXHQgICAgaWYgKCFzb3J0X2ZsZHNfY291bnQpIHtcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuXHQgICAgICB2YXIgcmVzdWx0LCBmaWVsZDtcblxuXHQgICAgICBmb3IgKGxldCBzb3J0X2ZsZCBvZiBzb3J0X2ZsZHMpIHtcblx0ICAgICAgICBmaWVsZCA9IHNvcnRfZmxkLmZpZWxkO1xuXHQgICAgICAgIGxldCBtdWx0aXBsaWVyID0gc29ydF9mbGQuZGlyZWN0aW9uID09PSAnZGVzYycgPyAtMSA6IDE7XG5cdCAgICAgICAgcmVzdWx0ID0gbXVsdGlwbGllciAqIGNtcChnZXRfZmllbGQoZmllbGQsIGEpLCBnZXRfZmllbGQoZmllbGQsIGIpKTtcblx0ICAgICAgICBpZiAocmVzdWx0KSByZXR1cm4gcmVzdWx0O1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIDA7XG5cdCAgICB9O1xuXHQgIH1cblxuXHQgIC8qKlxuXHQgICAqIFBhcnNlcyBhIHNlYXJjaCBxdWVyeSBhbmQgcmV0dXJucyBhbiBvYmplY3Rcblx0ICAgKiB3aXRoIHRva2VucyBhbmQgZmllbGRzIHJlYWR5IHRvIGJlIHBvcHVsYXRlZFxuXHQgICAqIHdpdGggcmVzdWx0cy5cblx0ICAgKlxuXHQgICAqL1xuXHQgIHByZXBhcmVTZWFyY2gocXVlcnksIG9wdHNVc2VyKSB7XG5cdCAgICBjb25zdCB3ZWlnaHRzID0ge307XG5cdCAgICB2YXIgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdHNVc2VyKTtcblx0ICAgIHByb3BUb0FycmF5KG9wdGlvbnMsICdzb3J0Jyk7XG5cdCAgICBwcm9wVG9BcnJheShvcHRpb25zLCAnc29ydF9lbXB0eScpOyAvLyBjb252ZXJ0IGZpZWxkcyB0byBuZXcgZm9ybWF0XG5cblx0ICAgIGlmIChvcHRpb25zLmZpZWxkcykge1xuXHQgICAgICBwcm9wVG9BcnJheShvcHRpb25zLCAnZmllbGRzJyk7XG5cdCAgICAgIGNvbnN0IGZpZWxkcyA9IFtdO1xuXHQgICAgICBvcHRpb25zLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcblx0ICAgICAgICBpZiAodHlwZW9mIGZpZWxkID09ICdzdHJpbmcnKSB7XG5cdCAgICAgICAgICBmaWVsZCA9IHtcblx0ICAgICAgICAgICAgZmllbGQ6IGZpZWxkLFxuXHQgICAgICAgICAgICB3ZWlnaHQ6IDFcblx0ICAgICAgICAgIH07XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuXHQgICAgICAgIHdlaWdodHNbZmllbGQuZmllbGRdID0gJ3dlaWdodCcgaW4gZmllbGQgPyBmaWVsZC53ZWlnaHQgOiAxO1xuXHQgICAgICB9KTtcblx0ICAgICAgb3B0aW9ucy5maWVsZHMgPSBmaWVsZHM7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB7XG5cdCAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG5cdCAgICAgIHF1ZXJ5OiBxdWVyeS50b0xvd2VyQ2FzZSgpLnRyaW0oKSxcblx0ICAgICAgdG9rZW5zOiB0aGlzLnRva2VuaXplKHF1ZXJ5LCBvcHRpb25zLnJlc3BlY3Rfd29yZF9ib3VuZGFyaWVzLCB3ZWlnaHRzKSxcblx0ICAgICAgdG90YWw6IDAsXG5cdCAgICAgIGl0ZW1zOiBbXSxcblx0ICAgICAgd2VpZ2h0czogd2VpZ2h0cyxcblx0ICAgICAgZ2V0QXR0ckZuOiBvcHRpb25zLm5lc3RpbmcgPyBnZXRBdHRyTmVzdGluZyA6IGdldEF0dHJcblx0ICAgIH07XG5cdCAgfVxuXG5cdCAgLyoqXG5cdCAgICogU2VhcmNoZXMgdGhyb3VnaCBhbGwgaXRlbXMgYW5kIHJldHVybnMgYSBzb3J0ZWQgYXJyYXkgb2YgbWF0Y2hlcy5cblx0ICAgKlxuXHQgICAqL1xuXHQgIHNlYXJjaChxdWVyeSwgb3B0aW9ucykge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzLFxuXHQgICAgICAgIHNjb3JlLFxuXHQgICAgICAgIHNlYXJjaDtcblx0ICAgIHNlYXJjaCA9IHRoaXMucHJlcGFyZVNlYXJjaChxdWVyeSwgb3B0aW9ucyk7XG5cdCAgICBvcHRpb25zID0gc2VhcmNoLm9wdGlvbnM7XG5cdCAgICBxdWVyeSA9IHNlYXJjaC5xdWVyeTsgLy8gZ2VuZXJhdGUgcmVzdWx0IHNjb3JpbmcgZnVuY3Rpb25cblxuXHQgICAgY29uc3QgZm5fc2NvcmUgPSBvcHRpb25zLnNjb3JlIHx8IHNlbGYuX2dldFNjb3JlRnVuY3Rpb24oc2VhcmNoKTsgLy8gcGVyZm9ybSBzZWFyY2ggYW5kIHNvcnRcblxuXG5cdCAgICBpZiAocXVlcnkubGVuZ3RoKSB7XG5cdCAgICAgIGl0ZXJhdGUkMShzZWxmLml0ZW1zLCAoaXRlbSwgaWQpID0+IHtcblx0ICAgICAgICBzY29yZSA9IGZuX3Njb3JlKGl0ZW0pO1xuXG5cdCAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyID09PSBmYWxzZSB8fCBzY29yZSA+IDApIHtcblx0ICAgICAgICAgIHNlYXJjaC5pdGVtcy5wdXNoKHtcblx0ICAgICAgICAgICAgJ3Njb3JlJzogc2NvcmUsXG5cdCAgICAgICAgICAgICdpZCc6IGlkXG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaXRlcmF0ZSQxKHNlbGYuaXRlbXMsIChfLCBpZCkgPT4ge1xuXHQgICAgICAgIHNlYXJjaC5pdGVtcy5wdXNoKHtcblx0ICAgICAgICAgICdzY29yZSc6IDEsXG5cdCAgICAgICAgICAnaWQnOiBpZFxuXHQgICAgICAgIH0pO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgY29uc3QgZm5fc29ydCA9IHNlbGYuX2dldFNvcnRGdW5jdGlvbihzZWFyY2gpO1xuXG5cdCAgICBpZiAoZm5fc29ydCkgc2VhcmNoLml0ZW1zLnNvcnQoZm5fc29ydCk7IC8vIGFwcGx5IGxpbWl0c1xuXG5cdCAgICBzZWFyY2gudG90YWwgPSBzZWFyY2guaXRlbXMubGVuZ3RoO1xuXG5cdCAgICBpZiAodHlwZW9mIG9wdGlvbnMubGltaXQgPT09ICdudW1iZXInKSB7XG5cdCAgICAgIHNlYXJjaC5pdGVtcyA9IHNlYXJjaC5pdGVtcy5zbGljZSgwLCBvcHRpb25zLmxpbWl0KTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHNlYXJjaDtcblx0ICB9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBJdGVyYXRlcyBvdmVyIGFycmF5cyBhbmQgaGFzaGVzLlxuXHQgKlxuXHQgKiBgYGBcblx0ICogaXRlcmF0ZSh0aGlzLml0ZW1zLCBmdW5jdGlvbihpdGVtLCBpZCkge1xuXHQgKiAgICAvLyBpbnZva2VkIGZvciBlYWNoIGl0ZW1cblx0ICogfSk7XG5cdCAqIGBgYFxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBpdGVyYXRlID0gKG9iamVjdCwgY2FsbGJhY2spID0+IHtcblx0ICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG5cdCAgICBvYmplY3QuZm9yRWFjaChjYWxsYmFjayk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcblx0ICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdCAgICAgICAgY2FsbGJhY2sob2JqZWN0W2tleV0sIGtleSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdH07XG5cblx0LyoqXG5cdCAqIFJldHVybiBhIGRvbSBlbGVtZW50IGZyb20gZWl0aGVyIGEgZG9tIHF1ZXJ5IHN0cmluZywgalF1ZXJ5IG9iamVjdCwgYSBkb20gZWxlbWVudCBvciBodG1sIHN0cmluZ1xuXHQgKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTQxNDMvY3JlYXRpbmctYS1uZXctZG9tLWVsZW1lbnQtZnJvbS1hbi1odG1sLXN0cmluZy11c2luZy1idWlsdC1pbi1kb20tbWV0aG9kcy1vci1wcm8vMzUzODU1MTgjMzUzODU1MThcblx0ICpcblx0ICogcGFyYW0gcXVlcnkgc2hvdWxkIGJlIHt9XG5cdCAqL1xuXG5cdGNvbnN0IGdldERvbSA9IHF1ZXJ5ID0+IHtcblx0ICBpZiAocXVlcnkuanF1ZXJ5KSB7XG5cdCAgICByZXR1cm4gcXVlcnlbMF07XG5cdCAgfVxuXG5cdCAgaWYgKHF1ZXJ5IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcblx0ICAgIHJldHVybiBxdWVyeTtcblx0ICB9XG5cblx0ICBpZiAoaXNIdG1sU3RyaW5nKHF1ZXJ5KSkge1xuXHQgICAgdmFyIHRwbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cdCAgICB0cGwuaW5uZXJIVE1MID0gcXVlcnkudHJpbSgpOyAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG5cblx0ICAgIHJldHVybiB0cGwuY29udGVudC5maXJzdENoaWxkO1xuXHQgIH1cblxuXHQgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHF1ZXJ5KTtcblx0fTtcblx0Y29uc3QgaXNIdG1sU3RyaW5nID0gYXJnID0+IHtcblx0ICBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgJiYgYXJnLmluZGV4T2YoJzwnKSA+IC0xKSB7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cblx0ICByZXR1cm4gZmFsc2U7XG5cdH07XG5cdGNvbnN0IGVzY2FwZVF1ZXJ5ID0gcXVlcnkgPT4ge1xuXHQgIHJldHVybiBxdWVyeS5yZXBsYWNlKC9bJ1wiXFxcXF0vZywgJ1xcXFwkJicpO1xuXHR9O1xuXHQvKipcblx0ICogRGlzcGF0Y2ggYW4gZXZlbnRcblx0ICpcblx0ICovXG5cblx0Y29uc3QgdHJpZ2dlckV2ZW50ID0gKGRvbV9lbCwgZXZlbnRfbmFtZSkgPT4ge1xuXHQgIHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdCAgZXZlbnQuaW5pdEV2ZW50KGV2ZW50X25hbWUsIHRydWUsIGZhbHNlKTtcblx0ICBkb21fZWwuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH07XG5cdC8qKlxuXHQgKiBBcHBseSBDU1MgcnVsZXMgdG8gYSBkb20gZWxlbWVudFxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBhcHBseUNTUyA9IChkb21fZWwsIGNzcykgPT4ge1xuXHQgIE9iamVjdC5hc3NpZ24oZG9tX2VsLnN0eWxlLCBjc3MpO1xuXHR9O1xuXHQvKipcblx0ICogQWRkIGNzcyBjbGFzc2VzXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGFkZENsYXNzZXMgPSAoZWxtdHMsIC4uLmNsYXNzZXMpID0+IHtcblx0ICB2YXIgbm9ybV9jbGFzc2VzID0gY2xhc3Nlc0FycmF5KGNsYXNzZXMpO1xuXHQgIGVsbXRzID0gY2FzdEFzQXJyYXkoZWxtdHMpO1xuXHQgIGVsbXRzLm1hcChlbCA9PiB7XG5cdCAgICBub3JtX2NsYXNzZXMubWFwKGNscyA9PiB7XG5cdCAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xzKTtcblx0ICAgIH0pO1xuXHQgIH0pO1xuXHR9O1xuXHQvKipcblx0ICogUmVtb3ZlIGNzcyBjbGFzc2VzXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IHJlbW92ZUNsYXNzZXMgPSAoZWxtdHMsIC4uLmNsYXNzZXMpID0+IHtcblx0ICB2YXIgbm9ybV9jbGFzc2VzID0gY2xhc3Nlc0FycmF5KGNsYXNzZXMpO1xuXHQgIGVsbXRzID0gY2FzdEFzQXJyYXkoZWxtdHMpO1xuXHQgIGVsbXRzLm1hcChlbCA9PiB7XG5cdCAgICBub3JtX2NsYXNzZXMubWFwKGNscyA9PiB7XG5cdCAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcblx0ICAgIH0pO1xuXHQgIH0pO1xuXHR9O1xuXHQvKipcblx0ICogUmV0dXJuIGFyZ3VtZW50c1xuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBjbGFzc2VzQXJyYXkgPSBhcmdzID0+IHtcblx0ICB2YXIgY2xhc3NlcyA9IFtdO1xuXHQgIGl0ZXJhdGUoYXJncywgX2NsYXNzZXMgPT4ge1xuXHQgICAgaWYgKHR5cGVvZiBfY2xhc3NlcyA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgX2NsYXNzZXMgPSBfY2xhc3Nlcy50cmltKCkuc3BsaXQoL1tcXDExXFwxMlxcMTRcXDE1XFw0MF0vKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKEFycmF5LmlzQXJyYXkoX2NsYXNzZXMpKSB7XG5cdCAgICAgIGNsYXNzZXMgPSBjbGFzc2VzLmNvbmNhdChfY2xhc3Nlcyk7XG5cdCAgICB9XG5cdCAgfSk7XG5cdCAgcmV0dXJuIGNsYXNzZXMuZmlsdGVyKEJvb2xlYW4pO1xuXHR9O1xuXHQvKipcblx0ICogQ3JlYXRlIGFuIGFycmF5IGZyb20gYXJnIGlmIGl0J3Mgbm90IGFscmVhZHkgYW4gYXJyYXlcblx0ICpcblx0ICovXG5cblx0Y29uc3QgY2FzdEFzQXJyYXkgPSBhcmcgPT4ge1xuXHQgIGlmICghQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdCAgICBhcmcgPSBbYXJnXTtcblx0ICB9XG5cblx0ICByZXR1cm4gYXJnO1xuXHR9O1xuXHQvKipcblx0ICogR2V0IHRoZSBjbG9zZXN0IG5vZGUgdG8gdGhlIGV2dC50YXJnZXQgbWF0Y2hpbmcgdGhlIHNlbGVjdG9yXG5cdCAqIFN0b3BzIGF0IHdyYXBwZXJcblx0ICpcblx0ICovXG5cblx0Y29uc3QgcGFyZW50TWF0Y2ggPSAodGFyZ2V0LCBzZWxlY3Rvciwgd3JhcHBlcikgPT4ge1xuXHQgIGlmICh3cmFwcGVyICYmICF3cmFwcGVyLmNvbnRhaW5zKHRhcmdldCkpIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cblx0ICB3aGlsZSAodGFyZ2V0ICYmIHRhcmdldC5tYXRjaGVzKSB7XG5cdCAgICBpZiAodGFyZ2V0Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdCAgICAgIHJldHVybiB0YXJnZXQ7XG5cdCAgICB9XG5cblx0ICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuXHQgIH1cblx0fTtcblx0LyoqXG5cdCAqIEdldCB0aGUgZmlyc3Qgb3IgbGFzdCBpdGVtIGZyb20gYW4gYXJyYXlcblx0ICpcblx0ICogPiAwIC0gcmlnaHQgKGxhc3QpXG5cdCAqIDw9IDAgLSBsZWZ0IChmaXJzdClcblx0ICpcblx0ICovXG5cblx0Y29uc3QgZ2V0VGFpbCA9IChsaXN0LCBkaXJlY3Rpb24gPSAwKSA9PiB7XG5cdCAgaWYgKGRpcmVjdGlvbiA+IDApIHtcblx0ICAgIHJldHVybiBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGxpc3RbMF07XG5cdH07XG5cdC8qKlxuXHQgKiBSZXR1cm4gdHJ1ZSBpZiBhbiBvYmplY3QgaXMgZW1wdHlcblx0ICpcblx0ICovXG5cblx0Y29uc3QgaXNFbXB0eU9iamVjdCA9IG9iaiA9PiB7XG5cdCAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xuXHR9O1xuXHQvKipcblx0ICogR2V0IHRoZSBpbmRleCBvZiBhbiBlbGVtZW50IGFtb25nc3Qgc2libGluZyBub2RlcyBvZiB0aGUgc2FtZSB0eXBlXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IG5vZGVJbmRleCA9IChlbCwgYW1vbmdzdCkgPT4ge1xuXHQgIGlmICghZWwpIHJldHVybiAtMTtcblx0ICBhbW9uZ3N0ID0gYW1vbmdzdCB8fCBlbC5ub2RlTmFtZTtcblx0ICB2YXIgaSA9IDA7XG5cblx0ICB3aGlsZSAoZWwgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSB7XG5cdCAgICBpZiAoZWwubWF0Y2hlcyhhbW9uZ3N0KSkge1xuXHQgICAgICBpKys7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGk7XG5cdH07XG5cdC8qKlxuXHQgKiBTZXQgYXR0cmlidXRlcyBvZiBhbiBlbGVtZW50XG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IHNldEF0dHIgPSAoZWwsIGF0dHJzKSA9PiB7XG5cdCAgaXRlcmF0ZShhdHRycywgKHZhbCwgYXR0cikgPT4ge1xuXHQgICAgaWYgKHZhbCA9PSBudWxsKSB7XG5cdCAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyLCAnJyArIHZhbCk7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH07XG5cdC8qKlxuXHQgKiBSZXBsYWNlIGEgbm9kZVxuXHQgKi9cblxuXHRjb25zdCByZXBsYWNlTm9kZSA9IChleGlzdGluZywgcmVwbGFjZW1lbnQpID0+IHtcblx0ICBpZiAoZXhpc3RpbmcucGFyZW50Tm9kZSkgZXhpc3RpbmcucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocmVwbGFjZW1lbnQsIGV4aXN0aW5nKTtcblx0fTtcblxuXHQvKipcblx0ICogaGlnaGxpZ2h0IHYzIHwgTUlUIGxpY2Vuc2UgfCBKb2hhbm4gQnVya2FyZCA8amJAZWFpby5jb20+XG5cdCAqIEhpZ2hsaWdodHMgYXJiaXRyYXJ5IHRlcm1zIGluIGEgbm9kZS5cblx0ICpcblx0ICogLSBNb2RpZmllZCBieSBNYXJzaGFsIDxiZWF0Z2F0ZXNAZ21haWwuY29tPiAyMDExLTYtMjQgKGFkZGVkIHJlZ2V4KVxuXHQgKiAtIE1vZGlmaWVkIGJ5IEJyaWFuIFJlYXZpcyA8YnJpYW5AdGhpcmRyb3V0ZS5jb20+IDIwMTItOC0yNyAoY2xlYW51cClcblx0ICovXG5cdGNvbnN0IGhpZ2hsaWdodCA9IChlbGVtZW50LCByZWdleCkgPT4ge1xuXHQgIGlmIChyZWdleCA9PT0gbnVsbCkgcmV0dXJuOyAvLyBjb252ZXQgc3RyaW5nIHRvIHJlZ2V4XG5cblx0ICBpZiAodHlwZW9mIHJlZ2V4ID09PSAnc3RyaW5nJykge1xuXHQgICAgaWYgKCFyZWdleC5sZW5ndGgpIHJldHVybjtcblx0ICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleCwgJ2knKTtcblx0ICB9IC8vIFdyYXAgbWF0Y2hpbmcgcGFydCBvZiB0ZXh0IG5vZGUgd2l0aCBoaWdobGlnaHRpbmcgPHNwYW4+LCBlLmcuXG5cdCAgLy8gU29jY2VyICAtPiAgPHNwYW4gY2xhc3M9XCJoaWdobGlnaHRcIj5Tb2M8L3NwYW4+Y2VyICBmb3IgcmVnZXggPSAvc29jL2lcblxuXG5cdCAgY29uc3QgaGlnaGxpZ2h0VGV4dCA9IG5vZGUgPT4ge1xuXHQgICAgdmFyIG1hdGNoID0gbm9kZS5kYXRhLm1hdGNoKHJlZ2V4KTtcblxuXHQgICAgaWYgKG1hdGNoICYmIG5vZGUuZGF0YS5sZW5ndGggPiAwKSB7XG5cdCAgICAgIHZhciBzcGFubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0ICAgICAgc3Bhbm5vZGUuY2xhc3NOYW1lID0gJ2hpZ2hsaWdodCc7XG5cdCAgICAgIHZhciBtaWRkbGViaXQgPSBub2RlLnNwbGl0VGV4dChtYXRjaC5pbmRleCk7XG5cdCAgICAgIG1pZGRsZWJpdC5zcGxpdFRleHQobWF0Y2hbMF0ubGVuZ3RoKTtcblx0ICAgICAgdmFyIG1pZGRsZWNsb25lID0gbWlkZGxlYml0LmNsb25lTm9kZSh0cnVlKTtcblx0ICAgICAgc3Bhbm5vZGUuYXBwZW5kQ2hpbGQobWlkZGxlY2xvbmUpO1xuXHQgICAgICByZXBsYWNlTm9kZShtaWRkbGViaXQsIHNwYW5ub2RlKTtcblx0ICAgICAgcmV0dXJuIDE7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiAwO1xuXHQgIH07IC8vIFJlY3Vyc2UgZWxlbWVudCBub2RlLCBsb29raW5nIGZvciBjaGlsZCB0ZXh0IG5vZGVzIHRvIGhpZ2hsaWdodCwgdW5sZXNzIGVsZW1lbnRcblx0ICAvLyBpcyBjaGlsZGxlc3MsIDxzY3JpcHQ+LCA8c3R5bGU+LCBvciBhbHJlYWR5IGhpZ2hsaWdodGVkOiA8c3BhbiBjbGFzcz1cImhpZ2h0bGlnaHRcIj5cblxuXG5cdCAgY29uc3QgaGlnaGxpZ2h0Q2hpbGRyZW4gPSBub2RlID0+IHtcblx0ICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxICYmIG5vZGUuY2hpbGROb2RlcyAmJiAhLyhzY3JpcHR8c3R5bGUpL2kudGVzdChub2RlLnRhZ05hbWUpICYmIChub2RlLmNsYXNzTmFtZSAhPT0gJ2hpZ2hsaWdodCcgfHwgbm9kZS50YWdOYW1lICE9PSAnU1BBTicpKSB7XG5cdCAgICAgIEFycmF5LmZyb20obm9kZS5jaGlsZE5vZGVzKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuXHQgICAgICAgIGhpZ2hsaWdodFJlY3Vyc2l2ZShlbGVtZW50KTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIGNvbnN0IGhpZ2hsaWdodFJlY3Vyc2l2ZSA9IG5vZGUgPT4ge1xuXHQgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcblx0ICAgICAgcmV0dXJuIGhpZ2hsaWdodFRleHQobm9kZSk7XG5cdCAgICB9XG5cblx0ICAgIGhpZ2hsaWdodENoaWxkcmVuKG5vZGUpO1xuXHQgICAgcmV0dXJuIDA7XG5cdCAgfTtcblxuXHQgIGhpZ2hsaWdodFJlY3Vyc2l2ZShlbGVtZW50KTtcblx0fTtcblx0LyoqXG5cdCAqIHJlbW92ZUhpZ2hsaWdodCBmbiBjb3BpZWQgZnJvbSBoaWdobGlnaHQgdjUgYW5kXG5cdCAqIGVkaXRlZCB0byByZW1vdmUgd2l0aCgpLCBwYXNzIGpzIHN0cmljdCBtb2RlLCBhbmQgdXNlIHdpdGhvdXQganF1ZXJ5XG5cdCAqL1xuXG5cdGNvbnN0IHJlbW92ZUhpZ2hsaWdodCA9IGVsID0+IHtcblx0ICB2YXIgZWxlbWVudHMgPSBlbC5xdWVyeVNlbGVjdG9yQWxsKFwic3Bhbi5oaWdobGlnaHRcIik7XG5cdCAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChlbGVtZW50cywgZnVuY3Rpb24gKGVsKSB7XG5cdCAgICB2YXIgcGFyZW50ID0gZWwucGFyZW50Tm9kZTtcblx0ICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQoZWwuZmlyc3RDaGlsZCwgZWwpO1xuXHQgICAgcGFyZW50Lm5vcm1hbGl6ZSgpO1xuXHQgIH0pO1xuXHR9O1xuXG5cdGNvbnN0IEtFWV9BID0gNjU7XG5cdGNvbnN0IEtFWV9SRVRVUk4gPSAxMztcblx0Y29uc3QgS0VZX0VTQyA9IDI3O1xuXHRjb25zdCBLRVlfTEVGVCA9IDM3O1xuXHRjb25zdCBLRVlfVVAgPSAzODtcblx0Y29uc3QgS0VZX1JJR0hUID0gMzk7XG5cdGNvbnN0IEtFWV9ET1dOID0gNDA7XG5cdGNvbnN0IEtFWV9CQUNLU1BBQ0UgPSA4O1xuXHRjb25zdCBLRVlfREVMRVRFID0gNDY7XG5cdGNvbnN0IEtFWV9UQUIgPSA5O1xuXHRjb25zdCBJU19NQUMgPSB0eXBlb2YgbmF2aWdhdG9yID09PSAndW5kZWZpbmVkJyA/IGZhbHNlIDogL01hYy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblx0Y29uc3QgS0VZX1NIT1JUQ1VUID0gSVNfTUFDID8gJ21ldGFLZXknIDogJ2N0cmxLZXknOyAvLyBjdHJsIGtleSBvciBhcHBsZSBrZXkgZm9yIG1hXG5cblx0dmFyIGRlZmF1bHRzID0ge1xuXHQgIG9wdGlvbnM6IFtdLFxuXHQgIG9wdGdyb3VwczogW10sXG5cdCAgcGx1Z2luczogW10sXG5cdCAgZGVsaW1pdGVyOiAnLCcsXG5cdCAgc3BsaXRPbjogbnVsbCxcblx0ICAvLyByZWdleHAgb3Igc3RyaW5nIGZvciBzcGxpdHRpbmcgdXAgdmFsdWVzIGZyb20gYSBwYXN0ZSBjb21tYW5kXG5cdCAgcGVyc2lzdDogdHJ1ZSxcblx0ICBkaWFjcml0aWNzOiB0cnVlLFxuXHQgIGNyZWF0ZTogbnVsbCxcblx0ICBjcmVhdGVPbkJsdXI6IGZhbHNlLFxuXHQgIGNyZWF0ZUZpbHRlcjogbnVsbCxcblx0ICBoaWdobGlnaHQ6IHRydWUsXG5cdCAgb3Blbk9uRm9jdXM6IHRydWUsXG5cdCAgc2hvdWxkT3BlbjogbnVsbCxcblx0ICBtYXhPcHRpb25zOiA1MCxcblx0ICBtYXhJdGVtczogbnVsbCxcblx0ICBoaWRlU2VsZWN0ZWQ6IG51bGwsXG5cdCAgZHVwbGljYXRlczogZmFsc2UsXG5cdCAgYWRkUHJlY2VkZW5jZTogZmFsc2UsXG5cdCAgc2VsZWN0T25UYWI6IGZhbHNlLFxuXHQgIHByZWxvYWQ6IG51bGwsXG5cdCAgYWxsb3dFbXB0eU9wdGlvbjogZmFsc2UsXG5cdCAgLy9jbG9zZUFmdGVyU2VsZWN0OiBmYWxzZSxcblx0ICBsb2FkVGhyb3R0bGU6IDMwMCxcblx0ICBsb2FkaW5nQ2xhc3M6ICdsb2FkaW5nJyxcblx0ICBkYXRhQXR0cjogbnVsbCxcblx0ICAvLydkYXRhLWRhdGEnLFxuXHQgIG9wdGdyb3VwRmllbGQ6ICdvcHRncm91cCcsXG5cdCAgdmFsdWVGaWVsZDogJ3ZhbHVlJyxcblx0ICBsYWJlbEZpZWxkOiAndGV4dCcsXG5cdCAgZGlzYWJsZWRGaWVsZDogJ2Rpc2FibGVkJyxcblx0ICBvcHRncm91cExhYmVsRmllbGQ6ICdsYWJlbCcsXG5cdCAgb3B0Z3JvdXBWYWx1ZUZpZWxkOiAndmFsdWUnLFxuXHQgIGxvY2tPcHRncm91cE9yZGVyOiBmYWxzZSxcblx0ICBzb3J0RmllbGQ6ICckb3JkZXInLFxuXHQgIHNlYXJjaEZpZWxkOiBbJ3RleHQnXSxcblx0ICBzZWFyY2hDb25qdW5jdGlvbjogJ2FuZCcsXG5cdCAgbW9kZTogbnVsbCxcblx0ICB3cmFwcGVyQ2xhc3M6ICd0cy13cmFwcGVyJyxcblx0ICBjb250cm9sQ2xhc3M6ICd0cy1jb250cm9sJyxcblx0ICBkcm9wZG93bkNsYXNzOiAndHMtZHJvcGRvd24nLFxuXHQgIGRyb3Bkb3duQ29udGVudENsYXNzOiAndHMtZHJvcGRvd24tY29udGVudCcsXG5cdCAgaXRlbUNsYXNzOiAnaXRlbScsXG5cdCAgb3B0aW9uQ2xhc3M6ICdvcHRpb24nLFxuXHQgIGRyb3Bkb3duUGFyZW50OiBudWxsLFxuXHQgIGNvbnRyb2xJbnB1dDogJzxpbnB1dCB0eXBlPVwidGV4dFwiIGF1dG9jb21wbGV0ZT1cIm9mZlwiIHNpemU9XCIxXCIgLz4nLFxuXHQgIGNvcHlDbGFzc2VzVG9Ecm9wZG93bjogZmFsc2UsXG5cdCAgcGxhY2Vob2xkZXI6IG51bGwsXG5cdCAgaGlkZVBsYWNlaG9sZGVyOiBudWxsLFxuXHQgIHNob3VsZExvYWQ6IGZ1bmN0aW9uIChxdWVyeSkge1xuXHQgICAgcmV0dXJuIHF1ZXJ5Lmxlbmd0aCA+IDA7XG5cdCAgfSxcblxuXHQgIC8qXG5cdCAgbG9hZCAgICAgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbihxdWVyeSwgY2FsbGJhY2spIHsgLi4uIH1cblx0ICBzY29yZSAgICAgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHNlYXJjaCkgeyAuLi4gfVxuXHQgIG9uSW5pdGlhbGl6ZSAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oKSB7IC4uLiB9XG5cdCAgb25DaGFuZ2UgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbih2YWx1ZSkgeyAuLi4gfVxuXHQgIG9uSXRlbUFkZCAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUsICRpdGVtKSB7IC4uLiB9XG5cdCAgb25JdGVtUmVtb3ZlICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbih2YWx1ZSkgeyAuLi4gfVxuXHQgIG9uQ2xlYXIgICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oKSB7IC4uLiB9XG5cdCAgb25PcHRpb25BZGQgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbih2YWx1ZSwgZGF0YSkgeyAuLi4gfVxuXHQgIG9uT3B0aW9uUmVtb3ZlICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUpIHsgLi4uIH1cblx0ICBvbk9wdGlvbkNsZWFyICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKCkgeyAuLi4gfVxuXHQgIG9uT3B0aW9uR3JvdXBBZGQgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oaWQsIGRhdGEpIHsgLi4uIH1cblx0ICBvbk9wdGlvbkdyb3VwUmVtb3ZlICA6IG51bGwsIC8vIGZ1bmN0aW9uKGlkKSB7IC4uLiB9XG5cdCAgb25PcHRpb25Hcm91cENsZWFyICAgOiBudWxsLCAvLyBmdW5jdGlvbigpIHsgLi4uIH1cblx0ICBvbkRyb3Bkb3duT3BlbiAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKGRyb3Bkb3duKSB7IC4uLiB9XG5cdCAgb25Ecm9wZG93bkNsb3NlICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbihkcm9wZG93bikgeyAuLi4gfVxuXHQgIG9uVHlwZSAgICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oc3RyKSB7IC4uLiB9XG5cdCAgb25EZWxldGUgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbih2YWx1ZXMpIHsgLi4uIH1cblx0ICAqL1xuXHQgIHJlbmRlcjoge1xuXHQgICAgLypcblx0ICAgIGl0ZW06IG51bGwsXG5cdCAgICBvcHRncm91cDogbnVsbCxcblx0ICAgIG9wdGdyb3VwX2hlYWRlcjogbnVsbCxcblx0ICAgIG9wdGlvbjogbnVsbCxcblx0ICAgIG9wdGlvbl9jcmVhdGU6IG51bGxcblx0ICAgICovXG5cdCAgfVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIHNjYWxhciB0byBpdHMgYmVzdCBzdHJpbmcgcmVwcmVzZW50YXRpb25cblx0ICogZm9yIGhhc2gga2V5cyBhbmQgSFRNTCBhdHRyaWJ1dGUgdmFsdWVzLlxuXHQgKlxuXHQgKiBUcmFuc2Zvcm1hdGlvbnM6XG5cdCAqICAgJ3N0cicgICAgIC0+ICdzdHInXG5cdCAqICAgbnVsbCAgICAgIC0+ICcnXG5cdCAqICAgdW5kZWZpbmVkIC0+ICcnXG5cdCAqICAgdHJ1ZSAgICAgIC0+ICcxJ1xuXHQgKiAgIGZhbHNlICAgICAtPiAnMCdcblx0ICogICAwICAgICAgICAgLT4gJzAnXG5cdCAqICAgMSAgICAgICAgIC0+ICcxJ1xuXHQgKlxuXHQgKi9cblx0Y29uc3QgaGFzaF9rZXkgPSB2YWx1ZSA9PiB7XG5cdCAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybiBudWxsO1xuXHQgIHJldHVybiBnZXRfaGFzaCh2YWx1ZSk7XG5cdH07XG5cdGNvbnN0IGdldF9oYXNoID0gdmFsdWUgPT4ge1xuXHQgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykgcmV0dXJuIHZhbHVlID8gJzEnIDogJzAnO1xuXHQgIHJldHVybiB2YWx1ZSArICcnO1xuXHR9O1xuXHQvKipcblx0ICogRXNjYXBlcyBhIHN0cmluZyBmb3IgdXNlIHdpdGhpbiBIVE1MLlxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBlc2NhcGVfaHRtbCA9IHN0ciA9PiB7XG5cdCAgcmV0dXJuIChzdHIgKyAnJykucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcblx0fTtcblx0LyoqXG5cdCAqIERlYm91bmNlIHRoZSB1c2VyIHByb3ZpZGVkIGxvYWQgZnVuY3Rpb25cblx0ICpcblx0ICovXG5cblx0Y29uc3QgbG9hZERlYm91bmNlID0gKGZuLCBkZWxheSkgPT4ge1xuXHQgIHZhciB0aW1lb3V0O1xuXHQgIHJldHVybiBmdW5jdGlvbiAodmFsdWUsIGNhbGxiYWNrKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cblx0ICAgIGlmICh0aW1lb3V0KSB7XG5cdCAgICAgIHNlbGYubG9hZGluZyA9IE1hdGgubWF4KHNlbGYubG9hZGluZyAtIDEsIDApO1xuXHQgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdCAgICB9XG5cblx0ICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0ICAgICAgdGltZW91dCA9IG51bGw7XG5cdCAgICAgIHNlbGYubG9hZGVkU2VhcmNoZXNbdmFsdWVdID0gdHJ1ZTtcblx0ICAgICAgZm4uY2FsbChzZWxmLCB2YWx1ZSwgY2FsbGJhY2spO1xuXHQgICAgfSwgZGVsYXkpO1xuXHQgIH07XG5cdH07XG5cdC8qKlxuXHQgKiBEZWJvdW5jZSBhbGwgZmlyZWQgZXZlbnRzIHR5cGVzIGxpc3RlZCBpbiBgdHlwZXNgXG5cdCAqIHdoaWxlIGV4ZWN1dGluZyB0aGUgcHJvdmlkZWQgYGZuYC5cblx0ICpcblx0ICovXG5cblx0Y29uc3QgZGVib3VuY2VfZXZlbnRzID0gKHNlbGYsIHR5cGVzLCBmbikgPT4ge1xuXHQgIHZhciB0eXBlO1xuXHQgIHZhciB0cmlnZ2VyID0gc2VsZi50cmlnZ2VyO1xuXHQgIHZhciBldmVudF9hcmdzID0ge307IC8vIG92ZXJyaWRlIHRyaWdnZXIgbWV0aG9kXG5cblx0ICBzZWxmLnRyaWdnZXIgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgdHlwZSA9IGFyZ3VtZW50c1swXTtcblxuXHQgICAgaWYgKHR5cGVzLmluZGV4T2YodHlwZSkgIT09IC0xKSB7XG5cdCAgICAgIGV2ZW50X2FyZ3NbdHlwZV0gPSBhcmd1bWVudHM7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gdHJpZ2dlci5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHQgICAgfVxuXHQgIH07IC8vIGludm9rZSBwcm92aWRlZCBmdW5jdGlvblxuXG5cblx0ICBmbi5hcHBseShzZWxmLCBbXSk7XG5cdCAgc2VsZi50cmlnZ2VyID0gdHJpZ2dlcjsgLy8gdHJpZ2dlciBxdWV1ZWQgZXZlbnRzXG5cblx0ICBmb3IgKHR5cGUgb2YgdHlwZXMpIHtcblx0ICAgIGlmICh0eXBlIGluIGV2ZW50X2FyZ3MpIHtcblx0ICAgICAgdHJpZ2dlci5hcHBseShzZWxmLCBldmVudF9hcmdzW3R5cGVdKTtcblx0ICAgIH1cblx0ICB9XG5cdH07XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIHRoZSBjdXJyZW50IHNlbGVjdGlvbiB3aXRoaW4gYSB0ZXh0IGlucHV0IGNvbnRyb2wuXG5cdCAqIFJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmc6XG5cdCAqICAgLSBzdGFydFxuXHQgKiAgIC0gbGVuZ3RoXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGdldFNlbGVjdGlvbiA9IGlucHV0ID0+IHtcblx0ICByZXR1cm4ge1xuXHQgICAgc3RhcnQ6IGlucHV0LnNlbGVjdGlvblN0YXJ0IHx8IDAsXG5cdCAgICBsZW5ndGg6IChpbnB1dC5zZWxlY3Rpb25FbmQgfHwgMCkgLSAoaW5wdXQuc2VsZWN0aW9uU3RhcnQgfHwgMClcblx0ICB9O1xuXHR9O1xuXHQvKipcblx0ICogUHJldmVudCBkZWZhdWx0XG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IHByZXZlbnREZWZhdWx0ID0gKGV2dCwgc3RvcCA9IGZhbHNlKSA9PiB7XG5cdCAgaWYgKGV2dCkge1xuXHQgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cblx0ICAgIGlmIChzdG9wKSB7XG5cdCAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgIH1cblx0ICB9XG5cdH07XG5cdC8qKlxuXHQgKiBBZGQgZXZlbnQgaGVscGVyXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGFkZEV2ZW50ID0gKHRhcmdldCwgdHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpID0+IHtcblx0ICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cdH07XG5cdC8qKlxuXHQgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcmVxdWVzdGVkIGtleSBpcyBkb3duXG5cdCAqIFdpbGwgcmV0dXJuIGZhbHNlIGlmIG1vcmUgdGhhbiBvbmUgY29udHJvbCBjaGFyYWN0ZXIgaXMgcHJlc3NlZCAoIHdoZW4gW2N0cmwrc2hpZnQrYV0gIT0gW2N0cmwrYV0gKVxuXHQgKiBUaGUgY3VycmVudCBldnQgbWF5IG5vdCBhbHdheXMgc2V0ICggZWcgY2FsbGluZyBhZHZhbmNlU2VsZWN0aW9uKCkgKVxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBpc0tleURvd24gPSAoa2V5X25hbWUsIGV2dCkgPT4ge1xuXHQgIGlmICghZXZ0KSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXG5cdCAgaWYgKCFldnRba2V5X25hbWVdKSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXG5cdCAgdmFyIGNvdW50ID0gKGV2dC5hbHRLZXkgPyAxIDogMCkgKyAoZXZ0LmN0cmxLZXkgPyAxIDogMCkgKyAoZXZ0LnNoaWZ0S2V5ID8gMSA6IDApICsgKGV2dC5tZXRhS2V5ID8gMSA6IDApO1xuXG5cdCAgaWYgKGNvdW50ID09PSAxKSB7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cblx0ICByZXR1cm4gZmFsc2U7XG5cdH07XG5cdC8qKlxuXHQgKiBHZXQgdGhlIGlkIG9mIGFuIGVsZW1lbnRcblx0ICogSWYgdGhlIGlkIGF0dHJpYnV0ZSBpcyBub3Qgc2V0LCBzZXQgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBpZFxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBnZXRJZCA9IChlbCwgaWQpID0+IHtcblx0ICBjb25zdCBleGlzdGluZ19pZCA9IGVsLmdldEF0dHJpYnV0ZSgnaWQnKTtcblxuXHQgIGlmIChleGlzdGluZ19pZCkge1xuXHQgICAgcmV0dXJuIGV4aXN0aW5nX2lkO1xuXHQgIH1cblxuXHQgIGVsLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG5cdCAgcmV0dXJuIGlkO1xuXHR9O1xuXHQvKipcblx0ICogUmV0dXJucyBhIHN0cmluZyB3aXRoIGJhY2tzbGFzaGVzIGFkZGVkIGJlZm9yZSBjaGFyYWN0ZXJzIHRoYXQgbmVlZCB0byBiZSBlc2NhcGVkLlxuXHQgKi9cblxuXHRjb25zdCBhZGRTbGFzaGVzID0gc3RyID0+IHtcblx0ICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXFxcXCInXS9nLCAnXFxcXCQmJyk7XG5cdH07XG5cdC8qKlxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBhcHBlbmQgPSAocGFyZW50LCBub2RlKSA9PiB7XG5cdCAgaWYgKG5vZGUpIHBhcmVudC5hcHBlbmQobm9kZSk7XG5cdH07XG5cblx0ZnVuY3Rpb24gZ2V0U2V0dGluZ3MoaW5wdXQsIHNldHRpbmdzX3VzZXIpIHtcblx0ICB2YXIgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgc2V0dGluZ3NfdXNlcik7XG5cdCAgdmFyIGF0dHJfZGF0YSA9IHNldHRpbmdzLmRhdGFBdHRyO1xuXHQgIHZhciBmaWVsZF9sYWJlbCA9IHNldHRpbmdzLmxhYmVsRmllbGQ7XG5cdCAgdmFyIGZpZWxkX3ZhbHVlID0gc2V0dGluZ3MudmFsdWVGaWVsZDtcblx0ICB2YXIgZmllbGRfZGlzYWJsZWQgPSBzZXR0aW5ncy5kaXNhYmxlZEZpZWxkO1xuXHQgIHZhciBmaWVsZF9vcHRncm91cCA9IHNldHRpbmdzLm9wdGdyb3VwRmllbGQ7XG5cdCAgdmFyIGZpZWxkX29wdGdyb3VwX2xhYmVsID0gc2V0dGluZ3Mub3B0Z3JvdXBMYWJlbEZpZWxkO1xuXHQgIHZhciBmaWVsZF9vcHRncm91cF92YWx1ZSA9IHNldHRpbmdzLm9wdGdyb3VwVmFsdWVGaWVsZDtcblx0ICB2YXIgdGFnX25hbWUgPSBpbnB1dC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdCAgdmFyIHBsYWNlaG9sZGVyID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpIHx8IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1wbGFjZWhvbGRlcicpO1xuXG5cdCAgaWYgKCFwbGFjZWhvbGRlciAmJiAhc2V0dGluZ3MuYWxsb3dFbXB0eU9wdGlvbikge1xuXHQgICAgbGV0IG9wdGlvbiA9IGlucHV0LnF1ZXJ5U2VsZWN0b3IoJ29wdGlvblt2YWx1ZT1cIlwiXScpO1xuXG5cdCAgICBpZiAob3B0aW9uKSB7XG5cdCAgICAgIHBsYWNlaG9sZGVyID0gb3B0aW9uLnRleHRDb250ZW50O1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIHZhciBzZXR0aW5nc19lbGVtZW50ID0ge1xuXHQgICAgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyLFxuXHQgICAgb3B0aW9uczogW10sXG5cdCAgICBvcHRncm91cHM6IFtdLFxuXHQgICAgaXRlbXM6IFtdLFxuXHQgICAgbWF4SXRlbXM6IG51bGxcblx0ICB9O1xuXHQgIC8qKlxuXHQgICAqIEluaXRpYWxpemUgZnJvbSBhIDxzZWxlY3Q+IGVsZW1lbnQuXG5cdCAgICpcblx0ICAgKi9cblxuXHQgIHZhciBpbml0X3NlbGVjdCA9ICgpID0+IHtcblx0ICAgIHZhciB0YWdOYW1lO1xuXHQgICAgdmFyIG9wdGlvbnMgPSBzZXR0aW5nc19lbGVtZW50Lm9wdGlvbnM7XG5cdCAgICB2YXIgb3B0aW9uc01hcCA9IHt9O1xuXHQgICAgdmFyIGdyb3VwX2NvdW50ID0gMTtcblxuXHQgICAgdmFyIHJlYWREYXRhID0gZWwgPT4ge1xuXHQgICAgICB2YXIgZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIGVsLmRhdGFzZXQpOyAvLyBnZXQgcGxhaW4gb2JqZWN0IGZyb20gRE9NU3RyaW5nTWFwXG5cblx0ICAgICAgdmFyIGpzb24gPSBhdHRyX2RhdGEgJiYgZGF0YVthdHRyX2RhdGFdO1xuXG5cdCAgICAgIGlmICh0eXBlb2YganNvbiA9PT0gJ3N0cmluZycgJiYganNvbi5sZW5ndGgpIHtcblx0ICAgICAgICBkYXRhID0gT2JqZWN0LmFzc2lnbihkYXRhLCBKU09OLnBhcnNlKGpzb24pKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBkYXRhO1xuXHQgICAgfTtcblxuXHQgICAgdmFyIGFkZE9wdGlvbiA9IChvcHRpb24sIGdyb3VwKSA9PiB7XG5cdCAgICAgIHZhciB2YWx1ZSA9IGhhc2hfa2V5KG9wdGlvbi52YWx1ZSk7XG5cdCAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm47XG5cdCAgICAgIGlmICghdmFsdWUgJiYgIXNldHRpbmdzLmFsbG93RW1wdHlPcHRpb24pIHJldHVybjsgLy8gaWYgdGhlIG9wdGlvbiBhbHJlYWR5IGV4aXN0cywgaXQncyBwcm9iYWJseSBiZWVuXG5cdCAgICAgIC8vIGR1cGxpY2F0ZWQgaW4gYW5vdGhlciBvcHRncm91cC4gaW4gdGhpcyBjYXNlLCBwdXNoXG5cdCAgICAgIC8vIHRoZSBjdXJyZW50IGdyb3VwIHRvIHRoZSBcIm9wdGdyb3VwXCIgcHJvcGVydHkgb24gdGhlXG5cdCAgICAgIC8vIGV4aXN0aW5nIG9wdGlvbiBzbyB0aGF0IGl0J3MgcmVuZGVyZWQgaW4gYm90aCBwbGFjZXMuXG5cblx0ICAgICAgaWYgKG9wdGlvbnNNYXAuaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG5cdCAgICAgICAgaWYgKGdyb3VwKSB7XG5cdCAgICAgICAgICB2YXIgYXJyID0gb3B0aW9uc01hcFt2YWx1ZV1bZmllbGRfb3B0Z3JvdXBdO1xuXG5cdCAgICAgICAgICBpZiAoIWFycikge1xuXHQgICAgICAgICAgICBvcHRpb25zTWFwW3ZhbHVlXVtmaWVsZF9vcHRncm91cF0gPSBncm91cDtcblx0ICAgICAgICAgIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuXHQgICAgICAgICAgICBvcHRpb25zTWFwW3ZhbHVlXVtmaWVsZF9vcHRncm91cF0gPSBbYXJyLCBncm91cF07XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBhcnIucHVzaChncm91cCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciBvcHRpb25fZGF0YSA9IHJlYWREYXRhKG9wdGlvbik7XG5cdCAgICAgICAgb3B0aW9uX2RhdGFbZmllbGRfbGFiZWxdID0gb3B0aW9uX2RhdGFbZmllbGRfbGFiZWxdIHx8IG9wdGlvbi50ZXh0Q29udGVudDtcblx0ICAgICAgICBvcHRpb25fZGF0YVtmaWVsZF92YWx1ZV0gPSBvcHRpb25fZGF0YVtmaWVsZF92YWx1ZV0gfHwgdmFsdWU7XG5cdCAgICAgICAgb3B0aW9uX2RhdGFbZmllbGRfZGlzYWJsZWRdID0gb3B0aW9uX2RhdGFbZmllbGRfZGlzYWJsZWRdIHx8IG9wdGlvbi5kaXNhYmxlZDtcblx0ICAgICAgICBvcHRpb25fZGF0YVtmaWVsZF9vcHRncm91cF0gPSBvcHRpb25fZGF0YVtmaWVsZF9vcHRncm91cF0gfHwgZ3JvdXA7XG5cdCAgICAgICAgb3B0aW9uX2RhdGEuJG9wdGlvbiA9IG9wdGlvbjtcblx0ICAgICAgICBvcHRpb25zTWFwW3ZhbHVlXSA9IG9wdGlvbl9kYXRhO1xuXHQgICAgICAgIG9wdGlvbnMucHVzaChvcHRpb25fZGF0YSk7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAob3B0aW9uLnNlbGVjdGVkKSB7XG5cdCAgICAgICAgc2V0dGluZ3NfZWxlbWVudC5pdGVtcy5wdXNoKHZhbHVlKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblxuXHQgICAgdmFyIGFkZEdyb3VwID0gb3B0Z3JvdXAgPT4ge1xuXHQgICAgICB2YXIgaWQsIG9wdGdyb3VwX2RhdGE7XG5cdCAgICAgIG9wdGdyb3VwX2RhdGEgPSByZWFkRGF0YShvcHRncm91cCk7XG5cdCAgICAgIG9wdGdyb3VwX2RhdGFbZmllbGRfb3B0Z3JvdXBfbGFiZWxdID0gb3B0Z3JvdXBfZGF0YVtmaWVsZF9vcHRncm91cF9sYWJlbF0gfHwgb3B0Z3JvdXAuZ2V0QXR0cmlidXRlKCdsYWJlbCcpIHx8ICcnO1xuXHQgICAgICBvcHRncm91cF9kYXRhW2ZpZWxkX29wdGdyb3VwX3ZhbHVlXSA9IG9wdGdyb3VwX2RhdGFbZmllbGRfb3B0Z3JvdXBfdmFsdWVdIHx8IGdyb3VwX2NvdW50Kys7XG5cdCAgICAgIG9wdGdyb3VwX2RhdGFbZmllbGRfZGlzYWJsZWRdID0gb3B0Z3JvdXBfZGF0YVtmaWVsZF9kaXNhYmxlZF0gfHwgb3B0Z3JvdXAuZGlzYWJsZWQ7XG5cdCAgICAgIHNldHRpbmdzX2VsZW1lbnQub3B0Z3JvdXBzLnB1c2gob3B0Z3JvdXBfZGF0YSk7XG5cdCAgICAgIGlkID0gb3B0Z3JvdXBfZGF0YVtmaWVsZF9vcHRncm91cF92YWx1ZV07XG5cdCAgICAgIGl0ZXJhdGUob3B0Z3JvdXAuY2hpbGRyZW4sIG9wdGlvbiA9PiB7XG5cdCAgICAgICAgYWRkT3B0aW9uKG9wdGlvbiwgaWQpO1xuXHQgICAgICB9KTtcblx0ICAgIH07XG5cblx0ICAgIHNldHRpbmdzX2VsZW1lbnQubWF4SXRlbXMgPSBpbnB1dC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykgPyBudWxsIDogMTtcblx0ICAgIGl0ZXJhdGUoaW5wdXQuY2hpbGRyZW4sIGNoaWxkID0+IHtcblx0ICAgICAgdGFnTmFtZSA9IGNoaWxkLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuXHQgICAgICBpZiAodGFnTmFtZSA9PT0gJ29wdGdyb3VwJykge1xuXHQgICAgICAgIGFkZEdyb3VwKGNoaWxkKTtcblx0ICAgICAgfSBlbHNlIGlmICh0YWdOYW1lID09PSAnb3B0aW9uJykge1xuXHQgICAgICAgIGFkZE9wdGlvbihjaGlsZCk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgIH07XG5cdCAgLyoqXG5cdCAgICogSW5pdGlhbGl6ZSBmcm9tIGEgPGlucHV0IHR5cGU9XCJ0ZXh0XCI+IGVsZW1lbnQuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgdmFyIGluaXRfdGV4dGJveCA9ICgpID0+IHtcblx0ICAgIGNvbnN0IGRhdGFfcmF3ID0gaW5wdXQuZ2V0QXR0cmlidXRlKGF0dHJfZGF0YSk7XG5cblx0ICAgIGlmICghZGF0YV9yYXcpIHtcblx0ICAgICAgdmFyIHZhbHVlID0gaW5wdXQudmFsdWUudHJpbSgpIHx8ICcnO1xuXHQgICAgICBpZiAoIXNldHRpbmdzLmFsbG93RW1wdHlPcHRpb24gJiYgIXZhbHVlLmxlbmd0aCkgcmV0dXJuO1xuXHQgICAgICBjb25zdCB2YWx1ZXMgPSB2YWx1ZS5zcGxpdChzZXR0aW5ncy5kZWxpbWl0ZXIpO1xuXHQgICAgICBpdGVyYXRlKHZhbHVlcywgdmFsdWUgPT4ge1xuXHQgICAgICAgIGNvbnN0IG9wdGlvbiA9IHt9O1xuXHQgICAgICAgIG9wdGlvbltmaWVsZF9sYWJlbF0gPSB2YWx1ZTtcblx0ICAgICAgICBvcHRpb25bZmllbGRfdmFsdWVdID0gdmFsdWU7XG5cdCAgICAgICAgc2V0dGluZ3NfZWxlbWVudC5vcHRpb25zLnB1c2gob3B0aW9uKTtcblx0ICAgICAgfSk7XG5cdCAgICAgIHNldHRpbmdzX2VsZW1lbnQuaXRlbXMgPSB2YWx1ZXM7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZXR0aW5nc19lbGVtZW50Lm9wdGlvbnMgPSBKU09OLnBhcnNlKGRhdGFfcmF3KTtcblx0ICAgICAgaXRlcmF0ZShzZXR0aW5nc19lbGVtZW50Lm9wdGlvbnMsIG9wdCA9PiB7XG5cdCAgICAgICAgc2V0dGluZ3NfZWxlbWVudC5pdGVtcy5wdXNoKG9wdFtmaWVsZF92YWx1ZV0pO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgaWYgKHRhZ19uYW1lID09PSAnc2VsZWN0Jykge1xuXHQgICAgaW5pdF9zZWxlY3QoKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgaW5pdF90ZXh0Ym94KCk7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBzZXR0aW5nc19lbGVtZW50LCBzZXR0aW5nc191c2VyKTtcblx0fVxuXG5cdHZhciBpbnN0YW5jZV9pID0gMDtcblx0Y2xhc3MgVG9tU2VsZWN0IGV4dGVuZHMgTWljcm9QbHVnaW4oTWljcm9FdmVudCkge1xuXHQgIC8vIEBkZXByZWNhdGVkIDEuOFxuXHQgIGNvbnN0cnVjdG9yKGlucHV0X2FyZywgdXNlcl9zZXR0aW5ncykge1xuXHQgICAgc3VwZXIoKTtcblx0ICAgIHRoaXMuY29udHJvbF9pbnB1dCA9IHZvaWQgMDtcblx0ICAgIHRoaXMud3JhcHBlciA9IHZvaWQgMDtcblx0ICAgIHRoaXMuZHJvcGRvd24gPSB2b2lkIDA7XG5cdCAgICB0aGlzLmNvbnRyb2wgPSB2b2lkIDA7XG5cdCAgICB0aGlzLmRyb3Bkb3duX2NvbnRlbnQgPSB2b2lkIDA7XG5cdCAgICB0aGlzLmZvY3VzX25vZGUgPSB2b2lkIDA7XG5cdCAgICB0aGlzLm9yZGVyID0gMDtcblx0ICAgIHRoaXMuc2V0dGluZ3MgPSB2b2lkIDA7XG5cdCAgICB0aGlzLmlucHV0ID0gdm9pZCAwO1xuXHQgICAgdGhpcy50YWJJbmRleCA9IHZvaWQgMDtcblx0ICAgIHRoaXMuaXNfc2VsZWN0X3RhZyA9IHZvaWQgMDtcblx0ICAgIHRoaXMucnRsID0gdm9pZCAwO1xuXHQgICAgdGhpcy5pbnB1dElkID0gdm9pZCAwO1xuXHQgICAgdGhpcy5fZGVzdHJveSA9IHZvaWQgMDtcblx0ICAgIHRoaXMuc2lmdGVyID0gdm9pZCAwO1xuXHQgICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcblx0ICAgIHRoaXMuaXNEaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5pc1JlcXVpcmVkID0gdm9pZCAwO1xuXHQgICAgdGhpcy5pc0ludmFsaWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuaXNWYWxpZCA9IHRydWU7XG5cdCAgICB0aGlzLmlzTG9ja2VkID0gZmFsc2U7XG5cdCAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5pc0lucHV0SGlkZGVuID0gZmFsc2U7XG5cdCAgICB0aGlzLmlzU2V0dXAgPSBmYWxzZTtcblx0ICAgIHRoaXMuaWdub3JlRm9jdXMgPSBmYWxzZTtcblx0ICAgIHRoaXMuaWdub3JlSG92ZXIgPSBmYWxzZTtcblx0ICAgIHRoaXMuaGFzT3B0aW9ucyA9IGZhbHNlO1xuXHQgICAgdGhpcy5jdXJyZW50UmVzdWx0cyA9IHZvaWQgMDtcblx0ICAgIHRoaXMubGFzdFZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmNhcmV0UG9zID0gMDtcblx0ICAgIHRoaXMubG9hZGluZyA9IDA7XG5cdCAgICB0aGlzLmxvYWRlZFNlYXJjaGVzID0ge307XG5cdCAgICB0aGlzLmFjdGl2ZU9wdGlvbiA9IG51bGw7XG5cdCAgICB0aGlzLmFjdGl2ZUl0ZW1zID0gW107XG5cdCAgICB0aGlzLm9wdGdyb3VwcyA9IHt9O1xuXHQgICAgdGhpcy5vcHRpb25zID0ge307XG5cdCAgICB0aGlzLnVzZXJPcHRpb25zID0ge307XG5cdCAgICB0aGlzLml0ZW1zID0gW107XG5cdCAgICBpbnN0YW5jZV9pKys7XG5cdCAgICB2YXIgZGlyO1xuXHQgICAgdmFyIGlucHV0ID0gZ2V0RG9tKGlucHV0X2FyZyk7XG5cblx0ICAgIGlmIChpbnB1dC50b21zZWxlY3QpIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKCdUb20gU2VsZWN0IGFscmVhZHkgaW5pdGlhbGl6ZWQgb24gdGhpcyBlbGVtZW50Jyk7XG5cdCAgICB9XG5cblx0ICAgIGlucHV0LnRvbXNlbGVjdCA9IHRoaXM7IC8vIGRldGVjdCBydGwgZW52aXJvbm1lbnRcblxuXHQgICAgdmFyIGNvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpbnB1dCwgbnVsbCk7XG5cdCAgICBkaXIgPSBjb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2RpcmVjdGlvbicpOyAvLyBzZXR1cCBkZWZhdWx0IHN0YXRlXG5cblx0ICAgIGNvbnN0IHNldHRpbmdzID0gZ2V0U2V0dGluZ3MoaW5wdXQsIHVzZXJfc2V0dGluZ3MpO1xuXHQgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuXHQgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xuXHQgICAgdGhpcy50YWJJbmRleCA9IGlucHV0LnRhYkluZGV4IHx8IDA7XG5cdCAgICB0aGlzLmlzX3NlbGVjdF90YWcgPSBpbnB1dC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnO1xuXHQgICAgdGhpcy5ydGwgPSAvcnRsL2kudGVzdChkaXIpO1xuXHQgICAgdGhpcy5pbnB1dElkID0gZ2V0SWQoaW5wdXQsICd0b21zZWxlY3QtJyArIGluc3RhbmNlX2kpO1xuXHQgICAgdGhpcy5pc1JlcXVpcmVkID0gaW5wdXQucmVxdWlyZWQ7IC8vIHNlYXJjaCBzeXN0ZW1cblxuXHQgICAgdGhpcy5zaWZ0ZXIgPSBuZXcgU2lmdGVyKHRoaXMub3B0aW9ucywge1xuXHQgICAgICBkaWFjcml0aWNzOiBzZXR0aW5ncy5kaWFjcml0aWNzXG5cdCAgICB9KTsgLy8gb3B0aW9uLWRlcGVuZGVudCBkZWZhdWx0c1xuXG5cdCAgICBzZXR0aW5ncy5tb2RlID0gc2V0dGluZ3MubW9kZSB8fCAoc2V0dGluZ3MubWF4SXRlbXMgPT09IDEgPyAnc2luZ2xlJyA6ICdtdWx0aScpO1xuXG5cdCAgICBpZiAodHlwZW9mIHNldHRpbmdzLmhpZGVTZWxlY3RlZCAhPT0gJ2Jvb2xlYW4nKSB7XG5cdCAgICAgIHNldHRpbmdzLmhpZGVTZWxlY3RlZCA9IHNldHRpbmdzLm1vZGUgPT09ICdtdWx0aSc7XG5cdCAgICB9XG5cblx0ICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MuaGlkZVBsYWNlaG9sZGVyICE9PSAnYm9vbGVhbicpIHtcblx0ICAgICAgc2V0dGluZ3MuaGlkZVBsYWNlaG9sZGVyID0gc2V0dGluZ3MubW9kZSAhPT0gJ211bHRpJztcblx0ICAgIH0gLy8gc2V0IHVwIGNyZWF0ZUZpbHRlciBjYWxsYmFja1xuXG5cblx0ICAgIHZhciBmaWx0ZXIgPSBzZXR0aW5ncy5jcmVhdGVGaWx0ZXI7XG5cblx0ICAgIGlmICh0eXBlb2YgZmlsdGVyICE9PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIGlmICh0eXBlb2YgZmlsdGVyID09PSAnc3RyaW5nJykge1xuXHQgICAgICAgIGZpbHRlciA9IG5ldyBSZWdFeHAoZmlsdGVyKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChmaWx0ZXIgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0ICAgICAgICBzZXR0aW5ncy5jcmVhdGVGaWx0ZXIgPSBpbnB1dCA9PiBmaWx0ZXIudGVzdChpbnB1dCk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgc2V0dGluZ3MuY3JlYXRlRmlsdGVyID0gdmFsdWUgPT4ge1xuXHQgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuZHVwbGljYXRlcyB8fCAhdGhpcy5vcHRpb25zW3ZhbHVlXTtcblx0ICAgICAgICB9O1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuaW5pdGlhbGl6ZVBsdWdpbnMoc2V0dGluZ3MucGx1Z2lucyk7XG5cdCAgICB0aGlzLnNldHVwQ2FsbGJhY2tzKCk7XG5cdCAgICB0aGlzLnNldHVwVGVtcGxhdGVzKCk7IC8vIENyZWF0ZSBhbGwgZWxlbWVudHNcblxuXHQgICAgY29uc3Qgd3JhcHBlciA9IGdldERvbSgnPGRpdj4nKTtcblx0ICAgIGNvbnN0IGNvbnRyb2wgPSBnZXREb20oJzxkaXY+Jyk7XG5cblx0ICAgIGNvbnN0IGRyb3Bkb3duID0gdGhpcy5fcmVuZGVyKCdkcm9wZG93bicpO1xuXG5cdCAgICBjb25zdCBkcm9wZG93bl9jb250ZW50ID0gZ2V0RG9tKGA8ZGl2IHJvbGU9XCJsaXN0Ym94XCIgdGFiaW5kZXg9XCItMVwiPmApO1xuXHQgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMuaW5wdXQuZ2V0QXR0cmlidXRlKCdjbGFzcycpIHx8ICcnO1xuXHQgICAgY29uc3QgaW5wdXRNb2RlID0gc2V0dGluZ3MubW9kZTtcblx0ICAgIHZhciBjb250cm9sX2lucHV0O1xuXHQgICAgYWRkQ2xhc3Nlcyh3cmFwcGVyLCBzZXR0aW5ncy53cmFwcGVyQ2xhc3MsIGNsYXNzZXMsIGlucHV0TW9kZSk7XG5cdCAgICBhZGRDbGFzc2VzKGNvbnRyb2wsIHNldHRpbmdzLmNvbnRyb2xDbGFzcyk7XG5cdCAgICBhcHBlbmQod3JhcHBlciwgY29udHJvbCk7XG5cdCAgICBhZGRDbGFzc2VzKGRyb3Bkb3duLCBzZXR0aW5ncy5kcm9wZG93bkNsYXNzLCBpbnB1dE1vZGUpO1xuXG5cdCAgICBpZiAoc2V0dGluZ3MuY29weUNsYXNzZXNUb0Ryb3Bkb3duKSB7XG5cdCAgICAgIGFkZENsYXNzZXMoZHJvcGRvd24sIGNsYXNzZXMpO1xuXHQgICAgfVxuXG5cdCAgICBhZGRDbGFzc2VzKGRyb3Bkb3duX2NvbnRlbnQsIHNldHRpbmdzLmRyb3Bkb3duQ29udGVudENsYXNzKTtcblx0ICAgIGFwcGVuZChkcm9wZG93biwgZHJvcGRvd25fY29udGVudCk7XG5cdCAgICBnZXREb20oc2V0dGluZ3MuZHJvcGRvd25QYXJlbnQgfHwgd3JhcHBlcikuYXBwZW5kQ2hpbGQoZHJvcGRvd24pOyAvLyBkZWZhdWx0IGNvbnRyb2xJbnB1dFxuXG5cdCAgICBpZiAoaXNIdG1sU3RyaW5nKHNldHRpbmdzLmNvbnRyb2xJbnB1dCkpIHtcblx0ICAgICAgY29udHJvbF9pbnB1dCA9IGdldERvbShzZXR0aW5ncy5jb250cm9sSW5wdXQpOyAvLyBzZXQgYXR0cmlidXRlc1xuXG5cdCAgICAgIHZhciBhdHRycyA9IFsnYXV0b2NvcnJlY3QnLCAnYXV0b2NhcGl0YWxpemUnLCAnYXV0b2NvbXBsZXRlJ107XG5cdCAgICAgIGl0ZXJhdGUkMShhdHRycywgYXR0ciA9PiB7XG5cdCAgICAgICAgaWYgKGlucHV0LmdldEF0dHJpYnV0ZShhdHRyKSkge1xuXHQgICAgICAgICAgc2V0QXR0cihjb250cm9sX2lucHV0LCB7XG5cdCAgICAgICAgICAgIFthdHRyXTogaW5wdXQuZ2V0QXR0cmlidXRlKGF0dHIpXG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgICBjb250cm9sX2lucHV0LnRhYkluZGV4ID0gLTE7XG5cdCAgICAgIGNvbnRyb2wuYXBwZW5kQ2hpbGQoY29udHJvbF9pbnB1dCk7XG5cdCAgICAgIHRoaXMuZm9jdXNfbm9kZSA9IGNvbnRyb2xfaW5wdXQ7IC8vIGRvbSBlbGVtZW50XG5cdCAgICB9IGVsc2UgaWYgKHNldHRpbmdzLmNvbnRyb2xJbnB1dCkge1xuXHQgICAgICBjb250cm9sX2lucHV0ID0gZ2V0RG9tKHNldHRpbmdzLmNvbnRyb2xJbnB1dCk7XG5cdCAgICAgIHRoaXMuZm9jdXNfbm9kZSA9IGNvbnRyb2xfaW5wdXQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBjb250cm9sX2lucHV0ID0gZ2V0RG9tKCc8aW5wdXQvPicpO1xuXHQgICAgICB0aGlzLmZvY3VzX25vZGUgPSBjb250cm9sO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLndyYXBwZXIgPSB3cmFwcGVyO1xuXHQgICAgdGhpcy5kcm9wZG93biA9IGRyb3Bkb3duO1xuXHQgICAgdGhpcy5kcm9wZG93bl9jb250ZW50ID0gZHJvcGRvd25fY29udGVudDtcblx0ICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG5cdCAgICB0aGlzLmNvbnRyb2xfaW5wdXQgPSBjb250cm9sX2lucHV0O1xuXHQgICAgdGhpcy5zZXR1cCgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBzZXQgdXAgZXZlbnQgYmluZGluZ3MuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2V0dXAoKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIGNvbnN0IHNldHRpbmdzID0gc2VsZi5zZXR0aW5ncztcblx0ICAgIGNvbnN0IGNvbnRyb2xfaW5wdXQgPSBzZWxmLmNvbnRyb2xfaW5wdXQ7XG5cdCAgICBjb25zdCBkcm9wZG93biA9IHNlbGYuZHJvcGRvd247XG5cdCAgICBjb25zdCBkcm9wZG93bl9jb250ZW50ID0gc2VsZi5kcm9wZG93bl9jb250ZW50O1xuXHQgICAgY29uc3Qgd3JhcHBlciA9IHNlbGYud3JhcHBlcjtcblx0ICAgIGNvbnN0IGNvbnRyb2wgPSBzZWxmLmNvbnRyb2w7XG5cdCAgICBjb25zdCBpbnB1dCA9IHNlbGYuaW5wdXQ7XG5cdCAgICBjb25zdCBmb2N1c19ub2RlID0gc2VsZi5mb2N1c19ub2RlO1xuXHQgICAgY29uc3QgcGFzc2l2ZV9ldmVudCA9IHtcblx0ICAgICAgcGFzc2l2ZTogdHJ1ZVxuXHQgICAgfTtcblx0ICAgIGNvbnN0IGxpc3Rib3hJZCA9IHNlbGYuaW5wdXRJZCArICctdHMtZHJvcGRvd24nO1xuXHQgICAgc2V0QXR0cihkcm9wZG93bl9jb250ZW50LCB7XG5cdCAgICAgIGlkOiBsaXN0Ym94SWRcblx0ICAgIH0pO1xuXHQgICAgc2V0QXR0cihmb2N1c19ub2RlLCB7XG5cdCAgICAgIHJvbGU6ICdjb21ib2JveCcsXG5cdCAgICAgICdhcmlhLWhhc3BvcHVwJzogJ2xpc3Rib3gnLFxuXHQgICAgICAnYXJpYS1leHBhbmRlZCc6ICdmYWxzZScsXG5cdCAgICAgICdhcmlhLWNvbnRyb2xzJzogbGlzdGJveElkXG5cdCAgICB9KTtcblx0ICAgIGNvbnN0IGNvbnRyb2xfaWQgPSBnZXRJZChmb2N1c19ub2RlLCBzZWxmLmlucHV0SWQgKyAnLXRzLWNvbnRyb2wnKTtcblx0ICAgIGNvbnN0IHF1ZXJ5ID0gXCJsYWJlbFtmb3I9J1wiICsgZXNjYXBlUXVlcnkoc2VsZi5pbnB1dElkKSArIFwiJ11cIjtcblx0ICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihxdWVyeSk7XG5cdCAgICBjb25zdCBsYWJlbF9jbGljayA9IHNlbGYuZm9jdXMuYmluZChzZWxmKTtcblxuXHQgICAgaWYgKGxhYmVsKSB7XG5cdCAgICAgIGFkZEV2ZW50KGxhYmVsLCAnY2xpY2snLCBsYWJlbF9jbGljayk7XG5cdCAgICAgIHNldEF0dHIobGFiZWwsIHtcblx0ICAgICAgICBmb3I6IGNvbnRyb2xfaWRcblx0ICAgICAgfSk7XG5cdCAgICAgIGNvbnN0IGxhYmVsX2lkID0gZ2V0SWQobGFiZWwsIHNlbGYuaW5wdXRJZCArICctdHMtbGFiZWwnKTtcblx0ICAgICAgc2V0QXR0cihmb2N1c19ub2RlLCB7XG5cdCAgICAgICAgJ2FyaWEtbGFiZWxsZWRieSc6IGxhYmVsX2lkXG5cdCAgICAgIH0pO1xuXHQgICAgICBzZXRBdHRyKGRyb3Bkb3duX2NvbnRlbnQsIHtcblx0ICAgICAgICAnYXJpYS1sYWJlbGxlZGJ5JzogbGFiZWxfaWRcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIHdyYXBwZXIuc3R5bGUud2lkdGggPSBpbnB1dC5zdHlsZS53aWR0aDtcblxuXHQgICAgaWYgKHNlbGYucGx1Z2lucy5uYW1lcy5sZW5ndGgpIHtcblx0ICAgICAgY29uc3QgY2xhc3Nlc19wbHVnaW5zID0gJ3BsdWdpbi0nICsgc2VsZi5wbHVnaW5zLm5hbWVzLmpvaW4oJyBwbHVnaW4tJyk7XG5cdCAgICAgIGFkZENsYXNzZXMoW3dyYXBwZXIsIGRyb3Bkb3duXSwgY2xhc3Nlc19wbHVnaW5zKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKChzZXR0aW5ncy5tYXhJdGVtcyA9PT0gbnVsbCB8fCBzZXR0aW5ncy5tYXhJdGVtcyA+IDEpICYmIHNlbGYuaXNfc2VsZWN0X3RhZykge1xuXHQgICAgICBzZXRBdHRyKGlucHV0LCB7XG5cdCAgICAgICAgbXVsdGlwbGU6ICdtdWx0aXBsZSdcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChzZXR0aW5ncy5wbGFjZWhvbGRlcikge1xuXHQgICAgICBzZXRBdHRyKGNvbnRyb2xfaW5wdXQsIHtcblx0ICAgICAgICBwbGFjZWhvbGRlcjogc2V0dGluZ3MucGxhY2Vob2xkZXJcblx0ICAgICAgfSk7XG5cdCAgICB9IC8vIGlmIHNwbGl0T24gd2FzIG5vdCBwYXNzZWQgaW4sIGNvbnN0cnVjdCBpdCBmcm9tIHRoZSBkZWxpbWl0ZXIgdG8gYWxsb3cgcGFzdGluZyB1bml2ZXJzYWxseVxuXG5cblx0ICAgIGlmICghc2V0dGluZ3Muc3BsaXRPbiAmJiBzZXR0aW5ncy5kZWxpbWl0ZXIpIHtcblx0ICAgICAgc2V0dGluZ3Muc3BsaXRPbiA9IG5ldyBSZWdFeHAoJ1xcXFxzKicgKyBlc2NhcGVfcmVnZXgoc2V0dGluZ3MuZGVsaW1pdGVyKSArICcrXFxcXHMqJyk7XG5cdCAgICB9IC8vIGRlYm91bmNlIHVzZXIgZGVmaW5lZCBsb2FkKCkgaWYgbG9hZFRocm90dGxlID4gMFxuXHQgICAgLy8gYWZ0ZXIgaW5pdGlhbGl6ZVBsdWdpbnMoKSBzbyBwbHVnaW5zIGNhbiBjcmVhdGUvbW9kaWZ5IHVzZXIgZGVmaW5lZCBsb2FkZXJzXG5cblxuXHQgICAgaWYgKHNldHRpbmdzLmxvYWQgJiYgc2V0dGluZ3MubG9hZFRocm90dGxlKSB7XG5cdCAgICAgIHNldHRpbmdzLmxvYWQgPSBsb2FkRGVib3VuY2Uoc2V0dGluZ3MubG9hZCwgc2V0dGluZ3MubG9hZFRocm90dGxlKTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi5jb250cm9sX2lucHV0LnR5cGUgPSBpbnB1dC50eXBlO1xuXHQgICAgYWRkRXZlbnQoZHJvcGRvd24sICdtb3VzZW1vdmUnLCAoKSA9PiB7XG5cdCAgICAgIHNlbGYuaWdub3JlSG92ZXIgPSBmYWxzZTtcblx0ICAgIH0pO1xuXHQgICAgYWRkRXZlbnQoZHJvcGRvd24sICdtb3VzZWVudGVyJywgZSA9PiB7XG5cdCAgICAgIHZhciB0YXJnZXRfbWF0Y2ggPSBwYXJlbnRNYXRjaChlLnRhcmdldCwgJ1tkYXRhLXNlbGVjdGFibGVdJywgZHJvcGRvd24pO1xuXHQgICAgICBpZiAodGFyZ2V0X21hdGNoKSBzZWxmLm9uT3B0aW9uSG92ZXIoZSwgdGFyZ2V0X21hdGNoKTtcblx0ICAgIH0sIHtcblx0ICAgICAgY2FwdHVyZTogdHJ1ZVxuXHQgICAgfSk7IC8vIGNsaWNraW5nIG9uIGFuIG9wdGlvbiBzaG91bGQgc2VsZWN0IGl0XG5cblx0ICAgIGFkZEV2ZW50KGRyb3Bkb3duLCAnY2xpY2snLCBldnQgPT4ge1xuXHQgICAgICBjb25zdCBvcHRpb24gPSBwYXJlbnRNYXRjaChldnQudGFyZ2V0LCAnW2RhdGEtc2VsZWN0YWJsZV0nKTtcblxuXHQgICAgICBpZiAob3B0aW9uKSB7XG5cdCAgICAgICAgc2VsZi5vbk9wdGlvblNlbGVjdChldnQsIG9wdGlvbik7XG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgICBhZGRFdmVudChjb250cm9sLCAnY2xpY2snLCBldnQgPT4ge1xuXHQgICAgICB2YXIgdGFyZ2V0X21hdGNoID0gcGFyZW50TWF0Y2goZXZ0LnRhcmdldCwgJ1tkYXRhLXRzLWl0ZW1dJywgY29udHJvbCk7XG5cblx0ICAgICAgaWYgKHRhcmdldF9tYXRjaCAmJiBzZWxmLm9uSXRlbVNlbGVjdChldnQsIHRhcmdldF9tYXRjaCkpIHtcblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChldnQsIHRydWUpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfSAvLyByZXRhaW4gZm9jdXMgKHNlZSBjb250cm9sX2lucHV0IG1vdXNlZG93bilcblxuXG5cdCAgICAgIGlmIChjb250cm9sX2lucHV0LnZhbHVlICE9ICcnKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cblx0ICAgICAgc2VsZi5vbkNsaWNrKCk7XG5cdCAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICB9KTsgLy8ga2V5ZG93biBvbiBmb2N1c19ub2RlIGZvciBhcnJvd19kb3duL2Fycm93X3VwXG5cblx0ICAgIGFkZEV2ZW50KGZvY3VzX25vZGUsICdrZXlkb3duJywgZSA9PiBzZWxmLm9uS2V5RG93bihlKSk7IC8vIGtleXByZXNzIGFuZCBpbnB1dC9rZXl1cFxuXG5cdCAgICBhZGRFdmVudChjb250cm9sX2lucHV0LCAna2V5cHJlc3MnLCBlID0+IHNlbGYub25LZXlQcmVzcyhlKSk7XG5cdCAgICBhZGRFdmVudChjb250cm9sX2lucHV0LCAnaW5wdXQnLCBlID0+IHNlbGYub25JbnB1dChlKSk7XG5cdCAgICBhZGRFdmVudChmb2N1c19ub2RlLCAnYmx1cicsIGUgPT4gc2VsZi5vbkJsdXIoZSkpO1xuXHQgICAgYWRkRXZlbnQoZm9jdXNfbm9kZSwgJ2ZvY3VzJywgZSA9PiBzZWxmLm9uRm9jdXMoZSkpO1xuXHQgICAgYWRkRXZlbnQoY29udHJvbF9pbnB1dCwgJ3Bhc3RlJywgZSA9PiBzZWxmLm9uUGFzdGUoZSkpO1xuXG5cdCAgICBjb25zdCBkb2NfbW91c2Vkb3duID0gZXZ0ID0+IHtcblx0ICAgICAgLy8gYmx1ciBpZiB0YXJnZXQgaXMgb3V0c2lkZSBvZiB0aGlzIGluc3RhbmNlXG5cdCAgICAgIC8vIGRyb3Bkb3duIGlzIG5vdCBhbHdheXMgaW5zaWRlIHdyYXBwZXJcblx0ICAgICAgY29uc3QgdGFyZ2V0ID0gZXZ0LmNvbXBvc2VkUGF0aCgpWzBdO1xuXG5cdCAgICAgIGlmICghd3JhcHBlci5jb250YWlucyh0YXJnZXQpICYmICFkcm9wZG93bi5jb250YWlucyh0YXJnZXQpKSB7XG5cdCAgICAgICAgaWYgKHNlbGYuaXNGb2N1c2VkKSB7XG5cdCAgICAgICAgICBzZWxmLmJsdXIoKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZWxmLmlucHV0U3RhdGUoKTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH0gLy8gcmV0YWluIGZvY3VzIGJ5IHByZXZlbnRpbmcgbmF0aXZlIGhhbmRsaW5nLiBpZiB0aGVcblx0ICAgICAgLy8gZXZlbnQgdGFyZ2V0IGlzIHRoZSBpbnB1dCBpdCBzaG91bGQgbm90IGJlIG1vZGlmaWVkLlxuXHQgICAgICAvLyBvdGhlcndpc2UsIHRleHQgc2VsZWN0aW9uIHdpdGhpbiB0aGUgaW5wdXQgd29uJ3Qgd29yay5cblx0ICAgICAgLy8gRml4ZXMgYnVnICMyMTIgd2hpY2ggaXMgbm8gY292ZXJlZCBieSB0ZXN0c1xuXG5cblx0ICAgICAgaWYgKHRhcmdldCA9PSBjb250cm9sX2lucHV0ICYmIHNlbGYuaXNPcGVuKSB7XG5cdCAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpOyAvLyBjbGlja2luZyBhbnl3aGVyZSBpbiB0aGUgY29udHJvbCBzaG91bGQgbm90IGJsdXIgdGhlIGNvbnRyb2xfaW5wdXQgKHdoaWNoIHdvdWxkIGNsb3NlIHRoZSBkcm9wZG93bilcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChldnQsIHRydWUpO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXG5cdCAgICBjb25zdCB3aW5fc2Nyb2xsID0gKCkgPT4ge1xuXHQgICAgICBpZiAoc2VsZi5pc09wZW4pIHtcblx0ICAgICAgICBzZWxmLnBvc2l0aW9uRHJvcGRvd24oKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblxuXHQgICAgYWRkRXZlbnQoZG9jdW1lbnQsICdtb3VzZWRvd24nLCBkb2NfbW91c2Vkb3duKTtcblx0ICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Njcm9sbCcsIHdpbl9zY3JvbGwsIHBhc3NpdmVfZXZlbnQpO1xuXHQgICAgYWRkRXZlbnQod2luZG93LCAncmVzaXplJywgd2luX3Njcm9sbCwgcGFzc2l2ZV9ldmVudCk7XG5cblx0ICAgIHRoaXMuX2Rlc3Ryb3kgPSAoKSA9PiB7XG5cdCAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGRvY19tb3VzZWRvd24pO1xuXHQgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgd2luX3Njcm9sbCk7XG5cdCAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB3aW5fc2Nyb2xsKTtcblx0ICAgICAgaWYgKGxhYmVsKSBsYWJlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGxhYmVsX2NsaWNrKTtcblx0ICAgIH07IC8vIHN0b3JlIG9yaWdpbmFsIGh0bWwgYW5kIHRhYiBpbmRleCBzbyB0aGF0IHRoZXkgY2FuIGJlXG5cdCAgICAvLyByZXN0b3JlZCB3aGVuIHRoZSBkZXN0cm95KCkgbWV0aG9kIGlzIGNhbGxlZC5cblxuXG5cdCAgICB0aGlzLnJldmVydFNldHRpbmdzID0ge1xuXHQgICAgICBpbm5lckhUTUw6IGlucHV0LmlubmVySFRNTCxcblx0ICAgICAgdGFiSW5kZXg6IGlucHV0LnRhYkluZGV4XG5cdCAgICB9O1xuXHQgICAgaW5wdXQudGFiSW5kZXggPSAtMTtcblx0ICAgIGlucHV0Lmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCBzZWxmLndyYXBwZXIpO1xuXHQgICAgc2VsZi5zeW5jKGZhbHNlKTtcblx0ICAgIHNldHRpbmdzLml0ZW1zID0gW107XG5cdCAgICBkZWxldGUgc2V0dGluZ3Mub3B0Z3JvdXBzO1xuXHQgICAgZGVsZXRlIHNldHRpbmdzLm9wdGlvbnM7XG5cdCAgICBhZGRFdmVudChpbnB1dCwgJ2ludmFsaWQnLCAoKSA9PiB7XG5cdCAgICAgIGlmIChzZWxmLmlzVmFsaWQpIHtcblx0ICAgICAgICBzZWxmLmlzVmFsaWQgPSBmYWxzZTtcblx0ICAgICAgICBzZWxmLmlzSW52YWxpZCA9IHRydWU7XG5cdCAgICAgICAgc2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgICBzZWxmLnVwZGF0ZU9yaWdpbmFsSW5wdXQoKTtcblx0ICAgIHNlbGYucmVmcmVzaEl0ZW1zKCk7XG5cdCAgICBzZWxmLmNsb3NlKGZhbHNlKTtcblx0ICAgIHNlbGYuaW5wdXRTdGF0ZSgpO1xuXHQgICAgc2VsZi5pc1NldHVwID0gdHJ1ZTtcblxuXHQgICAgaWYgKGlucHV0LmRpc2FibGVkKSB7XG5cdCAgICAgIHNlbGYuZGlzYWJsZSgpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2VsZi5lbmFibGUoKTsgLy9zZXRzIHRhYkluZGV4XG5cdCAgICB9XG5cblx0ICAgIHNlbGYub24oJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UpO1xuXHQgICAgYWRkQ2xhc3NlcyhpbnB1dCwgJ3RvbXNlbGVjdGVkJywgJ3RzLWhpZGRlbi1hY2Nlc3NpYmxlJyk7XG5cdCAgICBzZWxmLnRyaWdnZXIoJ2luaXRpYWxpemUnKTsgLy8gcHJlbG9hZCBvcHRpb25zXG5cblx0ICAgIGlmIChzZXR0aW5ncy5wcmVsb2FkID09PSB0cnVlKSB7XG5cdCAgICAgIHNlbGYucHJlbG9hZCgpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZWdpc3RlciBvcHRpb25zIGFuZCBvcHRncm91cHNcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXR1cE9wdGlvbnMob3B0aW9ucyA9IFtdLCBvcHRncm91cHMgPSBbXSkge1xuXHQgICAgLy8gYnVpbGQgb3B0aW9ucyB0YWJsZVxuXHQgICAgdGhpcy5hZGRPcHRpb25zKG9wdGlvbnMpOyAvLyBidWlsZCBvcHRncm91cCB0YWJsZVxuXG5cdCAgICBpdGVyYXRlJDEob3B0Z3JvdXBzLCBvcHRncm91cCA9PiB7XG5cdCAgICAgIHRoaXMucmVnaXN0ZXJPcHRpb25Hcm91cChvcHRncm91cCk7XG5cdCAgICB9KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2V0cyB1cCBkZWZhdWx0IHJlbmRlcmluZyBmdW5jdGlvbnMuXG5cdCAgICovXG5cblxuXHQgIHNldHVwVGVtcGxhdGVzKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIGZpZWxkX2xhYmVsID0gc2VsZi5zZXR0aW5ncy5sYWJlbEZpZWxkO1xuXHQgICAgdmFyIGZpZWxkX29wdGdyb3VwID0gc2VsZi5zZXR0aW5ncy5vcHRncm91cExhYmVsRmllbGQ7XG5cdCAgICB2YXIgdGVtcGxhdGVzID0ge1xuXHQgICAgICAnb3B0Z3JvdXAnOiBkYXRhID0+IHtcblx0ICAgICAgICBsZXQgb3B0Z3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0ICAgICAgICBvcHRncm91cC5jbGFzc05hbWUgPSAnb3B0Z3JvdXAnO1xuXHQgICAgICAgIG9wdGdyb3VwLmFwcGVuZENoaWxkKGRhdGEub3B0aW9ucyk7XG5cdCAgICAgICAgcmV0dXJuIG9wdGdyb3VwO1xuXHQgICAgICB9LFxuXHQgICAgICAnb3B0Z3JvdXBfaGVhZGVyJzogKGRhdGEsIGVzY2FwZSkgPT4ge1xuXHQgICAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cIm9wdGdyb3VwLWhlYWRlclwiPicgKyBlc2NhcGUoZGF0YVtmaWVsZF9vcHRncm91cF0pICsgJzwvZGl2Pic7XG5cdCAgICAgIH0sXG5cdCAgICAgICdvcHRpb24nOiAoZGF0YSwgZXNjYXBlKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuICc8ZGl2PicgKyBlc2NhcGUoZGF0YVtmaWVsZF9sYWJlbF0pICsgJzwvZGl2Pic7XG5cdCAgICAgIH0sXG5cdCAgICAgICdpdGVtJzogKGRhdGEsIGVzY2FwZSkgPT4ge1xuXHQgICAgICAgIHJldHVybiAnPGRpdj4nICsgZXNjYXBlKGRhdGFbZmllbGRfbGFiZWxdKSArICc8L2Rpdj4nO1xuXHQgICAgICB9LFxuXHQgICAgICAnb3B0aW9uX2NyZWF0ZSc6IChkYXRhLCBlc2NhcGUpID0+IHtcblx0ICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcmVhdGVcIj5BZGQgPHN0cm9uZz4nICsgZXNjYXBlKGRhdGEuaW5wdXQpICsgJzwvc3Ryb25nPiZoZWxsaXA7PC9kaXY+Jztcblx0ICAgICAgfSxcblx0ICAgICAgJ25vX3Jlc3VsdHMnOiAoKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwibm8tcmVzdWx0c1wiPk5vIHJlc3VsdHMgZm91bmQ8L2Rpdj4nO1xuXHQgICAgICB9LFxuXHQgICAgICAnbG9hZGluZyc6ICgpID0+IHtcblx0ICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJzcGlubmVyXCI+PC9kaXY+Jztcblx0ICAgICAgfSxcblx0ICAgICAgJ25vdF9sb2FkaW5nJzogKCkgPT4ge30sXG5cdCAgICAgICdkcm9wZG93bic6ICgpID0+IHtcblx0ICAgICAgICByZXR1cm4gJzxkaXY+PC9kaXY+Jztcblx0ICAgICAgfVxuXHQgICAgfTtcblx0ICAgIHNlbGYuc2V0dGluZ3MucmVuZGVyID0gT2JqZWN0LmFzc2lnbih7fSwgdGVtcGxhdGVzLCBzZWxmLnNldHRpbmdzLnJlbmRlcik7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIE1hcHMgZmlyZWQgZXZlbnRzIHRvIGNhbGxiYWNrcyBwcm92aWRlZFxuXHQgICAqIGluIHRoZSBzZXR0aW5ncyB1c2VkIHdoZW4gY3JlYXRpbmcgdGhlIGNvbnRyb2wuXG5cdCAgICovXG5cblxuXHQgIHNldHVwQ2FsbGJhY2tzKCkge1xuXHQgICAgdmFyIGtleSwgZm47XG5cdCAgICB2YXIgY2FsbGJhY2tzID0ge1xuXHQgICAgICAnaW5pdGlhbGl6ZSc6ICdvbkluaXRpYWxpemUnLFxuXHQgICAgICAnY2hhbmdlJzogJ29uQ2hhbmdlJyxcblx0ICAgICAgJ2l0ZW1fYWRkJzogJ29uSXRlbUFkZCcsXG5cdCAgICAgICdpdGVtX3JlbW92ZSc6ICdvbkl0ZW1SZW1vdmUnLFxuXHQgICAgICAnaXRlbV9zZWxlY3QnOiAnb25JdGVtU2VsZWN0Jyxcblx0ICAgICAgJ2NsZWFyJzogJ29uQ2xlYXInLFxuXHQgICAgICAnb3B0aW9uX2FkZCc6ICdvbk9wdGlvbkFkZCcsXG5cdCAgICAgICdvcHRpb25fcmVtb3ZlJzogJ29uT3B0aW9uUmVtb3ZlJyxcblx0ICAgICAgJ29wdGlvbl9jbGVhcic6ICdvbk9wdGlvbkNsZWFyJyxcblx0ICAgICAgJ29wdGdyb3VwX2FkZCc6ICdvbk9wdGlvbkdyb3VwQWRkJyxcblx0ICAgICAgJ29wdGdyb3VwX3JlbW92ZSc6ICdvbk9wdGlvbkdyb3VwUmVtb3ZlJyxcblx0ICAgICAgJ29wdGdyb3VwX2NsZWFyJzogJ29uT3B0aW9uR3JvdXBDbGVhcicsXG5cdCAgICAgICdkcm9wZG93bl9vcGVuJzogJ29uRHJvcGRvd25PcGVuJyxcblx0ICAgICAgJ2Ryb3Bkb3duX2Nsb3NlJzogJ29uRHJvcGRvd25DbG9zZScsXG5cdCAgICAgICd0eXBlJzogJ29uVHlwZScsXG5cdCAgICAgICdsb2FkJzogJ29uTG9hZCcsXG5cdCAgICAgICdmb2N1cyc6ICdvbkZvY3VzJyxcblx0ICAgICAgJ2JsdXInOiAnb25CbHVyJ1xuXHQgICAgfTtcblxuXHQgICAgZm9yIChrZXkgaW4gY2FsbGJhY2tzKSB7XG5cdCAgICAgIGZuID0gdGhpcy5zZXR0aW5nc1tjYWxsYmFja3Nba2V5XV07XG5cdCAgICAgIGlmIChmbikgdGhpcy5vbihrZXksIGZuKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU3luYyB0aGUgVG9tIFNlbGVjdCBpbnN0YW5jZSB3aXRoIHRoZSBvcmlnaW5hbCBpbnB1dCBvciBzZWxlY3Rcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzeW5jKGdldF9zZXR0aW5ncyA9IHRydWUpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgY29uc3Qgc2V0dGluZ3MgPSBnZXRfc2V0dGluZ3MgPyBnZXRTZXR0aW5ncyhzZWxmLmlucHV0LCB7XG5cdCAgICAgIGRlbGltaXRlcjogc2VsZi5zZXR0aW5ncy5kZWxpbWl0ZXJcblx0ICAgIH0pIDogc2VsZi5zZXR0aW5ncztcblx0ICAgIHNlbGYuc2V0dXBPcHRpb25zKHNldHRpbmdzLm9wdGlvbnMsIHNldHRpbmdzLm9wdGdyb3Vwcyk7XG5cdCAgICBzZWxmLnNldFZhbHVlKHNldHRpbmdzLml0ZW1zIHx8IFtdLCB0cnVlKTsgLy8gc2lsZW50IHByZXZlbnRzIHJlY3Vyc2lvblxuXG5cdCAgICBzZWxmLmxhc3RRdWVyeSA9IG51bGw7IC8vIHNvIHVwZGF0ZWQgb3B0aW9ucyB3aWxsIGJlIGRpc3BsYXllZCBpbiBkcm9wZG93blxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgd2hlbiB0aGUgbWFpbiBjb250cm9sIGVsZW1lbnRcblx0ICAgKiBoYXMgYSBjbGljayBldmVudC5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbkNsaWNrKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAoc2VsZi5hY3RpdmVJdGVtcy5sZW5ndGggPiAwKSB7XG5cdCAgICAgIHNlbGYuY2xlYXJBY3RpdmVJdGVtcygpO1xuXHQgICAgICBzZWxmLmZvY3VzKCk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNlbGYuaXNGb2N1c2VkICYmIHNlbGYuaXNPcGVuKSB7XG5cdCAgICAgIHNlbGYuYmx1cigpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2VsZi5mb2N1cygpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBAZGVwcmVjYXRlZCB2MS43XG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25Nb3VzZURvd24oKSB7fVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCB3aGVuIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbCBoYXMgYmVlbiBjaGFuZ2VkLlxuXHQgICAqIFRoaXMgc2hvdWxkIHByb3BhZ2F0ZSB0aGUgZXZlbnQgdG8gdGhlIG9yaWdpbmFsIERPTVxuXHQgICAqIGlucHV0IC8gc2VsZWN0IGVsZW1lbnQuXG5cdCAgICovXG5cblxuXHQgIG9uQ2hhbmdlKCkge1xuXHQgICAgdHJpZ2dlckV2ZW50KHRoaXMuaW5wdXQsICdpbnB1dCcpO1xuXHQgICAgdHJpZ2dlckV2ZW50KHRoaXMuaW5wdXQsICdjaGFuZ2UnKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4gcGFzdGUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25QYXN0ZShlKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cblx0ICAgIGlmIChzZWxmLmlzSW5wdXRIaWRkZW4gfHwgc2VsZi5pc0xvY2tlZCkge1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfSAvLyBJZiBhIHJlZ2V4IG9yIHN0cmluZyBpcyBpbmNsdWRlZCwgdGhpcyB3aWxsIHNwbGl0IHRoZSBwYXN0ZWRcblx0ICAgIC8vIGlucHV0IGFuZCBjcmVhdGUgSXRlbXMgZm9yIGVhY2ggc2VwYXJhdGUgdmFsdWVcblxuXG5cdCAgICBpZiAoIXNlbGYuc2V0dGluZ3Muc3BsaXRPbikge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9IC8vIFdhaXQgZm9yIHBhc3RlZCB0ZXh0IHRvIGJlIHJlY29nbml6ZWQgaW4gdmFsdWVcblxuXG5cdCAgICBzZXRUaW1lb3V0KCgpID0+IHtcblx0ICAgICAgdmFyIHBhc3RlZFRleHQgPSBzZWxmLmlucHV0VmFsdWUoKTtcblxuXHQgICAgICBpZiAoIXBhc3RlZFRleHQubWF0Y2goc2VsZi5zZXR0aW5ncy5zcGxpdE9uKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXG5cdCAgICAgIHZhciBzcGxpdElucHV0ID0gcGFzdGVkVGV4dC50cmltKCkuc3BsaXQoc2VsZi5zZXR0aW5ncy5zcGxpdE9uKTtcblx0ICAgICAgaXRlcmF0ZSQxKHNwbGl0SW5wdXQsIHBpZWNlID0+IHtcblx0ICAgICAgICBjb25zdCBoYXNoID0gaGFzaF9rZXkocGllY2UpO1xuXG5cdCAgICAgICAgaWYgKGhhc2gpIHtcblx0ICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnNbcGllY2VdKSB7XG5cdCAgICAgICAgICAgIHNlbGYuYWRkSXRlbShwaWVjZSk7XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBzZWxmLmNyZWF0ZUl0ZW0ocGllY2UpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9LCAwKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4ga2V5cHJlc3MuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25LZXlQcmVzcyhlKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cblx0ICAgIGlmIChzZWxmLmlzTG9ja2VkKSB7XG5cdCAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHZhciBjaGFyYWN0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSB8fCBlLndoaWNoKTtcblxuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MuY3JlYXRlICYmIHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ211bHRpJyAmJiBjaGFyYWN0ZXIgPT09IHNlbGYuc2V0dGluZ3MuZGVsaW1pdGVyKSB7XG5cdCAgICAgIHNlbGYuY3JlYXRlSXRlbSgpO1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBrZXlkb3duLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uS2V5RG93bihlKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBzZWxmLmlnbm9yZUhvdmVyID0gdHJ1ZTtcblxuXHQgICAgaWYgKHNlbGYuaXNMb2NrZWQpIHtcblx0ICAgICAgaWYgKGUua2V5Q29kZSAhPT0gS0VZX1RBQikge1xuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuXHQgICAgICAvLyBjdHJsK0E6IHNlbGVjdCBhbGxcblx0ICAgICAgY2FzZSBLRVlfQTpcblx0ICAgICAgICBpZiAoaXNLZXlEb3duKEtFWV9TSE9SVENVVCwgZSkpIHtcblx0ICAgICAgICAgIGlmIChzZWxmLmNvbnRyb2xfaW5wdXQudmFsdWUgPT0gJycpIHtcblx0ICAgICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgICAgICAgIHNlbGYuc2VsZWN0QWxsKCk7XG5cdCAgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBicmVhaztcblx0ICAgICAgLy8gZXNjOiBjbG9zZSBkcm9wZG93blxuXG5cdCAgICAgIGNhc2UgS0VZX0VTQzpcblx0ICAgICAgICBpZiAoc2VsZi5pc09wZW4pIHtcblx0ICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUsIHRydWUpO1xuXHQgICAgICAgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHNlbGYuY2xlYXJBY3RpdmVJdGVtcygpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgLy8gZG93bjogb3BlbiBkcm9wZG93biBvciBtb3ZlIHNlbGVjdGlvbiBkb3duXG5cblx0ICAgICAgY2FzZSBLRVlfRE9XTjpcblx0ICAgICAgICBpZiAoIXNlbGYuaXNPcGVuICYmIHNlbGYuaGFzT3B0aW9ucykge1xuXHQgICAgICAgICAgc2VsZi5vcGVuKCk7XG5cdCAgICAgICAgfSBlbHNlIGlmIChzZWxmLmFjdGl2ZU9wdGlvbikge1xuXHQgICAgICAgICAgbGV0IG5leHQgPSBzZWxmLmdldEFkamFjZW50KHNlbGYuYWN0aXZlT3B0aW9uLCAxKTtcblx0ICAgICAgICAgIGlmIChuZXh0KSBzZWxmLnNldEFjdGl2ZU9wdGlvbihuZXh0KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIC8vIHVwOiBtb3ZlIHNlbGVjdGlvbiB1cFxuXG5cdCAgICAgIGNhc2UgS0VZX1VQOlxuXHQgICAgICAgIGlmIChzZWxmLmFjdGl2ZU9wdGlvbikge1xuXHQgICAgICAgICAgbGV0IHByZXYgPSBzZWxmLmdldEFkamFjZW50KHNlbGYuYWN0aXZlT3B0aW9uLCAtMSk7XG5cdCAgICAgICAgICBpZiAocHJldikgc2VsZi5zZXRBY3RpdmVPcHRpb24ocHJldik7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICAvLyByZXR1cm46IHNlbGVjdCBhY3RpdmUgb3B0aW9uXG5cblx0ICAgICAgY2FzZSBLRVlfUkVUVVJOOlxuXHQgICAgICAgIGlmIChzZWxmLmNhblNlbGVjdChzZWxmLmFjdGl2ZU9wdGlvbikpIHtcblx0ICAgICAgICAgIHNlbGYub25PcHRpb25TZWxlY3QoZSwgc2VsZi5hY3RpdmVPcHRpb24pO1xuXHQgICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7IC8vIGlmIHRoZSBvcHRpb25fY3JlYXRlPW51bGwsIHRoZSBkcm9wZG93biBtaWdodCBiZSBjbG9zZWRcblx0ICAgICAgICB9IGVsc2UgaWYgKHNlbGYuc2V0dGluZ3MuY3JlYXRlICYmIHNlbGYuY3JlYXRlSXRlbSgpKSB7XG5cdCAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTsgLy8gZG9uJ3Qgc3VibWl0IGZvcm0gd2hlbiBzZWFyY2hpbmcgZm9yIGEgdmFsdWVcblx0ICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT0gc2VsZi5jb250cm9sX2lucHV0ICYmIHNlbGYuaXNPcGVuKSB7XG5cdCAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIC8vIGxlZnQ6IG1vZGlmaXkgaXRlbSBzZWxlY3Rpb24gdG8gdGhlIGxlZnRcblxuXHQgICAgICBjYXNlIEtFWV9MRUZUOlxuXHQgICAgICAgIHNlbGYuYWR2YW5jZVNlbGVjdGlvbigtMSwgZSk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICAvLyByaWdodDogbW9kaWZpeSBpdGVtIHNlbGVjdGlvbiB0byB0aGUgcmlnaHRcblxuXHQgICAgICBjYXNlIEtFWV9SSUdIVDpcblx0ICAgICAgICBzZWxmLmFkdmFuY2VTZWxlY3Rpb24oMSwgZSk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICAvLyB0YWI6IHNlbGVjdCBhY3RpdmUgb3B0aW9uIGFuZC9vciBjcmVhdGUgaXRlbVxuXG5cdCAgICAgIGNhc2UgS0VZX1RBQjpcblx0ICAgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5zZWxlY3RPblRhYikge1xuXHQgICAgICAgICAgaWYgKHNlbGYuY2FuU2VsZWN0KHNlbGYuYWN0aXZlT3B0aW9uKSkge1xuXHQgICAgICAgICAgICBzZWxmLm9uT3B0aW9uU2VsZWN0KGUsIHNlbGYuYWN0aXZlT3B0aW9uKTsgLy8gcHJldmVudCBkZWZhdWx0IFt0YWJdIGJlaGF2aW91ciBvZiBqdW1wIHRvIHRoZSBuZXh0IGZpZWxkXG5cdCAgICAgICAgICAgIC8vIGlmIHNlbGVjdCBpc0Z1bGwsIHRoZW4gdGhlIGRyb3Bkb3duIHdvbid0IGJlIG9wZW4gYW5kIFt0YWJdIHdpbGwgd29yayBub3JtYWxseVxuXG5cdCAgICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICAgICAgfVxuXG5cdCAgICAgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5jcmVhdGUgJiYgc2VsZi5jcmVhdGVJdGVtKCkpIHtcblx0ICAgICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICAvLyBkZWxldGV8YmFja3NwYWNlOiBkZWxldGUgaXRlbXNcblxuXHQgICAgICBjYXNlIEtFWV9CQUNLU1BBQ0U6XG5cdCAgICAgIGNhc2UgS0VZX0RFTEVURTpcblx0ICAgICAgICBzZWxmLmRlbGV0ZVNlbGVjdGlvbihlKTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICB9IC8vIGRvbid0IGVudGVyIHRleHQgaW4gdGhlIGNvbnRyb2xfaW5wdXQgd2hlbiBhY3RpdmUgaXRlbXMgYXJlIHNlbGVjdGVkXG5cblxuXHQgICAgaWYgKHNlbGYuaXNJbnB1dEhpZGRlbiAmJiAhaXNLZXlEb3duKEtFWV9TSE9SVENVVCwgZSkpIHtcblx0ICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IGtleXVwLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uSW5wdXQoZSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAoc2VsZi5pc0xvY2tlZCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHZhciB2YWx1ZSA9IHNlbGYuaW5wdXRWYWx1ZSgpO1xuXG5cdCAgICBpZiAoc2VsZi5sYXN0VmFsdWUgIT09IHZhbHVlKSB7XG5cdCAgICAgIHNlbGYubGFzdFZhbHVlID0gdmFsdWU7XG5cblx0ICAgICAgaWYgKHNlbGYuc2V0dGluZ3Muc2hvdWxkTG9hZC5jYWxsKHNlbGYsIHZhbHVlKSkge1xuXHQgICAgICAgIHNlbGYubG9hZCh2YWx1ZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICBzZWxmLnJlZnJlc2hPcHRpb25zKCk7XG5cdCAgICAgIHNlbGYudHJpZ2dlcigndHlwZScsIHZhbHVlKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgcm9sbHMgb3ZlclxuXHQgICAqIGFuIG9wdGlvbiBpbiB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duIG1lbnUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25PcHRpb25Ib3ZlcihldnQsIG9wdGlvbikge1xuXHQgICAgaWYgKHRoaXMuaWdub3JlSG92ZXIpIHJldHVybjtcblx0ICAgIHRoaXMuc2V0QWN0aXZlT3B0aW9uKG9wdGlvbiwgZmFsc2UpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBmb2N1cy5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbkZvY3VzKGUpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciB3YXNGb2N1c2VkID0gc2VsZi5pc0ZvY3VzZWQ7XG5cblx0ICAgIGlmIChzZWxmLmlzRGlzYWJsZWQpIHtcblx0ICAgICAgc2VsZi5ibHVyKCk7XG5cdCAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIGlmIChzZWxmLmlnbm9yZUZvY3VzKSByZXR1cm47XG5cdCAgICBzZWxmLmlzRm9jdXNlZCA9IHRydWU7XG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5wcmVsb2FkID09PSAnZm9jdXMnKSBzZWxmLnByZWxvYWQoKTtcblx0ICAgIGlmICghd2FzRm9jdXNlZCkgc2VsZi50cmlnZ2VyKCdmb2N1cycpO1xuXG5cdCAgICBpZiAoIXNlbGYuYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgIHNlbGYuc2hvd0lucHV0KCk7XG5cdCAgICAgIHNlbGYucmVmcmVzaE9wdGlvbnMoISFzZWxmLnNldHRpbmdzLm9wZW5PbkZvY3VzKTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4gYmx1ci5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbkJsdXIoZSkge1xuXHQgICAgaWYgKGRvY3VtZW50Lmhhc0ZvY3VzKCkgPT09IGZhbHNlKSByZXR1cm47XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBpZiAoIXNlbGYuaXNGb2N1c2VkKSByZXR1cm47XG5cdCAgICBzZWxmLmlzRm9jdXNlZCA9IGZhbHNlO1xuXHQgICAgc2VsZi5pZ25vcmVGb2N1cyA9IGZhbHNlO1xuXG5cdCAgICB2YXIgZGVhY3RpdmF0ZSA9ICgpID0+IHtcblx0ICAgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW0oKTtcblx0ICAgICAgc2VsZi5zZXRDYXJldChzZWxmLml0ZW1zLmxlbmd0aCk7XG5cdCAgICAgIHNlbGYudHJpZ2dlcignYmx1cicpO1xuXHQgICAgfTtcblxuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MuY3JlYXRlICYmIHNlbGYuc2V0dGluZ3MuY3JlYXRlT25CbHVyKSB7XG5cdCAgICAgIHNlbGYuY3JlYXRlSXRlbShudWxsLCBkZWFjdGl2YXRlKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGRlYWN0aXZhdGUoKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIGFuIG9wdGlvblxuXHQgICAqIGluIHRoZSBhdXRvY29tcGxldGUgZHJvcGRvd24gbWVudS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbk9wdGlvblNlbGVjdChldnQsIG9wdGlvbikge1xuXHQgICAgdmFyIHZhbHVlLFxuXHQgICAgICAgIHNlbGYgPSB0aGlzOyAvLyBzaG91bGQgbm90IGJlIHBvc3NpYmxlIHRvIHRyaWdnZXIgYSBvcHRpb24gdW5kZXIgYSBkaXNhYmxlZCBvcHRncm91cFxuXG5cdCAgICBpZiAob3B0aW9uLnBhcmVudEVsZW1lbnQgJiYgb3B0aW9uLnBhcmVudEVsZW1lbnQubWF0Y2hlcygnW2RhdGEtZGlzYWJsZWRdJykpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBpZiAob3B0aW9uLmNsYXNzTGlzdC5jb250YWlucygnY3JlYXRlJykpIHtcblx0ICAgICAgc2VsZi5jcmVhdGVJdGVtKG51bGwsICgpID0+IHtcblx0ICAgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5jbG9zZUFmdGVyU2VsZWN0KSB7XG5cdCAgICAgICAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHZhbHVlID0gb3B0aW9uLmRhdGFzZXQudmFsdWU7XG5cblx0ICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICBzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cdCAgICAgICAgc2VsZi5hZGRJdGVtKHZhbHVlKTtcblxuXHQgICAgICAgIGlmIChzZWxmLnNldHRpbmdzLmNsb3NlQWZ0ZXJTZWxlY3QpIHtcblx0ICAgICAgICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZiAoIXNlbGYuc2V0dGluZ3MuaGlkZVNlbGVjdGVkICYmIGV2dC50eXBlICYmIC9jbGljay8udGVzdChldnQudHlwZSkpIHtcblx0ICAgICAgICAgIHNlbGYuc2V0QWN0aXZlT3B0aW9uKG9wdGlvbik7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybiB0cnVlIGlmIHRoZSBnaXZlbiBvcHRpb24gY2FuIGJlIHNlbGVjdGVkXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY2FuU2VsZWN0KG9wdGlvbikge1xuXHQgICAgaWYgKHRoaXMuaXNPcGVuICYmIG9wdGlvbiAmJiB0aGlzLmRyb3Bkb3duX2NvbnRlbnQuY29udGFpbnMob3B0aW9uKSkge1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgd2hlbiB0aGUgdXNlciBjbGlja3Mgb24gYW4gaXRlbVxuXHQgICAqIHRoYXQgaGFzIGJlZW4gc2VsZWN0ZWQuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25JdGVtU2VsZWN0KGV2dCwgaXRlbSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAoIXNlbGYuaXNMb2NrZWQgJiYgc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnbXVsdGknKSB7XG5cdCAgICAgIHByZXZlbnREZWZhdWx0KGV2dCk7XG5cdCAgICAgIHNlbGYuc2V0QWN0aXZlSXRlbShpdGVtLCBldnQpO1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRvIGludm9rZVxuXHQgICAqIHRoZSB1c2VyLXByb3ZpZGVkIG9wdGlvbiBwcm92aWRlciAvIGxvYWRlclxuXHQgICAqXG5cdCAgICogTm90ZSwgdGhlcmUgaXMgYSBzdWJ0bGUgZGlmZmVyZW5jZSBiZXR3ZWVuXG5cdCAgICogdGhpcy5jYW5Mb2FkKCkgYW5kIHRoaXMuc2V0dGluZ3Muc2hvdWxkTG9hZCgpO1xuXHQgICAqXG5cdCAgICpcdC0gc2V0dGluZ3Muc2hvdWxkTG9hZCgpIGlzIGEgdXNlci1pbnB1dCB2YWxpZGF0b3IuXG5cdCAgICpcdFdoZW4gZmFsc2UgaXMgcmV0dXJuZWQsIHRoZSBub3RfbG9hZGluZyB0ZW1wbGF0ZVxuXHQgICAqXHR3aWxsIGJlIGFkZGVkIHRvIHRoZSBkcm9wZG93blxuXHQgICAqXG5cdCAgICpcdC0gY2FuTG9hZCgpIGlzIGxvd2VyIGxldmVsIHZhbGlkYXRvciB0aGF0IGNoZWNrc1xuXHQgICAqIFx0dGhlIFRvbSBTZWxlY3QgaW5zdGFuY2UuIFRoZXJlIGlzIG5vIGluaGVyZW50IHVzZXJcblx0ICAgKlx0ZmVlZGJhY2sgd2hlbiBjYW5Mb2FkIHJldHVybnMgZmFsc2Vcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjYW5Mb2FkKHZhbHVlKSB7XG5cdCAgICBpZiAoIXRoaXMuc2V0dGluZ3MubG9hZCkgcmV0dXJuIGZhbHNlO1xuXHQgICAgaWYgKHRoaXMubG9hZGVkU2VhcmNoZXMuaGFzT3duUHJvcGVydHkodmFsdWUpKSByZXR1cm4gZmFsc2U7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogSW52b2tlcyB0aGUgdXNlci1wcm92aWRlZCBvcHRpb24gcHJvdmlkZXIgLyBsb2FkZXIuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgbG9hZCh2YWx1ZSkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBpZiAoIXNlbGYuY2FuTG9hZCh2YWx1ZSkpIHJldHVybjtcblx0ICAgIGFkZENsYXNzZXMoc2VsZi53cmFwcGVyLCBzZWxmLnNldHRpbmdzLmxvYWRpbmdDbGFzcyk7XG5cdCAgICBzZWxmLmxvYWRpbmcrKztcblx0ICAgIGNvbnN0IGNhbGxiYWNrID0gc2VsZi5sb2FkQ2FsbGJhY2suYmluZChzZWxmKTtcblx0ICAgIHNlbGYuc2V0dGluZ3MubG9hZC5jYWxsKHNlbGYsIHZhbHVlLCBjYWxsYmFjayk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEludm9rZWQgYnkgdGhlIHVzZXItcHJvdmlkZWQgb3B0aW9uIHByb3ZpZGVyXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgbG9hZENhbGxiYWNrKG9wdGlvbnMsIG9wdGdyb3Vwcykge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBzZWxmLmxvYWRpbmcgPSBNYXRoLm1heChzZWxmLmxvYWRpbmcgLSAxLCAwKTtcblx0ICAgIHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblx0ICAgIHNlbGYuY2xlYXJBY3RpdmVPcHRpb24oKTsgLy8gd2hlbiBuZXcgcmVzdWx0cyBsb2FkLCBmb2N1cyBzaG91bGQgYmUgb24gZmlyc3Qgb3B0aW9uXG5cblx0ICAgIHNlbGYuc2V0dXBPcHRpb25zKG9wdGlvbnMsIG9wdGdyb3Vwcyk7XG5cdCAgICBzZWxmLnJlZnJlc2hPcHRpb25zKHNlbGYuaXNGb2N1c2VkICYmICFzZWxmLmlzSW5wdXRIaWRkZW4pO1xuXG5cdCAgICBpZiAoIXNlbGYubG9hZGluZykge1xuXHQgICAgICByZW1vdmVDbGFzc2VzKHNlbGYud3JhcHBlciwgc2VsZi5zZXR0aW5ncy5sb2FkaW5nQ2xhc3MpO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLnRyaWdnZXIoJ2xvYWQnLCBvcHRpb25zLCBvcHRncm91cHMpO1xuXHQgIH1cblxuXHQgIHByZWxvYWQoKSB7XG5cdCAgICB2YXIgY2xhc3NMaXN0ID0gdGhpcy53cmFwcGVyLmNsYXNzTGlzdDtcblx0ICAgIGlmIChjbGFzc0xpc3QuY29udGFpbnMoJ3ByZWxvYWRlZCcpKSByZXR1cm47XG5cdCAgICBjbGFzc0xpc3QuYWRkKCdwcmVsb2FkZWQnKTtcblx0ICAgIHRoaXMubG9hZCgnJyk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNldHMgdGhlIGlucHV0IGZpZWxkIG9mIHRoZSBjb250cm9sIHRvIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2V0VGV4dGJveFZhbHVlKHZhbHVlID0gJycpIHtcblx0ICAgIHZhciBpbnB1dCA9IHRoaXMuY29udHJvbF9pbnB1dDtcblx0ICAgIHZhciBjaGFuZ2VkID0gaW5wdXQudmFsdWUgIT09IHZhbHVlO1xuXG5cdCAgICBpZiAoY2hhbmdlZCkge1xuXHQgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuXHQgICAgICB0cmlnZ2VyRXZlbnQoaW5wdXQsICd1cGRhdGUnKTtcblx0ICAgICAgdGhpcy5sYXN0VmFsdWUgPSB2YWx1ZTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wuIElmIG11bHRpcGxlIGl0ZW1zXG5cdCAgICogY2FuIGJlIHNlbGVjdGVkIChlLmcuIDxzZWxlY3QgbXVsdGlwbGU+KSwgdGhpcyByZXR1cm5zXG5cdCAgICogYW4gYXJyYXkuIElmIG9ubHkgb25lIGl0ZW0gY2FuIGJlIHNlbGVjdGVkLCB0aGlzXG5cdCAgICogcmV0dXJucyBhIHN0cmluZy5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBnZXRWYWx1ZSgpIHtcblx0ICAgIGlmICh0aGlzLmlzX3NlbGVjdF90YWcgJiYgdGhpcy5pbnB1dC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuaXRlbXM7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB0aGlzLml0ZW1zLmpvaW4odGhpcy5zZXR0aW5ncy5kZWxpbWl0ZXIpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXNldHMgdGhlIHNlbGVjdGVkIGl0ZW1zIHRvIHRoZSBnaXZlbiB2YWx1ZS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXRWYWx1ZSh2YWx1ZSwgc2lsZW50KSB7XG5cdCAgICB2YXIgZXZlbnRzID0gc2lsZW50ID8gW10gOiBbJ2NoYW5nZSddO1xuXHQgICAgZGVib3VuY2VfZXZlbnRzKHRoaXMsIGV2ZW50cywgKCkgPT4ge1xuXHQgICAgICB0aGlzLmNsZWFyKHNpbGVudCk7XG5cdCAgICAgIHRoaXMuYWRkSXRlbXModmFsdWUsIHNpbGVudCk7XG5cdCAgICB9KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVzZXRzIHRoZSBudW1iZXIgb2YgbWF4IGl0ZW1zIHRvIHRoZSBnaXZlbiB2YWx1ZVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldE1heEl0ZW1zKHZhbHVlKSB7XG5cdCAgICBpZiAodmFsdWUgPT09IDApIHZhbHVlID0gbnVsbDsgLy9yZXNldCB0byB1bmxpbWl0ZWQgaXRlbXMuXG5cblx0ICAgIHRoaXMuc2V0dGluZ3MubWF4SXRlbXMgPSB2YWx1ZTtcblx0ICAgIHRoaXMucmVmcmVzaFN0YXRlKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNldHMgdGhlIHNlbGVjdGVkIGl0ZW0uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2V0QWN0aXZlSXRlbShpdGVtLCBlKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgZXZlbnROYW1lO1xuXHQgICAgdmFyIGksIGJlZ2luLCBlbmQsIHN3YXA7XG5cdCAgICB2YXIgbGFzdDtcblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdzaW5nbGUnKSByZXR1cm47IC8vIGNsZWFyIHRoZSBhY3RpdmUgc2VsZWN0aW9uXG5cblx0ICAgIGlmICghaXRlbSkge1xuXHQgICAgICBzZWxmLmNsZWFyQWN0aXZlSXRlbXMoKTtcblxuXHQgICAgICBpZiAoc2VsZi5pc0ZvY3VzZWQpIHtcblx0ICAgICAgICBzZWxmLnNob3dJbnB1dCgpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfSAvLyBtb2RpZnkgc2VsZWN0aW9uXG5cblxuXHQgICAgZXZlbnROYW1lID0gZSAmJiBlLnR5cGUudG9Mb3dlckNhc2UoKTtcblxuXHQgICAgaWYgKGV2ZW50TmFtZSA9PT0gJ2NsaWNrJyAmJiBpc0tleURvd24oJ3NoaWZ0S2V5JywgZSkgJiYgc2VsZi5hY3RpdmVJdGVtcy5sZW5ndGgpIHtcblx0ICAgICAgbGFzdCA9IHNlbGYuZ2V0TGFzdEFjdGl2ZSgpO1xuXHQgICAgICBiZWdpbiA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoc2VsZi5jb250cm9sLmNoaWxkcmVuLCBsYXN0KTtcblx0ICAgICAgZW5kID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChzZWxmLmNvbnRyb2wuY2hpbGRyZW4sIGl0ZW0pO1xuXG5cdCAgICAgIGlmIChiZWdpbiA+IGVuZCkge1xuXHQgICAgICAgIHN3YXAgPSBiZWdpbjtcblx0ICAgICAgICBiZWdpbiA9IGVuZDtcblx0ICAgICAgICBlbmQgPSBzd2FwO1xuXHQgICAgICB9XG5cblx0ICAgICAgZm9yIChpID0gYmVnaW47IGkgPD0gZW5kOyBpKyspIHtcblx0ICAgICAgICBpdGVtID0gc2VsZi5jb250cm9sLmNoaWxkcmVuW2ldO1xuXG5cdCAgICAgICAgaWYgKHNlbGYuYWN0aXZlSXRlbXMuaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcblx0ICAgICAgICAgIHNlbGYuc2V0QWN0aXZlSXRlbUNsYXNzKGl0ZW0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgfSBlbHNlIGlmIChldmVudE5hbWUgPT09ICdjbGljaycgJiYgaXNLZXlEb3duKEtFWV9TSE9SVENVVCwgZSkgfHwgZXZlbnROYW1lID09PSAna2V5ZG93bicgJiYgaXNLZXlEb3duKCdzaGlmdEtleScsIGUpKSB7XG5cdCAgICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0ICAgICAgICBzZWxmLnJlbW92ZUFjdGl2ZUl0ZW0oaXRlbSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgc2VsZi5zZXRBY3RpdmVJdGVtQ2xhc3MoaXRlbSk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYuY2xlYXJBY3RpdmVJdGVtcygpO1xuXHQgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW1DbGFzcyhpdGVtKTtcblx0ICAgIH0gLy8gZW5zdXJlIGNvbnRyb2wgaGFzIGZvY3VzXG5cblxuXHQgICAgc2VsZi5oaWRlSW5wdXQoKTtcblxuXHQgICAgaWYgKCFzZWxmLmlzRm9jdXNlZCkge1xuXHQgICAgICBzZWxmLmZvY3VzKCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNldCB0aGUgYWN0aXZlIGFuZCBsYXN0LWFjdGl2ZSBjbGFzc2VzXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2V0QWN0aXZlSXRlbUNsYXNzKGl0ZW0pIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgY29uc3QgbGFzdF9hY3RpdmUgPSBzZWxmLmNvbnRyb2wucXVlcnlTZWxlY3RvcignLmxhc3QtYWN0aXZlJyk7XG5cdCAgICBpZiAobGFzdF9hY3RpdmUpIHJlbW92ZUNsYXNzZXMobGFzdF9hY3RpdmUsICdsYXN0LWFjdGl2ZScpO1xuXHQgICAgYWRkQ2xhc3NlcyhpdGVtLCAnYWN0aXZlIGxhc3QtYWN0aXZlJyk7XG5cdCAgICBzZWxmLnRyaWdnZXIoJ2l0ZW1fc2VsZWN0JywgaXRlbSk7XG5cblx0ICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW1zLmluZGV4T2YoaXRlbSkgPT0gLTEpIHtcblx0ICAgICAgc2VsZi5hY3RpdmVJdGVtcy5wdXNoKGl0ZW0pO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZW1vdmUgYWN0aXZlIGl0ZW1cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICByZW1vdmVBY3RpdmVJdGVtKGl0ZW0pIHtcblx0ICAgIHZhciBpZHggPSB0aGlzLmFjdGl2ZUl0ZW1zLmluZGV4T2YoaXRlbSk7XG5cdCAgICB0aGlzLmFjdGl2ZUl0ZW1zLnNwbGljZShpZHgsIDEpO1xuXHQgICAgcmVtb3ZlQ2xhc3NlcyhpdGVtLCAnYWN0aXZlJyk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIENsZWFycyBhbGwgdGhlIGFjdGl2ZSBpdGVtc1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNsZWFyQWN0aXZlSXRlbXMoKSB7XG5cdCAgICByZW1vdmVDbGFzc2VzKHRoaXMuYWN0aXZlSXRlbXMsICdhY3RpdmUnKTtcblx0ICAgIHRoaXMuYWN0aXZlSXRlbXMgPSBbXTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2V0cyB0aGUgc2VsZWN0ZWQgaXRlbSBpbiB0aGUgZHJvcGRvd24gbWVudVxuXHQgICAqIG9mIGF2YWlsYWJsZSBvcHRpb25zLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldEFjdGl2ZU9wdGlvbihvcHRpb24sIHNjcm9sbCA9IHRydWUpIHtcblx0ICAgIGlmIChvcHRpb24gPT09IHRoaXMuYWN0aXZlT3B0aW9uKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5jbGVhckFjdGl2ZU9wdGlvbigpO1xuXHQgICAgaWYgKCFvcHRpb24pIHJldHVybjtcblx0ICAgIHRoaXMuYWN0aXZlT3B0aW9uID0gb3B0aW9uO1xuXHQgICAgc2V0QXR0cih0aGlzLmZvY3VzX25vZGUsIHtcblx0ICAgICAgJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCc6IG9wdGlvbi5nZXRBdHRyaWJ1dGUoJ2lkJylcblx0ICAgIH0pO1xuXHQgICAgc2V0QXR0cihvcHRpb24sIHtcblx0ICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiAndHJ1ZSdcblx0ICAgIH0pO1xuXHQgICAgYWRkQ2xhc3NlcyhvcHRpb24sICdhY3RpdmUnKTtcblx0ICAgIGlmIChzY3JvbGwpIHRoaXMuc2Nyb2xsVG9PcHRpb24ob3B0aW9uKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2V0cyB0aGUgZHJvcGRvd25fY29udGVudCBzY3JvbGxUb3AgdG8gZGlzcGxheSB0aGUgb3B0aW9uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2Nyb2xsVG9PcHRpb24ob3B0aW9uLCBiZWhhdmlvcikge1xuXHQgICAgaWYgKCFvcHRpb24pIHJldHVybjtcblx0ICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmRyb3Bkb3duX2NvbnRlbnQ7XG5cdCAgICBjb25zdCBoZWlnaHRfbWVudSA9IGNvbnRlbnQuY2xpZW50SGVpZ2h0O1xuXHQgICAgY29uc3Qgc2Nyb2xsVG9wID0gY29udGVudC5zY3JvbGxUb3AgfHwgMDtcblx0ICAgIGNvbnN0IGhlaWdodF9pdGVtID0gb3B0aW9uLm9mZnNldEhlaWdodDtcblx0ICAgIGNvbnN0IHkgPSBvcHRpb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBzY3JvbGxUb3A7XG5cblx0ICAgIGlmICh5ICsgaGVpZ2h0X2l0ZW0gPiBoZWlnaHRfbWVudSArIHNjcm9sbFRvcCkge1xuXHQgICAgICB0aGlzLnNjcm9sbCh5IC0gaGVpZ2h0X21lbnUgKyBoZWlnaHRfaXRlbSwgYmVoYXZpb3IpO1xuXHQgICAgfSBlbHNlIGlmICh5IDwgc2Nyb2xsVG9wKSB7XG5cdCAgICAgIHRoaXMuc2Nyb2xsKHksIGJlaGF2aW9yKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2Nyb2xsIHRoZSBkcm9wZG93biB0byB0aGUgZ2l2ZW4gcG9zaXRpb25cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzY3JvbGwoc2Nyb2xsVG9wLCBiZWhhdmlvcikge1xuXHQgICAgY29uc3QgY29udGVudCA9IHRoaXMuZHJvcGRvd25fY29udGVudDtcblxuXHQgICAgaWYgKGJlaGF2aW9yKSB7XG5cdCAgICAgIGNvbnRlbnQuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSBiZWhhdmlvcjtcblx0ICAgIH1cblxuXHQgICAgY29udGVudC5zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG5cdCAgICBjb250ZW50LnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gJyc7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIENsZWFycyB0aGUgYWN0aXZlIG9wdGlvblxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNsZWFyQWN0aXZlT3B0aW9uKCkge1xuXHQgICAgaWYgKHRoaXMuYWN0aXZlT3B0aW9uKSB7XG5cdCAgICAgIHJlbW92ZUNsYXNzZXModGhpcy5hY3RpdmVPcHRpb24sICdhY3RpdmUnKTtcblx0ICAgICAgc2V0QXR0cih0aGlzLmFjdGl2ZU9wdGlvbiwge1xuXHQgICAgICAgICdhcmlhLXNlbGVjdGVkJzogbnVsbFxuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5hY3RpdmVPcHRpb24gPSBudWxsO1xuXHQgICAgc2V0QXR0cih0aGlzLmZvY3VzX25vZGUsIHtcblx0ICAgICAgJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCc6IG51bGxcblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZWxlY3RzIGFsbCBpdGVtcyAoQ1RSTCArIEEpLlxuXHQgICAqL1xuXG5cblx0ICBzZWxlY3RBbGwoKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdzaW5nbGUnKSByZXR1cm47XG5cdCAgICBjb25zdCBhY3RpdmVJdGVtcyA9IHNlbGYuY29udHJvbENoaWxkcmVuKCk7XG5cdCAgICBpZiAoIWFjdGl2ZUl0ZW1zLmxlbmd0aCkgcmV0dXJuO1xuXHQgICAgc2VsZi5oaWRlSW5wdXQoKTtcblx0ICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgIHNlbGYuYWN0aXZlSXRlbXMgPSBhY3RpdmVJdGVtcztcblx0ICAgIGl0ZXJhdGUkMShhY3RpdmVJdGVtcywgaXRlbSA9PiB7XG5cdCAgICAgIHNlbGYuc2V0QWN0aXZlSXRlbUNsYXNzKGl0ZW0pO1xuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIERldGVybWluZXMgaWYgdGhlIGNvbnRyb2xfaW5wdXQgc2hvdWxkIGJlIGluIGEgaGlkZGVuIG9yIHZpc2libGUgc3RhdGVcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBpbnB1dFN0YXRlKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKCFzZWxmLmNvbnRyb2wuY29udGFpbnMoc2VsZi5jb250cm9sX2lucHV0KSkgcmV0dXJuO1xuXHQgICAgc2V0QXR0cihzZWxmLmNvbnRyb2xfaW5wdXQsIHtcblx0ICAgICAgcGxhY2Vob2xkZXI6IHNlbGYuc2V0dGluZ3MucGxhY2Vob2xkZXJcblx0ICAgIH0pO1xuXG5cdCAgICBpZiAoc2VsZi5hY3RpdmVJdGVtcy5sZW5ndGggPiAwIHx8ICFzZWxmLmlzRm9jdXNlZCAmJiBzZWxmLnNldHRpbmdzLmhpZGVQbGFjZWhvbGRlciAmJiBzZWxmLml0ZW1zLmxlbmd0aCA+IDApIHtcblx0ICAgICAgc2VsZi5zZXRUZXh0Ym94VmFsdWUoKTtcblx0ICAgICAgc2VsZi5pc0lucHV0SGlkZGVuID0gdHJ1ZTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGlmIChzZWxmLnNldHRpbmdzLmhpZGVQbGFjZWhvbGRlciAmJiBzZWxmLml0ZW1zLmxlbmd0aCA+IDApIHtcblx0ICAgICAgICBzZXRBdHRyKHNlbGYuY29udHJvbF9pbnB1dCwge1xuXHQgICAgICAgICAgcGxhY2Vob2xkZXI6ICcnXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblxuXHQgICAgICBzZWxmLmlzSW5wdXRIaWRkZW4gPSBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi53cmFwcGVyLmNsYXNzTGlzdC50b2dnbGUoJ2lucHV0LWhpZGRlbicsIHNlbGYuaXNJbnB1dEhpZGRlbik7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEhpZGVzIHRoZSBpbnB1dCBlbGVtZW50IG91dCBvZiB2aWV3LCB3aGlsZVxuXHQgICAqIHJldGFpbmluZyBpdHMgZm9jdXMuXG5cdCAgICogQGRlcHJlY2F0ZWQgMS4zXG5cdCAgICovXG5cblxuXHQgIGhpZGVJbnB1dCgpIHtcblx0ICAgIHRoaXMuaW5wdXRTdGF0ZSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXN0b3JlcyBpbnB1dCB2aXNpYmlsaXR5LlxuXHQgICAqIEBkZXByZWNhdGVkIDEuM1xuXHQgICAqL1xuXG5cblx0ICBzaG93SW5wdXQoKSB7XG5cdCAgICB0aGlzLmlucHV0U3RhdGUoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogR2V0IHRoZSBpbnB1dCB2YWx1ZVxuXHQgICAqL1xuXG5cblx0ICBpbnB1dFZhbHVlKCkge1xuXHQgICAgcmV0dXJuIHRoaXMuY29udHJvbF9pbnB1dC52YWx1ZS50cmltKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEdpdmVzIHRoZSBjb250cm9sIGZvY3VzLlxuXHQgICAqL1xuXG5cblx0ICBmb2N1cygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIGlmIChzZWxmLmlzRGlzYWJsZWQpIHJldHVybjtcblx0ICAgIHNlbGYuaWdub3JlRm9jdXMgPSB0cnVlO1xuXG5cdCAgICBpZiAoc2VsZi5jb250cm9sX2lucHV0Lm9mZnNldFdpZHRoKSB7XG5cdCAgICAgIHNlbGYuY29udHJvbF9pbnB1dC5mb2N1cygpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2VsZi5mb2N1c19ub2RlLmZvY3VzKCk7XG5cdCAgICB9XG5cblx0ICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuXHQgICAgICBzZWxmLmlnbm9yZUZvY3VzID0gZmFsc2U7XG5cdCAgICAgIHNlbGYub25Gb2N1cygpO1xuXHQgICAgfSwgMCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEZvcmNlcyB0aGUgY29udHJvbCBvdXQgb2YgZm9jdXMuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgYmx1cigpIHtcblx0ICAgIHRoaXMuZm9jdXNfbm9kZS5ibHVyKCk7XG5cdCAgICB0aGlzLm9uQmx1cigpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBzY29yZXMgYW4gb2JqZWN0XG5cdCAgICogdG8gc2hvdyBob3cgZ29vZCBvZiBhIG1hdGNoIGl0IGlzIHRvIHRoZVxuXHQgICAqIHByb3ZpZGVkIHF1ZXJ5LlxuXHQgICAqXG5cdCAgICogQHJldHVybiB7ZnVuY3Rpb259XG5cdCAgICovXG5cblxuXHQgIGdldFNjb3JlRnVuY3Rpb24ocXVlcnkpIHtcblx0ICAgIHJldHVybiB0aGlzLnNpZnRlci5nZXRTY29yZUZ1bmN0aW9uKHF1ZXJ5LCB0aGlzLmdldFNlYXJjaE9wdGlvbnMoKSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgc2VhcmNoIG9wdGlvbnMgZm9yIHNpZnRlciAodGhlIHN5c3RlbVxuXHQgICAqIGZvciBzY29yaW5nIGFuZCBzb3J0aW5nIHJlc3VsdHMpLlxuXHQgICAqXG5cdCAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvc2lmdGVyLmpzXG5cdCAgICogQHJldHVybiB7b2JqZWN0fVxuXHQgICAqL1xuXG5cblx0ICBnZXRTZWFyY2hPcHRpb25zKCkge1xuXHQgICAgdmFyIHNldHRpbmdzID0gdGhpcy5zZXR0aW5ncztcblx0ICAgIHZhciBzb3J0ID0gc2V0dGluZ3Muc29ydEZpZWxkO1xuXG5cdCAgICBpZiAodHlwZW9mIHNldHRpbmdzLnNvcnRGaWVsZCA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgc29ydCA9IFt7XG5cdCAgICAgICAgZmllbGQ6IHNldHRpbmdzLnNvcnRGaWVsZFxuXHQgICAgICB9XTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgZmllbGRzOiBzZXR0aW5ncy5zZWFyY2hGaWVsZCxcblx0ICAgICAgY29uanVuY3Rpb246IHNldHRpbmdzLnNlYXJjaENvbmp1bmN0aW9uLFxuXHQgICAgICBzb3J0OiBzb3J0LFxuXHQgICAgICBuZXN0aW5nOiBzZXR0aW5ncy5uZXN0aW5nXG5cdCAgICB9O1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZWFyY2hlcyB0aHJvdWdoIGF2YWlsYWJsZSBvcHRpb25zIGFuZCByZXR1cm5zXG5cdCAgICogYSBzb3J0ZWQgYXJyYXkgb2YgbWF0Y2hlcy5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZWFyY2gocXVlcnkpIHtcblx0ICAgIHZhciByZXN1bHQsIGNhbGN1bGF0ZVNjb3JlO1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIG9wdGlvbnMgPSB0aGlzLmdldFNlYXJjaE9wdGlvbnMoKTsgLy8gdmFsaWRhdGUgdXNlci1wcm92aWRlZCByZXN1bHQgc2NvcmluZyBmdW5jdGlvblxuXG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5zY29yZSkge1xuXHQgICAgICBjYWxjdWxhdGVTY29yZSA9IHNlbGYuc2V0dGluZ3Muc2NvcmUuY2FsbChzZWxmLCBxdWVyeSk7XG5cblx0ICAgICAgaWYgKHR5cGVvZiBjYWxjdWxhdGVTY29yZSAhPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcignVG9tIFNlbGVjdCBcInNjb3JlXCIgc2V0dGluZyBtdXN0IGJlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgZnVuY3Rpb24nKTtcblx0ICAgICAgfVxuXHQgICAgfSAvLyBwZXJmb3JtIHNlYXJjaFxuXG5cblx0ICAgIGlmIChxdWVyeSAhPT0gc2VsZi5sYXN0UXVlcnkpIHtcblx0ICAgICAgc2VsZi5sYXN0UXVlcnkgPSBxdWVyeTtcblx0ICAgICAgcmVzdWx0ID0gc2VsZi5zaWZ0ZXIuc2VhcmNoKHF1ZXJ5LCBPYmplY3QuYXNzaWduKG9wdGlvbnMsIHtcblx0ICAgICAgICBzY29yZTogY2FsY3VsYXRlU2NvcmVcblx0ICAgICAgfSkpO1xuXHQgICAgICBzZWxmLmN1cnJlbnRSZXN1bHRzID0gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7fSwgc2VsZi5jdXJyZW50UmVzdWx0cyk7XG5cdCAgICB9IC8vIGZpbHRlciBvdXQgc2VsZWN0ZWQgaXRlbXNcblxuXG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQpIHtcblx0ICAgICAgcmVzdWx0Lml0ZW1zID0gcmVzdWx0Lml0ZW1zLmZpbHRlcihpdGVtID0+IHtcblx0ICAgICAgICBsZXQgaGFzaGVkID0gaGFzaF9rZXkoaXRlbS5pZCk7XG5cdCAgICAgICAgcmV0dXJuICEoaGFzaGVkICYmIHNlbGYuaXRlbXMuaW5kZXhPZihoYXNoZWQpICE9PSAtMSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZWZyZXNoZXMgdGhlIGxpc3Qgb2YgYXZhaWxhYmxlIG9wdGlvbnMgc2hvd25cblx0ICAgKiBpbiB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duIG1lbnUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgcmVmcmVzaE9wdGlvbnModHJpZ2dlckRyb3Bkb3duID0gdHJ1ZSkge1xuXHQgICAgdmFyIGksIGosIGssIG4sIG9wdGdyb3VwLCBvcHRncm91cHMsIGh0bWwsIGhhc19jcmVhdGVfb3B0aW9uLCBhY3RpdmVfZ3JvdXA7XG5cdCAgICB2YXIgY3JlYXRlO1xuXHQgICAgY29uc3QgZ3JvdXBzID0ge307XG5cdCAgICBjb25zdCBncm91cHNfb3JkZXIgPSBbXTtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBxdWVyeSA9IHNlbGYuaW5wdXRWYWx1ZSgpO1xuXHQgICAgY29uc3Qgc2FtZV9xdWVyeSA9IHF1ZXJ5ID09PSBzZWxmLmxhc3RRdWVyeSB8fCBxdWVyeSA9PSAnJyAmJiBzZWxmLmxhc3RRdWVyeSA9PSBudWxsO1xuXHQgICAgdmFyIHJlc3VsdHMgPSBzZWxmLnNlYXJjaChxdWVyeSk7XG5cdCAgICB2YXIgYWN0aXZlX29wdGlvbiA9IG51bGw7XG5cdCAgICB2YXIgc2hvd19kcm9wZG93biA9IHNlbGYuc2V0dGluZ3Muc2hvdWxkT3BlbiB8fCBmYWxzZTtcblx0ICAgIHZhciBkcm9wZG93bl9jb250ZW50ID0gc2VsZi5kcm9wZG93bl9jb250ZW50O1xuXG5cdCAgICBpZiAoc2FtZV9xdWVyeSkge1xuXHQgICAgICBhY3RpdmVfb3B0aW9uID0gc2VsZi5hY3RpdmVPcHRpb247XG5cblx0ICAgICAgaWYgKGFjdGl2ZV9vcHRpb24pIHtcblx0ICAgICAgICBhY3RpdmVfZ3JvdXAgPSBhY3RpdmVfb3B0aW9uLmNsb3Nlc3QoJ1tkYXRhLWdyb3VwXScpO1xuXHQgICAgICB9XG5cdCAgICB9IC8vIGJ1aWxkIG1hcmt1cFxuXG5cblx0ICAgIG4gPSByZXN1bHRzLml0ZW1zLmxlbmd0aDtcblxuXHQgICAgaWYgKHR5cGVvZiBzZWxmLnNldHRpbmdzLm1heE9wdGlvbnMgPT09ICdudW1iZXInKSB7XG5cdCAgICAgIG4gPSBNYXRoLm1pbihuLCBzZWxmLnNldHRpbmdzLm1heE9wdGlvbnMpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAobiA+IDApIHtcblx0ICAgICAgc2hvd19kcm9wZG93biA9IHRydWU7XG5cdCAgICB9IC8vIHJlbmRlciBhbmQgZ3JvdXAgYXZhaWxhYmxlIG9wdGlvbnMgaW5kaXZpZHVhbGx5XG5cblxuXHQgICAgZm9yIChpID0gMDsgaSA8IG47IGkrKykge1xuXHQgICAgICAvLyBnZXQgb3B0aW9uIGRvbSBlbGVtZW50XG5cdCAgICAgIGxldCBpdGVtID0gcmVzdWx0cy5pdGVtc1tpXTtcblx0ICAgICAgaWYgKCFpdGVtKSBjb250aW51ZTtcblx0ICAgICAgbGV0IG9wdF92YWx1ZSA9IGl0ZW0uaWQ7XG5cdCAgICAgIGxldCBvcHRpb24gPSBzZWxmLm9wdGlvbnNbb3B0X3ZhbHVlXTtcblx0ICAgICAgaWYgKG9wdGlvbiA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcblx0ICAgICAgbGV0IG9wdF9oYXNoID0gZ2V0X2hhc2gob3B0X3ZhbHVlKTtcblx0ICAgICAgbGV0IG9wdGlvbl9lbCA9IHNlbGYuZ2V0T3B0aW9uKG9wdF9oYXNoLCB0cnVlKTsgLy8gdG9nZ2xlICdzZWxlY3RlZCcgY2xhc3NcblxuXHQgICAgICBpZiAoIXNlbGYuc2V0dGluZ3MuaGlkZVNlbGVjdGVkKSB7XG5cdCAgICAgICAgb3B0aW9uX2VsLmNsYXNzTGlzdC50b2dnbGUoJ3NlbGVjdGVkJywgc2VsZi5pdGVtcy5pbmNsdWRlcyhvcHRfaGFzaCkpO1xuXHQgICAgICB9XG5cblx0ICAgICAgb3B0Z3JvdXAgPSBvcHRpb25bc2VsZi5zZXR0aW5ncy5vcHRncm91cEZpZWxkXSB8fCAnJztcblx0ICAgICAgb3B0Z3JvdXBzID0gQXJyYXkuaXNBcnJheShvcHRncm91cCkgPyBvcHRncm91cCA6IFtvcHRncm91cF07XG5cblx0ICAgICAgZm9yIChqID0gMCwgayA9IG9wdGdyb3VwcyAmJiBvcHRncm91cHMubGVuZ3RoOyBqIDwgazsgaisrKSB7XG5cdCAgICAgICAgb3B0Z3JvdXAgPSBvcHRncm91cHNbal07XG5cblx0ICAgICAgICBpZiAoIXNlbGYub3B0Z3JvdXBzLmhhc093blByb3BlcnR5KG9wdGdyb3VwKSkge1xuXHQgICAgICAgICAgb3B0Z3JvdXAgPSAnJztcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBsZXQgZ3JvdXBfZnJhZ21lbnQgPSBncm91cHNbb3B0Z3JvdXBdO1xuXG5cdCAgICAgICAgaWYgKGdyb3VwX2ZyYWdtZW50ID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgIGdyb3VwX2ZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHQgICAgICAgICAgZ3JvdXBzX29yZGVyLnB1c2gob3B0Z3JvdXApO1xuXHQgICAgICAgIH0gLy8gbm9kZXMgY2FuIG9ubHkgaGF2ZSBvbmUgcGFyZW50LCBzbyBpZiB0aGUgb3B0aW9uIGlzIGluIG11dHBsZSBncm91cHMsIHdlIG5lZWQgYSBjbG9uZVxuXG5cblx0ICAgICAgICBpZiAoaiA+IDApIHtcblx0ICAgICAgICAgIG9wdGlvbl9lbCA9IG9wdGlvbl9lbC5jbG9uZU5vZGUodHJ1ZSk7XG5cdCAgICAgICAgICBzZXRBdHRyKG9wdGlvbl9lbCwge1xuXHQgICAgICAgICAgICBpZDogb3B0aW9uLiRpZCArICctY2xvbmUtJyArIGosXG5cdCAgICAgICAgICAgICdhcmlhLXNlbGVjdGVkJzogbnVsbFxuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgICBvcHRpb25fZWwuY2xhc3NMaXN0LmFkZCgndHMtY2xvbmVkJyk7XG5cdCAgICAgICAgICByZW1vdmVDbGFzc2VzKG9wdGlvbl9lbCwgJ2FjdGl2ZScpOyAvLyBtYWtlIHN1cmUgd2Uga2VlcCB0aGUgYWN0aXZlT3B0aW9uIGluIHRoZSBzYW1lIGdyb3VwXG5cblx0ICAgICAgICAgIGlmIChzZWxmLmFjdGl2ZU9wdGlvbiAmJiBzZWxmLmFjdGl2ZU9wdGlvbi5kYXRhc2V0LnZhbHVlID09IG9wdF92YWx1ZSkge1xuXHQgICAgICAgICAgICBpZiAoYWN0aXZlX2dyb3VwICYmIGFjdGl2ZV9ncm91cC5kYXRhc2V0Lmdyb3VwID09PSBvcHRncm91cC50b1N0cmluZygpKSB7XG5cdCAgICAgICAgICAgICAgYWN0aXZlX29wdGlvbiA9IG9wdGlvbl9lbDtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGdyb3VwX2ZyYWdtZW50LmFwcGVuZENoaWxkKG9wdGlvbl9lbCk7XG5cdCAgICAgICAgZ3JvdXBzW29wdGdyb3VwXSA9IGdyb3VwX2ZyYWdtZW50O1xuXHQgICAgICB9XG5cdCAgICB9IC8vIHNvcnQgb3B0Z3JvdXBzXG5cblxuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MubG9ja09wdGdyb3VwT3JkZXIpIHtcblx0ICAgICAgZ3JvdXBzX29yZGVyLnNvcnQoKGEsIGIpID0+IHtcblx0ICAgICAgICBjb25zdCBncnBfYSA9IHNlbGYub3B0Z3JvdXBzW2FdO1xuXHQgICAgICAgIGNvbnN0IGdycF9iID0gc2VsZi5vcHRncm91cHNbYl07XG5cdCAgICAgICAgY29uc3QgYV9vcmRlciA9IGdycF9hICYmIGdycF9hLiRvcmRlciB8fCAwO1xuXHQgICAgICAgIGNvbnN0IGJfb3JkZXIgPSBncnBfYiAmJiBncnBfYi4kb3JkZXIgfHwgMDtcblx0ICAgICAgICByZXR1cm4gYV9vcmRlciAtIGJfb3JkZXI7XG5cdCAgICAgIH0pO1xuXHQgICAgfSAvLyByZW5kZXIgb3B0Z3JvdXAgaGVhZGVycyAmIGpvaW4gZ3JvdXBzXG5cblxuXHQgICAgaHRtbCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0ICAgIGl0ZXJhdGUkMShncm91cHNfb3JkZXIsIG9wdGdyb3VwID0+IHtcblx0ICAgICAgbGV0IGdyb3VwX2ZyYWdtZW50ID0gZ3JvdXBzW29wdGdyb3VwXTtcblx0ICAgICAgaWYgKCFncm91cF9mcmFnbWVudCB8fCAhZ3JvdXBfZnJhZ21lbnQuY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm47XG5cdCAgICAgIGxldCBncm91cF9oZWFkaW5nID0gc2VsZi5vcHRncm91cHNbb3B0Z3JvdXBdO1xuXG5cdCAgICAgIGlmIChncm91cF9oZWFkaW5nICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICBsZXQgZ3JvdXBfb3B0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0ICAgICAgICBsZXQgaGVhZGVyID0gc2VsZi5yZW5kZXIoJ29wdGdyb3VwX2hlYWRlcicsIGdyb3VwX2hlYWRpbmcpO1xuXHQgICAgICAgIGFwcGVuZChncm91cF9vcHRpb25zLCBoZWFkZXIpO1xuXHQgICAgICAgIGFwcGVuZChncm91cF9vcHRpb25zLCBncm91cF9mcmFnbWVudCk7XG5cdCAgICAgICAgbGV0IGdyb3VwX2h0bWwgPSBzZWxmLnJlbmRlcignb3B0Z3JvdXAnLCB7XG5cdCAgICAgICAgICBncm91cDogZ3JvdXBfaGVhZGluZyxcblx0ICAgICAgICAgIG9wdGlvbnM6IGdyb3VwX29wdGlvbnNcblx0ICAgICAgICB9KTtcblx0ICAgICAgICBhcHBlbmQoaHRtbCwgZ3JvdXBfaHRtbCk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgYXBwZW5kKGh0bWwsIGdyb3VwX2ZyYWdtZW50KTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgICBkcm9wZG93bl9jb250ZW50LmlubmVySFRNTCA9ICcnO1xuXHQgICAgYXBwZW5kKGRyb3Bkb3duX2NvbnRlbnQsIGh0bWwpOyAvLyBoaWdobGlnaHQgbWF0Y2hpbmcgdGVybXMgaW5saW5lXG5cblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLmhpZ2hsaWdodCkge1xuXHQgICAgICByZW1vdmVIaWdobGlnaHQoZHJvcGRvd25fY29udGVudCk7XG5cblx0ICAgICAgaWYgKHJlc3VsdHMucXVlcnkubGVuZ3RoICYmIHJlc3VsdHMudG9rZW5zLmxlbmd0aCkge1xuXHQgICAgICAgIGl0ZXJhdGUkMShyZXN1bHRzLnRva2VucywgdG9rID0+IHtcblx0ICAgICAgICAgIGhpZ2hsaWdodChkcm9wZG93bl9jb250ZW50LCB0b2sucmVnZXgpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9IC8vIGhlbHBlciBtZXRob2QgZm9yIGFkZGluZyB0ZW1wbGF0ZXMgdG8gZHJvcGRvd25cblxuXG5cdCAgICB2YXIgYWRkX3RlbXBsYXRlID0gdGVtcGxhdGUgPT4ge1xuXHQgICAgICBsZXQgY29udGVudCA9IHNlbGYucmVuZGVyKHRlbXBsYXRlLCB7XG5cdCAgICAgICAgaW5wdXQ6IHF1ZXJ5XG5cdCAgICAgIH0pO1xuXG5cdCAgICAgIGlmIChjb250ZW50KSB7XG5cdCAgICAgICAgc2hvd19kcm9wZG93biA9IHRydWU7XG5cdCAgICAgICAgZHJvcGRvd25fY29udGVudC5pbnNlcnRCZWZvcmUoY29udGVudCwgZHJvcGRvd25fY29udGVudC5maXJzdENoaWxkKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBjb250ZW50O1xuXHQgICAgfTsgLy8gYWRkIGxvYWRpbmcgbWVzc2FnZVxuXG5cblx0ICAgIGlmIChzZWxmLmxvYWRpbmcpIHtcblx0ICAgICAgYWRkX3RlbXBsYXRlKCdsb2FkaW5nJyk7IC8vIGludmFsaWQgcXVlcnlcblx0ICAgIH0gZWxzZSBpZiAoIXNlbGYuc2V0dGluZ3Muc2hvdWxkTG9hZC5jYWxsKHNlbGYsIHF1ZXJ5KSkge1xuXHQgICAgICBhZGRfdGVtcGxhdGUoJ25vdF9sb2FkaW5nJyk7IC8vIGFkZCBub19yZXN1bHRzIG1lc3NhZ2Vcblx0ICAgIH0gZWxzZSBpZiAocmVzdWx0cy5pdGVtcy5sZW5ndGggPT09IDApIHtcblx0ICAgICAgYWRkX3RlbXBsYXRlKCdub19yZXN1bHRzJyk7XG5cdCAgICB9IC8vIGFkZCBjcmVhdGUgb3B0aW9uXG5cblxuXHQgICAgaGFzX2NyZWF0ZV9vcHRpb24gPSBzZWxmLmNhbkNyZWF0ZShxdWVyeSk7XG5cblx0ICAgIGlmIChoYXNfY3JlYXRlX29wdGlvbikge1xuXHQgICAgICBjcmVhdGUgPSBhZGRfdGVtcGxhdGUoJ29wdGlvbl9jcmVhdGUnKTtcblx0ICAgIH0gLy8gYWN0aXZhdGVcblxuXG5cdCAgICBzZWxmLmhhc09wdGlvbnMgPSByZXN1bHRzLml0ZW1zLmxlbmd0aCA+IDAgfHwgaGFzX2NyZWF0ZV9vcHRpb247XG5cblx0ICAgIGlmIChzaG93X2Ryb3Bkb3duKSB7XG5cdCAgICAgIGlmIChyZXN1bHRzLml0ZW1zLmxlbmd0aCA+IDApIHtcblx0ICAgICAgICBpZiAoIWFjdGl2ZV9vcHRpb24gJiYgc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJyAmJiBzZWxmLml0ZW1zWzBdICE9IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgYWN0aXZlX29wdGlvbiA9IHNlbGYuZ2V0T3B0aW9uKHNlbGYuaXRlbXNbMF0pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmICghZHJvcGRvd25fY29udGVudC5jb250YWlucyhhY3RpdmVfb3B0aW9uKSkge1xuXHQgICAgICAgICAgbGV0IGFjdGl2ZV9pbmRleCA9IDA7XG5cblx0ICAgICAgICAgIGlmIChjcmVhdGUgJiYgIXNlbGYuc2V0dGluZ3MuYWRkUHJlY2VkZW5jZSkge1xuXHQgICAgICAgICAgICBhY3RpdmVfaW5kZXggPSAxO1xuXHQgICAgICAgICAgfVxuXG5cdCAgICAgICAgICBhY3RpdmVfb3B0aW9uID0gc2VsZi5zZWxlY3RhYmxlKClbYWN0aXZlX2luZGV4XTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSBpZiAoY3JlYXRlKSB7XG5cdCAgICAgICAgYWN0aXZlX29wdGlvbiA9IGNyZWF0ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICh0cmlnZ2VyRHJvcGRvd24gJiYgIXNlbGYuaXNPcGVuKSB7XG5cdCAgICAgICAgc2VsZi5vcGVuKCk7XG5cdCAgICAgICAgc2VsZi5zY3JvbGxUb09wdGlvbihhY3RpdmVfb3B0aW9uLCAnYXV0bycpO1xuXHQgICAgICB9XG5cblx0ICAgICAgc2VsZi5zZXRBY3RpdmVPcHRpb24oYWN0aXZlX29wdGlvbik7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZWxmLmNsZWFyQWN0aXZlT3B0aW9uKCk7XG5cblx0ICAgICAgaWYgKHRyaWdnZXJEcm9wZG93biAmJiBzZWxmLmlzT3Blbikge1xuXHQgICAgICAgIHNlbGYuY2xvc2UoZmFsc2UpOyAvLyBpZiBjcmVhdGVfb3B0aW9uPW51bGwsIHdlIHdhbnQgdGhlIGRyb3Bkb3duIHRvIGNsb3NlIGJ1dCBub3QgcmVzZXQgdGhlIHRleHRib3ggdmFsdWVcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm4gbGlzdCBvZiBzZWxlY3RhYmxlIG9wdGlvbnNcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZWxlY3RhYmxlKCkge1xuXHQgICAgcmV0dXJuIHRoaXMuZHJvcGRvd25fY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1zZWxlY3RhYmxlXScpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBBZGRzIGFuIGF2YWlsYWJsZSBvcHRpb24uIElmIGl0IGFscmVhZHkgZXhpc3RzLFxuXHQgICAqIG5vdGhpbmcgd2lsbCBoYXBwZW4uIE5vdGU6IHRoaXMgZG9lcyBub3QgcmVmcmVzaFxuXHQgICAqIHRoZSBvcHRpb25zIGxpc3QgZHJvcGRvd24gKHVzZSBgcmVmcmVzaE9wdGlvbnNgXG5cdCAgICogZm9yIHRoYXQpLlxuXHQgICAqXG5cdCAgICogVXNhZ2U6XG5cdCAgICpcblx0ICAgKiAgIHRoaXMuYWRkT3B0aW9uKGRhdGEpXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgYWRkT3B0aW9uKGRhdGEsIHVzZXJfY3JlYXRlZCA9IGZhbHNlKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpczsgLy8gQGRlcHJlY2F0ZWQgMS43Ljdcblx0ICAgIC8vIHVzZSBhZGRPcHRpb25zKCBhcnJheSwgdXNlcl9jcmVhdGVkICkgZm9yIGFkZGluZyBtdWx0aXBsZSBvcHRpb25zXG5cblx0ICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG5cdCAgICAgIHNlbGYuYWRkT3B0aW9ucyhkYXRhLCB1c2VyX2NyZWF0ZWQpO1xuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIGNvbnN0IGtleSA9IGhhc2hfa2V5KGRhdGFbc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXSk7XG5cblx0ICAgIGlmIChrZXkgPT09IG51bGwgfHwgc2VsZi5vcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICBkYXRhLiRvcmRlciA9IGRhdGEuJG9yZGVyIHx8ICsrc2VsZi5vcmRlcjtcblx0ICAgIGRhdGEuJGlkID0gc2VsZi5pbnB1dElkICsgJy1vcHQtJyArIGRhdGEuJG9yZGVyO1xuXHQgICAgc2VsZi5vcHRpb25zW2tleV0gPSBkYXRhO1xuXHQgICAgc2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXG5cdCAgICBpZiAodXNlcl9jcmVhdGVkKSB7XG5cdCAgICAgIHNlbGYudXNlck9wdGlvbnNba2V5XSA9IHVzZXJfY3JlYXRlZDtcblx0ICAgICAgc2VsZi50cmlnZ2VyKCdvcHRpb25fYWRkJywga2V5LCBkYXRhKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGtleTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQWRkIG11bHRpcGxlIG9wdGlvbnNcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBhZGRPcHRpb25zKGRhdGEsIHVzZXJfY3JlYXRlZCA9IGZhbHNlKSB7XG5cdCAgICBpdGVyYXRlJDEoZGF0YSwgZGF0ID0+IHtcblx0ICAgICAgdGhpcy5hZGRPcHRpb24oZGF0LCB1c2VyX2NyZWF0ZWQpO1xuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEBkZXByZWNhdGVkIDEuNy43XG5cdCAgICovXG5cblxuXHQgIHJlZ2lzdGVyT3B0aW9uKGRhdGEpIHtcblx0ICAgIHJldHVybiB0aGlzLmFkZE9wdGlvbihkYXRhKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVnaXN0ZXJzIGFuIG9wdGlvbiBncm91cCB0byB0aGUgcG9vbCBvZiBvcHRpb24gZ3JvdXBzLlxuXHQgICAqXG5cdCAgICogQHJldHVybiB7Ym9vbGVhbnxzdHJpbmd9XG5cdCAgICovXG5cblxuXHQgIHJlZ2lzdGVyT3B0aW9uR3JvdXAoZGF0YSkge1xuXHQgICAgdmFyIGtleSA9IGhhc2hfa2V5KGRhdGFbdGhpcy5zZXR0aW5ncy5vcHRncm91cFZhbHVlRmllbGRdKTtcblx0ICAgIGlmIChrZXkgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0ICAgIGRhdGEuJG9yZGVyID0gZGF0YS4kb3JkZXIgfHwgKyt0aGlzLm9yZGVyO1xuXHQgICAgdGhpcy5vcHRncm91cHNba2V5XSA9IGRhdGE7XG5cdCAgICByZXR1cm4ga2V5O1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZWdpc3RlcnMgYSBuZXcgb3B0Z3JvdXAgZm9yIG9wdGlvbnNcblx0ICAgKiB0byBiZSBidWNrZXRlZCBpbnRvLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGFkZE9wdGlvbkdyb3VwKGlkLCBkYXRhKSB7XG5cdCAgICB2YXIgaGFzaGVkX2lkO1xuXHQgICAgZGF0YVt0aGlzLnNldHRpbmdzLm9wdGdyb3VwVmFsdWVGaWVsZF0gPSBpZDtcblxuXHQgICAgaWYgKGhhc2hlZF9pZCA9IHRoaXMucmVnaXN0ZXJPcHRpb25Hcm91cChkYXRhKSkge1xuXHQgICAgICB0aGlzLnRyaWdnZXIoJ29wdGdyb3VwX2FkZCcsIGhhc2hlZF9pZCwgZGF0YSk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlbW92ZXMgYW4gZXhpc3Rpbmcgb3B0aW9uIGdyb3VwLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHJlbW92ZU9wdGlvbkdyb3VwKGlkKSB7XG5cdCAgICBpZiAodGhpcy5vcHRncm91cHMuaGFzT3duUHJvcGVydHkoaWQpKSB7XG5cdCAgICAgIGRlbGV0ZSB0aGlzLm9wdGdyb3Vwc1tpZF07XG5cdCAgICAgIHRoaXMuY2xlYXJDYWNoZSgpO1xuXHQgICAgICB0aGlzLnRyaWdnZXIoJ29wdGdyb3VwX3JlbW92ZScsIGlkKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQ2xlYXJzIGFsbCBleGlzdGluZyBvcHRpb24gZ3JvdXBzLlxuXHQgICAqL1xuXG5cblx0ICBjbGVhck9wdGlvbkdyb3VwcygpIHtcblx0ICAgIHRoaXMub3B0Z3JvdXBzID0ge307XG5cdCAgICB0aGlzLmNsZWFyQ2FjaGUoKTtcblx0ICAgIHRoaXMudHJpZ2dlcignb3B0Z3JvdXBfY2xlYXInKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVXBkYXRlcyBhbiBvcHRpb24gYXZhaWxhYmxlIGZvciBzZWxlY3Rpb24uIElmXG5cdCAgICogaXQgaXMgdmlzaWJsZSBpbiB0aGUgc2VsZWN0ZWQgaXRlbXMgb3Igb3B0aW9uc1xuXHQgICAqIGRyb3Bkb3duLCBpdCB3aWxsIGJlIHJlLXJlbmRlcmVkIGF1dG9tYXRpY2FsbHkuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgdXBkYXRlT3B0aW9uKHZhbHVlLCBkYXRhKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIHZhciBpdGVtX25ldztcblx0ICAgIHZhciBpbmRleF9pdGVtO1xuXHQgICAgY29uc3QgdmFsdWVfb2xkID0gaGFzaF9rZXkodmFsdWUpO1xuXHQgICAgY29uc3QgdmFsdWVfbmV3ID0gaGFzaF9rZXkoZGF0YVtzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdKTsgLy8gc2FuaXR5IGNoZWNrc1xuXG5cdCAgICBpZiAodmFsdWVfb2xkID09PSBudWxsKSByZXR1cm47XG5cdCAgICBjb25zdCBkYXRhX29sZCA9IHNlbGYub3B0aW9uc1t2YWx1ZV9vbGRdO1xuXHQgICAgaWYgKGRhdGFfb2xkID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXHQgICAgaWYgKHR5cGVvZiB2YWx1ZV9uZXcgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIG11c3QgYmUgc2V0IGluIG9wdGlvbiBkYXRhJyk7XG5cdCAgICBjb25zdCBvcHRpb24gPSBzZWxmLmdldE9wdGlvbih2YWx1ZV9vbGQpO1xuXHQgICAgY29uc3QgaXRlbSA9IHNlbGYuZ2V0SXRlbSh2YWx1ZV9vbGQpO1xuXHQgICAgZGF0YS4kb3JkZXIgPSBkYXRhLiRvcmRlciB8fCBkYXRhX29sZC4kb3JkZXI7XG5cdCAgICBkZWxldGUgc2VsZi5vcHRpb25zW3ZhbHVlX29sZF07IC8vIGludmFsaWRhdGUgcmVuZGVyIGNhY2hlXG5cdCAgICAvLyBkb24ndCByZW1vdmUgZXhpc3Rpbmcgbm9kZSB5ZXQsIHdlJ2xsIHJlbW92ZSBpdCBhZnRlciByZXBsYWNpbmcgaXRcblxuXHQgICAgc2VsZi51bmNhY2hlVmFsdWUodmFsdWVfbmV3KTtcblx0ICAgIHNlbGYub3B0aW9uc1t2YWx1ZV9uZXddID0gZGF0YTsgLy8gdXBkYXRlIHRoZSBvcHRpb24gaWYgaXQncyBpbiB0aGUgZHJvcGRvd25cblxuXHQgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICBpZiAoc2VsZi5kcm9wZG93bl9jb250ZW50LmNvbnRhaW5zKG9wdGlvbikpIHtcblx0ICAgICAgICBjb25zdCBvcHRpb25fbmV3ID0gc2VsZi5fcmVuZGVyKCdvcHRpb24nLCBkYXRhKTtcblxuXHQgICAgICAgIHJlcGxhY2VOb2RlKG9wdGlvbiwgb3B0aW9uX25ldyk7XG5cblx0ICAgICAgICBpZiAoc2VsZi5hY3RpdmVPcHRpb24gPT09IG9wdGlvbikge1xuXHQgICAgICAgICAgc2VsZi5zZXRBY3RpdmVPcHRpb24ob3B0aW9uX25ldyk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgb3B0aW9uLnJlbW92ZSgpO1xuXHQgICAgfSAvLyB1cGRhdGUgdGhlIGl0ZW0gaWYgd2UgaGF2ZSBvbmVcblxuXG5cdCAgICBpZiAoaXRlbSkge1xuXHQgICAgICBpbmRleF9pdGVtID0gc2VsZi5pdGVtcy5pbmRleE9mKHZhbHVlX29sZCk7XG5cblx0ICAgICAgaWYgKGluZGV4X2l0ZW0gIT09IC0xKSB7XG5cdCAgICAgICAgc2VsZi5pdGVtcy5zcGxpY2UoaW5kZXhfaXRlbSwgMSwgdmFsdWVfbmV3KTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGl0ZW1fbmV3ID0gc2VsZi5fcmVuZGVyKCdpdGVtJywgZGF0YSk7XG5cdCAgICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIGFkZENsYXNzZXMoaXRlbV9uZXcsICdhY3RpdmUnKTtcblx0ICAgICAgcmVwbGFjZU5vZGUoaXRlbSwgaXRlbV9uZXcpO1xuXHQgICAgfSAvLyBpbnZhbGlkYXRlIGxhc3QgcXVlcnkgYmVjYXVzZSB3ZSBtaWdodCBoYXZlIHVwZGF0ZWQgdGhlIHNvcnRGaWVsZFxuXG5cblx0ICAgIHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVtb3ZlcyBhIHNpbmdsZSBvcHRpb24uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgcmVtb3ZlT3B0aW9uKHZhbHVlLCBzaWxlbnQpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgdmFsdWUgPSBnZXRfaGFzaCh2YWx1ZSk7XG5cdCAgICBzZWxmLnVuY2FjaGVWYWx1ZSh2YWx1ZSk7XG5cdCAgICBkZWxldGUgc2VsZi51c2VyT3B0aW9uc1t2YWx1ZV07XG5cdCAgICBkZWxldGUgc2VsZi5vcHRpb25zW3ZhbHVlXTtcblx0ICAgIHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblx0ICAgIHNlbGYudHJpZ2dlcignb3B0aW9uX3JlbW92ZScsIHZhbHVlKTtcblx0ICAgIHNlbGYucmVtb3ZlSXRlbSh2YWx1ZSwgc2lsZW50KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQ2xlYXJzIGFsbCBvcHRpb25zLlxuXHQgICAqL1xuXG5cblx0ICBjbGVhck9wdGlvbnMoZmlsdGVyKSB7XG5cdCAgICBjb25zdCBib3VuZEZpbHRlciA9IChmaWx0ZXIgfHwgdGhpcy5jbGVhckZpbHRlcikuYmluZCh0aGlzKTtcblx0ICAgIHRoaXMubG9hZGVkU2VhcmNoZXMgPSB7fTtcblx0ICAgIHRoaXMudXNlck9wdGlvbnMgPSB7fTtcblx0ICAgIHRoaXMuY2xlYXJDYWNoZSgpO1xuXHQgICAgY29uc3Qgc2VsZWN0ZWQgPSB7fTtcblx0ICAgIGl0ZXJhdGUkMSh0aGlzLm9wdGlvbnMsIChvcHRpb24sIGtleSkgPT4ge1xuXHQgICAgICBpZiAoYm91bmRGaWx0ZXIob3B0aW9uLCBrZXkpKSB7XG5cdCAgICAgICAgc2VsZWN0ZWRba2V5XSA9IG9wdGlvbjtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLnNpZnRlci5pdGVtcyA9IHNlbGVjdGVkO1xuXHQgICAgdGhpcy5sYXN0UXVlcnkgPSBudWxsO1xuXHQgICAgdGhpcy50cmlnZ2VyKCdvcHRpb25fY2xlYXInKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVXNlZCBieSBjbGVhck9wdGlvbnMoKSB0byBkZWNpZGUgd2hldGhlciBvciBub3QgYW4gb3B0aW9uIHNob3VsZCBiZSByZW1vdmVkXG5cdCAgICogUmV0dXJuIHRydWUgdG8ga2VlcCBhbiBvcHRpb24sIGZhbHNlIHRvIHJlbW92ZVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNsZWFyRmlsdGVyKG9wdGlvbiwgdmFsdWUpIHtcblx0ICAgIGlmICh0aGlzLml0ZW1zLmluZGV4T2YodmFsdWUpID49IDApIHtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJucyB0aGUgZG9tIGVsZW1lbnQgb2YgdGhlIG9wdGlvblxuXHQgICAqIG1hdGNoaW5nIHRoZSBnaXZlbiB2YWx1ZS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBnZXRPcHRpb24odmFsdWUsIGNyZWF0ZSA9IGZhbHNlKSB7XG5cdCAgICBjb25zdCBoYXNoZWQgPSBoYXNoX2tleSh2YWx1ZSk7XG5cdCAgICBpZiAoaGFzaGVkID09PSBudWxsKSByZXR1cm4gbnVsbDtcblx0ICAgIGNvbnN0IG9wdGlvbiA9IHRoaXMub3B0aW9uc1toYXNoZWRdO1xuXG5cdCAgICBpZiAob3B0aW9uICE9IHVuZGVmaW5lZCkge1xuXHQgICAgICBpZiAob3B0aW9uLiRkaXYpIHtcblx0ICAgICAgICByZXR1cm4gb3B0aW9uLiRkaXY7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoY3JlYXRlKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlcignb3B0aW9uJywgb3B0aW9uKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gbnVsbDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJucyB0aGUgZG9tIGVsZW1lbnQgb2YgdGhlIG5leHQgb3IgcHJldmlvdXMgZG9tIGVsZW1lbnQgb2YgdGhlIHNhbWUgdHlwZVxuXHQgICAqIE5vdGU6IGFkamFjZW50IG9wdGlvbnMgbWF5IG5vdCBiZSBhZGphY2VudCBET00gZWxlbWVudHMgKG9wdGdyb3Vwcylcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBnZXRBZGphY2VudChvcHRpb24sIGRpcmVjdGlvbiwgdHlwZSA9ICdvcHRpb24nKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXMsXG5cdCAgICAgICAgYWxsO1xuXG5cdCAgICBpZiAoIW9wdGlvbikge1xuXHQgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH1cblxuXHQgICAgaWYgKHR5cGUgPT0gJ2l0ZW0nKSB7XG5cdCAgICAgIGFsbCA9IHNlbGYuY29udHJvbENoaWxkcmVuKCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBhbGwgPSBzZWxmLmRyb3Bkb3duX2NvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc2VsZWN0YWJsZV0nKTtcblx0ICAgIH1cblxuXHQgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGwubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgaWYgKGFsbFtpXSAhPSBvcHRpb24pIHtcblx0ICAgICAgICBjb250aW51ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG5cdCAgICAgICAgcmV0dXJuIGFsbFtpICsgMV07XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gYWxsW2kgLSAxXTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIG51bGw7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgdGhlIGRvbSBlbGVtZW50IG9mIHRoZSBpdGVtXG5cdCAgICogbWF0Y2hpbmcgdGhlIGdpdmVuIHZhbHVlLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGdldEl0ZW0oaXRlbSkge1xuXHQgICAgaWYgKHR5cGVvZiBpdGVtID09ICdvYmplY3QnKSB7XG5cdCAgICAgIHJldHVybiBpdGVtO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgdmFsdWUgPSBoYXNoX2tleShpdGVtKTtcblx0ICAgIHJldHVybiB2YWx1ZSAhPT0gbnVsbCA/IHRoaXMuY29udHJvbC5xdWVyeVNlbGVjdG9yKGBbZGF0YS12YWx1ZT1cIiR7YWRkU2xhc2hlcyh2YWx1ZSl9XCJdYCkgOiBudWxsO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBcIlNlbGVjdHNcIiBtdWx0aXBsZSBpdGVtcyBhdCBvbmNlLiBBZGRzIHRoZW0gdG8gdGhlIGxpc3Rcblx0ICAgKiBhdCB0aGUgY3VycmVudCBjYXJldCBwb3NpdGlvbi5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBhZGRJdGVtcyh2YWx1ZXMsIHNpbGVudCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIGl0ZW1zID0gQXJyYXkuaXNBcnJheSh2YWx1ZXMpID8gdmFsdWVzIDogW3ZhbHVlc107XG5cdCAgICBpdGVtcyA9IGl0ZW1zLmZpbHRlcih4ID0+IHNlbGYuaXRlbXMuaW5kZXhPZih4KSA9PT0gLTEpO1xuXHQgICAgY29uc3QgbGFzdF9pdGVtID0gaXRlbXNbaXRlbXMubGVuZ3RoIC0gMV07XG5cdCAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuXHQgICAgICBzZWxmLmlzUGVuZGluZyA9IGl0ZW0gIT09IGxhc3RfaXRlbTtcblx0ICAgICAgc2VsZi5hZGRJdGVtKGl0ZW0sIHNpbGVudCk7XG5cdCAgICB9KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogXCJTZWxlY3RzXCIgYW4gaXRlbS4gQWRkcyBpdCB0byB0aGUgbGlzdFxuXHQgICAqIGF0IHRoZSBjdXJyZW50IGNhcmV0IHBvc2l0aW9uLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGFkZEl0ZW0odmFsdWUsIHNpbGVudCkge1xuXHQgICAgdmFyIGV2ZW50cyA9IHNpbGVudCA/IFtdIDogWydjaGFuZ2UnLCAnZHJvcGRvd25fY2xvc2UnXTtcblx0ICAgIGRlYm91bmNlX2V2ZW50cyh0aGlzLCBldmVudHMsICgpID0+IHtcblx0ICAgICAgdmFyIGl0ZW0sIHdhc0Z1bGw7XG5cdCAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgICBjb25zdCBpbnB1dE1vZGUgPSBzZWxmLnNldHRpbmdzLm1vZGU7XG5cdCAgICAgIGNvbnN0IGhhc2hlZCA9IGhhc2hfa2V5KHZhbHVlKTtcblxuXHQgICAgICBpZiAoaGFzaGVkICYmIHNlbGYuaXRlbXMuaW5kZXhPZihoYXNoZWQpICE9PSAtMSkge1xuXHQgICAgICAgIGlmIChpbnB1dE1vZGUgPT09ICdzaW5nbGUnKSB7XG5cdCAgICAgICAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKGlucHV0TW9kZSA9PT0gJ3NpbmdsZScgfHwgIXNlbGYuc2V0dGluZ3MuZHVwbGljYXRlcykge1xuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChoYXNoZWQgPT09IG51bGwgfHwgIXNlbGYub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShoYXNoZWQpKSByZXR1cm47XG5cdCAgICAgIGlmIChpbnB1dE1vZGUgPT09ICdzaW5nbGUnKSBzZWxmLmNsZWFyKHNpbGVudCk7XG5cdCAgICAgIGlmIChpbnB1dE1vZGUgPT09ICdtdWx0aScgJiYgc2VsZi5pc0Z1bGwoKSkgcmV0dXJuO1xuXHQgICAgICBpdGVtID0gc2VsZi5fcmVuZGVyKCdpdGVtJywgc2VsZi5vcHRpb25zW2hhc2hlZF0pO1xuXG5cdCAgICAgIGlmIChzZWxmLmNvbnRyb2wuY29udGFpbnMoaXRlbSkpIHtcblx0ICAgICAgICAvLyBkdXBsaWNhdGVzXG5cdCAgICAgICAgaXRlbSA9IGl0ZW0uY2xvbmVOb2RlKHRydWUpO1xuXHQgICAgICB9XG5cblx0ICAgICAgd2FzRnVsbCA9IHNlbGYuaXNGdWxsKCk7XG5cdCAgICAgIHNlbGYuaXRlbXMuc3BsaWNlKHNlbGYuY2FyZXRQb3MsIDAsIGhhc2hlZCk7XG5cdCAgICAgIHNlbGYuaW5zZXJ0QXRDYXJldChpdGVtKTtcblxuXHQgICAgICBpZiAoc2VsZi5pc1NldHVwKSB7XG5cdCAgICAgICAgLy8gdXBkYXRlIG1lbnUgLyByZW1vdmUgdGhlIG9wdGlvbiAoaWYgdGhpcyBpcyBub3Qgb25lIGl0ZW0gYmVpbmcgYWRkZWQgYXMgcGFydCBvZiBzZXJpZXMpXG5cdCAgICAgICAgaWYgKCFzZWxmLmlzUGVuZGluZyAmJiBzZWxmLnNldHRpbmdzLmhpZGVTZWxlY3RlZCkge1xuXHQgICAgICAgICAgbGV0IG9wdGlvbiA9IHNlbGYuZ2V0T3B0aW9uKGhhc2hlZCk7XG5cdCAgICAgICAgICBsZXQgbmV4dCA9IHNlbGYuZ2V0QWRqYWNlbnQob3B0aW9uLCAxKTtcblxuXHQgICAgICAgICAgaWYgKG5leHQpIHtcblx0ICAgICAgICAgICAgc2VsZi5zZXRBY3RpdmVPcHRpb24obmV4dCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSAvLyByZWZyZXNoT3B0aW9ucyBhZnRlciBzZXRBY3RpdmVPcHRpb24oKSxcblx0ICAgICAgICAvLyBvdGhlcndpc2Ugc2V0QWN0aXZlT3B0aW9uKCkgd2lsbCBiZSBjYWxsZWQgYnkgcmVmcmVzaE9wdGlvbnMoKSB3aXRoIHRoZSB3cm9uZyB2YWx1ZVxuXG5cblx0ICAgICAgICBpZiAoIXNlbGYuaXNQZW5kaW5nICYmICFzZWxmLnNldHRpbmdzLmNsb3NlQWZ0ZXJTZWxlY3QpIHtcblx0ICAgICAgICAgIHNlbGYucmVmcmVzaE9wdGlvbnMoc2VsZi5pc0ZvY3VzZWQgJiYgaW5wdXRNb2RlICE9PSAnc2luZ2xlJyk7XG5cdCAgICAgICAgfSAvLyBoaWRlIHRoZSBtZW51IGlmIHRoZSBtYXhpbXVtIG51bWJlciBvZiBpdGVtcyBoYXZlIGJlZW4gc2VsZWN0ZWQgb3Igbm8gb3B0aW9ucyBhcmUgbGVmdFxuXG5cblx0ICAgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5jbG9zZUFmdGVyU2VsZWN0ICE9IGZhbHNlICYmIHNlbGYuaXNGdWxsKCkpIHtcblx0ICAgICAgICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmlzUGVuZGluZykge1xuXHQgICAgICAgICAgc2VsZi5wb3NpdGlvbkRyb3Bkb3duKCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VsZi50cmlnZ2VyKCdpdGVtX2FkZCcsIGhhc2hlZCwgaXRlbSk7XG5cblx0ICAgICAgICBpZiAoIXNlbGYuaXNQZW5kaW5nKSB7XG5cdCAgICAgICAgICBzZWxmLnVwZGF0ZU9yaWdpbmFsSW5wdXQoe1xuXHQgICAgICAgICAgICBzaWxlbnQ6IHNpbGVudFxuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKCFzZWxmLmlzUGVuZGluZyB8fCAhd2FzRnVsbCAmJiBzZWxmLmlzRnVsbCgpKSB7XG5cdCAgICAgICAgc2VsZi5pbnB1dFN0YXRlKCk7XG5cdCAgICAgICAgc2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlbW92ZXMgdGhlIHNlbGVjdGVkIGl0ZW0gbWF0Y2hpbmdcblx0ICAgKiB0aGUgcHJvdmlkZWQgdmFsdWUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgcmVtb3ZlSXRlbShpdGVtID0gbnVsbCwgc2lsZW50KSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIGl0ZW0gPSBzZWxmLmdldEl0ZW0oaXRlbSk7XG5cdCAgICBpZiAoIWl0ZW0pIHJldHVybjtcblx0ICAgIHZhciBpLCBpZHg7XG5cdCAgICBjb25zdCB2YWx1ZSA9IGl0ZW0uZGF0YXNldC52YWx1ZTtcblx0ICAgIGkgPSBub2RlSW5kZXgoaXRlbSk7XG5cdCAgICBpdGVtLnJlbW92ZSgpO1xuXG5cdCAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdCAgICAgIGlkeCA9IHNlbGYuYWN0aXZlSXRlbXMuaW5kZXhPZihpdGVtKTtcblx0ICAgICAgc2VsZi5hY3RpdmVJdGVtcy5zcGxpY2UoaWR4LCAxKTtcblx0ICAgICAgcmVtb3ZlQ2xhc3NlcyhpdGVtLCAnYWN0aXZlJyk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuaXRlbXMuc3BsaWNlKGksIDEpO1xuXHQgICAgc2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXG5cdCAgICBpZiAoIXNlbGYuc2V0dGluZ3MucGVyc2lzdCAmJiBzZWxmLnVzZXJPcHRpb25zLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuXHQgICAgICBzZWxmLnJlbW92ZU9wdGlvbih2YWx1ZSwgc2lsZW50KTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGkgPCBzZWxmLmNhcmV0UG9zKSB7XG5cdCAgICAgIHNlbGYuc2V0Q2FyZXQoc2VsZi5jYXJldFBvcyAtIDEpO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLnVwZGF0ZU9yaWdpbmFsSW5wdXQoe1xuXHQgICAgICBzaWxlbnQ6IHNpbGVudFxuXHQgICAgfSk7XG5cdCAgICBzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHQgICAgc2VsZi5wb3NpdGlvbkRyb3Bkb3duKCk7XG5cdCAgICBzZWxmLnRyaWdnZXIoJ2l0ZW1fcmVtb3ZlJywgdmFsdWUsIGl0ZW0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBJbnZva2VzIHRoZSBgY3JlYXRlYCBtZXRob2QgcHJvdmlkZWQgaW4gdGhlXG5cdCAgICogVG9tU2VsZWN0IG9wdGlvbnMgdGhhdCBzaG91bGQgcHJvdmlkZSB0aGUgZGF0YVxuXHQgICAqIGZvciB0aGUgbmV3IGl0ZW0sIGdpdmVuIHRoZSB1c2VyIGlucHV0LlxuXHQgICAqXG5cdCAgICogT25jZSB0aGlzIGNvbXBsZXRlcywgaXQgd2lsbCBiZSBhZGRlZFxuXHQgICAqIHRvIHRoZSBpdGVtIGxpc3QuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY3JlYXRlSXRlbShpbnB1dCA9IG51bGwsIGNhbGxiYWNrID0gKCkgPT4ge30pIHtcblx0ICAgIC8vIHRyaWdnZXJEcm9wZG93biBwYXJhbWV0ZXIgQGRlcHJlY2F0ZWQgMi4xLjFcblx0ICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG5cdCAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzWzJdO1xuXHQgICAgfVxuXG5cdCAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdmdW5jdGlvbicpIHtcblx0ICAgICAgY2FsbGJhY2sgPSAoKSA9PiB7fTtcblx0ICAgIH1cblxuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIGNhcmV0ID0gc2VsZi5jYXJldFBvcztcblx0ICAgIHZhciBvdXRwdXQ7XG5cdCAgICBpbnB1dCA9IGlucHV0IHx8IHNlbGYuaW5wdXRWYWx1ZSgpO1xuXG5cdCAgICBpZiAoIXNlbGYuY2FuQ3JlYXRlKGlucHV0KSkge1xuXHQgICAgICBjYWxsYmFjaygpO1xuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYubG9jaygpO1xuXHQgICAgdmFyIGNyZWF0ZWQgPSBmYWxzZTtcblxuXHQgICAgdmFyIGNyZWF0ZSA9IGRhdGEgPT4ge1xuXHQgICAgICBzZWxmLnVubG9jaygpO1xuXHQgICAgICBpZiAoIWRhdGEgfHwgdHlwZW9mIGRhdGEgIT09ICdvYmplY3QnKSByZXR1cm4gY2FsbGJhY2soKTtcblx0ICAgICAgdmFyIHZhbHVlID0gaGFzaF9rZXkoZGF0YVtzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdKTtcblxuXHQgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuXHQgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuXHQgICAgICB9XG5cblx0ICAgICAgc2VsZi5zZXRUZXh0Ym94VmFsdWUoKTtcblx0ICAgICAgc2VsZi5hZGRPcHRpb24oZGF0YSwgdHJ1ZSk7XG5cdCAgICAgIHNlbGYuc2V0Q2FyZXQoY2FyZXQpO1xuXHQgICAgICBzZWxmLmFkZEl0ZW0odmFsdWUpO1xuXHQgICAgICBjYWxsYmFjayhkYXRhKTtcblx0ICAgICAgY3JlYXRlZCA9IHRydWU7XG5cdCAgICB9O1xuXG5cdCAgICBpZiAodHlwZW9mIHNlbGYuc2V0dGluZ3MuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIG91dHB1dCA9IHNlbGYuc2V0dGluZ3MuY3JlYXRlLmNhbGwodGhpcywgaW5wdXQsIGNyZWF0ZSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBvdXRwdXQgPSB7XG5cdCAgICAgICAgW3NlbGYuc2V0dGluZ3MubGFiZWxGaWVsZF06IGlucHV0LFxuXHQgICAgICAgIFtzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdOiBpbnB1dFxuXHQgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICBpZiAoIWNyZWF0ZWQpIHtcblx0ICAgICAgY3JlYXRlKG91dHB1dCk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZS1yZW5kZXJzIHRoZSBzZWxlY3RlZCBpdGVtIGxpc3RzLlxuXHQgICAqL1xuXG5cblx0ICByZWZyZXNoSXRlbXMoKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cblx0ICAgIGlmIChzZWxmLmlzU2V0dXApIHtcblx0ICAgICAgc2VsZi5hZGRJdGVtcyhzZWxmLml0ZW1zKTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi51cGRhdGVPcmlnaW5hbElucHV0KCk7XG5cdCAgICBzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBVcGRhdGVzIGFsbCBzdGF0ZS1kZXBlbmRlbnQgYXR0cmlidXRlc1xuXHQgICAqIGFuZCBDU1MgY2xhc3Nlcy5cblx0ICAgKi9cblxuXG5cdCAgcmVmcmVzaFN0YXRlKCkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBzZWxmLnJlZnJlc2hWYWxpZGl0eVN0YXRlKCk7XG5cdCAgICBjb25zdCBpc0Z1bGwgPSBzZWxmLmlzRnVsbCgpO1xuXHQgICAgY29uc3QgaXNMb2NrZWQgPSBzZWxmLmlzTG9ja2VkO1xuXHQgICAgc2VsZi53cmFwcGVyLmNsYXNzTGlzdC50b2dnbGUoJ3J0bCcsIHNlbGYucnRsKTtcblx0ICAgIGNvbnN0IHdyYXBfY2xhc3NMaXN0ID0gc2VsZi53cmFwcGVyLmNsYXNzTGlzdDtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgnZm9jdXMnLCBzZWxmLmlzRm9jdXNlZCk7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgc2VsZi5pc0Rpc2FibGVkKTtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgncmVxdWlyZWQnLCBzZWxmLmlzUmVxdWlyZWQpO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdpbnZhbGlkJywgIXNlbGYuaXNWYWxpZCk7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2xvY2tlZCcsIGlzTG9ja2VkKTtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgnZnVsbCcsIGlzRnVsbCk7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2lucHV0LWFjdGl2ZScsIHNlbGYuaXNGb2N1c2VkICYmICFzZWxmLmlzSW5wdXRIaWRkZW4pO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdkcm9wZG93bi1hY3RpdmUnLCBzZWxmLmlzT3Blbik7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2hhcy1vcHRpb25zJywgaXNFbXB0eU9iamVjdChzZWxmLm9wdGlvbnMpKTtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgnaGFzLWl0ZW1zJywgc2VsZi5pdGVtcy5sZW5ndGggPiAwKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVXBkYXRlIHRoZSBgcmVxdWlyZWRgIGF0dHJpYnV0ZSBvZiBib3RoIGlucHV0IGFuZCBjb250cm9sIGlucHV0LlxuXHQgICAqXG5cdCAgICogVGhlIGByZXF1aXJlZGAgcHJvcGVydHkgbmVlZHMgdG8gYmUgYWN0aXZhdGVkIG9uIHRoZSBjb250cm9sIGlucHV0XG5cdCAgICogZm9yIHRoZSBlcnJvciB0byBiZSBkaXNwbGF5ZWQgYXQgdGhlIHJpZ2h0IHBsYWNlLiBgcmVxdWlyZWRgIGFsc29cblx0ICAgKiBuZWVkcyB0byBiZSB0ZW1wb3JhcmlseSBkZWFjdGl2YXRlZCBvbiB0aGUgaW5wdXQgc2luY2UgdGhlIGlucHV0IGlzXG5cdCAgICogaGlkZGVuIGFuZCBjYW4ndCBzaG93IGVycm9ycy5cblx0ICAgKi9cblxuXG5cdCAgcmVmcmVzaFZhbGlkaXR5U3RhdGUoKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cblx0ICAgIGlmICghc2VsZi5pbnB1dC52YWxpZGl0eSkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuaXNWYWxpZCA9IHNlbGYuaW5wdXQudmFsaWRpdHkudmFsaWQ7XG5cdCAgICBzZWxmLmlzSW52YWxpZCA9ICFzZWxmLmlzVmFsaWQ7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIERldGVybWluZXMgd2hldGhlciBvciBub3QgbW9yZSBpdGVtcyBjYW4gYmUgYWRkZWRcblx0ICAgKiB0byB0aGUgY29udHJvbCB3aXRob3V0IGV4Y2VlZGluZyB0aGUgdXNlci1kZWZpbmVkIG1heGltdW0uXG5cdCAgICpcblx0ICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICAgKi9cblxuXG5cdCAgaXNGdWxsKCkge1xuXHQgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MubWF4SXRlbXMgIT09IG51bGwgJiYgdGhpcy5pdGVtcy5sZW5ndGggPj0gdGhpcy5zZXR0aW5ncy5tYXhJdGVtcztcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVmcmVzaGVzIHRoZSBvcmlnaW5hbCA8c2VsZWN0PiBvciA8aW5wdXQ+XG5cdCAgICogZWxlbWVudCB0byByZWZsZWN0IHRoZSBjdXJyZW50IHN0YXRlLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHVwZGF0ZU9yaWdpbmFsSW5wdXQob3B0cyA9IHt9KSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIHZhciBvcHRpb24sIGxhYmVsO1xuXHQgICAgY29uc3QgZW1wdHlfb3B0aW9uID0gc2VsZi5pbnB1dC5xdWVyeVNlbGVjdG9yKCdvcHRpb25bdmFsdWU9XCJcIl0nKTtcblxuXHQgICAgaWYgKHNlbGYuaXNfc2VsZWN0X3RhZykge1xuXHQgICAgICBjb25zdCBzZWxlY3RlZCA9IFtdO1xuXHQgICAgICBjb25zdCBoYXNfc2VsZWN0ZWQgPSBzZWxmLmlucHV0LnF1ZXJ5U2VsZWN0b3JBbGwoJ29wdGlvbjpjaGVja2VkJykubGVuZ3RoO1xuXG5cdCAgICAgIGZ1bmN0aW9uIEFkZFNlbGVjdGVkKG9wdGlvbl9lbCwgdmFsdWUsIGxhYmVsKSB7XG5cdCAgICAgICAgaWYgKCFvcHRpb25fZWwpIHtcblx0ICAgICAgICAgIG9wdGlvbl9lbCA9IGdldERvbSgnPG9wdGlvbiB2YWx1ZT1cIicgKyBlc2NhcGVfaHRtbCh2YWx1ZSkgKyAnXCI+JyArIGVzY2FwZV9odG1sKGxhYmVsKSArICc8L29wdGlvbj4nKTtcblx0ICAgICAgICB9IC8vIGRvbid0IG1vdmUgZW1wdHkgb3B0aW9uIGZyb20gdG9wIG9mIGxpc3Rcblx0ICAgICAgICAvLyBmaXhlcyBidWcgaW4gZmlyZWZveCBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xNzI1MjkzXG5cblxuXHQgICAgICAgIGlmIChvcHRpb25fZWwgIT0gZW1wdHlfb3B0aW9uKSB7XG5cdCAgICAgICAgICBzZWxmLmlucHV0LmFwcGVuZChvcHRpb25fZWwpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHNlbGVjdGVkLnB1c2gob3B0aW9uX2VsKTsgLy8gbWFya2luZyBlbXB0eSBvcHRpb24gYXMgc2VsZWN0ZWQgY2FuIGJyZWFrIHZhbGlkYXRpb25cblx0ICAgICAgICAvLyBmaXhlcyBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvdG9tLXNlbGVjdC9pc3N1ZXMvMzAzXG5cblx0ICAgICAgICBpZiAob3B0aW9uX2VsICE9IGVtcHR5X29wdGlvbiB8fCBoYXNfc2VsZWN0ZWQgPiAwKSB7XG5cdCAgICAgICAgICBvcHRpb25fZWwuc2VsZWN0ZWQgPSB0cnVlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBvcHRpb25fZWw7XG5cdCAgICAgIH0gLy8gdW5zZWxlY3QgYWxsIHNlbGVjdGVkIG9wdGlvbnNcblxuXG5cdCAgICAgIHNlbGYuaW5wdXQucXVlcnlTZWxlY3RvckFsbCgnb3B0aW9uOmNoZWNrZWQnKS5mb3JFYWNoKG9wdGlvbl9lbCA9PiB7XG5cdCAgICAgICAgb3B0aW9uX2VsLnNlbGVjdGVkID0gZmFsc2U7XG5cdCAgICAgIH0pOyAvLyBub3RoaW5nIHNlbGVjdGVkP1xuXG5cdCAgICAgIGlmIChzZWxmLml0ZW1zLmxlbmd0aCA9PSAwICYmIHNlbGYuc2V0dGluZ3MubW9kZSA9PSAnc2luZ2xlJykge1xuXHQgICAgICAgIEFkZFNlbGVjdGVkKGVtcHR5X29wdGlvbiwgXCJcIiwgXCJcIik7IC8vIG9yZGVyIHNlbGVjdGVkIDxvcHRpb24+IHRhZ3MgZm9yIHZhbHVlcyBpbiBzZWxmLml0ZW1zXG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgc2VsZi5pdGVtcy5mb3JFYWNoKHZhbHVlID0+IHtcblx0ICAgICAgICAgIG9wdGlvbiA9IHNlbGYub3B0aW9uc1t2YWx1ZV07XG5cdCAgICAgICAgICBsYWJlbCA9IG9wdGlvbltzZWxmLnNldHRpbmdzLmxhYmVsRmllbGRdIHx8ICcnO1xuXG5cdCAgICAgICAgICBpZiAoc2VsZWN0ZWQuaW5jbHVkZXMob3B0aW9uLiRvcHRpb24pKSB7XG5cdCAgICAgICAgICAgIGNvbnN0IHJldXNlX29wdCA9IHNlbGYuaW5wdXQucXVlcnlTZWxlY3Rvcihgb3B0aW9uW3ZhbHVlPVwiJHthZGRTbGFzaGVzKHZhbHVlKX1cIl06bm90KDpjaGVja2VkKWApO1xuXHQgICAgICAgICAgICBBZGRTZWxlY3RlZChyZXVzZV9vcHQsIHZhbHVlLCBsYWJlbCk7XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBvcHRpb24uJG9wdGlvbiA9IEFkZFNlbGVjdGVkKG9wdGlvbi4kb3B0aW9uLCB2YWx1ZSwgbGFiZWwpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZWxmLmlucHV0LnZhbHVlID0gc2VsZi5nZXRWYWx1ZSgpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoc2VsZi5pc1NldHVwKSB7XG5cdCAgICAgIGlmICghb3B0cy5zaWxlbnQpIHtcblx0ICAgICAgICBzZWxmLnRyaWdnZXIoJ2NoYW5nZScsIHNlbGYuZ2V0VmFsdWUoKSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2hvd3MgdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93biBjb250YWluaW5nXG5cdCAgICogdGhlIGF2YWlsYWJsZSBvcHRpb25zLlxuXHQgICAqL1xuXG5cblx0ICBvcGVuKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKHNlbGYuaXNMb2NrZWQgfHwgc2VsZi5pc09wZW4gfHwgc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnbXVsdGknICYmIHNlbGYuaXNGdWxsKCkpIHJldHVybjtcblx0ICAgIHNlbGYuaXNPcGVuID0gdHJ1ZTtcblx0ICAgIHNldEF0dHIoc2VsZi5mb2N1c19ub2RlLCB7XG5cdCAgICAgICdhcmlhLWV4cGFuZGVkJzogJ3RydWUnXG5cdCAgICB9KTtcblx0ICAgIHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdCAgICBhcHBseUNTUyhzZWxmLmRyb3Bkb3duLCB7XG5cdCAgICAgIHZpc2liaWxpdHk6ICdoaWRkZW4nLFxuXHQgICAgICBkaXNwbGF5OiAnYmxvY2snXG5cdCAgICB9KTtcblx0ICAgIHNlbGYucG9zaXRpb25Ecm9wZG93bigpO1xuXHQgICAgYXBwbHlDU1Moc2VsZi5kcm9wZG93biwge1xuXHQgICAgICB2aXNpYmlsaXR5OiAndmlzaWJsZScsXG5cdCAgICAgIGRpc3BsYXk6ICdibG9jaydcblx0ICAgIH0pO1xuXHQgICAgc2VsZi5mb2N1cygpO1xuXHQgICAgc2VsZi50cmlnZ2VyKCdkcm9wZG93bl9vcGVuJywgc2VsZi5kcm9wZG93bik7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIENsb3NlcyB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duIG1lbnUuXG5cdCAgICovXG5cblxuXHQgIGNsb3NlKHNldFRleHRib3hWYWx1ZSA9IHRydWUpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciB0cmlnZ2VyID0gc2VsZi5pc09wZW47XG5cblx0ICAgIGlmIChzZXRUZXh0Ym94VmFsdWUpIHtcblx0ICAgICAgLy8gYmVmb3JlIGJsdXIoKSB0byBwcmV2ZW50IGZvcm0gb25jaGFuZ2UgZXZlbnRcblx0ICAgICAgc2VsZi5zZXRUZXh0Ym94VmFsdWUoKTtcblxuXHQgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJyAmJiBzZWxmLml0ZW1zLmxlbmd0aCkge1xuXHQgICAgICAgIHNlbGYuaGlkZUlucHV0KCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgc2VsZi5pc09wZW4gPSBmYWxzZTtcblx0ICAgIHNldEF0dHIoc2VsZi5mb2N1c19ub2RlLCB7XG5cdCAgICAgICdhcmlhLWV4cGFuZGVkJzogJ2ZhbHNlJ1xuXHQgICAgfSk7XG5cdCAgICBhcHBseUNTUyhzZWxmLmRyb3Bkb3duLCB7XG5cdCAgICAgIGRpc3BsYXk6ICdub25lJ1xuXHQgICAgfSk7XG5cblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLmhpZGVTZWxlY3RlZCkge1xuXHQgICAgICBzZWxmLmNsZWFyQWN0aXZlT3B0aW9uKCk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdCAgICBpZiAodHJpZ2dlcikgc2VsZi50cmlnZ2VyKCdkcm9wZG93bl9jbG9zZScsIHNlbGYuZHJvcGRvd24pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDYWxjdWxhdGVzIGFuZCBhcHBsaWVzIHRoZSBhcHByb3ByaWF0ZVxuXHQgICAqIHBvc2l0aW9uIG9mIHRoZSBkcm9wZG93biBpZiBkcm9wZG93blBhcmVudCA9ICdib2R5Jy5cblx0ICAgKiBPdGhlcndpc2UsIHBvc2l0aW9uIGlzIGRldGVybWluZWQgYnkgY3NzXG5cdCAgICovXG5cblxuXHQgIHBvc2l0aW9uRHJvcGRvd24oKSB7XG5cdCAgICBpZiAodGhpcy5zZXR0aW5ncy5kcm9wZG93blBhcmVudCAhPT0gJ2JvZHknKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgdmFyIGNvbnRleHQgPSB0aGlzLmNvbnRyb2w7XG5cdCAgICB2YXIgcmVjdCA9IGNvbnRleHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICB2YXIgdG9wID0gY29udGV4dC5vZmZzZXRIZWlnaHQgKyByZWN0LnRvcCArIHdpbmRvdy5zY3JvbGxZO1xuXHQgICAgdmFyIGxlZnQgPSByZWN0LmxlZnQgKyB3aW5kb3cuc2Nyb2xsWDtcblx0ICAgIGFwcGx5Q1NTKHRoaXMuZHJvcGRvd24sIHtcblx0ICAgICAgd2lkdGg6IHJlY3Qud2lkdGggKyAncHgnLFxuXHQgICAgICB0b3A6IHRvcCArICdweCcsXG5cdCAgICAgIGxlZnQ6IGxlZnQgKyAncHgnXG5cdCAgICB9KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVzZXRzIC8gY2xlYXJzIGFsbCBzZWxlY3RlZCBpdGVtc1xuXHQgICAqIGZyb20gdGhlIGNvbnRyb2wuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY2xlYXIoc2lsZW50KSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBpZiAoIXNlbGYuaXRlbXMubGVuZ3RoKSByZXR1cm47XG5cdCAgICB2YXIgaXRlbXMgPSBzZWxmLmNvbnRyb2xDaGlsZHJlbigpO1xuXHQgICAgaXRlcmF0ZSQxKGl0ZW1zLCBpdGVtID0+IHtcblx0ICAgICAgc2VsZi5yZW1vdmVJdGVtKGl0ZW0sIHRydWUpO1xuXHQgICAgfSk7XG5cdCAgICBzZWxmLnNob3dJbnB1dCgpO1xuXHQgICAgaWYgKCFzaWxlbnQpIHNlbGYudXBkYXRlT3JpZ2luYWxJbnB1dCgpO1xuXHQgICAgc2VsZi50cmlnZ2VyKCdjbGVhcicpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBBIGhlbHBlciBtZXRob2QgZm9yIGluc2VydGluZyBhbiBlbGVtZW50XG5cdCAgICogYXQgdGhlIGN1cnJlbnQgY2FyZXQgcG9zaXRpb24uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgaW5zZXJ0QXRDYXJldChlbCkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBjb25zdCBjYXJldCA9IHNlbGYuY2FyZXRQb3M7XG5cdCAgICBjb25zdCB0YXJnZXQgPSBzZWxmLmNvbnRyb2w7XG5cdCAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQuY2hpbGRyZW5bY2FyZXRdIHx8IG51bGwpO1xuXHQgICAgc2VsZi5zZXRDYXJldChjYXJldCArIDEpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZW1vdmVzIHRoZSBjdXJyZW50IHNlbGVjdGVkIGl0ZW0ocykuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgZGVsZXRlU2VsZWN0aW9uKGUpIHtcblx0ICAgIHZhciBkaXJlY3Rpb24sIHNlbGVjdGlvbiwgY2FyZXQsIHRhaWw7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBkaXJlY3Rpb24gPSBlICYmIGUua2V5Q29kZSA9PT0gS0VZX0JBQ0tTUEFDRSA/IC0xIDogMTtcblx0ICAgIHNlbGVjdGlvbiA9IGdldFNlbGVjdGlvbihzZWxmLmNvbnRyb2xfaW5wdXQpOyAvLyBkZXRlcm1pbmUgaXRlbXMgdGhhdCB3aWxsIGJlIHJlbW92ZWRcblxuXHQgICAgY29uc3Qgcm1faXRlbXMgPSBbXTtcblxuXHQgICAgaWYgKHNlbGYuYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgIHRhaWwgPSBnZXRUYWlsKHNlbGYuYWN0aXZlSXRlbXMsIGRpcmVjdGlvbik7XG5cdCAgICAgIGNhcmV0ID0gbm9kZUluZGV4KHRhaWwpO1xuXG5cdCAgICAgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG5cdCAgICAgICAgY2FyZXQrKztcblx0ICAgICAgfVxuXG5cdCAgICAgIGl0ZXJhdGUkMShzZWxmLmFjdGl2ZUl0ZW1zLCBpdGVtID0+IHJtX2l0ZW1zLnB1c2goaXRlbSkpO1xuXHQgICAgfSBlbHNlIGlmICgoc2VsZi5pc0ZvY3VzZWQgfHwgc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJykgJiYgc2VsZi5pdGVtcy5sZW5ndGgpIHtcblx0ICAgICAgY29uc3QgaXRlbXMgPSBzZWxmLmNvbnRyb2xDaGlsZHJlbigpO1xuXHQgICAgICBsZXQgcm1faXRlbTtcblxuXHQgICAgICBpZiAoZGlyZWN0aW9uIDwgMCAmJiBzZWxlY3Rpb24uc3RhcnQgPT09IDAgJiYgc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgICAgIHJtX2l0ZW0gPSBpdGVtc1tzZWxmLmNhcmV0UG9zIC0gMV07XG5cdCAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID4gMCAmJiBzZWxlY3Rpb24uc3RhcnQgPT09IHNlbGYuaW5wdXRWYWx1ZSgpLmxlbmd0aCkge1xuXHQgICAgICAgIHJtX2l0ZW0gPSBpdGVtc1tzZWxmLmNhcmV0UG9zXTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChybV9pdGVtICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICBybV9pdGVtcy5wdXNoKHJtX2l0ZW0pO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGlmICghc2VsZi5zaG91bGREZWxldGUocm1faXRlbXMsIGUpKSB7XG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgcHJldmVudERlZmF1bHQoZSwgdHJ1ZSk7IC8vIHBlcmZvcm0gcmVtb3ZhbFxuXG5cdCAgICBpZiAodHlwZW9mIGNhcmV0ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICBzZWxmLnNldENhcmV0KGNhcmV0KTtcblx0ICAgIH1cblxuXHQgICAgd2hpbGUgKHJtX2l0ZW1zLmxlbmd0aCkge1xuXHQgICAgICBzZWxmLnJlbW92ZUl0ZW0ocm1faXRlbXMucG9wKCkpO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLnNob3dJbnB1dCgpO1xuXHQgICAgc2VsZi5wb3NpdGlvbkRyb3Bkb3duKCk7XG5cdCAgICBzZWxmLnJlZnJlc2hPcHRpb25zKGZhbHNlKTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgaXRlbXMgc2hvdWxkIGJlIGRlbGV0ZWRcblx0ICAgKi9cblxuXG5cdCAgc2hvdWxkRGVsZXRlKGl0ZW1zLCBldnQpIHtcblx0ICAgIGNvbnN0IHZhbHVlcyA9IGl0ZW1zLm1hcChpdGVtID0+IGl0ZW0uZGF0YXNldC52YWx1ZSk7IC8vIGFsbG93IHRoZSBjYWxsYmFjayB0byBhYm9ydFxuXG5cdCAgICBpZiAoIXZhbHVlcy5sZW5ndGggfHwgdHlwZW9mIHRoaXMuc2V0dGluZ3Mub25EZWxldGUgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5zZXR0aW5ncy5vbkRlbGV0ZSh2YWx1ZXMsIGV2dCkgPT09IGZhbHNlKSB7XG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNlbGVjdHMgdGhlIHByZXZpb3VzIC8gbmV4dCBpdGVtIChkZXBlbmRpbmcgb24gdGhlIGBkaXJlY3Rpb25gIGFyZ3VtZW50KS5cblx0ICAgKlxuXHQgICAqID4gMCAtIHJpZ2h0XG5cdCAgICogPCAwIC0gbGVmdFxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGFkdmFuY2VTZWxlY3Rpb24oZGlyZWN0aW9uLCBlKSB7XG5cdCAgICB2YXIgbGFzdF9hY3RpdmUsXG5cdCAgICAgICAgYWRqYWNlbnQsXG5cdCAgICAgICAgc2VsZiA9IHRoaXM7XG5cdCAgICBpZiAoc2VsZi5ydGwpIGRpcmVjdGlvbiAqPSAtMTtcblx0ICAgIGlmIChzZWxmLmlucHV0VmFsdWUoKS5sZW5ndGgpIHJldHVybjsgLy8gYWRkIG9yIHJlbW92ZSB0byBhY3RpdmUgaXRlbXNcblxuXHQgICAgaWYgKGlzS2V5RG93bihLRVlfU0hPUlRDVVQsIGUpIHx8IGlzS2V5RG93bignc2hpZnRLZXknLCBlKSkge1xuXHQgICAgICBsYXN0X2FjdGl2ZSA9IHNlbGYuZ2V0TGFzdEFjdGl2ZShkaXJlY3Rpb24pO1xuXG5cdCAgICAgIGlmIChsYXN0X2FjdGl2ZSkge1xuXHQgICAgICAgIGlmICghbGFzdF9hY3RpdmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHQgICAgICAgICAgYWRqYWNlbnQgPSBsYXN0X2FjdGl2ZTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgYWRqYWNlbnQgPSBzZWxmLmdldEFkamFjZW50KGxhc3RfYWN0aXZlLCBkaXJlY3Rpb24sICdpdGVtJyk7XG5cdCAgICAgICAgfSAvLyBpZiBubyBhY3RpdmUgaXRlbSwgZ2V0IGl0ZW1zIGFkamFjZW50IHRvIHRoZSBjb250cm9sIGlucHV0XG5cblx0ICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPiAwKSB7XG5cdCAgICAgICAgYWRqYWNlbnQgPSBzZWxmLmNvbnRyb2xfaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGFkamFjZW50ID0gc2VsZi5jb250cm9sX2lucHV0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoYWRqYWNlbnQpIHtcblx0ICAgICAgICBpZiAoYWRqYWNlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHQgICAgICAgICAgc2VsZi5yZW1vdmVBY3RpdmVJdGVtKGxhc3RfYWN0aXZlKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW1DbGFzcyhhZGphY2VudCk7IC8vIG1hcmsgYXMgbGFzdF9hY3RpdmUgISEgYWZ0ZXIgcmVtb3ZlQWN0aXZlSXRlbSgpIG9uIGxhc3RfYWN0aXZlXG5cdCAgICAgIH0gLy8gbW92ZSBjYXJldCB0byB0aGUgbGVmdCBvciByaWdodFxuXG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZWxmLm1vdmVDYXJldChkaXJlY3Rpb24pO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIG1vdmVDYXJldChkaXJlY3Rpb24pIHt9XG5cdCAgLyoqXG5cdCAgICogR2V0IHRoZSBsYXN0IGFjdGl2ZSBpdGVtXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgZ2V0TGFzdEFjdGl2ZShkaXJlY3Rpb24pIHtcblx0ICAgIGxldCBsYXN0X2FjdGl2ZSA9IHRoaXMuY29udHJvbC5xdWVyeVNlbGVjdG9yKCcubGFzdC1hY3RpdmUnKTtcblxuXHQgICAgaWYgKGxhc3RfYWN0aXZlKSB7XG5cdCAgICAgIHJldHVybiBsYXN0X2FjdGl2ZTtcblx0ICAgIH1cblxuXHQgICAgdmFyIHJlc3VsdCA9IHRoaXMuY29udHJvbC5xdWVyeVNlbGVjdG9yQWxsKCcuYWN0aXZlJyk7XG5cblx0ICAgIGlmIChyZXN1bHQpIHtcblx0ICAgICAgcmV0dXJuIGdldFRhaWwocmVzdWx0LCBkaXJlY3Rpb24pO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBNb3ZlcyB0aGUgY2FyZXQgdG8gdGhlIHNwZWNpZmllZCBpbmRleC5cblx0ICAgKlxuXHQgICAqIFRoZSBpbnB1dCBtdXN0IGJlIG1vdmVkIGJ5IGxlYXZpbmcgaXQgaW4gcGxhY2UgYW5kIG1vdmluZyB0aGVcblx0ICAgKiBzaWJsaW5ncywgZHVlIHRvIHRoZSBmYWN0IHRoYXQgZm9jdXMgY2Fubm90IGJlIHJlc3RvcmVkIG9uY2UgbG9zdFxuXHQgICAqIG9uIG1vYmlsZSB3ZWJraXQgZGV2aWNlc1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldENhcmV0KG5ld19wb3MpIHtcblx0ICAgIHRoaXMuY2FyZXRQb3MgPSB0aGlzLml0ZW1zLmxlbmd0aDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJuIGxpc3Qgb2YgaXRlbSBkb20gZWxlbWVudHNcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjb250cm9sQ2hpbGRyZW4oKSB7XG5cdCAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmNvbnRyb2wucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHMtaXRlbV0nKSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIERpc2FibGVzIHVzZXIgaW5wdXQgb24gdGhlIGNvbnRyb2wuIFVzZWQgd2hpbGVcblx0ICAgKiBpdGVtcyBhcmUgYmVpbmcgYXN5bmNocm9ub3VzbHkgY3JlYXRlZC5cblx0ICAgKi9cblxuXG5cdCAgbG9jaygpIHtcblx0ICAgIHRoaXMuaXNMb2NrZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5yZWZyZXNoU3RhdGUoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmUtZW5hYmxlcyB1c2VyIGlucHV0IG9uIHRoZSBjb250cm9sLlxuXHQgICAqL1xuXG5cblx0ICB1bmxvY2soKSB7XG5cdCAgICB0aGlzLmlzTG9ja2VkID0gZmFsc2U7XG5cdCAgICB0aGlzLnJlZnJlc2hTdGF0ZSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBEaXNhYmxlcyB1c2VyIGlucHV0IG9uIHRoZSBjb250cm9sIGNvbXBsZXRlbHkuXG5cdCAgICogV2hpbGUgZGlzYWJsZWQsIGl0IGNhbm5vdCByZWNlaXZlIGZvY3VzLlxuXHQgICAqL1xuXG5cblx0ICBkaXNhYmxlKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgc2VsZi5pbnB1dC5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICBzZWxmLmNvbnRyb2xfaW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgc2VsZi5mb2N1c19ub2RlLnRhYkluZGV4ID0gLTE7XG5cdCAgICBzZWxmLmlzRGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5jbG9zZSgpO1xuXHQgICAgc2VsZi5sb2NrKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEVuYWJsZXMgdGhlIGNvbnRyb2wgc28gdGhhdCBpdCBjYW4gcmVzcG9uZFxuXHQgICAqIHRvIGZvY3VzIGFuZCB1c2VyIGlucHV0LlxuXHQgICAqL1xuXG5cblx0ICBlbmFibGUoKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBzZWxmLmlucHV0LmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICBzZWxmLmNvbnRyb2xfaW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIHNlbGYuZm9jdXNfbm9kZS50YWJJbmRleCA9IHNlbGYudGFiSW5kZXg7XG5cdCAgICBzZWxmLmlzRGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIHNlbGYudW5sb2NrKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIENvbXBsZXRlbHkgZGVzdHJveXMgdGhlIGNvbnRyb2wgYW5kXG5cdCAgICogdW5iaW5kcyBhbGwgZXZlbnQgbGlzdGVuZXJzIHNvIHRoYXQgaXQgY2FuXG5cdCAgICogYmUgZ2FyYmFnZSBjb2xsZWN0ZWQuXG5cdCAgICovXG5cblxuXHQgIGRlc3Ryb3koKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgcmV2ZXJ0U2V0dGluZ3MgPSBzZWxmLnJldmVydFNldHRpbmdzO1xuXHQgICAgc2VsZi50cmlnZ2VyKCdkZXN0cm95Jyk7XG5cdCAgICBzZWxmLm9mZigpO1xuXHQgICAgc2VsZi53cmFwcGVyLnJlbW92ZSgpO1xuXHQgICAgc2VsZi5kcm9wZG93bi5yZW1vdmUoKTtcblx0ICAgIHNlbGYuaW5wdXQuaW5uZXJIVE1MID0gcmV2ZXJ0U2V0dGluZ3MuaW5uZXJIVE1MO1xuXHQgICAgc2VsZi5pbnB1dC50YWJJbmRleCA9IHJldmVydFNldHRpbmdzLnRhYkluZGV4O1xuXHQgICAgcmVtb3ZlQ2xhc3NlcyhzZWxmLmlucHV0LCAndG9tc2VsZWN0ZWQnLCAndHMtaGlkZGVuLWFjY2Vzc2libGUnKTtcblxuXHQgICAgc2VsZi5fZGVzdHJveSgpO1xuXG5cdCAgICBkZWxldGUgc2VsZi5pbnB1dC50b21zZWxlY3Q7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEEgaGVscGVyIG1ldGhvZCBmb3IgcmVuZGVyaW5nIFwiaXRlbVwiIGFuZFxuXHQgICAqIFwib3B0aW9uXCIgdGVtcGxhdGVzLCBnaXZlbiB0aGUgZGF0YS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICByZW5kZXIodGVtcGxhdGVOYW1lLCBkYXRhKSB7XG5cdCAgICB2YXIgaWQsIGh0bWw7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKHR5cGVvZiB0aGlzLnNldHRpbmdzLnJlbmRlclt0ZW1wbGF0ZU5hbWVdICE9PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfSAvLyByZW5kZXIgbWFya3VwXG5cblxuXHQgICAgaHRtbCA9IHNlbGYuc2V0dGluZ3MucmVuZGVyW3RlbXBsYXRlTmFtZV0uY2FsbCh0aGlzLCBkYXRhLCBlc2NhcGVfaHRtbCk7XG5cblx0ICAgIGlmICghaHRtbCkge1xuXHQgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH1cblxuXHQgICAgaHRtbCA9IGdldERvbShodG1sKTsgLy8gYWRkIG1hbmRhdG9yeSBhdHRyaWJ1dGVzXG5cblx0ICAgIGlmICh0ZW1wbGF0ZU5hbWUgPT09ICdvcHRpb24nIHx8IHRlbXBsYXRlTmFtZSA9PT0gJ29wdGlvbl9jcmVhdGUnKSB7XG5cdCAgICAgIGlmIChkYXRhW3NlbGYuc2V0dGluZ3MuZGlzYWJsZWRGaWVsZF0pIHtcblx0ICAgICAgICBzZXRBdHRyKGh0bWwsIHtcblx0ICAgICAgICAgICdhcmlhLWRpc2FibGVkJzogJ3RydWUnXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgc2V0QXR0cihodG1sLCB7XG5cdCAgICAgICAgICAnZGF0YS1zZWxlY3RhYmxlJzogJydcblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIGlmICh0ZW1wbGF0ZU5hbWUgPT09ICdvcHRncm91cCcpIHtcblx0ICAgICAgaWQgPSBkYXRhLmdyb3VwW3NlbGYuc2V0dGluZ3Mub3B0Z3JvdXBWYWx1ZUZpZWxkXTtcblx0ICAgICAgc2V0QXR0cihodG1sLCB7XG5cdCAgICAgICAgJ2RhdGEtZ3JvdXAnOiBpZFxuXHQgICAgICB9KTtcblxuXHQgICAgICBpZiAoZGF0YS5ncm91cFtzZWxmLnNldHRpbmdzLmRpc2FibGVkRmllbGRdKSB7XG5cdCAgICAgICAgc2V0QXR0cihodG1sLCB7XG5cdCAgICAgICAgICAnZGF0YS1kaXNhYmxlZCc6ICcnXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgaWYgKHRlbXBsYXRlTmFtZSA9PT0gJ29wdGlvbicgfHwgdGVtcGxhdGVOYW1lID09PSAnaXRlbScpIHtcblx0ICAgICAgY29uc3QgdmFsdWUgPSBnZXRfaGFzaChkYXRhW3NlbGYuc2V0dGluZ3MudmFsdWVGaWVsZF0pO1xuXHQgICAgICBzZXRBdHRyKGh0bWwsIHtcblx0ICAgICAgICAnZGF0YS12YWx1ZSc6IHZhbHVlXG5cdCAgICAgIH0pOyAvLyBtYWtlIHN1cmUgd2UgaGF2ZSBzb21lIGNsYXNzZXMgaWYgYSB0ZW1wbGF0ZSBpcyBvdmVyd3JpdHRlblxuXG5cdCAgICAgIGlmICh0ZW1wbGF0ZU5hbWUgPT09ICdpdGVtJykge1xuXHQgICAgICAgIGFkZENsYXNzZXMoaHRtbCwgc2VsZi5zZXR0aW5ncy5pdGVtQ2xhc3MpO1xuXHQgICAgICAgIHNldEF0dHIoaHRtbCwge1xuXHQgICAgICAgICAgJ2RhdGEtdHMtaXRlbSc6ICcnXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgYWRkQ2xhc3NlcyhodG1sLCBzZWxmLnNldHRpbmdzLm9wdGlvbkNsYXNzKTtcblx0ICAgICAgICBzZXRBdHRyKGh0bWwsIHtcblx0ICAgICAgICAgIHJvbGU6ICdvcHRpb24nLFxuXHQgICAgICAgICAgaWQ6IGRhdGEuJGlkXG5cdCAgICAgICAgfSk7IC8vIHVwZGF0ZSBjYWNoZVxuXG5cdCAgICAgICAgZGF0YS4kZGl2ID0gaHRtbDtcblx0ICAgICAgICBzZWxmLm9wdGlvbnNbdmFsdWVdID0gZGF0YTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gaHRtbDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHlwZSBndWFyZGVkIHJlbmRlcmluZ1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIF9yZW5kZXIodGVtcGxhdGVOYW1lLCBkYXRhKSB7XG5cdCAgICBjb25zdCBodG1sID0gdGhpcy5yZW5kZXIodGVtcGxhdGVOYW1lLCBkYXRhKTtcblxuXHQgICAgaWYgKGh0bWwgPT0gbnVsbCkge1xuXHQgICAgICB0aHJvdyAnSFRNTEVsZW1lbnQgZXhwZWN0ZWQnO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gaHRtbDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQ2xlYXJzIHRoZSByZW5kZXIgY2FjaGUgZm9yIGEgdGVtcGxhdGUuIElmXG5cdCAgICogbm8gdGVtcGxhdGUgaXMgZ2l2ZW4sIGNsZWFycyBhbGwgcmVuZGVyXG5cdCAgICogY2FjaGVzLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNsZWFyQ2FjaGUoKSB7XG5cdCAgICBpdGVyYXRlJDEodGhpcy5vcHRpb25zLCBvcHRpb24gPT4ge1xuXHQgICAgICBpZiAob3B0aW9uLiRkaXYpIHtcblx0ICAgICAgICBvcHRpb24uJGRpdi5yZW1vdmUoKTtcblx0ICAgICAgICBkZWxldGUgb3B0aW9uLiRkaXY7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZW1vdmVzIGEgdmFsdWUgZnJvbSBpdGVtIGFuZCBvcHRpb24gY2FjaGVzXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgdW5jYWNoZVZhbHVlKHZhbHVlKSB7XG5cdCAgICBjb25zdCBvcHRpb25fZWwgPSB0aGlzLmdldE9wdGlvbih2YWx1ZSk7XG5cdCAgICBpZiAob3B0aW9uX2VsKSBvcHRpb25fZWwucmVtb3ZlKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIERldGVybWluZXMgd2hldGhlciBvciBub3QgdG8gZGlzcGxheSB0aGVcblx0ICAgKiBjcmVhdGUgaXRlbSBwcm9tcHQsIGdpdmVuIGEgdXNlciBpbnB1dC5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjYW5DcmVhdGUoaW5wdXQpIHtcblx0ICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmNyZWF0ZSAmJiBpbnB1dC5sZW5ndGggPiAwICYmIHRoaXMuc2V0dGluZ3MuY3JlYXRlRmlsdGVyLmNhbGwodGhpcywgaW5wdXQpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBXcmFwcyB0aGlzLmBtZXRob2RgIHNvIHRoYXQgYG5ld19mbmAgY2FuIGJlIGludm9rZWQgJ2JlZm9yZScsICdhZnRlcicsIG9yICdpbnN0ZWFkJyBvZiB0aGUgb3JpZ2luYWwgbWV0aG9kXG5cdCAgICpcblx0ICAgKiB0aGlzLmhvb2soJ2luc3RlYWQnLCdvbktleURvd24nLGZ1bmN0aW9uKCBhcmcxLCBhcmcyIC4uLil7XG5cdCAgICpcblx0ICAgKiB9KTtcblx0ICAgKi9cblxuXG5cdCAgaG9vayh3aGVuLCBtZXRob2QsIG5ld19mbikge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIG9yaWdfbWV0aG9kID0gc2VsZlttZXRob2RdO1xuXG5cdCAgICBzZWxmW21ldGhvZF0gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIHZhciByZXN1bHQsIHJlc3VsdF9uZXc7XG5cblx0ICAgICAgaWYgKHdoZW4gPT09ICdhZnRlcicpIHtcblx0ICAgICAgICByZXN1bHQgPSBvcmlnX21ldGhvZC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmVzdWx0X25ldyA9IG5ld19mbi5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXG5cdCAgICAgIGlmICh3aGVuID09PSAnaW5zdGVhZCcpIHtcblx0ICAgICAgICByZXR1cm4gcmVzdWx0X25ldztcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICh3aGVuID09PSAnYmVmb3JlJykge1xuXHQgICAgICAgIHJlc3VsdCA9IG9yaWdfbWV0aG9kLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgfTtcblx0ICB9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwiY2hhbmdlX2xpc3RlbmVyXCIgKFRvbSBTZWxlY3QpXG5cdCAqIENvcHlyaWdodCAoYykgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gY2hhbmdlX2xpc3RlbmVyICgpIHtcblx0ICBhZGRFdmVudCh0aGlzLmlucHV0LCAnY2hhbmdlJywgKCkgPT4ge1xuXHQgICAgdGhpcy5zeW5jKCk7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcInJlc3RvcmVfb25fYmFja3NwYWNlXCIgKFRvbSBTZWxlY3QpXG5cdCAqIENvcHlyaWdodCAoYykgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tib3hfb3B0aW9ucyAoKSB7XG5cdCAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgIHZhciBvcmlnX29uT3B0aW9uU2VsZWN0ID0gc2VsZi5vbk9wdGlvblNlbGVjdDtcblx0ICBzZWxmLnNldHRpbmdzLmhpZGVTZWxlY3RlZCA9IGZhbHNlOyAvLyB1cGRhdGUgdGhlIGNoZWNrYm94IGZvciBhbiBvcHRpb25cblxuXHQgIHZhciBVcGRhdGVDaGVja2JveCA9IGZ1bmN0aW9uIFVwZGF0ZUNoZWNrYm94KG9wdGlvbikge1xuXHQgICAgc2V0VGltZW91dCgoKSA9PiB7XG5cdCAgICAgIHZhciBjaGVja2JveCA9IG9wdGlvbi5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuXG5cdCAgICAgIGlmIChjaGVja2JveCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHtcblx0ICAgICAgICBpZiAob3B0aW9uLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSkge1xuXHQgICAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0sIDEpO1xuXHQgIH07IC8vIGFkZCBjaGVja2JveCB0byBvcHRpb24gdGVtcGxhdGVcblxuXG5cdCAgc2VsZi5ob29rKCdhZnRlcicsICdzZXR1cFRlbXBsYXRlcycsICgpID0+IHtcblx0ICAgIHZhciBvcmlnX3JlbmRlcl9vcHRpb24gPSBzZWxmLnNldHRpbmdzLnJlbmRlci5vcHRpb247XG5cblx0ICAgIHNlbGYuc2V0dGluZ3MucmVuZGVyLm9wdGlvbiA9IChkYXRhLCBlc2NhcGVfaHRtbCkgPT4ge1xuXHQgICAgICB2YXIgcmVuZGVyZWQgPSBnZXREb20ob3JpZ19yZW5kZXJfb3B0aW9uLmNhbGwoc2VsZiwgZGF0YSwgZXNjYXBlX2h0bWwpKTtcblx0ICAgICAgdmFyIGNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblx0ICAgICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZ0KSB7XG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZXZ0KTtcblx0ICAgICAgfSk7XG5cdCAgICAgIGNoZWNrYm94LnR5cGUgPSAnY2hlY2tib3gnO1xuXHQgICAgICBjb25zdCBoYXNoZWQgPSBoYXNoX2tleShkYXRhW3NlbGYuc2V0dGluZ3MudmFsdWVGaWVsZF0pO1xuXG5cdCAgICAgIGlmIChoYXNoZWQgJiYgc2VsZi5pdGVtcy5pbmRleE9mKGhhc2hlZCkgPiAtMSkge1xuXHQgICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmVuZGVyZWQucHJlcGVuZChjaGVja2JveCk7XG5cdCAgICAgIHJldHVybiByZW5kZXJlZDtcblx0ICAgIH07XG5cdCAgfSk7IC8vIHVuY2hlY2sgd2hlbiBpdGVtIHJlbW92ZWRcblxuXHQgIHNlbGYub24oJ2l0ZW1fcmVtb3ZlJywgdmFsdWUgPT4ge1xuXHQgICAgdmFyIG9wdGlvbiA9IHNlbGYuZ2V0T3B0aW9uKHZhbHVlKTtcblxuXHQgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICAvLyBpZiBkcm9wZG93biBoYXNuJ3QgYmVlbiBvcGVuZWQgeWV0LCB0aGUgb3B0aW9uIHdvbid0IGV4aXN0XG5cdCAgICAgIG9wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpOyAvLyBzZWxlY3RlZCBjbGFzcyB3b24ndCBiZSByZW1vdmVkIHlldFxuXG5cdCAgICAgIFVwZGF0ZUNoZWNrYm94KG9wdGlvbik7XG5cdCAgICB9XG5cdCAgfSk7IC8vIGNoZWNrIHdoZW4gaXRlbSBhZGRlZFxuXG5cdCAgc2VsZi5vbignaXRlbV9hZGQnLCB2YWx1ZSA9PiB7XG5cdCAgICB2YXIgb3B0aW9uID0gc2VsZi5nZXRPcHRpb24odmFsdWUpO1xuXG5cdCAgICBpZiAob3B0aW9uKSB7XG5cdCAgICAgIC8vIGlmIGRyb3Bkb3duIGhhc24ndCBiZWVuIG9wZW5lZCB5ZXQsIHRoZSBvcHRpb24gd29uJ3QgZXhpc3Rcblx0ICAgICAgVXBkYXRlQ2hlY2tib3gob3B0aW9uKTtcblx0ICAgIH1cblx0ICB9KTsgLy8gcmVtb3ZlIGl0ZW1zIHdoZW4gc2VsZWN0ZWQgb3B0aW9uIGlzIGNsaWNrZWRcblxuXHQgIHNlbGYuaG9vaygnaW5zdGVhZCcsICdvbk9wdGlvblNlbGVjdCcsIChldnQsIG9wdGlvbikgPT4ge1xuXHQgICAgaWYgKG9wdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykpIHtcblx0ICAgICAgb3B0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XG5cdCAgICAgIHNlbGYucmVtb3ZlSXRlbShvcHRpb24uZGF0YXNldC52YWx1ZSk7XG5cdCAgICAgIHNlbGYucmVmcmVzaE9wdGlvbnMoKTtcblx0ICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBvcmlnX29uT3B0aW9uU2VsZWN0LmNhbGwoc2VsZiwgZXZ0LCBvcHRpb24pO1xuXHQgICAgVXBkYXRlQ2hlY2tib3gob3B0aW9uKTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwiZHJvcGRvd25faGVhZGVyXCIgKFRvbSBTZWxlY3QpXG5cdCAqIENvcHlyaWdodCAoYykgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gY2xlYXJfYnV0dG9uICh1c2VyT3B0aW9ucykge1xuXHQgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcblx0ICAgIGNsYXNzTmFtZTogJ2NsZWFyLWJ1dHRvbicsXG5cdCAgICB0aXRsZTogJ0NsZWFyIEFsbCcsXG5cdCAgICBodG1sOiBkYXRhID0+IHtcblx0ICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiJHtkYXRhLmNsYXNzTmFtZX1cIiB0aXRsZT1cIiR7ZGF0YS50aXRsZX1cIj4mIzEwNzk5OzwvZGl2PmA7XG5cdCAgICB9XG5cdCAgfSwgdXNlck9wdGlvbnMpO1xuXHQgIHNlbGYub24oJ2luaXRpYWxpemUnLCAoKSA9PiB7XG5cdCAgICB2YXIgYnV0dG9uID0gZ2V0RG9tKG9wdGlvbnMuaHRtbChvcHRpb25zKSk7XG5cdCAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldnQgPT4ge1xuXHQgICAgICBpZiAoc2VsZi5pc0Rpc2FibGVkKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cblx0ICAgICAgc2VsZi5jbGVhcigpO1xuXG5cdCAgICAgIGlmIChzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdzaW5nbGUnICYmIHNlbGYuc2V0dGluZ3MuYWxsb3dFbXB0eU9wdGlvbikge1xuXHQgICAgICAgIHNlbGYuYWRkSXRlbSgnJyk7XG5cdCAgICAgIH1cblxuXHQgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgfSk7XG5cdCAgICBzZWxmLmNvbnRyb2wuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwiZHJhZ19kcm9wXCIgKFRvbSBTZWxlY3QpXG5cdCAqIENvcHlyaWdodCAoYykgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gZHJhZ19kcm9wICgpIHtcblx0ICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgaWYgKCEkLmZuLnNvcnRhYmxlKSB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcImRyYWdfZHJvcFwiIHBsdWdpbiByZXF1aXJlcyBqUXVlcnkgVUkgXCJzb3J0YWJsZVwiLicpO1xuXHQgIGlmIChzZWxmLnNldHRpbmdzLm1vZGUgIT09ICdtdWx0aScpIHJldHVybjtcblx0ICB2YXIgb3JpZ19sb2NrID0gc2VsZi5sb2NrO1xuXHQgIHZhciBvcmlnX3VubG9jayA9IHNlbGYudW5sb2NrO1xuXHQgIHNlbGYuaG9vaygnaW5zdGVhZCcsICdsb2NrJywgKCkgPT4ge1xuXHQgICAgdmFyIHNvcnRhYmxlID0gJChzZWxmLmNvbnRyb2wpLmRhdGEoJ3NvcnRhYmxlJyk7XG5cdCAgICBpZiAoc29ydGFibGUpIHNvcnRhYmxlLmRpc2FibGUoKTtcblx0ICAgIHJldHVybiBvcmlnX2xvY2suY2FsbChzZWxmKTtcblx0ICB9KTtcblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAndW5sb2NrJywgKCkgPT4ge1xuXHQgICAgdmFyIHNvcnRhYmxlID0gJChzZWxmLmNvbnRyb2wpLmRhdGEoJ3NvcnRhYmxlJyk7XG5cdCAgICBpZiAoc29ydGFibGUpIHNvcnRhYmxlLmVuYWJsZSgpO1xuXHQgICAgcmV0dXJuIG9yaWdfdW5sb2NrLmNhbGwoc2VsZik7XG5cdCAgfSk7XG5cdCAgc2VsZi5vbignaW5pdGlhbGl6ZScsICgpID0+IHtcblx0ICAgIHZhciAkY29udHJvbCA9ICQoc2VsZi5jb250cm9sKS5zb3J0YWJsZSh7XG5cdCAgICAgIGl0ZW1zOiAnW2RhdGEtdmFsdWVdJyxcblx0ICAgICAgZm9yY2VQbGFjZWhvbGRlclNpemU6IHRydWUsXG5cdCAgICAgIGRpc2FibGVkOiBzZWxmLmlzTG9ja2VkLFxuXHQgICAgICBzdGFydDogKGUsIHVpKSA9PiB7XG5cdCAgICAgICAgdWkucGxhY2Vob2xkZXIuY3NzKCd3aWR0aCcsIHVpLmhlbHBlci5jc3MoJ3dpZHRoJykpO1xuXHQgICAgICAgICRjb250cm9sLmNzcyh7XG5cdCAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0sXG5cdCAgICAgIHN0b3A6ICgpID0+IHtcblx0ICAgICAgICAkY29udHJvbC5jc3Moe1xuXHQgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuXHQgICAgICAgICRjb250cm9sLmNoaWxkcmVuKCdbZGF0YS12YWx1ZV0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgIGlmICh0aGlzLmRhdGFzZXQudmFsdWUpIHZhbHVlcy5wdXNoKHRoaXMuZGF0YXNldC52YWx1ZSk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgc2VsZi5zZXRWYWx1ZSh2YWx1ZXMpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwiZHJvcGRvd25faGVhZGVyXCIgKFRvbSBTZWxlY3QpXG5cdCAqIENvcHlyaWdodCAoYykgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gZHJvcGRvd25faGVhZGVyICh1c2VyT3B0aW9ucykge1xuXHQgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcblx0ICAgIHRpdGxlOiAnVW50aXRsZWQnLFxuXHQgICAgaGVhZGVyQ2xhc3M6ICdkcm9wZG93bi1oZWFkZXInLFxuXHQgICAgdGl0bGVSb3dDbGFzczogJ2Ryb3Bkb3duLWhlYWRlci10aXRsZScsXG5cdCAgICBsYWJlbENsYXNzOiAnZHJvcGRvd24taGVhZGVyLWxhYmVsJyxcblx0ICAgIGNsb3NlQ2xhc3M6ICdkcm9wZG93bi1oZWFkZXItY2xvc2UnLFxuXHQgICAgaHRtbDogZGF0YSA9PiB7XG5cdCAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cIicgKyBkYXRhLmhlYWRlckNsYXNzICsgJ1wiPicgKyAnPGRpdiBjbGFzcz1cIicgKyBkYXRhLnRpdGxlUm93Q2xhc3MgKyAnXCI+JyArICc8c3BhbiBjbGFzcz1cIicgKyBkYXRhLmxhYmVsQ2xhc3MgKyAnXCI+JyArIGRhdGEudGl0bGUgKyAnPC9zcGFuPicgKyAnPGEgY2xhc3M9XCInICsgZGF0YS5jbG9zZUNsYXNzICsgJ1wiPiZ0aW1lczs8L2E+JyArICc8L2Rpdj4nICsgJzwvZGl2Pic7XG5cdCAgICB9XG5cdCAgfSwgdXNlck9wdGlvbnMpO1xuXHQgIHNlbGYub24oJ2luaXRpYWxpemUnLCAoKSA9PiB7XG5cdCAgICB2YXIgaGVhZGVyID0gZ2V0RG9tKG9wdGlvbnMuaHRtbChvcHRpb25zKSk7XG5cdCAgICB2YXIgY2xvc2VfbGluayA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKCcuJyArIG9wdGlvbnMuY2xvc2VDbGFzcyk7XG5cblx0ICAgIGlmIChjbG9zZV9saW5rKSB7XG5cdCAgICAgIGNsb3NlX2xpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldnQgPT4ge1xuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi5kcm9wZG93bi5pbnNlcnRCZWZvcmUoaGVhZGVyLCBzZWxmLmRyb3Bkb3duLmZpcnN0Q2hpbGQpO1xuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJkcm9wZG93bl9pbnB1dFwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGNhcmV0X3Bvc2l0aW9uICgpIHtcblx0ICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgLyoqXG5cdCAgICogTW92ZXMgdGhlIGNhcmV0IHRvIHRoZSBzcGVjaWZpZWQgaW5kZXguXG5cdCAgICpcblx0ICAgKiBUaGUgaW5wdXQgbXVzdCBiZSBtb3ZlZCBieSBsZWF2aW5nIGl0IGluIHBsYWNlIGFuZCBtb3ZpbmcgdGhlXG5cdCAgICogc2libGluZ3MsIGR1ZSB0byB0aGUgZmFjdCB0aGF0IGZvY3VzIGNhbm5vdCBiZSByZXN0b3JlZCBvbmNlIGxvc3Rcblx0ICAgKiBvbiBtb2JpbGUgd2Via2l0IGRldmljZXNcblx0ICAgKlxuXHQgICAqL1xuXG5cdCAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ3NldENhcmV0JywgbmV3X3BvcyA9PiB7XG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJyB8fCAhc2VsZi5jb250cm9sLmNvbnRhaW5zKHNlbGYuY29udHJvbF9pbnB1dCkpIHtcblx0ICAgICAgbmV3X3BvcyA9IHNlbGYuaXRlbXMubGVuZ3RoO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgbmV3X3BvcyA9IE1hdGgubWF4KDAsIE1hdGgubWluKHNlbGYuaXRlbXMubGVuZ3RoLCBuZXdfcG9zKSk7XG5cblx0ICAgICAgaWYgKG5ld19wb3MgIT0gc2VsZi5jYXJldFBvcyAmJiAhc2VsZi5pc1BlbmRpbmcpIHtcblx0ICAgICAgICBzZWxmLmNvbnRyb2xDaGlsZHJlbigpLmZvckVhY2goKGNoaWxkLCBqKSA9PiB7XG5cdCAgICAgICAgICBpZiAoaiA8IG5ld19wb3MpIHtcblx0ICAgICAgICAgICAgc2VsZi5jb250cm9sX2lucHV0Lmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlYmVnaW4nLCBjaGlsZCk7XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBzZWxmLmNvbnRyb2wuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuY2FyZXRQb3MgPSBuZXdfcG9zO1xuXHQgIH0pO1xuXHQgIHNlbGYuaG9vaygnaW5zdGVhZCcsICdtb3ZlQ2FyZXQnLCBkaXJlY3Rpb24gPT4ge1xuXHQgICAgaWYgKCFzZWxmLmlzRm9jdXNlZCkgcmV0dXJuOyAvLyBtb3ZlIGNhcmV0IGJlZm9yZSBvciBhZnRlciBzZWxlY3RlZCBpdGVtc1xuXG5cdCAgICBjb25zdCBsYXN0X2FjdGl2ZSA9IHNlbGYuZ2V0TGFzdEFjdGl2ZShkaXJlY3Rpb24pO1xuXG5cdCAgICBpZiAobGFzdF9hY3RpdmUpIHtcblx0ICAgICAgY29uc3QgaWR4ID0gbm9kZUluZGV4KGxhc3RfYWN0aXZlKTtcblx0ICAgICAgc2VsZi5zZXRDYXJldChkaXJlY3Rpb24gPiAwID8gaWR4ICsgMSA6IGlkeCk7XG5cdCAgICAgIHNlbGYuc2V0QWN0aXZlSXRlbSgpO1xuXHQgICAgICByZW1vdmVDbGFzc2VzKGxhc3RfYWN0aXZlLCAnbGFzdC1hY3RpdmUnKTsgLy8gbW92ZSBjYXJldCBsZWZ0IG9yIHJpZ2h0IG9mIGN1cnJlbnQgcG9zaXRpb25cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYuc2V0Q2FyZXQoc2VsZi5jYXJldFBvcyArIGRpcmVjdGlvbik7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImRyb3Bkb3duX2lucHV0XCIgKFRvbSBTZWxlY3QpXG5cdCAqIENvcHlyaWdodCAoYykgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gZHJvcGRvd25faW5wdXQgKCkge1xuXHQgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgIHNlbGYuc2V0dGluZ3Muc2hvdWxkT3BlbiA9IHRydWU7IC8vIG1ha2Ugc3VyZSB0aGUgaW5wdXQgaXMgc2hvd24gZXZlbiBpZiB0aGVyZSBhcmUgbm8gb3B0aW9ucyB0byBkaXNwbGF5IGluIHRoZSBkcm9wZG93blxuXG5cdCAgc2VsZi5ob29rKCdiZWZvcmUnLCAnc2V0dXAnLCAoKSA9PiB7XG5cdCAgICBzZWxmLmZvY3VzX25vZGUgPSBzZWxmLmNvbnRyb2w7XG5cdCAgICBhZGRDbGFzc2VzKHNlbGYuY29udHJvbF9pbnB1dCwgJ2Ryb3Bkb3duLWlucHV0Jyk7XG5cdCAgICBjb25zdCBkaXYgPSBnZXREb20oJzxkaXYgY2xhc3M9XCJkcm9wZG93bi1pbnB1dC13cmFwXCI+Jyk7XG5cdCAgICBkaXYuYXBwZW5kKHNlbGYuY29udHJvbF9pbnB1dCk7XG5cdCAgICBzZWxmLmRyb3Bkb3duLmluc2VydEJlZm9yZShkaXYsIHNlbGYuZHJvcGRvd24uZmlyc3RDaGlsZCk7IC8vIHNldCBhIHBsYWNlaG9sZGVyIGluIHRoZSBzZWxlY3QgY29udHJvbFxuXG5cdCAgICBjb25zdCBwbGFjZWhvbGRlciA9IGdldERvbSgnPGlucHV0IGNsYXNzPVwiaXRlbXMtcGxhY2Vob2xkZXJcIiB0YWJpbmRleD1cIi0xXCIgLz4nKTtcblx0ICAgIHBsYWNlaG9sZGVyLnBsYWNlaG9sZGVyID0gc2VsZi5zZXR0aW5ncy5wbGFjZWhvbGRlciB8fCAnJztcblx0ICAgIHNlbGYuY29udHJvbC5hcHBlbmQocGxhY2Vob2xkZXIpO1xuXHQgIH0pO1xuXHQgIHNlbGYub24oJ2luaXRpYWxpemUnLCAoKSA9PiB7XG5cdCAgICAvLyBzZXQgdGFiSW5kZXggb24gY29udHJvbCB0byAtMSwgb3RoZXJ3aXNlIFtzaGlmdCt0YWJdIHdpbGwgcHV0IGZvY3VzIHJpZ2h0IGJhY2sgb24gY29udHJvbF9pbnB1dFxuXHQgICAgc2VsZi5jb250cm9sX2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldnQgPT4ge1xuXHQgICAgICAvL2FkZEV2ZW50KHNlbGYuY29udHJvbF9pbnB1dCwna2V5ZG93bicgYXMgY29uc3QsKGV2dDpLZXlib2FyZEV2ZW50KSA9Pntcblx0ICAgICAgc3dpdGNoIChldnQua2V5Q29kZSkge1xuXHQgICAgICAgIGNhc2UgS0VZX0VTQzpcblx0ICAgICAgICAgIGlmIChzZWxmLmlzT3Blbikge1xuXHQgICAgICAgICAgICBwcmV2ZW50RGVmYXVsdChldnQsIHRydWUpO1xuXHQgICAgICAgICAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICAgICAgICB9XG5cblx0ICAgICAgICAgIHNlbGYuY2xlYXJBY3RpdmVJdGVtcygpO1xuXHQgICAgICAgICAgcmV0dXJuO1xuXG5cdCAgICAgICAgY2FzZSBLRVlfVEFCOlxuXHQgICAgICAgICAgc2VsZi5mb2N1c19ub2RlLnRhYkluZGV4ID0gLTE7XG5cdCAgICAgICAgICBicmVhaztcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBzZWxmLm9uS2V5RG93bi5jYWxsKHNlbGYsIGV2dCk7XG5cdCAgICB9KTtcblx0ICAgIHNlbGYub24oJ2JsdXInLCAoKSA9PiB7XG5cdCAgICAgIHNlbGYuZm9jdXNfbm9kZS50YWJJbmRleCA9IHNlbGYuaXNEaXNhYmxlZCA/IC0xIDogc2VsZi50YWJJbmRleDtcblx0ICAgIH0pOyAvLyBnaXZlIHRoZSBjb250cm9sX2lucHV0IGZvY3VzIHdoZW4gdGhlIGRyb3Bkb3duIGlzIG9wZW5cblxuXHQgICAgc2VsZi5vbignZHJvcGRvd25fb3BlbicsICgpID0+IHtcblx0ICAgICAgc2VsZi5jb250cm9sX2lucHV0LmZvY3VzKCk7XG5cdCAgICB9KTsgLy8gcHJldmVudCBvbkJsdXIgZnJvbSBjbG9zaW5nIHdoZW4gZm9jdXMgaXMgb24gdGhlIGNvbnRyb2xfaW5wdXRcblxuXHQgICAgY29uc3Qgb3JpZ19vbkJsdXIgPSBzZWxmLm9uQmx1cjtcblx0ICAgIHNlbGYuaG9vaygnaW5zdGVhZCcsICdvbkJsdXInLCBldnQgPT4ge1xuXHQgICAgICBpZiAoZXZ0ICYmIGV2dC5yZWxhdGVkVGFyZ2V0ID09IHNlbGYuY29udHJvbF9pbnB1dCkgcmV0dXJuO1xuXHQgICAgICByZXR1cm4gb3JpZ19vbkJsdXIuY2FsbChzZWxmKTtcblx0ICAgIH0pO1xuXHQgICAgYWRkRXZlbnQoc2VsZi5jb250cm9sX2lucHV0LCAnYmx1cicsICgpID0+IHNlbGYub25CbHVyKCkpOyAvLyByZXR1cm4gZm9jdXMgdG8gY29udHJvbCB0byBhbGxvdyBmdXJ0aGVyIGtleWJvYXJkIGlucHV0XG5cblx0ICAgIHNlbGYuaG9vaygnYmVmb3JlJywgJ2Nsb3NlJywgKCkgPT4ge1xuXHQgICAgICBpZiAoIXNlbGYuaXNPcGVuKSByZXR1cm47XG5cdCAgICAgIHNlbGYuZm9jdXNfbm9kZS5mb2N1cyh7XG5cdCAgICAgICAgcHJldmVudFNjcm9sbDogdHJ1ZVxuXHQgICAgICB9KTtcblx0ICAgIH0pO1xuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJpbnB1dF9hdXRvZ3Jvd1wiIChUb20gU2VsZWN0KVxuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGlucHV0X2F1dG9ncm93ICgpIHtcblx0ICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgc2VsZi5vbignaW5pdGlhbGl6ZScsICgpID0+IHtcblx0ICAgIHZhciB0ZXN0X2lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHQgICAgdmFyIGNvbnRyb2wgPSBzZWxmLmNvbnRyb2xfaW5wdXQ7XG5cdCAgICB0ZXN0X2lucHV0LnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246YWJzb2x1dGU7IHRvcDotOTk5OTlweDsgbGVmdDotOTk5OTlweDsgd2lkdGg6YXV0bzsgcGFkZGluZzowOyB3aGl0ZS1zcGFjZTpwcmU7ICc7XG5cdCAgICBzZWxmLndyYXBwZXIuYXBwZW5kQ2hpbGQodGVzdF9pbnB1dCk7XG5cdCAgICB2YXIgdHJhbnNmZXJfc3R5bGVzID0gWydsZXR0ZXJTcGFjaW5nJywgJ2ZvbnRTaXplJywgJ2ZvbnRGYW1pbHknLCAnZm9udFdlaWdodCcsICd0ZXh0VHJhbnNmb3JtJ107XG5cblx0ICAgIGZvciAoY29uc3Qgc3R5bGVfbmFtZSBvZiB0cmFuc2Zlcl9zdHlsZXMpIHtcblx0ICAgICAgLy8gQHRzLWlnbm9yZSBUUzcwMTUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzUwNTA2MTU0LzY5NzU3NlxuXHQgICAgICB0ZXN0X2lucHV0LnN0eWxlW3N0eWxlX25hbWVdID0gY29udHJvbC5zdHlsZVtzdHlsZV9uYW1lXTtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogU2V0IHRoZSBjb250cm9sIHdpZHRoXG5cdCAgICAgKlxuXHQgICAgICovXG5cblxuXHQgICAgdmFyIHJlc2l6ZSA9ICgpID0+IHtcblx0ICAgICAgdGVzdF9pbnB1dC50ZXh0Q29udGVudCA9IGNvbnRyb2wudmFsdWU7XG5cdCAgICAgIGNvbnRyb2wuc3R5bGUud2lkdGggPSB0ZXN0X2lucHV0LmNsaWVudFdpZHRoICsgJ3B4Jztcblx0ICAgIH07XG5cblx0ICAgIHJlc2l6ZSgpO1xuXHQgICAgc2VsZi5vbigndXBkYXRlIGl0ZW1fYWRkIGl0ZW1fcmVtb3ZlJywgcmVzaXplKTtcblx0ICAgIGFkZEV2ZW50KGNvbnRyb2wsICdpbnB1dCcsIHJlc2l6ZSk7XG5cdCAgICBhZGRFdmVudChjb250cm9sLCAna2V5dXAnLCByZXNpemUpO1xuXHQgICAgYWRkRXZlbnQoY29udHJvbCwgJ2JsdXInLCByZXNpemUpO1xuXHQgICAgYWRkRXZlbnQoY29udHJvbCwgJ3VwZGF0ZScsIHJlc2l6ZSk7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImlucHV0X2F1dG9ncm93XCIgKFRvbSBTZWxlY3QpXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gbm9fYmFja3NwYWNlX2RlbGV0ZSAoKSB7XG5cdCAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgIHZhciBvcmlnX2RlbGV0ZVNlbGVjdGlvbiA9IHNlbGYuZGVsZXRlU2VsZWN0aW9uO1xuXHQgIHRoaXMuaG9vaygnaW5zdGVhZCcsICdkZWxldGVTZWxlY3Rpb24nLCBldnQgPT4ge1xuXHQgICAgaWYgKHNlbGYuYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgIHJldHVybiBvcmlnX2RlbGV0ZVNlbGVjdGlvbi5jYWxsKHNlbGYsIGV2dCk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwibm9fYWN0aXZlX2l0ZW1zXCIgKFRvbSBTZWxlY3QpXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gbm9fYWN0aXZlX2l0ZW1zICgpIHtcblx0ICB0aGlzLmhvb2soJ2luc3RlYWQnLCAnc2V0QWN0aXZlSXRlbScsICgpID0+IHt9KTtcblx0ICB0aGlzLmhvb2soJ2luc3RlYWQnLCAnc2VsZWN0QWxsJywgKCkgPT4ge30pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJvcHRncm91cF9jb2x1bW5zXCIgKFRvbSBTZWxlY3QuanMpXG5cdCAqIENvcHlyaWdodCAoYykgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gb3B0Z3JvdXBfY29sdW1ucyAoKSB7XG5cdCAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgIHZhciBvcmlnX2tleWRvd24gPSBzZWxmLm9uS2V5RG93bjtcblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnb25LZXlEb3duJywgZXZ0ID0+IHtcblx0ICAgIHZhciBpbmRleCwgb3B0aW9uLCBvcHRpb25zLCBvcHRncm91cDtcblxuXHQgICAgaWYgKCFzZWxmLmlzT3BlbiB8fCAhKGV2dC5rZXlDb2RlID09PSBLRVlfTEVGVCB8fCBldnQua2V5Q29kZSA9PT0gS0VZX1JJR0hUKSkge1xuXHQgICAgICByZXR1cm4gb3JpZ19rZXlkb3duLmNhbGwoc2VsZiwgZXZ0KTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi5pZ25vcmVIb3ZlciA9IHRydWU7XG5cdCAgICBvcHRncm91cCA9IHBhcmVudE1hdGNoKHNlbGYuYWN0aXZlT3B0aW9uLCAnW2RhdGEtZ3JvdXBdJyk7XG5cdCAgICBpbmRleCA9IG5vZGVJbmRleChzZWxmLmFjdGl2ZU9wdGlvbiwgJ1tkYXRhLXNlbGVjdGFibGVdJyk7XG5cblx0ICAgIGlmICghb3B0Z3JvdXApIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoZXZ0LmtleUNvZGUgPT09IEtFWV9MRUZUKSB7XG5cdCAgICAgIG9wdGdyb3VwID0gb3B0Z3JvdXAucHJldmlvdXNTaWJsaW5nO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgb3B0Z3JvdXAgPSBvcHRncm91cC5uZXh0U2libGluZztcblx0ICAgIH1cblxuXHQgICAgaWYgKCFvcHRncm91cCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIG9wdGlvbnMgPSBvcHRncm91cC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1zZWxlY3RhYmxlXScpO1xuXHQgICAgb3B0aW9uID0gb3B0aW9uc1tNYXRoLm1pbihvcHRpb25zLmxlbmd0aCAtIDEsIGluZGV4KV07XG5cblx0ICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgc2VsZi5zZXRBY3RpdmVPcHRpb24ob3B0aW9uKTtcblx0ICAgIH1cblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwicmVtb3ZlX2J1dHRvblwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIHJlbW92ZV9idXR0b24gKHVzZXJPcHRpb25zKSB7XG5cdCAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuXHQgICAgbGFiZWw6ICcmdGltZXM7Jyxcblx0ICAgIHRpdGxlOiAnUmVtb3ZlJyxcblx0ICAgIGNsYXNzTmFtZTogJ3JlbW92ZScsXG5cdCAgICBhcHBlbmQ6IHRydWVcblx0ICB9LCB1c2VyT3B0aW9ucyk7IC8vb3B0aW9ucy5jbGFzc05hbWUgPSAncmVtb3ZlLXNpbmdsZSc7XG5cblx0ICB2YXIgc2VsZiA9IHRoaXM7IC8vIG92ZXJyaWRlIHRoZSByZW5kZXIgbWV0aG9kIHRvIGFkZCByZW1vdmUgYnV0dG9uIHRvIGVhY2ggaXRlbVxuXG5cdCAgaWYgKCFvcHRpb25zLmFwcGVuZCkge1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblxuXHQgIHZhciBodG1sID0gJzxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBjbGFzcz1cIicgKyBvcHRpb25zLmNsYXNzTmFtZSArICdcIiB0YWJpbmRleD1cIi0xXCIgdGl0bGU9XCInICsgZXNjYXBlX2h0bWwob3B0aW9ucy50aXRsZSkgKyAnXCI+JyArIG9wdGlvbnMubGFiZWwgKyAnPC9hPic7XG5cdCAgc2VsZi5ob29rKCdhZnRlcicsICdzZXR1cFRlbXBsYXRlcycsICgpID0+IHtcblx0ICAgIHZhciBvcmlnX3JlbmRlcl9pdGVtID0gc2VsZi5zZXR0aW5ncy5yZW5kZXIuaXRlbTtcblxuXHQgICAgc2VsZi5zZXR0aW5ncy5yZW5kZXIuaXRlbSA9IChkYXRhLCBlc2NhcGUpID0+IHtcblx0ICAgICAgdmFyIGl0ZW0gPSBnZXREb20ob3JpZ19yZW5kZXJfaXRlbS5jYWxsKHNlbGYsIGRhdGEsIGVzY2FwZSkpO1xuXHQgICAgICB2YXIgY2xvc2VfYnV0dG9uID0gZ2V0RG9tKGh0bWwpO1xuXHQgICAgICBpdGVtLmFwcGVuZENoaWxkKGNsb3NlX2J1dHRvbik7XG5cdCAgICAgIGFkZEV2ZW50KGNsb3NlX2J1dHRvbiwgJ21vdXNlZG93bicsIGV2dCA9PiB7XG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgICAgfSk7XG5cdCAgICAgIGFkZEV2ZW50KGNsb3NlX2J1dHRvbiwgJ2NsaWNrJywgZXZ0ID0+IHtcblx0ICAgICAgICAvLyBwcm9wYWdhdGluZyB3aWxsIHRyaWdnZXIgdGhlIGRyb3Bkb3duIHRvIHNob3cgZm9yIHNpbmdsZSBtb2RlXG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgICAgICBpZiAoc2VsZi5pc0xvY2tlZCkgcmV0dXJuO1xuXHQgICAgICAgIGlmICghc2VsZi5zaG91bGREZWxldGUoW2l0ZW1dLCBldnQpKSByZXR1cm47XG5cdCAgICAgICAgc2VsZi5yZW1vdmVJdGVtKGl0ZW0pO1xuXHQgICAgICAgIHNlbGYucmVmcmVzaE9wdGlvbnMoZmFsc2UpO1xuXHQgICAgICAgIHNlbGYuaW5wdXRTdGF0ZSgpO1xuXHQgICAgICB9KTtcblx0ICAgICAgcmV0dXJuIGl0ZW07XG5cdCAgICB9O1xuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJyZXN0b3JlX29uX2JhY2tzcGFjZVwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIHJlc3RvcmVfb25fYmFja3NwYWNlICh1c2VyT3B0aW9ucykge1xuXHQgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcblx0ICAgIHRleHQ6IG9wdGlvbiA9PiB7XG5cdCAgICAgIHJldHVybiBvcHRpb25bc2VsZi5zZXR0aW5ncy5sYWJlbEZpZWxkXTtcblx0ICAgIH1cblx0ICB9LCB1c2VyT3B0aW9ucyk7XG5cdCAgc2VsZi5vbignaXRlbV9yZW1vdmUnLCBmdW5jdGlvbiAodmFsdWUpIHtcblx0ICAgIGlmICghc2VsZi5pc0ZvY3VzZWQpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoc2VsZi5jb250cm9sX2lucHV0LnZhbHVlLnRyaW0oKSA9PT0gJycpIHtcblx0ICAgICAgdmFyIG9wdGlvbiA9IHNlbGYub3B0aW9uc1t2YWx1ZV07XG5cblx0ICAgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICAgIHNlbGYuc2V0VGV4dGJveFZhbHVlKG9wdGlvbnMudGV4dC5jYWxsKHNlbGYsIG9wdGlvbikpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcInJlc3RvcmVfb25fYmFja3NwYWNlXCIgKFRvbSBTZWxlY3QpXG5cdCAqIENvcHlyaWdodCAoYykgY29udHJpYnV0b3JzXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG5cdCAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuXHQgKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblx0ICpcblx0ICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuXHQgKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG5cdCAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuXHQgKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gdmlydHVhbF9zY3JvbGwgKCkge1xuXHQgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgIGNvbnN0IG9yaWdfY2FuTG9hZCA9IHNlbGYuY2FuTG9hZDtcblx0ICBjb25zdCBvcmlnX2NsZWFyQWN0aXZlT3B0aW9uID0gc2VsZi5jbGVhckFjdGl2ZU9wdGlvbjtcblx0ICBjb25zdCBvcmlnX2xvYWRDYWxsYmFjayA9IHNlbGYubG9hZENhbGxiYWNrO1xuXHQgIHZhciBwYWdpbmF0aW9uID0ge307XG5cdCAgdmFyIGRyb3Bkb3duX2NvbnRlbnQ7XG5cdCAgdmFyIGxvYWRpbmdfbW9yZSA9IGZhbHNlO1xuXHQgIHZhciBsb2FkX21vcmVfb3B0O1xuXHQgIHZhciBkZWZhdWx0X3ZhbHVlcyA9IFtdO1xuXG5cdCAgaWYgKCFzZWxmLnNldHRpbmdzLnNob3VsZExvYWRNb3JlKSB7XG5cdCAgICAvLyByZXR1cm4gdHJ1ZSBpZiBhZGRpdGlvbmFsIHJlc3VsdHMgc2hvdWxkIGJlIGxvYWRlZFxuXHQgICAgc2VsZi5zZXR0aW5ncy5zaG91bGRMb2FkTW9yZSA9ICgpID0+IHtcblx0ICAgICAgY29uc3Qgc2Nyb2xsX3BlcmNlbnQgPSBkcm9wZG93bl9jb250ZW50LmNsaWVudEhlaWdodCAvIChkcm9wZG93bl9jb250ZW50LnNjcm9sbEhlaWdodCAtIGRyb3Bkb3duX2NvbnRlbnQuc2Nyb2xsVG9wKTtcblxuXHQgICAgICBpZiAoc2Nyb2xsX3BlcmNlbnQgPiAwLjkpIHtcblx0ICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChzZWxmLmFjdGl2ZU9wdGlvbikge1xuXHQgICAgICAgIHZhciBzZWxlY3RhYmxlID0gc2VsZi5zZWxlY3RhYmxlKCk7XG5cdCAgICAgICAgdmFyIGluZGV4ID0gQXJyYXkuZnJvbShzZWxlY3RhYmxlKS5pbmRleE9mKHNlbGYuYWN0aXZlT3B0aW9uKTtcblxuXHQgICAgICAgIGlmIChpbmRleCA+PSBzZWxlY3RhYmxlLmxlbmd0aCAtIDIpIHtcblx0ICAgICAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH07XG5cdCAgfVxuXG5cdCAgaWYgKCFzZWxmLnNldHRpbmdzLmZpcnN0VXJsKSB7XG5cdCAgICB0aHJvdyAndmlydHVhbF9zY3JvbGwgcGx1Z2luIHJlcXVpcmVzIGEgZmlyc3RVcmwoKSBtZXRob2QnO1xuXHQgIH0gLy8gaW4gb3JkZXIgZm9yIHZpcnR1YWwgc2Nyb2xsaW5nIHRvIHdvcmssXG5cdCAgLy8gb3B0aW9ucyBuZWVkIHRvIGJlIG9yZGVyZWQgdGhlIHNhbWUgd2F5IHRoZXkncmUgcmV0dXJuZWQgZnJvbSB0aGUgcmVtb3RlIGRhdGEgc291cmNlXG5cblxuXHQgIHNlbGYuc2V0dGluZ3Muc29ydEZpZWxkID0gW3tcblx0ICAgIGZpZWxkOiAnJG9yZGVyJ1xuXHQgIH0sIHtcblx0ICAgIGZpZWxkOiAnJHNjb3JlJ1xuXHQgIH1dOyAvLyBjYW4gd2UgbG9hZCBtb3JlIHJlc3VsdHMgZm9yIGdpdmVuIHF1ZXJ5P1xuXG5cdCAgY29uc3QgY2FuTG9hZE1vcmUgPSBxdWVyeSA9PiB7XG5cdCAgICBpZiAodHlwZW9mIHNlbGYuc2V0dGluZ3MubWF4T3B0aW9ucyA9PT0gJ251bWJlcicgJiYgZHJvcGRvd25fY29udGVudC5jaGlsZHJlbi5sZW5ndGggPj0gc2VsZi5zZXR0aW5ncy5tYXhPcHRpb25zKSB7XG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHF1ZXJ5IGluIHBhZ2luYXRpb24gJiYgcGFnaW5hdGlvbltxdWVyeV0pIHtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9O1xuXG5cdCAgY29uc3QgY2xlYXJGaWx0ZXIgPSAob3B0aW9uLCB2YWx1ZSkgPT4ge1xuXHQgICAgaWYgKHNlbGYuaXRlbXMuaW5kZXhPZih2YWx1ZSkgPj0gMCB8fCBkZWZhdWx0X3ZhbHVlcy5pbmRleE9mKHZhbHVlKSA+PSAwKSB7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfTsgLy8gc2V0IHRoZSBuZXh0IHVybCB0aGF0IHdpbGwgYmVcblxuXG5cdCAgc2VsZi5zZXROZXh0VXJsID0gKHZhbHVlLCBuZXh0X3VybCkgPT4ge1xuXHQgICAgcGFnaW5hdGlvblt2YWx1ZV0gPSBuZXh0X3VybDtcblx0ICB9OyAvLyBnZXRVcmwoKSB0byBiZSB1c2VkIGluIHNldHRpbmdzLmxvYWQoKVxuXG5cblx0ICBzZWxmLmdldFVybCA9IHF1ZXJ5ID0+IHtcblx0ICAgIGlmIChxdWVyeSBpbiBwYWdpbmF0aW9uKSB7XG5cdCAgICAgIGNvbnN0IG5leHRfdXJsID0gcGFnaW5hdGlvbltxdWVyeV07XG5cdCAgICAgIHBhZ2luYXRpb25bcXVlcnldID0gZmFsc2U7XG5cdCAgICAgIHJldHVybiBuZXh0X3VybDtcblx0ICAgIH0gLy8gaWYgdGhlIHVzZXIgZ29lcyBiYWNrIHRvIGEgcHJldmlvdXMgcXVlcnlcblx0ICAgIC8vIHdlIG5lZWQgdG8gbG9hZCB0aGUgZmlyc3QgcGFnZSBhZ2FpblxuXG5cblx0ICAgIHBhZ2luYXRpb24gPSB7fTtcblx0ICAgIHJldHVybiBzZWxmLnNldHRpbmdzLmZpcnN0VXJsLmNhbGwoc2VsZiwgcXVlcnkpO1xuXHQgIH07IC8vIGRvbid0IGNsZWFyIHRoZSBhY3RpdmUgb3B0aW9uIChhbmQgY2F1c2UgdW53YW50ZWQgZHJvcGRvd24gc2Nyb2xsKVxuXHQgIC8vIHdoaWxlIGxvYWRpbmcgbW9yZSByZXN1bHRzXG5cblxuXHQgIHNlbGYuaG9vaygnaW5zdGVhZCcsICdjbGVhckFjdGl2ZU9wdGlvbicsICgpID0+IHtcblx0ICAgIGlmIChsb2FkaW5nX21vcmUpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gb3JpZ19jbGVhckFjdGl2ZU9wdGlvbi5jYWxsKHNlbGYpO1xuXHQgIH0pOyAvLyBvdmVycmlkZSB0aGUgY2FuTG9hZCBtZXRob2RcblxuXHQgIHNlbGYuaG9vaygnaW5zdGVhZCcsICdjYW5Mb2FkJywgcXVlcnkgPT4ge1xuXHQgICAgLy8gZmlyc3QgdGltZSB0aGUgcXVlcnkgaGFzIGJlZW4gc2VlblxuXHQgICAgaWYgKCEocXVlcnkgaW4gcGFnaW5hdGlvbikpIHtcblx0ICAgICAgcmV0dXJuIG9yaWdfY2FuTG9hZC5jYWxsKHNlbGYsIHF1ZXJ5KTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGNhbkxvYWRNb3JlKHF1ZXJ5KTtcblx0ICB9KTsgLy8gd3JhcCB0aGUgbG9hZFxuXG5cdCAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ2xvYWRDYWxsYmFjaycsIChvcHRpb25zLCBvcHRncm91cHMpID0+IHtcblx0ICAgIGlmICghbG9hZGluZ19tb3JlKSB7XG5cdCAgICAgIHNlbGYuY2xlYXJPcHRpb25zKGNsZWFyRmlsdGVyKTtcblx0ICAgIH0gZWxzZSBpZiAobG9hZF9tb3JlX29wdCkge1xuXHQgICAgICBjb25zdCBmaXJzdF9vcHRpb24gPSBvcHRpb25zWzBdO1xuXG5cdCAgICAgIGlmIChmaXJzdF9vcHRpb24gIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIGxvYWRfbW9yZV9vcHQuZGF0YXNldC52YWx1ZSA9IGZpcnN0X29wdGlvbltzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIG9yaWdfbG9hZENhbGxiYWNrLmNhbGwoc2VsZiwgb3B0aW9ucywgb3B0Z3JvdXBzKTtcblx0ICAgIGxvYWRpbmdfbW9yZSA9IGZhbHNlO1xuXHQgIH0pOyAvLyBhZGQgdGVtcGxhdGVzIHRvIGRyb3Bkb3duXG5cdCAgLy9cdGxvYWRpbmdfbW9yZSBpZiB3ZSBoYXZlIGFub3RoZXIgdXJsIGluIHRoZSBxdWV1ZVxuXHQgIC8vXHRub19tb3JlX3Jlc3VsdHMgaWYgd2UgZG9uJ3QgaGF2ZSBhbm90aGVyIHVybCBpbiB0aGUgcXVldWVcblxuXHQgIHNlbGYuaG9vaygnYWZ0ZXInLCAncmVmcmVzaE9wdGlvbnMnLCAoKSA9PiB7XG5cdCAgICBjb25zdCBxdWVyeSA9IHNlbGYubGFzdFZhbHVlO1xuXHQgICAgdmFyIG9wdGlvbjtcblxuXHQgICAgaWYgKGNhbkxvYWRNb3JlKHF1ZXJ5KSkge1xuXHQgICAgICBvcHRpb24gPSBzZWxmLnJlbmRlcignbG9hZGluZ19tb3JlJywge1xuXHQgICAgICAgIHF1ZXJ5OiBxdWVyeVxuXHQgICAgICB9KTtcblxuXHQgICAgICBpZiAob3B0aW9uKSB7XG5cdCAgICAgICAgb3B0aW9uLnNldEF0dHJpYnV0ZSgnZGF0YS1zZWxlY3RhYmxlJywgJycpOyAvLyBzbyB0aGF0IG5hdmlnYXRpbmcgZHJvcGRvd24gd2l0aCBbZG93bl0ga2V5cHJlc3NlcyBjYW4gbmF2aWdhdGUgdG8gdGhpcyBub2RlXG5cblx0ICAgICAgICBsb2FkX21vcmVfb3B0ID0gb3B0aW9uO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2UgaWYgKHF1ZXJ5IGluIHBhZ2luYXRpb24gJiYgIWRyb3Bkb3duX2NvbnRlbnQucXVlcnlTZWxlY3RvcignLm5vLXJlc3VsdHMnKSkge1xuXHQgICAgICBvcHRpb24gPSBzZWxmLnJlbmRlcignbm9fbW9yZV9yZXN1bHRzJywge1xuXHQgICAgICAgIHF1ZXJ5OiBxdWVyeVxuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICBhZGRDbGFzc2VzKG9wdGlvbiwgc2VsZi5zZXR0aW5ncy5vcHRpb25DbGFzcyk7XG5cdCAgICAgIGRyb3Bkb3duX2NvbnRlbnQuYXBwZW5kKG9wdGlvbik7XG5cdCAgICB9XG5cdCAgfSk7IC8vIGFkZCBzY3JvbGwgbGlzdGVuZXIgYW5kIGRlZmF1bHQgdGVtcGxhdGVzXG5cblx0ICBzZWxmLm9uKCdpbml0aWFsaXplJywgKCkgPT4ge1xuXHQgICAgZGVmYXVsdF92YWx1ZXMgPSBPYmplY3Qua2V5cyhzZWxmLm9wdGlvbnMpO1xuXHQgICAgZHJvcGRvd25fY29udGVudCA9IHNlbGYuZHJvcGRvd25fY29udGVudDsgLy8gZGVmYXVsdCB0ZW1wbGF0ZXNcblxuXHQgICAgc2VsZi5zZXR0aW5ncy5yZW5kZXIgPSBPYmplY3QuYXNzaWduKHt9LCB7XG5cdCAgICAgIGxvYWRpbmdfbW9yZTogKCkgPT4ge1xuXHQgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImxvYWRpbmctbW9yZS1yZXN1bHRzXCI+TG9hZGluZyBtb3JlIHJlc3VsdHMgLi4uIDwvZGl2PmA7XG5cdCAgICAgIH0sXG5cdCAgICAgIG5vX21vcmVfcmVzdWx0czogKCkgPT4ge1xuXHQgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIm5vLW1vcmUtcmVzdWx0c1wiPk5vIG1vcmUgcmVzdWx0czwvZGl2PmA7XG5cdCAgICAgIH1cblx0ICAgIH0sIHNlbGYuc2V0dGluZ3MucmVuZGVyKTsgLy8gd2F0Y2ggZHJvcGRvd24gY29udGVudCBzY3JvbGwgcG9zaXRpb25cblxuXHQgICAgZHJvcGRvd25fY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG5cdCAgICAgIGlmICghc2VsZi5zZXR0aW5ncy5zaG91bGRMb2FkTW9yZS5jYWxsKHNlbGYpKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9IC8vICFpbXBvcnRhbnQ6IHRoaXMgd2lsbCBnZXQgY2hlY2tlZCBhZ2FpbiBpbiBsb2FkKCkgYnV0IHdlIHN0aWxsIG5lZWQgdG8gY2hlY2sgaGVyZSBvdGhlcndpc2UgbG9hZGluZ19tb3JlIHdpbGwgYmUgc2V0IHRvIHRydWVcblxuXG5cdCAgICAgIGlmICghY2FuTG9hZE1vcmUoc2VsZi5sYXN0VmFsdWUpKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9IC8vIGRvbid0IGNhbGwgbG9hZCgpIHRvbyBtdWNoXG5cblxuXHQgICAgICBpZiAobG9hZGluZ19tb3JlKSByZXR1cm47XG5cdCAgICAgIGxvYWRpbmdfbW9yZSA9IHRydWU7XG5cdCAgICAgIHNlbGYubG9hZC5jYWxsKHNlbGYsIHNlbGYubGFzdFZhbHVlKTtcblx0ICAgIH0pO1xuXHQgIH0pO1xuXHR9XG5cblx0VG9tU2VsZWN0LmRlZmluZSgnY2hhbmdlX2xpc3RlbmVyJywgY2hhbmdlX2xpc3RlbmVyKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnY2hlY2tib3hfb3B0aW9ucycsIGNoZWNrYm94X29wdGlvbnMpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdjbGVhcl9idXR0b24nLCBjbGVhcl9idXR0b24pO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdkcmFnX2Ryb3AnLCBkcmFnX2Ryb3ApO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdkcm9wZG93bl9oZWFkZXInLCBkcm9wZG93bl9oZWFkZXIpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdjYXJldF9wb3NpdGlvbicsIGNhcmV0X3Bvc2l0aW9uKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnZHJvcGRvd25faW5wdXQnLCBkcm9wZG93bl9pbnB1dCk7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ2lucHV0X2F1dG9ncm93JywgaW5wdXRfYXV0b2dyb3cpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdub19iYWNrc3BhY2VfZGVsZXRlJywgbm9fYmFja3NwYWNlX2RlbGV0ZSk7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ25vX2FjdGl2ZV9pdGVtcycsIG5vX2FjdGl2ZV9pdGVtcyk7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ29wdGdyb3VwX2NvbHVtbnMnLCBvcHRncm91cF9jb2x1bW5zKTtcblx0VG9tU2VsZWN0LmRlZmluZSgncmVtb3ZlX2J1dHRvbicsIHJlbW92ZV9idXR0b24pO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdyZXN0b3JlX29uX2JhY2tzcGFjZScsIHJlc3RvcmVfb25fYmFja3NwYWNlKTtcblx0VG9tU2VsZWN0LmRlZmluZSgndmlydHVhbF9zY3JvbGwnLCB2aXJ0dWFsX3Njcm9sbCk7XG5cblx0cmV0dXJuIFRvbVNlbGVjdDtcblxufSkpO1xudmFyIHRvbVNlbGVjdD1mdW5jdGlvbihlbCxvcHRzKXtyZXR1cm4gbmV3IFRvbVNlbGVjdChlbCxvcHRzKTt9IFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dG9tLXNlbGVjdC5jb21wbGV0ZS5qcy5tYXBcbiIsImltcG9ydCBUb21TZWxlY3QgZnJvbSBcInRvbS1zZWxlY3RcIlxyXG5pbXBvcnQgeyBUb21JbnB1dCB9IGZyb20gXCJ0b20tc2VsZWN0L2Rpc3QvdHlwZXMvdHlwZXNcIjtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICAvLy50b20tc2VsZWN044GM44GC44KM44GwVG9tU2VsZWN06KaB57SgKOOCs+ODs+ODnOODnOODg+OCr+OCuSnjgavnva7jgY3mj5vjgYjjgotcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b20tc2VsZWN0JykuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgICBuZXcgVG9tU2VsZWN0KGVsIGFzIFRvbUlucHV0LCB7fSk7XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG5leHBvcnQgY2xhc3MgY29tbW9uIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucmVwbGFjZVRvbVNlbGVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogLnRvbS1zZWxlY3Tjga7opoHntKDjgpJUb21TZWxlY3TopoHntKAo44Kz44Oz44Oc44Oc44OD44Kv44K5KeOBq+e9ruOBjeaPm+OBiOOCi1xyXG4gICAgICogKi9cclxuICAgIHJlcGxhY2VUb21TZWxlY3QoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgLy8udG9tLXNlbGVjdOOBjOOBguOCjOOBsFRvbVNlbGVjdOimgee0oCjjgrPjg7Pjg5zjg5zjg4Pjgq/jgrkp44Gr572u44GN5o+b44GI44KLXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b20tc2VsZWN0JykuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgICAgICAgICAgIG5ldyBUb21TZWxlY3QoZWwgYXMgVG9tSW5wdXQsIHt9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbn07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNvbW1vbiB9IGZyb20gJy4uL2NvbW1vbi9kaXNwX2NvbW1vbic7XHJcblxyXG5uZXcgY29tbW9uKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9