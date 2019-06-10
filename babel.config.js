const presets = [
    [
        "@babel/env",
        {
            targets: {
                chrome: 'latest',
            },
            useBuiltIns: 'usage',
        }
    ]
];

module.exports = { presets };
