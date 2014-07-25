routerFiles = {
    src: [
        'src/common.js',
        'src/dutchPublicHolidaysProvider.js'
    ],
    testUtils: [
        'test/testUtils.js'
    ],
    test: [
        'test/*Spec.js',
        'test/compat/matchers.js'
    ],
    angular: function (version) {
        return [
                'lib/angular-' + version + '/angular.js',
                'lib/angular-' + version + '/angular-mocks.js'
        ].concat(version === '1.2.14' ? ['lib/angular-' + version + '/angular-animate.js'] : []);
    }
};

if (exports) {
    exports.files = routerFiles;
}
