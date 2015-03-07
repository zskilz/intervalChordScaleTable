/*define({
    SciNotes: ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
  //  Intervals: ["Unison", "minor 2nd", "Major 2nd", "minor 3rd", "Major 3rd", "4th", 
  //  "Tritone", "5th", "minor 6th", "Major 6th", "minor 7th", "Major 7th", "Octave", 
  //  "minor 9th", "Major 9th","minor 10th", "Major 10th", "11th", "Who Knows?", "12th","minor 13th","Major 13th", "minor 14th", "Major 14th", "2Octave"],
   
    Intervals: ["Unison", "minor 2nd", "Major 2nd", "minor 3rd", "Major 3rd", "4th", "Tritone", "5th", "minor 6th", "Major 6th", "minor 7th", "Major 7th", "Octave","Flat 9th","Major 9th","Flat 10th","Major 10th","11th","Flat 12th","12th","Flat 13th","13th","Flat 14th","14th","Octave2"],
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


});*/

define({
    SciNotes: ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
    Intervals: ["Unison", "minor 2nd", "Major 2nd", "minor 3rd", "Major 3rd", "4th", "Tritone", "5th", "minor 6th", "Major 6th", "minor 7th", "Major 7th", "Octave","Flat 9th","Major 9th","Flat 10th","Major 10th","11th","Flat 12th","12th","Flat 13th","13th","Flat 14th","14th","Octave2"],
    Chords: {

        Dim: [1, 0, 0, 1, 0, 0, 1],
        Min: [1, 0, 0, 1, 0, 0, 0, 1],
        Maj: [1, 0, 0, 0, 1, 0, 0, 1],
        Aug: [1, 0, 0, 0, 1, 0, 0, 0, 1],
		MajSixth: [1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
		MajSixthAddNinth: [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		Dim7: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		Min7: [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        Dom7: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		Maj7: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		AddNinth: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
		Dom9: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	    Major9: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
		Dom7Flat9: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
		Dom13:[1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
		Maj13:[1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],

    },
    Scales: {
        Major: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1],
		Dorian: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
		Phrygian: [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
		Lydian: [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
        NaturalMinor: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
        HarmonicMinor: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1],
        Mixolydian: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
		Locrian: [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    }


});