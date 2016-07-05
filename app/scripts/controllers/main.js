'use strict';

/**
 * @ngdoc function
 * @name indomieApp.controller:mainCtrl
 * @description
 * # mainCtrl
 * Controller of the indomieApp
 */
var main=angular.module('indomieApp');
main.controller('appCtrl',['$scope', function($scope){
    $scope.foo="bar";
}]);
main.controller('mainCtrl', ['$scope', function ($scope) {
    $scope.foo="bar";
}]);
main.controller('createCtrl', ['$scope', '$http', 'userData', function ($scope, $http, userData) {
    $scope.user=userData.data();
    $scope.appflow="create-message";
    $scope.photostatus='default';
    $scope.changeview=function(toview){
        $scope.appflow=toview;
    //    console.log(toview);
    };
    $scope.getUserdata=function(){
        console.log($scope.user);
        $scope.changeview('select-avatar');
    }
    $scope.startWebCamera=function(){
        $scope.photostatus='webcam';
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');

        navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        navigator.getMedia({video: true, audio: false },
          function(stream) {
            if (navigator.mozGetUserMedia) {
              video.mozSrcObject = stream;
            } else {
              var vendorURL = window.URL || window.webkitURL;
              video.src = vendorURL.createObjectURL(stream);
            }
            video.play();
          },
          function(err) {
            console.log("An error occured! " + err);
          }
        );
        video.addEventListener('canplay', function(ev){
          if (!streaming) {
            height = video.videoHeight / (video.videoWidth/width);

            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.

            if (isNaN(height)) {
              height = width / (4/3);
            }

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
          }
        }, false);

        startbutton.addEventListener('click', function(ev){
          takepicture();
          ev.preventDefault();
        }, false);

        clearphoto();
    }
    function clearphoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takepicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
          canvas.width = width;
          canvas.height = height;
          context.drawImage(video, 0, 0, width, height);
          var data = canvas.toDataURL('image/png');
          photo.setAttribute('src', data);
        } else {
          clearphoto();
        }
    }

    $scope.callImagePreview=function(){
        angular.element('#imageUploader').trigger('click');
    }
    $scope.uploadImage=function(){
        
    }

    //$scope.modal= new ModalFactory();
}]);
main.controller('voteCtrl', ['$scope',  function ($scope) {
    $scope.foo="bar";
}]);
