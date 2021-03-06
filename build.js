({
    optimize: "none",
    baseUrl: 'src',
    name: 'almond',
    shim: {
        'intervalTable': {
            deps: [ 'musicHelper', 'audioHelper']
        }
    },
    include: ['intervalTable'],

    insertRequire: ['intervalTable'],
    out: 'build/intervalChordScaleTable.js',
    wrap: true
})