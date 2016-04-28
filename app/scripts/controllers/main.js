'use strict';

/**
 * @ngdoc function
 * @name indomieApp.controller:mainCtrl
 * @description
 * # mainCtrl
 * Controller of the indomieApp
 */
var main=angular.module.indomieApp;
main.controller('appCtrl',['$scope', function($scope){
    $scope.foo="bar";
}]);
main.controller('mainCtrl', ['$scope', function ($scope) {
    $scope.foo="bar";
}]);
main.controller('createCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.appflow="create-message";
    $scope.changeview=function(toview){
        $scope.appflow=toview;
        console.log(toview);
    };
    $scope.modal= new ModalFactory();
}]);
main.controller('voteCtrl', ['$scope',  function ($scope) {
    $scope.foo="bar";
}]);
