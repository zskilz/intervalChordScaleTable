(function () {
/**
 * almond 0.2.5 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

define('musicHelper',{
    SciNotes: ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
    Intervals: ["Unison", "minor 2nd", "Major 2nd", "minor 3rd", "Major 3rd", "4th", "Tritone", "5th", "minor 6th", "Major 6th", "minor 7th", "Major 7th", "Octave", "minor 9th", "Major 9th"],
    Chords: {

        Dim: [1, 0, 0, 1, 0, 0, 1],
        Min: [1, 0, 0, 1, 0, 0, 0, 1],
        Maj: [1, 0, 0, 0, 1, 0, 0, 1],
        Aug: [1, 0, 0, 0, 1, 0, 0, 0, 1],
        //'9th' : [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        Maj7: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        Min7: [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        Dim7: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],

    },
    Scales: {
        Major: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1],
        NaturalMinor: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
        HarmonicMinor: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1],
        Dorian: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
        Mixolydian: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    }


});
define('audioHelper',{
    generateToneBuffer: function(sampleRate) {
        var toneTime = 1.8,
            n = toneTime * sampleRate,
            buffer = new Array(n),
            t, fade, fadeSqr, freq = 110.0;
        //A2, Concert pitch A4 = 440Hz

        for (var i = 0; i < n; i++) {
            t = i / sampleRate;
            fade = (n - i) / n;
            fadeSqr = fade * fade;
            //prime harmonics
            buffer[i] = fade * Math.sin(freq * t * Math.PI * 2);
            buffer[i] += fadeSqr * Math.sin(freq * 2 * t * Math.PI * 2) / 2;
            buffer[i] += fadeSqr * fade * Math.sin(freq * 3 * t * Math.PI * 2) / 3;
            buffer[i] += fadeSqr * fadeSqr * Math.sin(freq * 4 * t * Math.PI * 2) / 4;
            buffer[i] += fadeSqr * fadeSqr * fade * Math.sin(freq * 5 * t * Math.PI * 2) / 5;
            buffer[i] += fadeSqr * fadeSqr * fadeSqr * Math.sin(freq * 6 * t * Math.PI * 2) / 6;

        }
        //attack - smooth out the first bit...
        var smoothSamples = 164;
        for (var i = 0; i < smoothSamples; i++) {
            buffer[i] *= i / smoothSamples;
        }

        return buffer;
    },
    initAudio: function(outputAudioNode) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var AudioComponent = {};
        AudioComponent.audioSupported = false;

        if (AudioContext) {
            audioCtx = new AudioContext();

            if (audioCtx) {

                AudioComponent.audioSupported = true;
                var audioCtx, toneBuffer, mainVol, compressor;

                var sampleRate = audioCtx.sampleRate;
                mainVol = audioCtx.createGain();
                // Connect MainVol to final destination (will throw error if outputAudioNode incorrect type )
                if (outputAudioNode !== undefined) mainVol.connect(outputAudioNode);
                else mainVol.connect(audioCtx.destination);
                mainVol.gain.value = 0.5;
                compressor = audioCtx.createDynamicsCompressor();

                compressor.connect(mainVol);
                // create the sound buffer for playing notes
                var toneDataBuffer = this.generateToneBuffer(sampleRate);
                toneBuffer = audioCtx.createBuffer(1, toneDataBuffer.length, sampleRate);
                toneBuffer.getChannelData(0).set(toneDataBuffer);
                //fill in return object
                AudioComponent.audioCtx = audioCtx;
                AudioComponent.toneBuffer = toneBuffer;
                AudioComponent.mainVol = mainVol;
                AudioComponent.compressor = compressor;

                AudioComponent.playNote = function(F, BaseIndex, t) {
                    var noteSource = audioCtx.createBufferSource();
                    noteSource.buffer = toneBuffer;

                    noteSource.connect(compressor);

                    noteSource.playbackRate.value = F * Math.pow(2, BaseIndex / 12);

                    noteSource.start(t);
                }
            }
        }
        return AudioComponent;
    },

});
/**
 *jQuery plugin that adds a interactive harp construction component.
 *
 *
 *              <div id="dominant">
 Dominant Note:
 </div>

 <table id="intervalTable">
 <tr>
 <th rowspan="2">Note Number</th><th rowspan="2">Pitch</th><th rowspan="2">Interval name</th>

 </tr>
 <tr id="chordsScales">

 </tr>
 </table>
 <div class="legend">
 Table 1.
 </div>
 */

(function($) {

    var defaultOptions = {
        legend: 'Intervals Table'
    };

    var ns = 'intervalTable';

    var _mh = require("musicHelper");
    var _a = require("audioHelper");
    var currKeyIndex = 0;

    var methods = {
        init: function(options) {

            var _opt = $.extend({}, defaultOptions, options);

            var audio = _a.initAudio();

            return this.each(function() {
                var $this = $(this),
                    data = $this.data(ns);
                // If the plugin hasn't been initialized yet

                if (!data) {
                    // Setup
                    var intervalTable = $('<div/>').addClass('intervalTable');
                    var dominant = $('<div/>').addClass('dominant').html('Dominant Note:');
                    var theTable = $('<table/>');
                    var heading = $('<tr><th rowspan="2">Note Number</th><th rowspan="2">Pitch</th><th rowspan="2">Interval name</th></tr>');
                    var chordsScales = $('<tr/>').addClass('chordsScales');

                    //add to dom
                    theTable.append(heading);
                    theTable.append(chordsScales);

                    intervalTable.append(dominant);
                    intervalTable.append(theTable);
                    intervalTable.append($('<div/>').addClass('legend').html(_opt.legend));

                    $this.append(intervalTable)
                    //setup logic

                    var dominantSelect = $('<select/>');
                    for (var i = 0, sciNote; sciNote = _mh.SciNotes[i]; i++) {
                        dominantSelect.append('<option>' + sciNote + '</option>');
                    }

                    dominant.append(dominantSelect);

                    dominantSelect.change(function() {
                        currKeyIndex = _mh.SciNotes.indexOf($(this).val());
                        var rows = theTable.find('tr');
                        rows.removeClass('darkRow');
                        $.each(rows, function(ind, row) {
                            if (ind > 1) {
                                var note = _mh.SciNotes[(14 - ind + currKeyIndex) % 12];
                                $(row).find('.pitch').html(note);
                                if (note.length > 1) {
                                    $(row).addClass('darkRow');
                                }
                            }

                        });

                    })
                    //setup the chords and scales
                    //headings
                    var numScales = 0,
                        numChords = 0;
                    $.each(_mh.Chords, function(ind, obj) {
                        numChords++;
                        var html
                        if (audio.audioSupported) {
                            html = '<button class="chord">' + ind + '</button>';
                        }
                        else {
                            html = ind;
                        }
                        chordsScales.append('<th>' + html + '</th>');
                    });
                    heading.append('<th colspan="' + numChords + '">Chords</th>');
                    $.each(_mh.Scales, function(ind, obj) {
                        numScales++;
                        var html
                        if (audio.audioSupported) {
                            html = '<button class="scale">' + ind + '</button>';
                        }
                        else {
                            html = ind;
                        };
                        chordsScales.append('<th>' + html + '</th>');
                    })
                    heading.append('<th colspan="' + numScales + '">Scales</th>');
                    //table values
                    for (var row, i = 12; i >= 0; i--) {
                        row = $('<tr/>');
                        var N = $('<td/>');
                        N.html('N<sub>' + i + '</sub>');
                        row.append(N);
                        N = $('<td class="pitch"/>');
                        var note = _mh.SciNotes[(i + currKeyIndex) % 12];
                        N.html(note);
                        if (note.length > 1) {
                            row.addClass('darkRow');
                        }
                        row.append(N);
                        N = $('<td/>');
                        var html = _mh.Intervals[i];
                        if (audio.audioSupported) {
                            html = '<button class="interval">' + html + '</button>';
                        }
                        N.html(html);
                        row.append(N);
                        $.each(_mh.Chords, function(ind, obj) {
                            N = $('<td/>');
                            N.html(obj[i] ? 'X' : '');
                            row.append(N);

                        });
                        $.each(_mh.Scales, function(ind, obj) {
                            N = $('<td/>');
                            N.html(obj[i] ? 'X' : '');
                            row.append(N);
                        })

                        theTable.append(row);
                    }
                    //add audio support to Table 1.

                    if (audio.audioSupported) {
                        $this.find('.chord').click(function(e) {
                            var chord = _mh.Chords[$(this).html()];
                            for (var noteNum = 0; noteNum <= 12; noteNum++) {
                                var noteOn = chord[noteNum];
                                if (noteOn) {
                                    var F = 2 * Math.pow(2, noteNum / 12);
                                    audio.playNote(F, currKeyIndex, 0);
                                }

                            }
                        });
                        $this.find('.interval').click(function(e) {
                            var interval = _mh.Intervals.indexOf($(this).html());
                            var F = 2 * Math.pow(2, interval / 12);
                            audio.playNote(2, currKeyIndex, 0);
                            audio.playNote(F, currKeyIndex, 0);
                        });
                        $this.find('.scale').click(function(e) {
                            var scale = _mh.Scales[$(this).html()];
                            var time = audio.audioCtx.currentTime;
                            var nn = 0;
                            for (var noteNum = 0; noteNum <= 12; noteNum++) {
                                var noteOn = scale[noteNum];
                                if (noteOn) {
                                    var F = 2 * Math.pow(2, noteNum / 12);
                                    audio.playNote(F, currKeyIndex, time + nn / 4);
                                    nn++;
                                }

                            }
                        });
                    }

                    $(this).data(ns, {
                        target: $this
                    });
                }

            });

        },

        destroy: function() {

            return this.each(function() {

                var $this = $(this),
                    data = $this.data(ns);

                $(window).unbind('.' + ns);
                //data.xxx.remove();
                $this.removeData(ns);

            })
        },
    };

    $.fn.intervalTable = function(method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + ' does not exist on jQuery.' + ns);
        }

    };

})(jQuery);

define("intervalTable", ["musicHelper","audioHelper"], function(){});

require(["intervalTable"]);
}());