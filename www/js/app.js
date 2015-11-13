angular.module('HazriSV', ['ionic', 'firebase' ,'HazriSV.controllers'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.StatusBar) {
            if (ionic.Platform.isAndroid()) {
                StatusBar.backgroundColorByHexString("#388E3C");
            } else {
                StatusBar.styleLightContent();
            }
        }
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