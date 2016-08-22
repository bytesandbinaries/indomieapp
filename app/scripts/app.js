'use strict';

/**
 * @ngdoc overview
 * @name indomieApp
 * @description
 * # indomieApp
 *
 * Main module of the application.
 */
angular
  .module('indomieApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'appServices',
    'angucomplete',
    'foundation'
])
.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'views/home.html',
        controller:'mainCtrl',
        controllerAs:'main'
    })
    .when('/create',{
        templateUrl:'views/create.html',
        controller:'createCtrl',
        controllerAs:'create'
    })
    .when('/vote',{
        templateUrl:'views/vote.html',
        controller: 'voteCtrl',
        controllerAs:'vote'
    })
    .otherwise({
        redirectTo:'/'
    });
})
.run(function(){
    FastClick.attach(document.body);
})
.run(['$rootScope', '$window', 'AuthService', function($rootScope, $window, AuthService) {
    $rootScope.user = {};
    $window.fbAsyncInit = function() {
    // Executed when the SDK is loaded
        FB.init({
            appId: '1029741847095272',
            channelUrl: 'template/channel.html',
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.4'
        });
    AuthService.watchLoginChange();
};
(function(){
    var e = document.createElement('script'); e.async = true;
    e.src = document.location.protocol +
    '//connect.facebook.net/en_US/all.js';
    document.getElementById('fb-root').appendChild(e);
}());

}]);
