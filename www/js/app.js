/* global Firebase */
/* global Ionic */
angular.module('HazriSV', ['ionic','ionic.service.core','ionic.service.analytics', 'firebase' ,'HazriSV.controllers'])

.run(function ($ionicPlatform,$ionicAnalytics) {
    $ionicPlatform.ready(function () {
        $ionicAnalytics.register();
        if (window.StatusBar) {
            if (ionic.Platform.isAndroid()) {
                StatusBar.backgroundColorByHexString("#388E3C");
            } else {
                StatusBar.styleLightContent();
            }
            
        }
         
        Ionic.io();
        var push = new Ionic.Push({
                "onNotification" : function(notification){
                    alert('Notification recieved!!!');
                },
                "pluginConfig":{
                    "android":{
                        "iconColor": "#0000FF"
                    }
                }
            });
            
          var user = Ionic.User.current();
          if(!user.id){
              user.id = Ionic.User.anonymousId();
          }  
          user.set('Name','Suraj');
          user.set('Bio','Programmer');
          user.save();
          
          var callback = function(){
              push.addTokenToUser(user);
              user.save();
          };
          push.register(callback)
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('login', {
          url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
      })

           .state('studentview', {
               url: "/studentview",
               templateUrl: "templates/student_view.html",
               controller: 'StudentViewCtrl'  
           })
           
           .state('notifications',{
               url:"/notifications",
               templateUrl:"templates/notifications.html",
               controller:'notificationsctrl'
           });

    $urlRouterProvider.otherwise('/login');
})

.factory("notifications", function($firebaseArray) {
  var itemsRef = new Firebase('https://hazri.firebaseio.com/notifications');
  return $firebaseArray(itemsRef);
});