angular.module('sofa.inject')

.directive('sofaInject', function ($templateCache, $http, $compile, injectsService, deviceService) {

    'use strict';

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            target: '@'
        },
        link: function(scope, element) {
            scope.injectsService = injectsService;
            scope.deviceService = deviceService;

            //if it's an inject on the product page, automatically expose
            //the product to the inject
            if (scope.$parent.product) {
                scope.product = scope.$parent.product;
            }

            var templateUrl = injectsService.getTemplate(scope.target);

            if (templateUrl === null) {
                element.remove();
            } else {
                $http
                    .get(templateUrl, {cache: $templateCache})
                    .success(function (tplContent) {
                        element.replaceWith($compile(tplContent)(scope));
                    });
            }
        }
    };
});
