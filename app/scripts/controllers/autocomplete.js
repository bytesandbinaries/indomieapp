angular.module('angucomplete',['indomieApp'] )
    .directive('angucomplete', function ($parse, $http, $sce, $timeout, userData) {
    return {
        restrict: 'EA',
        scope: {
            "id": "@id",
            "placeholder": "@placeholder",
            "selectedObject": "=selectedobject",
            "url": "@url",
            "dataField": "@datafield",
            "titleField": "@titlefield",
            "descriptionField": "@descriptionfield",
            "imageField": "@imagefield",
            "imageUri": "@imageuri",
            "inputClass": "@inputclass",
            "userPause": "@pause",
            "localData": "=localdata",
            "searchFields": "@searchfields",
            "minLengthUser": "@minlength",
            "matchClass": "@matchclass"
        },
        templateUrl: 'template/searchlist.html',
        link: function($scope, elem, attrs) {
            $scope.lastSearchTerm = null;
            $scope.currentIndex = null;
            $scope.justChanged = false;
            $scope.searchTimer = null;
            $scope.hideTimer = null;
            $scope.searching = false;
            $scope.pause = 500;
            $scope.minLength = 3;
            $scope.searchStr = null;
            $scope.user=userData.data();
            $scope.allfriends=$scope.user.allfriends;
            console.log($scope.allfriends);

            if ($scope.minLengthUser && $scope.minLengthUser != "") {
                $scope.minLength = $scope.minLengthUser;
            }
            if ($scope.userPause) {
                $scope.pause = $scope.userPause;
            }
            isNewSearchNeeded = function(newTerm, oldTerm) {
                return newTerm.length >= $scope.minLength && newTerm != oldTerm
            }
            // $scope.$on('allfriendsloaded', function(event, data) {
            //     $scope.localData=$scope.user.allfriends;
            //     console.log('we received friends');
            //     console.log( $scope.allfriends)
            // })
            $scope.processResults = function(responseData, str) {
                if (responseData && responseData.length > 0) {
                    $scope.results = [];
                    var titleFields = [];
                    if ($scope.titleField && $scope.titleField != "") {
                        titleFields = $scope.titleField.split(",");
                    }
                    for (var i = 0; i < responseData.length; i++) {
                        // Get title variables
                        var titleCode = [];
                        for (var t = 0; t < titleFields.length; t++) {
                            titleCode.push(responseData[i][titleFields[t]]);
                        }
                        var description = "";
                        if ($scope.descriptionField) {
                            description = responseData[i][$scope.descriptionField];
                        }
                        var imageUri = "";
                        if ($scope.imageUri) {
                            imageUri = $scope.imageUri;
                        }
                        var image = "";
                        if ($scope.imageField) {
                            image = responseData[i].picture.data.url;
                        }
                        var text = titleCode.join(' ');
                        if ($scope.matchClass) {
                            var re = new RegExp(str, 'i');
                            var strPart = text.match(re)[0];
                            text = $sce.trustAsHtml(text.replace(re, '<span class="'+ $scope.matchClass +'">'+ strPart +'</span>'));
                        }
                        var resultRow = {
                            title: text,
                            description: description,
                            image: image,
                            originalObject: responseData[i]
                        }
                        $scope.results[$scope.results.length] = resultRow;
                    }
                } else {
                    $scope.results = [];
                }
            }
            $scope.searchTimerComplete = function(str) {
                $scope.localData=$scope.user.allfriends;
                if (str.length >= $scope.minLength) {
                    if ($scope.localData) {
                        var searchFields = $scope.searchFields.split(",");
                        var matches = [];
                        for (var i = 0; i < $scope.localData.length; i++) {
                            var match = false;
                            for (var s = 0; s < searchFields.length; s++) {
                                match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                            }
                            if (match) {
                                matches[matches.length] = $scope.localData[i];
                            }
                        }
                        $scope.searching = false;
                        $scope.processResults(matches, str);
                    }
                }
            }
            $scope.hideResults = function() {
                $scope.hideTimer = $timeout(function() {
                    $scope.showDropdown = false;
                }, $scope.pause);
            };
            $scope.resetHideResults = function() {
                if($scope.hideTimer) {
                    $timeout.cancel($scope.hideTimer);
                };
            };
            $scope.hoverRow = function(index) {
                $scope.currentIndex = index;
            }
            $scope.keyPressed = function(event) {
                if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                    if (!$scope.searchStr || $scope.searchStr == "") {
                        $scope.showDropdown = false;
                        $scope.lastSearchTerm = null
                    } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                        $scope.lastSearchTerm = $scope.searchStr
                        $scope.showDropdown = true;
                        $scope.currentIndex = -1;
                        $scope.results = [];
                        if ($scope.searchTimer) {
                            $timeout.cancel($scope.searchTimer);
                        }
                        $scope.searching = true;
                        $scope.searchTimer = $timeout(function() {
                            $scope.searchTimerComplete($scope.searchStr);
                        }, $scope.pause);
                    }
                } else {
                    event.preventDefault();
                }
            }
			//retrieves the various categories using the service_no
            $scope.get_servicetypes=function(){
              $scope.urlp='http://172.20.10.4/projects/askmeapp/www/server/fetchSRQ.php?service_no='+$scope.Sdata[0].service_id;
              $http.jsonp($scope.urlp+'&callback=JSON_CALLBACK').
                  success(function(responseData, status, headers, config) {
					 //the categories retreived then populate the reviews and inits their different posts
                    $scope.rData.Categories=responseData;
                  })
            }
            $scope.selectResult = function(result) {

				console.log(result);
                $scope.user.taggedFriends.push(result);
                ($scope.user.friendId==='') ? $scope.user.friendId=result.originalObject.id :$scope.user.friendId=$scope.user.friendId+', '+result.originalObject.id;
                console.log($scope.user.friendId);
                if ($scope.matchClass) {
                    result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                }
                $scope.searchStr = $scope.lastSearchTerm = result.title;
                $scope.selectedObject = result;
                $scope.showDropdown = false;
                $scope.results = [];
                //$scope.$apply();
            }

            var inputField = elem.find('input');

            inputField.on('keyup', $scope.keyPressed);

            elem.on("keyup", function (event) {
                if(event.which === 40) {
                    if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                        $scope.currentIndex ++;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                    $scope.$apply();
                } else if(event.which == 38) {
                    if ($scope.currentIndex >= 1) {
                        $scope.currentIndex --;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 13) {
                    if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                        $scope.selectResult($scope.results[$scope.currentIndex]);
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    } else {
                        $scope.results = [];
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 27) {
                    $scope.results = [];
                    $scope.showDropdown = false;
                    $scope.$apply();
                } else if (event.which == 8) {
                    $scope.selectedObject = null;
                    $scope.$apply();
                }
            });

        }
    };
});
