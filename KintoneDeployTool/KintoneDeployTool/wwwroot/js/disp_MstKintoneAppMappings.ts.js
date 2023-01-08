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
/*!*******************************************************!*\
  !*** ./Scripts/entries/disp_MstKintoneAppMappings.ts ***!
  \*******************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_disp_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/disp_common */ "./Scripts/common/disp_common.ts");

new _common_disp_common__WEBPACK_IMPORTED_MODULE_0__.common();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBLFlBQVk7QUFDWjtBQUNBLFFBQVE7QUFDUixPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsUUFBUTtBQUNSOztBQUVBOztBQUVBLDhDQUE4Qzs7QUFFOUM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DOztBQUVuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7O0FBRS9CO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU07QUFDTjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEOztBQUV0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQSwrREFBK0Q7QUFDL0Qsc0RBQXNEO0FBQ3RELGdEQUFnRDtBQUNoRCxxREFBcUQ7QUFDckQsNERBQTREO0FBQzVELHFEQUFxRDtBQUNyRCxnREFBZ0Q7QUFDaEQsMkRBQTJEO0FBQzNELHFEQUFxRDtBQUNyRCxnREFBZ0Q7QUFDaEQsd0RBQXdEO0FBQ3hELGtEQUFrRDtBQUNsRCxnREFBZ0Q7QUFDaEQsd0RBQXdEO0FBQ3hELHdEQUF3RDtBQUN4RCxtREFBbUQ7QUFDbkQsc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlDQUF5QyxzQkFBc0Isc0JBQXNCLHdCQUF3QjtBQUM3RztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qjs7QUFFeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBLDJCQUEyQjs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0MsZUFBZTs7QUFFakQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBLDBCQUEwQjtBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsNkJBQTZCOztBQUU3QjtBQUNBLHdEQUF3RDs7QUFFeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7O0FBRXZDO0FBQ0E7QUFDQSxNQUFNLEdBQUc7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRCQUE0Qjs7QUFFNUI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUVBQXVFOztBQUV2RTtBQUNBLHNEQUFzRDs7QUFFdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsT0FBTzs7O0FBR1A7QUFDQTtBQUNBLE9BQU87QUFDUDs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNLEdBQUc7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7OztBQUdUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTSxHQUFHOztBQUVULDhEQUE4RDs7QUFFOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxnQ0FBZ0M7QUFDaEMsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1Asc0JBQXNCO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQSxpQ0FBaUM7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSwrQkFBK0I7O0FBRS9CO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsNEZBQTRGO0FBQzVGLFFBQVE7QUFDUjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxnREFBZ0Q7O0FBRWhELDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOzs7QUFHQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCLFdBQVc7QUFDWCw4QkFBOEI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0Esc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjs7QUFFL0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxvQ0FBb0M7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEOztBQUVsRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87OztBQUdQOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLFVBQVU7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7O0FBRTVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxPQUFPO0FBQ1AsZ0NBQWdD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Tzs7O0FBR1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBLHFCQUFxQixnQkFBZ0I7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdFQUF3RSxrQkFBa0I7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYOzs7QUFHQTtBQUNBO0FBQ0EsV0FBVzs7O0FBR1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7O0FBR0E7QUFDQTtBQUNBOztBQUVBLG1DQUFtQztBQUNuQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOzs7QUFHVDtBQUNBO0FBQ0EsUUFBUSxHQUFHOztBQUVYO0FBQ0EsNENBQTRDO0FBQzVDLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5RUFBeUUsa0JBQWtCO0FBQzNGO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRDs7QUFFbkQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsOEJBQThCOztBQUU5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsMkRBQTJEOztBQUUzRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDOztBQUUzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFdBQVc7O0FBRVgsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNENBQTRDO0FBQzVDLFNBQVM7O0FBRVQsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsU0FBUztBQUNUO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsUUFBUTs7QUFFUjtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsR0FBRzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLEdBQUc7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0EsSUFBSSxnQkFBZ0I7O0FBRXBCLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFL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L3RvbS1zZWxlY3QuY29tcGxldGUuanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL1NjcmlwdHMvY29tbW9uL2Rpc3BfY29tbW9uLnRzIiwid2VicGFjazovL2FzcC5uZXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYXNwLm5ldC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9hc3AubmV0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hc3AubmV0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXNwLm5ldC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2FzcC5uZXQvLi9TY3JpcHRzL2VudHJpZXMvZGlzcF9Nc3RLaW50b25lQXBwTWFwcGluZ3MudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qIFRvbSBTZWxlY3QgdjIuMi4yXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qL1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxUaGlzIDogZ2xvYmFsIHx8IHNlbGYsIGdsb2JhbC5Ub21TZWxlY3QgPSBmYWN0b3J5KCkpO1xufSkodGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiBNaWNyb0V2ZW50IC0gdG8gbWFrZSBhbnkganMgb2JqZWN0IGFuIGV2ZW50IGVtaXR0ZXJcblx0ICpcblx0ICogLSBwdXJlIGphdmFzY3JpcHQgLSBzZXJ2ZXIgY29tcGF0aWJsZSwgYnJvd3NlciBjb21wYXRpYmxlXG5cdCAqIC0gZG9udCByZWx5IG9uIHRoZSBicm93c2VyIGRvbXNcblx0ICogLSBzdXBlciBzaW1wbGUgLSB5b3UgZ2V0IGl0IGltbWVkaWF0bHksIG5vIG1pc3RlcnksIG5vIG1hZ2ljIGludm9sdmVkXG5cdCAqXG5cdCAqIEBhdXRob3IgSmVyb21lIEV0aWVubmUgKGh0dHBzOi8vZ2l0aHViLmNvbS9qZXJvbWVldGllbm5lKVxuXHQgKi9cblxuXHQvKipcblx0ICogRXhlY3V0ZSBjYWxsYmFjayBmb3IgZWFjaCBldmVudCBpbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBldmVudCBuYW1lc1xuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gZm9yRXZlbnRzKGV2ZW50cywgY2FsbGJhY2spIHtcblx0ICBldmVudHMuc3BsaXQoL1xccysvKS5mb3JFYWNoKGV2ZW50ID0+IHtcblx0ICAgIGNhbGxiYWNrKGV2ZW50KTtcblx0ICB9KTtcblx0fVxuXG5cdGNsYXNzIE1pY3JvRXZlbnQge1xuXHQgIGNvbnN0cnVjdG9yKCkge1xuXHQgICAgdGhpcy5fZXZlbnRzID0gdm9pZCAwO1xuXHQgICAgdGhpcy5fZXZlbnRzID0ge307XG5cdCAgfVxuXG5cdCAgb24oZXZlbnRzLCBmY3QpIHtcblx0ICAgIGZvckV2ZW50cyhldmVudHMsIGV2ZW50ID0+IHtcblx0ICAgICAgY29uc3QgZXZlbnRfYXJyYXkgPSB0aGlzLl9ldmVudHNbZXZlbnRdIHx8IFtdO1xuXHQgICAgICBldmVudF9hcnJheS5wdXNoKGZjdCk7XG5cdCAgICAgIHRoaXMuX2V2ZW50c1tldmVudF0gPSBldmVudF9hcnJheTtcblx0ICAgIH0pO1xuXHQgIH1cblxuXHQgIG9mZihldmVudHMsIGZjdCkge1xuXHQgICAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG5cdCAgICBpZiAobiA9PT0gMCkge1xuXHQgICAgICB0aGlzLl9ldmVudHMgPSB7fTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBmb3JFdmVudHMoZXZlbnRzLCBldmVudCA9PiB7XG5cdCAgICAgIGlmIChuID09PSAxKSB7XG5cdCAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudF07XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cblx0ICAgICAgY29uc3QgZXZlbnRfYXJyYXkgPSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuXHQgICAgICBpZiAoZXZlbnRfYXJyYXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXHQgICAgICBldmVudF9hcnJheS5zcGxpY2UoZXZlbnRfYXJyYXkuaW5kZXhPZihmY3QpLCAxKTtcblx0ICAgICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IGV2ZW50X2FycmF5O1xuXHQgICAgfSk7XG5cdCAgfVxuXG5cdCAgdHJpZ2dlcihldmVudHMsIC4uLmFyZ3MpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIGZvckV2ZW50cyhldmVudHMsIGV2ZW50ID0+IHtcblx0ICAgICAgY29uc3QgZXZlbnRfYXJyYXkgPSBzZWxmLl9ldmVudHNbZXZlbnRdO1xuXHQgICAgICBpZiAoZXZlbnRfYXJyYXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXHQgICAgICBldmVudF9hcnJheS5mb3JFYWNoKGZjdCA9PiB7XG5cdCAgICAgICAgZmN0LmFwcGx5KHNlbGYsIGFyZ3MpO1xuXHQgICAgICB9KTtcblx0ICAgIH0pO1xuXHQgIH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIG1pY3JvcGx1Z2luLmpzXG5cdCAqIENvcHlyaWdodCAoYykgMjAxMyBCcmlhbiBSZWF2aXMgJiBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqIEBhdXRob3IgQnJpYW4gUmVhdmlzIDxicmlhbkB0aGlyZHJvdXRlLmNvbT5cblx0ICovXG5cdGZ1bmN0aW9uIE1pY3JvUGx1Z2luKEludGVyZmFjZSkge1xuXHQgIEludGVyZmFjZS5wbHVnaW5zID0ge307XG5cdCAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgSW50ZXJmYWNlIHtcblx0ICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcblx0ICAgICAgc3VwZXIoLi4uYXJncyk7XG5cdCAgICAgIHRoaXMucGx1Z2lucyA9IHtcblx0ICAgICAgICBuYW1lczogW10sXG5cdCAgICAgICAgc2V0dGluZ3M6IHt9LFxuXHQgICAgICAgIHJlcXVlc3RlZDoge30sXG5cdCAgICAgICAgbG9hZGVkOiB7fVxuXHQgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIFJlZ2lzdGVycyBhIHBsdWdpbi5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxuXHQgICAgICovXG5cdCAgICBzdGF0aWMgZGVmaW5lKG5hbWUsIGZuKSB7XG5cdCAgICAgIEludGVyZmFjZS5wbHVnaW5zW25hbWVdID0ge1xuXHQgICAgICAgICduYW1lJzogbmFtZSxcblx0ICAgICAgICAnZm4nOiBmblxuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBJbml0aWFsaXplcyB0aGUgbGlzdGVkIHBsdWdpbnMgKHdpdGggb3B0aW9ucykuXG5cdCAgICAgKiBBY2NlcHRhYmxlIGZvcm1hdHM6XG5cdCAgICAgKlxuXHQgICAgICogTGlzdCAod2l0aG91dCBvcHRpb25zKTpcblx0ICAgICAqICAgWydhJywgJ2InLCAnYyddXG5cdCAgICAgKlxuXHQgICAgICogTGlzdCAod2l0aCBvcHRpb25zKTpcblx0ICAgICAqICAgW3snbmFtZSc6ICdhJywgb3B0aW9uczoge319LCB7J25hbWUnOiAnYicsIG9wdGlvbnM6IHt9fV1cblx0ICAgICAqXG5cdCAgICAgKiBIYXNoICh3aXRoIG9wdGlvbnMpOlxuXHQgICAgICogICB7J2EnOiB7IC4uLiB9LCAnYic6IHsgLi4uIH0sICdjJzogeyAuLi4gfX1cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0ge2FycmF5fG9iamVjdH0gcGx1Z2luc1xuXHQgICAgICovXG5cblxuXHQgICAgaW5pdGlhbGl6ZVBsdWdpbnMocGx1Z2lucykge1xuXHQgICAgICB2YXIga2V5LCBuYW1lO1xuXHQgICAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgICAgY29uc3QgcXVldWUgPSBbXTtcblxuXHQgICAgICBpZiAoQXJyYXkuaXNBcnJheShwbHVnaW5zKSkge1xuXHQgICAgICAgIHBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuXHQgICAgICAgICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgICAgICAgIHF1ZXVlLnB1c2gocGx1Z2luKTtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHNlbGYucGx1Z2lucy5zZXR0aW5nc1twbHVnaW4ubmFtZV0gPSBwbHVnaW4ub3B0aW9ucztcblx0ICAgICAgICAgICAgcXVldWUucHVzaChwbHVnaW4ubmFtZSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0gZWxzZSBpZiAocGx1Z2lucykge1xuXHQgICAgICAgIGZvciAoa2V5IGluIHBsdWdpbnMpIHtcblx0ICAgICAgICAgIGlmIChwbHVnaW5zLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0ICAgICAgICAgICAgc2VsZi5wbHVnaW5zLnNldHRpbmdzW2tleV0gPSBwbHVnaW5zW2tleV07XG5cdCAgICAgICAgICAgIHF1ZXVlLnB1c2goa2V5KTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICB3aGlsZSAobmFtZSA9IHF1ZXVlLnNoaWZ0KCkpIHtcblx0ICAgICAgICBzZWxmLnJlcXVpcmUobmFtZSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgbG9hZFBsdWdpbihuYW1lKSB7XG5cdCAgICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgICAgdmFyIHBsdWdpbnMgPSBzZWxmLnBsdWdpbnM7XG5cdCAgICAgIHZhciBwbHVnaW4gPSBJbnRlcmZhY2UucGx1Z2luc1tuYW1lXTtcblxuXHQgICAgICBpZiAoIUludGVyZmFjZS5wbHVnaW5zLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBcIicgKyBuYW1lICsgJ1wiIHBsdWdpbicpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcGx1Z2lucy5yZXF1ZXN0ZWRbbmFtZV0gPSB0cnVlO1xuXHQgICAgICBwbHVnaW5zLmxvYWRlZFtuYW1lXSA9IHBsdWdpbi5mbi5hcHBseShzZWxmLCBbc2VsZi5wbHVnaW5zLnNldHRpbmdzW25hbWVdIHx8IHt9XSk7XG5cdCAgICAgIHBsdWdpbnMubmFtZXMucHVzaChuYW1lKTtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogSW5pdGlhbGl6ZXMgYSBwbHVnaW4uXG5cdCAgICAgKlxuXHQgICAgICovXG5cblxuXHQgICAgcmVxdWlyZShuYW1lKSB7XG5cdCAgICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgICAgdmFyIHBsdWdpbnMgPSBzZWxmLnBsdWdpbnM7XG5cblx0ICAgICAgaWYgKCFzZWxmLnBsdWdpbnMubG9hZGVkLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG5cdCAgICAgICAgaWYgKHBsdWdpbnMucmVxdWVzdGVkW25hbWVdKSB7XG5cdCAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsdWdpbiBoYXMgY2lyY3VsYXIgZGVwZW5kZW5jeSAoXCInICsgbmFtZSArICdcIiknKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZWxmLmxvYWRQbHVnaW4obmFtZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gcGx1Z2lucy5sb2FkZWRbbmFtZV07XG5cdCAgICB9XG5cblx0ICB9O1xuXHR9XG5cblx0LyohIEBvcmNoaWRqcy91bmljb2RlLXZhcmlhbnRzIHwgaHR0cHM6Ly9naXRodWIuY29tL29yY2hpZGpzL3VuaWNvZGUtdmFyaWFudHMgfCBBcGFjaGUgTGljZW5zZSAodjIpICovXG5cdC8qKlxuXHQgKiBDb252ZXJ0IGFycmF5IG9mIHN0cmluZ3MgdG8gYSByZWd1bGFyIGV4cHJlc3Npb25cblx0ICpcdGV4IFsnYWInLCdhJ10gPT4gKD86YWJ8YSlcblx0ICogXHRleCBbJ2EnLCdiJ10gPT4gW2FiXVxuXHQgKiBAcGFyYW0ge3N0cmluZ1tdfSBjaGFyc1xuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXHRjb25zdCBhcnJheVRvUGF0dGVybiA9IGNoYXJzID0+IHtcblx0ICBjaGFycyA9IGNoYXJzLmZpbHRlcihCb29sZWFuKTtcblxuXHQgIGlmIChjaGFycy5sZW5ndGggPCAyKSB7XG5cdCAgICByZXR1cm4gY2hhcnNbMF0gfHwgJyc7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIG1heFZhbHVlTGVuZ3RoKGNoYXJzKSA9PSAxID8gJ1snICsgY2hhcnMuam9pbignJykgKyAnXScgOiAnKD86JyArIGNoYXJzLmpvaW4oJ3wnKSArICcpJztcblx0fTtcblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5XG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cblx0Y29uc3Qgc2VxdWVuY2VQYXR0ZXJuID0gYXJyYXkgPT4ge1xuXHQgIGlmICghaGFzRHVwbGljYXRlcyhhcnJheSkpIHtcblx0ICAgIHJldHVybiBhcnJheS5qb2luKCcnKTtcblx0ICB9XG5cblx0ICBsZXQgcGF0dGVybiA9ICcnO1xuXHQgIGxldCBwcmV2X2NoYXJfY291bnQgPSAwO1xuXG5cdCAgY29uc3QgcHJldl9wYXR0ZXJuID0gKCkgPT4ge1xuXHQgICAgaWYgKHByZXZfY2hhcl9jb3VudCA+IDEpIHtcblx0ICAgICAgcGF0dGVybiArPSAneycgKyBwcmV2X2NoYXJfY291bnQgKyAnfSc7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIGFycmF5LmZvckVhY2goKGNoYXIsIGkpID0+IHtcblx0ICAgIGlmIChjaGFyID09PSBhcnJheVtpIC0gMV0pIHtcblx0ICAgICAgcHJldl9jaGFyX2NvdW50Kys7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgcHJldl9wYXR0ZXJuKCk7XG5cdCAgICBwYXR0ZXJuICs9IGNoYXI7XG5cdCAgICBwcmV2X2NoYXJfY291bnQgPSAxO1xuXHQgIH0pO1xuXHQgIHByZXZfcGF0dGVybigpO1xuXHQgIHJldHVybiBwYXR0ZXJuO1xuXHR9O1xuXHQvKipcblx0ICogQ29udmVydCBhcnJheSBvZiBzdHJpbmdzIHRvIGEgcmVndWxhciBleHByZXNzaW9uXG5cdCAqXHRleCBbJ2FiJywnYSddID0+ICg/OmFifGEpXG5cdCAqIFx0ZXggWydhJywnYiddID0+IFthYl1cblx0ICogQHBhcmFtIHtTZXQ8c3RyaW5nPn0gY2hhcnNcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblxuXHRjb25zdCBzZXRUb1BhdHRlcm4gPSBjaGFycyA9PiB7XG5cdCAgbGV0IGFycmF5ID0gdG9BcnJheShjaGFycyk7XG5cdCAgcmV0dXJuIGFycmF5VG9QYXR0ZXJuKGFycmF5KTtcblx0fTtcblx0LyoqXG5cdCAqXG5cdCAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzczNzY1OTgvaW4tamF2YXNjcmlwdC1ob3ctZG8taS1jaGVjay1pZi1hbi1hcnJheS1oYXMtZHVwbGljYXRlLXZhbHVlc1xuXHQgKiBAcGFyYW0ge2FueVtdfSBhcnJheVxuXHQgKi9cblxuXHRjb25zdCBoYXNEdXBsaWNhdGVzID0gYXJyYXkgPT4ge1xuXHQgIHJldHVybiBuZXcgU2V0KGFycmF5KS5zaXplICE9PSBhcnJheS5sZW5ndGg7XG5cdH07XG5cdC8qKlxuXHQgKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82MzAwNjYwMS93aHktZG9lcy11LXRocm93LWFuLWludmFsaWQtZXNjYXBlLWVycm9yXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblxuXHRjb25zdCBlc2NhcGVfcmVnZXggPSBzdHIgPT4ge1xuXHQgIHJldHVybiAoc3RyICsgJycpLnJlcGxhY2UoLyhbXFwkXFwoXFwpXFwqXFwrXFwuXFw/XFxbXFxdXFxeXFx7XFx8XFx9XFxcXF0pL2d1LCAnXFxcXCQxJyk7XG5cdH07XG5cdC8qKlxuXHQgKiBSZXR1cm4gdGhlIG1heCBsZW5ndGggb2YgYXJyYXkgdmFsdWVzXG5cdCAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5XG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IG1heFZhbHVlTGVuZ3RoID0gYXJyYXkgPT4ge1xuXHQgIHJldHVybiBhcnJheS5yZWR1Y2UoKGxvbmdlc3QsIHZhbHVlKSA9PiBNYXRoLm1heChsb25nZXN0LCB1bmljb2RlTGVuZ3RoKHZhbHVlKSksIDApO1xuXHR9O1xuXHQvKipcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKi9cblxuXHRjb25zdCB1bmljb2RlTGVuZ3RoID0gc3RyID0+IHtcblx0ICByZXR1cm4gdG9BcnJheShzdHIpLmxlbmd0aDtcblx0fTtcblx0LyoqXG5cdCAqIEBwYXJhbSB7YW55fSBwXG5cdCAqIEByZXR1cm4ge2FueVtdfVxuXHQgKi9cblxuXHRjb25zdCB0b0FycmF5ID0gcCA9PiBBcnJheS5mcm9tKHApO1xuXG5cdC8qISBAb3JjaGlkanMvdW5pY29kZS12YXJpYW50cyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9vcmNoaWRqcy91bmljb2RlLXZhcmlhbnRzIHwgQXBhY2hlIExpY2Vuc2UgKHYyKSAqL1xuXHQvKipcblx0ICogR2V0IGFsbCBwb3NzaWJsZSBjb21iaW5hdGlvbnMgb2Ygc3Vic3RyaW5ncyB0aGF0IGFkZCB1cCB0byB0aGUgZ2l2ZW4gc3RyaW5nXG5cdCAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMwMTY5NTg3L2ZpbmQtYWxsLXRoZS1jb21iaW5hdGlvbi1vZi1zdWJzdHJpbmdzLXRoYXQtYWRkLXVwLXRvLXRoZS1naXZlbi1zdHJpbmdcblx0ICogQHBhcmFtIHtzdHJpbmd9IGlucHV0XG5cdCAqIEByZXR1cm4ge3N0cmluZ1tdW119XG5cdCAqL1xuXHRjb25zdCBhbGxTdWJzdHJpbmdzID0gaW5wdXQgPT4ge1xuXHQgIGlmIChpbnB1dC5sZW5ndGggPT09IDEpIHJldHVybiBbW2lucHV0XV07XG5cdCAgLyoqIEB0eXBlIHtzdHJpbmdbXVtdfSAqL1xuXG5cdCAgbGV0IHJlc3VsdCA9IFtdO1xuXHQgIGNvbnN0IHN0YXJ0ID0gaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHQgIGNvbnN0IHN1YmEgPSBhbGxTdWJzdHJpbmdzKHN0YXJ0KTtcblx0ICBzdWJhLmZvckVhY2goZnVuY3Rpb24gKHN1YnJlc3VsdCkge1xuXHQgICAgbGV0IHRtcCA9IHN1YnJlc3VsdC5zbGljZSgwKTtcblx0ICAgIHRtcFswXSA9IGlucHV0LmNoYXJBdCgwKSArIHRtcFswXTtcblx0ICAgIHJlc3VsdC5wdXNoKHRtcCk7XG5cdCAgICB0bXAgPSBzdWJyZXN1bHQuc2xpY2UoMCk7XG5cdCAgICB0bXAudW5zaGlmdChpbnB1dC5jaGFyQXQoMCkpO1xuXHQgICAgcmVzdWx0LnB1c2godG1wKTtcblx0ICB9KTtcblx0ICByZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdC8qISBAb3JjaGlkanMvdW5pY29kZS12YXJpYW50cyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9vcmNoaWRqcy91bmljb2RlLXZhcmlhbnRzIHwgQXBhY2hlIExpY2Vuc2UgKHYyKSAqL1xuXG5cdC8qKlxuXHQgKiBAdHlwZWRlZiB7e1trZXk6c3RyaW5nXTpzdHJpbmd9fSBUVW5pY29kZU1hcFxuXHQgKiBAdHlwZWRlZiB7e1trZXk6c3RyaW5nXTpTZXQ8c3RyaW5nPn19IFRVbmljb2RlU2V0c1xuXHQgKiBAdHlwZWRlZiB7W1tudW1iZXIsbnVtYmVyXV19IFRDb2RlUG9pbnRzXG5cdCAqIEB0eXBlZGVmIHt7Zm9sZGVkOnN0cmluZyxjb21wb3NlZDpzdHJpbmcsY29kZV9wb2ludDpudW1iZXJ9fSBUQ29kZVBvaW50T2JqXG5cdCAqIEB0eXBlZGVmIHt7c3RhcnQ6bnVtYmVyLGVuZDpudW1iZXIsbGVuZ3RoOm51bWJlcixzdWJzdHI6c3RyaW5nfX0gVFNlcXVlbmNlUGFydFxuXHQgKi9cblx0LyoqIEB0eXBlIHtUQ29kZVBvaW50c30gKi9cblxuXHRjb25zdCBjb2RlX3BvaW50cyA9IFtbMCwgNjU1MzVdXTtcblx0Y29uc3QgYWNjZW50X3BhdCA9ICdbXFx1MDMwMC1cXHUwMzZGXFx1e2I3fVxcdXsyYmV9XFx1ezJiY31dJztcblx0LyoqIEB0eXBlIHtUVW5pY29kZU1hcH0gKi9cblxuXHRsZXQgdW5pY29kZV9tYXA7XG5cdC8qKiBAdHlwZSB7UmVnRXhwfSAqL1xuXG5cdGxldCBtdWx0aV9jaGFyX3JlZztcblx0Y29uc3QgbWF4X2NoYXJfbGVuZ3RoID0gMztcblx0LyoqIEB0eXBlIHtUVW5pY29kZU1hcH0gKi9cblxuXHRjb25zdCBsYXRpbl9jb252ZXJ0ID0ge307XG5cdC8qKiBAdHlwZSB7VFVuaWNvZGVNYXB9ICovXG5cblx0Y29uc3QgbGF0aW5fY29uZGVuc2VkID0ge1xuXHQgICcvJzogJ+KBhOKIlScsXG5cdCAgJzAnOiAn34AnLFxuXHQgIFwiYVwiOiBcIuKxpcmQyZFcIixcblx0ICBcImFhXCI6IFwi6pyzXCIsXG5cdCAgXCJhZVwiOiBcIsOmx73Ho1wiLFxuXHQgIFwiYW9cIjogXCLqnLVcIixcblx0ICBcImF1XCI6IFwi6py3XCIsXG5cdCAgXCJhdlwiOiBcIuqcueqcu1wiLFxuXHQgIFwiYXlcIjogXCLqnL1cIixcblx0ICBcImJcIjogXCLGgMmTxoNcIixcblx0ICBcImNcIjogXCLqnL/GiMi84oaEXCIsXG5cdCAgXCJkXCI6IFwixJHJl8mW4bSFxozqrrfUgcmmXCIsXG5cdCAgXCJlXCI6IFwiyZvHneG0h8mHXCIsXG5cdCAgXCJmXCI6IFwi6p28xpJcIixcblx0ICBcImdcIjogXCLHpcmg6p6h4bW56p2/yaJcIixcblx0ICBcImhcIjogXCLEp+KxqOKxtsmlXCIsXG5cdCAgXCJpXCI6IFwiyajEsVwiLFxuXHQgIFwialwiOiBcIsmJyLdcIixcblx0ICBcImtcIjogXCLGmeKxquqdgeqdg+qdheqeo1wiLFxuXHQgIFwibFwiOiBcIsWCxprJq+Kxoeqdieqdh+qegcmtXCIsXG5cdCAgXCJtXCI6IFwiybHJr8+7XCIsXG5cdCAgXCJuXCI6IFwi6p6lxp7JsuqekeG0jtC71IlcIixcblx0ICBcIm9cIjogXCLDuMe/yZTJteqdi+qdjeG0kVwiLFxuXHQgIFwib2VcIjogXCLFk1wiLFxuXHQgIFwib2lcIjogXCLGo1wiLFxuXHQgIFwib29cIjogXCLqnY9cIixcblx0ICBcIm91XCI6IFwiyKNcIixcblx0ICBcInBcIjogXCLGpeG1veqdkeqdk+qdlc+BXCIsXG5cdCAgXCJxXCI6IFwi6p2X6p2ZyYtcIixcblx0ICBcInJcIjogXCLJjcm96p2b6p6n6p6DXCIsXG5cdCAgXCJzXCI6IFwiw5/Iv+qeqeqehcqCXCIsXG5cdCAgXCJ0XCI6IFwixafGrcqI4rGm6p6HXCIsXG5cdCAgXCJ0aFwiOiBcIsO+XCIsXG5cdCAgXCJ0elwiOiBcIuqcqVwiLFxuXHQgIFwidVwiOiBcIsqJXCIsXG5cdCAgXCJ2XCI6IFwiyovqnZ/KjFwiLFxuXHQgIFwidnlcIjogXCLqnaFcIixcblx0ICBcIndcIjogXCLisbNcIixcblx0ICBcInlcIjogXCLGtMmP4bu/XCIsXG5cdCAgXCJ6XCI6IFwixrbIpcmA4rGs6p2jXCIsXG5cdCAgXCJodlwiOiBcIsaVXCJcblx0fTtcblxuXHRmb3IgKGxldCBsYXRpbiBpbiBsYXRpbl9jb25kZW5zZWQpIHtcblx0ICBsZXQgdW5pY29kZSA9IGxhdGluX2NvbmRlbnNlZFtsYXRpbl0gfHwgJyc7XG5cblx0ICBmb3IgKGxldCBpID0gMDsgaSA8IHVuaWNvZGUubGVuZ3RoOyBpKyspIHtcblx0ICAgIGxldCBjaGFyID0gdW5pY29kZS5zdWJzdHJpbmcoaSwgaSArIDEpO1xuXHQgICAgbGF0aW5fY29udmVydFtjaGFyXSA9IGxhdGluO1xuXHQgIH1cblx0fVxuXG5cdGNvbnN0IGNvbnZlcnRfcGF0ID0gbmV3IFJlZ0V4cChPYmplY3Qua2V5cyhsYXRpbl9jb252ZXJ0KS5qb2luKCd8JykgKyAnfCcgKyBhY2NlbnRfcGF0LCAnZ3UnKTtcblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdGhlIHVuaWNvZGVfbWFwIGZyb20gdGhlIGdpdmUgY29kZSBwb2ludCByYW5nZXNcblx0ICpcblx0ICogQHBhcmFtIHtUQ29kZVBvaW50cz19IF9jb2RlX3BvaW50c1xuXHQgKi9cblxuXHRjb25zdCBpbml0aWFsaXplID0gX2NvZGVfcG9pbnRzID0+IHtcblx0ICBpZiAodW5pY29kZV9tYXAgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXHQgIHVuaWNvZGVfbWFwID0gZ2VuZXJhdGVNYXAoX2NvZGVfcG9pbnRzIHx8IGNvZGVfcG9pbnRzKTtcblx0fTtcblx0LyoqXG5cdCAqIEhlbHBlciBtZXRob2QgZm9yIG5vcm1hbGl6ZSBhIHN0cmluZ1xuXHQgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvbm9ybWFsaXplXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHBhcmFtIHtzdHJpbmd9IGZvcm1cblx0ICovXG5cblx0Y29uc3Qgbm9ybWFsaXplID0gKHN0ciwgZm9ybSA9ICdORktEJykgPT4gc3RyLm5vcm1hbGl6ZShmb3JtKTtcblx0LyoqXG5cdCAqIFJlbW92ZSBhY2NlbnRzIHdpdGhvdXQgcmVvcmRlcmluZyBzdHJpbmdcblx0ICogY2FsbGluZyBzdHIubm9ybWFsaXplKCdORktEJykgb24gXFx1ezU5NH1cXHV7NTk1fVxcdXs1OTZ9IGJlY29tZXMgXFx1ezU5Nn1cXHV7NTk0fVxcdXs1OTV9XG5cdCAqIHZpYSBodHRwczovL2dpdGh1Yi5jb20va3Jpc2svRnVzZS9pc3N1ZXMvMTMzI2lzc3VlY29tbWVudC0zMTg2OTI3MDNcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXG5cdGNvbnN0IGFzY2lpZm9sZCA9IHN0ciA9PiB7XG5cdCAgcmV0dXJuIHRvQXJyYXkoc3RyKS5yZWR1Y2UoXG5cdCAgLyoqXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3VsdFxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyXG5cdCAgICovXG5cdCAgKHJlc3VsdCwgY2hhcikgPT4ge1xuXHQgICAgcmV0dXJuIHJlc3VsdCArIF9hc2NpaWZvbGQoY2hhcik7XG5cdCAgfSwgJycpO1xuXHR9O1xuXHQvKipcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXG5cdGNvbnN0IF9hc2NpaWZvbGQgPSBzdHIgPT4ge1xuXHQgIHN0ciA9IG5vcm1hbGl6ZShzdHIpLnRvTG93ZXJDYXNlKCkucmVwbGFjZShjb252ZXJ0X3BhdCwgKFxuXHQgIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xuXHQgIGNoYXIpID0+IHtcblx0ICAgIHJldHVybiBsYXRpbl9jb252ZXJ0W2NoYXJdIHx8ICcnO1xuXHQgIH0pOyAvL3JldHVybiBzdHI7XG5cblx0ICByZXR1cm4gbm9ybWFsaXplKHN0ciwgJ05GQycpO1xuXHR9O1xuXHQvKipcblx0ICogR2VuZXJhdGUgYSBsaXN0IG9mIHVuaWNvZGUgdmFyaWFudHMgZnJvbSB0aGUgbGlzdCBvZiBjb2RlIHBvaW50c1xuXHQgKiBAcGFyYW0ge1RDb2RlUG9pbnRzfSBjb2RlX3BvaW50c1xuXHQgKiBAeWllbGQge1RDb2RlUG9pbnRPYmp9XG5cdCAqL1xuXG5cdGZ1bmN0aW9uKiBnZW5lcmF0b3IoY29kZV9wb2ludHMpIHtcblx0ICBmb3IgKGNvbnN0IFtjb2RlX3BvaW50X21pbiwgY29kZV9wb2ludF9tYXhdIG9mIGNvZGVfcG9pbnRzKSB7XG5cdCAgICBmb3IgKGxldCBpID0gY29kZV9wb2ludF9taW47IGkgPD0gY29kZV9wb2ludF9tYXg7IGkrKykge1xuXHQgICAgICBsZXQgY29tcG9zZWQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuXHQgICAgICBsZXQgZm9sZGVkID0gYXNjaWlmb2xkKGNvbXBvc2VkKTtcblxuXHQgICAgICBpZiAoZm9sZGVkID09IGNvbXBvc2VkLnRvTG93ZXJDYXNlKCkpIHtcblx0ICAgICAgICBjb250aW51ZTtcblx0ICAgICAgfSAvLyBza2lwIHdoZW4gZm9sZGVkIGlzIGEgc3RyaW5nIGxvbmdlciB0aGFuIDMgY2hhcmFjdGVycyBsb25nXG5cdCAgICAgIC8vIGJjIHRoZSByZXN1bHRpbmcgcmVnZXggcGF0dGVybnMgd2lsbCBiZSBsb25nXG5cdCAgICAgIC8vIGVnOlxuXHQgICAgICAvLyBmb2xkZWQg2LXZhNmJINin2YTZhNmHINi52YTZitmHINmI2LPZhNmFIGxlbmd0aCAxOCBjb2RlIHBvaW50IDY1MDE4XG5cdCAgICAgIC8vIGZvbGRlZCDYrNmEINis2YTYp9mE2YcgbGVuZ3RoIDggY29kZSBwb2ludCA2NTAxOVxuXG5cblx0ICAgICAgaWYgKGZvbGRlZC5sZW5ndGggPiBtYXhfY2hhcl9sZW5ndGgpIHtcblx0ICAgICAgICBjb250aW51ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChmb2xkZWQubGVuZ3RoID09IDApIHtcblx0ICAgICAgICBjb250aW51ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHlpZWxkIHtcblx0ICAgICAgICBmb2xkZWQ6IGZvbGRlZCxcblx0ICAgICAgICBjb21wb3NlZDogY29tcG9zZWQsXG5cdCAgICAgICAgY29kZV9wb2ludDogaVxuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgIH1cblx0fVxuXHQvKipcblx0ICogR2VuZXJhdGUgYSB1bmljb2RlIG1hcCBmcm9tIHRoZSBsaXN0IG9mIGNvZGUgcG9pbnRzXG5cdCAqIEBwYXJhbSB7VENvZGVQb2ludHN9IGNvZGVfcG9pbnRzXG5cdCAqIEByZXR1cm4ge1RVbmljb2RlU2V0c31cblx0ICovXG5cblx0Y29uc3QgZ2VuZXJhdGVTZXRzID0gY29kZV9wb2ludHMgPT4ge1xuXHQgIC8qKiBAdHlwZSB7e1trZXk6c3RyaW5nXTpTZXQ8c3RyaW5nPn19ICovXG5cdCAgY29uc3QgdW5pY29kZV9zZXRzID0ge307XG5cdCAgLyoqXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IGZvbGRlZFxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfSB0b19hZGRcblx0ICAgKi9cblxuXHQgIGNvbnN0IGFkZE1hdGNoaW5nID0gKGZvbGRlZCwgdG9fYWRkKSA9PiB7XG5cdCAgICAvKiogQHR5cGUge1NldDxzdHJpbmc+fSAqL1xuXHQgICAgY29uc3QgZm9sZGVkX3NldCA9IHVuaWNvZGVfc2V0c1tmb2xkZWRdIHx8IG5ldyBTZXQoKTtcblx0ICAgIGNvbnN0IHBhdHQgPSBuZXcgUmVnRXhwKCdeJyArIHNldFRvUGF0dGVybihmb2xkZWRfc2V0KSArICckJywgJ2l1Jyk7XG5cblx0ICAgIGlmICh0b19hZGQubWF0Y2gocGF0dCkpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBmb2xkZWRfc2V0LmFkZChlc2NhcGVfcmVnZXgodG9fYWRkKSk7XG5cdCAgICB1bmljb2RlX3NldHNbZm9sZGVkXSA9IGZvbGRlZF9zZXQ7XG5cdCAgfTtcblxuXHQgIGZvciAobGV0IHZhbHVlIG9mIGdlbmVyYXRvcihjb2RlX3BvaW50cykpIHtcblx0ICAgIGFkZE1hdGNoaW5nKHZhbHVlLmZvbGRlZCwgdmFsdWUuZm9sZGVkKTtcblx0ICAgIGFkZE1hdGNoaW5nKHZhbHVlLmZvbGRlZCwgdmFsdWUuY29tcG9zZWQpO1xuXHQgIH1cblxuXHQgIHJldHVybiB1bmljb2RlX3NldHM7XG5cdH07XG5cdC8qKlxuXHQgKiBHZW5lcmF0ZSBhIHVuaWNvZGUgbWFwIGZyb20gdGhlIGxpc3Qgb2YgY29kZSBwb2ludHNcblx0ICogYWUgPT4gKD86KD86YWV8w4Z8x7x8x6IpfCg/OkF84pK2fO+8oS4uLikoPzpFfMmbfOKSui4uLikpXG5cdCAqXG5cdCAqIEBwYXJhbSB7VENvZGVQb2ludHN9IGNvZGVfcG9pbnRzXG5cdCAqIEByZXR1cm4ge1RVbmljb2RlTWFwfVxuXHQgKi9cblxuXHRjb25zdCBnZW5lcmF0ZU1hcCA9IGNvZGVfcG9pbnRzID0+IHtcblx0ICAvKiogQHR5cGUge1RVbmljb2RlU2V0c30gKi9cblx0ICBjb25zdCB1bmljb2RlX3NldHMgPSBnZW5lcmF0ZVNldHMoY29kZV9wb2ludHMpO1xuXHQgIC8qKiBAdHlwZSB7VFVuaWNvZGVNYXB9ICovXG5cblx0ICBjb25zdCB1bmljb2RlX21hcCA9IHt9O1xuXHQgIC8qKiBAdHlwZSB7c3RyaW5nW119ICovXG5cblx0ICBsZXQgbXVsdGlfY2hhciA9IFtdO1xuXG5cdCAgZm9yIChsZXQgZm9sZGVkIGluIHVuaWNvZGVfc2V0cykge1xuXHQgICAgbGV0IHNldCA9IHVuaWNvZGVfc2V0c1tmb2xkZWRdO1xuXG5cdCAgICBpZiAoc2V0KSB7XG5cdCAgICAgIHVuaWNvZGVfbWFwW2ZvbGRlZF0gPSBzZXRUb1BhdHRlcm4oc2V0KTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGZvbGRlZC5sZW5ndGggPiAxKSB7XG5cdCAgICAgIG11bHRpX2NoYXIucHVzaChlc2NhcGVfcmVnZXgoZm9sZGVkKSk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgbXVsdGlfY2hhci5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcblx0ICBjb25zdCBtdWx0aV9jaGFyX3BhdHQgPSBhcnJheVRvUGF0dGVybihtdWx0aV9jaGFyKTtcblx0ICBtdWx0aV9jaGFyX3JlZyA9IG5ldyBSZWdFeHAoJ14nICsgbXVsdGlfY2hhcl9wYXR0LCAndScpO1xuXHQgIHJldHVybiB1bmljb2RlX21hcDtcblx0fTtcblx0LyoqXG5cdCAqIE1hcCBlYWNoIGVsZW1lbnQgb2YgYW4gYXJyYXkgZnJvbSBpdCdzIGZvbGRlZCB2YWx1ZSB0byBhbGwgcG9zc2libGUgdW5pY29kZSBtYXRjaGVzXG5cdCAqIEBwYXJhbSB7c3RyaW5nW119IHN0cmluZ3Ncblx0ICogQHBhcmFtIHtudW1iZXJ9IG1pbl9yZXBsYWNlbWVudFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXG5cdGNvbnN0IG1hcFNlcXVlbmNlID0gKHN0cmluZ3MsIG1pbl9yZXBsYWNlbWVudCA9IDEpID0+IHtcblx0ICBsZXQgY2hhcnNfcmVwbGFjZWQgPSAwO1xuXHQgIHN0cmluZ3MgPSBzdHJpbmdzLm1hcChzdHIgPT4ge1xuXHQgICAgaWYgKHVuaWNvZGVfbWFwW3N0cl0pIHtcblx0ICAgICAgY2hhcnNfcmVwbGFjZWQgKz0gc3RyLmxlbmd0aDtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHVuaWNvZGVfbWFwW3N0cl0gfHwgc3RyO1xuXHQgIH0pO1xuXG5cdCAgaWYgKGNoYXJzX3JlcGxhY2VkID49IG1pbl9yZXBsYWNlbWVudCkge1xuXHQgICAgcmV0dXJuIHNlcXVlbmNlUGF0dGVybihzdHJpbmdzKTtcblx0ICB9XG5cblx0ICByZXR1cm4gJyc7XG5cdH07XG5cdC8qKlxuXHQgKiBDb252ZXJ0IGEgc2hvcnQgc3RyaW5nIGFuZCBzcGxpdCBpdCBpbnRvIGFsbCBwb3NzaWJsZSBwYXR0ZXJuc1xuXHQgKiBLZWVwIGEgcGF0dGVybiBvbmx5IGlmIG1pbl9yZXBsYWNlbWVudCBpcyBtZXRcblx0ICpcblx0ICogJ2FiYydcblx0ICogXHRcdD0+IFtbJ2FiYyddLFsnYWInLCdjJ10sWydhJywnYmMnXSxbJ2EnLCdiJywnYyddXVxuXHQgKlx0XHQ9PiBbJ2FiYy1wYXR0ZXJuJywnYWItYy1wYXR0ZXJuJy4uLl1cblx0ICpcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcGFyYW0ge251bWJlcn0gbWluX3JlcGxhY2VtZW50XG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cblx0Y29uc3Qgc3Vic3RyaW5nc1RvUGF0dGVybiA9IChzdHIsIG1pbl9yZXBsYWNlbWVudCA9IDEpID0+IHtcblx0ICBtaW5fcmVwbGFjZW1lbnQgPSBNYXRoLm1heChtaW5fcmVwbGFjZW1lbnQsIHN0ci5sZW5ndGggLSAxKTtcblx0ICByZXR1cm4gYXJyYXlUb1BhdHRlcm4oYWxsU3Vic3RyaW5ncyhzdHIpLm1hcChzdWJfcGF0ID0+IHtcblx0ICAgIHJldHVybiBtYXBTZXF1ZW5jZShzdWJfcGF0LCBtaW5fcmVwbGFjZW1lbnQpO1xuXHQgIH0pKTtcblx0fTtcblx0LyoqXG5cdCAqIENvbnZlcnQgYW4gYXJyYXkgb2Ygc2VxdWVuY2VzIGludG8gYSBwYXR0ZXJuXG5cdCAqIFt7c3RhcnQ6MCxlbmQ6MyxsZW5ndGg6MyxzdWJzdHI6J2lpaSd9Li4uXSA9PiAoPzppaWkuLi4pXG5cdCAqXG5cdCAqIEBwYXJhbSB7U2VxdWVuY2VbXX0gc2VxdWVuY2VzXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsXG5cdCAqL1xuXG5cdGNvbnN0IHNlcXVlbmNlc1RvUGF0dGVybiA9IChzZXF1ZW5jZXMsIGFsbCA9IHRydWUpID0+IHtcblx0ICBsZXQgbWluX3JlcGxhY2VtZW50ID0gc2VxdWVuY2VzLmxlbmd0aCA+IDEgPyAxIDogMDtcblx0ICByZXR1cm4gYXJyYXlUb1BhdHRlcm4oc2VxdWVuY2VzLm1hcChzZXF1ZW5jZSA9PiB7XG5cdCAgICBsZXQgc2VxID0gW107XG5cdCAgICBjb25zdCBsZW4gPSBhbGwgPyBzZXF1ZW5jZS5sZW5ndGgoKSA6IHNlcXVlbmNlLmxlbmd0aCgpIC0gMTtcblxuXHQgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW47IGorKykge1xuXHQgICAgICBzZXEucHVzaChzdWJzdHJpbmdzVG9QYXR0ZXJuKHNlcXVlbmNlLnN1YnN0cnNbal0gfHwgJycsIG1pbl9yZXBsYWNlbWVudCkpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gc2VxdWVuY2VQYXR0ZXJuKHNlcSk7XG5cdCAgfSkpO1xuXHR9O1xuXHQvKipcblx0ICogUmV0dXJuIHRydWUgaWYgdGhlIHNlcXVlbmNlIGlzIGFscmVhZHkgaW4gdGhlIHNlcXVlbmNlc1xuXHQgKiBAcGFyYW0ge1NlcXVlbmNlfSBuZWVkbGVfc2VxXG5cdCAqIEBwYXJhbSB7U2VxdWVuY2VbXX0gc2VxdWVuY2VzXG5cdCAqL1xuXG5cblx0Y29uc3QgaW5TZXF1ZW5jZXMgPSAobmVlZGxlX3NlcSwgc2VxdWVuY2VzKSA9PiB7XG5cdCAgZm9yIChjb25zdCBzZXEgb2Ygc2VxdWVuY2VzKSB7XG5cdCAgICBpZiAoc2VxLnN0YXJ0ICE9IG5lZWRsZV9zZXEuc3RhcnQgfHwgc2VxLmVuZCAhPSBuZWVkbGVfc2VxLmVuZCkge1xuXHQgICAgICBjb250aW51ZTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNlcS5zdWJzdHJzLmpvaW4oJycpICE9PSBuZWVkbGVfc2VxLnN1YnN0cnMuam9pbignJykpIHtcblx0ICAgICAgY29udGludWU7XG5cdCAgICB9XG5cblx0ICAgIGxldCBuZWVkbGVfcGFydHMgPSBuZWVkbGVfc2VxLnBhcnRzO1xuXHQgICAgLyoqXG5cdCAgICAgKiBAcGFyYW0ge1RTZXF1ZW5jZVBhcnR9IHBhcnRcblx0ICAgICAqL1xuXG5cdCAgICBjb25zdCBmaWx0ZXIgPSBwYXJ0ID0+IHtcblx0ICAgICAgZm9yIChjb25zdCBuZWVkbGVfcGFydCBvZiBuZWVkbGVfcGFydHMpIHtcblx0ICAgICAgICBpZiAobmVlZGxlX3BhcnQuc3RhcnQgPT09IHBhcnQuc3RhcnQgJiYgbmVlZGxlX3BhcnQuc3Vic3RyID09PSBwYXJ0LnN1YnN0cikge1xuXHQgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmIChwYXJ0Lmxlbmd0aCA9PSAxIHx8IG5lZWRsZV9wYXJ0Lmxlbmd0aCA9PSAxKSB7XG5cdCAgICAgICAgICBjb250aW51ZTtcblx0ICAgICAgICB9IC8vIGNoZWNrIGZvciBvdmVybGFwcGluZyBwYXJ0c1xuXHQgICAgICAgIC8vIGEgPSBbJzo6PScsJz09J11cblx0ICAgICAgICAvLyBiID0gWyc6OicsJz09PSddXG5cdCAgICAgICAgLy8gYSA9IFsncicsJ3NtJ11cblx0ICAgICAgICAvLyBiID0gWydycycsJ20nXVxuXG5cblx0ICAgICAgICBpZiAocGFydC5zdGFydCA8IG5lZWRsZV9wYXJ0LnN0YXJ0ICYmIHBhcnQuZW5kID4gbmVlZGxlX3BhcnQuc3RhcnQpIHtcblx0ICAgICAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmIChuZWVkbGVfcGFydC5zdGFydCA8IHBhcnQuc3RhcnQgJiYgbmVlZGxlX3BhcnQuZW5kID4gcGFydC5zdGFydCkge1xuXHQgICAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfTtcblxuXHQgICAgbGV0IGZpbHRlcmVkID0gc2VxLnBhcnRzLmZpbHRlcihmaWx0ZXIpO1xuXG5cdCAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID4gMCkge1xuXHQgICAgICBjb250aW51ZTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdGNsYXNzIFNlcXVlbmNlIHtcblx0ICBjb25zdHJ1Y3RvcigpIHtcblx0ICAgIC8qKiBAdHlwZSB7VFNlcXVlbmNlUGFydFtdfSAqL1xuXHQgICAgdGhpcy5wYXJ0cyA9IFtdO1xuXHQgICAgLyoqIEB0eXBlIHtzdHJpbmdbXX0gKi9cblxuXHQgICAgdGhpcy5zdWJzdHJzID0gW107XG5cdCAgICB0aGlzLnN0YXJ0ID0gMDtcblx0ICAgIHRoaXMuZW5kID0gMDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQHBhcmFtIHtUU2VxdWVuY2VQYXJ0fHVuZGVmaW5lZH0gcGFydFxuXHQgICAqL1xuXG5cblx0ICBhZGQocGFydCkge1xuXHQgICAgaWYgKHBhcnQpIHtcblx0ICAgICAgdGhpcy5wYXJ0cy5wdXNoKHBhcnQpO1xuXHQgICAgICB0aGlzLnN1YnN0cnMucHVzaChwYXJ0LnN1YnN0cik7XG5cdCAgICAgIHRoaXMuc3RhcnQgPSBNYXRoLm1pbihwYXJ0LnN0YXJ0LCB0aGlzLnN0YXJ0KTtcblx0ICAgICAgdGhpcy5lbmQgPSBNYXRoLm1heChwYXJ0LmVuZCwgdGhpcy5lbmQpO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIGxhc3QoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5wYXJ0c1t0aGlzLnBhcnRzLmxlbmd0aCAtIDFdO1xuXHQgIH1cblxuXHQgIGxlbmd0aCgpIHtcblx0ICAgIHJldHVybiB0aGlzLnBhcnRzLmxlbmd0aDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uXG5cdCAgICogQHBhcmFtIHtUU2VxdWVuY2VQYXJ0fSBsYXN0X3BpZWNlXG5cdCAgICovXG5cblxuXHQgIGNsb25lKHBvc2l0aW9uLCBsYXN0X3BpZWNlKSB7XG5cdCAgICBsZXQgY2xvbmUgPSBuZXcgU2VxdWVuY2UoKTtcblx0ICAgIGxldCBwYXJ0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5wYXJ0cykpO1xuXHQgICAgbGV0IGxhc3RfcGFydCA9IHBhcnRzLnBvcCgpO1xuXG5cdCAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcblx0ICAgICAgY2xvbmUuYWRkKHBhcnQpO1xuXHQgICAgfVxuXG5cdCAgICBsZXQgbGFzdF9zdWJzdHIgPSBsYXN0X3BpZWNlLnN1YnN0ci5zdWJzdHJpbmcoMCwgcG9zaXRpb24gLSBsYXN0X3BhcnQuc3RhcnQpO1xuXHQgICAgbGV0IGNsb25lX2xhc3RfbGVuID0gbGFzdF9zdWJzdHIubGVuZ3RoO1xuXHQgICAgY2xvbmUuYWRkKHtcblx0ICAgICAgc3RhcnQ6IGxhc3RfcGFydC5zdGFydCxcblx0ICAgICAgZW5kOiBsYXN0X3BhcnQuc3RhcnQgKyBjbG9uZV9sYXN0X2xlbixcblx0ICAgICAgbGVuZ3RoOiBjbG9uZV9sYXN0X2xlbixcblx0ICAgICAgc3Vic3RyOiBsYXN0X3N1YnN0clxuXHQgICAgfSk7XG5cdCAgICByZXR1cm4gY2xvbmU7XG5cdCAgfVxuXG5cdH1cblx0LyoqXG5cdCAqIEV4cGFuZCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBwYXR0ZXJuIHRvIGluY2x1ZGUgdW5pY29kZSB2YXJpYW50c1xuXHQgKiBcdGVnIC9hLyBiZWNvbWVzIC9h4pOQ772B4bqaw6DDocOi4bqn4bql4bqr4bqpw6PEgcSD4bqx4bqv4bq14bqzyKfHocOkx5/huqPDpce7x47IgciD4bqh4bqt4bq34biBxIXisaXJkMmRQeKStu+8ocOAw4HDguG6puG6pOG6quG6qMODxIDEguG6sOG6ruG6tOG6ssimx6DDhMee4bqiw4XHuseNyIDIguG6oOG6rOG6tuG4gMSEyLrisa8vXG5cdCAqXG5cdCAqIElzc3VlOlxuXHQgKiAg77qK77qLIFsgJ++6iiA9IFxcXFx1e2ZlOGF9JywgJ++6iyA9IFxcXFx1e2ZlOGJ9JyBdXG5cdCAqXHRiZWNvbWVzOlx02YrZlNmK2ZQgWyAn2YogPSBcXFxcdXs2NGF9JywgJ9mUID0gXFxcXHV7NjU0fScsICfZiiA9IFxcXFx1ezY0YX0nLCAn2ZQgPSBcXFxcdXs2NTR9JyBdXG5cdCAqXG5cdCAqXHTEsMSyID0gSUlKID0g4oWhSlxuXHQgKlxuXHQgKiBcdDEvMi80XG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHJldHVybiB7c3RyaW5nfHVuZGVmaW5lZH1cblx0ICovXG5cblxuXHRjb25zdCBnZXRQYXR0ZXJuID0gc3RyID0+IHtcblx0ICBpbml0aWFsaXplKCk7XG5cdCAgc3RyID0gYXNjaWlmb2xkKHN0cik7XG5cdCAgbGV0IHBhdHRlcm4gPSAnJztcblx0ICBsZXQgc2VxdWVuY2VzID0gW25ldyBTZXF1ZW5jZSgpXTtcblxuXHQgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBsZXQgc3Vic3RyID0gc3RyLnN1YnN0cmluZyhpKTtcblx0ICAgIGxldCBtYXRjaCA9IHN1YnN0ci5tYXRjaChtdWx0aV9jaGFyX3JlZyk7XG5cdCAgICBjb25zdCBjaGFyID0gc3RyLnN1YnN0cmluZyhpLCBpICsgMSk7XG5cdCAgICBjb25zdCBtYXRjaF9zdHIgPSBtYXRjaCA/IG1hdGNoWzBdIDogbnVsbDsgLy8gbG9vcCB0aHJvdWdoIHNlcXVlbmNlc1xuXHQgICAgLy8gYWRkIGVpdGhlciB0aGUgY2hhciBvciBtdWx0aV9tYXRjaFxuXG5cdCAgICBsZXQgb3ZlcmxhcHBpbmcgPSBbXTtcblx0ICAgIGxldCBhZGRlZF90eXBlcyA9IG5ldyBTZXQoKTtcblxuXHQgICAgZm9yIChjb25zdCBzZXF1ZW5jZSBvZiBzZXF1ZW5jZXMpIHtcblx0ICAgICAgY29uc3QgbGFzdF9waWVjZSA9IHNlcXVlbmNlLmxhc3QoKTtcblxuXHQgICAgICBpZiAoIWxhc3RfcGllY2UgfHwgbGFzdF9waWVjZS5sZW5ndGggPT0gMSB8fCBsYXN0X3BpZWNlLmVuZCA8PSBpKSB7XG5cdCAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIG11bHRpIG1hdGNoXG5cdCAgICAgICAgaWYgKG1hdGNoX3N0cikge1xuXHQgICAgICAgICAgY29uc3QgbGVuID0gbWF0Y2hfc3RyLmxlbmd0aDtcblx0ICAgICAgICAgIHNlcXVlbmNlLmFkZCh7XG5cdCAgICAgICAgICAgIHN0YXJ0OiBpLFxuXHQgICAgICAgICAgICBlbmQ6IGkgKyBsZW4sXG5cdCAgICAgICAgICAgIGxlbmd0aDogbGVuLFxuXHQgICAgICAgICAgICBzdWJzdHI6IG1hdGNoX3N0clxuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgICBhZGRlZF90eXBlcy5hZGQoJzEnKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgc2VxdWVuY2UuYWRkKHtcblx0ICAgICAgICAgICAgc3RhcnQ6IGksXG5cdCAgICAgICAgICAgIGVuZDogaSArIDEsXG5cdCAgICAgICAgICAgIGxlbmd0aDogMSxcblx0ICAgICAgICAgICAgc3Vic3RyOiBjaGFyXG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICAgIGFkZGVkX3R5cGVzLmFkZCgnMicpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIGlmIChtYXRjaF9zdHIpIHtcblx0ICAgICAgICBsZXQgY2xvbmUgPSBzZXF1ZW5jZS5jbG9uZShpLCBsYXN0X3BpZWNlKTtcblx0ICAgICAgICBjb25zdCBsZW4gPSBtYXRjaF9zdHIubGVuZ3RoO1xuXHQgICAgICAgIGNsb25lLmFkZCh7XG5cdCAgICAgICAgICBzdGFydDogaSxcblx0ICAgICAgICAgIGVuZDogaSArIGxlbixcblx0ICAgICAgICAgIGxlbmd0aDogbGVuLFxuXHQgICAgICAgICAgc3Vic3RyOiBtYXRjaF9zdHJcblx0ICAgICAgICB9KTtcblx0ICAgICAgICBvdmVybGFwcGluZy5wdXNoKGNsb25lKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAvLyBkb24ndCBhZGQgY2hhclxuXHQgICAgICAgIC8vIGFkZGluZyB3b3VsZCBjcmVhdGUgaW52YWxpZCBwYXR0ZXJuczogMjM0ID0+IFsyLDM0LDRdXG5cdCAgICAgICAgYWRkZWRfdHlwZXMuYWRkKCczJyk7XG5cdCAgICAgIH1cblx0ICAgIH0gLy8gaWYgd2UgaGF2ZSBvdmVybGFwcGluZ1xuXG5cblx0ICAgIGlmIChvdmVybGFwcGluZy5sZW5ndGggPiAwKSB7XG5cdCAgICAgIC8vIFsnaWknLCdpaWknXSBiZWZvcmUgWydpJywnaScsJ2lpaSddXG5cdCAgICAgIG92ZXJsYXBwaW5nID0gb3ZlcmxhcHBpbmcuc29ydCgoYSwgYikgPT4ge1xuXHQgICAgICAgIHJldHVybiBhLmxlbmd0aCgpIC0gYi5sZW5ndGgoKTtcblx0ICAgICAgfSk7XG5cblx0ICAgICAgZm9yIChsZXQgY2xvbmUgb2Ygb3ZlcmxhcHBpbmcpIHtcblx0ICAgICAgICAvLyBkb24ndCBhZGQgaWYgd2UgYWxyZWFkeSBoYXZlIGFuIGVxdWl2YWxlbnQgc2VxdWVuY2Vcblx0ICAgICAgICBpZiAoaW5TZXF1ZW5jZXMoY2xvbmUsIHNlcXVlbmNlcykpIHtcblx0ICAgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHNlcXVlbmNlcy5wdXNoKGNsb25lKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGNvbnRpbnVlO1xuXHQgICAgfSAvLyBpZiB3ZSBoYXZlbid0IGRvbmUgYW55dGhpbmcgdW5pcXVlXG5cdCAgICAvLyBjbGVhbiB1cCB0aGUgcGF0dGVybnNcblx0ICAgIC8vIGhlbHBzIGtlZXAgcGF0dGVybnMgc21hbGxlclxuXHQgICAgLy8gaWYgc3RyID0gJ3LigqjjjqdhYXJzcycsIHBhdHRlcm4gd2lsbCBiZSA0NDYgaW5zdGVhZCBvZiA2NTVcblxuXG5cdCAgICBpZiAoaSA+IDAgJiYgYWRkZWRfdHlwZXMuc2l6ZSA9PSAxICYmICFhZGRlZF90eXBlcy5oYXMoJzMnKSkge1xuXHQgICAgICBwYXR0ZXJuICs9IHNlcXVlbmNlc1RvUGF0dGVybihzZXF1ZW5jZXMsIGZhbHNlKTtcblx0ICAgICAgbGV0IG5ld19zZXEgPSBuZXcgU2VxdWVuY2UoKTtcblx0ICAgICAgY29uc3Qgb2xkX3NlcSA9IHNlcXVlbmNlc1swXTtcblxuXHQgICAgICBpZiAob2xkX3NlcSkge1xuXHQgICAgICAgIG5ld19zZXEuYWRkKG9sZF9zZXEubGFzdCgpKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlcXVlbmNlcyA9IFtuZXdfc2VxXTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBwYXR0ZXJuICs9IHNlcXVlbmNlc1RvUGF0dGVybihzZXF1ZW5jZXMsIHRydWUpO1xuXHQgIHJldHVybiBwYXR0ZXJuO1xuXHR9O1xuXG5cdC8qISBzaWZ0ZXIuanMgfCBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvc2lmdGVyLmpzIHwgQXBhY2hlIExpY2Vuc2UgKHYyKSAqL1xuXG5cdC8qKlxuXHQgKiBBIHByb3BlcnR5IGdldHRlciByZXNvbHZpbmcgZG90LW5vdGF0aW9uXG5cdCAqIEBwYXJhbSAge09iamVjdH0gIG9iaiAgICAgVGhlIHJvb3Qgb2JqZWN0IHRvIGZldGNoIHByb3BlcnR5IG9uXG5cdCAqIEBwYXJhbSAge1N0cmluZ30gIG5hbWUgICAgVGhlIG9wdGlvbmFsbHkgZG90dGVkIHByb3BlcnR5IG5hbWUgdG8gZmV0Y2hcblx0ICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICBUaGUgcmVzb2x2ZWQgcHJvcGVydHkgdmFsdWVcblx0ICovXG5cdGNvbnN0IGdldEF0dHIgPSAob2JqLCBuYW1lKSA9PiB7XG5cdCAgaWYgKCFvYmopIHJldHVybjtcblx0ICByZXR1cm4gb2JqW25hbWVdO1xuXHR9O1xuXHQvKipcblx0ICogQSBwcm9wZXJ0eSBnZXR0ZXIgcmVzb2x2aW5nIGRvdC1ub3RhdGlvblxuXHQgKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogICAgIFRoZSByb290IG9iamVjdCB0byBmZXRjaCBwcm9wZXJ0eSBvblxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICBuYW1lICAgIFRoZSBvcHRpb25hbGx5IGRvdHRlZCBwcm9wZXJ0eSBuYW1lIHRvIGZldGNoXG5cdCAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgVGhlIHJlc29sdmVkIHByb3BlcnR5IHZhbHVlXG5cdCAqL1xuXG5cdGNvbnN0IGdldEF0dHJOZXN0aW5nID0gKG9iaiwgbmFtZSkgPT4ge1xuXHQgIGlmICghb2JqKSByZXR1cm47XG5cdCAgdmFyIHBhcnQsXG5cdCAgICAgIG5hbWVzID0gbmFtZS5zcGxpdChcIi5cIik7XG5cblx0ICB3aGlsZSAoKHBhcnQgPSBuYW1lcy5zaGlmdCgpKSAmJiAob2JqID0gb2JqW3BhcnRdKSk7XG5cblx0ICByZXR1cm4gb2JqO1xuXHR9O1xuXHQvKipcblx0ICogQ2FsY3VsYXRlcyBob3cgY2xvc2Ugb2YgYSBtYXRjaCB0aGVcblx0ICogZ2l2ZW4gdmFsdWUgaXMgYWdhaW5zdCBhIHNlYXJjaCB0b2tlbi5cblx0ICpcblx0ICovXG5cblx0Y29uc3Qgc2NvcmVWYWx1ZSA9ICh2YWx1ZSwgdG9rZW4sIHdlaWdodCkgPT4ge1xuXHQgIHZhciBzY29yZSwgcG9zO1xuXHQgIGlmICghdmFsdWUpIHJldHVybiAwO1xuXHQgIHZhbHVlID0gdmFsdWUgKyAnJztcblx0ICBpZiAodG9rZW4ucmVnZXggPT0gbnVsbCkgcmV0dXJuIDA7XG5cdCAgcG9zID0gdmFsdWUuc2VhcmNoKHRva2VuLnJlZ2V4KTtcblx0ICBpZiAocG9zID09PSAtMSkgcmV0dXJuIDA7XG5cdCAgc2NvcmUgPSB0b2tlbi5zdHJpbmcubGVuZ3RoIC8gdmFsdWUubGVuZ3RoO1xuXHQgIGlmIChwb3MgPT09IDApIHNjb3JlICs9IDAuNTtcblx0ICByZXR1cm4gc2NvcmUgKiB3ZWlnaHQ7XG5cdH07XG5cdC8qKlxuXHQgKiBDYXN0IG9iamVjdCBwcm9wZXJ0eSB0byBhbiBhcnJheSBpZiBpdCBleGlzdHMgYW5kIGhhcyBhIHZhbHVlXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IHByb3BUb0FycmF5ID0gKG9iaiwga2V5KSA9PiB7XG5cdCAgdmFyIHZhbHVlID0gb2JqW2tleV07XG5cdCAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSByZXR1cm4gdmFsdWU7XG5cblx0ICBpZiAodmFsdWUgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdCAgICBvYmpba2V5XSA9IFt2YWx1ZV07XG5cdCAgfVxuXHR9O1xuXHQvKipcblx0ICogSXRlcmF0ZXMgb3ZlciBhcnJheXMgYW5kIGhhc2hlcy5cblx0ICpcblx0ICogYGBgXG5cdCAqIGl0ZXJhdGUodGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSwgaWQpIHtcblx0ICogICAgLy8gaW52b2tlZCBmb3IgZWFjaCBpdGVtXG5cdCAqIH0pO1xuXHQgKiBgYGBcblx0ICpcblx0ICovXG5cblx0Y29uc3QgaXRlcmF0ZSQxID0gKG9iamVjdCwgY2FsbGJhY2spID0+IHtcblx0ICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG5cdCAgICBvYmplY3QuZm9yRWFjaChjYWxsYmFjayk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcblx0ICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdCAgICAgICAgY2FsbGJhY2sob2JqZWN0W2tleV0sIGtleSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdH07XG5cdGNvbnN0IGNtcCA9IChhLCBiKSA9PiB7XG5cdCAgaWYgKHR5cGVvZiBhID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgYiA9PT0gJ251bWJlcicpIHtcblx0ICAgIHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDtcblx0ICB9XG5cblx0ICBhID0gYXNjaWlmb2xkKGEgKyAnJykudG9Mb3dlckNhc2UoKTtcblx0ICBiID0gYXNjaWlmb2xkKGIgKyAnJykudG9Mb3dlckNhc2UoKTtcblx0ICBpZiAoYSA+IGIpIHJldHVybiAxO1xuXHQgIGlmIChiID4gYSkgcmV0dXJuIC0xO1xuXHQgIHJldHVybiAwO1xuXHR9O1xuXG5cdC8qISBzaWZ0ZXIuanMgfCBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvc2lmdGVyLmpzIHwgQXBhY2hlIExpY2Vuc2UgKHYyKSAqL1xuXG5cdC8qKlxuXHQgKiBzaWZ0ZXIuanNcblx0ICogQ29weXJpZ2h0IChjKSAyMDEz4oCTMjAyMCBCcmlhbiBSZWF2aXMgJiBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqIEBhdXRob3IgQnJpYW4gUmVhdmlzIDxicmlhbkB0aGlyZHJvdXRlLmNvbT5cblx0ICovXG5cblx0Y2xhc3MgU2lmdGVyIHtcblx0ICAvLyBbXXx7fTtcblxuXHQgIC8qKlxuXHQgICAqIFRleHR1YWxseSBzZWFyY2hlcyBhcnJheXMgYW5kIGhhc2hlcyBvZiBvYmplY3RzXG5cdCAgICogYnkgcHJvcGVydHkgKG9yIG11bHRpcGxlIHByb3BlcnRpZXMpLiBEZXNpZ25lZFxuXHQgICAqIHNwZWNpZmljYWxseSBmb3IgYXV0b2NvbXBsZXRlLlxuXHQgICAqXG5cdCAgICovXG5cdCAgY29uc3RydWN0b3IoaXRlbXMsIHNldHRpbmdzKSB7XG5cdCAgICB0aGlzLml0ZW1zID0gdm9pZCAwO1xuXHQgICAgdGhpcy5zZXR0aW5ncyA9IHZvaWQgMDtcblx0ICAgIHRoaXMuaXRlbXMgPSBpdGVtcztcblx0ICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB7XG5cdCAgICAgIGRpYWNyaXRpY3M6IHRydWVcblx0ICAgIH07XG5cdCAgfVxuXG5cdCAgLyoqXG5cdCAgICogU3BsaXRzIGEgc2VhcmNoIHN0cmluZyBpbnRvIGFuIGFycmF5IG9mIGluZGl2aWR1YWxcblx0ICAgKiByZWdleHBzIHRvIGJlIHVzZWQgdG8gbWF0Y2ggcmVzdWx0cy5cblx0ICAgKlxuXHQgICAqL1xuXHQgIHRva2VuaXplKHF1ZXJ5LCByZXNwZWN0X3dvcmRfYm91bmRhcmllcywgd2VpZ2h0cykge1xuXHQgICAgaWYgKCFxdWVyeSB8fCAhcXVlcnkubGVuZ3RoKSByZXR1cm4gW107XG5cdCAgICBjb25zdCB0b2tlbnMgPSBbXTtcblx0ICAgIGNvbnN0IHdvcmRzID0gcXVlcnkuc3BsaXQoL1xccysvKTtcblx0ICAgIHZhciBmaWVsZF9yZWdleDtcblxuXHQgICAgaWYgKHdlaWdodHMpIHtcblx0ICAgICAgZmllbGRfcmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBPYmplY3Qua2V5cyh3ZWlnaHRzKS5tYXAoZXNjYXBlX3JlZ2V4KS5qb2luKCd8JykgKyAnKVxcOiguKikkJyk7XG5cdCAgICB9XG5cblx0ICAgIHdvcmRzLmZvckVhY2god29yZCA9PiB7XG5cdCAgICAgIGxldCBmaWVsZF9tYXRjaDtcblx0ICAgICAgbGV0IGZpZWxkID0gbnVsbDtcblx0ICAgICAgbGV0IHJlZ2V4ID0gbnVsbDsgLy8gbG9vayBmb3IgXCJmaWVsZDpxdWVyeVwiIHRva2Vuc1xuXG5cdCAgICAgIGlmIChmaWVsZF9yZWdleCAmJiAoZmllbGRfbWF0Y2ggPSB3b3JkLm1hdGNoKGZpZWxkX3JlZ2V4KSkpIHtcblx0ICAgICAgICBmaWVsZCA9IGZpZWxkX21hdGNoWzFdO1xuXHQgICAgICAgIHdvcmQgPSBmaWVsZF9tYXRjaFsyXTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICh3b3JkLmxlbmd0aCA+IDApIHtcblx0ICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5kaWFjcml0aWNzKSB7XG5cdCAgICAgICAgICByZWdleCA9IGdldFBhdHRlcm4od29yZCkgfHwgbnVsbDtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgcmVnZXggPSBlc2NhcGVfcmVnZXgod29yZCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKHJlZ2V4ICYmIHJlc3BlY3Rfd29yZF9ib3VuZGFyaWVzKSByZWdleCA9IFwiXFxcXGJcIiArIHJlZ2V4O1xuXHQgICAgICB9XG5cblx0ICAgICAgdG9rZW5zLnB1c2goe1xuXHQgICAgICAgIHN0cmluZzogd29yZCxcblx0ICAgICAgICByZWdleDogcmVnZXggPyBuZXcgUmVnRXhwKHJlZ2V4LCAnaXUnKSA6IG51bGwsXG5cdCAgICAgICAgZmllbGQ6IGZpZWxkXG5cdCAgICAgIH0pO1xuXHQgICAgfSk7XG5cdCAgICByZXR1cm4gdG9rZW5zO1xuXHQgIH1cblxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBiZSB1c2VkIHRvIHNjb3JlIGluZGl2aWR1YWwgcmVzdWx0cy5cblx0ICAgKlxuXHQgICAqIEdvb2QgbWF0Y2hlcyB3aWxsIGhhdmUgYSBoaWdoZXIgc2NvcmUgdGhhbiBwb29yIG1hdGNoZXMuXG5cdCAgICogSWYgYW4gaXRlbSBpcyBub3QgYSBtYXRjaCwgMCB3aWxsIGJlIHJldHVybmVkIGJ5IHRoZSBmdW5jdGlvbi5cblx0ICAgKlxuXHQgICAqIEByZXR1cm5zIHtULlNjb3JlRm59XG5cdCAgICovXG5cdCAgZ2V0U2NvcmVGdW5jdGlvbihxdWVyeSwgb3B0aW9ucykge1xuXHQgICAgdmFyIHNlYXJjaCA9IHRoaXMucHJlcGFyZVNlYXJjaChxdWVyeSwgb3B0aW9ucyk7XG5cdCAgICByZXR1cm4gdGhpcy5fZ2V0U2NvcmVGdW5jdGlvbihzZWFyY2gpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBAcmV0dXJucyB7VC5TY29yZUZufVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIF9nZXRTY29yZUZ1bmN0aW9uKHNlYXJjaCkge1xuXHQgICAgY29uc3QgdG9rZW5zID0gc2VhcmNoLnRva2Vucyxcblx0ICAgICAgICAgIHRva2VuX2NvdW50ID0gdG9rZW5zLmxlbmd0aDtcblxuXHQgICAgaWYgKCF0b2tlbl9jb3VudCkge1xuXHQgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiAwO1xuXHQgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICBjb25zdCBmaWVsZHMgPSBzZWFyY2gub3B0aW9ucy5maWVsZHMsXG5cdCAgICAgICAgICB3ZWlnaHRzID0gc2VhcmNoLndlaWdodHMsXG5cdCAgICAgICAgICBmaWVsZF9jb3VudCA9IGZpZWxkcy5sZW5ndGgsXG5cdCAgICAgICAgICBnZXRBdHRyRm4gPSBzZWFyY2guZ2V0QXR0ckZuO1xuXG5cdCAgICBpZiAoIWZpZWxkX2NvdW50KSB7XG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuIDE7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIENhbGN1bGF0ZXMgdGhlIHNjb3JlIG9mIGFuIG9iamVjdFxuXHQgICAgICogYWdhaW5zdCB0aGUgc2VhcmNoIHF1ZXJ5LlxuXHQgICAgICpcblx0ICAgICAqL1xuXG5cblx0ICAgIGNvbnN0IHNjb3JlT2JqZWN0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoZmllbGRfY291bnQgPT09IDEpIHtcblx0ICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHRva2VuLCBkYXRhKSB7XG5cdCAgICAgICAgICBjb25zdCBmaWVsZCA9IGZpZWxkc1swXS5maWVsZDtcblx0ICAgICAgICAgIHJldHVybiBzY29yZVZhbHVlKGdldEF0dHJGbihkYXRhLCBmaWVsZCksIHRva2VuLCB3ZWlnaHRzW2ZpZWxkXSB8fCAxKTtcblx0ICAgICAgICB9O1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0b2tlbiwgZGF0YSkge1xuXHQgICAgICAgIHZhciBzdW0gPSAwOyAvLyBpcyB0aGUgdG9rZW4gc3BlY2lmaWMgdG8gYSBmaWVsZD9cblxuXHQgICAgICAgIGlmICh0b2tlbi5maWVsZCkge1xuXHQgICAgICAgICAgY29uc3QgdmFsdWUgPSBnZXRBdHRyRm4oZGF0YSwgdG9rZW4uZmllbGQpO1xuXG5cdCAgICAgICAgICBpZiAoIXRva2VuLnJlZ2V4ICYmIHZhbHVlKSB7XG5cdCAgICAgICAgICAgIHN1bSArPSAxIC8gZmllbGRfY291bnQ7XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBzdW0gKz0gc2NvcmVWYWx1ZSh2YWx1ZSwgdG9rZW4sIDEpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBpdGVyYXRlJDEod2VpZ2h0cywgKHdlaWdodCwgZmllbGQpID0+IHtcblx0ICAgICAgICAgICAgc3VtICs9IHNjb3JlVmFsdWUoZ2V0QXR0ckZuKGRhdGEsIGZpZWxkKSwgdG9rZW4sIHdlaWdodCk7XG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gc3VtIC8gZmllbGRfY291bnQ7XG5cdCAgICAgIH07XG5cdCAgICB9KCk7XG5cblx0ICAgIGlmICh0b2tlbl9jb3VudCA9PT0gMSkge1xuXHQgICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcblx0ICAgICAgICByZXR1cm4gc2NvcmVPYmplY3QodG9rZW5zWzBdLCBkYXRhKTtcblx0ICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNlYXJjaC5vcHRpb25zLmNvbmp1bmN0aW9uID09PSAnYW5kJykge1xuXHQgICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcblx0ICAgICAgICB2YXIgc2NvcmUsXG5cdCAgICAgICAgICAgIHN1bSA9IDA7XG5cblx0ICAgICAgICBmb3IgKGxldCB0b2tlbiBvZiB0b2tlbnMpIHtcblx0ICAgICAgICAgIHNjb3JlID0gc2NvcmVPYmplY3QodG9rZW4sIGRhdGEpO1xuXHQgICAgICAgICAgaWYgKHNjb3JlIDw9IDApIHJldHVybiAwO1xuXHQgICAgICAgICAgc3VtICs9IHNjb3JlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBzdW0gLyB0b2tlbl9jb3VudDtcblx0ICAgICAgfTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSkge1xuXHQgICAgICAgIHZhciBzdW0gPSAwO1xuXHQgICAgICAgIGl0ZXJhdGUkMSh0b2tlbnMsIHRva2VuID0+IHtcblx0ICAgICAgICAgIHN1bSArPSBzY29yZU9iamVjdCh0b2tlbiwgZGF0YSk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgcmV0dXJuIHN1bSAvIHRva2VuX2NvdW50O1xuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbXBhcmUgdHdvXG5cdCAgICogcmVzdWx0cywgZm9yIHNvcnRpbmcgcHVycG9zZXMuIElmIG5vIHNvcnRpbmcgc2hvdWxkXG5cdCAgICogYmUgcGVyZm9ybWVkLCBgbnVsbGAgd2lsbCBiZSByZXR1cm5lZC5cblx0ICAgKlxuXHQgICAqIEByZXR1cm4gZnVuY3Rpb24oYSxiKVxuXHQgICAqL1xuXHQgIGdldFNvcnRGdW5jdGlvbihxdWVyeSwgb3B0aW9ucykge1xuXHQgICAgdmFyIHNlYXJjaCA9IHRoaXMucHJlcGFyZVNlYXJjaChxdWVyeSwgb3B0aW9ucyk7XG5cdCAgICByZXR1cm4gdGhpcy5fZ2V0U29ydEZ1bmN0aW9uKHNlYXJjaCk7XG5cdCAgfVxuXG5cdCAgX2dldFNvcnRGdW5jdGlvbihzZWFyY2gpIHtcblx0ICAgIHZhciBpbXBsaWNpdF9zY29yZSxcblx0ICAgICAgICBzb3J0X2ZsZHMgPSBbXTtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzLFxuXHQgICAgICAgICAgb3B0aW9ucyA9IHNlYXJjaC5vcHRpb25zLFxuXHQgICAgICAgICAgc29ydCA9ICFzZWFyY2gucXVlcnkgJiYgb3B0aW9ucy5zb3J0X2VtcHR5ID8gb3B0aW9ucy5zb3J0X2VtcHR5IDogb3B0aW9ucy5zb3J0O1xuXG5cdCAgICBpZiAodHlwZW9mIHNvcnQgPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICByZXR1cm4gc29ydC5iaW5kKHRoaXMpO1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBGZXRjaGVzIHRoZSBzcGVjaWZpZWQgc29ydCBmaWVsZCB2YWx1ZVxuXHQgICAgICogZnJvbSBhIHNlYXJjaCByZXN1bHQgaXRlbS5cblx0ICAgICAqXG5cdCAgICAgKi9cblxuXG5cdCAgICBjb25zdCBnZXRfZmllbGQgPSBmdW5jdGlvbiBnZXRfZmllbGQobmFtZSwgcmVzdWx0KSB7XG5cdCAgICAgIGlmIChuYW1lID09PSAnJHNjb3JlJykgcmV0dXJuIHJlc3VsdC5zY29yZTtcblx0ICAgICAgcmV0dXJuIHNlYXJjaC5nZXRBdHRyRm4oc2VsZi5pdGVtc1tyZXN1bHQuaWRdLCBuYW1lKTtcblx0ICAgIH07IC8vIHBhcnNlIG9wdGlvbnNcblxuXG5cdCAgICBpZiAoc29ydCkge1xuXHQgICAgICBmb3IgKGxldCBzIG9mIHNvcnQpIHtcblx0ICAgICAgICBpZiAoc2VhcmNoLnF1ZXJ5IHx8IHMuZmllbGQgIT09ICckc2NvcmUnKSB7XG5cdCAgICAgICAgICBzb3J0X2ZsZHMucHVzaChzKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0gLy8gdGhlIFwiJHNjb3JlXCIgZmllbGQgaXMgaW1wbGllZCB0byBiZSB0aGUgcHJpbWFyeVxuXHQgICAgLy8gc29ydCBmaWVsZCwgdW5sZXNzIGl0J3MgbWFudWFsbHkgc3BlY2lmaWVkXG5cblxuXHQgICAgaWYgKHNlYXJjaC5xdWVyeSkge1xuXHQgICAgICBpbXBsaWNpdF9zY29yZSA9IHRydWU7XG5cblx0ICAgICAgZm9yIChsZXQgZmxkIG9mIHNvcnRfZmxkcykge1xuXHQgICAgICAgIGlmIChmbGQuZmllbGQgPT09ICckc2NvcmUnKSB7XG5cdCAgICAgICAgICBpbXBsaWNpdF9zY29yZSA9IGZhbHNlO1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGltcGxpY2l0X3Njb3JlKSB7XG5cdCAgICAgICAgc29ydF9mbGRzLnVuc2hpZnQoe1xuXHQgICAgICAgICAgZmllbGQ6ICckc2NvcmUnLFxuXHQgICAgICAgICAgZGlyZWN0aW9uOiAnZGVzYydcblx0ICAgICAgICB9KTtcblx0ICAgICAgfSAvLyB3aXRob3V0IGEgc2VhcmNoLnF1ZXJ5LCBhbGwgaXRlbXMgd2lsbCBoYXZlIHRoZSBzYW1lIHNjb3JlXG5cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNvcnRfZmxkcyA9IHNvcnRfZmxkcy5maWx0ZXIoZmxkID0+IGZsZC5maWVsZCAhPT0gJyRzY29yZScpO1xuXHQgICAgfSAvLyBidWlsZCBmdW5jdGlvblxuXG5cblx0ICAgIGNvbnN0IHNvcnRfZmxkc19jb3VudCA9IHNvcnRfZmxkcy5sZW5ndGg7XG5cblx0ICAgIGlmICghc29ydF9mbGRzX2NvdW50KSB7XG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcblx0ICAgICAgdmFyIHJlc3VsdCwgZmllbGQ7XG5cblx0ICAgICAgZm9yIChsZXQgc29ydF9mbGQgb2Ygc29ydF9mbGRzKSB7XG5cdCAgICAgICAgZmllbGQgPSBzb3J0X2ZsZC5maWVsZDtcblx0ICAgICAgICBsZXQgbXVsdGlwbGllciA9IHNvcnRfZmxkLmRpcmVjdGlvbiA9PT0gJ2Rlc2MnID8gLTEgOiAxO1xuXHQgICAgICAgIHJlc3VsdCA9IG11bHRpcGxpZXIgKiBjbXAoZ2V0X2ZpZWxkKGZpZWxkLCBhKSwgZ2V0X2ZpZWxkKGZpZWxkLCBiKSk7XG5cdCAgICAgICAgaWYgKHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiAwO1xuXHQgICAgfTtcblx0ICB9XG5cblx0ICAvKipcblx0ICAgKiBQYXJzZXMgYSBzZWFyY2ggcXVlcnkgYW5kIHJldHVybnMgYW4gb2JqZWN0XG5cdCAgICogd2l0aCB0b2tlbnMgYW5kIGZpZWxkcyByZWFkeSB0byBiZSBwb3B1bGF0ZWRcblx0ICAgKiB3aXRoIHJlc3VsdHMuXG5cdCAgICpcblx0ICAgKi9cblx0ICBwcmVwYXJlU2VhcmNoKHF1ZXJ5LCBvcHRzVXNlcikge1xuXHQgICAgY29uc3Qgd2VpZ2h0cyA9IHt9O1xuXHQgICAgdmFyIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRzVXNlcik7XG5cdCAgICBwcm9wVG9BcnJheShvcHRpb25zLCAnc29ydCcpO1xuXHQgICAgcHJvcFRvQXJyYXkob3B0aW9ucywgJ3NvcnRfZW1wdHknKTsgLy8gY29udmVydCBmaWVsZHMgdG8gbmV3IGZvcm1hdFxuXG5cdCAgICBpZiAob3B0aW9ucy5maWVsZHMpIHtcblx0ICAgICAgcHJvcFRvQXJyYXkob3B0aW9ucywgJ2ZpZWxkcycpO1xuXHQgICAgICBjb25zdCBmaWVsZHMgPSBbXTtcblx0ICAgICAgb3B0aW9ucy5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7XG5cdCAgICAgICAgaWYgKHR5cGVvZiBmaWVsZCA9PSAnc3RyaW5nJykge1xuXHQgICAgICAgICAgZmllbGQgPSB7XG5cdCAgICAgICAgICAgIGZpZWxkOiBmaWVsZCxcblx0ICAgICAgICAgICAgd2VpZ2h0OiAxXG5cdCAgICAgICAgICB9O1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKTtcblx0ICAgICAgICB3ZWlnaHRzW2ZpZWxkLmZpZWxkXSA9ICd3ZWlnaHQnIGluIGZpZWxkID8gZmllbGQud2VpZ2h0IDogMTtcblx0ICAgICAgfSk7XG5cdCAgICAgIG9wdGlvbnMuZmllbGRzID0gZmllbGRzO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICBvcHRpb25zOiBvcHRpb25zLFxuXHQgICAgICBxdWVyeTogcXVlcnkudG9Mb3dlckNhc2UoKS50cmltKCksXG5cdCAgICAgIHRva2VuczogdGhpcy50b2tlbml6ZShxdWVyeSwgb3B0aW9ucy5yZXNwZWN0X3dvcmRfYm91bmRhcmllcywgd2VpZ2h0cyksXG5cdCAgICAgIHRvdGFsOiAwLFxuXHQgICAgICBpdGVtczogW10sXG5cdCAgICAgIHdlaWdodHM6IHdlaWdodHMsXG5cdCAgICAgIGdldEF0dHJGbjogb3B0aW9ucy5uZXN0aW5nID8gZ2V0QXR0ck5lc3RpbmcgOiBnZXRBdHRyXG5cdCAgICB9O1xuXHQgIH1cblxuXHQgIC8qKlxuXHQgICAqIFNlYXJjaGVzIHRocm91Z2ggYWxsIGl0ZW1zIGFuZCByZXR1cm5zIGEgc29ydGVkIGFycmF5IG9mIG1hdGNoZXMuXG5cdCAgICpcblx0ICAgKi9cblx0ICBzZWFyY2gocXVlcnksIG9wdGlvbnMpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcyxcblx0ICAgICAgICBzY29yZSxcblx0ICAgICAgICBzZWFyY2g7XG5cdCAgICBzZWFyY2ggPSB0aGlzLnByZXBhcmVTZWFyY2gocXVlcnksIG9wdGlvbnMpO1xuXHQgICAgb3B0aW9ucyA9IHNlYXJjaC5vcHRpb25zO1xuXHQgICAgcXVlcnkgPSBzZWFyY2gucXVlcnk7IC8vIGdlbmVyYXRlIHJlc3VsdCBzY29yaW5nIGZ1bmN0aW9uXG5cblx0ICAgIGNvbnN0IGZuX3Njb3JlID0gb3B0aW9ucy5zY29yZSB8fCBzZWxmLl9nZXRTY29yZUZ1bmN0aW9uKHNlYXJjaCk7IC8vIHBlcmZvcm0gc2VhcmNoIGFuZCBzb3J0XG5cblxuXHQgICAgaWYgKHF1ZXJ5Lmxlbmd0aCkge1xuXHQgICAgICBpdGVyYXRlJDEoc2VsZi5pdGVtcywgKGl0ZW0sIGlkKSA9PiB7XG5cdCAgICAgICAgc2NvcmUgPSBmbl9zY29yZShpdGVtKTtcblxuXHQgICAgICAgIGlmIChvcHRpb25zLmZpbHRlciA9PT0gZmFsc2UgfHwgc2NvcmUgPiAwKSB7XG5cdCAgICAgICAgICBzZWFyY2guaXRlbXMucHVzaCh7XG5cdCAgICAgICAgICAgICdzY29yZSc6IHNjb3JlLFxuXHQgICAgICAgICAgICAnaWQnOiBpZFxuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGl0ZXJhdGUkMShzZWxmLml0ZW1zLCAoXywgaWQpID0+IHtcblx0ICAgICAgICBzZWFyY2guaXRlbXMucHVzaCh7XG5cdCAgICAgICAgICAnc2NvcmUnOiAxLFxuXHQgICAgICAgICAgJ2lkJzogaWRcblx0ICAgICAgICB9KTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIGNvbnN0IGZuX3NvcnQgPSBzZWxmLl9nZXRTb3J0RnVuY3Rpb24oc2VhcmNoKTtcblxuXHQgICAgaWYgKGZuX3NvcnQpIHNlYXJjaC5pdGVtcy5zb3J0KGZuX3NvcnQpOyAvLyBhcHBseSBsaW1pdHNcblxuXHQgICAgc2VhcmNoLnRvdGFsID0gc2VhcmNoLml0ZW1zLmxlbmd0aDtcblxuXHQgICAgaWYgKHR5cGVvZiBvcHRpb25zLmxpbWl0ID09PSAnbnVtYmVyJykge1xuXHQgICAgICBzZWFyY2guaXRlbXMgPSBzZWFyY2guaXRlbXMuc2xpY2UoMCwgb3B0aW9ucy5saW1pdCk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBzZWFyY2g7XG5cdCAgfVxuXG5cdH1cblxuXHQvKipcblx0ICogSXRlcmF0ZXMgb3ZlciBhcnJheXMgYW5kIGhhc2hlcy5cblx0ICpcblx0ICogYGBgXG5cdCAqIGl0ZXJhdGUodGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSwgaWQpIHtcblx0ICogICAgLy8gaW52b2tlZCBmb3IgZWFjaCBpdGVtXG5cdCAqIH0pO1xuXHQgKiBgYGBcblx0ICpcblx0ICovXG5cblx0Y29uc3QgaXRlcmF0ZSA9IChvYmplY3QsIGNhbGxiYWNrKSA9PiB7XG5cdCAgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xuXHQgICAgb2JqZWN0LmZvckVhY2goY2FsbGJhY2spO1xuXHQgIH0gZWxzZSB7XG5cdCAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG5cdCAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHQgICAgICAgIGNhbGxiYWNrKG9iamVjdFtrZXldLCBrZXkpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYSBkb20gZWxlbWVudCBmcm9tIGVpdGhlciBhIGRvbSBxdWVyeSBzdHJpbmcsIGpRdWVyeSBvYmplY3QsIGEgZG9tIGVsZW1lbnQgb3IgaHRtbCBzdHJpbmdcblx0ICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDk0MTQzL2NyZWF0aW5nLWEtbmV3LWRvbS1lbGVtZW50LWZyb20tYW4taHRtbC1zdHJpbmctdXNpbmctYnVpbHQtaW4tZG9tLW1ldGhvZHMtb3ItcHJvLzM1Mzg1NTE4IzM1Mzg1NTE4XG5cdCAqXG5cdCAqIHBhcmFtIHF1ZXJ5IHNob3VsZCBiZSB7fVxuXHQgKi9cblxuXHRjb25zdCBnZXREb20gPSBxdWVyeSA9PiB7XG5cdCAgaWYgKHF1ZXJ5LmpxdWVyeSkge1xuXHQgICAgcmV0dXJuIHF1ZXJ5WzBdO1xuXHQgIH1cblxuXHQgIGlmIChxdWVyeSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG5cdCAgICByZXR1cm4gcXVlcnk7XG5cdCAgfVxuXG5cdCAgaWYgKGlzSHRtbFN0cmluZyhxdWVyeSkpIHtcblx0ICAgIHZhciB0cGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXHQgICAgdHBsLmlubmVySFRNTCA9IHF1ZXJ5LnRyaW0oKTsgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuXG5cdCAgICByZXR1cm4gdHBsLmNvbnRlbnQuZmlyc3RDaGlsZDtcblx0ICB9XG5cblx0ICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihxdWVyeSk7XG5cdH07XG5cdGNvbnN0IGlzSHRtbFN0cmluZyA9IGFyZyA9PiB7XG5cdCAgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnICYmIGFyZy5pbmRleE9mKCc8JykgPiAtMSkge1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGZhbHNlO1xuXHR9O1xuXHRjb25zdCBlc2NhcGVRdWVyeSA9IHF1ZXJ5ID0+IHtcblx0ICByZXR1cm4gcXVlcnkucmVwbGFjZSgvWydcIlxcXFxdL2csICdcXFxcJCYnKTtcblx0fTtcblx0LyoqXG5cdCAqIERpc3BhdGNoIGFuIGV2ZW50XG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IHRyaWdnZXJFdmVudCA9IChkb21fZWwsIGV2ZW50X25hbWUpID0+IHtcblx0ICB2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHQgIGV2ZW50LmluaXRFdmVudChldmVudF9uYW1lLCB0cnVlLCBmYWxzZSk7XG5cdCAgZG9tX2VsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9O1xuXHQvKipcblx0ICogQXBwbHkgQ1NTIHJ1bGVzIHRvIGEgZG9tIGVsZW1lbnRcblx0ICpcblx0ICovXG5cblx0Y29uc3QgYXBwbHlDU1MgPSAoZG9tX2VsLCBjc3MpID0+IHtcblx0ICBPYmplY3QuYXNzaWduKGRvbV9lbC5zdHlsZSwgY3NzKTtcblx0fTtcblx0LyoqXG5cdCAqIEFkZCBjc3MgY2xhc3Nlc1xuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBhZGRDbGFzc2VzID0gKGVsbXRzLCAuLi5jbGFzc2VzKSA9PiB7XG5cdCAgdmFyIG5vcm1fY2xhc3NlcyA9IGNsYXNzZXNBcnJheShjbGFzc2VzKTtcblx0ICBlbG10cyA9IGNhc3RBc0FycmF5KGVsbXRzKTtcblx0ICBlbG10cy5tYXAoZWwgPT4ge1xuXHQgICAgbm9ybV9jbGFzc2VzLm1hcChjbHMgPT4ge1xuXHQgICAgICBlbC5jbGFzc0xpc3QuYWRkKGNscyk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0fTtcblx0LyoqXG5cdCAqIFJlbW92ZSBjc3MgY2xhc3Nlc1xuXHQgKlxuXHQgKi9cblxuXHRjb25zdCByZW1vdmVDbGFzc2VzID0gKGVsbXRzLCAuLi5jbGFzc2VzKSA9PiB7XG5cdCAgdmFyIG5vcm1fY2xhc3NlcyA9IGNsYXNzZXNBcnJheShjbGFzc2VzKTtcblx0ICBlbG10cyA9IGNhc3RBc0FycmF5KGVsbXRzKTtcblx0ICBlbG10cy5tYXAoZWwgPT4ge1xuXHQgICAgbm9ybV9jbGFzc2VzLm1hcChjbHMgPT4ge1xuXHQgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0fTtcblx0LyoqXG5cdCAqIFJldHVybiBhcmd1bWVudHNcblx0ICpcblx0ICovXG5cblx0Y29uc3QgY2xhc3Nlc0FycmF5ID0gYXJncyA9PiB7XG5cdCAgdmFyIGNsYXNzZXMgPSBbXTtcblx0ICBpdGVyYXRlKGFyZ3MsIF9jbGFzc2VzID0+IHtcblx0ICAgIGlmICh0eXBlb2YgX2NsYXNzZXMgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgIF9jbGFzc2VzID0gX2NsYXNzZXMudHJpbSgpLnNwbGl0KC9bXFwxMVxcMTJcXDE0XFwxNVxcNDBdLyk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChBcnJheS5pc0FycmF5KF9jbGFzc2VzKSkge1xuXHQgICAgICBjbGFzc2VzID0gY2xhc3Nlcy5jb25jYXQoX2NsYXNzZXMpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHQgIHJldHVybiBjbGFzc2VzLmZpbHRlcihCb29sZWFuKTtcblx0fTtcblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBhcnJheSBmcm9tIGFyZyBpZiBpdCdzIG5vdCBhbHJlYWR5IGFuIGFycmF5XG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGNhc3RBc0FycmF5ID0gYXJnID0+IHtcblx0ICBpZiAoIUFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHQgICAgYXJnID0gW2FyZ107XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGFyZztcblx0fTtcblx0LyoqXG5cdCAqIEdldCB0aGUgY2xvc2VzdCBub2RlIHRvIHRoZSBldnQudGFyZ2V0IG1hdGNoaW5nIHRoZSBzZWxlY3RvclxuXHQgKiBTdG9wcyBhdCB3cmFwcGVyXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IHBhcmVudE1hdGNoID0gKHRhcmdldCwgc2VsZWN0b3IsIHdyYXBwZXIpID0+IHtcblx0ICBpZiAod3JhcHBlciAmJiAhd3JhcHBlci5jb250YWlucyh0YXJnZXQpKSB7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXG5cdCAgd2hpbGUgKHRhcmdldCAmJiB0YXJnZXQubWF0Y2hlcykge1xuXHQgICAgaWYgKHRhcmdldC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuXHQgICAgICByZXR1cm4gdGFyZ2V0O1xuXHQgICAgfVxuXG5cdCAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcblx0ICB9XG5cdH07XG5cdC8qKlxuXHQgKiBHZXQgdGhlIGZpcnN0IG9yIGxhc3QgaXRlbSBmcm9tIGFuIGFycmF5XG5cdCAqXG5cdCAqID4gMCAtIHJpZ2h0IChsYXN0KVxuXHQgKiA8PSAwIC0gbGVmdCAoZmlyc3QpXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGdldFRhaWwgPSAobGlzdCwgZGlyZWN0aW9uID0gMCkgPT4ge1xuXHQgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG5cdCAgICByZXR1cm4gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdO1xuXHQgIH1cblxuXHQgIHJldHVybiBsaXN0WzBdO1xuXHR9O1xuXHQvKipcblx0ICogUmV0dXJuIHRydWUgaWYgYW4gb2JqZWN0IGlzIGVtcHR5XG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGlzRW1wdHlPYmplY3QgPSBvYmogPT4ge1xuXHQgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcblx0fTtcblx0LyoqXG5cdCAqIEdldCB0aGUgaW5kZXggb2YgYW4gZWxlbWVudCBhbW9uZ3N0IHNpYmxpbmcgbm9kZXMgb2YgdGhlIHNhbWUgdHlwZVxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBub2RlSW5kZXggPSAoZWwsIGFtb25nc3QpID0+IHtcblx0ICBpZiAoIWVsKSByZXR1cm4gLTE7XG5cdCAgYW1vbmdzdCA9IGFtb25nc3QgfHwgZWwubm9kZU5hbWU7XG5cdCAgdmFyIGkgPSAwO1xuXG5cdCAgd2hpbGUgKGVsID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZykge1xuXHQgICAgaWYgKGVsLm1hdGNoZXMoYW1vbmdzdCkpIHtcblx0ICAgICAgaSsrO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIHJldHVybiBpO1xuXHR9O1xuXHQvKipcblx0ICogU2V0IGF0dHJpYnV0ZXMgb2YgYW4gZWxlbWVudFxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBzZXRBdHRyID0gKGVsLCBhdHRycykgPT4ge1xuXHQgIGl0ZXJhdGUoYXR0cnMsICh2YWwsIGF0dHIpID0+IHtcblx0ICAgIGlmICh2YWwgPT0gbnVsbCkge1xuXHQgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ciwgJycgKyB2YWwpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXHQvKipcblx0ICogUmVwbGFjZSBhIG5vZGVcblx0ICovXG5cblx0Y29uc3QgcmVwbGFjZU5vZGUgPSAoZXhpc3RpbmcsIHJlcGxhY2VtZW50KSA9PiB7XG5cdCAgaWYgKGV4aXN0aW5nLnBhcmVudE5vZGUpIGV4aXN0aW5nLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHJlcGxhY2VtZW50LCBleGlzdGluZyk7XG5cdH07XG5cblx0LyoqXG5cdCAqIGhpZ2hsaWdodCB2MyB8IE1JVCBsaWNlbnNlIHwgSm9oYW5uIEJ1cmthcmQgPGpiQGVhaW8uY29tPlxuXHQgKiBIaWdobGlnaHRzIGFyYml0cmFyeSB0ZXJtcyBpbiBhIG5vZGUuXG5cdCAqXG5cdCAqIC0gTW9kaWZpZWQgYnkgTWFyc2hhbCA8YmVhdGdhdGVzQGdtYWlsLmNvbT4gMjAxMS02LTI0IChhZGRlZCByZWdleClcblx0ICogLSBNb2RpZmllZCBieSBCcmlhbiBSZWF2aXMgPGJyaWFuQHRoaXJkcm91dGUuY29tPiAyMDEyLTgtMjcgKGNsZWFudXApXG5cdCAqL1xuXHRjb25zdCBoaWdobGlnaHQgPSAoZWxlbWVudCwgcmVnZXgpID0+IHtcblx0ICBpZiAocmVnZXggPT09IG51bGwpIHJldHVybjsgLy8gY29udmV0IHN0cmluZyB0byByZWdleFxuXG5cdCAgaWYgKHR5cGVvZiByZWdleCA9PT0gJ3N0cmluZycpIHtcblx0ICAgIGlmICghcmVnZXgubGVuZ3RoKSByZXR1cm47XG5cdCAgICByZWdleCA9IG5ldyBSZWdFeHAocmVnZXgsICdpJyk7XG5cdCAgfSAvLyBXcmFwIG1hdGNoaW5nIHBhcnQgb2YgdGV4dCBub2RlIHdpdGggaGlnaGxpZ2h0aW5nIDxzcGFuPiwgZS5nLlxuXHQgIC8vIFNvY2NlciAgLT4gIDxzcGFuIGNsYXNzPVwiaGlnaGxpZ2h0XCI+U29jPC9zcGFuPmNlciAgZm9yIHJlZ2V4ID0gL3NvYy9pXG5cblxuXHQgIGNvbnN0IGhpZ2hsaWdodFRleHQgPSBub2RlID0+IHtcblx0ICAgIHZhciBtYXRjaCA9IG5vZGUuZGF0YS5tYXRjaChyZWdleCk7XG5cblx0ICAgIGlmIChtYXRjaCAmJiBub2RlLmRhdGEubGVuZ3RoID4gMCkge1xuXHQgICAgICB2YXIgc3Bhbm5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdCAgICAgIHNwYW5ub2RlLmNsYXNzTmFtZSA9ICdoaWdobGlnaHQnO1xuXHQgICAgICB2YXIgbWlkZGxlYml0ID0gbm9kZS5zcGxpdFRleHQobWF0Y2guaW5kZXgpO1xuXHQgICAgICBtaWRkbGViaXQuc3BsaXRUZXh0KG1hdGNoWzBdLmxlbmd0aCk7XG5cdCAgICAgIHZhciBtaWRkbGVjbG9uZSA9IG1pZGRsZWJpdC5jbG9uZU5vZGUodHJ1ZSk7XG5cdCAgICAgIHNwYW5ub2RlLmFwcGVuZENoaWxkKG1pZGRsZWNsb25lKTtcblx0ICAgICAgcmVwbGFjZU5vZGUobWlkZGxlYml0LCBzcGFubm9kZSk7XG5cdCAgICAgIHJldHVybiAxO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gMDtcblx0ICB9OyAvLyBSZWN1cnNlIGVsZW1lbnQgbm9kZSwgbG9va2luZyBmb3IgY2hpbGQgdGV4dCBub2RlcyB0byBoaWdobGlnaHQsIHVubGVzcyBlbGVtZW50XG5cdCAgLy8gaXMgY2hpbGRsZXNzLCA8c2NyaXB0PiwgPHN0eWxlPiwgb3IgYWxyZWFkeSBoaWdobGlnaHRlZDogPHNwYW4gY2xhc3M9XCJoaWdodGxpZ2h0XCI+XG5cblxuXHQgIGNvbnN0IGhpZ2hsaWdodENoaWxkcmVuID0gbm9kZSA9PiB7XG5cdCAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSAmJiBub2RlLmNoaWxkTm9kZXMgJiYgIS8oc2NyaXB0fHN0eWxlKS9pLnRlc3Qobm9kZS50YWdOYW1lKSAmJiAobm9kZS5jbGFzc05hbWUgIT09ICdoaWdobGlnaHQnIHx8IG5vZGUudGFnTmFtZSAhPT0gJ1NQQU4nKSkge1xuXHQgICAgICBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykuZm9yRWFjaChlbGVtZW50ID0+IHtcblx0ICAgICAgICBoaWdobGlnaHRSZWN1cnNpdmUoZWxlbWVudCk7XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICBjb25zdCBoaWdobGlnaHRSZWN1cnNpdmUgPSBub2RlID0+IHtcblx0ICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG5cdCAgICAgIHJldHVybiBoaWdobGlnaHRUZXh0KG5vZGUpO1xuXHQgICAgfVxuXG5cdCAgICBoaWdobGlnaHRDaGlsZHJlbihub2RlKTtcblx0ICAgIHJldHVybiAwO1xuXHQgIH07XG5cblx0ICBoaWdobGlnaHRSZWN1cnNpdmUoZWxlbWVudCk7XG5cdH07XG5cdC8qKlxuXHQgKiByZW1vdmVIaWdobGlnaHQgZm4gY29waWVkIGZyb20gaGlnaGxpZ2h0IHY1IGFuZFxuXHQgKiBlZGl0ZWQgdG8gcmVtb3ZlIHdpdGgoKSwgcGFzcyBqcyBzdHJpY3QgbW9kZSwgYW5kIHVzZSB3aXRob3V0IGpxdWVyeVxuXHQgKi9cblxuXHRjb25zdCByZW1vdmVIaWdobGlnaHQgPSBlbCA9PiB7XG5cdCAgdmFyIGVsZW1lbnRzID0gZWwucXVlcnlTZWxlY3RvckFsbChcInNwYW4uaGlnaGxpZ2h0XCIpO1xuXHQgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZWxlbWVudHMsIGZ1bmN0aW9uIChlbCkge1xuXHQgICAgdmFyIHBhcmVudCA9IGVsLnBhcmVudE5vZGU7XG5cdCAgICBwYXJlbnQucmVwbGFjZUNoaWxkKGVsLmZpcnN0Q2hpbGQsIGVsKTtcblx0ICAgIHBhcmVudC5ub3JtYWxpemUoKTtcblx0ICB9KTtcblx0fTtcblxuXHRjb25zdCBLRVlfQSA9IDY1O1xuXHRjb25zdCBLRVlfUkVUVVJOID0gMTM7XG5cdGNvbnN0IEtFWV9FU0MgPSAyNztcblx0Y29uc3QgS0VZX0xFRlQgPSAzNztcblx0Y29uc3QgS0VZX1VQID0gMzg7XG5cdGNvbnN0IEtFWV9SSUdIVCA9IDM5O1xuXHRjb25zdCBLRVlfRE9XTiA9IDQwO1xuXHRjb25zdCBLRVlfQkFDS1NQQUNFID0gODtcblx0Y29uc3QgS0VZX0RFTEVURSA9IDQ2O1xuXHRjb25zdCBLRVlfVEFCID0gOTtcblx0Y29uc3QgSVNfTUFDID0gdHlwZW9mIG5hdmlnYXRvciA9PT0gJ3VuZGVmaW5lZCcgPyBmYWxzZSA6IC9NYWMvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cdGNvbnN0IEtFWV9TSE9SVENVVCA9IElTX01BQyA/ICdtZXRhS2V5JyA6ICdjdHJsS2V5JzsgLy8gY3RybCBrZXkgb3IgYXBwbGUga2V5IGZvciBtYVxuXG5cdHZhciBkZWZhdWx0cyA9IHtcblx0ICBvcHRpb25zOiBbXSxcblx0ICBvcHRncm91cHM6IFtdLFxuXHQgIHBsdWdpbnM6IFtdLFxuXHQgIGRlbGltaXRlcjogJywnLFxuXHQgIHNwbGl0T246IG51bGwsXG5cdCAgLy8gcmVnZXhwIG9yIHN0cmluZyBmb3Igc3BsaXR0aW5nIHVwIHZhbHVlcyBmcm9tIGEgcGFzdGUgY29tbWFuZFxuXHQgIHBlcnNpc3Q6IHRydWUsXG5cdCAgZGlhY3JpdGljczogdHJ1ZSxcblx0ICBjcmVhdGU6IG51bGwsXG5cdCAgY3JlYXRlT25CbHVyOiBmYWxzZSxcblx0ICBjcmVhdGVGaWx0ZXI6IG51bGwsXG5cdCAgaGlnaGxpZ2h0OiB0cnVlLFxuXHQgIG9wZW5PbkZvY3VzOiB0cnVlLFxuXHQgIHNob3VsZE9wZW46IG51bGwsXG5cdCAgbWF4T3B0aW9uczogNTAsXG5cdCAgbWF4SXRlbXM6IG51bGwsXG5cdCAgaGlkZVNlbGVjdGVkOiBudWxsLFxuXHQgIGR1cGxpY2F0ZXM6IGZhbHNlLFxuXHQgIGFkZFByZWNlZGVuY2U6IGZhbHNlLFxuXHQgIHNlbGVjdE9uVGFiOiBmYWxzZSxcblx0ICBwcmVsb2FkOiBudWxsLFxuXHQgIGFsbG93RW1wdHlPcHRpb246IGZhbHNlLFxuXHQgIC8vY2xvc2VBZnRlclNlbGVjdDogZmFsc2UsXG5cdCAgbG9hZFRocm90dGxlOiAzMDAsXG5cdCAgbG9hZGluZ0NsYXNzOiAnbG9hZGluZycsXG5cdCAgZGF0YUF0dHI6IG51bGwsXG5cdCAgLy8nZGF0YS1kYXRhJyxcblx0ICBvcHRncm91cEZpZWxkOiAnb3B0Z3JvdXAnLFxuXHQgIHZhbHVlRmllbGQ6ICd2YWx1ZScsXG5cdCAgbGFiZWxGaWVsZDogJ3RleHQnLFxuXHQgIGRpc2FibGVkRmllbGQ6ICdkaXNhYmxlZCcsXG5cdCAgb3B0Z3JvdXBMYWJlbEZpZWxkOiAnbGFiZWwnLFxuXHQgIG9wdGdyb3VwVmFsdWVGaWVsZDogJ3ZhbHVlJyxcblx0ICBsb2NrT3B0Z3JvdXBPcmRlcjogZmFsc2UsXG5cdCAgc29ydEZpZWxkOiAnJG9yZGVyJyxcblx0ICBzZWFyY2hGaWVsZDogWyd0ZXh0J10sXG5cdCAgc2VhcmNoQ29uanVuY3Rpb246ICdhbmQnLFxuXHQgIG1vZGU6IG51bGwsXG5cdCAgd3JhcHBlckNsYXNzOiAndHMtd3JhcHBlcicsXG5cdCAgY29udHJvbENsYXNzOiAndHMtY29udHJvbCcsXG5cdCAgZHJvcGRvd25DbGFzczogJ3RzLWRyb3Bkb3duJyxcblx0ICBkcm9wZG93bkNvbnRlbnRDbGFzczogJ3RzLWRyb3Bkb3duLWNvbnRlbnQnLFxuXHQgIGl0ZW1DbGFzczogJ2l0ZW0nLFxuXHQgIG9wdGlvbkNsYXNzOiAnb3B0aW9uJyxcblx0ICBkcm9wZG93blBhcmVudDogbnVsbCxcblx0ICBjb250cm9sSW5wdXQ6ICc8aW5wdXQgdHlwZT1cInRleHRcIiBhdXRvY29tcGxldGU9XCJvZmZcIiBzaXplPVwiMVwiIC8+Jyxcblx0ICBjb3B5Q2xhc3Nlc1RvRHJvcGRvd246IGZhbHNlLFxuXHQgIHBsYWNlaG9sZGVyOiBudWxsLFxuXHQgIGhpZGVQbGFjZWhvbGRlcjogbnVsbCxcblx0ICBzaG91bGRMb2FkOiBmdW5jdGlvbiAocXVlcnkpIHtcblx0ICAgIHJldHVybiBxdWVyeS5sZW5ndGggPiAwO1xuXHQgIH0sXG5cblx0ICAvKlxuXHQgIGxvYWQgICAgICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24ocXVlcnksIGNhbGxiYWNrKSB7IC4uLiB9XG5cdCAgc2NvcmUgICAgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbihzZWFyY2gpIHsgLi4uIH1cblx0ICBvbkluaXRpYWxpemUgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKCkgeyAuLi4gfVxuXHQgIG9uQ2hhbmdlICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUpIHsgLi4uIH1cblx0ICBvbkl0ZW1BZGQgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHZhbHVlLCAkaXRlbSkgeyAuLi4gfVxuXHQgIG9uSXRlbVJlbW92ZSAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUpIHsgLi4uIH1cblx0ICBvbkNsZWFyICAgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKCkgeyAuLi4gfVxuXHQgIG9uT3B0aW9uQWRkICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUsIGRhdGEpIHsgLi4uIH1cblx0ICBvbk9wdGlvblJlbW92ZSAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHZhbHVlKSB7IC4uLiB9XG5cdCAgb25PcHRpb25DbGVhciAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbigpIHsgLi4uIH1cblx0ICBvbk9wdGlvbkdyb3VwQWRkICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKGlkLCBkYXRhKSB7IC4uLiB9XG5cdCAgb25PcHRpb25Hcm91cFJlbW92ZSAgOiBudWxsLCAvLyBmdW5jdGlvbihpZCkgeyAuLi4gfVxuXHQgIG9uT3B0aW9uR3JvdXBDbGVhciAgIDogbnVsbCwgLy8gZnVuY3Rpb24oKSB7IC4uLiB9XG5cdCAgb25Ecm9wZG93bk9wZW4gICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbihkcm9wZG93bikgeyAuLi4gfVxuXHQgIG9uRHJvcGRvd25DbG9zZSAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oZHJvcGRvd24pIHsgLi4uIH1cblx0ICBvblR5cGUgICAgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHN0cikgeyAuLi4gfVxuXHQgIG9uRGVsZXRlICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWVzKSB7IC4uLiB9XG5cdCAgKi9cblx0ICByZW5kZXI6IHtcblx0ICAgIC8qXG5cdCAgICBpdGVtOiBudWxsLFxuXHQgICAgb3B0Z3JvdXA6IG51bGwsXG5cdCAgICBvcHRncm91cF9oZWFkZXI6IG51bGwsXG5cdCAgICBvcHRpb246IG51bGwsXG5cdCAgICBvcHRpb25fY3JlYXRlOiBudWxsXG5cdCAgICAqL1xuXHQgIH1cblx0fTtcblxuXHQvKipcblx0ICogQ29udmVydHMgYSBzY2FsYXIgdG8gaXRzIGJlc3Qgc3RyaW5nIHJlcHJlc2VudGF0aW9uXG5cdCAqIGZvciBoYXNoIGtleXMgYW5kIEhUTUwgYXR0cmlidXRlIHZhbHVlcy5cblx0ICpcblx0ICogVHJhbnNmb3JtYXRpb25zOlxuXHQgKiAgICdzdHInICAgICAtPiAnc3RyJ1xuXHQgKiAgIG51bGwgICAgICAtPiAnJ1xuXHQgKiAgIHVuZGVmaW5lZCAtPiAnJ1xuXHQgKiAgIHRydWUgICAgICAtPiAnMSdcblx0ICogICBmYWxzZSAgICAgLT4gJzAnXG5cdCAqICAgMCAgICAgICAgIC0+ICcwJ1xuXHQgKiAgIDEgICAgICAgICAtPiAnMSdcblx0ICpcblx0ICovXG5cdGNvbnN0IGhhc2hfa2V5ID0gdmFsdWUgPT4ge1xuXHQgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm4gbnVsbDtcblx0ICByZXR1cm4gZ2V0X2hhc2godmFsdWUpO1xuXHR9O1xuXHRjb25zdCBnZXRfaGFzaCA9IHZhbHVlID0+IHtcblx0ICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHJldHVybiB2YWx1ZSA/ICcxJyA6ICcwJztcblx0ICByZXR1cm4gdmFsdWUgKyAnJztcblx0fTtcblx0LyoqXG5cdCAqIEVzY2FwZXMgYSBzdHJpbmcgZm9yIHVzZSB3aXRoaW4gSFRNTC5cblx0ICpcblx0ICovXG5cblx0Y29uc3QgZXNjYXBlX2h0bWwgPSBzdHIgPT4ge1xuXHQgIHJldHVybiAoc3RyICsgJycpLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG5cdH07XG5cdC8qKlxuXHQgKiBEZWJvdW5jZSB0aGUgdXNlciBwcm92aWRlZCBsb2FkIGZ1bmN0aW9uXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGxvYWREZWJvdW5jZSA9IChmbiwgZGVsYXkpID0+IHtcblx0ICB2YXIgdGltZW91dDtcblx0ICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlLCBjYWxsYmFjaykge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAodGltZW91dCkge1xuXHQgICAgICBzZWxmLmxvYWRpbmcgPSBNYXRoLm1heChzZWxmLmxvYWRpbmcgLSAxLCAwKTtcblx0ICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHQgICAgfVxuXG5cdCAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdCAgICAgIHRpbWVvdXQgPSBudWxsO1xuXHQgICAgICBzZWxmLmxvYWRlZFNlYXJjaGVzW3ZhbHVlXSA9IHRydWU7XG5cdCAgICAgIGZuLmNhbGwoc2VsZiwgdmFsdWUsIGNhbGxiYWNrKTtcblx0ICAgIH0sIGRlbGF5KTtcblx0ICB9O1xuXHR9O1xuXHQvKipcblx0ICogRGVib3VuY2UgYWxsIGZpcmVkIGV2ZW50cyB0eXBlcyBsaXN0ZWQgaW4gYHR5cGVzYFxuXHQgKiB3aGlsZSBleGVjdXRpbmcgdGhlIHByb3ZpZGVkIGBmbmAuXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGRlYm91bmNlX2V2ZW50cyA9IChzZWxmLCB0eXBlcywgZm4pID0+IHtcblx0ICB2YXIgdHlwZTtcblx0ICB2YXIgdHJpZ2dlciA9IHNlbGYudHJpZ2dlcjtcblx0ICB2YXIgZXZlbnRfYXJncyA9IHt9OyAvLyBvdmVycmlkZSB0cmlnZ2VyIG1ldGhvZFxuXG5cdCAgc2VsZi50cmlnZ2VyID0gZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIHR5cGUgPSBhcmd1bWVudHNbMF07XG5cblx0ICAgIGlmICh0eXBlcy5pbmRleE9mKHR5cGUpICE9PSAtMSkge1xuXHQgICAgICBldmVudF9hcmdzW3R5cGVdID0gYXJndW1lbnRzO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuIHRyaWdnZXIuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblx0ICAgIH1cblx0ICB9OyAvLyBpbnZva2UgcHJvdmlkZWQgZnVuY3Rpb25cblxuXG5cdCAgZm4uYXBwbHkoc2VsZiwgW10pO1xuXHQgIHNlbGYudHJpZ2dlciA9IHRyaWdnZXI7IC8vIHRyaWdnZXIgcXVldWVkIGV2ZW50c1xuXG5cdCAgZm9yICh0eXBlIG9mIHR5cGVzKSB7XG5cdCAgICBpZiAodHlwZSBpbiBldmVudF9hcmdzKSB7XG5cdCAgICAgIHRyaWdnZXIuYXBwbHkoc2VsZiwgZXZlbnRfYXJnc1t0eXBlXSk7XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXHQvKipcblx0ICogRGV0ZXJtaW5lcyB0aGUgY3VycmVudCBzZWxlY3Rpb24gd2l0aGluIGEgdGV4dCBpbnB1dCBjb250cm9sLlxuXHQgKiBSZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nOlxuXHQgKiAgIC0gc3RhcnRcblx0ICogICAtIGxlbmd0aFxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBnZXRTZWxlY3Rpb24gPSBpbnB1dCA9PiB7XG5cdCAgcmV0dXJuIHtcblx0ICAgIHN0YXJ0OiBpbnB1dC5zZWxlY3Rpb25TdGFydCB8fCAwLFxuXHQgICAgbGVuZ3RoOiAoaW5wdXQuc2VsZWN0aW9uRW5kIHx8IDApIC0gKGlucHV0LnNlbGVjdGlvblN0YXJ0IHx8IDApXG5cdCAgfTtcblx0fTtcblx0LyoqXG5cdCAqIFByZXZlbnQgZGVmYXVsdFxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBwcmV2ZW50RGVmYXVsdCA9IChldnQsIHN0b3AgPSBmYWxzZSkgPT4ge1xuXHQgIGlmIChldnQpIHtcblx0ICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdCAgICBpZiAoc3RvcCkge1xuXHQgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXHQvKipcblx0ICogQWRkIGV2ZW50IGhlbHBlclxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBhZGRFdmVudCA9ICh0YXJnZXQsIHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKSA9PiB7XG5cdCAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXHR9O1xuXHQvKipcblx0ICogUmV0dXJuIHRydWUgaWYgdGhlIHJlcXVlc3RlZCBrZXkgaXMgZG93blxuXHQgKiBXaWxsIHJldHVybiBmYWxzZSBpZiBtb3JlIHRoYW4gb25lIGNvbnRyb2wgY2hhcmFjdGVyIGlzIHByZXNzZWQgKCB3aGVuIFtjdHJsK3NoaWZ0K2FdICE9IFtjdHJsK2FdIClcblx0ICogVGhlIGN1cnJlbnQgZXZ0IG1heSBub3QgYWx3YXlzIHNldCAoIGVnIGNhbGxpbmcgYWR2YW5jZVNlbGVjdGlvbigpIClcblx0ICpcblx0ICovXG5cblx0Y29uc3QgaXNLZXlEb3duID0gKGtleV9uYW1lLCBldnQpID0+IHtcblx0ICBpZiAoIWV2dCkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblxuXHQgIGlmICghZXZ0W2tleV9uYW1lXSkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblxuXHQgIHZhciBjb3VudCA9IChldnQuYWx0S2V5ID8gMSA6IDApICsgKGV2dC5jdHJsS2V5ID8gMSA6IDApICsgKGV2dC5zaGlmdEtleSA/IDEgOiAwKSArIChldnQubWV0YUtleSA/IDEgOiAwKTtcblxuXHQgIGlmIChjb3VudCA9PT0gMSkge1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGZhbHNlO1xuXHR9O1xuXHQvKipcblx0ICogR2V0IHRoZSBpZCBvZiBhbiBlbGVtZW50XG5cdCAqIElmIHRoZSBpZCBhdHRyaWJ1dGUgaXMgbm90IHNldCwgc2V0IHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gaWRcblx0ICpcblx0ICovXG5cblx0Y29uc3QgZ2V0SWQgPSAoZWwsIGlkKSA9PiB7XG5cdCAgY29uc3QgZXhpc3RpbmdfaWQgPSBlbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cblx0ICBpZiAoZXhpc3RpbmdfaWQpIHtcblx0ICAgIHJldHVybiBleGlzdGluZ19pZDtcblx0ICB9XG5cblx0ICBlbC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuXHQgIHJldHVybiBpZDtcblx0fTtcblx0LyoqXG5cdCAqIFJldHVybnMgYSBzdHJpbmcgd2l0aCBiYWNrc2xhc2hlcyBhZGRlZCBiZWZvcmUgY2hhcmFjdGVycyB0aGF0IG5lZWQgdG8gYmUgZXNjYXBlZC5cblx0ICovXG5cblx0Y29uc3QgYWRkU2xhc2hlcyA9IHN0ciA9PiB7XG5cdCAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFxcXFwiJ10vZywgJ1xcXFwkJicpO1xuXHR9O1xuXHQvKipcblx0ICpcblx0ICovXG5cblx0Y29uc3QgYXBwZW5kID0gKHBhcmVudCwgbm9kZSkgPT4ge1xuXHQgIGlmIChub2RlKSBwYXJlbnQuYXBwZW5kKG5vZGUpO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGdldFNldHRpbmdzKGlucHV0LCBzZXR0aW5nc191c2VyKSB7XG5cdCAgdmFyIHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIHNldHRpbmdzX3VzZXIpO1xuXHQgIHZhciBhdHRyX2RhdGEgPSBzZXR0aW5ncy5kYXRhQXR0cjtcblx0ICB2YXIgZmllbGRfbGFiZWwgPSBzZXR0aW5ncy5sYWJlbEZpZWxkO1xuXHQgIHZhciBmaWVsZF92YWx1ZSA9IHNldHRpbmdzLnZhbHVlRmllbGQ7XG5cdCAgdmFyIGZpZWxkX2Rpc2FibGVkID0gc2V0dGluZ3MuZGlzYWJsZWRGaWVsZDtcblx0ICB2YXIgZmllbGRfb3B0Z3JvdXAgPSBzZXR0aW5ncy5vcHRncm91cEZpZWxkO1xuXHQgIHZhciBmaWVsZF9vcHRncm91cF9sYWJlbCA9IHNldHRpbmdzLm9wdGdyb3VwTGFiZWxGaWVsZDtcblx0ICB2YXIgZmllbGRfb3B0Z3JvdXBfdmFsdWUgPSBzZXR0aW5ncy5vcHRncm91cFZhbHVlRmllbGQ7XG5cdCAgdmFyIHRhZ19uYW1lID0gaW5wdXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgIHZhciBwbGFjZWhvbGRlciA9IGlucHV0LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKSB8fCBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXInKTtcblxuXHQgIGlmICghcGxhY2Vob2xkZXIgJiYgIXNldHRpbmdzLmFsbG93RW1wdHlPcHRpb24pIHtcblx0ICAgIGxldCBvcHRpb24gPSBpbnB1dC5xdWVyeVNlbGVjdG9yKCdvcHRpb25bdmFsdWU9XCJcIl0nKTtcblxuXHQgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICBwbGFjZWhvbGRlciA9IG9wdGlvbi50ZXh0Q29udGVudDtcblx0ICAgIH1cblx0ICB9XG5cblx0ICB2YXIgc2V0dGluZ3NfZWxlbWVudCA9IHtcblx0ICAgIHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlcixcblx0ICAgIG9wdGlvbnM6IFtdLFxuXHQgICAgb3B0Z3JvdXBzOiBbXSxcblx0ICAgIGl0ZW1zOiBbXSxcblx0ICAgIG1heEl0ZW1zOiBudWxsXG5cdCAgfTtcblx0ICAvKipcblx0ICAgKiBJbml0aWFsaXplIGZyb20gYSA8c2VsZWN0PiBlbGVtZW50LlxuXHQgICAqXG5cdCAgICovXG5cblx0ICB2YXIgaW5pdF9zZWxlY3QgPSAoKSA9PiB7XG5cdCAgICB2YXIgdGFnTmFtZTtcblx0ICAgIHZhciBvcHRpb25zID0gc2V0dGluZ3NfZWxlbWVudC5vcHRpb25zO1xuXHQgICAgdmFyIG9wdGlvbnNNYXAgPSB7fTtcblx0ICAgIHZhciBncm91cF9jb3VudCA9IDE7XG5cblx0ICAgIHZhciByZWFkRGF0YSA9IGVsID0+IHtcblx0ICAgICAgdmFyIGRhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBlbC5kYXRhc2V0KTsgLy8gZ2V0IHBsYWluIG9iamVjdCBmcm9tIERPTVN0cmluZ01hcFxuXG5cdCAgICAgIHZhciBqc29uID0gYXR0cl9kYXRhICYmIGRhdGFbYXR0cl9kYXRhXTtcblxuXHQgICAgICBpZiAodHlwZW9mIGpzb24gPT09ICdzdHJpbmcnICYmIGpzb24ubGVuZ3RoKSB7XG5cdCAgICAgICAgZGF0YSA9IE9iamVjdC5hc3NpZ24oZGF0YSwgSlNPTi5wYXJzZShqc29uKSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gZGF0YTtcblx0ICAgIH07XG5cblx0ICAgIHZhciBhZGRPcHRpb24gPSAob3B0aW9uLCBncm91cCkgPT4ge1xuXHQgICAgICB2YXIgdmFsdWUgPSBoYXNoX2tleShvcHRpb24udmFsdWUpO1xuXHQgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuO1xuXHQgICAgICBpZiAoIXZhbHVlICYmICFzZXR0aW5ncy5hbGxvd0VtcHR5T3B0aW9uKSByZXR1cm47IC8vIGlmIHRoZSBvcHRpb24gYWxyZWFkeSBleGlzdHMsIGl0J3MgcHJvYmFibHkgYmVlblxuXHQgICAgICAvLyBkdXBsaWNhdGVkIGluIGFub3RoZXIgb3B0Z3JvdXAuIGluIHRoaXMgY2FzZSwgcHVzaFxuXHQgICAgICAvLyB0aGUgY3VycmVudCBncm91cCB0byB0aGUgXCJvcHRncm91cFwiIHByb3BlcnR5IG9uIHRoZVxuXHQgICAgICAvLyBleGlzdGluZyBvcHRpb24gc28gdGhhdCBpdCdzIHJlbmRlcmVkIGluIGJvdGggcGxhY2VzLlxuXG5cdCAgICAgIGlmIChvcHRpb25zTWFwLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuXHQgICAgICAgIGlmIChncm91cCkge1xuXHQgICAgICAgICAgdmFyIGFyciA9IG9wdGlvbnNNYXBbdmFsdWVdW2ZpZWxkX29wdGdyb3VwXTtcblxuXHQgICAgICAgICAgaWYgKCFhcnIpIHtcblx0ICAgICAgICAgICAgb3B0aW9uc01hcFt2YWx1ZV1bZmllbGRfb3B0Z3JvdXBdID0gZ3JvdXA7XG5cdCAgICAgICAgICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcblx0ICAgICAgICAgICAgb3B0aW9uc01hcFt2YWx1ZV1bZmllbGRfb3B0Z3JvdXBdID0gW2FyciwgZ3JvdXBdO1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgYXJyLnB1c2goZ3JvdXApO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgb3B0aW9uX2RhdGEgPSByZWFkRGF0YShvcHRpb24pO1xuXHQgICAgICAgIG9wdGlvbl9kYXRhW2ZpZWxkX2xhYmVsXSA9IG9wdGlvbl9kYXRhW2ZpZWxkX2xhYmVsXSB8fCBvcHRpb24udGV4dENvbnRlbnQ7XG5cdCAgICAgICAgb3B0aW9uX2RhdGFbZmllbGRfdmFsdWVdID0gb3B0aW9uX2RhdGFbZmllbGRfdmFsdWVdIHx8IHZhbHVlO1xuXHQgICAgICAgIG9wdGlvbl9kYXRhW2ZpZWxkX2Rpc2FibGVkXSA9IG9wdGlvbl9kYXRhW2ZpZWxkX2Rpc2FibGVkXSB8fCBvcHRpb24uZGlzYWJsZWQ7XG5cdCAgICAgICAgb3B0aW9uX2RhdGFbZmllbGRfb3B0Z3JvdXBdID0gb3B0aW9uX2RhdGFbZmllbGRfb3B0Z3JvdXBdIHx8IGdyb3VwO1xuXHQgICAgICAgIG9wdGlvbl9kYXRhLiRvcHRpb24gPSBvcHRpb247XG5cdCAgICAgICAgb3B0aW9uc01hcFt2YWx1ZV0gPSBvcHRpb25fZGF0YTtcblx0ICAgICAgICBvcHRpb25zLnB1c2gob3B0aW9uX2RhdGEpO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuXHQgICAgICAgIHNldHRpbmdzX2VsZW1lbnQuaXRlbXMucHVzaCh2YWx1ZSk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIHZhciBhZGRHcm91cCA9IG9wdGdyb3VwID0+IHtcblx0ICAgICAgdmFyIGlkLCBvcHRncm91cF9kYXRhO1xuXHQgICAgICBvcHRncm91cF9kYXRhID0gcmVhZERhdGEob3B0Z3JvdXApO1xuXHQgICAgICBvcHRncm91cF9kYXRhW2ZpZWxkX29wdGdyb3VwX2xhYmVsXSA9IG9wdGdyb3VwX2RhdGFbZmllbGRfb3B0Z3JvdXBfbGFiZWxdIHx8IG9wdGdyb3VwLmdldEF0dHJpYnV0ZSgnbGFiZWwnKSB8fCAnJztcblx0ICAgICAgb3B0Z3JvdXBfZGF0YVtmaWVsZF9vcHRncm91cF92YWx1ZV0gPSBvcHRncm91cF9kYXRhW2ZpZWxkX29wdGdyb3VwX3ZhbHVlXSB8fCBncm91cF9jb3VudCsrO1xuXHQgICAgICBvcHRncm91cF9kYXRhW2ZpZWxkX2Rpc2FibGVkXSA9IG9wdGdyb3VwX2RhdGFbZmllbGRfZGlzYWJsZWRdIHx8IG9wdGdyb3VwLmRpc2FibGVkO1xuXHQgICAgICBzZXR0aW5nc19lbGVtZW50Lm9wdGdyb3Vwcy5wdXNoKG9wdGdyb3VwX2RhdGEpO1xuXHQgICAgICBpZCA9IG9wdGdyb3VwX2RhdGFbZmllbGRfb3B0Z3JvdXBfdmFsdWVdO1xuXHQgICAgICBpdGVyYXRlKG9wdGdyb3VwLmNoaWxkcmVuLCBvcHRpb24gPT4ge1xuXHQgICAgICAgIGFkZE9wdGlvbihvcHRpb24sIGlkKTtcblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXG5cdCAgICBzZXR0aW5nc19lbGVtZW50Lm1heEl0ZW1zID0gaW5wdXQuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpID8gbnVsbCA6IDE7XG5cdCAgICBpdGVyYXRlKGlucHV0LmNoaWxkcmVuLCBjaGlsZCA9PiB7XG5cdCAgICAgIHRhZ05hbWUgPSBjaGlsZC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0ICAgICAgaWYgKHRhZ05hbWUgPT09ICdvcHRncm91cCcpIHtcblx0ICAgICAgICBhZGRHcm91cChjaGlsZCk7XG5cdCAgICAgIH0gZWxzZSBpZiAodGFnTmFtZSA9PT0gJ29wdGlvbicpIHtcblx0ICAgICAgICBhZGRPcHRpb24oY2hpbGQpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9O1xuXHQgIC8qKlxuXHQgICAqIEluaXRpYWxpemUgZnJvbSBhIDxpbnB1dCB0eXBlPVwidGV4dFwiPiBlbGVtZW50LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHZhciBpbml0X3RleHRib3ggPSAoKSA9PiB7XG5cdCAgICBjb25zdCBkYXRhX3JhdyA9IGlucHV0LmdldEF0dHJpYnV0ZShhdHRyX2RhdGEpO1xuXG5cdCAgICBpZiAoIWRhdGFfcmF3KSB7XG5cdCAgICAgIHZhciB2YWx1ZSA9IGlucHV0LnZhbHVlLnRyaW0oKSB8fCAnJztcblx0ICAgICAgaWYgKCFzZXR0aW5ncy5hbGxvd0VtcHR5T3B0aW9uICYmICF2YWx1ZS5sZW5ndGgpIHJldHVybjtcblx0ICAgICAgY29uc3QgdmFsdWVzID0gdmFsdWUuc3BsaXQoc2V0dGluZ3MuZGVsaW1pdGVyKTtcblx0ICAgICAgaXRlcmF0ZSh2YWx1ZXMsIHZhbHVlID0+IHtcblx0ICAgICAgICBjb25zdCBvcHRpb24gPSB7fTtcblx0ICAgICAgICBvcHRpb25bZmllbGRfbGFiZWxdID0gdmFsdWU7XG5cdCAgICAgICAgb3B0aW9uW2ZpZWxkX3ZhbHVlXSA9IHZhbHVlO1xuXHQgICAgICAgIHNldHRpbmdzX2VsZW1lbnQub3B0aW9ucy5wdXNoKG9wdGlvbik7XG5cdCAgICAgIH0pO1xuXHQgICAgICBzZXR0aW5nc19lbGVtZW50Lml0ZW1zID0gdmFsdWVzO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2V0dGluZ3NfZWxlbWVudC5vcHRpb25zID0gSlNPTi5wYXJzZShkYXRhX3Jhdyk7XG5cdCAgICAgIGl0ZXJhdGUoc2V0dGluZ3NfZWxlbWVudC5vcHRpb25zLCBvcHQgPT4ge1xuXHQgICAgICAgIHNldHRpbmdzX2VsZW1lbnQuaXRlbXMucHVzaChvcHRbZmllbGRfdmFsdWVdKTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIGlmICh0YWdfbmFtZSA9PT0gJ3NlbGVjdCcpIHtcblx0ICAgIGluaXRfc2VsZWN0KCk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGluaXRfdGV4dGJveCgpO1xuXHQgIH1cblxuXHQgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgc2V0dGluZ3NfZWxlbWVudCwgc2V0dGluZ3NfdXNlcik7XG5cdH1cblxuXHR2YXIgaW5zdGFuY2VfaSA9IDA7XG5cdGNsYXNzIFRvbVNlbGVjdCBleHRlbmRzIE1pY3JvUGx1Z2luKE1pY3JvRXZlbnQpIHtcblx0ICAvLyBAZGVwcmVjYXRlZCAxLjhcblx0ICBjb25zdHJ1Y3RvcihpbnB1dF9hcmcsIHVzZXJfc2V0dGluZ3MpIHtcblx0ICAgIHN1cGVyKCk7XG5cdCAgICB0aGlzLmNvbnRyb2xfaW5wdXQgPSB2b2lkIDA7XG5cdCAgICB0aGlzLndyYXBwZXIgPSB2b2lkIDA7XG5cdCAgICB0aGlzLmRyb3Bkb3duID0gdm9pZCAwO1xuXHQgICAgdGhpcy5jb250cm9sID0gdm9pZCAwO1xuXHQgICAgdGhpcy5kcm9wZG93bl9jb250ZW50ID0gdm9pZCAwO1xuXHQgICAgdGhpcy5mb2N1c19ub2RlID0gdm9pZCAwO1xuXHQgICAgdGhpcy5vcmRlciA9IDA7XG5cdCAgICB0aGlzLnNldHRpbmdzID0gdm9pZCAwO1xuXHQgICAgdGhpcy5pbnB1dCA9IHZvaWQgMDtcblx0ICAgIHRoaXMudGFiSW5kZXggPSB2b2lkIDA7XG5cdCAgICB0aGlzLmlzX3NlbGVjdF90YWcgPSB2b2lkIDA7XG5cdCAgICB0aGlzLnJ0bCA9IHZvaWQgMDtcblx0ICAgIHRoaXMuaW5wdXRJZCA9IHZvaWQgMDtcblx0ICAgIHRoaXMuX2Rlc3Ryb3kgPSB2b2lkIDA7XG5cdCAgICB0aGlzLnNpZnRlciA9IHZvaWQgMDtcblx0ICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG5cdCAgICB0aGlzLmlzRGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuaXNSZXF1aXJlZCA9IHZvaWQgMDtcblx0ICAgIHRoaXMuaXNJbnZhbGlkID0gZmFsc2U7XG5cdCAgICB0aGlzLmlzVmFsaWQgPSB0cnVlO1xuXHQgICAgdGhpcy5pc0xvY2tlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuaXNJbnB1dEhpZGRlbiA9IGZhbHNlO1xuXHQgICAgdGhpcy5pc1NldHVwID0gZmFsc2U7XG5cdCAgICB0aGlzLmlnbm9yZUZvY3VzID0gZmFsc2U7XG5cdCAgICB0aGlzLmlnbm9yZUhvdmVyID0gZmFsc2U7XG5cdCAgICB0aGlzLmhhc09wdGlvbnMgPSBmYWxzZTtcblx0ICAgIHRoaXMuY3VycmVudFJlc3VsdHMgPSB2b2lkIDA7XG5cdCAgICB0aGlzLmxhc3RWYWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5jYXJldFBvcyA9IDA7XG5cdCAgICB0aGlzLmxvYWRpbmcgPSAwO1xuXHQgICAgdGhpcy5sb2FkZWRTZWFyY2hlcyA9IHt9O1xuXHQgICAgdGhpcy5hY3RpdmVPcHRpb24gPSBudWxsO1xuXHQgICAgdGhpcy5hY3RpdmVJdGVtcyA9IFtdO1xuXHQgICAgdGhpcy5vcHRncm91cHMgPSB7fTtcblx0ICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuXHQgICAgdGhpcy51c2VyT3B0aW9ucyA9IHt9O1xuXHQgICAgdGhpcy5pdGVtcyA9IFtdO1xuXHQgICAgaW5zdGFuY2VfaSsrO1xuXHQgICAgdmFyIGRpcjtcblx0ICAgIHZhciBpbnB1dCA9IGdldERvbShpbnB1dF9hcmcpO1xuXG5cdCAgICBpZiAoaW5wdXQudG9tc2VsZWN0KSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVG9tIFNlbGVjdCBhbHJlYWR5IGluaXRpYWxpemVkIG9uIHRoaXMgZWxlbWVudCcpO1xuXHQgICAgfVxuXG5cdCAgICBpbnB1dC50b21zZWxlY3QgPSB0aGlzOyAvLyBkZXRlY3QgcnRsIGVudmlyb25tZW50XG5cblx0ICAgIHZhciBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUoaW5wdXQsIG51bGwpO1xuXHQgICAgZGlyID0gY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdkaXJlY3Rpb24nKTsgLy8gc2V0dXAgZGVmYXVsdCBzdGF0ZVxuXG5cdCAgICBjb25zdCBzZXR0aW5ncyA9IGdldFNldHRpbmdzKGlucHV0LCB1c2VyX3NldHRpbmdzKTtcblx0ICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcblx0ICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcblx0ICAgIHRoaXMudGFiSW5kZXggPSBpbnB1dC50YWJJbmRleCB8fCAwO1xuXHQgICAgdGhpcy5pc19zZWxlY3RfdGFnID0gaW5wdXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0Jztcblx0ICAgIHRoaXMucnRsID0gL3J0bC9pLnRlc3QoZGlyKTtcblx0ICAgIHRoaXMuaW5wdXRJZCA9IGdldElkKGlucHV0LCAndG9tc2VsZWN0LScgKyBpbnN0YW5jZV9pKTtcblx0ICAgIHRoaXMuaXNSZXF1aXJlZCA9IGlucHV0LnJlcXVpcmVkOyAvLyBzZWFyY2ggc3lzdGVtXG5cblx0ICAgIHRoaXMuc2lmdGVyID0gbmV3IFNpZnRlcih0aGlzLm9wdGlvbnMsIHtcblx0ICAgICAgZGlhY3JpdGljczogc2V0dGluZ3MuZGlhY3JpdGljc1xuXHQgICAgfSk7IC8vIG9wdGlvbi1kZXBlbmRlbnQgZGVmYXVsdHNcblxuXHQgICAgc2V0dGluZ3MubW9kZSA9IHNldHRpbmdzLm1vZGUgfHwgKHNldHRpbmdzLm1heEl0ZW1zID09PSAxID8gJ3NpbmdsZScgOiAnbXVsdGknKTtcblxuXHQgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5oaWRlU2VsZWN0ZWQgIT09ICdib29sZWFuJykge1xuXHQgICAgICBzZXR0aW5ncy5oaWRlU2VsZWN0ZWQgPSBzZXR0aW5ncy5tb2RlID09PSAnbXVsdGknO1xuXHQgICAgfVxuXG5cdCAgICBpZiAodHlwZW9mIHNldHRpbmdzLmhpZGVQbGFjZWhvbGRlciAhPT0gJ2Jvb2xlYW4nKSB7XG5cdCAgICAgIHNldHRpbmdzLmhpZGVQbGFjZWhvbGRlciA9IHNldHRpbmdzLm1vZGUgIT09ICdtdWx0aSc7XG5cdCAgICB9IC8vIHNldCB1cCBjcmVhdGVGaWx0ZXIgY2FsbGJhY2tcblxuXG5cdCAgICB2YXIgZmlsdGVyID0gc2V0dGluZ3MuY3JlYXRlRmlsdGVyO1xuXG5cdCAgICBpZiAodHlwZW9mIGZpbHRlciAhPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICBpZiAodHlwZW9mIGZpbHRlciA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgICBmaWx0ZXIgPSBuZXcgUmVnRXhwKGZpbHRlcik7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoZmlsdGVyIGluc3RhbmNlb2YgUmVnRXhwKSB7XG5cdCAgICAgICAgc2V0dGluZ3MuY3JlYXRlRmlsdGVyID0gaW5wdXQgPT4gZmlsdGVyLnRlc3QoaW5wdXQpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHNldHRpbmdzLmNyZWF0ZUZpbHRlciA9IHZhbHVlID0+IHtcblx0ICAgICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmR1cGxpY2F0ZXMgfHwgIXRoaXMub3B0aW9uc1t2YWx1ZV07XG5cdCAgICAgICAgfTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICB0aGlzLmluaXRpYWxpemVQbHVnaW5zKHNldHRpbmdzLnBsdWdpbnMpO1xuXHQgICAgdGhpcy5zZXR1cENhbGxiYWNrcygpO1xuXHQgICAgdGhpcy5zZXR1cFRlbXBsYXRlcygpOyAvLyBDcmVhdGUgYWxsIGVsZW1lbnRzXG5cblx0ICAgIGNvbnN0IHdyYXBwZXIgPSBnZXREb20oJzxkaXY+Jyk7XG5cdCAgICBjb25zdCBjb250cm9sID0gZ2V0RG9tKCc8ZGl2PicpO1xuXG5cdCAgICBjb25zdCBkcm9wZG93biA9IHRoaXMuX3JlbmRlcignZHJvcGRvd24nKTtcblxuXHQgICAgY29uc3QgZHJvcGRvd25fY29udGVudCA9IGdldERvbShgPGRpdiByb2xlPVwibGlzdGJveFwiIHRhYmluZGV4PVwiLTFcIj5gKTtcblx0ICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLmlucHV0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCAnJztcblx0ICAgIGNvbnN0IGlucHV0TW9kZSA9IHNldHRpbmdzLm1vZGU7XG5cdCAgICB2YXIgY29udHJvbF9pbnB1dDtcblx0ICAgIGFkZENsYXNzZXMod3JhcHBlciwgc2V0dGluZ3Mud3JhcHBlckNsYXNzLCBjbGFzc2VzLCBpbnB1dE1vZGUpO1xuXHQgICAgYWRkQ2xhc3Nlcyhjb250cm9sLCBzZXR0aW5ncy5jb250cm9sQ2xhc3MpO1xuXHQgICAgYXBwZW5kKHdyYXBwZXIsIGNvbnRyb2wpO1xuXHQgICAgYWRkQ2xhc3Nlcyhkcm9wZG93biwgc2V0dGluZ3MuZHJvcGRvd25DbGFzcywgaW5wdXRNb2RlKTtcblxuXHQgICAgaWYgKHNldHRpbmdzLmNvcHlDbGFzc2VzVG9Ecm9wZG93bikge1xuXHQgICAgICBhZGRDbGFzc2VzKGRyb3Bkb3duLCBjbGFzc2VzKTtcblx0ICAgIH1cblxuXHQgICAgYWRkQ2xhc3Nlcyhkcm9wZG93bl9jb250ZW50LCBzZXR0aW5ncy5kcm9wZG93bkNvbnRlbnRDbGFzcyk7XG5cdCAgICBhcHBlbmQoZHJvcGRvd24sIGRyb3Bkb3duX2NvbnRlbnQpO1xuXHQgICAgZ2V0RG9tKHNldHRpbmdzLmRyb3Bkb3duUGFyZW50IHx8IHdyYXBwZXIpLmFwcGVuZENoaWxkKGRyb3Bkb3duKTsgLy8gZGVmYXVsdCBjb250cm9sSW5wdXRcblxuXHQgICAgaWYgKGlzSHRtbFN0cmluZyhzZXR0aW5ncy5jb250cm9sSW5wdXQpKSB7XG5cdCAgICAgIGNvbnRyb2xfaW5wdXQgPSBnZXREb20oc2V0dGluZ3MuY29udHJvbElucHV0KTsgLy8gc2V0IGF0dHJpYnV0ZXNcblxuXHQgICAgICB2YXIgYXR0cnMgPSBbJ2F1dG9jb3JyZWN0JywgJ2F1dG9jYXBpdGFsaXplJywgJ2F1dG9jb21wbGV0ZSddO1xuXHQgICAgICBpdGVyYXRlJDEoYXR0cnMsIGF0dHIgPT4ge1xuXHQgICAgICAgIGlmIChpbnB1dC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcblx0ICAgICAgICAgIHNldEF0dHIoY29udHJvbF9pbnB1dCwge1xuXHQgICAgICAgICAgICBbYXR0cl06IGlucHV0LmdldEF0dHJpYnV0ZShhdHRyKVxuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgICAgY29udHJvbF9pbnB1dC50YWJJbmRleCA9IC0xO1xuXHQgICAgICBjb250cm9sLmFwcGVuZENoaWxkKGNvbnRyb2xfaW5wdXQpO1xuXHQgICAgICB0aGlzLmZvY3VzX25vZGUgPSBjb250cm9sX2lucHV0OyAvLyBkb20gZWxlbWVudFxuXHQgICAgfSBlbHNlIGlmIChzZXR0aW5ncy5jb250cm9sSW5wdXQpIHtcblx0ICAgICAgY29udHJvbF9pbnB1dCA9IGdldERvbShzZXR0aW5ncy5jb250cm9sSW5wdXQpO1xuXHQgICAgICB0aGlzLmZvY3VzX25vZGUgPSBjb250cm9sX2lucHV0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgY29udHJvbF9pbnB1dCA9IGdldERvbSgnPGlucHV0Lz4nKTtcblx0ICAgICAgdGhpcy5mb2N1c19ub2RlID0gY29udHJvbDtcblx0ICAgIH1cblxuXHQgICAgdGhpcy53cmFwcGVyID0gd3JhcHBlcjtcblx0ICAgIHRoaXMuZHJvcGRvd24gPSBkcm9wZG93bjtcblx0ICAgIHRoaXMuZHJvcGRvd25fY29udGVudCA9IGRyb3Bkb3duX2NvbnRlbnQ7XG5cdCAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuXHQgICAgdGhpcy5jb250cm9sX2lucHV0ID0gY29udHJvbF9pbnB1dDtcblx0ICAgIHRoaXMuc2V0dXAoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogc2V0IHVwIGV2ZW50IGJpbmRpbmdzLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldHVwKCkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBjb25zdCBzZXR0aW5ncyA9IHNlbGYuc2V0dGluZ3M7XG5cdCAgICBjb25zdCBjb250cm9sX2lucHV0ID0gc2VsZi5jb250cm9sX2lucHV0O1xuXHQgICAgY29uc3QgZHJvcGRvd24gPSBzZWxmLmRyb3Bkb3duO1xuXHQgICAgY29uc3QgZHJvcGRvd25fY29udGVudCA9IHNlbGYuZHJvcGRvd25fY29udGVudDtcblx0ICAgIGNvbnN0IHdyYXBwZXIgPSBzZWxmLndyYXBwZXI7XG5cdCAgICBjb25zdCBjb250cm9sID0gc2VsZi5jb250cm9sO1xuXHQgICAgY29uc3QgaW5wdXQgPSBzZWxmLmlucHV0O1xuXHQgICAgY29uc3QgZm9jdXNfbm9kZSA9IHNlbGYuZm9jdXNfbm9kZTtcblx0ICAgIGNvbnN0IHBhc3NpdmVfZXZlbnQgPSB7XG5cdCAgICAgIHBhc3NpdmU6IHRydWVcblx0ICAgIH07XG5cdCAgICBjb25zdCBsaXN0Ym94SWQgPSBzZWxmLmlucHV0SWQgKyAnLXRzLWRyb3Bkb3duJztcblx0ICAgIHNldEF0dHIoZHJvcGRvd25fY29udGVudCwge1xuXHQgICAgICBpZDogbGlzdGJveElkXG5cdCAgICB9KTtcblx0ICAgIHNldEF0dHIoZm9jdXNfbm9kZSwge1xuXHQgICAgICByb2xlOiAnY29tYm9ib3gnLFxuXHQgICAgICAnYXJpYS1oYXNwb3B1cCc6ICdsaXN0Ym94Jyxcblx0ICAgICAgJ2FyaWEtZXhwYW5kZWQnOiAnZmFsc2UnLFxuXHQgICAgICAnYXJpYS1jb250cm9scyc6IGxpc3Rib3hJZFxuXHQgICAgfSk7XG5cdCAgICBjb25zdCBjb250cm9sX2lkID0gZ2V0SWQoZm9jdXNfbm9kZSwgc2VsZi5pbnB1dElkICsgJy10cy1jb250cm9sJyk7XG5cdCAgICBjb25zdCBxdWVyeSA9IFwibGFiZWxbZm9yPSdcIiArIGVzY2FwZVF1ZXJ5KHNlbGYuaW5wdXRJZCkgKyBcIiddXCI7XG5cdCAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocXVlcnkpO1xuXHQgICAgY29uc3QgbGFiZWxfY2xpY2sgPSBzZWxmLmZvY3VzLmJpbmQoc2VsZik7XG5cblx0ICAgIGlmIChsYWJlbCkge1xuXHQgICAgICBhZGRFdmVudChsYWJlbCwgJ2NsaWNrJywgbGFiZWxfY2xpY2spO1xuXHQgICAgICBzZXRBdHRyKGxhYmVsLCB7XG5cdCAgICAgICAgZm9yOiBjb250cm9sX2lkXG5cdCAgICAgIH0pO1xuXHQgICAgICBjb25zdCBsYWJlbF9pZCA9IGdldElkKGxhYmVsLCBzZWxmLmlucHV0SWQgKyAnLXRzLWxhYmVsJyk7XG5cdCAgICAgIHNldEF0dHIoZm9jdXNfbm9kZSwge1xuXHQgICAgICAgICdhcmlhLWxhYmVsbGVkYnknOiBsYWJlbF9pZFxuXHQgICAgICB9KTtcblx0ICAgICAgc2V0QXR0cihkcm9wZG93bl9jb250ZW50LCB7XG5cdCAgICAgICAgJ2FyaWEtbGFiZWxsZWRieSc6IGxhYmVsX2lkXG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICB3cmFwcGVyLnN0eWxlLndpZHRoID0gaW5wdXQuc3R5bGUud2lkdGg7XG5cblx0ICAgIGlmIChzZWxmLnBsdWdpbnMubmFtZXMubGVuZ3RoKSB7XG5cdCAgICAgIGNvbnN0IGNsYXNzZXNfcGx1Z2lucyA9ICdwbHVnaW4tJyArIHNlbGYucGx1Z2lucy5uYW1lcy5qb2luKCcgcGx1Z2luLScpO1xuXHQgICAgICBhZGRDbGFzc2VzKFt3cmFwcGVyLCBkcm9wZG93bl0sIGNsYXNzZXNfcGx1Z2lucyk7XG5cdCAgICB9XG5cblx0ICAgIGlmICgoc2V0dGluZ3MubWF4SXRlbXMgPT09IG51bGwgfHwgc2V0dGluZ3MubWF4SXRlbXMgPiAxKSAmJiBzZWxmLmlzX3NlbGVjdF90YWcpIHtcblx0ICAgICAgc2V0QXR0cihpbnB1dCwge1xuXHQgICAgICAgIG11bHRpcGxlOiAnbXVsdGlwbGUnXG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoc2V0dGluZ3MucGxhY2Vob2xkZXIpIHtcblx0ICAgICAgc2V0QXR0cihjb250cm9sX2lucHV0LCB7XG5cdCAgICAgICAgcGxhY2Vob2xkZXI6IHNldHRpbmdzLnBsYWNlaG9sZGVyXG5cdCAgICAgIH0pO1xuXHQgICAgfSAvLyBpZiBzcGxpdE9uIHdhcyBub3QgcGFzc2VkIGluLCBjb25zdHJ1Y3QgaXQgZnJvbSB0aGUgZGVsaW1pdGVyIHRvIGFsbG93IHBhc3RpbmcgdW5pdmVyc2FsbHlcblxuXG5cdCAgICBpZiAoIXNldHRpbmdzLnNwbGl0T24gJiYgc2V0dGluZ3MuZGVsaW1pdGVyKSB7XG5cdCAgICAgIHNldHRpbmdzLnNwbGl0T24gPSBuZXcgUmVnRXhwKCdcXFxccyonICsgZXNjYXBlX3JlZ2V4KHNldHRpbmdzLmRlbGltaXRlcikgKyAnK1xcXFxzKicpO1xuXHQgICAgfSAvLyBkZWJvdW5jZSB1c2VyIGRlZmluZWQgbG9hZCgpIGlmIGxvYWRUaHJvdHRsZSA+IDBcblx0ICAgIC8vIGFmdGVyIGluaXRpYWxpemVQbHVnaW5zKCkgc28gcGx1Z2lucyBjYW4gY3JlYXRlL21vZGlmeSB1c2VyIGRlZmluZWQgbG9hZGVyc1xuXG5cblx0ICAgIGlmIChzZXR0aW5ncy5sb2FkICYmIHNldHRpbmdzLmxvYWRUaHJvdHRsZSkge1xuXHQgICAgICBzZXR0aW5ncy5sb2FkID0gbG9hZERlYm91bmNlKHNldHRpbmdzLmxvYWQsIHNldHRpbmdzLmxvYWRUaHJvdHRsZSk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuY29udHJvbF9pbnB1dC50eXBlID0gaW5wdXQudHlwZTtcblx0ICAgIGFkZEV2ZW50KGRyb3Bkb3duLCAnbW91c2Vtb3ZlJywgKCkgPT4ge1xuXHQgICAgICBzZWxmLmlnbm9yZUhvdmVyID0gZmFsc2U7XG5cdCAgICB9KTtcblx0ICAgIGFkZEV2ZW50KGRyb3Bkb3duLCAnbW91c2VlbnRlcicsIGUgPT4ge1xuXHQgICAgICB2YXIgdGFyZ2V0X21hdGNoID0gcGFyZW50TWF0Y2goZS50YXJnZXQsICdbZGF0YS1zZWxlY3RhYmxlXScsIGRyb3Bkb3duKTtcblx0ICAgICAgaWYgKHRhcmdldF9tYXRjaCkgc2VsZi5vbk9wdGlvbkhvdmVyKGUsIHRhcmdldF9tYXRjaCk7XG5cdCAgICB9LCB7XG5cdCAgICAgIGNhcHR1cmU6IHRydWVcblx0ICAgIH0pOyAvLyBjbGlja2luZyBvbiBhbiBvcHRpb24gc2hvdWxkIHNlbGVjdCBpdFxuXG5cdCAgICBhZGRFdmVudChkcm9wZG93biwgJ2NsaWNrJywgZXZ0ID0+IHtcblx0ICAgICAgY29uc3Qgb3B0aW9uID0gcGFyZW50TWF0Y2goZXZ0LnRhcmdldCwgJ1tkYXRhLXNlbGVjdGFibGVdJyk7XG5cblx0ICAgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICAgIHNlbGYub25PcHRpb25TZWxlY3QoZXZ0LCBvcHRpb24pO1xuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgICAgYWRkRXZlbnQoY29udHJvbCwgJ2NsaWNrJywgZXZ0ID0+IHtcblx0ICAgICAgdmFyIHRhcmdldF9tYXRjaCA9IHBhcmVudE1hdGNoKGV2dC50YXJnZXQsICdbZGF0YS10cy1pdGVtXScsIGNvbnRyb2wpO1xuXG5cdCAgICAgIGlmICh0YXJnZXRfbWF0Y2ggJiYgc2VsZi5vbkl0ZW1TZWxlY3QoZXZ0LCB0YXJnZXRfbWF0Y2gpKSB7XG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH0gLy8gcmV0YWluIGZvY3VzIChzZWUgY29udHJvbF9pbnB1dCBtb3VzZWRvd24pXG5cblxuXHQgICAgICBpZiAoY29udHJvbF9pbnB1dC52YWx1ZSAhPSAnJykge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlbGYub25DbGljaygpO1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChldnQsIHRydWUpO1xuXHQgICAgfSk7IC8vIGtleWRvd24gb24gZm9jdXNfbm9kZSBmb3IgYXJyb3dfZG93bi9hcnJvd191cFxuXG5cdCAgICBhZGRFdmVudChmb2N1c19ub2RlLCAna2V5ZG93bicsIGUgPT4gc2VsZi5vbktleURvd24oZSkpOyAvLyBrZXlwcmVzcyBhbmQgaW5wdXQva2V5dXBcblxuXHQgICAgYWRkRXZlbnQoY29udHJvbF9pbnB1dCwgJ2tleXByZXNzJywgZSA9PiBzZWxmLm9uS2V5UHJlc3MoZSkpO1xuXHQgICAgYWRkRXZlbnQoY29udHJvbF9pbnB1dCwgJ2lucHV0JywgZSA9PiBzZWxmLm9uSW5wdXQoZSkpO1xuXHQgICAgYWRkRXZlbnQoZm9jdXNfbm9kZSwgJ2JsdXInLCBlID0+IHNlbGYub25CbHVyKGUpKTtcblx0ICAgIGFkZEV2ZW50KGZvY3VzX25vZGUsICdmb2N1cycsIGUgPT4gc2VsZi5vbkZvY3VzKGUpKTtcblx0ICAgIGFkZEV2ZW50KGNvbnRyb2xfaW5wdXQsICdwYXN0ZScsIGUgPT4gc2VsZi5vblBhc3RlKGUpKTtcblxuXHQgICAgY29uc3QgZG9jX21vdXNlZG93biA9IGV2dCA9PiB7XG5cdCAgICAgIC8vIGJsdXIgaWYgdGFyZ2V0IGlzIG91dHNpZGUgb2YgdGhpcyBpbnN0YW5jZVxuXHQgICAgICAvLyBkcm9wZG93biBpcyBub3QgYWx3YXlzIGluc2lkZSB3cmFwcGVyXG5cdCAgICAgIGNvbnN0IHRhcmdldCA9IGV2dC5jb21wb3NlZFBhdGgoKVswXTtcblxuXHQgICAgICBpZiAoIXdyYXBwZXIuY29udGFpbnModGFyZ2V0KSAmJiAhZHJvcGRvd24uY29udGFpbnModGFyZ2V0KSkge1xuXHQgICAgICAgIGlmIChzZWxmLmlzRm9jdXNlZCkge1xuXHQgICAgICAgICAgc2VsZi5ibHVyKCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VsZi5pbnB1dFN0YXRlKCk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9IC8vIHJldGFpbiBmb2N1cyBieSBwcmV2ZW50aW5nIG5hdGl2ZSBoYW5kbGluZy4gaWYgdGhlXG5cdCAgICAgIC8vIGV2ZW50IHRhcmdldCBpcyB0aGUgaW5wdXQgaXQgc2hvdWxkIG5vdCBiZSBtb2RpZmllZC5cblx0ICAgICAgLy8gb3RoZXJ3aXNlLCB0ZXh0IHNlbGVjdGlvbiB3aXRoaW4gdGhlIGlucHV0IHdvbid0IHdvcmsuXG5cdCAgICAgIC8vIEZpeGVzIGJ1ZyAjMjEyIHdoaWNoIGlzIG5vIGNvdmVyZWQgYnkgdGVzdHNcblxuXG5cdCAgICAgIGlmICh0YXJnZXQgPT0gY29udHJvbF9pbnB1dCAmJiBzZWxmLmlzT3Blbikge1xuXHQgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTsgLy8gY2xpY2tpbmcgYW55d2hlcmUgaW4gdGhlIGNvbnRyb2wgc2hvdWxkIG5vdCBibHVyIHRoZSBjb250cm9sX2lucHV0ICh3aGljaCB3b3VsZCBjbG9zZSB0aGUgZHJvcGRvd24pXG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblxuXHQgICAgY29uc3Qgd2luX3Njcm9sbCA9ICgpID0+IHtcblx0ICAgICAgaWYgKHNlbGYuaXNPcGVuKSB7XG5cdCAgICAgICAgc2VsZi5wb3NpdGlvbkRyb3Bkb3duKCk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIGFkZEV2ZW50KGRvY3VtZW50LCAnbW91c2Vkb3duJywgZG9jX21vdXNlZG93bik7XG5cdCAgICBhZGRFdmVudCh3aW5kb3csICdzY3JvbGwnLCB3aW5fc2Nyb2xsLCBwYXNzaXZlX2V2ZW50KTtcblx0ICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIHdpbl9zY3JvbGwsIHBhc3NpdmVfZXZlbnQpO1xuXG5cdCAgICB0aGlzLl9kZXN0cm95ID0gKCkgPT4ge1xuXHQgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBkb2NfbW91c2Vkb3duKTtcblx0ICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHdpbl9zY3JvbGwpO1xuXHQgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgd2luX3Njcm9sbCk7XG5cdCAgICAgIGlmIChsYWJlbCkgbGFiZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsYWJlbF9jbGljayk7XG5cdCAgICB9OyAvLyBzdG9yZSBvcmlnaW5hbCBodG1sIGFuZCB0YWIgaW5kZXggc28gdGhhdCB0aGV5IGNhbiBiZVxuXHQgICAgLy8gcmVzdG9yZWQgd2hlbiB0aGUgZGVzdHJveSgpIG1ldGhvZCBpcyBjYWxsZWQuXG5cblxuXHQgICAgdGhpcy5yZXZlcnRTZXR0aW5ncyA9IHtcblx0ICAgICAgaW5uZXJIVE1MOiBpbnB1dC5pbm5lckhUTUwsXG5cdCAgICAgIHRhYkluZGV4OiBpbnB1dC50YWJJbmRleFxuXHQgICAgfTtcblx0ICAgIGlucHV0LnRhYkluZGV4ID0gLTE7XG5cdCAgICBpbnB1dC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgc2VsZi53cmFwcGVyKTtcblx0ICAgIHNlbGYuc3luYyhmYWxzZSk7XG5cdCAgICBzZXR0aW5ncy5pdGVtcyA9IFtdO1xuXHQgICAgZGVsZXRlIHNldHRpbmdzLm9wdGdyb3Vwcztcblx0ICAgIGRlbGV0ZSBzZXR0aW5ncy5vcHRpb25zO1xuXHQgICAgYWRkRXZlbnQoaW5wdXQsICdpbnZhbGlkJywgKCkgPT4ge1xuXHQgICAgICBpZiAoc2VsZi5pc1ZhbGlkKSB7XG5cdCAgICAgICAgc2VsZi5pc1ZhbGlkID0gZmFsc2U7XG5cdCAgICAgICAgc2VsZi5pc0ludmFsaWQgPSB0cnVlO1xuXHQgICAgICAgIHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgICAgc2VsZi51cGRhdGVPcmlnaW5hbElucHV0KCk7XG5cdCAgICBzZWxmLnJlZnJlc2hJdGVtcygpO1xuXHQgICAgc2VsZi5jbG9zZShmYWxzZSk7XG5cdCAgICBzZWxmLmlucHV0U3RhdGUoKTtcblx0ICAgIHNlbGYuaXNTZXR1cCA9IHRydWU7XG5cblx0ICAgIGlmIChpbnB1dC5kaXNhYmxlZCkge1xuXHQgICAgICBzZWxmLmRpc2FibGUoKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYuZW5hYmxlKCk7IC8vc2V0cyB0YWJJbmRleFxuXHQgICAgfVxuXG5cdCAgICBzZWxmLm9uKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlKTtcblx0ICAgIGFkZENsYXNzZXMoaW5wdXQsICd0b21zZWxlY3RlZCcsICd0cy1oaWRkZW4tYWNjZXNzaWJsZScpO1xuXHQgICAgc2VsZi50cmlnZ2VyKCdpbml0aWFsaXplJyk7IC8vIHByZWxvYWQgb3B0aW9uc1xuXG5cdCAgICBpZiAoc2V0dGluZ3MucHJlbG9hZCA9PT0gdHJ1ZSkge1xuXHQgICAgICBzZWxmLnByZWxvYWQoKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVnaXN0ZXIgb3B0aW9ucyBhbmQgb3B0Z3JvdXBzXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2V0dXBPcHRpb25zKG9wdGlvbnMgPSBbXSwgb3B0Z3JvdXBzID0gW10pIHtcblx0ICAgIC8vIGJ1aWxkIG9wdGlvbnMgdGFibGVcblx0ICAgIHRoaXMuYWRkT3B0aW9ucyhvcHRpb25zKTsgLy8gYnVpbGQgb3B0Z3JvdXAgdGFibGVcblxuXHQgICAgaXRlcmF0ZSQxKG9wdGdyb3Vwcywgb3B0Z3JvdXAgPT4ge1xuXHQgICAgICB0aGlzLnJlZ2lzdGVyT3B0aW9uR3JvdXAob3B0Z3JvdXApO1xuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNldHMgdXAgZGVmYXVsdCByZW5kZXJpbmcgZnVuY3Rpb25zLlxuXHQgICAqL1xuXG5cblx0ICBzZXR1cFRlbXBsYXRlcygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBmaWVsZF9sYWJlbCA9IHNlbGYuc2V0dGluZ3MubGFiZWxGaWVsZDtcblx0ICAgIHZhciBmaWVsZF9vcHRncm91cCA9IHNlbGYuc2V0dGluZ3Mub3B0Z3JvdXBMYWJlbEZpZWxkO1xuXHQgICAgdmFyIHRlbXBsYXRlcyA9IHtcblx0ICAgICAgJ29wdGdyb3VwJzogZGF0YSA9PiB7XG5cdCAgICAgICAgbGV0IG9wdGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdCAgICAgICAgb3B0Z3JvdXAuY2xhc3NOYW1lID0gJ29wdGdyb3VwJztcblx0ICAgICAgICBvcHRncm91cC5hcHBlbmRDaGlsZChkYXRhLm9wdGlvbnMpO1xuXHQgICAgICAgIHJldHVybiBvcHRncm91cDtcblx0ICAgICAgfSxcblx0ICAgICAgJ29wdGdyb3VwX2hlYWRlcic6IChkYXRhLCBlc2NhcGUpID0+IHtcblx0ICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJvcHRncm91cC1oZWFkZXJcIj4nICsgZXNjYXBlKGRhdGFbZmllbGRfb3B0Z3JvdXBdKSArICc8L2Rpdj4nO1xuXHQgICAgICB9LFxuXHQgICAgICAnb3B0aW9uJzogKGRhdGEsIGVzY2FwZSkgPT4ge1xuXHQgICAgICAgIHJldHVybiAnPGRpdj4nICsgZXNjYXBlKGRhdGFbZmllbGRfbGFiZWxdKSArICc8L2Rpdj4nO1xuXHQgICAgICB9LFxuXHQgICAgICAnaXRlbSc6IChkYXRhLCBlc2NhcGUpID0+IHtcblx0ICAgICAgICByZXR1cm4gJzxkaXY+JyArIGVzY2FwZShkYXRhW2ZpZWxkX2xhYmVsXSkgKyAnPC9kaXY+Jztcblx0ICAgICAgfSxcblx0ICAgICAgJ29wdGlvbl9jcmVhdGUnOiAoZGF0YSwgZXNjYXBlKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3JlYXRlXCI+QWRkIDxzdHJvbmc+JyArIGVzY2FwZShkYXRhLmlucHV0KSArICc8L3N0cm9uZz4maGVsbGlwOzwvZGl2Pic7XG5cdCAgICAgIH0sXG5cdCAgICAgICdub19yZXN1bHRzJzogKCkgPT4ge1xuXHQgICAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cIm5vLXJlc3VsdHNcIj5ObyByZXN1bHRzIGZvdW5kPC9kaXY+Jztcblx0ICAgICAgfSxcblx0ICAgICAgJ2xvYWRpbmcnOiAoKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwic3Bpbm5lclwiPjwvZGl2Pic7XG5cdCAgICAgIH0sXG5cdCAgICAgICdub3RfbG9hZGluZyc6ICgpID0+IHt9LFxuXHQgICAgICAnZHJvcGRvd24nOiAoKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuICc8ZGl2PjwvZGl2Pic7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgICBzZWxmLnNldHRpbmdzLnJlbmRlciA9IE9iamVjdC5hc3NpZ24oe30sIHRlbXBsYXRlcywgc2VsZi5zZXR0aW5ncy5yZW5kZXIpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBNYXBzIGZpcmVkIGV2ZW50cyB0byBjYWxsYmFja3MgcHJvdmlkZWRcblx0ICAgKiBpbiB0aGUgc2V0dGluZ3MgdXNlZCB3aGVuIGNyZWF0aW5nIHRoZSBjb250cm9sLlxuXHQgICAqL1xuXG5cblx0ICBzZXR1cENhbGxiYWNrcygpIHtcblx0ICAgIHZhciBrZXksIGZuO1xuXHQgICAgdmFyIGNhbGxiYWNrcyA9IHtcblx0ICAgICAgJ2luaXRpYWxpemUnOiAnb25Jbml0aWFsaXplJyxcblx0ICAgICAgJ2NoYW5nZSc6ICdvbkNoYW5nZScsXG5cdCAgICAgICdpdGVtX2FkZCc6ICdvbkl0ZW1BZGQnLFxuXHQgICAgICAnaXRlbV9yZW1vdmUnOiAnb25JdGVtUmVtb3ZlJyxcblx0ICAgICAgJ2l0ZW1fc2VsZWN0JzogJ29uSXRlbVNlbGVjdCcsXG5cdCAgICAgICdjbGVhcic6ICdvbkNsZWFyJyxcblx0ICAgICAgJ29wdGlvbl9hZGQnOiAnb25PcHRpb25BZGQnLFxuXHQgICAgICAnb3B0aW9uX3JlbW92ZSc6ICdvbk9wdGlvblJlbW92ZScsXG5cdCAgICAgICdvcHRpb25fY2xlYXInOiAnb25PcHRpb25DbGVhcicsXG5cdCAgICAgICdvcHRncm91cF9hZGQnOiAnb25PcHRpb25Hcm91cEFkZCcsXG5cdCAgICAgICdvcHRncm91cF9yZW1vdmUnOiAnb25PcHRpb25Hcm91cFJlbW92ZScsXG5cdCAgICAgICdvcHRncm91cF9jbGVhcic6ICdvbk9wdGlvbkdyb3VwQ2xlYXInLFxuXHQgICAgICAnZHJvcGRvd25fb3Blbic6ICdvbkRyb3Bkb3duT3BlbicsXG5cdCAgICAgICdkcm9wZG93bl9jbG9zZSc6ICdvbkRyb3Bkb3duQ2xvc2UnLFxuXHQgICAgICAndHlwZSc6ICdvblR5cGUnLFxuXHQgICAgICAnbG9hZCc6ICdvbkxvYWQnLFxuXHQgICAgICAnZm9jdXMnOiAnb25Gb2N1cycsXG5cdCAgICAgICdibHVyJzogJ29uQmx1cidcblx0ICAgIH07XG5cblx0ICAgIGZvciAoa2V5IGluIGNhbGxiYWNrcykge1xuXHQgICAgICBmbiA9IHRoaXMuc2V0dGluZ3NbY2FsbGJhY2tzW2tleV1dO1xuXHQgICAgICBpZiAoZm4pIHRoaXMub24oa2V5LCBmbik7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFN5bmMgdGhlIFRvbSBTZWxlY3QgaW5zdGFuY2Ugd2l0aCB0aGUgb3JpZ2luYWwgaW5wdXQgb3Igc2VsZWN0XG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc3luYyhnZXRfc2V0dGluZ3MgPSB0cnVlKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIGNvbnN0IHNldHRpbmdzID0gZ2V0X3NldHRpbmdzID8gZ2V0U2V0dGluZ3Moc2VsZi5pbnB1dCwge1xuXHQgICAgICBkZWxpbWl0ZXI6IHNlbGYuc2V0dGluZ3MuZGVsaW1pdGVyXG5cdCAgICB9KSA6IHNlbGYuc2V0dGluZ3M7XG5cdCAgICBzZWxmLnNldHVwT3B0aW9ucyhzZXR0aW5ncy5vcHRpb25zLCBzZXR0aW5ncy5vcHRncm91cHMpO1xuXHQgICAgc2VsZi5zZXRWYWx1ZShzZXR0aW5ncy5pdGVtcyB8fCBbXSwgdHJ1ZSk7IC8vIHNpbGVudCBwcmV2ZW50cyByZWN1cnNpb25cblxuXHQgICAgc2VsZi5sYXN0UXVlcnkgPSBudWxsOyAvLyBzbyB1cGRhdGVkIG9wdGlvbnMgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gZHJvcGRvd25cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIHdoZW4gdGhlIG1haW4gY29udHJvbCBlbGVtZW50XG5cdCAgICogaGFzIGEgY2xpY2sgZXZlbnQuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25DbGljaygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKHNlbGYuYWN0aXZlSXRlbXMubGVuZ3RoID4gMCkge1xuXHQgICAgICBzZWxmLmNsZWFyQWN0aXZlSXRlbXMoKTtcblx0ICAgICAgc2VsZi5mb2N1cygpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIGlmIChzZWxmLmlzRm9jdXNlZCAmJiBzZWxmLmlzT3Blbikge1xuXHQgICAgICBzZWxmLmJsdXIoKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYuZm9jdXMoKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQGRlcHJlY2F0ZWQgdjEuN1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uTW91c2VEb3duKCkge31cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgd2hlbiB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wgaGFzIGJlZW4gY2hhbmdlZC5cblx0ICAgKiBUaGlzIHNob3VsZCBwcm9wYWdhdGUgdGhlIGV2ZW50IHRvIHRoZSBvcmlnaW5hbCBET01cblx0ICAgKiBpbnB1dCAvIHNlbGVjdCBlbGVtZW50LlxuXHQgICAqL1xuXG5cblx0ICBvbkNoYW5nZSgpIHtcblx0ICAgIHRyaWdnZXJFdmVudCh0aGlzLmlucHV0LCAnaW5wdXQnKTtcblx0ICAgIHRyaWdnZXJFdmVudCh0aGlzLmlucHV0LCAnY2hhbmdlJyk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IHBhc3RlLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uUGFzdGUoZSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAoc2VsZi5pc0lucHV0SGlkZGVuIHx8IHNlbGYuaXNMb2NrZWQpIHtcblx0ICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH0gLy8gSWYgYSByZWdleCBvciBzdHJpbmcgaXMgaW5jbHVkZWQsIHRoaXMgd2lsbCBzcGxpdCB0aGUgcGFzdGVkXG5cdCAgICAvLyBpbnB1dCBhbmQgY3JlYXRlIEl0ZW1zIGZvciBlYWNoIHNlcGFyYXRlIHZhbHVlXG5cblxuXHQgICAgaWYgKCFzZWxmLnNldHRpbmdzLnNwbGl0T24pIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfSAvLyBXYWl0IGZvciBwYXN0ZWQgdGV4dCB0byBiZSByZWNvZ25pemVkIGluIHZhbHVlXG5cblxuXHQgICAgc2V0VGltZW91dCgoKSA9PiB7XG5cdCAgICAgIHZhciBwYXN0ZWRUZXh0ID0gc2VsZi5pbnB1dFZhbHVlKCk7XG5cblx0ICAgICAgaWYgKCFwYXN0ZWRUZXh0Lm1hdGNoKHNlbGYuc2V0dGluZ3Muc3BsaXRPbikpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblxuXHQgICAgICB2YXIgc3BsaXRJbnB1dCA9IHBhc3RlZFRleHQudHJpbSgpLnNwbGl0KHNlbGYuc2V0dGluZ3Muc3BsaXRPbik7XG5cdCAgICAgIGl0ZXJhdGUkMShzcGxpdElucHV0LCBwaWVjZSA9PiB7XG5cdCAgICAgICAgY29uc3QgaGFzaCA9IGhhc2hfa2V5KHBpZWNlKTtcblxuXHQgICAgICAgIGlmIChoYXNoKSB7XG5cdCAgICAgICAgICBpZiAodGhpcy5vcHRpb25zW3BpZWNlXSkge1xuXHQgICAgICAgICAgICBzZWxmLmFkZEl0ZW0ocGllY2UpO1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgc2VsZi5jcmVhdGVJdGVtKHBpZWNlKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgfSwgMCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IGtleXByZXNzLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uS2V5UHJlc3MoZSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAoc2VsZi5pc0xvY2tlZCkge1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgY2hhcmFjdGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUgfHwgZS53aGljaCk7XG5cblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLmNyZWF0ZSAmJiBzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdtdWx0aScgJiYgY2hhcmFjdGVyID09PSBzZWxmLnNldHRpbmdzLmRlbGltaXRlcikge1xuXHQgICAgICBzZWxmLmNyZWF0ZUl0ZW0oKTtcblx0ICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4ga2V5ZG93bi5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbktleURvd24oZSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgc2VsZi5pZ25vcmVIb3ZlciA9IHRydWU7XG5cblx0ICAgIGlmIChzZWxmLmlzTG9ja2VkKSB7XG5cdCAgICAgIGlmIChlLmtleUNvZGUgIT09IEtFWV9UQUIpIHtcblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcblx0ICAgICAgLy8gY3RybCtBOiBzZWxlY3QgYWxsXG5cdCAgICAgIGNhc2UgS0VZX0E6XG5cdCAgICAgICAgaWYgKGlzS2V5RG93bihLRVlfU0hPUlRDVVQsIGUpKSB7XG5cdCAgICAgICAgICBpZiAoc2VsZi5jb250cm9sX2lucHV0LnZhbHVlID09ICcnKSB7XG5cdCAgICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICAgICAgICBzZWxmLnNlbGVjdEFsbCgpO1xuXHQgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICAgIC8vIGVzYzogY2xvc2UgZHJvcGRvd25cblxuXHQgICAgICBjYXNlIEtFWV9FU0M6XG5cdCAgICAgICAgaWYgKHNlbGYuaXNPcGVuKSB7XG5cdCAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlLCB0cnVlKTtcblx0ICAgICAgICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZWxmLmNsZWFyQWN0aXZlSXRlbXMoKTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIC8vIGRvd246IG9wZW4gZHJvcGRvd24gb3IgbW92ZSBzZWxlY3Rpb24gZG93blxuXG5cdCAgICAgIGNhc2UgS0VZX0RPV046XG5cdCAgICAgICAgaWYgKCFzZWxmLmlzT3BlbiAmJiBzZWxmLmhhc09wdGlvbnMpIHtcblx0ICAgICAgICAgIHNlbGYub3BlbigpO1xuXHQgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5hY3RpdmVPcHRpb24pIHtcblx0ICAgICAgICAgIGxldCBuZXh0ID0gc2VsZi5nZXRBZGphY2VudChzZWxmLmFjdGl2ZU9wdGlvbiwgMSk7XG5cdCAgICAgICAgICBpZiAobmV4dCkgc2VsZi5zZXRBY3RpdmVPcHRpb24obmV4dCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICAvLyB1cDogbW92ZSBzZWxlY3Rpb24gdXBcblxuXHQgICAgICBjYXNlIEtFWV9VUDpcblx0ICAgICAgICBpZiAoc2VsZi5hY3RpdmVPcHRpb24pIHtcblx0ICAgICAgICAgIGxldCBwcmV2ID0gc2VsZi5nZXRBZGphY2VudChzZWxmLmFjdGl2ZU9wdGlvbiwgLTEpO1xuXHQgICAgICAgICAgaWYgKHByZXYpIHNlbGYuc2V0QWN0aXZlT3B0aW9uKHByZXYpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgLy8gcmV0dXJuOiBzZWxlY3QgYWN0aXZlIG9wdGlvblxuXG5cdCAgICAgIGNhc2UgS0VZX1JFVFVSTjpcblx0ICAgICAgICBpZiAoc2VsZi5jYW5TZWxlY3Qoc2VsZi5hY3RpdmVPcHRpb24pKSB7XG5cdCAgICAgICAgICBzZWxmLm9uT3B0aW9uU2VsZWN0KGUsIHNlbGYuYWN0aXZlT3B0aW9uKTtcblx0ICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpOyAvLyBpZiB0aGUgb3B0aW9uX2NyZWF0ZT1udWxsLCB0aGUgZHJvcGRvd24gbWlnaHQgYmUgY2xvc2VkXG5cdCAgICAgICAgfSBlbHNlIGlmIChzZWxmLnNldHRpbmdzLmNyZWF0ZSAmJiBzZWxmLmNyZWF0ZUl0ZW0oKSkge1xuXHQgICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7IC8vIGRvbid0IHN1Ym1pdCBmb3JtIHdoZW4gc2VhcmNoaW5nIGZvciBhIHZhbHVlXG5cdCAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09IHNlbGYuY29udHJvbF9pbnB1dCAmJiBzZWxmLmlzT3Blbikge1xuXHQgICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICAvLyBsZWZ0OiBtb2RpZml5IGl0ZW0gc2VsZWN0aW9uIHRvIHRoZSBsZWZ0XG5cblx0ICAgICAgY2FzZSBLRVlfTEVGVDpcblx0ICAgICAgICBzZWxmLmFkdmFuY2VTZWxlY3Rpb24oLTEsIGUpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgLy8gcmlnaHQ6IG1vZGlmaXkgaXRlbSBzZWxlY3Rpb24gdG8gdGhlIHJpZ2h0XG5cblx0ICAgICAgY2FzZSBLRVlfUklHSFQ6XG5cdCAgICAgICAgc2VsZi5hZHZhbmNlU2VsZWN0aW9uKDEsIGUpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgLy8gdGFiOiBzZWxlY3QgYWN0aXZlIG9wdGlvbiBhbmQvb3IgY3JlYXRlIGl0ZW1cblxuXHQgICAgICBjYXNlIEtFWV9UQUI6XG5cdCAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3Muc2VsZWN0T25UYWIpIHtcblx0ICAgICAgICAgIGlmIChzZWxmLmNhblNlbGVjdChzZWxmLmFjdGl2ZU9wdGlvbikpIHtcblx0ICAgICAgICAgICAgc2VsZi5vbk9wdGlvblNlbGVjdChlLCBzZWxmLmFjdGl2ZU9wdGlvbik7IC8vIHByZXZlbnQgZGVmYXVsdCBbdGFiXSBiZWhhdmlvdXIgb2YganVtcCB0byB0aGUgbmV4dCBmaWVsZFxuXHQgICAgICAgICAgICAvLyBpZiBzZWxlY3QgaXNGdWxsLCB0aGVuIHRoZSBkcm9wZG93biB3b24ndCBiZSBvcGVuIGFuZCBbdGFiXSB3aWxsIHdvcmsgbm9ybWFsbHlcblxuXHQgICAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgICAgIH1cblxuXHQgICAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3MuY3JlYXRlICYmIHNlbGYuY3JlYXRlSXRlbSgpKSB7XG5cdCAgICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgLy8gZGVsZXRlfGJhY2tzcGFjZTogZGVsZXRlIGl0ZW1zXG5cblx0ICAgICAgY2FzZSBLRVlfQkFDS1NQQUNFOlxuXHQgICAgICBjYXNlIEtFWV9ERUxFVEU6XG5cdCAgICAgICAgc2VsZi5kZWxldGVTZWxlY3Rpb24oZSk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgfSAvLyBkb24ndCBlbnRlciB0ZXh0IGluIHRoZSBjb250cm9sX2lucHV0IHdoZW4gYWN0aXZlIGl0ZW1zIGFyZSBzZWxlY3RlZFxuXG5cblx0ICAgIGlmIChzZWxmLmlzSW5wdXRIaWRkZW4gJiYgIWlzS2V5RG93bihLRVlfU0hPUlRDVVQsIGUpKSB7XG5cdCAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBrZXl1cC5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbklucHV0KGUpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKHNlbGYuaXNMb2NrZWQpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgdmFsdWUgPSBzZWxmLmlucHV0VmFsdWUoKTtcblxuXHQgICAgaWYgKHNlbGYubGFzdFZhbHVlICE9PSB2YWx1ZSkge1xuXHQgICAgICBzZWxmLmxhc3RWYWx1ZSA9IHZhbHVlO1xuXG5cdCAgICAgIGlmIChzZWxmLnNldHRpbmdzLnNob3VsZExvYWQuY2FsbChzZWxmLCB2YWx1ZSkpIHtcblx0ICAgICAgICBzZWxmLmxvYWQodmFsdWUpO1xuXHQgICAgICB9XG5cblx0ICAgICAgc2VsZi5yZWZyZXNoT3B0aW9ucygpO1xuXHQgICAgICBzZWxmLnRyaWdnZXIoJ3R5cGUnLCB2YWx1ZSk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCB3aGVuIHRoZSB1c2VyIHJvbGxzIG92ZXJcblx0ICAgKiBhbiBvcHRpb24gaW4gdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93biBtZW51LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uT3B0aW9uSG92ZXIoZXZ0LCBvcHRpb24pIHtcblx0ICAgIGlmICh0aGlzLmlnbm9yZUhvdmVyKSByZXR1cm47XG5cdCAgICB0aGlzLnNldEFjdGl2ZU9wdGlvbihvcHRpb24sIGZhbHNlKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4gZm9jdXMuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25Gb2N1cyhlKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgd2FzRm9jdXNlZCA9IHNlbGYuaXNGb2N1c2VkO1xuXG5cdCAgICBpZiAoc2VsZi5pc0Rpc2FibGVkKSB7XG5cdCAgICAgIHNlbGYuYmx1cigpO1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoc2VsZi5pZ25vcmVGb2N1cykgcmV0dXJuO1xuXHQgICAgc2VsZi5pc0ZvY3VzZWQgPSB0cnVlO1xuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MucHJlbG9hZCA9PT0gJ2ZvY3VzJykgc2VsZi5wcmVsb2FkKCk7XG5cdCAgICBpZiAoIXdhc0ZvY3VzZWQpIHNlbGYudHJpZ2dlcignZm9jdXMnKTtcblxuXHQgICAgaWYgKCFzZWxmLmFjdGl2ZUl0ZW1zLmxlbmd0aCkge1xuXHQgICAgICBzZWxmLnNob3dJbnB1dCgpO1xuXHQgICAgICBzZWxmLnJlZnJlc2hPcHRpb25zKCEhc2VsZi5zZXR0aW5ncy5vcGVuT25Gb2N1cyk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IGJsdXIuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25CbHVyKGUpIHtcblx0ICAgIGlmIChkb2N1bWVudC5oYXNGb2N1cygpID09PSBmYWxzZSkgcmV0dXJuO1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKCFzZWxmLmlzRm9jdXNlZCkgcmV0dXJuO1xuXHQgICAgc2VsZi5pc0ZvY3VzZWQgPSBmYWxzZTtcblx0ICAgIHNlbGYuaWdub3JlRm9jdXMgPSBmYWxzZTtcblxuXHQgICAgdmFyIGRlYWN0aXZhdGUgPSAoKSA9PiB7XG5cdCAgICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgICAgc2VsZi5zZXRBY3RpdmVJdGVtKCk7XG5cdCAgICAgIHNlbGYuc2V0Q2FyZXQoc2VsZi5pdGVtcy5sZW5ndGgpO1xuXHQgICAgICBzZWxmLnRyaWdnZXIoJ2JsdXInKTtcblx0ICAgIH07XG5cblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLmNyZWF0ZSAmJiBzZWxmLnNldHRpbmdzLmNyZWF0ZU9uQmx1cikge1xuXHQgICAgICBzZWxmLmNyZWF0ZUl0ZW0obnVsbCwgZGVhY3RpdmF0ZSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBkZWFjdGl2YXRlKCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvbiBhbiBvcHRpb25cblx0ICAgKiBpbiB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duIG1lbnUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25PcHRpb25TZWxlY3QoZXZ0LCBvcHRpb24pIHtcblx0ICAgIHZhciB2YWx1ZSxcblx0ICAgICAgICBzZWxmID0gdGhpczsgLy8gc2hvdWxkIG5vdCBiZSBwb3NzaWJsZSB0byB0cmlnZ2VyIGEgb3B0aW9uIHVuZGVyIGEgZGlzYWJsZWQgb3B0Z3JvdXBcblxuXHQgICAgaWYgKG9wdGlvbi5wYXJlbnRFbGVtZW50ICYmIG9wdGlvbi5wYXJlbnRFbGVtZW50Lm1hdGNoZXMoJ1tkYXRhLWRpc2FibGVkXScpKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgaWYgKG9wdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2NyZWF0ZScpKSB7XG5cdCAgICAgIHNlbGYuY3JlYXRlSXRlbShudWxsLCAoKSA9PiB7XG5cdCAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3MuY2xvc2VBZnRlclNlbGVjdCkge1xuXHQgICAgICAgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB2YWx1ZSA9IG9wdGlvbi5kYXRhc2V0LnZhbHVlO1xuXG5cdCAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgc2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXHQgICAgICAgIHNlbGYuYWRkSXRlbSh2YWx1ZSk7XG5cblx0ICAgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5jbG9zZUFmdGVyU2VsZWN0KSB7XG5cdCAgICAgICAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKCFzZWxmLnNldHRpbmdzLmhpZGVTZWxlY3RlZCAmJiBldnQudHlwZSAmJiAvY2xpY2svLnRlc3QoZXZ0LnR5cGUpKSB7XG5cdCAgICAgICAgICBzZWxmLnNldEFjdGl2ZU9wdGlvbihvcHRpb24pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgZ2l2ZW4gb3B0aW9uIGNhbiBiZSBzZWxlY3RlZFxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNhblNlbGVjdChvcHRpb24pIHtcblx0ICAgIGlmICh0aGlzLmlzT3BlbiAmJiBvcHRpb24gJiYgdGhpcy5kcm9wZG93bl9jb250ZW50LmNvbnRhaW5zKG9wdGlvbikpIHtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIGFuIGl0ZW1cblx0ICAgKiB0aGF0IGhhcyBiZWVuIHNlbGVjdGVkLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uSXRlbVNlbGVjdChldnQsIGl0ZW0pIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKCFzZWxmLmlzTG9ja2VkICYmIHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ211bHRpJykge1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChldnQpO1xuXHQgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW0oaXRlbSwgZXZ0KTtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0byBpbnZva2Vcblx0ICAgKiB0aGUgdXNlci1wcm92aWRlZCBvcHRpb24gcHJvdmlkZXIgLyBsb2FkZXJcblx0ICAgKlxuXHQgICAqIE5vdGUsIHRoZXJlIGlzIGEgc3VidGxlIGRpZmZlcmVuY2UgYmV0d2VlblxuXHQgICAqIHRoaXMuY2FuTG9hZCgpIGFuZCB0aGlzLnNldHRpbmdzLnNob3VsZExvYWQoKTtcblx0ICAgKlxuXHQgICAqXHQtIHNldHRpbmdzLnNob3VsZExvYWQoKSBpcyBhIHVzZXItaW5wdXQgdmFsaWRhdG9yLlxuXHQgICAqXHRXaGVuIGZhbHNlIGlzIHJldHVybmVkLCB0aGUgbm90X2xvYWRpbmcgdGVtcGxhdGVcblx0ICAgKlx0d2lsbCBiZSBhZGRlZCB0byB0aGUgZHJvcGRvd25cblx0ICAgKlxuXHQgICAqXHQtIGNhbkxvYWQoKSBpcyBsb3dlciBsZXZlbCB2YWxpZGF0b3IgdGhhdCBjaGVja3Ncblx0ICAgKiBcdHRoZSBUb20gU2VsZWN0IGluc3RhbmNlLiBUaGVyZSBpcyBubyBpbmhlcmVudCB1c2VyXG5cdCAgICpcdGZlZWRiYWNrIHdoZW4gY2FuTG9hZCByZXR1cm5zIGZhbHNlXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY2FuTG9hZCh2YWx1ZSkge1xuXHQgICAgaWYgKCF0aGlzLnNldHRpbmdzLmxvYWQpIHJldHVybiBmYWxzZTtcblx0ICAgIGlmICh0aGlzLmxvYWRlZFNlYXJjaGVzLmhhc093blByb3BlcnR5KHZhbHVlKSkgcmV0dXJuIGZhbHNlO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEludm9rZXMgdGhlIHVzZXItcHJvdmlkZWQgb3B0aW9uIHByb3ZpZGVyIC8gbG9hZGVyLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGxvYWQodmFsdWUpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKCFzZWxmLmNhbkxvYWQodmFsdWUpKSByZXR1cm47XG5cdCAgICBhZGRDbGFzc2VzKHNlbGYud3JhcHBlciwgc2VsZi5zZXR0aW5ncy5sb2FkaW5nQ2xhc3MpO1xuXHQgICAgc2VsZi5sb2FkaW5nKys7XG5cdCAgICBjb25zdCBjYWxsYmFjayA9IHNlbGYubG9hZENhbGxiYWNrLmJpbmQoc2VsZik7XG5cdCAgICBzZWxmLnNldHRpbmdzLmxvYWQuY2FsbChzZWxmLCB2YWx1ZSwgY2FsbGJhY2spO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBJbnZva2VkIGJ5IHRoZSB1c2VyLXByb3ZpZGVkIG9wdGlvbiBwcm92aWRlclxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGxvYWRDYWxsYmFjayhvcHRpb25zLCBvcHRncm91cHMpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgc2VsZi5sb2FkaW5nID0gTWF0aC5tYXgoc2VsZi5sb2FkaW5nIC0gMSwgMCk7XG5cdCAgICBzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cdCAgICBzZWxmLmNsZWFyQWN0aXZlT3B0aW9uKCk7IC8vIHdoZW4gbmV3IHJlc3VsdHMgbG9hZCwgZm9jdXMgc2hvdWxkIGJlIG9uIGZpcnN0IG9wdGlvblxuXG5cdCAgICBzZWxmLnNldHVwT3B0aW9ucyhvcHRpb25zLCBvcHRncm91cHMpO1xuXHQgICAgc2VsZi5yZWZyZXNoT3B0aW9ucyhzZWxmLmlzRm9jdXNlZCAmJiAhc2VsZi5pc0lucHV0SGlkZGVuKTtcblxuXHQgICAgaWYgKCFzZWxmLmxvYWRpbmcpIHtcblx0ICAgICAgcmVtb3ZlQ2xhc3NlcyhzZWxmLndyYXBwZXIsIHNlbGYuc2V0dGluZ3MubG9hZGluZ0NsYXNzKTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi50cmlnZ2VyKCdsb2FkJywgb3B0aW9ucywgb3B0Z3JvdXBzKTtcblx0ICB9XG5cblx0ICBwcmVsb2FkKCkge1xuXHQgICAgdmFyIGNsYXNzTGlzdCA9IHRoaXMud3JhcHBlci5jbGFzc0xpc3Q7XG5cdCAgICBpZiAoY2xhc3NMaXN0LmNvbnRhaW5zKCdwcmVsb2FkZWQnKSkgcmV0dXJuO1xuXHQgICAgY2xhc3NMaXN0LmFkZCgncHJlbG9hZGVkJyk7XG5cdCAgICB0aGlzLmxvYWQoJycpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZXRzIHRoZSBpbnB1dCBmaWVsZCBvZiB0aGUgY29udHJvbCB0byB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldFRleHRib3hWYWx1ZSh2YWx1ZSA9ICcnKSB7XG5cdCAgICB2YXIgaW5wdXQgPSB0aGlzLmNvbnRyb2xfaW5wdXQ7XG5cdCAgICB2YXIgY2hhbmdlZCA9IGlucHV0LnZhbHVlICE9PSB2YWx1ZTtcblxuXHQgICAgaWYgKGNoYW5nZWQpIHtcblx0ICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcblx0ICAgICAgdHJpZ2dlckV2ZW50KGlucHV0LCAndXBkYXRlJyk7XG5cdCAgICAgIHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBJZiBtdWx0aXBsZSBpdGVtc1xuXHQgICAqIGNhbiBiZSBzZWxlY3RlZCAoZS5nLiA8c2VsZWN0IG11bHRpcGxlPiksIHRoaXMgcmV0dXJuc1xuXHQgICAqIGFuIGFycmF5LiBJZiBvbmx5IG9uZSBpdGVtIGNhbiBiZSBzZWxlY3RlZCwgdGhpc1xuXHQgICAqIHJldHVybnMgYSBzdHJpbmcuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgZ2V0VmFsdWUoKSB7XG5cdCAgICBpZiAodGhpcy5pc19zZWxlY3RfdGFnICYmIHRoaXMuaW5wdXQuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLml0ZW1zO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdGhpcy5pdGVtcy5qb2luKHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVzZXRzIHRoZSBzZWxlY3RlZCBpdGVtcyB0byB0aGUgZ2l2ZW4gdmFsdWUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2V0VmFsdWUodmFsdWUsIHNpbGVudCkge1xuXHQgICAgdmFyIGV2ZW50cyA9IHNpbGVudCA/IFtdIDogWydjaGFuZ2UnXTtcblx0ICAgIGRlYm91bmNlX2V2ZW50cyh0aGlzLCBldmVudHMsICgpID0+IHtcblx0ICAgICAgdGhpcy5jbGVhcihzaWxlbnQpO1xuXHQgICAgICB0aGlzLmFkZEl0ZW1zKHZhbHVlLCBzaWxlbnQpO1xuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlc2V0cyB0aGUgbnVtYmVyIG9mIG1heCBpdGVtcyB0byB0aGUgZ2l2ZW4gdmFsdWVcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXRNYXhJdGVtcyh2YWx1ZSkge1xuXHQgICAgaWYgKHZhbHVlID09PSAwKSB2YWx1ZSA9IG51bGw7IC8vcmVzZXQgdG8gdW5saW1pdGVkIGl0ZW1zLlxuXG5cdCAgICB0aGlzLnNldHRpbmdzLm1heEl0ZW1zID0gdmFsdWU7XG5cdCAgICB0aGlzLnJlZnJlc2hTdGF0ZSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZXRzIHRoZSBzZWxlY3RlZCBpdGVtLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldEFjdGl2ZUl0ZW0oaXRlbSwgZSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIGV2ZW50TmFtZTtcblx0ICAgIHZhciBpLCBiZWdpbiwgZW5kLCBzd2FwO1xuXHQgICAgdmFyIGxhc3Q7XG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJykgcmV0dXJuOyAvLyBjbGVhciB0aGUgYWN0aXZlIHNlbGVjdGlvblxuXG5cdCAgICBpZiAoIWl0ZW0pIHtcblx0ICAgICAgc2VsZi5jbGVhckFjdGl2ZUl0ZW1zKCk7XG5cblx0ICAgICAgaWYgKHNlbGYuaXNGb2N1c2VkKSB7XG5cdCAgICAgICAgc2VsZi5zaG93SW5wdXQoKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybjtcblx0ICAgIH0gLy8gbW9kaWZ5IHNlbGVjdGlvblxuXG5cblx0ICAgIGV2ZW50TmFtZSA9IGUgJiYgZS50eXBlLnRvTG93ZXJDYXNlKCk7XG5cblx0ICAgIGlmIChldmVudE5hbWUgPT09ICdjbGljaycgJiYgaXNLZXlEb3duKCdzaGlmdEtleScsIGUpICYmIHNlbGYuYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgIGxhc3QgPSBzZWxmLmdldExhc3RBY3RpdmUoKTtcblx0ICAgICAgYmVnaW4gPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHNlbGYuY29udHJvbC5jaGlsZHJlbiwgbGFzdCk7XG5cdCAgICAgIGVuZCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoc2VsZi5jb250cm9sLmNoaWxkcmVuLCBpdGVtKTtcblxuXHQgICAgICBpZiAoYmVnaW4gPiBlbmQpIHtcblx0ICAgICAgICBzd2FwID0gYmVnaW47XG5cdCAgICAgICAgYmVnaW4gPSBlbmQ7XG5cdCAgICAgICAgZW5kID0gc3dhcDtcblx0ICAgICAgfVxuXG5cdCAgICAgIGZvciAoaSA9IGJlZ2luOyBpIDw9IGVuZDsgaSsrKSB7XG5cdCAgICAgICAgaXRlbSA9IHNlbGYuY29udHJvbC5jaGlsZHJlbltpXTtcblxuXHQgICAgICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW1zLmluZGV4T2YoaXRlbSkgPT09IC0xKSB7XG5cdCAgICAgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW1DbGFzcyhpdGVtKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSAnY2xpY2snICYmIGlzS2V5RG93bihLRVlfU0hPUlRDVVQsIGUpIHx8IGV2ZW50TmFtZSA9PT0gJ2tleWRvd24nICYmIGlzS2V5RG93bignc2hpZnRLZXknLCBlKSkge1xuXHQgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdCAgICAgICAgc2VsZi5yZW1vdmVBY3RpdmVJdGVtKGl0ZW0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHNlbGYuc2V0QWN0aXZlSXRlbUNsYXNzKGl0ZW0pO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZWxmLmNsZWFyQWN0aXZlSXRlbXMoKTtcblx0ICAgICAgc2VsZi5zZXRBY3RpdmVJdGVtQ2xhc3MoaXRlbSk7XG5cdCAgICB9IC8vIGVuc3VyZSBjb250cm9sIGhhcyBmb2N1c1xuXG5cblx0ICAgIHNlbGYuaGlkZUlucHV0KCk7XG5cblx0ICAgIGlmICghc2VsZi5pc0ZvY3VzZWQpIHtcblx0ICAgICAgc2VsZi5mb2N1cygpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZXQgdGhlIGFjdGl2ZSBhbmQgbGFzdC1hY3RpdmUgY2xhc3Nlc1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldEFjdGl2ZUl0ZW1DbGFzcyhpdGVtKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIGNvbnN0IGxhc3RfYWN0aXZlID0gc2VsZi5jb250cm9sLnF1ZXJ5U2VsZWN0b3IoJy5sYXN0LWFjdGl2ZScpO1xuXHQgICAgaWYgKGxhc3RfYWN0aXZlKSByZW1vdmVDbGFzc2VzKGxhc3RfYWN0aXZlLCAnbGFzdC1hY3RpdmUnKTtcblx0ICAgIGFkZENsYXNzZXMoaXRlbSwgJ2FjdGl2ZSBsYXN0LWFjdGl2ZScpO1xuXHQgICAgc2VsZi50cmlnZ2VyKCdpdGVtX3NlbGVjdCcsIGl0ZW0pO1xuXG5cdCAgICBpZiAoc2VsZi5hY3RpdmVJdGVtcy5pbmRleE9mKGl0ZW0pID09IC0xKSB7XG5cdCAgICAgIHNlbGYuYWN0aXZlSXRlbXMucHVzaChpdGVtKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVtb3ZlIGFjdGl2ZSBpdGVtXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgcmVtb3ZlQWN0aXZlSXRlbShpdGVtKSB7XG5cdCAgICB2YXIgaWR4ID0gdGhpcy5hY3RpdmVJdGVtcy5pbmRleE9mKGl0ZW0pO1xuXHQgICAgdGhpcy5hY3RpdmVJdGVtcy5zcGxpY2UoaWR4LCAxKTtcblx0ICAgIHJlbW92ZUNsYXNzZXMoaXRlbSwgJ2FjdGl2ZScpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDbGVhcnMgYWxsIHRoZSBhY3RpdmUgaXRlbXNcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjbGVhckFjdGl2ZUl0ZW1zKCkge1xuXHQgICAgcmVtb3ZlQ2xhc3Nlcyh0aGlzLmFjdGl2ZUl0ZW1zLCAnYWN0aXZlJyk7XG5cdCAgICB0aGlzLmFjdGl2ZUl0ZW1zID0gW107XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNldHMgdGhlIHNlbGVjdGVkIGl0ZW0gaW4gdGhlIGRyb3Bkb3duIG1lbnVcblx0ICAgKiBvZiBhdmFpbGFibGUgb3B0aW9ucy5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXRBY3RpdmVPcHRpb24ob3B0aW9uLCBzY3JvbGwgPSB0cnVlKSB7XG5cdCAgICBpZiAob3B0aW9uID09PSB0aGlzLmFjdGl2ZU9wdGlvbikge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuY2xlYXJBY3RpdmVPcHRpb24oKTtcblx0ICAgIGlmICghb3B0aW9uKSByZXR1cm47XG5cdCAgICB0aGlzLmFjdGl2ZU9wdGlvbiA9IG9wdGlvbjtcblx0ICAgIHNldEF0dHIodGhpcy5mb2N1c19ub2RlLCB7XG5cdCAgICAgICdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnOiBvcHRpb24uZ2V0QXR0cmlidXRlKCdpZCcpXG5cdCAgICB9KTtcblx0ICAgIHNldEF0dHIob3B0aW9uLCB7XG5cdCAgICAgICdhcmlhLXNlbGVjdGVkJzogJ3RydWUnXG5cdCAgICB9KTtcblx0ICAgIGFkZENsYXNzZXMob3B0aW9uLCAnYWN0aXZlJyk7XG5cdCAgICBpZiAoc2Nyb2xsKSB0aGlzLnNjcm9sbFRvT3B0aW9uKG9wdGlvbik7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNldHMgdGhlIGRyb3Bkb3duX2NvbnRlbnQgc2Nyb2xsVG9wIHRvIGRpc3BsYXkgdGhlIG9wdGlvblxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNjcm9sbFRvT3B0aW9uKG9wdGlvbiwgYmVoYXZpb3IpIHtcblx0ICAgIGlmICghb3B0aW9uKSByZXR1cm47XG5cdCAgICBjb25zdCBjb250ZW50ID0gdGhpcy5kcm9wZG93bl9jb250ZW50O1xuXHQgICAgY29uc3QgaGVpZ2h0X21lbnUgPSBjb250ZW50LmNsaWVudEhlaWdodDtcblx0ICAgIGNvbnN0IHNjcm9sbFRvcCA9IGNvbnRlbnQuc2Nyb2xsVG9wIHx8IDA7XG5cdCAgICBjb25zdCBoZWlnaHRfaXRlbSA9IG9wdGlvbi5vZmZzZXRIZWlnaHQ7XG5cdCAgICBjb25zdCB5ID0gb3B0aW9uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIGNvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgc2Nyb2xsVG9wO1xuXG5cdCAgICBpZiAoeSArIGhlaWdodF9pdGVtID4gaGVpZ2h0X21lbnUgKyBzY3JvbGxUb3ApIHtcblx0ICAgICAgdGhpcy5zY3JvbGwoeSAtIGhlaWdodF9tZW51ICsgaGVpZ2h0X2l0ZW0sIGJlaGF2aW9yKTtcblx0ICAgIH0gZWxzZSBpZiAoeSA8IHNjcm9sbFRvcCkge1xuXHQgICAgICB0aGlzLnNjcm9sbCh5LCBiZWhhdmlvcik7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNjcm9sbCB0aGUgZHJvcGRvd24gdG8gdGhlIGdpdmVuIHBvc2l0aW9uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2Nyb2xsKHNjcm9sbFRvcCwgYmVoYXZpb3IpIHtcblx0ICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmRyb3Bkb3duX2NvbnRlbnQ7XG5cblx0ICAgIGlmIChiZWhhdmlvcikge1xuXHQgICAgICBjb250ZW50LnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gYmVoYXZpb3I7XG5cdCAgICB9XG5cblx0ICAgIGNvbnRlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuXHQgICAgY29udGVudC5zdHlsZS5zY3JvbGxCZWhhdmlvciA9ICcnO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDbGVhcnMgdGhlIGFjdGl2ZSBvcHRpb25cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjbGVhckFjdGl2ZU9wdGlvbigpIHtcblx0ICAgIGlmICh0aGlzLmFjdGl2ZU9wdGlvbikge1xuXHQgICAgICByZW1vdmVDbGFzc2VzKHRoaXMuYWN0aXZlT3B0aW9uLCAnYWN0aXZlJyk7XG5cdCAgICAgIHNldEF0dHIodGhpcy5hY3RpdmVPcHRpb24sIHtcblx0ICAgICAgICAnYXJpYS1zZWxlY3RlZCc6IG51bGxcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuYWN0aXZlT3B0aW9uID0gbnVsbDtcblx0ICAgIHNldEF0dHIodGhpcy5mb2N1c19ub2RlLCB7XG5cdCAgICAgICdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnOiBudWxsXG5cdCAgICB9KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2VsZWN0cyBhbGwgaXRlbXMgKENUUkwgKyBBKS5cblx0ICAgKi9cblxuXG5cdCAgc2VsZWN0QWxsKCkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJykgcmV0dXJuO1xuXHQgICAgY29uc3QgYWN0aXZlSXRlbXMgPSBzZWxmLmNvbnRyb2xDaGlsZHJlbigpO1xuXHQgICAgaWYgKCFhY3RpdmVJdGVtcy5sZW5ndGgpIHJldHVybjtcblx0ICAgIHNlbGYuaGlkZUlucHV0KCk7XG5cdCAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICBzZWxmLmFjdGl2ZUl0ZW1zID0gYWN0aXZlSXRlbXM7XG5cdCAgICBpdGVyYXRlJDEoYWN0aXZlSXRlbXMsIGl0ZW0gPT4ge1xuXHQgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW1DbGFzcyhpdGVtKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBjb250cm9sX2lucHV0IHNob3VsZCBiZSBpbiBhIGhpZGRlbiBvciB2aXNpYmxlIHN0YXRlXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgaW5wdXRTdGF0ZSgpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIGlmICghc2VsZi5jb250cm9sLmNvbnRhaW5zKHNlbGYuY29udHJvbF9pbnB1dCkpIHJldHVybjtcblx0ICAgIHNldEF0dHIoc2VsZi5jb250cm9sX2lucHV0LCB7XG5cdCAgICAgIHBsYWNlaG9sZGVyOiBzZWxmLnNldHRpbmdzLnBsYWNlaG9sZGVyXG5cdCAgICB9KTtcblxuXHQgICAgaWYgKHNlbGYuYWN0aXZlSXRlbXMubGVuZ3RoID4gMCB8fCAhc2VsZi5pc0ZvY3VzZWQgJiYgc2VsZi5zZXR0aW5ncy5oaWRlUGxhY2Vob2xkZXIgJiYgc2VsZi5pdGVtcy5sZW5ndGggPiAwKSB7XG5cdCAgICAgIHNlbGYuc2V0VGV4dGJveFZhbHVlKCk7XG5cdCAgICAgIHNlbGYuaXNJbnB1dEhpZGRlbiA9IHRydWU7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5oaWRlUGxhY2Vob2xkZXIgJiYgc2VsZi5pdGVtcy5sZW5ndGggPiAwKSB7XG5cdCAgICAgICAgc2V0QXR0cihzZWxmLmNvbnRyb2xfaW5wdXQsIHtcblx0ICAgICAgICAgIHBsYWNlaG9sZGVyOiAnJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cblx0ICAgICAgc2VsZi5pc0lucHV0SGlkZGVuID0gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYud3JhcHBlci5jbGFzc0xpc3QudG9nZ2xlKCdpbnB1dC1oaWRkZW4nLCBzZWxmLmlzSW5wdXRIaWRkZW4pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBIaWRlcyB0aGUgaW5wdXQgZWxlbWVudCBvdXQgb2Ygdmlldywgd2hpbGVcblx0ICAgKiByZXRhaW5pbmcgaXRzIGZvY3VzLlxuXHQgICAqIEBkZXByZWNhdGVkIDEuM1xuXHQgICAqL1xuXG5cblx0ICBoaWRlSW5wdXQoKSB7XG5cdCAgICB0aGlzLmlucHV0U3RhdGUoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVzdG9yZXMgaW5wdXQgdmlzaWJpbGl0eS5cblx0ICAgKiBAZGVwcmVjYXRlZCAxLjNcblx0ICAgKi9cblxuXG5cdCAgc2hvd0lucHV0KCkge1xuXHQgICAgdGhpcy5pbnB1dFN0YXRlKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEdldCB0aGUgaW5wdXQgdmFsdWVcblx0ICAgKi9cblxuXG5cdCAgaW5wdXRWYWx1ZSgpIHtcblx0ICAgIHJldHVybiB0aGlzLmNvbnRyb2xfaW5wdXQudmFsdWUudHJpbSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBHaXZlcyB0aGUgY29udHJvbCBmb2N1cy5cblx0ICAgKi9cblxuXG5cdCAgZm9jdXMoKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBpZiAoc2VsZi5pc0Rpc2FibGVkKSByZXR1cm47XG5cdCAgICBzZWxmLmlnbm9yZUZvY3VzID0gdHJ1ZTtcblxuXHQgICAgaWYgKHNlbGYuY29udHJvbF9pbnB1dC5vZmZzZXRXaWR0aCkge1xuXHQgICAgICBzZWxmLmNvbnRyb2xfaW5wdXQuZm9jdXMoKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYuZm9jdXNfbm9kZS5mb2N1cygpO1xuXHQgICAgfVxuXG5cdCAgICBzZXRUaW1lb3V0KCgpID0+IHtcblx0ICAgICAgc2VsZi5pZ25vcmVGb2N1cyA9IGZhbHNlO1xuXHQgICAgICBzZWxmLm9uRm9jdXMoKTtcblx0ICAgIH0sIDApO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBGb3JjZXMgdGhlIGNvbnRyb2wgb3V0IG9mIGZvY3VzLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGJsdXIoKSB7XG5cdCAgICB0aGlzLmZvY3VzX25vZGUuYmx1cigpO1xuXHQgICAgdGhpcy5vbkJsdXIoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgc2NvcmVzIGFuIG9iamVjdFxuXHQgICAqIHRvIHNob3cgaG93IGdvb2Qgb2YgYSBtYXRjaCBpdCBpcyB0byB0aGVcblx0ICAgKiBwcm92aWRlZCBxdWVyeS5cblx0ICAgKlxuXHQgICAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuXHQgICAqL1xuXG5cblx0ICBnZXRTY29yZUZ1bmN0aW9uKHF1ZXJ5KSB7XG5cdCAgICByZXR1cm4gdGhpcy5zaWZ0ZXIuZ2V0U2NvcmVGdW5jdGlvbihxdWVyeSwgdGhpcy5nZXRTZWFyY2hPcHRpb25zKCkpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIHNlYXJjaCBvcHRpb25zIGZvciBzaWZ0ZXIgKHRoZSBzeXN0ZW1cblx0ICAgKiBmb3Igc2NvcmluZyBhbmQgc29ydGluZyByZXN1bHRzKS5cblx0ICAgKlxuXHQgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL29yY2hpZGpzL3NpZnRlci5qc1xuXHQgICAqIEByZXR1cm4ge29iamVjdH1cblx0ICAgKi9cblxuXG5cdCAgZ2V0U2VhcmNoT3B0aW9ucygpIHtcblx0ICAgIHZhciBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3M7XG5cdCAgICB2YXIgc29ydCA9IHNldHRpbmdzLnNvcnRGaWVsZDtcblxuXHQgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5zb3J0RmllbGQgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgIHNvcnQgPSBbe1xuXHQgICAgICAgIGZpZWxkOiBzZXR0aW5ncy5zb3J0RmllbGRcblx0ICAgICAgfV07XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB7XG5cdCAgICAgIGZpZWxkczogc2V0dGluZ3Muc2VhcmNoRmllbGQsXG5cdCAgICAgIGNvbmp1bmN0aW9uOiBzZXR0aW5ncy5zZWFyY2hDb25qdW5jdGlvbixcblx0ICAgICAgc29ydDogc29ydCxcblx0ICAgICAgbmVzdGluZzogc2V0dGluZ3MubmVzdGluZ1xuXHQgICAgfTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2VhcmNoZXMgdGhyb3VnaCBhdmFpbGFibGUgb3B0aW9ucyBhbmQgcmV0dXJuc1xuXHQgICAqIGEgc29ydGVkIGFycmF5IG9mIG1hdGNoZXMuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2VhcmNoKHF1ZXJ5KSB7XG5cdCAgICB2YXIgcmVzdWx0LCBjYWxjdWxhdGVTY29yZTtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBvcHRpb25zID0gdGhpcy5nZXRTZWFyY2hPcHRpb25zKCk7IC8vIHZhbGlkYXRlIHVzZXItcHJvdmlkZWQgcmVzdWx0IHNjb3JpbmcgZnVuY3Rpb25cblxuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3Muc2NvcmUpIHtcblx0ICAgICAgY2FsY3VsYXRlU2NvcmUgPSBzZWxmLnNldHRpbmdzLnNjb3JlLmNhbGwoc2VsZiwgcXVlcnkpO1xuXG5cdCAgICAgIGlmICh0eXBlb2YgY2FsY3VsYXRlU2NvcmUgIT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvbSBTZWxlY3QgXCJzY29yZVwiIHNldHRpbmcgbXVzdCBiZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGZ1bmN0aW9uJyk7XG5cdCAgICAgIH1cblx0ICAgIH0gLy8gcGVyZm9ybSBzZWFyY2hcblxuXG5cdCAgICBpZiAocXVlcnkgIT09IHNlbGYubGFzdFF1ZXJ5KSB7XG5cdCAgICAgIHNlbGYubGFzdFF1ZXJ5ID0gcXVlcnk7XG5cdCAgICAgIHJlc3VsdCA9IHNlbGYuc2lmdGVyLnNlYXJjaChxdWVyeSwgT2JqZWN0LmFzc2lnbihvcHRpb25zLCB7XG5cdCAgICAgICAgc2NvcmU6IGNhbGN1bGF0ZVNjb3JlXG5cdCAgICAgIH0pKTtcblx0ICAgICAgc2VsZi5jdXJyZW50UmVzdWx0cyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJlc3VsdCA9IE9iamVjdC5hc3NpZ24oe30sIHNlbGYuY3VycmVudFJlc3VsdHMpO1xuXHQgICAgfSAvLyBmaWx0ZXIgb3V0IHNlbGVjdGVkIGl0ZW1zXG5cblxuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MuaGlkZVNlbGVjdGVkKSB7XG5cdCAgICAgIHJlc3VsdC5pdGVtcyA9IHJlc3VsdC5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XG5cdCAgICAgICAgbGV0IGhhc2hlZCA9IGhhc2hfa2V5KGl0ZW0uaWQpO1xuXHQgICAgICAgIHJldHVybiAhKGhhc2hlZCAmJiBzZWxmLml0ZW1zLmluZGV4T2YoaGFzaGVkKSAhPT0gLTEpO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHJlc3VsdDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVmcmVzaGVzIHRoZSBsaXN0IG9mIGF2YWlsYWJsZSBvcHRpb25zIHNob3duXG5cdCAgICogaW4gdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93biBtZW51LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHJlZnJlc2hPcHRpb25zKHRyaWdnZXJEcm9wZG93biA9IHRydWUpIHtcblx0ICAgIHZhciBpLCBqLCBrLCBuLCBvcHRncm91cCwgb3B0Z3JvdXBzLCBodG1sLCBoYXNfY3JlYXRlX29wdGlvbiwgYWN0aXZlX2dyb3VwO1xuXHQgICAgdmFyIGNyZWF0ZTtcblx0ICAgIGNvbnN0IGdyb3VwcyA9IHt9O1xuXHQgICAgY29uc3QgZ3JvdXBzX29yZGVyID0gW107XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgcXVlcnkgPSBzZWxmLmlucHV0VmFsdWUoKTtcblx0ICAgIGNvbnN0IHNhbWVfcXVlcnkgPSBxdWVyeSA9PT0gc2VsZi5sYXN0UXVlcnkgfHwgcXVlcnkgPT0gJycgJiYgc2VsZi5sYXN0UXVlcnkgPT0gbnVsbDtcblx0ICAgIHZhciByZXN1bHRzID0gc2VsZi5zZWFyY2gocXVlcnkpO1xuXHQgICAgdmFyIGFjdGl2ZV9vcHRpb24gPSBudWxsO1xuXHQgICAgdmFyIHNob3dfZHJvcGRvd24gPSBzZWxmLnNldHRpbmdzLnNob3VsZE9wZW4gfHwgZmFsc2U7XG5cdCAgICB2YXIgZHJvcGRvd25fY29udGVudCA9IHNlbGYuZHJvcGRvd25fY29udGVudDtcblxuXHQgICAgaWYgKHNhbWVfcXVlcnkpIHtcblx0ICAgICAgYWN0aXZlX29wdGlvbiA9IHNlbGYuYWN0aXZlT3B0aW9uO1xuXG5cdCAgICAgIGlmIChhY3RpdmVfb3B0aW9uKSB7XG5cdCAgICAgICAgYWN0aXZlX2dyb3VwID0gYWN0aXZlX29wdGlvbi5jbG9zZXN0KCdbZGF0YS1ncm91cF0nKTtcblx0ICAgICAgfVxuXHQgICAgfSAvLyBidWlsZCBtYXJrdXBcblxuXG5cdCAgICBuID0gcmVzdWx0cy5pdGVtcy5sZW5ndGg7XG5cblx0ICAgIGlmICh0eXBlb2Ygc2VsZi5zZXR0aW5ncy5tYXhPcHRpb25zID09PSAnbnVtYmVyJykge1xuXHQgICAgICBuID0gTWF0aC5taW4obiwgc2VsZi5zZXR0aW5ncy5tYXhPcHRpb25zKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKG4gPiAwKSB7XG5cdCAgICAgIHNob3dfZHJvcGRvd24gPSB0cnVlO1xuXHQgICAgfSAvLyByZW5kZXIgYW5kIGdyb3VwIGF2YWlsYWJsZSBvcHRpb25zIGluZGl2aWR1YWxseVxuXG5cblx0ICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHtcblx0ICAgICAgLy8gZ2V0IG9wdGlvbiBkb20gZWxlbWVudFxuXHQgICAgICBsZXQgaXRlbSA9IHJlc3VsdHMuaXRlbXNbaV07XG5cdCAgICAgIGlmICghaXRlbSkgY29udGludWU7XG5cdCAgICAgIGxldCBvcHRfdmFsdWUgPSBpdGVtLmlkO1xuXHQgICAgICBsZXQgb3B0aW9uID0gc2VsZi5vcHRpb25zW29wdF92YWx1ZV07XG5cdCAgICAgIGlmIChvcHRpb24gPT09IHVuZGVmaW5lZCkgY29udGludWU7XG5cdCAgICAgIGxldCBvcHRfaGFzaCA9IGdldF9oYXNoKG9wdF92YWx1ZSk7XG5cdCAgICAgIGxldCBvcHRpb25fZWwgPSBzZWxmLmdldE9wdGlvbihvcHRfaGFzaCwgdHJ1ZSk7IC8vIHRvZ2dsZSAnc2VsZWN0ZWQnIGNsYXNzXG5cblx0ICAgICAgaWYgKCFzZWxmLnNldHRpbmdzLmhpZGVTZWxlY3RlZCkge1xuXHQgICAgICAgIG9wdGlvbl9lbC5jbGFzc0xpc3QudG9nZ2xlKCdzZWxlY3RlZCcsIHNlbGYuaXRlbXMuaW5jbHVkZXMob3B0X2hhc2gpKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIG9wdGdyb3VwID0gb3B0aW9uW3NlbGYuc2V0dGluZ3Mub3B0Z3JvdXBGaWVsZF0gfHwgJyc7XG5cdCAgICAgIG9wdGdyb3VwcyA9IEFycmF5LmlzQXJyYXkob3B0Z3JvdXApID8gb3B0Z3JvdXAgOiBbb3B0Z3JvdXBdO1xuXG5cdCAgICAgIGZvciAoaiA9IDAsIGsgPSBvcHRncm91cHMgJiYgb3B0Z3JvdXBzLmxlbmd0aDsgaiA8IGs7IGorKykge1xuXHQgICAgICAgIG9wdGdyb3VwID0gb3B0Z3JvdXBzW2pdO1xuXG5cdCAgICAgICAgaWYgKCFzZWxmLm9wdGdyb3Vwcy5oYXNPd25Qcm9wZXJ0eShvcHRncm91cCkpIHtcblx0ICAgICAgICAgIG9wdGdyb3VwID0gJyc7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgbGV0IGdyb3VwX2ZyYWdtZW50ID0gZ3JvdXBzW29wdGdyb3VwXTtcblxuXHQgICAgICAgIGlmIChncm91cF9mcmFnbWVudCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICBncm91cF9mcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0ICAgICAgICAgIGdyb3Vwc19vcmRlci5wdXNoKG9wdGdyb3VwKTtcblx0ICAgICAgICB9IC8vIG5vZGVzIGNhbiBvbmx5IGhhdmUgb25lIHBhcmVudCwgc28gaWYgdGhlIG9wdGlvbiBpcyBpbiBtdXRwbGUgZ3JvdXBzLCB3ZSBuZWVkIGEgY2xvbmVcblxuXG5cdCAgICAgICAgaWYgKGogPiAwKSB7XG5cdCAgICAgICAgICBvcHRpb25fZWwgPSBvcHRpb25fZWwuY2xvbmVOb2RlKHRydWUpO1xuXHQgICAgICAgICAgc2V0QXR0cihvcHRpb25fZWwsIHtcblx0ICAgICAgICAgICAgaWQ6IG9wdGlvbi4kaWQgKyAnLWNsb25lLScgKyBqLFxuXHQgICAgICAgICAgICAnYXJpYS1zZWxlY3RlZCc6IG51bGxcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgb3B0aW9uX2VsLmNsYXNzTGlzdC5hZGQoJ3RzLWNsb25lZCcpO1xuXHQgICAgICAgICAgcmVtb3ZlQ2xhc3NlcyhvcHRpb25fZWwsICdhY3RpdmUnKTsgLy8gbWFrZSBzdXJlIHdlIGtlZXAgdGhlIGFjdGl2ZU9wdGlvbiBpbiB0aGUgc2FtZSBncm91cFxuXG5cdCAgICAgICAgICBpZiAoc2VsZi5hY3RpdmVPcHRpb24gJiYgc2VsZi5hY3RpdmVPcHRpb24uZGF0YXNldC52YWx1ZSA9PSBvcHRfdmFsdWUpIHtcblx0ICAgICAgICAgICAgaWYgKGFjdGl2ZV9ncm91cCAmJiBhY3RpdmVfZ3JvdXAuZGF0YXNldC5ncm91cCA9PT0gb3B0Z3JvdXAudG9TdHJpbmcoKSkge1xuXHQgICAgICAgICAgICAgIGFjdGl2ZV9vcHRpb24gPSBvcHRpb25fZWw7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBncm91cF9mcmFnbWVudC5hcHBlbmRDaGlsZChvcHRpb25fZWwpO1xuXHQgICAgICAgIGdyb3Vwc1tvcHRncm91cF0gPSBncm91cF9mcmFnbWVudDtcblx0ICAgICAgfVxuXHQgICAgfSAvLyBzb3J0IG9wdGdyb3Vwc1xuXG5cblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLmxvY2tPcHRncm91cE9yZGVyKSB7XG5cdCAgICAgIGdyb3Vwc19vcmRlci5zb3J0KChhLCBiKSA9PiB7XG5cdCAgICAgICAgY29uc3QgZ3JwX2EgPSBzZWxmLm9wdGdyb3Vwc1thXTtcblx0ICAgICAgICBjb25zdCBncnBfYiA9IHNlbGYub3B0Z3JvdXBzW2JdO1xuXHQgICAgICAgIGNvbnN0IGFfb3JkZXIgPSBncnBfYSAmJiBncnBfYS4kb3JkZXIgfHwgMDtcblx0ICAgICAgICBjb25zdCBiX29yZGVyID0gZ3JwX2IgJiYgZ3JwX2IuJG9yZGVyIHx8IDA7XG5cdCAgICAgICAgcmV0dXJuIGFfb3JkZXIgLSBiX29yZGVyO1xuXHQgICAgICB9KTtcblx0ICAgIH0gLy8gcmVuZGVyIG9wdGdyb3VwIGhlYWRlcnMgJiBqb2luIGdyb3Vwc1xuXG5cblx0ICAgIGh0bWwgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdCAgICBpdGVyYXRlJDEoZ3JvdXBzX29yZGVyLCBvcHRncm91cCA9PiB7XG5cdCAgICAgIGxldCBncm91cF9mcmFnbWVudCA9IGdyb3Vwc1tvcHRncm91cF07XG5cdCAgICAgIGlmICghZ3JvdXBfZnJhZ21lbnQgfHwgIWdyb3VwX2ZyYWdtZW50LmNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuO1xuXHQgICAgICBsZXQgZ3JvdXBfaGVhZGluZyA9IHNlbGYub3B0Z3JvdXBzW29wdGdyb3VwXTtcblxuXHQgICAgICBpZiAoZ3JvdXBfaGVhZGluZyAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgbGV0IGdyb3VwX29wdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdCAgICAgICAgbGV0IGhlYWRlciA9IHNlbGYucmVuZGVyKCdvcHRncm91cF9oZWFkZXInLCBncm91cF9oZWFkaW5nKTtcblx0ICAgICAgICBhcHBlbmQoZ3JvdXBfb3B0aW9ucywgaGVhZGVyKTtcblx0ICAgICAgICBhcHBlbmQoZ3JvdXBfb3B0aW9ucywgZ3JvdXBfZnJhZ21lbnQpO1xuXHQgICAgICAgIGxldCBncm91cF9odG1sID0gc2VsZi5yZW5kZXIoJ29wdGdyb3VwJywge1xuXHQgICAgICAgICAgZ3JvdXA6IGdyb3VwX2hlYWRpbmcsXG5cdCAgICAgICAgICBvcHRpb25zOiBncm91cF9vcHRpb25zXG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgYXBwZW5kKGh0bWwsIGdyb3VwX2h0bWwpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGFwcGVuZChodG1sLCBncm91cF9mcmFnbWVudCk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgICAgZHJvcGRvd25fY29udGVudC5pbm5lckhUTUwgPSAnJztcblx0ICAgIGFwcGVuZChkcm9wZG93bl9jb250ZW50LCBodG1sKTsgLy8gaGlnaGxpZ2h0IG1hdGNoaW5nIHRlcm1zIGlubGluZVxuXG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5oaWdobGlnaHQpIHtcblx0ICAgICAgcmVtb3ZlSGlnaGxpZ2h0KGRyb3Bkb3duX2NvbnRlbnQpO1xuXG5cdCAgICAgIGlmIChyZXN1bHRzLnF1ZXJ5Lmxlbmd0aCAmJiByZXN1bHRzLnRva2Vucy5sZW5ndGgpIHtcblx0ICAgICAgICBpdGVyYXRlJDEocmVzdWx0cy50b2tlbnMsIHRvayA9PiB7XG5cdCAgICAgICAgICBoaWdobGlnaHQoZHJvcGRvd25fY29udGVudCwgdG9rLnJlZ2V4KTtcblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgfSAvLyBoZWxwZXIgbWV0aG9kIGZvciBhZGRpbmcgdGVtcGxhdGVzIHRvIGRyb3Bkb3duXG5cblxuXHQgICAgdmFyIGFkZF90ZW1wbGF0ZSA9IHRlbXBsYXRlID0+IHtcblx0ICAgICAgbGV0IGNvbnRlbnQgPSBzZWxmLnJlbmRlcih0ZW1wbGF0ZSwge1xuXHQgICAgICAgIGlucHV0OiBxdWVyeVxuXHQgICAgICB9KTtcblxuXHQgICAgICBpZiAoY29udGVudCkge1xuXHQgICAgICAgIHNob3dfZHJvcGRvd24gPSB0cnVlO1xuXHQgICAgICAgIGRyb3Bkb3duX2NvbnRlbnQuaW5zZXJ0QmVmb3JlKGNvbnRlbnQsIGRyb3Bkb3duX2NvbnRlbnQuZmlyc3RDaGlsZCk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gY29udGVudDtcblx0ICAgIH07IC8vIGFkZCBsb2FkaW5nIG1lc3NhZ2VcblxuXG5cdCAgICBpZiAoc2VsZi5sb2FkaW5nKSB7XG5cdCAgICAgIGFkZF90ZW1wbGF0ZSgnbG9hZGluZycpOyAvLyBpbnZhbGlkIHF1ZXJ5XG5cdCAgICB9IGVsc2UgaWYgKCFzZWxmLnNldHRpbmdzLnNob3VsZExvYWQuY2FsbChzZWxmLCBxdWVyeSkpIHtcblx0ICAgICAgYWRkX3RlbXBsYXRlKCdub3RfbG9hZGluZycpOyAvLyBhZGQgbm9fcmVzdWx0cyBtZXNzYWdlXG5cdCAgICB9IGVsc2UgaWYgKHJlc3VsdHMuaXRlbXMubGVuZ3RoID09PSAwKSB7XG5cdCAgICAgIGFkZF90ZW1wbGF0ZSgnbm9fcmVzdWx0cycpO1xuXHQgICAgfSAvLyBhZGQgY3JlYXRlIG9wdGlvblxuXG5cblx0ICAgIGhhc19jcmVhdGVfb3B0aW9uID0gc2VsZi5jYW5DcmVhdGUocXVlcnkpO1xuXG5cdCAgICBpZiAoaGFzX2NyZWF0ZV9vcHRpb24pIHtcblx0ICAgICAgY3JlYXRlID0gYWRkX3RlbXBsYXRlKCdvcHRpb25fY3JlYXRlJyk7XG5cdCAgICB9IC8vIGFjdGl2YXRlXG5cblxuXHQgICAgc2VsZi5oYXNPcHRpb25zID0gcmVzdWx0cy5pdGVtcy5sZW5ndGggPiAwIHx8IGhhc19jcmVhdGVfb3B0aW9uO1xuXG5cdCAgICBpZiAoc2hvd19kcm9wZG93bikge1xuXHQgICAgICBpZiAocmVzdWx0cy5pdGVtcy5sZW5ndGggPiAwKSB7XG5cdCAgICAgICAgaWYgKCFhY3RpdmVfb3B0aW9uICYmIHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScgJiYgc2VsZi5pdGVtc1swXSAhPSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgIGFjdGl2ZV9vcHRpb24gPSBzZWxmLmdldE9wdGlvbihzZWxmLml0ZW1zWzBdKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZiAoIWRyb3Bkb3duX2NvbnRlbnQuY29udGFpbnMoYWN0aXZlX29wdGlvbikpIHtcblx0ICAgICAgICAgIGxldCBhY3RpdmVfaW5kZXggPSAwO1xuXG5cdCAgICAgICAgICBpZiAoY3JlYXRlICYmICFzZWxmLnNldHRpbmdzLmFkZFByZWNlZGVuY2UpIHtcblx0ICAgICAgICAgICAgYWN0aXZlX2luZGV4ID0gMTtcblx0ICAgICAgICAgIH1cblxuXHQgICAgICAgICAgYWN0aXZlX29wdGlvbiA9IHNlbGYuc2VsZWN0YWJsZSgpW2FjdGl2ZV9pbmRleF07XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGVsc2UgaWYgKGNyZWF0ZSkge1xuXHQgICAgICAgIGFjdGl2ZV9vcHRpb24gPSBjcmVhdGU7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAodHJpZ2dlckRyb3Bkb3duICYmICFzZWxmLmlzT3Blbikge1xuXHQgICAgICAgIHNlbGYub3BlbigpO1xuXHQgICAgICAgIHNlbGYuc2Nyb2xsVG9PcHRpb24oYWN0aXZlX29wdGlvbiwgJ2F1dG8nKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlbGYuc2V0QWN0aXZlT3B0aW9uKGFjdGl2ZV9vcHRpb24pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2VsZi5jbGVhckFjdGl2ZU9wdGlvbigpO1xuXG5cdCAgICAgIGlmICh0cmlnZ2VyRHJvcGRvd24gJiYgc2VsZi5pc09wZW4pIHtcblx0ICAgICAgICBzZWxmLmNsb3NlKGZhbHNlKTsgLy8gaWYgY3JlYXRlX29wdGlvbj1udWxsLCB3ZSB3YW50IHRoZSBkcm9wZG93biB0byBjbG9zZSBidXQgbm90IHJlc2V0IHRoZSB0ZXh0Ym94IHZhbHVlXG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJuIGxpc3Qgb2Ygc2VsZWN0YWJsZSBvcHRpb25zXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2VsZWN0YWJsZSgpIHtcblx0ICAgIHJldHVybiB0aGlzLmRyb3Bkb3duX2NvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc2VsZWN0YWJsZV0nKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQWRkcyBhbiBhdmFpbGFibGUgb3B0aW9uLiBJZiBpdCBhbHJlYWR5IGV4aXN0cyxcblx0ICAgKiBub3RoaW5nIHdpbGwgaGFwcGVuLiBOb3RlOiB0aGlzIGRvZXMgbm90IHJlZnJlc2hcblx0ICAgKiB0aGUgb3B0aW9ucyBsaXN0IGRyb3Bkb3duICh1c2UgYHJlZnJlc2hPcHRpb25zYFxuXHQgICAqIGZvciB0aGF0KS5cblx0ICAgKlxuXHQgICAqIFVzYWdlOlxuXHQgICAqXG5cdCAgICogICB0aGlzLmFkZE9wdGlvbihkYXRhKVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGFkZE9wdGlvbihkYXRhLCB1c2VyX2NyZWF0ZWQgPSBmYWxzZSkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7IC8vIEBkZXByZWNhdGVkIDEuNy43XG5cdCAgICAvLyB1c2UgYWRkT3B0aW9ucyggYXJyYXksIHVzZXJfY3JlYXRlZCApIGZvciBhZGRpbmcgbXVsdGlwbGUgb3B0aW9uc1xuXG5cdCAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuXHQgICAgICBzZWxmLmFkZE9wdGlvbnMoZGF0YSwgdXNlcl9jcmVhdGVkKTtcblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICBjb25zdCBrZXkgPSBoYXNoX2tleShkYXRhW3NlbGYuc2V0dGluZ3MudmFsdWVGaWVsZF0pO1xuXG5cdCAgICBpZiAoa2V5ID09PSBudWxsIHx8IHNlbGYub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgZGF0YS4kb3JkZXIgPSBkYXRhLiRvcmRlciB8fCArK3NlbGYub3JkZXI7XG5cdCAgICBkYXRhLiRpZCA9IHNlbGYuaW5wdXRJZCArICctb3B0LScgKyBkYXRhLiRvcmRlcjtcblx0ICAgIHNlbGYub3B0aW9uc1trZXldID0gZGF0YTtcblx0ICAgIHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblxuXHQgICAgaWYgKHVzZXJfY3JlYXRlZCkge1xuXHQgICAgICBzZWxmLnVzZXJPcHRpb25zW2tleV0gPSB1c2VyX2NyZWF0ZWQ7XG5cdCAgICAgIHNlbGYudHJpZ2dlcignb3B0aW9uX2FkZCcsIGtleSwgZGF0YSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBrZXk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEFkZCBtdWx0aXBsZSBvcHRpb25zXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgYWRkT3B0aW9ucyhkYXRhLCB1c2VyX2NyZWF0ZWQgPSBmYWxzZSkge1xuXHQgICAgaXRlcmF0ZSQxKGRhdGEsIGRhdCA9PiB7XG5cdCAgICAgIHRoaXMuYWRkT3B0aW9uKGRhdCwgdXNlcl9jcmVhdGVkKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBAZGVwcmVjYXRlZCAxLjcuN1xuXHQgICAqL1xuXG5cblx0ICByZWdpc3Rlck9wdGlvbihkYXRhKSB7XG5cdCAgICByZXR1cm4gdGhpcy5hZGRPcHRpb24oZGF0YSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlZ2lzdGVycyBhbiBvcHRpb24gZ3JvdXAgdG8gdGhlIHBvb2wgb2Ygb3B0aW9uIGdyb3Vwcy5cblx0ICAgKlxuXHQgICAqIEByZXR1cm4ge2Jvb2xlYW58c3RyaW5nfVxuXHQgICAqL1xuXG5cblx0ICByZWdpc3Rlck9wdGlvbkdyb3VwKGRhdGEpIHtcblx0ICAgIHZhciBrZXkgPSBoYXNoX2tleShkYXRhW3RoaXMuc2V0dGluZ3Mub3B0Z3JvdXBWYWx1ZUZpZWxkXSk7XG5cdCAgICBpZiAoa2V5ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdCAgICBkYXRhLiRvcmRlciA9IGRhdGEuJG9yZGVyIHx8ICsrdGhpcy5vcmRlcjtcblx0ICAgIHRoaXMub3B0Z3JvdXBzW2tleV0gPSBkYXRhO1xuXHQgICAgcmV0dXJuIGtleTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVnaXN0ZXJzIGEgbmV3IG9wdGdyb3VwIGZvciBvcHRpb25zXG5cdCAgICogdG8gYmUgYnVja2V0ZWQgaW50by5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBhZGRPcHRpb25Hcm91cChpZCwgZGF0YSkge1xuXHQgICAgdmFyIGhhc2hlZF9pZDtcblx0ICAgIGRhdGFbdGhpcy5zZXR0aW5ncy5vcHRncm91cFZhbHVlRmllbGRdID0gaWQ7XG5cblx0ICAgIGlmIChoYXNoZWRfaWQgPSB0aGlzLnJlZ2lzdGVyT3B0aW9uR3JvdXAoZGF0YSkpIHtcblx0ICAgICAgdGhpcy50cmlnZ2VyKCdvcHRncm91cF9hZGQnLCBoYXNoZWRfaWQsIGRhdGEpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZW1vdmVzIGFuIGV4aXN0aW5nIG9wdGlvbiBncm91cC5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICByZW1vdmVPcHRpb25Hcm91cChpZCkge1xuXHQgICAgaWYgKHRoaXMub3B0Z3JvdXBzLmhhc093blByb3BlcnR5KGlkKSkge1xuXHQgICAgICBkZWxldGUgdGhpcy5vcHRncm91cHNbaWRdO1xuXHQgICAgICB0aGlzLmNsZWFyQ2FjaGUoKTtcblx0ICAgICAgdGhpcy50cmlnZ2VyKCdvcHRncm91cF9yZW1vdmUnLCBpZCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIENsZWFycyBhbGwgZXhpc3Rpbmcgb3B0aW9uIGdyb3Vwcy5cblx0ICAgKi9cblxuXG5cdCAgY2xlYXJPcHRpb25Hcm91cHMoKSB7XG5cdCAgICB0aGlzLm9wdGdyb3VwcyA9IHt9O1xuXHQgICAgdGhpcy5jbGVhckNhY2hlKCk7XG5cdCAgICB0aGlzLnRyaWdnZXIoJ29wdGdyb3VwX2NsZWFyJyk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFVwZGF0ZXMgYW4gb3B0aW9uIGF2YWlsYWJsZSBmb3Igc2VsZWN0aW9uLiBJZlxuXHQgICAqIGl0IGlzIHZpc2libGUgaW4gdGhlIHNlbGVjdGVkIGl0ZW1zIG9yIG9wdGlvbnNcblx0ICAgKiBkcm9wZG93biwgaXQgd2lsbCBiZSByZS1yZW5kZXJlZCBhdXRvbWF0aWNhbGx5LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHVwZGF0ZU9wdGlvbih2YWx1ZSwgZGF0YSkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgaXRlbV9uZXc7XG5cdCAgICB2YXIgaW5kZXhfaXRlbTtcblx0ICAgIGNvbnN0IHZhbHVlX29sZCA9IGhhc2hfa2V5KHZhbHVlKTtcblx0ICAgIGNvbnN0IHZhbHVlX25ldyA9IGhhc2hfa2V5KGRhdGFbc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXSk7IC8vIHNhbml0eSBjaGVja3NcblxuXHQgICAgaWYgKHZhbHVlX29sZCA9PT0gbnVsbCkgcmV0dXJuO1xuXHQgICAgY29uc3QgZGF0YV9vbGQgPSBzZWxmLm9wdGlvbnNbdmFsdWVfb2xkXTtcblx0ICAgIGlmIChkYXRhX29sZCA9PSB1bmRlZmluZWQpIHJldHVybjtcblx0ICAgIGlmICh0eXBlb2YgdmFsdWVfbmV3ICE9PSAnc3RyaW5nJykgdGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBtdXN0IGJlIHNldCBpbiBvcHRpb24gZGF0YScpO1xuXHQgICAgY29uc3Qgb3B0aW9uID0gc2VsZi5nZXRPcHRpb24odmFsdWVfb2xkKTtcblx0ICAgIGNvbnN0IGl0ZW0gPSBzZWxmLmdldEl0ZW0odmFsdWVfb2xkKTtcblx0ICAgIGRhdGEuJG9yZGVyID0gZGF0YS4kb3JkZXIgfHwgZGF0YV9vbGQuJG9yZGVyO1xuXHQgICAgZGVsZXRlIHNlbGYub3B0aW9uc1t2YWx1ZV9vbGRdOyAvLyBpbnZhbGlkYXRlIHJlbmRlciBjYWNoZVxuXHQgICAgLy8gZG9uJ3QgcmVtb3ZlIGV4aXN0aW5nIG5vZGUgeWV0LCB3ZSdsbCByZW1vdmUgaXQgYWZ0ZXIgcmVwbGFjaW5nIGl0XG5cblx0ICAgIHNlbGYudW5jYWNoZVZhbHVlKHZhbHVlX25ldyk7XG5cdCAgICBzZWxmLm9wdGlvbnNbdmFsdWVfbmV3XSA9IGRhdGE7IC8vIHVwZGF0ZSB0aGUgb3B0aW9uIGlmIGl0J3MgaW4gdGhlIGRyb3Bkb3duXG5cblx0ICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgaWYgKHNlbGYuZHJvcGRvd25fY29udGVudC5jb250YWlucyhvcHRpb24pKSB7XG5cdCAgICAgICAgY29uc3Qgb3B0aW9uX25ldyA9IHNlbGYuX3JlbmRlcignb3B0aW9uJywgZGF0YSk7XG5cblx0ICAgICAgICByZXBsYWNlTm9kZShvcHRpb24sIG9wdGlvbl9uZXcpO1xuXG5cdCAgICAgICAgaWYgKHNlbGYuYWN0aXZlT3B0aW9uID09PSBvcHRpb24pIHtcblx0ICAgICAgICAgIHNlbGYuc2V0QWN0aXZlT3B0aW9uKG9wdGlvbl9uZXcpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIG9wdGlvbi5yZW1vdmUoKTtcblx0ICAgIH0gLy8gdXBkYXRlIHRoZSBpdGVtIGlmIHdlIGhhdmUgb25lXG5cblxuXHQgICAgaWYgKGl0ZW0pIHtcblx0ICAgICAgaW5kZXhfaXRlbSA9IHNlbGYuaXRlbXMuaW5kZXhPZih2YWx1ZV9vbGQpO1xuXG5cdCAgICAgIGlmIChpbmRleF9pdGVtICE9PSAtMSkge1xuXHQgICAgICAgIHNlbGYuaXRlbXMuc3BsaWNlKGluZGV4X2l0ZW0sIDEsIHZhbHVlX25ldyk7XG5cdCAgICAgIH1cblxuXHQgICAgICBpdGVtX25ldyA9IHNlbGYuX3JlbmRlcignaXRlbScsIGRhdGEpO1xuXHQgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSBhZGRDbGFzc2VzKGl0ZW1fbmV3LCAnYWN0aXZlJyk7XG5cdCAgICAgIHJlcGxhY2VOb2RlKGl0ZW0sIGl0ZW1fbmV3KTtcblx0ICAgIH0gLy8gaW52YWxpZGF0ZSBsYXN0IHF1ZXJ5IGJlY2F1c2Ugd2UgbWlnaHQgaGF2ZSB1cGRhdGVkIHRoZSBzb3J0RmllbGRcblxuXG5cdCAgICBzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlbW92ZXMgYSBzaW5nbGUgb3B0aW9uLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHJlbW92ZU9wdGlvbih2YWx1ZSwgc2lsZW50KSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIHZhbHVlID0gZ2V0X2hhc2godmFsdWUpO1xuXHQgICAgc2VsZi51bmNhY2hlVmFsdWUodmFsdWUpO1xuXHQgICAgZGVsZXRlIHNlbGYudXNlck9wdGlvbnNbdmFsdWVdO1xuXHQgICAgZGVsZXRlIHNlbGYub3B0aW9uc1t2YWx1ZV07XG5cdCAgICBzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cdCAgICBzZWxmLnRyaWdnZXIoJ29wdGlvbl9yZW1vdmUnLCB2YWx1ZSk7XG5cdCAgICBzZWxmLnJlbW92ZUl0ZW0odmFsdWUsIHNpbGVudCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIENsZWFycyBhbGwgb3B0aW9ucy5cblx0ICAgKi9cblxuXG5cdCAgY2xlYXJPcHRpb25zKGZpbHRlcikge1xuXHQgICAgY29uc3QgYm91bmRGaWx0ZXIgPSAoZmlsdGVyIHx8IHRoaXMuY2xlYXJGaWx0ZXIpLmJpbmQodGhpcyk7XG5cdCAgICB0aGlzLmxvYWRlZFNlYXJjaGVzID0ge307XG5cdCAgICB0aGlzLnVzZXJPcHRpb25zID0ge307XG5cdCAgICB0aGlzLmNsZWFyQ2FjaGUoKTtcblx0ICAgIGNvbnN0IHNlbGVjdGVkID0ge307XG5cdCAgICBpdGVyYXRlJDEodGhpcy5vcHRpb25zLCAob3B0aW9uLCBrZXkpID0+IHtcblx0ICAgICAgaWYgKGJvdW5kRmlsdGVyKG9wdGlvbiwga2V5KSkge1xuXHQgICAgICAgIHNlbGVjdGVkW2tleV0gPSBvcHRpb247XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgICAgdGhpcy5vcHRpb25zID0gdGhpcy5zaWZ0ZXIuaXRlbXMgPSBzZWxlY3RlZDtcblx0ICAgIHRoaXMubGFzdFF1ZXJ5ID0gbnVsbDtcblx0ICAgIHRoaXMudHJpZ2dlcignb3B0aW9uX2NsZWFyJyk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFVzZWQgYnkgY2xlYXJPcHRpb25zKCkgdG8gZGVjaWRlIHdoZXRoZXIgb3Igbm90IGFuIG9wdGlvbiBzaG91bGQgYmUgcmVtb3ZlZFxuXHQgICAqIFJldHVybiB0cnVlIHRvIGtlZXAgYW4gb3B0aW9uLCBmYWxzZSB0byByZW1vdmVcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjbGVhckZpbHRlcihvcHRpb24sIHZhbHVlKSB7XG5cdCAgICBpZiAodGhpcy5pdGVtcy5pbmRleE9mKHZhbHVlKSA+PSAwKSB7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgdGhlIGRvbSBlbGVtZW50IG9mIHRoZSBvcHRpb25cblx0ICAgKiBtYXRjaGluZyB0aGUgZ2l2ZW4gdmFsdWUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgZ2V0T3B0aW9uKHZhbHVlLCBjcmVhdGUgPSBmYWxzZSkge1xuXHQgICAgY29uc3QgaGFzaGVkID0gaGFzaF9rZXkodmFsdWUpO1xuXHQgICAgaWYgKGhhc2hlZCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdCAgICBjb25zdCBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaGFzaGVkXTtcblxuXHQgICAgaWYgKG9wdGlvbiAhPSB1bmRlZmluZWQpIHtcblx0ICAgICAgaWYgKG9wdGlvbi4kZGl2KSB7XG5cdCAgICAgICAgcmV0dXJuIG9wdGlvbi4kZGl2O1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGNyZWF0ZSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXIoJ29wdGlvbicsIG9wdGlvbik7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIG51bGw7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgdGhlIGRvbSBlbGVtZW50IG9mIHRoZSBuZXh0IG9yIHByZXZpb3VzIGRvbSBlbGVtZW50IG9mIHRoZSBzYW1lIHR5cGVcblx0ICAgKiBOb3RlOiBhZGphY2VudCBvcHRpb25zIG1heSBub3QgYmUgYWRqYWNlbnQgRE9NIGVsZW1lbnRzIChvcHRncm91cHMpXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgZ2V0QWRqYWNlbnQob3B0aW9uLCBkaXJlY3Rpb24sIHR5cGUgPSAnb3B0aW9uJykge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzLFxuXHQgICAgICAgIGFsbDtcblxuXHQgICAgaWYgKCFvcHRpb24pIHtcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cblx0ICAgIGlmICh0eXBlID09ICdpdGVtJykge1xuXHQgICAgICBhbGwgPSBzZWxmLmNvbnRyb2xDaGlsZHJlbigpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgYWxsID0gc2VsZi5kcm9wZG93bl9jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXNlbGVjdGFibGVdJyk7XG5cdCAgICB9XG5cblx0ICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIGlmIChhbGxbaV0gIT0gb3B0aW9uKSB7XG5cdCAgICAgICAgY29udGludWU7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoZGlyZWN0aW9uID4gMCkge1xuXHQgICAgICAgIHJldHVybiBhbGxbaSArIDFdO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGFsbFtpIC0gMV07XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBudWxsO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIHRoZSBkb20gZWxlbWVudCBvZiB0aGUgaXRlbVxuXHQgICAqIG1hdGNoaW5nIHRoZSBnaXZlbiB2YWx1ZS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBnZXRJdGVtKGl0ZW0pIHtcblx0ICAgIGlmICh0eXBlb2YgaXRlbSA9PSAnb2JqZWN0Jykge1xuXHQgICAgICByZXR1cm4gaXRlbTtcblx0ICAgIH1cblxuXHQgICAgdmFyIHZhbHVlID0gaGFzaF9rZXkoaXRlbSk7XG5cdCAgICByZXR1cm4gdmFsdWUgIT09IG51bGwgPyB0aGlzLmNvbnRyb2wucXVlcnlTZWxlY3RvcihgW2RhdGEtdmFsdWU9XCIke2FkZFNsYXNoZXModmFsdWUpfVwiXWApIDogbnVsbDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogXCJTZWxlY3RzXCIgbXVsdGlwbGUgaXRlbXMgYXQgb25jZS4gQWRkcyB0aGVtIHRvIHRoZSBsaXN0XG5cdCAgICogYXQgdGhlIGN1cnJlbnQgY2FyZXQgcG9zaXRpb24uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgYWRkSXRlbXModmFsdWVzLCBzaWxlbnQpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBpdGVtcyA9IEFycmF5LmlzQXJyYXkodmFsdWVzKSA/IHZhbHVlcyA6IFt2YWx1ZXNdO1xuXHQgICAgaXRlbXMgPSBpdGVtcy5maWx0ZXIoeCA9PiBzZWxmLml0ZW1zLmluZGV4T2YoeCkgPT09IC0xKTtcblx0ICAgIGNvbnN0IGxhc3RfaXRlbSA9IGl0ZW1zW2l0ZW1zLmxlbmd0aCAtIDFdO1xuXHQgICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0ICAgICAgc2VsZi5pc1BlbmRpbmcgPSBpdGVtICE9PSBsYXN0X2l0ZW07XG5cdCAgICAgIHNlbGYuYWRkSXRlbShpdGVtLCBzaWxlbnQpO1xuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFwiU2VsZWN0c1wiIGFuIGl0ZW0uIEFkZHMgaXQgdG8gdGhlIGxpc3Rcblx0ICAgKiBhdCB0aGUgY3VycmVudCBjYXJldCBwb3NpdGlvbi5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBhZGRJdGVtKHZhbHVlLCBzaWxlbnQpIHtcblx0ICAgIHZhciBldmVudHMgPSBzaWxlbnQgPyBbXSA6IFsnY2hhbmdlJywgJ2Ryb3Bkb3duX2Nsb3NlJ107XG5cdCAgICBkZWJvdW5jZV9ldmVudHModGhpcywgZXZlbnRzLCAoKSA9PiB7XG5cdCAgICAgIHZhciBpdGVtLCB3YXNGdWxsO1xuXHQgICAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgICAgY29uc3QgaW5wdXRNb2RlID0gc2VsZi5zZXR0aW5ncy5tb2RlO1xuXHQgICAgICBjb25zdCBoYXNoZWQgPSBoYXNoX2tleSh2YWx1ZSk7XG5cblx0ICAgICAgaWYgKGhhc2hlZCAmJiBzZWxmLml0ZW1zLmluZGV4T2YoaGFzaGVkKSAhPT0gLTEpIHtcblx0ICAgICAgICBpZiAoaW5wdXRNb2RlID09PSAnc2luZ2xlJykge1xuXHQgICAgICAgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmIChpbnB1dE1vZGUgPT09ICdzaW5nbGUnIHx8ICFzZWxmLnNldHRpbmdzLmR1cGxpY2F0ZXMpIHtcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoaGFzaGVkID09PSBudWxsIHx8ICFzZWxmLm9wdGlvbnMuaGFzT3duUHJvcGVydHkoaGFzaGVkKSkgcmV0dXJuO1xuXHQgICAgICBpZiAoaW5wdXRNb2RlID09PSAnc2luZ2xlJykgc2VsZi5jbGVhcihzaWxlbnQpO1xuXHQgICAgICBpZiAoaW5wdXRNb2RlID09PSAnbXVsdGknICYmIHNlbGYuaXNGdWxsKCkpIHJldHVybjtcblx0ICAgICAgaXRlbSA9IHNlbGYuX3JlbmRlcignaXRlbScsIHNlbGYub3B0aW9uc1toYXNoZWRdKTtcblxuXHQgICAgICBpZiAoc2VsZi5jb250cm9sLmNvbnRhaW5zKGl0ZW0pKSB7XG5cdCAgICAgICAgLy8gZHVwbGljYXRlc1xuXHQgICAgICAgIGl0ZW0gPSBpdGVtLmNsb25lTm9kZSh0cnVlKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHdhc0Z1bGwgPSBzZWxmLmlzRnVsbCgpO1xuXHQgICAgICBzZWxmLml0ZW1zLnNwbGljZShzZWxmLmNhcmV0UG9zLCAwLCBoYXNoZWQpO1xuXHQgICAgICBzZWxmLmluc2VydEF0Q2FyZXQoaXRlbSk7XG5cblx0ICAgICAgaWYgKHNlbGYuaXNTZXR1cCkge1xuXHQgICAgICAgIC8vIHVwZGF0ZSBtZW51IC8gcmVtb3ZlIHRoZSBvcHRpb24gKGlmIHRoaXMgaXMgbm90IG9uZSBpdGVtIGJlaW5nIGFkZGVkIGFzIHBhcnQgb2Ygc2VyaWVzKVxuXHQgICAgICAgIGlmICghc2VsZi5pc1BlbmRpbmcgJiYgc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQpIHtcblx0ICAgICAgICAgIGxldCBvcHRpb24gPSBzZWxmLmdldE9wdGlvbihoYXNoZWQpO1xuXHQgICAgICAgICAgbGV0IG5leHQgPSBzZWxmLmdldEFkamFjZW50KG9wdGlvbiwgMSk7XG5cblx0ICAgICAgICAgIGlmIChuZXh0KSB7XG5cdCAgICAgICAgICAgIHNlbGYuc2V0QWN0aXZlT3B0aW9uKG5leHQpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0gLy8gcmVmcmVzaE9wdGlvbnMgYWZ0ZXIgc2V0QWN0aXZlT3B0aW9uKCksXG5cdCAgICAgICAgLy8gb3RoZXJ3aXNlIHNldEFjdGl2ZU9wdGlvbigpIHdpbGwgYmUgY2FsbGVkIGJ5IHJlZnJlc2hPcHRpb25zKCkgd2l0aCB0aGUgd3JvbmcgdmFsdWVcblxuXG5cdCAgICAgICAgaWYgKCFzZWxmLmlzUGVuZGluZyAmJiAhc2VsZi5zZXR0aW5ncy5jbG9zZUFmdGVyU2VsZWN0KSB7XG5cdCAgICAgICAgICBzZWxmLnJlZnJlc2hPcHRpb25zKHNlbGYuaXNGb2N1c2VkICYmIGlucHV0TW9kZSAhPT0gJ3NpbmdsZScpO1xuXHQgICAgICAgIH0gLy8gaGlkZSB0aGUgbWVudSBpZiB0aGUgbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgaGF2ZSBiZWVuIHNlbGVjdGVkIG9yIG5vIG9wdGlvbnMgYXJlIGxlZnRcblxuXG5cdCAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3MuY2xvc2VBZnRlclNlbGVjdCAhPSBmYWxzZSAmJiBzZWxmLmlzRnVsbCgpKSB7XG5cdCAgICAgICAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICAgICAgfSBlbHNlIGlmICghc2VsZi5pc1BlbmRpbmcpIHtcblx0ICAgICAgICAgIHNlbGYucG9zaXRpb25Ecm9wZG93bigpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHNlbGYudHJpZ2dlcignaXRlbV9hZGQnLCBoYXNoZWQsIGl0ZW0pO1xuXG5cdCAgICAgICAgaWYgKCFzZWxmLmlzUGVuZGluZykge1xuXHQgICAgICAgICAgc2VsZi51cGRhdGVPcmlnaW5hbElucHV0KHtcblx0ICAgICAgICAgICAgc2lsZW50OiBzaWxlbnRcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICghc2VsZi5pc1BlbmRpbmcgfHwgIXdhc0Z1bGwgJiYgc2VsZi5pc0Z1bGwoKSkge1xuXHQgICAgICAgIHNlbGYuaW5wdXRTdGF0ZSgpO1xuXHQgICAgICAgIHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZW1vdmVzIHRoZSBzZWxlY3RlZCBpdGVtIG1hdGNoaW5nXG5cdCAgICogdGhlIHByb3ZpZGVkIHZhbHVlLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHJlbW92ZUl0ZW0oaXRlbSA9IG51bGwsIHNpbGVudCkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBpdGVtID0gc2VsZi5nZXRJdGVtKGl0ZW0pO1xuXHQgICAgaWYgKCFpdGVtKSByZXR1cm47XG5cdCAgICB2YXIgaSwgaWR4O1xuXHQgICAgY29uc3QgdmFsdWUgPSBpdGVtLmRhdGFzZXQudmFsdWU7XG5cdCAgICBpID0gbm9kZUluZGV4KGl0ZW0pO1xuXHQgICAgaXRlbS5yZW1vdmUoKTtcblxuXHQgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHQgICAgICBpZHggPSBzZWxmLmFjdGl2ZUl0ZW1zLmluZGV4T2YoaXRlbSk7XG5cdCAgICAgIHNlbGYuYWN0aXZlSXRlbXMuc3BsaWNlKGlkeCwgMSk7XG5cdCAgICAgIHJlbW92ZUNsYXNzZXMoaXRlbSwgJ2FjdGl2ZScpO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLml0ZW1zLnNwbGljZShpLCAxKTtcblx0ICAgIHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblxuXHQgICAgaWYgKCFzZWxmLnNldHRpbmdzLnBlcnNpc3QgJiYgc2VsZi51c2VyT3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcblx0ICAgICAgc2VsZi5yZW1vdmVPcHRpb24odmFsdWUsIHNpbGVudCk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChpIDwgc2VsZi5jYXJldFBvcykge1xuXHQgICAgICBzZWxmLnNldENhcmV0KHNlbGYuY2FyZXRQb3MgLSAxKTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi51cGRhdGVPcmlnaW5hbElucHV0KHtcblx0ICAgICAgc2lsZW50OiBzaWxlbnRcblx0ICAgIH0pO1xuXHQgICAgc2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0ICAgIHNlbGYucG9zaXRpb25Ecm9wZG93bigpO1xuXHQgICAgc2VsZi50cmlnZ2VyKCdpdGVtX3JlbW92ZScsIHZhbHVlLCBpdGVtKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogSW52b2tlcyB0aGUgYGNyZWF0ZWAgbWV0aG9kIHByb3ZpZGVkIGluIHRoZVxuXHQgICAqIFRvbVNlbGVjdCBvcHRpb25zIHRoYXQgc2hvdWxkIHByb3ZpZGUgdGhlIGRhdGFcblx0ICAgKiBmb3IgdGhlIG5ldyBpdGVtLCBnaXZlbiB0aGUgdXNlciBpbnB1dC5cblx0ICAgKlxuXHQgICAqIE9uY2UgdGhpcyBjb21wbGV0ZXMsIGl0IHdpbGwgYmUgYWRkZWRcblx0ICAgKiB0byB0aGUgaXRlbSBsaXN0LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNyZWF0ZUl0ZW0oaW5wdXQgPSBudWxsLCBjYWxsYmFjayA9ICgpID0+IHt9KSB7XG5cdCAgICAvLyB0cmlnZ2VyRHJvcGRvd24gcGFyYW1ldGVyIEBkZXByZWNhdGVkIDIuMS4xXG5cdCAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuXHQgICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1syXTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIGNhbGxiYWNrID0gKCkgPT4ge307XG5cdCAgICB9XG5cblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBjYXJldCA9IHNlbGYuY2FyZXRQb3M7XG5cdCAgICB2YXIgb3V0cHV0O1xuXHQgICAgaW5wdXQgPSBpbnB1dCB8fCBzZWxmLmlucHV0VmFsdWUoKTtcblxuXHQgICAgaWYgKCFzZWxmLmNhbkNyZWF0ZShpbnB1dCkpIHtcblx0ICAgICAgY2FsbGJhY2soKTtcblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLmxvY2soKTtcblx0ICAgIHZhciBjcmVhdGVkID0gZmFsc2U7XG5cblx0ICAgIHZhciBjcmVhdGUgPSBkYXRhID0+IHtcblx0ICAgICAgc2VsZi51bmxvY2soKTtcblx0ICAgICAgaWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSAnb2JqZWN0JykgcmV0dXJuIGNhbGxiYWNrKCk7XG5cdCAgICAgIHZhciB2YWx1ZSA9IGhhc2hfa2V5KGRhdGFbc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXSk7XG5cblx0ICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcblx0ICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlbGYuc2V0VGV4dGJveFZhbHVlKCk7XG5cdCAgICAgIHNlbGYuYWRkT3B0aW9uKGRhdGEsIHRydWUpO1xuXHQgICAgICBzZWxmLnNldENhcmV0KGNhcmV0KTtcblx0ICAgICAgc2VsZi5hZGRJdGVtKHZhbHVlKTtcblx0ICAgICAgY2FsbGJhY2soZGF0YSk7XG5cdCAgICAgIGNyZWF0ZWQgPSB0cnVlO1xuXHQgICAgfTtcblxuXHQgICAgaWYgKHR5cGVvZiBzZWxmLnNldHRpbmdzLmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICBvdXRwdXQgPSBzZWxmLnNldHRpbmdzLmNyZWF0ZS5jYWxsKHRoaXMsIGlucHV0LCBjcmVhdGUpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgb3V0cHV0ID0ge1xuXHQgICAgICAgIFtzZWxmLnNldHRpbmdzLmxhYmVsRmllbGRdOiBpbnB1dCxcblx0ICAgICAgICBbc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXTogaW5wdXRcblx0ICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgaWYgKCFjcmVhdGVkKSB7XG5cdCAgICAgIGNyZWF0ZShvdXRwdXQpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmUtcmVuZGVycyB0aGUgc2VsZWN0ZWQgaXRlbSBsaXN0cy5cblx0ICAgKi9cblxuXG5cdCAgcmVmcmVzaEl0ZW1zKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgc2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXG5cdCAgICBpZiAoc2VsZi5pc1NldHVwKSB7XG5cdCAgICAgIHNlbGYuYWRkSXRlbXMoc2VsZi5pdGVtcyk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYudXBkYXRlT3JpZ2luYWxJbnB1dCgpO1xuXHQgICAgc2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVXBkYXRlcyBhbGwgc3RhdGUtZGVwZW5kZW50IGF0dHJpYnV0ZXNcblx0ICAgKiBhbmQgQ1NTIGNsYXNzZXMuXG5cdCAgICovXG5cblxuXHQgIHJlZnJlc2hTdGF0ZSgpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgc2VsZi5yZWZyZXNoVmFsaWRpdHlTdGF0ZSgpO1xuXHQgICAgY29uc3QgaXNGdWxsID0gc2VsZi5pc0Z1bGwoKTtcblx0ICAgIGNvbnN0IGlzTG9ja2VkID0gc2VsZi5pc0xvY2tlZDtcblx0ICAgIHNlbGYud3JhcHBlci5jbGFzc0xpc3QudG9nZ2xlKCdydGwnLCBzZWxmLnJ0bCk7XG5cdCAgICBjb25zdCB3cmFwX2NsYXNzTGlzdCA9IHNlbGYud3JhcHBlci5jbGFzc0xpc3Q7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2ZvY3VzJywgc2VsZi5pc0ZvY3VzZWQpO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsIHNlbGYuaXNEaXNhYmxlZCk7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ3JlcXVpcmVkJywgc2VsZi5pc1JlcXVpcmVkKTtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgnaW52YWxpZCcsICFzZWxmLmlzVmFsaWQpO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdsb2NrZWQnLCBpc0xvY2tlZCk7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2Z1bGwnLCBpc0Z1bGwpO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdpbnB1dC1hY3RpdmUnLCBzZWxmLmlzRm9jdXNlZCAmJiAhc2VsZi5pc0lucHV0SGlkZGVuKTtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgnZHJvcGRvd24tYWN0aXZlJywgc2VsZi5pc09wZW4pO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdoYXMtb3B0aW9ucycsIGlzRW1wdHlPYmplY3Qoc2VsZi5vcHRpb25zKSk7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2hhcy1pdGVtcycsIHNlbGYuaXRlbXMubGVuZ3RoID4gMCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFVwZGF0ZSB0aGUgYHJlcXVpcmVkYCBhdHRyaWJ1dGUgb2YgYm90aCBpbnB1dCBhbmQgY29udHJvbCBpbnB1dC5cblx0ICAgKlxuXHQgICAqIFRoZSBgcmVxdWlyZWRgIHByb3BlcnR5IG5lZWRzIHRvIGJlIGFjdGl2YXRlZCBvbiB0aGUgY29udHJvbCBpbnB1dFxuXHQgICAqIGZvciB0aGUgZXJyb3IgdG8gYmUgZGlzcGxheWVkIGF0IHRoZSByaWdodCBwbGFjZS4gYHJlcXVpcmVkYCBhbHNvXG5cdCAgICogbmVlZHMgdG8gYmUgdGVtcG9yYXJpbHkgZGVhY3RpdmF0ZWQgb24gdGhlIGlucHV0IHNpbmNlIHRoZSBpbnB1dCBpc1xuXHQgICAqIGhpZGRlbiBhbmQgY2FuJ3Qgc2hvdyBlcnJvcnMuXG5cdCAgICovXG5cblxuXHQgIHJlZnJlc2hWYWxpZGl0eVN0YXRlKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAoIXNlbGYuaW5wdXQudmFsaWRpdHkpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLmlzVmFsaWQgPSBzZWxmLmlucHV0LnZhbGlkaXR5LnZhbGlkO1xuXHQgICAgc2VsZi5pc0ludmFsaWQgPSAhc2VsZi5pc1ZhbGlkO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IG1vcmUgaXRlbXMgY2FuIGJlIGFkZGVkXG5cdCAgICogdG8gdGhlIGNvbnRyb2wgd2l0aG91dCBleGNlZWRpbmcgdGhlIHVzZXItZGVmaW5lZCBtYXhpbXVtLlxuXHQgICAqXG5cdCAgICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAgICovXG5cblxuXHQgIGlzRnVsbCgpIHtcblx0ICAgIHJldHVybiB0aGlzLnNldHRpbmdzLm1heEl0ZW1zICE9PSBudWxsICYmIHRoaXMuaXRlbXMubGVuZ3RoID49IHRoaXMuc2V0dGluZ3MubWF4SXRlbXM7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlZnJlc2hlcyB0aGUgb3JpZ2luYWwgPHNlbGVjdD4gb3IgPGlucHV0PlxuXHQgICAqIGVsZW1lbnQgdG8gcmVmbGVjdCB0aGUgY3VycmVudCBzdGF0ZS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICB1cGRhdGVPcmlnaW5hbElucHV0KG9wdHMgPSB7fSkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgb3B0aW9uLCBsYWJlbDtcblx0ICAgIGNvbnN0IGVtcHR5X29wdGlvbiA9IHNlbGYuaW5wdXQucXVlcnlTZWxlY3Rvcignb3B0aW9uW3ZhbHVlPVwiXCJdJyk7XG5cblx0ICAgIGlmIChzZWxmLmlzX3NlbGVjdF90YWcpIHtcblx0ICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBbXTtcblx0ICAgICAgY29uc3QgaGFzX3NlbGVjdGVkID0gc2VsZi5pbnB1dC5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb246Y2hlY2tlZCcpLmxlbmd0aDtcblxuXHQgICAgICBmdW5jdGlvbiBBZGRTZWxlY3RlZChvcHRpb25fZWwsIHZhbHVlLCBsYWJlbCkge1xuXHQgICAgICAgIGlmICghb3B0aW9uX2VsKSB7XG5cdCAgICAgICAgICBvcHRpb25fZWwgPSBnZXREb20oJzxvcHRpb24gdmFsdWU9XCInICsgZXNjYXBlX2h0bWwodmFsdWUpICsgJ1wiPicgKyBlc2NhcGVfaHRtbChsYWJlbCkgKyAnPC9vcHRpb24+Jyk7XG5cdCAgICAgICAgfSAvLyBkb24ndCBtb3ZlIGVtcHR5IG9wdGlvbiBmcm9tIHRvcCBvZiBsaXN0XG5cdCAgICAgICAgLy8gZml4ZXMgYnVnIGluIGZpcmVmb3ggaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTcyNTI5M1xuXG5cblx0ICAgICAgICBpZiAob3B0aW9uX2VsICE9IGVtcHR5X29wdGlvbikge1xuXHQgICAgICAgICAgc2VsZi5pbnB1dC5hcHBlbmQob3B0aW9uX2VsKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZWxlY3RlZC5wdXNoKG9wdGlvbl9lbCk7IC8vIG1hcmtpbmcgZW1wdHkgb3B0aW9uIGFzIHNlbGVjdGVkIGNhbiBicmVhayB2YWxpZGF0aW9uXG5cdCAgICAgICAgLy8gZml4ZXMgaHR0cHM6Ly9naXRodWIuY29tL29yY2hpZGpzL3RvbS1zZWxlY3QvaXNzdWVzLzMwM1xuXG5cdCAgICAgICAgaWYgKG9wdGlvbl9lbCAhPSBlbXB0eV9vcHRpb24gfHwgaGFzX3NlbGVjdGVkID4gMCkge1xuXHQgICAgICAgICAgb3B0aW9uX2VsLnNlbGVjdGVkID0gdHJ1ZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gb3B0aW9uX2VsO1xuXHQgICAgICB9IC8vIHVuc2VsZWN0IGFsbCBzZWxlY3RlZCBvcHRpb25zXG5cblxuXHQgICAgICBzZWxmLmlucHV0LnF1ZXJ5U2VsZWN0b3JBbGwoJ29wdGlvbjpjaGVja2VkJykuZm9yRWFjaChvcHRpb25fZWwgPT4ge1xuXHQgICAgICAgIG9wdGlvbl9lbC5zZWxlY3RlZCA9IGZhbHNlO1xuXHQgICAgICB9KTsgLy8gbm90aGluZyBzZWxlY3RlZD9cblxuXHQgICAgICBpZiAoc2VsZi5pdGVtcy5sZW5ndGggPT0gMCAmJiBzZWxmLnNldHRpbmdzLm1vZGUgPT0gJ3NpbmdsZScpIHtcblx0ICAgICAgICBBZGRTZWxlY3RlZChlbXB0eV9vcHRpb24sIFwiXCIsIFwiXCIpOyAvLyBvcmRlciBzZWxlY3RlZCA8b3B0aW9uPiB0YWdzIGZvciB2YWx1ZXMgaW4gc2VsZi5pdGVtc1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaCh2YWx1ZSA9PiB7XG5cdCAgICAgICAgICBvcHRpb24gPSBzZWxmLm9wdGlvbnNbdmFsdWVdO1xuXHQgICAgICAgICAgbGFiZWwgPSBvcHRpb25bc2VsZi5zZXR0aW5ncy5sYWJlbEZpZWxkXSB8fCAnJztcblxuXHQgICAgICAgICAgaWYgKHNlbGVjdGVkLmluY2x1ZGVzKG9wdGlvbi4kb3B0aW9uKSkge1xuXHQgICAgICAgICAgICBjb25zdCByZXVzZV9vcHQgPSBzZWxmLmlucHV0LnF1ZXJ5U2VsZWN0b3IoYG9wdGlvblt2YWx1ZT1cIiR7YWRkU2xhc2hlcyh2YWx1ZSl9XCJdOm5vdCg6Y2hlY2tlZClgKTtcblx0ICAgICAgICAgICAgQWRkU2VsZWN0ZWQocmV1c2Vfb3B0LCB2YWx1ZSwgbGFiZWwpO1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgb3B0aW9uLiRvcHRpb24gPSBBZGRTZWxlY3RlZChvcHRpb24uJG9wdGlvbiwgdmFsdWUsIGxhYmVsKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2VsZi5pbnB1dC52YWx1ZSA9IHNlbGYuZ2V0VmFsdWUoKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNlbGYuaXNTZXR1cCkge1xuXHQgICAgICBpZiAoIW9wdHMuc2lsZW50KSB7XG5cdCAgICAgICAgc2VsZi50cmlnZ2VyKCdjaGFuZ2UnLCBzZWxmLmdldFZhbHVlKCkpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNob3dzIHRoZSBhdXRvY29tcGxldGUgZHJvcGRvd24gY29udGFpbmluZ1xuXHQgICAqIHRoZSBhdmFpbGFibGUgb3B0aW9ucy5cblx0ICAgKi9cblxuXG5cdCAgb3BlbigpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIGlmIChzZWxmLmlzTG9ja2VkIHx8IHNlbGYuaXNPcGVuIHx8IHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ211bHRpJyAmJiBzZWxmLmlzRnVsbCgpKSByZXR1cm47XG5cdCAgICBzZWxmLmlzT3BlbiA9IHRydWU7XG5cdCAgICBzZXRBdHRyKHNlbGYuZm9jdXNfbm9kZSwge1xuXHQgICAgICAnYXJpYS1leHBhbmRlZCc6ICd0cnVlJ1xuXHQgICAgfSk7XG5cdCAgICBzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHQgICAgYXBwbHlDU1Moc2VsZi5kcm9wZG93biwge1xuXHQgICAgICB2aXNpYmlsaXR5OiAnaGlkZGVuJyxcblx0ICAgICAgZGlzcGxheTogJ2Jsb2NrJ1xuXHQgICAgfSk7XG5cdCAgICBzZWxmLnBvc2l0aW9uRHJvcGRvd24oKTtcblx0ICAgIGFwcGx5Q1NTKHNlbGYuZHJvcGRvd24sIHtcblx0ICAgICAgdmlzaWJpbGl0eTogJ3Zpc2libGUnLFxuXHQgICAgICBkaXNwbGF5OiAnYmxvY2snXG5cdCAgICB9KTtcblx0ICAgIHNlbGYuZm9jdXMoKTtcblx0ICAgIHNlbGYudHJpZ2dlcignZHJvcGRvd25fb3BlbicsIHNlbGYuZHJvcGRvd24pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDbG9zZXMgdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93biBtZW51LlxuXHQgICAqL1xuXG5cblx0ICBjbG9zZShzZXRUZXh0Ym94VmFsdWUgPSB0cnVlKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgdHJpZ2dlciA9IHNlbGYuaXNPcGVuO1xuXG5cdCAgICBpZiAoc2V0VGV4dGJveFZhbHVlKSB7XG5cdCAgICAgIC8vIGJlZm9yZSBibHVyKCkgdG8gcHJldmVudCBmb3JtIG9uY2hhbmdlIGV2ZW50XG5cdCAgICAgIHNlbGYuc2V0VGV4dGJveFZhbHVlKCk7XG5cblx0ICAgICAgaWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScgJiYgc2VsZi5pdGVtcy5sZW5ndGgpIHtcblx0ICAgICAgICBzZWxmLmhpZGVJbnB1dCgpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuaXNPcGVuID0gZmFsc2U7XG5cdCAgICBzZXRBdHRyKHNlbGYuZm9jdXNfbm9kZSwge1xuXHQgICAgICAnYXJpYS1leHBhbmRlZCc6ICdmYWxzZSdcblx0ICAgIH0pO1xuXHQgICAgYXBwbHlDU1Moc2VsZi5kcm9wZG93biwge1xuXHQgICAgICBkaXNwbGF5OiAnbm9uZSdcblx0ICAgIH0pO1xuXG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQpIHtcblx0ICAgICAgc2VsZi5jbGVhckFjdGl2ZU9wdGlvbigpO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHQgICAgaWYgKHRyaWdnZXIpIHNlbGYudHJpZ2dlcignZHJvcGRvd25fY2xvc2UnLCBzZWxmLmRyb3Bkb3duKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQ2FsY3VsYXRlcyBhbmQgYXBwbGllcyB0aGUgYXBwcm9wcmlhdGVcblx0ICAgKiBwb3NpdGlvbiBvZiB0aGUgZHJvcGRvd24gaWYgZHJvcGRvd25QYXJlbnQgPSAnYm9keScuXG5cdCAgICogT3RoZXJ3aXNlLCBwb3NpdGlvbiBpcyBkZXRlcm1pbmVkIGJ5IGNzc1xuXHQgICAqL1xuXG5cblx0ICBwb3NpdGlvbkRyb3Bkb3duKCkge1xuXHQgICAgaWYgKHRoaXMuc2V0dGluZ3MuZHJvcGRvd25QYXJlbnQgIT09ICdib2R5Jykge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHZhciBjb250ZXh0ID0gdGhpcy5jb250cm9sO1xuXHQgICAgdmFyIHJlY3QgPSBjb250ZXh0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgdmFyIHRvcCA9IGNvbnRleHQub2Zmc2V0SGVpZ2h0ICsgcmVjdC50b3AgKyB3aW5kb3cuc2Nyb2xsWTtcblx0ICAgIHZhciBsZWZ0ID0gcmVjdC5sZWZ0ICsgd2luZG93LnNjcm9sbFg7XG5cdCAgICBhcHBseUNTUyh0aGlzLmRyb3Bkb3duLCB7XG5cdCAgICAgIHdpZHRoOiByZWN0LndpZHRoICsgJ3B4Jyxcblx0ICAgICAgdG9wOiB0b3AgKyAncHgnLFxuXHQgICAgICBsZWZ0OiBsZWZ0ICsgJ3B4J1xuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlc2V0cyAvIGNsZWFycyBhbGwgc2VsZWN0ZWQgaXRlbXNcblx0ICAgKiBmcm9tIHRoZSBjb250cm9sLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNsZWFyKHNpbGVudCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKCFzZWxmLml0ZW1zLmxlbmd0aCkgcmV0dXJuO1xuXHQgICAgdmFyIGl0ZW1zID0gc2VsZi5jb250cm9sQ2hpbGRyZW4oKTtcblx0ICAgIGl0ZXJhdGUkMShpdGVtcywgaXRlbSA9PiB7XG5cdCAgICAgIHNlbGYucmVtb3ZlSXRlbShpdGVtLCB0cnVlKTtcblx0ICAgIH0pO1xuXHQgICAgc2VsZi5zaG93SW5wdXQoKTtcblx0ICAgIGlmICghc2lsZW50KSBzZWxmLnVwZGF0ZU9yaWdpbmFsSW5wdXQoKTtcblx0ICAgIHNlbGYudHJpZ2dlcignY2xlYXInKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQSBoZWxwZXIgbWV0aG9kIGZvciBpbnNlcnRpbmcgYW4gZWxlbWVudFxuXHQgICAqIGF0IHRoZSBjdXJyZW50IGNhcmV0IHBvc2l0aW9uLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGluc2VydEF0Q2FyZXQoZWwpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgY29uc3QgY2FyZXQgPSBzZWxmLmNhcmV0UG9zO1xuXHQgICAgY29uc3QgdGFyZ2V0ID0gc2VsZi5jb250cm9sO1xuXHQgICAgdGFyZ2V0Lmluc2VydEJlZm9yZShlbCwgdGFyZ2V0LmNoaWxkcmVuW2NhcmV0XSB8fCBudWxsKTtcblx0ICAgIHNlbGYuc2V0Q2FyZXQoY2FyZXQgKyAxKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVtb3ZlcyB0aGUgY3VycmVudCBzZWxlY3RlZCBpdGVtKHMpLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGRlbGV0ZVNlbGVjdGlvbihlKSB7XG5cdCAgICB2YXIgZGlyZWN0aW9uLCBzZWxlY3Rpb24sIGNhcmV0LCB0YWlsO1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgZGlyZWN0aW9uID0gZSAmJiBlLmtleUNvZGUgPT09IEtFWV9CQUNLU1BBQ0UgPyAtMSA6IDE7XG5cdCAgICBzZWxlY3Rpb24gPSBnZXRTZWxlY3Rpb24oc2VsZi5jb250cm9sX2lucHV0KTsgLy8gZGV0ZXJtaW5lIGl0ZW1zIHRoYXQgd2lsbCBiZSByZW1vdmVkXG5cblx0ICAgIGNvbnN0IHJtX2l0ZW1zID0gW107XG5cblx0ICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW1zLmxlbmd0aCkge1xuXHQgICAgICB0YWlsID0gZ2V0VGFpbChzZWxmLmFjdGl2ZUl0ZW1zLCBkaXJlY3Rpb24pO1xuXHQgICAgICBjYXJldCA9IG5vZGVJbmRleCh0YWlsKTtcblxuXHQgICAgICBpZiAoZGlyZWN0aW9uID4gMCkge1xuXHQgICAgICAgIGNhcmV0Kys7XG5cdCAgICAgIH1cblxuXHQgICAgICBpdGVyYXRlJDEoc2VsZi5hY3RpdmVJdGVtcywgaXRlbSA9PiBybV9pdGVtcy5wdXNoKGl0ZW0pKTtcblx0ICAgIH0gZWxzZSBpZiAoKHNlbGYuaXNGb2N1c2VkIHx8IHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScpICYmIHNlbGYuaXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgIGNvbnN0IGl0ZW1zID0gc2VsZi5jb250cm9sQ2hpbGRyZW4oKTtcblx0ICAgICAgbGV0IHJtX2l0ZW07XG5cblx0ICAgICAgaWYgKGRpcmVjdGlvbiA8IDAgJiYgc2VsZWN0aW9uLnN0YXJ0ID09PSAwICYmIHNlbGVjdGlvbi5sZW5ndGggPT09IDApIHtcblx0ICAgICAgICBybV9pdGVtID0gaXRlbXNbc2VsZi5jYXJldFBvcyAtIDFdO1xuXHQgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA+IDAgJiYgc2VsZWN0aW9uLnN0YXJ0ID09PSBzZWxmLmlucHV0VmFsdWUoKS5sZW5ndGgpIHtcblx0ICAgICAgICBybV9pdGVtID0gaXRlbXNbc2VsZi5jYXJldFBvc107XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAocm1faXRlbSAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgcm1faXRlbXMucHVzaChybV9pdGVtKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBpZiAoIXNlbGYuc2hvdWxkRGVsZXRlKHJtX2l0ZW1zLCBlKSkge1xuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIHByZXZlbnREZWZhdWx0KGUsIHRydWUpOyAvLyBwZXJmb3JtIHJlbW92YWxcblxuXHQgICAgaWYgKHR5cGVvZiBjYXJldCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgc2VsZi5zZXRDYXJldChjYXJldCk7XG5cdCAgICB9XG5cblx0ICAgIHdoaWxlIChybV9pdGVtcy5sZW5ndGgpIHtcblx0ICAgICAgc2VsZi5yZW1vdmVJdGVtKHJtX2l0ZW1zLnBvcCgpKTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi5zaG93SW5wdXQoKTtcblx0ICAgIHNlbGYucG9zaXRpb25Ecm9wZG93bigpO1xuXHQgICAgc2VsZi5yZWZyZXNoT3B0aW9ucyhmYWxzZSk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJuIHRydWUgaWYgdGhlIGl0ZW1zIHNob3VsZCBiZSBkZWxldGVkXG5cdCAgICovXG5cblxuXHQgIHNob3VsZERlbGV0ZShpdGVtcywgZXZ0KSB7XG5cdCAgICBjb25zdCB2YWx1ZXMgPSBpdGVtcy5tYXAoaXRlbSA9PiBpdGVtLmRhdGFzZXQudmFsdWUpOyAvLyBhbGxvdyB0aGUgY2FsbGJhY2sgdG8gYWJvcnRcblxuXHQgICAgaWYgKCF2YWx1ZXMubGVuZ3RoIHx8IHR5cGVvZiB0aGlzLnNldHRpbmdzLm9uRGVsZXRlID09PSAnZnVuY3Rpb24nICYmIHRoaXMuc2V0dGluZ3Mub25EZWxldGUodmFsdWVzLCBldnQpID09PSBmYWxzZSkge1xuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZWxlY3RzIHRoZSBwcmV2aW91cyAvIG5leHQgaXRlbSAoZGVwZW5kaW5nIG9uIHRoZSBgZGlyZWN0aW9uYCBhcmd1bWVudCkuXG5cdCAgICpcblx0ICAgKiA+IDAgLSByaWdodFxuXHQgICAqIDwgMCAtIGxlZnRcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBhZHZhbmNlU2VsZWN0aW9uKGRpcmVjdGlvbiwgZSkge1xuXHQgICAgdmFyIGxhc3RfYWN0aXZlLFxuXHQgICAgICAgIGFkamFjZW50LFxuXHQgICAgICAgIHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKHNlbGYucnRsKSBkaXJlY3Rpb24gKj0gLTE7XG5cdCAgICBpZiAoc2VsZi5pbnB1dFZhbHVlKCkubGVuZ3RoKSByZXR1cm47IC8vIGFkZCBvciByZW1vdmUgdG8gYWN0aXZlIGl0ZW1zXG5cblx0ICAgIGlmIChpc0tleURvd24oS0VZX1NIT1JUQ1VULCBlKSB8fCBpc0tleURvd24oJ3NoaWZ0S2V5JywgZSkpIHtcblx0ICAgICAgbGFzdF9hY3RpdmUgPSBzZWxmLmdldExhc3RBY3RpdmUoZGlyZWN0aW9uKTtcblxuXHQgICAgICBpZiAobGFzdF9hY3RpdmUpIHtcblx0ICAgICAgICBpZiAoIWxhc3RfYWN0aXZlLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0ICAgICAgICAgIGFkamFjZW50ID0gbGFzdF9hY3RpdmU7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIGFkamFjZW50ID0gc2VsZi5nZXRBZGphY2VudChsYXN0X2FjdGl2ZSwgZGlyZWN0aW9uLCAnaXRlbScpO1xuXHQgICAgICAgIH0gLy8gaWYgbm8gYWN0aXZlIGl0ZW0sIGdldCBpdGVtcyBhZGphY2VudCB0byB0aGUgY29udHJvbCBpbnB1dFxuXG5cdCAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID4gMCkge1xuXHQgICAgICAgIGFkamFjZW50ID0gc2VsZi5jb250cm9sX2lucHV0Lm5leHRFbGVtZW50U2libGluZztcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBhZGphY2VudCA9IHNlbGYuY29udHJvbF9pbnB1dC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGFkamFjZW50KSB7XG5cdCAgICAgICAgaWYgKGFkamFjZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0ICAgICAgICAgIHNlbGYucmVtb3ZlQWN0aXZlSXRlbShsYXN0X2FjdGl2ZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VsZi5zZXRBY3RpdmVJdGVtQ2xhc3MoYWRqYWNlbnQpOyAvLyBtYXJrIGFzIGxhc3RfYWN0aXZlICEhIGFmdGVyIHJlbW92ZUFjdGl2ZUl0ZW0oKSBvbiBsYXN0X2FjdGl2ZVxuXHQgICAgICB9IC8vIG1vdmUgY2FyZXQgdG8gdGhlIGxlZnQgb3IgcmlnaHRcblxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2VsZi5tb3ZlQ2FyZXQoZGlyZWN0aW9uKTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBtb3ZlQ2FyZXQoZGlyZWN0aW9uKSB7fVxuXHQgIC8qKlxuXHQgICAqIEdldCB0aGUgbGFzdCBhY3RpdmUgaXRlbVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGdldExhc3RBY3RpdmUoZGlyZWN0aW9uKSB7XG5cdCAgICBsZXQgbGFzdF9hY3RpdmUgPSB0aGlzLmNvbnRyb2wucXVlcnlTZWxlY3RvcignLmxhc3QtYWN0aXZlJyk7XG5cblx0ICAgIGlmIChsYXN0X2FjdGl2ZSkge1xuXHQgICAgICByZXR1cm4gbGFzdF9hY3RpdmU7XG5cdCAgICB9XG5cblx0ICAgIHZhciByZXN1bHQgPSB0aGlzLmNvbnRyb2wucXVlcnlTZWxlY3RvckFsbCgnLmFjdGl2ZScpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICAgIHJldHVybiBnZXRUYWlsKHJlc3VsdCwgZGlyZWN0aW9uKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogTW92ZXMgdGhlIGNhcmV0IHRvIHRoZSBzcGVjaWZpZWQgaW5kZXguXG5cdCAgICpcblx0ICAgKiBUaGUgaW5wdXQgbXVzdCBiZSBtb3ZlZCBieSBsZWF2aW5nIGl0IGluIHBsYWNlIGFuZCBtb3ZpbmcgdGhlXG5cdCAgICogc2libGluZ3MsIGR1ZSB0byB0aGUgZmFjdCB0aGF0IGZvY3VzIGNhbm5vdCBiZSByZXN0b3JlZCBvbmNlIGxvc3Rcblx0ICAgKiBvbiBtb2JpbGUgd2Via2l0IGRldmljZXNcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXRDYXJldChuZXdfcG9zKSB7XG5cdCAgICB0aGlzLmNhcmV0UG9zID0gdGhpcy5pdGVtcy5sZW5ndGg7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybiBsaXN0IG9mIGl0ZW0gZG9tIGVsZW1lbnRzXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY29udHJvbENoaWxkcmVuKCkge1xuXHQgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5jb250cm9sLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRzLWl0ZW1dJykpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBEaXNhYmxlcyB1c2VyIGlucHV0IG9uIHRoZSBjb250cm9sLiBVc2VkIHdoaWxlXG5cdCAgICogaXRlbXMgYXJlIGJlaW5nIGFzeW5jaHJvbm91c2x5IGNyZWF0ZWQuXG5cdCAgICovXG5cblxuXHQgIGxvY2soKSB7XG5cdCAgICB0aGlzLmlzTG9ja2VkID0gdHJ1ZTtcblx0ICAgIHRoaXMucmVmcmVzaFN0YXRlKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlLWVuYWJsZXMgdXNlciBpbnB1dCBvbiB0aGUgY29udHJvbC5cblx0ICAgKi9cblxuXG5cdCAgdW5sb2NrKCkge1xuXHQgICAgdGhpcy5pc0xvY2tlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5yZWZyZXNoU3RhdGUoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogRGlzYWJsZXMgdXNlciBpbnB1dCBvbiB0aGUgY29udHJvbCBjb21wbGV0ZWx5LlxuXHQgICAqIFdoaWxlIGRpc2FibGVkLCBpdCBjYW5ub3QgcmVjZWl2ZSBmb2N1cy5cblx0ICAgKi9cblxuXG5cdCAgZGlzYWJsZSgpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHNlbGYuaW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgc2VsZi5jb250cm9sX2lucHV0LmRpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHNlbGYuZm9jdXNfbm9kZS50YWJJbmRleCA9IC0xO1xuXHQgICAgc2VsZi5pc0Rpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHRoaXMuY2xvc2UoKTtcblx0ICAgIHNlbGYubG9jaygpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBFbmFibGVzIHRoZSBjb250cm9sIHNvIHRoYXQgaXQgY2FuIHJlc3BvbmRcblx0ICAgKiB0byBmb2N1cyBhbmQgdXNlciBpbnB1dC5cblx0ICAgKi9cblxuXG5cdCAgZW5hYmxlKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgc2VsZi5pbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgc2VsZi5jb250cm9sX2lucHV0LmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICBzZWxmLmZvY3VzX25vZGUudGFiSW5kZXggPSBzZWxmLnRhYkluZGV4O1xuXHQgICAgc2VsZi5pc0Rpc2FibGVkID0gZmFsc2U7XG5cdCAgICBzZWxmLnVubG9jaygpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDb21wbGV0ZWx5IGRlc3Ryb3lzIHRoZSBjb250cm9sIGFuZFxuXHQgICAqIHVuYmluZHMgYWxsIGV2ZW50IGxpc3RlbmVycyBzbyB0aGF0IGl0IGNhblxuXHQgICAqIGJlIGdhcmJhZ2UgY29sbGVjdGVkLlxuXHQgICAqL1xuXG5cblx0ICBkZXN0cm95KCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIHJldmVydFNldHRpbmdzID0gc2VsZi5yZXZlcnRTZXR0aW5ncztcblx0ICAgIHNlbGYudHJpZ2dlcignZGVzdHJveScpO1xuXHQgICAgc2VsZi5vZmYoKTtcblx0ICAgIHNlbGYud3JhcHBlci5yZW1vdmUoKTtcblx0ICAgIHNlbGYuZHJvcGRvd24ucmVtb3ZlKCk7XG5cdCAgICBzZWxmLmlucHV0LmlubmVySFRNTCA9IHJldmVydFNldHRpbmdzLmlubmVySFRNTDtcblx0ICAgIHNlbGYuaW5wdXQudGFiSW5kZXggPSByZXZlcnRTZXR0aW5ncy50YWJJbmRleDtcblx0ICAgIHJlbW92ZUNsYXNzZXMoc2VsZi5pbnB1dCwgJ3RvbXNlbGVjdGVkJywgJ3RzLWhpZGRlbi1hY2Nlc3NpYmxlJyk7XG5cblx0ICAgIHNlbGYuX2Rlc3Ryb3koKTtcblxuXHQgICAgZGVsZXRlIHNlbGYuaW5wdXQudG9tc2VsZWN0O1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBBIGhlbHBlciBtZXRob2QgZm9yIHJlbmRlcmluZyBcIml0ZW1cIiBhbmRcblx0ICAgKiBcIm9wdGlvblwiIHRlbXBsYXRlcywgZ2l2ZW4gdGhlIGRhdGEuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgcmVuZGVyKHRlbXBsYXRlTmFtZSwgZGF0YSkge1xuXHQgICAgdmFyIGlkLCBodG1sO1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0ICAgIGlmICh0eXBlb2YgdGhpcy5zZXR0aW5ncy5yZW5kZXJbdGVtcGxhdGVOYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH0gLy8gcmVuZGVyIG1hcmt1cFxuXG5cblx0ICAgIGh0bWwgPSBzZWxmLnNldHRpbmdzLnJlbmRlclt0ZW1wbGF0ZU5hbWVdLmNhbGwodGhpcywgZGF0YSwgZXNjYXBlX2h0bWwpO1xuXG5cdCAgICBpZiAoIWh0bWwpIHtcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cblx0ICAgIGh0bWwgPSBnZXREb20oaHRtbCk7IC8vIGFkZCBtYW5kYXRvcnkgYXR0cmlidXRlc1xuXG5cdCAgICBpZiAodGVtcGxhdGVOYW1lID09PSAnb3B0aW9uJyB8fCB0ZW1wbGF0ZU5hbWUgPT09ICdvcHRpb25fY3JlYXRlJykge1xuXHQgICAgICBpZiAoZGF0YVtzZWxmLnNldHRpbmdzLmRpc2FibGVkRmllbGRdKSB7XG5cdCAgICAgICAgc2V0QXR0cihodG1sLCB7XG5cdCAgICAgICAgICAnYXJpYS1kaXNhYmxlZCc6ICd0cnVlJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHNldEF0dHIoaHRtbCwge1xuXHQgICAgICAgICAgJ2RhdGEtc2VsZWN0YWJsZSc6ICcnXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSBpZiAodGVtcGxhdGVOYW1lID09PSAnb3B0Z3JvdXAnKSB7XG5cdCAgICAgIGlkID0gZGF0YS5ncm91cFtzZWxmLnNldHRpbmdzLm9wdGdyb3VwVmFsdWVGaWVsZF07XG5cdCAgICAgIHNldEF0dHIoaHRtbCwge1xuXHQgICAgICAgICdkYXRhLWdyb3VwJzogaWRcblx0ICAgICAgfSk7XG5cblx0ICAgICAgaWYgKGRhdGEuZ3JvdXBbc2VsZi5zZXR0aW5ncy5kaXNhYmxlZEZpZWxkXSkge1xuXHQgICAgICAgIHNldEF0dHIoaHRtbCwge1xuXHQgICAgICAgICAgJ2RhdGEtZGlzYWJsZWQnOiAnJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGlmICh0ZW1wbGF0ZU5hbWUgPT09ICdvcHRpb24nIHx8IHRlbXBsYXRlTmFtZSA9PT0gJ2l0ZW0nKSB7XG5cdCAgICAgIGNvbnN0IHZhbHVlID0gZ2V0X2hhc2goZGF0YVtzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdKTtcblx0ICAgICAgc2V0QXR0cihodG1sLCB7XG5cdCAgICAgICAgJ2RhdGEtdmFsdWUnOiB2YWx1ZVxuXHQgICAgICB9KTsgLy8gbWFrZSBzdXJlIHdlIGhhdmUgc29tZSBjbGFzc2VzIGlmIGEgdGVtcGxhdGUgaXMgb3ZlcndyaXR0ZW5cblxuXHQgICAgICBpZiAodGVtcGxhdGVOYW1lID09PSAnaXRlbScpIHtcblx0ICAgICAgICBhZGRDbGFzc2VzKGh0bWwsIHNlbGYuc2V0dGluZ3MuaXRlbUNsYXNzKTtcblx0ICAgICAgICBzZXRBdHRyKGh0bWwsIHtcblx0ICAgICAgICAgICdkYXRhLXRzLWl0ZW0nOiAnJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGFkZENsYXNzZXMoaHRtbCwgc2VsZi5zZXR0aW5ncy5vcHRpb25DbGFzcyk7XG5cdCAgICAgICAgc2V0QXR0cihodG1sLCB7XG5cdCAgICAgICAgICByb2xlOiAnb3B0aW9uJyxcblx0ICAgICAgICAgIGlkOiBkYXRhLiRpZFxuXHQgICAgICAgIH0pOyAvLyB1cGRhdGUgY2FjaGVcblxuXHQgICAgICAgIGRhdGEuJGRpdiA9IGh0bWw7XG5cdCAgICAgICAgc2VsZi5vcHRpb25zW3ZhbHVlXSA9IGRhdGE7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGh0bWw7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFR5cGUgZ3VhcmRlZCByZW5kZXJpbmdcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBfcmVuZGVyKHRlbXBsYXRlTmFtZSwgZGF0YSkge1xuXHQgICAgY29uc3QgaHRtbCA9IHRoaXMucmVuZGVyKHRlbXBsYXRlTmFtZSwgZGF0YSk7XG5cblx0ICAgIGlmIChodG1sID09IG51bGwpIHtcblx0ICAgICAgdGhyb3cgJ0hUTUxFbGVtZW50IGV4cGVjdGVkJztcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGh0bWw7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIENsZWFycyB0aGUgcmVuZGVyIGNhY2hlIGZvciBhIHRlbXBsYXRlLiBJZlxuXHQgICAqIG5vIHRlbXBsYXRlIGlzIGdpdmVuLCBjbGVhcnMgYWxsIHJlbmRlclxuXHQgICAqIGNhY2hlcy5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjbGVhckNhY2hlKCkge1xuXHQgICAgaXRlcmF0ZSQxKHRoaXMub3B0aW9ucywgb3B0aW9uID0+IHtcblx0ICAgICAgaWYgKG9wdGlvbi4kZGl2KSB7XG5cdCAgICAgICAgb3B0aW9uLiRkaXYucmVtb3ZlKCk7XG5cdCAgICAgICAgZGVsZXRlIG9wdGlvbi4kZGl2O1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVtb3ZlcyBhIHZhbHVlIGZyb20gaXRlbSBhbmQgb3B0aW9uIGNhY2hlc1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHVuY2FjaGVWYWx1ZSh2YWx1ZSkge1xuXHQgICAgY29uc3Qgb3B0aW9uX2VsID0gdGhpcy5nZXRPcHRpb24odmFsdWUpO1xuXHQgICAgaWYgKG9wdGlvbl9lbCkgb3B0aW9uX2VsLnJlbW92ZSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRvIGRpc3BsYXkgdGhlXG5cdCAgICogY3JlYXRlIGl0ZW0gcHJvbXB0LCBnaXZlbiBhIHVzZXIgaW5wdXQuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY2FuQ3JlYXRlKGlucHV0KSB7XG5cdCAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5jcmVhdGUgJiYgaW5wdXQubGVuZ3RoID4gMCAmJiB0aGlzLnNldHRpbmdzLmNyZWF0ZUZpbHRlci5jYWxsKHRoaXMsIGlucHV0KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogV3JhcHMgdGhpcy5gbWV0aG9kYCBzbyB0aGF0IGBuZXdfZm5gIGNhbiBiZSBpbnZva2VkICdiZWZvcmUnLCAnYWZ0ZXInLCBvciAnaW5zdGVhZCcgb2YgdGhlIG9yaWdpbmFsIG1ldGhvZFxuXHQgICAqXG5cdCAgICogdGhpcy5ob29rKCdpbnN0ZWFkJywnb25LZXlEb3duJyxmdW5jdGlvbiggYXJnMSwgYXJnMiAuLi4pe1xuXHQgICAqXG5cdCAgICogfSk7XG5cdCAgICovXG5cblxuXHQgIGhvb2sod2hlbiwgbWV0aG9kLCBuZXdfZm4pIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBvcmlnX21ldGhvZCA9IHNlbGZbbWV0aG9kXTtcblxuXHQgICAgc2VsZlttZXRob2RdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICB2YXIgcmVzdWx0LCByZXN1bHRfbmV3O1xuXG5cdCAgICAgIGlmICh3aGVuID09PSAnYWZ0ZXInKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gb3JpZ19tZXRob2QuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJlc3VsdF9uZXcgPSBuZXdfZm4uYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblxuXHQgICAgICBpZiAod2hlbiA9PT0gJ2luc3RlYWQnKSB7XG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdF9uZXc7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAod2hlbiA9PT0gJ2JlZm9yZScpIHtcblx0ICAgICAgICByZXN1bHQgPSBvcmlnX21ldGhvZC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgIH07XG5cdCAgfVxuXG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImNoYW5nZV9saXN0ZW5lclwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGNoYW5nZV9saXN0ZW5lciAoKSB7XG5cdCAgYWRkRXZlbnQodGhpcy5pbnB1dCwgJ2NoYW5nZScsICgpID0+IHtcblx0ICAgIHRoaXMuc3luYygpO1xuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJyZXN0b3JlX29uX2JhY2tzcGFjZVwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrYm94X29wdGlvbnMgKCkge1xuXHQgIHZhciBzZWxmID0gdGhpcztcblx0ICB2YXIgb3JpZ19vbk9wdGlvblNlbGVjdCA9IHNlbGYub25PcHRpb25TZWxlY3Q7XG5cdCAgc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQgPSBmYWxzZTsgLy8gdXBkYXRlIHRoZSBjaGVja2JveCBmb3IgYW4gb3B0aW9uXG5cblx0ICB2YXIgVXBkYXRlQ2hlY2tib3ggPSBmdW5jdGlvbiBVcGRhdGVDaGVja2JveChvcHRpb24pIHtcblx0ICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuXHQgICAgICB2YXIgY2hlY2tib3ggPSBvcHRpb24ucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcblxuXHQgICAgICBpZiAoY2hlY2tib3ggaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSB7XG5cdCAgICAgICAgaWYgKG9wdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykpIHtcblx0ICAgICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBjaGVja2JveC5jaGVja2VkID0gZmFsc2U7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9LCAxKTtcblx0ICB9OyAvLyBhZGQgY2hlY2tib3ggdG8gb3B0aW9uIHRlbXBsYXRlXG5cblxuXHQgIHNlbGYuaG9vaygnYWZ0ZXInLCAnc2V0dXBUZW1wbGF0ZXMnLCAoKSA9PiB7XG5cdCAgICB2YXIgb3JpZ19yZW5kZXJfb3B0aW9uID0gc2VsZi5zZXR0aW5ncy5yZW5kZXIub3B0aW9uO1xuXG5cdCAgICBzZWxmLnNldHRpbmdzLnJlbmRlci5vcHRpb24gPSAoZGF0YSwgZXNjYXBlX2h0bWwpID0+IHtcblx0ICAgICAgdmFyIHJlbmRlcmVkID0gZ2V0RG9tKG9yaWdfcmVuZGVyX29wdGlvbi5jYWxsKHNlbGYsIGRhdGEsIGVzY2FwZV9odG1sKSk7XG5cdCAgICAgIHZhciBjaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdCAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2dCkge1xuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCk7XG5cdCAgICAgIH0pO1xuXHQgICAgICBjaGVja2JveC50eXBlID0gJ2NoZWNrYm94Jztcblx0ICAgICAgY29uc3QgaGFzaGVkID0gaGFzaF9rZXkoZGF0YVtzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdKTtcblxuXHQgICAgICBpZiAoaGFzaGVkICYmIHNlbGYuaXRlbXMuaW5kZXhPZihoYXNoZWQpID4gLTEpIHtcblx0ICAgICAgICBjaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJlbmRlcmVkLnByZXBlbmQoY2hlY2tib3gpO1xuXHQgICAgICByZXR1cm4gcmVuZGVyZWQ7XG5cdCAgICB9O1xuXHQgIH0pOyAvLyB1bmNoZWNrIHdoZW4gaXRlbSByZW1vdmVkXG5cblx0ICBzZWxmLm9uKCdpdGVtX3JlbW92ZScsIHZhbHVlID0+IHtcblx0ICAgIHZhciBvcHRpb24gPSBzZWxmLmdldE9wdGlvbih2YWx1ZSk7XG5cblx0ICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgLy8gaWYgZHJvcGRvd24gaGFzbid0IGJlZW4gb3BlbmVkIHlldCwgdGhlIG9wdGlvbiB3b24ndCBleGlzdFxuXHQgICAgICBvcHRpb24uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTsgLy8gc2VsZWN0ZWQgY2xhc3Mgd29uJ3QgYmUgcmVtb3ZlZCB5ZXRcblxuXHQgICAgICBVcGRhdGVDaGVja2JveChvcHRpb24pO1xuXHQgICAgfVxuXHQgIH0pOyAvLyBjaGVjayB3aGVuIGl0ZW0gYWRkZWRcblxuXHQgIHNlbGYub24oJ2l0ZW1fYWRkJywgdmFsdWUgPT4ge1xuXHQgICAgdmFyIG9wdGlvbiA9IHNlbGYuZ2V0T3B0aW9uKHZhbHVlKTtcblxuXHQgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICAvLyBpZiBkcm9wZG93biBoYXNuJ3QgYmVlbiBvcGVuZWQgeWV0LCB0aGUgb3B0aW9uIHdvbid0IGV4aXN0XG5cdCAgICAgIFVwZGF0ZUNoZWNrYm94KG9wdGlvbik7XG5cdCAgICB9XG5cdCAgfSk7IC8vIHJlbW92ZSBpdGVtcyB3aGVuIHNlbGVjdGVkIG9wdGlvbiBpcyBjbGlja2VkXG5cblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnb25PcHRpb25TZWxlY3QnLCAoZXZ0LCBvcHRpb24pID0+IHtcblx0ICAgIGlmIChvcHRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpKSB7XG5cdCAgICAgIG9wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuXHQgICAgICBzZWxmLnJlbW92ZUl0ZW0ob3B0aW9uLmRhdGFzZXQudmFsdWUpO1xuXHQgICAgICBzZWxmLnJlZnJlc2hPcHRpb25zKCk7XG5cdCAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgb3JpZ19vbk9wdGlvblNlbGVjdC5jYWxsKHNlbGYsIGV2dCwgb3B0aW9uKTtcblx0ICAgIFVwZGF0ZUNoZWNrYm94KG9wdGlvbik7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImRyb3Bkb3duX2hlYWRlclwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGNsZWFyX2J1dHRvbiAodXNlck9wdGlvbnMpIHtcblx0ICBjb25zdCBzZWxmID0gdGhpcztcblx0ICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cdCAgICBjbGFzc05hbWU6ICdjbGVhci1idXR0b24nLFxuXHQgICAgdGl0bGU6ICdDbGVhciBBbGwnLFxuXHQgICAgaHRtbDogZGF0YSA9PiB7XG5cdCAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIiR7ZGF0YS5jbGFzc05hbWV9XCIgdGl0bGU9XCIke2RhdGEudGl0bGV9XCI+JiMxMDc5OTs8L2Rpdj5gO1xuXHQgICAgfVxuXHQgIH0sIHVzZXJPcHRpb25zKTtcblx0ICBzZWxmLm9uKCdpbml0aWFsaXplJywgKCkgPT4ge1xuXHQgICAgdmFyIGJ1dHRvbiA9IGdldERvbShvcHRpb25zLmh0bWwob3B0aW9ucykpO1xuXHQgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZ0ID0+IHtcblx0ICAgICAgaWYgKHNlbGYuaXNEaXNhYmxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlbGYuY2xlYXIoKTtcblxuXHQgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJyAmJiBzZWxmLnNldHRpbmdzLmFsbG93RW1wdHlPcHRpb24pIHtcblx0ICAgICAgICBzZWxmLmFkZEl0ZW0oJycpO1xuXHQgICAgICB9XG5cblx0ICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgIH0pO1xuXHQgICAgc2VsZi5jb250cm9sLmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImRyYWdfZHJvcFwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGRyYWdfZHJvcCAoKSB7XG5cdCAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgIGlmICghJC5mbi5zb3J0YWJsZSkgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJkcmFnX2Ryb3BcIiBwbHVnaW4gcmVxdWlyZXMgalF1ZXJ5IFVJIFwic29ydGFibGVcIi4nKTtcblx0ICBpZiAoc2VsZi5zZXR0aW5ncy5tb2RlICE9PSAnbXVsdGknKSByZXR1cm47XG5cdCAgdmFyIG9yaWdfbG9jayA9IHNlbGYubG9jaztcblx0ICB2YXIgb3JpZ191bmxvY2sgPSBzZWxmLnVubG9jaztcblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnbG9jaycsICgpID0+IHtcblx0ICAgIHZhciBzb3J0YWJsZSA9ICQoc2VsZi5jb250cm9sKS5kYXRhKCdzb3J0YWJsZScpO1xuXHQgICAgaWYgKHNvcnRhYmxlKSBzb3J0YWJsZS5kaXNhYmxlKCk7XG5cdCAgICByZXR1cm4gb3JpZ19sb2NrLmNhbGwoc2VsZik7XG5cdCAgfSk7XG5cdCAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ3VubG9jaycsICgpID0+IHtcblx0ICAgIHZhciBzb3J0YWJsZSA9ICQoc2VsZi5jb250cm9sKS5kYXRhKCdzb3J0YWJsZScpO1xuXHQgICAgaWYgKHNvcnRhYmxlKSBzb3J0YWJsZS5lbmFibGUoKTtcblx0ICAgIHJldHVybiBvcmlnX3VubG9jay5jYWxsKHNlbGYpO1xuXHQgIH0pO1xuXHQgIHNlbGYub24oJ2luaXRpYWxpemUnLCAoKSA9PiB7XG5cdCAgICB2YXIgJGNvbnRyb2wgPSAkKHNlbGYuY29udHJvbCkuc29ydGFibGUoe1xuXHQgICAgICBpdGVtczogJ1tkYXRhLXZhbHVlXScsXG5cdCAgICAgIGZvcmNlUGxhY2Vob2xkZXJTaXplOiB0cnVlLFxuXHQgICAgICBkaXNhYmxlZDogc2VsZi5pc0xvY2tlZCxcblx0ICAgICAgc3RhcnQ6IChlLCB1aSkgPT4ge1xuXHQgICAgICAgIHVpLnBsYWNlaG9sZGVyLmNzcygnd2lkdGgnLCB1aS5oZWxwZXIuY3NzKCd3aWR0aCcpKTtcblx0ICAgICAgICAkY29udHJvbC5jc3Moe1xuXHQgICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9LFxuXHQgICAgICBzdG9wOiAoKSA9PiB7XG5cdCAgICAgICAgJGNvbnRyb2wuY3NzKHtcblx0ICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcblx0ICAgICAgICAkY29udHJvbC5jaGlsZHJlbignW2RhdGEtdmFsdWVdJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICBpZiAodGhpcy5kYXRhc2V0LnZhbHVlKSB2YWx1ZXMucHVzaCh0aGlzLmRhdGFzZXQudmFsdWUpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIHNlbGYuc2V0VmFsdWUodmFsdWVzKTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImRyb3Bkb3duX2hlYWRlclwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGRyb3Bkb3duX2hlYWRlciAodXNlck9wdGlvbnMpIHtcblx0ICBjb25zdCBzZWxmID0gdGhpcztcblx0ICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cdCAgICB0aXRsZTogJ1VudGl0bGVkJyxcblx0ICAgIGhlYWRlckNsYXNzOiAnZHJvcGRvd24taGVhZGVyJyxcblx0ICAgIHRpdGxlUm93Q2xhc3M6ICdkcm9wZG93bi1oZWFkZXItdGl0bGUnLFxuXHQgICAgbGFiZWxDbGFzczogJ2Ryb3Bkb3duLWhlYWRlci1sYWJlbCcsXG5cdCAgICBjbG9zZUNsYXNzOiAnZHJvcGRvd24taGVhZGVyLWNsb3NlJyxcblx0ICAgIGh0bWw6IGRhdGEgPT4ge1xuXHQgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCInICsgZGF0YS5oZWFkZXJDbGFzcyArICdcIj4nICsgJzxkaXYgY2xhc3M9XCInICsgZGF0YS50aXRsZVJvd0NsYXNzICsgJ1wiPicgKyAnPHNwYW4gY2xhc3M9XCInICsgZGF0YS5sYWJlbENsYXNzICsgJ1wiPicgKyBkYXRhLnRpdGxlICsgJzwvc3Bhbj4nICsgJzxhIGNsYXNzPVwiJyArIGRhdGEuY2xvc2VDbGFzcyArICdcIj4mdGltZXM7PC9hPicgKyAnPC9kaXY+JyArICc8L2Rpdj4nO1xuXHQgICAgfVxuXHQgIH0sIHVzZXJPcHRpb25zKTtcblx0ICBzZWxmLm9uKCdpbml0aWFsaXplJywgKCkgPT4ge1xuXHQgICAgdmFyIGhlYWRlciA9IGdldERvbShvcHRpb25zLmh0bWwob3B0aW9ucykpO1xuXHQgICAgdmFyIGNsb3NlX2xpbmsgPSBoZWFkZXIucXVlcnlTZWxlY3RvcignLicgKyBvcHRpb25zLmNsb3NlQ2xhc3MpO1xuXG5cdCAgICBpZiAoY2xvc2VfbGluaykge1xuXHQgICAgICBjbG9zZV9saW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZ0ID0+IHtcblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChldnQsIHRydWUpO1xuXHQgICAgICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuZHJvcGRvd24uaW5zZXJ0QmVmb3JlKGhlYWRlciwgc2VsZi5kcm9wZG93bi5maXJzdENoaWxkKTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwiZHJvcGRvd25faW5wdXRcIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBjYXJldF9wb3NpdGlvbiAoKSB7XG5cdCAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgIC8qKlxuXHQgICAqIE1vdmVzIHRoZSBjYXJldCB0byB0aGUgc3BlY2lmaWVkIGluZGV4LlxuXHQgICAqXG5cdCAgICogVGhlIGlucHV0IG11c3QgYmUgbW92ZWQgYnkgbGVhdmluZyBpdCBpbiBwbGFjZSBhbmQgbW92aW5nIHRoZVxuXHQgICAqIHNpYmxpbmdzLCBkdWUgdG8gdGhlIGZhY3QgdGhhdCBmb2N1cyBjYW5ub3QgYmUgcmVzdG9yZWQgb25jZSBsb3N0XG5cdCAgICogb24gbW9iaWxlIHdlYmtpdCBkZXZpY2VzXG5cdCAgICpcblx0ICAgKi9cblxuXHQgIHNlbGYuaG9vaygnaW5zdGVhZCcsICdzZXRDYXJldCcsIG5ld19wb3MgPT4ge1xuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScgfHwgIXNlbGYuY29udHJvbC5jb250YWlucyhzZWxmLmNvbnRyb2xfaW5wdXQpKSB7XG5cdCAgICAgIG5ld19wb3MgPSBzZWxmLml0ZW1zLmxlbmd0aDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIG5ld19wb3MgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihzZWxmLml0ZW1zLmxlbmd0aCwgbmV3X3BvcykpO1xuXG5cdCAgICAgIGlmIChuZXdfcG9zICE9IHNlbGYuY2FyZXRQb3MgJiYgIXNlbGYuaXNQZW5kaW5nKSB7XG5cdCAgICAgICAgc2VsZi5jb250cm9sQ2hpbGRyZW4oKS5mb3JFYWNoKChjaGlsZCwgaikgPT4ge1xuXHQgICAgICAgICAgaWYgKGogPCBuZXdfcG9zKSB7XG5cdCAgICAgICAgICAgIHNlbGYuY29udHJvbF9pbnB1dC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2JlZm9yZWJlZ2luJywgY2hpbGQpO1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgc2VsZi5jb250cm9sLmFwcGVuZENoaWxkKGNoaWxkKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBzZWxmLmNhcmV0UG9zID0gbmV3X3Bvcztcblx0ICB9KTtcblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnbW92ZUNhcmV0JywgZGlyZWN0aW9uID0+IHtcblx0ICAgIGlmICghc2VsZi5pc0ZvY3VzZWQpIHJldHVybjsgLy8gbW92ZSBjYXJldCBiZWZvcmUgb3IgYWZ0ZXIgc2VsZWN0ZWQgaXRlbXNcblxuXHQgICAgY29uc3QgbGFzdF9hY3RpdmUgPSBzZWxmLmdldExhc3RBY3RpdmUoZGlyZWN0aW9uKTtcblxuXHQgICAgaWYgKGxhc3RfYWN0aXZlKSB7XG5cdCAgICAgIGNvbnN0IGlkeCA9IG5vZGVJbmRleChsYXN0X2FjdGl2ZSk7XG5cdCAgICAgIHNlbGYuc2V0Q2FyZXQoZGlyZWN0aW9uID4gMCA/IGlkeCArIDEgOiBpZHgpO1xuXHQgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW0oKTtcblx0ICAgICAgcmVtb3ZlQ2xhc3NlcyhsYXN0X2FjdGl2ZSwgJ2xhc3QtYWN0aXZlJyk7IC8vIG1vdmUgY2FyZXQgbGVmdCBvciByaWdodCBvZiBjdXJyZW50IHBvc2l0aW9uXG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZWxmLnNldENhcmV0KHNlbGYuY2FyZXRQb3MgKyBkaXJlY3Rpb24pO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJkcm9wZG93bl9pbnB1dFwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGRyb3Bkb3duX2lucHV0ICgpIHtcblx0ICBjb25zdCBzZWxmID0gdGhpcztcblx0ICBzZWxmLnNldHRpbmdzLnNob3VsZE9wZW4gPSB0cnVlOyAvLyBtYWtlIHN1cmUgdGhlIGlucHV0IGlzIHNob3duIGV2ZW4gaWYgdGhlcmUgYXJlIG5vIG9wdGlvbnMgdG8gZGlzcGxheSBpbiB0aGUgZHJvcGRvd25cblxuXHQgIHNlbGYuaG9vaygnYmVmb3JlJywgJ3NldHVwJywgKCkgPT4ge1xuXHQgICAgc2VsZi5mb2N1c19ub2RlID0gc2VsZi5jb250cm9sO1xuXHQgICAgYWRkQ2xhc3NlcyhzZWxmLmNvbnRyb2xfaW5wdXQsICdkcm9wZG93bi1pbnB1dCcpO1xuXHQgICAgY29uc3QgZGl2ID0gZ2V0RG9tKCc8ZGl2IGNsYXNzPVwiZHJvcGRvd24taW5wdXQtd3JhcFwiPicpO1xuXHQgICAgZGl2LmFwcGVuZChzZWxmLmNvbnRyb2xfaW5wdXQpO1xuXHQgICAgc2VsZi5kcm9wZG93bi5pbnNlcnRCZWZvcmUoZGl2LCBzZWxmLmRyb3Bkb3duLmZpcnN0Q2hpbGQpOyAvLyBzZXQgYSBwbGFjZWhvbGRlciBpbiB0aGUgc2VsZWN0IGNvbnRyb2xcblxuXHQgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBnZXREb20oJzxpbnB1dCBjbGFzcz1cIml0ZW1zLXBsYWNlaG9sZGVyXCIgdGFiaW5kZXg9XCItMVwiIC8+Jyk7XG5cdCAgICBwbGFjZWhvbGRlci5wbGFjZWhvbGRlciA9IHNlbGYuc2V0dGluZ3MucGxhY2Vob2xkZXIgfHwgJyc7XG5cdCAgICBzZWxmLmNvbnRyb2wuYXBwZW5kKHBsYWNlaG9sZGVyKTtcblx0ICB9KTtcblx0ICBzZWxmLm9uKCdpbml0aWFsaXplJywgKCkgPT4ge1xuXHQgICAgLy8gc2V0IHRhYkluZGV4IG9uIGNvbnRyb2wgdG8gLTEsIG90aGVyd2lzZSBbc2hpZnQrdGFiXSB3aWxsIHB1dCBmb2N1cyByaWdodCBiYWNrIG9uIGNvbnRyb2xfaW5wdXRcblx0ICAgIHNlbGYuY29udHJvbF9pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXZ0ID0+IHtcblx0ICAgICAgLy9hZGRFdmVudChzZWxmLmNvbnRyb2xfaW5wdXQsJ2tleWRvd24nIGFzIGNvbnN0LChldnQ6S2V5Ym9hcmRFdmVudCkgPT57XG5cdCAgICAgIHN3aXRjaCAoZXZ0LmtleUNvZGUpIHtcblx0ICAgICAgICBjYXNlIEtFWV9FU0M6XG5cdCAgICAgICAgICBpZiAoc2VsZi5pc09wZW4pIHtcblx0ICAgICAgICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgICAgICAgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgICAgICAgfVxuXG5cdCAgICAgICAgICBzZWxmLmNsZWFyQWN0aXZlSXRlbXMoKTtcblx0ICAgICAgICAgIHJldHVybjtcblxuXHQgICAgICAgIGNhc2UgS0VZX1RBQjpcblx0ICAgICAgICAgIHNlbGYuZm9jdXNfbm9kZS50YWJJbmRleCA9IC0xO1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gc2VsZi5vbktleURvd24uY2FsbChzZWxmLCBldnQpO1xuXHQgICAgfSk7XG5cdCAgICBzZWxmLm9uKCdibHVyJywgKCkgPT4ge1xuXHQgICAgICBzZWxmLmZvY3VzX25vZGUudGFiSW5kZXggPSBzZWxmLmlzRGlzYWJsZWQgPyAtMSA6IHNlbGYudGFiSW5kZXg7XG5cdCAgICB9KTsgLy8gZ2l2ZSB0aGUgY29udHJvbF9pbnB1dCBmb2N1cyB3aGVuIHRoZSBkcm9wZG93biBpcyBvcGVuXG5cblx0ICAgIHNlbGYub24oJ2Ryb3Bkb3duX29wZW4nLCAoKSA9PiB7XG5cdCAgICAgIHNlbGYuY29udHJvbF9pbnB1dC5mb2N1cygpO1xuXHQgICAgfSk7IC8vIHByZXZlbnQgb25CbHVyIGZyb20gY2xvc2luZyB3aGVuIGZvY3VzIGlzIG9uIHRoZSBjb250cm9sX2lucHV0XG5cblx0ICAgIGNvbnN0IG9yaWdfb25CbHVyID0gc2VsZi5vbkJsdXI7XG5cdCAgICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnb25CbHVyJywgZXZ0ID0+IHtcblx0ICAgICAgaWYgKGV2dCAmJiBldnQucmVsYXRlZFRhcmdldCA9PSBzZWxmLmNvbnRyb2xfaW5wdXQpIHJldHVybjtcblx0ICAgICAgcmV0dXJuIG9yaWdfb25CbHVyLmNhbGwoc2VsZik7XG5cdCAgICB9KTtcblx0ICAgIGFkZEV2ZW50KHNlbGYuY29udHJvbF9pbnB1dCwgJ2JsdXInLCAoKSA9PiBzZWxmLm9uQmx1cigpKTsgLy8gcmV0dXJuIGZvY3VzIHRvIGNvbnRyb2wgdG8gYWxsb3cgZnVydGhlciBrZXlib2FyZCBpbnB1dFxuXG5cdCAgICBzZWxmLmhvb2soJ2JlZm9yZScsICdjbG9zZScsICgpID0+IHtcblx0ICAgICAgaWYgKCFzZWxmLmlzT3BlbikgcmV0dXJuO1xuXHQgICAgICBzZWxmLmZvY3VzX25vZGUuZm9jdXMoe1xuXHQgICAgICAgIHByZXZlbnRTY3JvbGw6IHRydWVcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwiaW5wdXRfYXV0b2dyb3dcIiAoVG9tIFNlbGVjdClcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBpbnB1dF9hdXRvZ3JvdyAoKSB7XG5cdCAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgIHNlbGYub24oJ2luaXRpYWxpemUnLCAoKSA9PiB7XG5cdCAgICB2YXIgdGVzdF9pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0ICAgIHZhciBjb250cm9sID0gc2VsZi5jb250cm9sX2lucHV0O1xuXHQgICAgdGVzdF9pbnB1dC5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOmFic29sdXRlOyB0b3A6LTk5OTk5cHg7IGxlZnQ6LTk5OTk5cHg7IHdpZHRoOmF1dG87IHBhZGRpbmc6MDsgd2hpdGUtc3BhY2U6cHJlOyAnO1xuXHQgICAgc2VsZi53cmFwcGVyLmFwcGVuZENoaWxkKHRlc3RfaW5wdXQpO1xuXHQgICAgdmFyIHRyYW5zZmVyX3N0eWxlcyA9IFsnbGV0dGVyU3BhY2luZycsICdmb250U2l6ZScsICdmb250RmFtaWx5JywgJ2ZvbnRXZWlnaHQnLCAndGV4dFRyYW5zZm9ybSddO1xuXG5cdCAgICBmb3IgKGNvbnN0IHN0eWxlX25hbWUgb2YgdHJhbnNmZXJfc3R5bGVzKSB7XG5cdCAgICAgIC8vIEB0cy1pZ25vcmUgVFM3MDE1IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81MDUwNjE1NC82OTc1NzZcblx0ICAgICAgdGVzdF9pbnB1dC5zdHlsZVtzdHlsZV9uYW1lXSA9IGNvbnRyb2wuc3R5bGVbc3R5bGVfbmFtZV07XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIFNldCB0aGUgY29udHJvbCB3aWR0aFxuXHQgICAgICpcblx0ICAgICAqL1xuXG5cblx0ICAgIHZhciByZXNpemUgPSAoKSA9PiB7XG5cdCAgICAgIHRlc3RfaW5wdXQudGV4dENvbnRlbnQgPSBjb250cm9sLnZhbHVlO1xuXHQgICAgICBjb250cm9sLnN0eWxlLndpZHRoID0gdGVzdF9pbnB1dC5jbGllbnRXaWR0aCArICdweCc7XG5cdCAgICB9O1xuXG5cdCAgICByZXNpemUoKTtcblx0ICAgIHNlbGYub24oJ3VwZGF0ZSBpdGVtX2FkZCBpdGVtX3JlbW92ZScsIHJlc2l6ZSk7XG5cdCAgICBhZGRFdmVudChjb250cm9sLCAnaW5wdXQnLCByZXNpemUpO1xuXHQgICAgYWRkRXZlbnQoY29udHJvbCwgJ2tleXVwJywgcmVzaXplKTtcblx0ICAgIGFkZEV2ZW50KGNvbnRyb2wsICdibHVyJywgcmVzaXplKTtcblx0ICAgIGFkZEV2ZW50KGNvbnRyb2wsICd1cGRhdGUnLCByZXNpemUpO1xuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJpbnB1dF9hdXRvZ3Jvd1wiIChUb20gU2VsZWN0KVxuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIG5vX2JhY2tzcGFjZV9kZWxldGUgKCkge1xuXHQgIHZhciBzZWxmID0gdGhpcztcblx0ICB2YXIgb3JpZ19kZWxldGVTZWxlY3Rpb24gPSBzZWxmLmRlbGV0ZVNlbGVjdGlvbjtcblx0ICB0aGlzLmhvb2soJ2luc3RlYWQnLCAnZGVsZXRlU2VsZWN0aW9uJywgZXZ0ID0+IHtcblx0ICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW1zLmxlbmd0aCkge1xuXHQgICAgICByZXR1cm4gb3JpZ19kZWxldGVTZWxlY3Rpb24uY2FsbChzZWxmLCBldnQpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcIm5vX2FjdGl2ZV9pdGVtc1wiIChUb20gU2VsZWN0KVxuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIG5vX2FjdGl2ZV9pdGVtcyAoKSB7XG5cdCAgdGhpcy5ob29rKCdpbnN0ZWFkJywgJ3NldEFjdGl2ZUl0ZW0nLCAoKSA9PiB7fSk7XG5cdCAgdGhpcy5ob29rKCdpbnN0ZWFkJywgJ3NlbGVjdEFsbCcsICgpID0+IHt9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwib3B0Z3JvdXBfY29sdW1uc1wiIChUb20gU2VsZWN0LmpzKVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIG9wdGdyb3VwX2NvbHVtbnMgKCkge1xuXHQgIHZhciBzZWxmID0gdGhpcztcblx0ICB2YXIgb3JpZ19rZXlkb3duID0gc2VsZi5vbktleURvd247XG5cdCAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ29uS2V5RG93bicsIGV2dCA9PiB7XG5cdCAgICB2YXIgaW5kZXgsIG9wdGlvbiwgb3B0aW9ucywgb3B0Z3JvdXA7XG5cblx0ICAgIGlmICghc2VsZi5pc09wZW4gfHwgIShldnQua2V5Q29kZSA9PT0gS0VZX0xFRlQgfHwgZXZ0LmtleUNvZGUgPT09IEtFWV9SSUdIVCkpIHtcblx0ICAgICAgcmV0dXJuIG9yaWdfa2V5ZG93bi5jYWxsKHNlbGYsIGV2dCk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuaWdub3JlSG92ZXIgPSB0cnVlO1xuXHQgICAgb3B0Z3JvdXAgPSBwYXJlbnRNYXRjaChzZWxmLmFjdGl2ZU9wdGlvbiwgJ1tkYXRhLWdyb3VwXScpO1xuXHQgICAgaW5kZXggPSBub2RlSW5kZXgoc2VsZi5hY3RpdmVPcHRpb24sICdbZGF0YS1zZWxlY3RhYmxlXScpO1xuXG5cdCAgICBpZiAoIW9wdGdyb3VwKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgaWYgKGV2dC5rZXlDb2RlID09PSBLRVlfTEVGVCkge1xuXHQgICAgICBvcHRncm91cCA9IG9wdGdyb3VwLnByZXZpb3VzU2libGluZztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIG9wdGdyb3VwID0gb3B0Z3JvdXAubmV4dFNpYmxpbmc7XG5cdCAgICB9XG5cblx0ICAgIGlmICghb3B0Z3JvdXApIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBvcHRpb25zID0gb3B0Z3JvdXAucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc2VsZWN0YWJsZV0nKTtcblx0ICAgIG9wdGlvbiA9IG9wdGlvbnNbTWF0aC5taW4ob3B0aW9ucy5sZW5ndGggLSAxLCBpbmRleCldO1xuXG5cdCAgICBpZiAob3B0aW9uKSB7XG5cdCAgICAgIHNlbGYuc2V0QWN0aXZlT3B0aW9uKG9wdGlvbik7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcInJlbW92ZV9idXR0b25cIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiByZW1vdmVfYnV0dG9uICh1c2VyT3B0aW9ucykge1xuXHQgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcblx0ICAgIGxhYmVsOiAnJnRpbWVzOycsXG5cdCAgICB0aXRsZTogJ1JlbW92ZScsXG5cdCAgICBjbGFzc05hbWU6ICdyZW1vdmUnLFxuXHQgICAgYXBwZW5kOiB0cnVlXG5cdCAgfSwgdXNlck9wdGlvbnMpOyAvL29wdGlvbnMuY2xhc3NOYW1lID0gJ3JlbW92ZS1zaW5nbGUnO1xuXG5cdCAgdmFyIHNlbGYgPSB0aGlzOyAvLyBvdmVycmlkZSB0aGUgcmVuZGVyIG1ldGhvZCB0byBhZGQgcmVtb3ZlIGJ1dHRvbiB0byBlYWNoIGl0ZW1cblxuXHQgIGlmICghb3B0aW9ucy5hcHBlbmQpIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cblx0ICB2YXIgaHRtbCA9ICc8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgY2xhc3M9XCInICsgb3B0aW9ucy5jbGFzc05hbWUgKyAnXCIgdGFiaW5kZXg9XCItMVwiIHRpdGxlPVwiJyArIGVzY2FwZV9odG1sKG9wdGlvbnMudGl0bGUpICsgJ1wiPicgKyBvcHRpb25zLmxhYmVsICsgJzwvYT4nO1xuXHQgIHNlbGYuaG9vaygnYWZ0ZXInLCAnc2V0dXBUZW1wbGF0ZXMnLCAoKSA9PiB7XG5cdCAgICB2YXIgb3JpZ19yZW5kZXJfaXRlbSA9IHNlbGYuc2V0dGluZ3MucmVuZGVyLml0ZW07XG5cblx0ICAgIHNlbGYuc2V0dGluZ3MucmVuZGVyLml0ZW0gPSAoZGF0YSwgZXNjYXBlKSA9PiB7XG5cdCAgICAgIHZhciBpdGVtID0gZ2V0RG9tKG9yaWdfcmVuZGVyX2l0ZW0uY2FsbChzZWxmLCBkYXRhLCBlc2NhcGUpKTtcblx0ICAgICAgdmFyIGNsb3NlX2J1dHRvbiA9IGdldERvbShodG1sKTtcblx0ICAgICAgaXRlbS5hcHBlbmRDaGlsZChjbG9zZV9idXR0b24pO1xuXHQgICAgICBhZGRFdmVudChjbG9zZV9idXR0b24sICdtb3VzZWRvd24nLCBldnQgPT4ge1xuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgIH0pO1xuXHQgICAgICBhZGRFdmVudChjbG9zZV9idXR0b24sICdjbGljaycsIGV2dCA9PiB7XG5cdCAgICAgICAgLy8gcHJvcGFnYXRpbmcgd2lsbCB0cmlnZ2VyIHRoZSBkcm9wZG93biB0byBzaG93IGZvciBzaW5nbGUgbW9kZVxuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgICAgaWYgKHNlbGYuaXNMb2NrZWQpIHJldHVybjtcblx0ICAgICAgICBpZiAoIXNlbGYuc2hvdWxkRGVsZXRlKFtpdGVtXSwgZXZ0KSkgcmV0dXJuO1xuXHQgICAgICAgIHNlbGYucmVtb3ZlSXRlbShpdGVtKTtcblx0ICAgICAgICBzZWxmLnJlZnJlc2hPcHRpb25zKGZhbHNlKTtcblx0ICAgICAgICBzZWxmLmlucHV0U3RhdGUoKTtcblx0ICAgICAgfSk7XG5cdCAgICAgIHJldHVybiBpdGVtO1xuXHQgICAgfTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwicmVzdG9yZV9vbl9iYWNrc3BhY2VcIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiByZXN0b3JlX29uX2JhY2tzcGFjZSAodXNlck9wdGlvbnMpIHtcblx0ICBjb25zdCBzZWxmID0gdGhpcztcblx0ICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cdCAgICB0ZXh0OiBvcHRpb24gPT4ge1xuXHQgICAgICByZXR1cm4gb3B0aW9uW3NlbGYuc2V0dGluZ3MubGFiZWxGaWVsZF07XG5cdCAgICB9XG5cdCAgfSwgdXNlck9wdGlvbnMpO1xuXHQgIHNlbGYub24oJ2l0ZW1fcmVtb3ZlJywgZnVuY3Rpb24gKHZhbHVlKSB7XG5cdCAgICBpZiAoIXNlbGYuaXNGb2N1c2VkKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNlbGYuY29udHJvbF9pbnB1dC52YWx1ZS50cmltKCkgPT09ICcnKSB7XG5cdCAgICAgIHZhciBvcHRpb24gPSBzZWxmLm9wdGlvbnNbdmFsdWVdO1xuXG5cdCAgICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgICBzZWxmLnNldFRleHRib3hWYWx1ZShvcHRpb25zLnRleHQuY2FsbChzZWxmLCBvcHRpb24pKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJyZXN0b3JlX29uX2JhY2tzcGFjZVwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIHZpcnR1YWxfc2Nyb2xsICgpIHtcblx0ICBjb25zdCBzZWxmID0gdGhpcztcblx0ICBjb25zdCBvcmlnX2NhbkxvYWQgPSBzZWxmLmNhbkxvYWQ7XG5cdCAgY29uc3Qgb3JpZ19jbGVhckFjdGl2ZU9wdGlvbiA9IHNlbGYuY2xlYXJBY3RpdmVPcHRpb247XG5cdCAgY29uc3Qgb3JpZ19sb2FkQ2FsbGJhY2sgPSBzZWxmLmxvYWRDYWxsYmFjaztcblx0ICB2YXIgcGFnaW5hdGlvbiA9IHt9O1xuXHQgIHZhciBkcm9wZG93bl9jb250ZW50O1xuXHQgIHZhciBsb2FkaW5nX21vcmUgPSBmYWxzZTtcblx0ICB2YXIgbG9hZF9tb3JlX29wdDtcblx0ICB2YXIgZGVmYXVsdF92YWx1ZXMgPSBbXTtcblxuXHQgIGlmICghc2VsZi5zZXR0aW5ncy5zaG91bGRMb2FkTW9yZSkge1xuXHQgICAgLy8gcmV0dXJuIHRydWUgaWYgYWRkaXRpb25hbCByZXN1bHRzIHNob3VsZCBiZSBsb2FkZWRcblx0ICAgIHNlbGYuc2V0dGluZ3Muc2hvdWxkTG9hZE1vcmUgPSAoKSA9PiB7XG5cdCAgICAgIGNvbnN0IHNjcm9sbF9wZXJjZW50ID0gZHJvcGRvd25fY29udGVudC5jbGllbnRIZWlnaHQgLyAoZHJvcGRvd25fY29udGVudC5zY3JvbGxIZWlnaHQgLSBkcm9wZG93bl9jb250ZW50LnNjcm9sbFRvcCk7XG5cblx0ICAgICAgaWYgKHNjcm9sbF9wZXJjZW50ID4gMC45KSB7XG5cdCAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoc2VsZi5hY3RpdmVPcHRpb24pIHtcblx0ICAgICAgICB2YXIgc2VsZWN0YWJsZSA9IHNlbGYuc2VsZWN0YWJsZSgpO1xuXHQgICAgICAgIHZhciBpbmRleCA9IEFycmF5LmZyb20oc2VsZWN0YWJsZSkuaW5kZXhPZihzZWxmLmFjdGl2ZU9wdGlvbik7XG5cblx0ICAgICAgICBpZiAoaW5kZXggPj0gc2VsZWN0YWJsZS5sZW5ndGggLSAyKSB7XG5cdCAgICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9O1xuXHQgIH1cblxuXHQgIGlmICghc2VsZi5zZXR0aW5ncy5maXJzdFVybCkge1xuXHQgICAgdGhyb3cgJ3ZpcnR1YWxfc2Nyb2xsIHBsdWdpbiByZXF1aXJlcyBhIGZpcnN0VXJsKCkgbWV0aG9kJztcblx0ICB9IC8vIGluIG9yZGVyIGZvciB2aXJ0dWFsIHNjcm9sbGluZyB0byB3b3JrLFxuXHQgIC8vIG9wdGlvbnMgbmVlZCB0byBiZSBvcmRlcmVkIHRoZSBzYW1lIHdheSB0aGV5J3JlIHJldHVybmVkIGZyb20gdGhlIHJlbW90ZSBkYXRhIHNvdXJjZVxuXG5cblx0ICBzZWxmLnNldHRpbmdzLnNvcnRGaWVsZCA9IFt7XG5cdCAgICBmaWVsZDogJyRvcmRlcidcblx0ICB9LCB7XG5cdCAgICBmaWVsZDogJyRzY29yZSdcblx0ICB9XTsgLy8gY2FuIHdlIGxvYWQgbW9yZSByZXN1bHRzIGZvciBnaXZlbiBxdWVyeT9cblxuXHQgIGNvbnN0IGNhbkxvYWRNb3JlID0gcXVlcnkgPT4ge1xuXHQgICAgaWYgKHR5cGVvZiBzZWxmLnNldHRpbmdzLm1heE9wdGlvbnMgPT09ICdudW1iZXInICYmIGRyb3Bkb3duX2NvbnRlbnQuY2hpbGRyZW4ubGVuZ3RoID49IHNlbGYuc2V0dGluZ3MubWF4T3B0aW9ucykge1xuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIGlmIChxdWVyeSBpbiBwYWdpbmF0aW9uICYmIHBhZ2luYXRpb25bcXVlcnldKSB7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfTtcblxuXHQgIGNvbnN0IGNsZWFyRmlsdGVyID0gKG9wdGlvbiwgdmFsdWUpID0+IHtcblx0ICAgIGlmIChzZWxmLml0ZW1zLmluZGV4T2YodmFsdWUpID49IDAgfHwgZGVmYXVsdF92YWx1ZXMuaW5kZXhPZih2YWx1ZSkgPj0gMCkge1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH07IC8vIHNldCB0aGUgbmV4dCB1cmwgdGhhdCB3aWxsIGJlXG5cblxuXHQgIHNlbGYuc2V0TmV4dFVybCA9ICh2YWx1ZSwgbmV4dF91cmwpID0+IHtcblx0ICAgIHBhZ2luYXRpb25bdmFsdWVdID0gbmV4dF91cmw7XG5cdCAgfTsgLy8gZ2V0VXJsKCkgdG8gYmUgdXNlZCBpbiBzZXR0aW5ncy5sb2FkKClcblxuXG5cdCAgc2VsZi5nZXRVcmwgPSBxdWVyeSA9PiB7XG5cdCAgICBpZiAocXVlcnkgaW4gcGFnaW5hdGlvbikge1xuXHQgICAgICBjb25zdCBuZXh0X3VybCA9IHBhZ2luYXRpb25bcXVlcnldO1xuXHQgICAgICBwYWdpbmF0aW9uW3F1ZXJ5XSA9IGZhbHNlO1xuXHQgICAgICByZXR1cm4gbmV4dF91cmw7XG5cdCAgICB9IC8vIGlmIHRoZSB1c2VyIGdvZXMgYmFjayB0byBhIHByZXZpb3VzIHF1ZXJ5XG5cdCAgICAvLyB3ZSBuZWVkIHRvIGxvYWQgdGhlIGZpcnN0IHBhZ2UgYWdhaW5cblxuXG5cdCAgICBwYWdpbmF0aW9uID0ge307XG5cdCAgICByZXR1cm4gc2VsZi5zZXR0aW5ncy5maXJzdFVybC5jYWxsKHNlbGYsIHF1ZXJ5KTtcblx0ICB9OyAvLyBkb24ndCBjbGVhciB0aGUgYWN0aXZlIG9wdGlvbiAoYW5kIGNhdXNlIHVud2FudGVkIGRyb3Bkb3duIHNjcm9sbClcblx0ICAvLyB3aGlsZSBsb2FkaW5nIG1vcmUgcmVzdWx0c1xuXG5cblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnY2xlYXJBY3RpdmVPcHRpb24nLCAoKSA9PiB7XG5cdCAgICBpZiAobG9hZGluZ19tb3JlKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIG9yaWdfY2xlYXJBY3RpdmVPcHRpb24uY2FsbChzZWxmKTtcblx0ICB9KTsgLy8gb3ZlcnJpZGUgdGhlIGNhbkxvYWQgbWV0aG9kXG5cblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnY2FuTG9hZCcsIHF1ZXJ5ID0+IHtcblx0ICAgIC8vIGZpcnN0IHRpbWUgdGhlIHF1ZXJ5IGhhcyBiZWVuIHNlZW5cblx0ICAgIGlmICghKHF1ZXJ5IGluIHBhZ2luYXRpb24pKSB7XG5cdCAgICAgIHJldHVybiBvcmlnX2NhbkxvYWQuY2FsbChzZWxmLCBxdWVyeSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBjYW5Mb2FkTW9yZShxdWVyeSk7XG5cdCAgfSk7IC8vIHdyYXAgdGhlIGxvYWRcblxuXHQgIHNlbGYuaG9vaygnaW5zdGVhZCcsICdsb2FkQ2FsbGJhY2snLCAob3B0aW9ucywgb3B0Z3JvdXBzKSA9PiB7XG5cdCAgICBpZiAoIWxvYWRpbmdfbW9yZSkge1xuXHQgICAgICBzZWxmLmNsZWFyT3B0aW9ucyhjbGVhckZpbHRlcik7XG5cdCAgICB9IGVsc2UgaWYgKGxvYWRfbW9yZV9vcHQpIHtcblx0ICAgICAgY29uc3QgZmlyc3Rfb3B0aW9uID0gb3B0aW9uc1swXTtcblxuXHQgICAgICBpZiAoZmlyc3Rfb3B0aW9uICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICBsb2FkX21vcmVfb3B0LmRhdGFzZXQudmFsdWUgPSBmaXJzdF9vcHRpb25bc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBvcmlnX2xvYWRDYWxsYmFjay5jYWxsKHNlbGYsIG9wdGlvbnMsIG9wdGdyb3Vwcyk7XG5cdCAgICBsb2FkaW5nX21vcmUgPSBmYWxzZTtcblx0ICB9KTsgLy8gYWRkIHRlbXBsYXRlcyB0byBkcm9wZG93blxuXHQgIC8vXHRsb2FkaW5nX21vcmUgaWYgd2UgaGF2ZSBhbm90aGVyIHVybCBpbiB0aGUgcXVldWVcblx0ICAvL1x0bm9fbW9yZV9yZXN1bHRzIGlmIHdlIGRvbid0IGhhdmUgYW5vdGhlciB1cmwgaW4gdGhlIHF1ZXVlXG5cblx0ICBzZWxmLmhvb2soJ2FmdGVyJywgJ3JlZnJlc2hPcHRpb25zJywgKCkgPT4ge1xuXHQgICAgY29uc3QgcXVlcnkgPSBzZWxmLmxhc3RWYWx1ZTtcblx0ICAgIHZhciBvcHRpb247XG5cblx0ICAgIGlmIChjYW5Mb2FkTW9yZShxdWVyeSkpIHtcblx0ICAgICAgb3B0aW9uID0gc2VsZi5yZW5kZXIoJ2xvYWRpbmdfbW9yZScsIHtcblx0ICAgICAgICBxdWVyeTogcXVlcnlcblx0ICAgICAgfSk7XG5cblx0ICAgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2VsZWN0YWJsZScsICcnKTsgLy8gc28gdGhhdCBuYXZpZ2F0aW5nIGRyb3Bkb3duIHdpdGggW2Rvd25dIGtleXByZXNzZXMgY2FuIG5hdmlnYXRlIHRvIHRoaXMgbm9kZVxuXG5cdCAgICAgICAgbG9hZF9tb3JlX29wdCA9IG9wdGlvbjtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIGlmIChxdWVyeSBpbiBwYWdpbmF0aW9uICYmICFkcm9wZG93bl9jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5uby1yZXN1bHRzJykpIHtcblx0ICAgICAgb3B0aW9uID0gc2VsZi5yZW5kZXIoJ25vX21vcmVfcmVzdWx0cycsIHtcblx0ICAgICAgICBxdWVyeTogcXVlcnlcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgYWRkQ2xhc3NlcyhvcHRpb24sIHNlbGYuc2V0dGluZ3Mub3B0aW9uQ2xhc3MpO1xuXHQgICAgICBkcm9wZG93bl9jb250ZW50LmFwcGVuZChvcHRpb24pO1xuXHQgICAgfVxuXHQgIH0pOyAvLyBhZGQgc2Nyb2xsIGxpc3RlbmVyIGFuZCBkZWZhdWx0IHRlbXBsYXRlc1xuXG5cdCAgc2VsZi5vbignaW5pdGlhbGl6ZScsICgpID0+IHtcblx0ICAgIGRlZmF1bHRfdmFsdWVzID0gT2JqZWN0LmtleXMoc2VsZi5vcHRpb25zKTtcblx0ICAgIGRyb3Bkb3duX2NvbnRlbnQgPSBzZWxmLmRyb3Bkb3duX2NvbnRlbnQ7IC8vIGRlZmF1bHQgdGVtcGxhdGVzXG5cblx0ICAgIHNlbGYuc2V0dGluZ3MucmVuZGVyID0gT2JqZWN0LmFzc2lnbih7fSwge1xuXHQgICAgICBsb2FkaW5nX21vcmU6ICgpID0+IHtcblx0ICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJsb2FkaW5nLW1vcmUtcmVzdWx0c1wiPkxvYWRpbmcgbW9yZSByZXN1bHRzIC4uLiA8L2Rpdj5gO1xuXHQgICAgICB9LFxuXHQgICAgICBub19tb3JlX3Jlc3VsdHM6ICgpID0+IHtcblx0ICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJuby1tb3JlLXJlc3VsdHNcIj5ObyBtb3JlIHJlc3VsdHM8L2Rpdj5gO1xuXHQgICAgICB9XG5cdCAgICB9LCBzZWxmLnNldHRpbmdzLnJlbmRlcik7IC8vIHdhdGNoIGRyb3Bkb3duIGNvbnRlbnQgc2Nyb2xsIHBvc2l0aW9uXG5cblx0ICAgIGRyb3Bkb3duX2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuXHQgICAgICBpZiAoIXNlbGYuc2V0dGluZ3Muc2hvdWxkTG9hZE1vcmUuY2FsbChzZWxmKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfSAvLyAhaW1wb3J0YW50OiB0aGlzIHdpbGwgZ2V0IGNoZWNrZWQgYWdhaW4gaW4gbG9hZCgpIGJ1dCB3ZSBzdGlsbCBuZWVkIHRvIGNoZWNrIGhlcmUgb3RoZXJ3aXNlIGxvYWRpbmdfbW9yZSB3aWxsIGJlIHNldCB0byB0cnVlXG5cblxuXHQgICAgICBpZiAoIWNhbkxvYWRNb3JlKHNlbGYubGFzdFZhbHVlKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfSAvLyBkb24ndCBjYWxsIGxvYWQoKSB0b28gbXVjaFxuXG5cblx0ICAgICAgaWYgKGxvYWRpbmdfbW9yZSkgcmV0dXJuO1xuXHQgICAgICBsb2FkaW5nX21vcmUgPSB0cnVlO1xuXHQgICAgICBzZWxmLmxvYWQuY2FsbChzZWxmLCBzZWxmLmxhc3RWYWx1ZSk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0fVxuXG5cdFRvbVNlbGVjdC5kZWZpbmUoJ2NoYW5nZV9saXN0ZW5lcicsIGNoYW5nZV9saXN0ZW5lcik7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ2NoZWNrYm94X29wdGlvbnMnLCBjaGVja2JveF9vcHRpb25zKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnY2xlYXJfYnV0dG9uJywgY2xlYXJfYnV0dG9uKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnZHJhZ19kcm9wJywgZHJhZ19kcm9wKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnZHJvcGRvd25faGVhZGVyJywgZHJvcGRvd25faGVhZGVyKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnY2FyZXRfcG9zaXRpb24nLCBjYXJldF9wb3NpdGlvbik7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ2Ryb3Bkb3duX2lucHV0JywgZHJvcGRvd25faW5wdXQpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdpbnB1dF9hdXRvZ3JvdycsIGlucHV0X2F1dG9ncm93KTtcblx0VG9tU2VsZWN0LmRlZmluZSgnbm9fYmFja3NwYWNlX2RlbGV0ZScsIG5vX2JhY2tzcGFjZV9kZWxldGUpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdub19hY3RpdmVfaXRlbXMnLCBub19hY3RpdmVfaXRlbXMpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdvcHRncm91cF9jb2x1bW5zJywgb3B0Z3JvdXBfY29sdW1ucyk7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ3JlbW92ZV9idXR0b24nLCByZW1vdmVfYnV0dG9uKTtcblx0VG9tU2VsZWN0LmRlZmluZSgncmVzdG9yZV9vbl9iYWNrc3BhY2UnLCByZXN0b3JlX29uX2JhY2tzcGFjZSk7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ3ZpcnR1YWxfc2Nyb2xsJywgdmlydHVhbF9zY3JvbGwpO1xuXG5cdHJldHVybiBUb21TZWxlY3Q7XG5cbn0pKTtcbnZhciB0b21TZWxlY3Q9ZnVuY3Rpb24oZWwsb3B0cyl7cmV0dXJuIG5ldyBUb21TZWxlY3QoZWwsb3B0cyk7fSBcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRvbS1zZWxlY3QuY29tcGxldGUuanMubWFwXG4iLCJpbXBvcnQgVG9tU2VsZWN0IGZyb20gXCJ0b20tc2VsZWN0XCJcclxuaW1wb3J0IHsgVG9tSW5wdXQgfSBmcm9tIFwidG9tLXNlbGVjdC9kaXN0L3R5cGVzL3R5cGVzXCI7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgLy8udG9tLXNlbGVjdOOBjOOBguOCjOOBsFRvbVNlbGVjdOimgee0oCjjgrPjg7Pjg5zjg5zjg4Pjgq/jgrkp44Gr572u44GN5o+b44GI44KLXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9tLXNlbGVjdCcpLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgbmV3IFRvbVNlbGVjdChlbCBhcyBUb21JbnB1dCwge30pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNsYXNzIGNvbW1vbiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlcGxhY2VUb21TZWxlY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIC50b20tc2VsZWN044Gu6KaB57Sg44KSVG9tU2VsZWN06KaB57SgKOOCs+ODs+ODnOODnOODg+OCr+OCuSnjgavnva7jgY3mj5vjgYjjgotcclxuICAgICAqICovXHJcbiAgICByZXBsYWNlVG9tU2VsZWN0KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vLnRvbS1zZWxlY3TjgYzjgYLjgozjgbBUb21TZWxlY3TopoHntKAo44Kz44Oz44Oc44Oc44OD44Kv44K5KeOBq+e9ruOBjeaPm+OBiOOCi1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9tLXNlbGVjdCcpLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXcgVG9tU2VsZWN0KGVsIGFzIFRvbUlucHV0LCB7fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG59OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBjb21tb24gfSBmcm9tICcuLi9jb21tb24vZGlzcF9jb21tb24nO1xyXG5cclxubmV3IGNvbW1vbigpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==