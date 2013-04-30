# intervalChordScaleTable

A HTML5 jQuery plugin that adds a Table of common intervals, chords and scales. For music education. Supports Web-Audio-API.

Work in progress...

## Using

Download source and copy build/intervalChordScaleTable.js (or the minified version) and src/intervalTable.css to your workspace. Include them after your jQuery include...

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

##Lisence

Copyright &copy; Petrus J Pretorius 2013

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
