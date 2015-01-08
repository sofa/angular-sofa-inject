/**
 * angular-sofa-inject - v0.1.1 - Thu Jan 08 2015 16:11:09 GMT+0100 (CET)
 * http://www.sofa.io
 *
 * Copyright (c) 2014 CouchCommerce GmbH (http://www.couchcommerce.com / http://www.sofa.io) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA.IO COUCHCOMMERCE SDK (WWW.SOFA.IO)
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (angular) {
angular.module('sofa.inject', [])

.directive('sofaInject', ["$templateCache", "$http", "$compile", "injectsService", "deviceService", function ($templateCache, $http, $compile, injectsService, deviceService) {

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
}]);
}(angular));
