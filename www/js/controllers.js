angular.module('HazriSV.controllers', ['ionic','firebase','highcharts-ng'])

.controller('loginCtrl', function ($scope, $ionicModal, $timeout) {


    
   
})

.controller("StudentViewCtrl", function ($scope, $ionicModal, $ionicPopup, $firebaseArray,$http) {
    var alldata,pratt=[],thatt=[],prtot=[],thtot=[],prsub=[],thsub=[],percent,totatt=0,atatt=0,present=['Present'],absent=['Absent'];
    $http({method: 'GET', url: 'http://cors.io/?u=http://bvcoeportal.orgfree.com/hazrimaterial/api/index.php/cs/be/7/49.json'}).
        then(function successCallback(response) {
            alldata=response.data;
            console.log(alldata);
            alldata.forEach(function(element) {
                if (element.type == 'pr') {
                    pratt.push(element.att);
                    prtot.push(element.totalAtt);
                    prsub.push(element.sname);
                    totatt += element.totalAtt;
                    atatt += element.att;
                   // console.log(totatt);
                }
                if (element.type == 'th') {
                    thatt.push(element.att);
                    thtot.push(element.totalAtt);
                    thsub.push(element.sname);
                    totatt += element.totalAtt;
                    atatt += element.att;
                }
            }, this);
            percent=atatt/totatt*100;
            present.push(percent);
            percent=100-percent;
            absent.push(percent);
            //console.log(absent);
            
        }, function errorCallback(response) {
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
                text: 'No. of Lectures'
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
    
    
    $scope.pie = {
        options:
        {
            chart: {
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Total attendance percent'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false
                    },
                } 
                }
            },
            series: [{
                type: 'pie',
                name:'percent',
                colorByPoint: true,
                data: [present,absent]
            }],
        
        loading: false
    }
})


.controller("notificationsctrl", function ($scope, notifications, $timeout) {
    
    //fb rules change for access ".write": "auth.uid == '002a448c-30c0-4b87-a16b-f70dfebe3386'"
     $scope.limit=2;
     $scope.canload= true;
     $scope.items = notifications;
     
     $scope.loadolder = function(){
         if($scope.items.length>$scope.limit)
         $scope.limit +=2;
         else
         $scope.canload = false;
     };
     $scope.doRefresh = function() {
    $timeout( function() {
     $scope.limit=2;
     $scope.canload= true;
     $scope.items = notifications;
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
      
  };
  
})

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})