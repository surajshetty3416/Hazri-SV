/* global Firebase */
angular.module('HazriSV.controllers', ['ionic', 'firebase', 'highcharts-ng'])

    .controller('detailsCtrl', function ($scope, $firebase, $ionicLoading, $localstorage) {

        var push = new Ionic.Push({
            "onNotification": function (notification) {
                $localstorage.pushObj("unreadnoti", {"title":notification.title,"message":notification.text,"date":Date()});
            },
            "pluginConfig": {
                "android": {
                }
            }
        });
         push.register();
        $scope.detail = {
            dept: null,
            year: null,
            rollno: null,
            sem: null,
            deptoption: [],
            semoption: []
        };
        
        $scope.noti = Object.keys($localstorage.getObj("unreadnoti"));//.map(function (key) {return $localstorage.getObj("unreadnoti")[key]});
        console.log($scope.noti);
        
        
        if (angular.equals($localstorage.getObj("deptoption"), {})) {
            console.log("in");
            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-balanced" ></ion-spinner>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 250
            });
            var ref = new Firebase("https://hazri.firebaseio.com/departments");
            ref.on("value", function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var id = childSnapshot.key();
                    var data = childSnapshot.val();
                    $scope.detail.deptoption.push({ "name": data.name, "id": id });
                });
                $ionicLoading.hide();
                $localstorage.setObj("deptoption", $scope.detail.deptoption);
            });


        }
        else {

            $scope.detail.deptoption = $localstorage.getObj("deptoption");
        }

        $scope.reset = function () {
            $scope.detail.year = null;
            $scope.detail.sem = null;
        };

        $scope.providesemop = function () {
            if ($scope.detail.year == "fe") {
                $scope.detail.semoption = [{ id: '1', name: 'Semester 1' }, { id: '2', name: 'Semester 2' }];
            }
            if ($scope.detail.year == "se") {
                $scope.detail.semoption = [{ id: '3', name: 'Semester 3' }, { id: '4', name: 'Semester 4' }];
            }
            if ($scope.detail.year == "te") {
                $scope.detail.semoption = [{ id: '5', name: 'Semester 5' }, { id: '6', name: 'Semester 6' }];
            }
            if ($scope.detail.year == "be") {
                $scope.detail.semoption = [{ id: '7', name: 'Semester 7' }, { id: '8', name: 'Semester 8' }];
            }
        }

        $scope.setdata = function () {
            $localstorage.set("dept", $scope.detail.dept);
            $localstorage.set("year", $scope.detail.year);
            $localstorage.set("sem", $scope.detail.sem);

            var user = Ionic.User.current();
            if (!user.id) {
                user.id = Ionic.User.anonymousId();
            }

            user.set('Department', $localstorage.get("dept"));
            user.set('Year', $localstorage.get("year"));
            user.save();

            var callback = function () {
                push.addTokenToUser(user);
                user.save();
            };
            push.register(callback);
        }

    })

    .controller("attendance_detailsCtrl", function ($scope, $ionicLoading, $http, $localstorage) {
        $scope.per = {
            totper: null,
            prper: null,
            thper: null
        };
        $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-balanced" ></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 250
        });

        $scope.getdata = function () {
            var alldata, pratt = [], thatt = [], prtot = [], thtot = [], prsub = [], thsub = [], totpatt = 0, atpatt = 0, tottatt = 0, attatt = 0, present = ['Present'], absent = ['Absent'];
            $http({ method: 'GET', url: 'http://cors.io/?u=http://bvcoeportal.orgfree.com/api/index.php/' + $localstorage.get("dept") + '/' + $localstorage.get("year") + '/' + $localstorage.get("sem") + '/' + $localstorage.get("rollno") + '.json' }).
                then(function successCallback(response) {
                    alldata = response.data;
                    alldata.forEach(function (element) {
                        if (element.type == 'pr') {
                            pratt.push(element.att);
                            prtot.push(element.totalAtt);
                            prsub.push(element.sname);
                            totpatt += element.totalAtt;
                            atpatt += element.att;
                        }
                        if (element.type == 'th') {
                            thatt.push(element.att);
                            thtot.push(element.totalAtt);
                            thsub.push(element.sname);
                            tottatt += element.totalAtt;
                            attatt += element.att;
                        }
                    }, this);
                    $scope.per.thper = attatt / tottatt * 100;
                    $scope.per.prper = atpatt / totpatt * 100;
                    $scope.per.totper = (attatt + atpatt) / (tottatt + totpatt) * 100;

                }, function errorCallback(response) {
                }).finally(function () {
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                });

            $scope.theory = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    plotOptions: {
                        column: {
                            grouping: false,
                            shadow: false,
                            borderWidth: 0
                        }
                    }
                },
                xAxis: {
                    title: {
                        text: 'Subjects'
                    },
                    categories: thsub,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'No. of Lectures'
                    },
                    allowDecimals: false
                },
                series: [{
                    name: 'Total Lectures',
                    color: 'rgba(165,170,217,.5)',
                    data: thtot
                }, {
                        name: 'Attended',
                        color: 'rgba(94,203,141,1)',
                        data: thatt,
                        pointPadding: 0.2
                    }],
                title: {
                    text: 'Theory Attendance'
                },
                loading: false
            }
            $scope.practical = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    plotOptions: {
                        column: {
                            grouping: false,
                            shadow: false,
                            borderWidth: 0
                        }
                    }
                },
                xAxis: {
                    title: {
                        text: 'Subjects'
                    },
                    categories: prsub,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'No. of Practicals'
                    },
                    allowDecimals: false
                },
                series: [{
                    name: 'Total Lectures',
                    color: 'rgba(165,170,217,.5)',
                    data: prtot
                }, {
                        name: 'Attended',
                        color: 'rgba(94,203,141,1)',
                        data: pratt,
                        pointPadding: 0.2
                    }],
                title: {
                    text: 'Practical Attendance'
                },
                loading: false
            }
        };
        $scope.getdata();
    })


    .controller("notificationsctrl", function ($scope, notifications, $timeout, $localstorage) {
       
        Object.keys($localstorage.getObj("unreadnoti")).forEach(function (key) {
            $localstorage.pushObj("readnoti", $localstorage.getObj("unreadnoti")[key]);
        });

        $localstorage.clearObj("unreadnoti");
        $scope.limit = 2;
        $scope.canload = true;
        $scope.items = Object.keys($localstorage.getObj("readnoti")).map(function (key) {return $localstorage.getObj("readnoti")[key]});
        //console.log($scope.items);
        $scope.loadolder = function () {
            if ($scope.items.length > $scope.limit)
                $scope.limit += 2;
            else
                $scope.canload = false;
        };
        $scope.doRefresh = function () {
            $timeout(function () {
                $scope.limit = 2;
                $scope.canload = true;
                $scope.items = $localstorage.getObj("readnoti");
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);

        };

    })

    .controller("option_1Ctrl", function () {

    })

    .controller("option_2Ctrl", function ($scope, $localstorage) {
        $scope.noti = Object.keys($localstorage.getObj("unreadnoti"));

    })

    .controller("timetableCtrl", function () {

    })

    .controller("bat_optionCtrl", function ($scope, $ionicLoading, $localstorage) {
        $scope.batoption = [];
        $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-balanced" ></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 250
        });
        var ref = new Firebase("https://hazri.firebaseio.com/studentCount/" + $localstorage.get("dept"));
        ref.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var data = childSnapshot.val();
                if (data.year == $localstorage.get("year")) {
                    $scope.batoption = data.batchno;
                }
            });
            $ionicLoading.hide();
        });

        $scope.setbat = function (bat) {
            $localstorage.set("bat", bat);
        };

    })

    .controller("sub_optionCtrl", function ($scope, $localstorage, $ionicLoading) {
        $scope.suboption = [];
        $scope.nameoption = [];
        $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-balanced" ></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 250
        });

        var ref = new Firebase("https://hazri.firebaseio.com/subjects/" + $localstorage.get("dept"));

        ref.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var key = childSnapshot.key();
                var data = childSnapshot.val();
                if (data.year == $localstorage.get("year") && data.sem == $localstorage.get("sem")) {
                    $scope.suboption.push({ name: data.fullname, subid: key, theory: data.theory, practical: data.practical });
                }
            });
            $ionicLoading.hide();
        });

        $scope.settsub = function (sub) {
            $localstorage.setObj("sub", { "name": sub.name, "type": "th", "id": sub.subid });
        };
        $scope.setpsub = function (sub) {
            $localstorage.setObj("sub", { "name": sub.name, "type": "pr", "id": sub.subid });
        };
    })

    .controller("topic_detailsCtrl", function ($scope, $localstorage, $ionicLoading) {
        $scope.sub = $localstorage.getObj("sub");
        $scope.sub.batch = $localstorage.get("bat");
        $scope.topics = [];
        $scope.limit = 50;
        $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-balanced" ></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 250
        });

        var ref = new Firebase("https://hazri.firebaseio.com/attendances/" + $localstorage.get("dept"));

        ref.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var data = childSnapshot.val();
                if (data.year == $localstorage.get("year") && data.semester == $localstorage.get("sem") && data.subid == $scope.sub.id && data.type == $scope.sub.type) {
                    if (data.type == 'th')
                        $scope.topics.push({ content: data.topic, date: data.date });
                    if (data.type == 'pr')
                        if (data.batchno == $scope.sub.batch)
                            $scope.topics.push({ content: data.topic, date: data.date });
                }
            });
            $ionicLoading.hide();
        });

    })

    .controller("name_optionCtrl", function ($scope, $localstorage, $ionicLoading) {

        $scope.nameoption = [];
        $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-balanced" ></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 250
        });


        var ref = new Firebase("https://hazri.firebaseio.com/students/" + $localstorage.get("dept"));
        $scope.nameoption = [];
        ref.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var data = childSnapshot.val();
                if (data.year == $localstorage.get("year")) {
                    $scope.nameoption.push({ name: data.name, rollno: data.rollno });
                }
            });
            $ionicLoading.hide();
        });

        $scope.setroll = function (roll) {
            $localstorage.set("rollno", roll);
        };
    })

    .filter('reverse', function () {
        return function (items) {
            return items.slice().reverse();
        };
    });