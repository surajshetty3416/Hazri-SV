angular.module('HazriSV.controllers', ['ionic','firebase','highcharts-ng'])

.controller('loginCtrl', function ($scope, $ionicModal, $timeout) {


    
   
})

.controller("StudentViewCtrl", function ($scope, $ionicModal, $ionicPopup, $firebaseArray) {
    var ref = new Firebase("https://hazri.firebaseio.com/");
    // create a synchronized array
    $scope.collection = $firebaseArray(ref);

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






});
