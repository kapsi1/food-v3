'use strict';
import Food from './Food';
import Requirements from './Requirements';

export default /*@ngInject*/ function MainCtrl($scope, $http, $mdToast) {
    $http.get('/api/foods').success(function (foods) {
        $scope.foods = foods;
    });

    $scope.nextTab = function () {
        $scope.selectedTab = Math.min($scope.selectedTab + 1, 2);
    };
    $scope.previousTab = function () {
        $scope.selectedTab = Math.max($scope.selectedTab - 1, 0);
    };
    $scope.deleteFood = function (food) {
        $http.delete('/api/foods/' + food._id);
        $scope.foods.splice($scope.foods.indexOf(food), 1);
    };
    $scope.saveNewFood = function (newFood) {
        $http.post('/api/foods', newFood).then(function (res) {
            $scope.foods.push(newFood);
            if (res.status === 201) {
                $mdToast.showSimple('Saved ' + newFood.name);
            } else {
                $mdToast.showSimple('Error: ' + res.data);
            }
            $scope.newFood = null;
        });
    };
}
