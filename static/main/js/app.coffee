window.tabID = Math.floor(Math.random() * 0x10000).toString(16)

window.app = angular.module('app', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ui.bootstrap.smartdropdown', 'angular-loading-bar', 'btford.socket-io', 'ui.sortable', 'acute.select', 'pasvaz.bindonce'])


app.config ($interpolateProvider, $rootScopeProvider) ->
  $interpolateProvider.startSymbol '[['
  $interpolateProvider.endSymbol ']]'
  $rootScopeProvider.digestTtl(100);



app.directive 'activeLink', ($location) =>
    return {
        restrict: 'A'
        link: (scope, element, attrs, controller) =>
            clazz = attrs.activeLink
            path = attrs.href
            scope.location = $location
            scope.$watch 'location.path()', (newPath) =>
                if newPath.indexOf(path) == 0
                    element.addClass(clazz)
                else
                    element.removeClass(clazz)
    }


app.directive 'filterbox', () ->
    return {
        restrict: 'E'
        scope: {
            text: '@'
            ngModel: '='
        }
        template: """
        <p class="input-group icon-inline">
            <span class="input-group-addon">
                <i class="fa fa-filter"></i>
            </span>
            <input type="search" class="form-control" placeholder="[[text || 'Filter']]" ng:model="ngModel" />
        </p>
        """
        link: ($scope, element, attr) ->
    }

