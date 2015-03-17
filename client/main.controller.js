'use strict';
import Food from './Food';
import Requirements from './Requirements';

export default function MainCtrl($scope, $http) {
    $http.get('/api/foods').success(function (foods) {
        $scope.foods = foods;
        //if (foods.length) $scope.addEaten(foods[0]);
    });

    $scope.nextTab = function () {
        $scope.selectedTab = Math.min($scope.selectedTab + 1, 2);
    };
    $scope.previousTab = function () {
        $scope.selectedTab = Math.max($scope.selectedTab - 1, 0);
    };
    $scope.deleteFood = function (food) {
        $http.delete('/api/foods/' + food._id);
    };
}
