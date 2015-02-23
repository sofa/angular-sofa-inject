/**
 * angular-sofa-inject - v0.1.0 - Mon Feb 23 2015 12:03:22 GMT+0100 (CET)
 * http://www.sofa.io
 *
 * Copyright (c) 2014 CouchCommerce GmbH (http://www.couchcommerce.com / http://www.sofa.io) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA.IO COUCHCOMMERCE SDK (WWW.SOFA.IO)
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (angular) {
angular.module('sofa.inject')

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

angular.module('sofa.inject')

.factory('injectsService', ["$location", "configService", function ($location, configService) {

    'use strict';

    var self = {};

    var RESOURCE_URL = configService.get('resourceUrl') + 'html/';

    //we build a map of the injects for faster lookups.
    var injects = configService
                    .get('injects', [])
                    .reduce(function(previous, current){
                        var key = current.url + '_' + current.target;
                        previous[key] = {
                            template: current.template + '.html',
                            target: current.target
                        };
                        return previous;
                    }, {});

    var getKey = function(injectionPoint, url){
        return assureUrl(url) + '_' + injectionPoint;
    };

    var assureUrl = function(url){
        return url || $location.path();
    };

    self.hasInject = function(injectionPoint, url){
        return !cc.Util.isUndefined(injects[getKey(injectionPoint, url)]);
    };

    self.getTemplate = function(injectionPoint){

        if (self.hasInject(injectionPoint)){
            return RESOURCE_URL + injects[getKey(injectionPoint)].template;
        }

        if (self.hasInject(injectionPoint, '*')){
            return RESOURCE_URL + injects[getKey(injectionPoint, '*')].template;
        }

        return null;
    };

    return self;
}]);
}(angular));
