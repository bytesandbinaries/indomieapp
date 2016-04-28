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
    'foundation',
    'foundation.common',
    'appServices',
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
});

