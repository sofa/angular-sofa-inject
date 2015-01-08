'use strict';

describe('sofa.inject', function () {

    var $compile, $rootScope;

    beforeEach(module('sofa.inject'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should run tests', function () {
        expect(true).toBe(true);
    });
});
