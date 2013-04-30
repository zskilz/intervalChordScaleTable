define({
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