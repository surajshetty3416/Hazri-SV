angular.module('HazriSV.controllers', ['ionic', 'firebase', 'highcharts-ng'])

    .controller('detailsCtrl', function ($scope, $ionicModal, $timeout, $firebase, $ionicLoading, details) {
        $scope.detail = {
            dept: null,
            year: null,
            rollno: null,
            semoption: [],
            nameoption: []
        };
        $scope.reset = function () {
            $scope.detail.year = null;
            $scope.detail.sem = null;
            $scope.detail.rollno = null;
            $scope.detail.nameoption = [];
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
        $scope.providenameop = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-balanced" ></ion-spinner>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 250
            });
            $scope.detail.nameoption = [];
            var ref = new Firebase("https://hazri.firebaseio.com/students/" + $scope.detail.dept);
            ref.on("child_added", function (snapshot, prevChildKey) {
                var data = snapshot.val();
                if (data.year == $scope.detail.year) {
                    $scope.detail.nameoption.push({ name: data.name, rollno: data.rollno })
                }
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 2000);
        }
        details.dataObj = $scope.detail;
    })

    .controller("StudentViewCtrl", function ($scope, $ionicModal, $ionicPopup, $firebaseArray, $http, details) {
        $scope.per={
            totper: null,
            prper: null,
            thper: null
        };
        $scope.getdata = function () {
            var alldata, pratt = [], thatt = [], prtot = [], thtot = [], prsub = [], thsub = [], totpatt = 0, atpatt = 0,tottatt = 0, attatt = 0, present = ['Present'], absent = ['Absent'];
            $http({ method: 'GET', url: 'http://cors.io/?u=http://bvcoeportal.orgfree.com/hazrimaterial/api/index.php/' + details.dataObj.dept + '/' + details.dataObj.year + '/' + details.dataObj.sem + '/' + details.dataObj.rollno + '.json' }).
                then(function successCallback(response) {
                    alldata = response.data;
                    console.log(alldata);
                    alldata.forEach(function (element) {
                        if (element.type == 'pr') {
                            pratt.push(element.att);
                            prtot.push(element.totalAtt);
                            prsub.push(element.sname);
                            totpatt += element.totalAtt;
                            atpatt += element.att;
                            // console.log(totatt);
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
                    $scope.per.totper = (attatt+atpatt) / (tottatt+totpatt) * 100;
                    console.log($scope.per);
            
                }, function errorCallback(response) {
                }).finally(function () {
                    // Stop the ion-refresher from spinning
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
                    }
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
                    }
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


    .controller("notificationsctrl", function ($scope, notifications, $timeout) {
    
        //fb rules change for access ".write": "auth.uid == '002a448c-30c0-4b87-a16b-f70dfebe3386'"
        $scope.limit = 2;
        $scope.canload = true;
        $scope.items = notifications;

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
                $scope.items = notifications;
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);

        };

    })

    .controller("optionCtrl", function () {

    })

    .filter('reverse', function () {
        return function (items) {
            return items.slice().reverse();
        };
    });