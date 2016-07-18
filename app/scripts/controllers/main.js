//'use strict';

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
main.controller('createCtrl', ['$scope', '$http', 'userData', 'appService', function ($scope, $http, userData, appService) {
    $scope.user=userData.data();
    $scope.appflow="create-message";
    $scope.photostatus='default';
    $scope.currentAngle=0;
    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream

    var streaming = false;
    var video = null;
    var videoContainer = null;
    var canvas = null;
    var photo = null;
    var photoContainer = null;
    var startbutton = null;

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
        videoContainer=document.getElementById('camera');
        canvas = document.getElementById('user_image');
        photo = document.getElementById('photo');
        photoContainer=document.getElementById('output');
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
            videoContainer.style.display='none';
            photoContainer.style.display='block';
          canvas.width = width;
          canvas.height = height;
          context.drawImage(video, 0, 0, width, height);
          var data = canvas.toDataURL('image/png');
          photo.setAttribute('src', data);
        } else {
          clearphoto();
        }
    }
    $scope.takeAnotherPhoto=function(){
        videoContainer.style.display='block';
        photoContainer.style.display='none';
        clearphoto();
        startWebCamera();
    }
    $scope.usePhoto=function(){
        var cc = document.getElementById('user_image').getContext('2d');
        var overlay = document.getElementById('overlay');
        var overlayCC = overlay.getContext('2d');

        $scope.photostatus='default';
        startCrop(overlay);
        overlayCC.clearRect(0, 0, 720, 576);
		document.getElementById('convergence').innerHTML = "";
		ctrack.reset();

        animateClean();
    }
    $scope.callImagePreview=function(){
        angular.element('#imageUploader').trigger('click');
    }
    $scope.uploadImage=function(){

    }
    $scope.turnImage=function(direction){
        $scope.imageHolder=document.getElementById('user_image');
        if(direction=='l'){
            $scope.currentAngle = ($scope.currentAngle+90) % 360;
        }
        else{
            $scope.currentAngle = ($scope.currentAngle-90) % 360;
        }
        $scope.imageHolder.className = "rotate"+$scope.currentAngle;
    }
   //  $scope.uploadFile = function(){
     // NProgress.start();
        // var file = $scope.myFile;
        // console.log('file is ' );
        // console.dir(file);
        // console.log($scope.x1, $scope.y1)
        // var uploadUrl = "http://localhost:8888/indomieApp/app/api/upload";
        // var name = $scope.myName;
        // var reason = $scope.myReason;
        // var x1 = $scope.x1;
        // var y1 = $scope.y1;
        // var x2 = $scope.x2;
        // var y2 = $scope.y2;
        // var width = $scope.imgWidth;
        // var height = $scope.imgHeight;
        // fileUpload.uploadFileToUrl(file, uploadUrl, name, reason, x1, y1, x2, y2, width, height);
   //
   //};

   $scope.uploadFile=function(){
       console.log($scope.user);
       appService.uploadImages($scope.user).then(function(response){
           if(response!=='no Images'){
               $scope.user.uploadedImageUrl=response.uploaded_pic;
               $scope.user.status='image Uploaded';
               console.log(response);
           }
           appService.addRequest_data('cartoonImage', $scope.user).then(function(response){
             console.log('okay');
           },
           function(error){
               console.log('error this '+error)
           });
       },
       function(error){
           console.log('Error Uploading Images '+error)
       });
   }

    //$scope.modal= new ModalFactory();
}]);
main.controller('voteCtrl', ['$scope',  function ($scope) {
    $scope.foo="bar";
}]);
