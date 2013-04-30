require.config({
    baseUrl: '',
  
    paths: {
        "jquery": [  '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min' ]
    },

    shim: {
        'intervalTable': {
            deps: ['jquery', 'musicHelper', 'audioHelper']
        }
    }
});

// Start the main app logic.
require(['jquery', 'intervalTable'],

function($) {
    //jQuery loaded and can be used here now.
    $(function() {
        $('#testDiv').intervalTable();
    });
});