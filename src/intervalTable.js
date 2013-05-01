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
        legend : 'Intervals Table'
    };

    var ns = 'intervalTable';
    
    var _mh = require("musicHelper");
    var _a = require("audioHelper");
    var currKeyIndex = 0;

    var methods = {
        init : function(options) {

            var _opt = $.extend({}, defaultOptions, options);
            
            var audio = _a.initAudio();

            return this.each(function() {
                var $this = $(this), data = $this.data(ns);
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
                    var numScales = 0, numChords = 0;
                    $.each(_mh.Chords, function(ind, obj) {
                        numChords++;
                        var html
                        if (audio.audioSupported) {
                            html = '<button class="chord">' + ind + '</button>';
                        } else {
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
                        } else {
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
                        N.html(_mh.Intervals[i]);
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
                        target : $this
                    });
                }

            });

        },

        destroy : function() {

            return this.each(function() {

                var $this = $(this), data = $this.data(ns);

                $(window).unbind('.' + ns);
                //data.xxx.remove();
                $this.removeData(ns);

            })
        },
    };

    $.fn.intervalTable = function(method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if ( typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.' + ns);
        }

    };

})(jQuery);
