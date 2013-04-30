# intervalChordScaleTable


# intervalChordScaleTable

A HTML5 jQuery plugin that adds a Table of common intervals, chords and scales. For music education. Supports Web-Audio-API.


## Using

Download build/intervalChordScaleTable.js (or the minified version) and src/intervalTable.css. Include them in your page.

    <link type="text/css" href="intervalTable.css" rel="Stylesheet">
    <script src="intervalChordScaleTable.js"></script>

## Calling the plugin:

    $('#testDiv').intervalTable({});
    
## Dev

src/dev.html is the entry point for development/testing. 
            
## Building.

Almond build scripts are provided in the root. Nodejs required. 
    
    node r.js -o build.js
    node r.js -o build.min.js
