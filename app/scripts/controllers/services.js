
var appServices=angular.module('appServices', ['ngResource']);
appServices.service('userData', ['$rootScope','$location', function($rootScope,$location){
 var savedData =  {name:'',  id:0, email:'', avartar:'', status:'', caricatureUrl:'', previewUrl:'', uploadedImageUrl:'', upforvote:'', reason:'', taggedFriends:[]}
 return{
    data:function() {   return savedData; }
 }
}])
// appServices.service('fileUpload', ['$http', '$rootScope', function ($http, $rootScope, $location) {
//
//    this.uploadFileToUrl = function(file, uploadUrl, name, reason, x1, y1, x2, y2, width, height){
//         var fd = new FormData();
//         fd.append('file', file);
//         fd.append('name', name);
//         fd.append('reason', reason);
//         fd.append('x1', x1);
//         fd.append('y1', y1);
//         fd.append('x2', x2);
//         fd.append('y2', y2);
//         fd.append('width', width);
//         fd.append('height', height);
//         $http.post(uploadUrl, fd, {
//             transformRequest: angular.identity,
//             headers: {'Content-Type': undefined,'Process-Data': false}
//         })
//         .success(function(data){
//         //  NProgress.done();
//           $rootScope.$emit("CallSharePicBoxGlobal", {message: data});
//           //window.location = "#/share/" + data;
//           //$location.path("/share/" + data);
//           console.log("Success" + data);
//         })
//         .error(function(){
//         //   NProgress.done();
//           console.log("Failure");
//         });
//     }
// }]);
//
//// appServices.filter('posttime', function(){
////   return function (input) {
////     var n =moment.unix(input).fromNow();
////     return n;
////   }
//// });
//appServices.service('cartmanagement', ['userData', function( userData){
//    var user=userData.data();
//
//    var itemtocart=function(item, operation, index){
//        if(operation=='remove'){
//            for(var i=0; i<user.cart.length; i++){
//                if(user.cart[i].item_no==item.item_no){
//                    var price = item.quantity*item.item_rate;
//                    item.reward=parseInt(item.quantity)*item.item_points;
//                    price=price-item.reward;
//                    user.cartTotal= user.cartTotal-price
//                    user.totalReward=user.totalReward-item.reward;
//                    item.quantity=0;
//                    user.cart.splice(i, 1);
//                }
//            }
//
//
//        }
//        else{
//            item.quantity=item.item_quantity;
//            var price=parseInt(item.quantity)*item.item_rate;
//            item.reward=parseInt(item.quantity)* parseInt(item.item_points);
//            price=price-item.reward;
//            user.cartTotal= user.cartTotal+price
//            if(typeof user.totalReward=='undefined') {user.totalReward=item.reward;}
//            else{ user.totalReward=user.totalReward+item.reward;}
//            user.cart.push(item);
//        }
//	}
//
//    return{
//        itemtocart :function(item, operation, index) {
//            return itemtocart(item, operation, index)
//        },
//        uploadImages :function(file) {
//            return uploadImages(file)
//        },
//        register:function(regprams){
//            register(regprams)
//        }
//    }
//}])
//
appServices.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
appServices.service('appService', ['$q','$http','$location','$rootScope', function( $q, $http, $location, $rootScope) {

   var urlprefix = 'http://localhost:8888/indomieApp/app/';//offline
   //var urlprefix= '';//online

   var parsetoformdata= function(data){
       var form_data = new FormData();
       if(typeof(data)==='object'){
           for ( var key in data ) {
               form_data.append(key, data[key]);
           }
       }
       else if(data!=''){
           form_data.append('data', data);
       }
       else{form_data.append('data', '');}
       return form_data;
   }
   var uploadImages = function(file){
       return $q(function(resolve, reject) {
           if(file!=null){
              form_data=parsetoformdata(file);

                $http.post(urlprefix+'server/upload_images.php', form_data, {//offline

                   transformRequest: angular.identity,
                   headers: {'Content-Type': undefined}                })
               .success(function(response){ resolve(response); })
               .error(function(err){ reject('Images Couldn\'t be added.'+err); });
           }
           else{
               console.log('No Images');
               resolve('no Images');
           }
       });
   }
   var uploadCanvasImage=function(file){
       return $q(function(resolve, reject) {
           if(file!=null){
              form_data=parsetoformdata(file);
              $http.post(urlprefix+'server/upload_images.php', form_data, {
                   transformRequest: angular.identity,
                   headers: {'Content-Type': undefined}                })
               .success(function(response){ resolve(response); })
               .error(function(err){ reject('Images Couldn\'t be added.'+err); });
           }
           else{
               console.log('No Images');
               resolve('no Images');
           }
       });
   }
   var addRequest_data=function(action, data){
		return $q(function(resolve, reject) {
           if(data==''){data={}};
           var url=urlprefix+'server/get_allq.php';

           if(action!='' && data!=''){
               if(typeof(data)!=='object'){
                   temp={action:action, data:data};
                   data=temp;
               }
               else{data.action=action; }
           }
           form_data=parsetoformdata(data);
           $http({
               method: 'POST',
               url: url,
               data: form_data,
               transformRequest: angular.identity,
               headers: {'Content-Type': undefined}
               //headers : {"application/x-www-form-urlencoded; charset=utf-8"}
           }).
           success(function(response) {
             //console.log(response)
             resolve(response);
           },
           function(err) {reject('Data Couldn\'t be added.');}
           );
       });
	}
   return{
       addRequest_data :function(action, data) {
           return addRequest_data(action, data)
       },
       uploadImages :function(file) {
           return uploadImages(file)
       },
	    register:function(regprams){
		    register(regprams)
	    }
   }
}])

