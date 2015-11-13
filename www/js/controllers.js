angular.module('HazriSV.controllers', ['ionic','firebase','highcharts-ng'])

.controller('loginCtrl', function ($scope, $ionicModal, $timeout) {


    
   
})

.controller("StudentViewCtrl", function ($scope, $ionicModal, $ionicPopup, $firebaseArray) {
    $scope.highchartsNG = {
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
            categories: [
                'ERP',
                'AI',
                'DSP'
            ],
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
            data: [15,11,25]        
        }, {
            name: 'Attended',
            color: 'rgba(94,203,141,1)',
            data: [10,9,20],
            pointPadding: 0.2
        }],
        title: {
            text: 'Your Attendance Stats'
        },
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