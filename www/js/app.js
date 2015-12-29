angular.module('HazriSV', ['ionic', 'ionic.service.core', 'ionic.service.analytics', 'firebase', 'HazriSV.controllers'])

    .run(function ($ionicPlatform, $ionicAnalytics, details) {
        $ionicPlatform.ready(function () {
            $ionicAnalytics.register();
            if (window.StatusBar) {
                if (ionic.Platform.isAndroid()) {
                    StatusBar.backgroundColorByHexString("#33cd5f");
                } else {
                    StatusBar.styleLightContent();
                }

            }

            Ionic.io();
            var push = new Ionic.Push({
                "onNotification": function (notification) {
                    details.notification.push({ "data": notification.payload, "seen": "false" });
                },
                "pluginConfig": {
                    "android": {
                    }
                }
            });

            var user = Ionic.User.current();
            if (!user.id) {
                user.id = Ionic.User.anonymousId();
            }
            user.set('Name', 'Hazri');
            user.set('Bio', 'Attendance App');
            user.save();

            var callback = function () {
                push.addTokenToUser(user);
                user.save();
            };
            push.register(callback)
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('details', {
                url: '/details',
                templateUrl: 'templates/details.html',
                controller: 'detailsCtrl'
            })

            .state('attendance_details', {
                url: "/attendance_details",
                templateUrl: "templates/attendance_details.html",
                controller: 'attendance_detailsCtrl'
            })

            .state('notifications', {
                url: "/notifications",
                templateUrl: "templates/notifications.html",
                controller: 'notificationsctrl'
            })

            .state('option_1', {
                url: '/option_1',
                templateUrl: 'templates/option_1.html',
                controller: 'option_1Ctrl'
            })

            .state('option_2', {
                url: '/option_2',
                templateUrl: 'templates/option_2.html',
                controller: 'option_2Ctrl'
            })

            .state('timetable', {
                url: '/timetable',
                templateUrl: 'templates/timetable.html',
                controller: 'timetableCtrl'
            })

            .state('sub_option', {
                url: '/sub_option',
                templateUrl: 'templates/sub_option.html',
                controller: 'sub_optionCtrl'
            })
            
            .state('bat_option', {
                url: '/bat_option',
                templateUrl: 'templates/bat_option.html',
                controller: 'bat_optionCtrl'
            })

            .state('topic_details', {
                url: '/topic_details',
                templateUrl: 'templates/topic_details.html',
                controller: 'topic_detailsCtrl'
            })

            .state('name_option', {
                url: '/name_option',
                templateUrl: 'templates/name_option.html',
                controller: 'name_optionCtrl'
            });

        $urlRouterProvider.otherwise('/details');
    })

    .factory("notifications", function ($firebaseArray) {
        var itemsRef = new Firebase('https://hazri.firebaseio.com/notifications');
        return $firebaseArray(itemsRef);
    })

    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])

    .service('details', function () {
        var _dataObj = {};
        this.dataObj = _dataObj;
    });