appServices.service('AuthService', ['userData','$q','$http','$location','$rootScope', function(userData, $q, $http, $location, $rootScope) {
  var LOCAL_TOKEN_KEY = 'myAskToken';
  user=userData.data();
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken={'token':'', 'id':''};
    var loadUserCredentials= function() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token) useCredentials(token);

    }

    var useCredentials=function(token, stat) {
       username = token.token.split('.')[0];
       var user_ro= token.token.split('.')[1];
       var user_id= token.id;
       isAuthenticated = true;
       authToken = token;
     if(stat=='newp'){
		  user.name=token.token.split('.')[0];
		  user.id=token.id;
		  user.status='NewPlayer';
	  }
	  else{
		  user.name=token.token.split('.')[0];
		  user.id=token.userId;
		  user.status='ReturnPlayer';
		  user.totalscore=token.totalscore;
		  user.email=token.email;
		  user.currentlevel=token.level;
		 // user.lastLscore=token.lastlevelscore;
		  user.line1=token.line1;
		  user.line2=token.line2;
		  user.line3=token.line3;
	  }

       $http.defaults.headers.common['X-Auth-Token'] = token;
   }

    var destroyUserCredentials = function() {
       authToken = undefined;
       username = '';
       isAuthenticated = false;
       $http.defaults.headers.common['X-Auth-Token'] = undefined;
       window.localStorage.removeItem(LOCAL_TOKEN_KEY);
   }
   var userCred=function(token, stat){
	   window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      useCredentials(token, stat);
	  }
	var register= function(regprams){
		$http({url:'server/register_user.php?', method:'GET', params:regprams}).
              success(function(responseData, status, headers, config) {
                  data=responseData;
    			  loading=false;
                  userCred(data, 'newp')
              },
              function(err) {

              }
          );
	}
	var friendsList=function(flist){
		$http({url:'server/get_friends.php?', method:'GET', params:flist}).
              success(function(responseData, status, headers, config) {
                  user.friends=responseData; console.log(user.friends)},
              function(err) {}
          );
	}
	var login=function(name, pw){
		return $q(function(resolve, reject) {
          if (name != '' && pw != '') {
            $http.get('server/login.php?email='+name+'&pass='+pw).
            success(function(response) {
              var logResult=response
              if(logResult.errorM) {reject(logResult.errorM);}
              else{
				  console.log(response)
                  userCred(response[0], 'oldp');
                  resolve(response[0]);
              }
            },
            function(err) {reject('Login Failed.');}
            );

          } else  reject('Login Failed.');

        });
	}
  return{
      login :function(name, pw) {
        login(name,pw)
    },

      logout : function() {
        this.destroyUserCredentials();
    },
	storeUserCredentials:function(token) {
      userCred(token)
    },

	register:function(regprams){
		 register(regprams)
	},watchLoginChange: function() {
		FB.Event.subscribe('auth.authResponseChange', function(res) {
    		if (res.status === 'connected') {
    			FB.api('/me?fields=name,email, friends', function(res) {
					user.name=res.name;
                    user.email=res.email;
                    user.id=res.id;
					//console.log(res);
					user.status='FBPlayer';
					user.prop_pict='http://graph.facebook.com/'+ res.id+'/picture';
					$reg={fname:res.name.split(' ')[0], lname:res.name.split(' ')[1], email:res.email, phone:'', password:'fblogin', facebook:res.id}
					var email =(res.email)? res.email:res.id;
					// login(email, 'fblogin').then(  function(authenticated) {},
					//   function(err) {  register($reg).then(  function(authenticated){}, function(err) {} );
					//   }
					// );
                    FB.api(
                        "/"+user.id+"/permissions",
                        function (response) {
                          if (response && !response.error) {
                            user.permissions=response.data;
                            console.log(user.permissions);
                          }
                          $rootScope.$broadcast('loadFriends');
                          $rootScope.$apply();
                        }

                    );

					// if(res.friends.data.length>0){
					// 	friends = [];
					// 	for($j=0; $j<res.friends.data.length; $j++)	{
					// 		friends.push(res.friends.data[$j]);
					// 	}
					// 	friendsList(friends).then( function(authenticated){
					// 		console.log(authenticated)
					// 	}, function(err){console.log('Error getting friends, try again')})
					// }
					// $location.path('/exam');
					// $rootScope.$apply(function() {
					// $rootScope.user = res;
                    //
					// });
				});
			}
			else {}
  		});
	}
}
}])
