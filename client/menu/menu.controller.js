'use strict';

import Food from '../Food';
import Requirements from '../Requirements';
import 'client/services';

export default function MenuCtrl($scope, $http, focus, dateFilter) {
    $scope.searchFood = {};
    $scope.date = new Date();
    $scope.eaten = [];

    $scope.updateSums = function () {
        $scope.eatenSums = {
            kcal: 0, proteins: 0, carbs: 0, fat: 0, weight: 0
        };

        for (var i = 0; i < $scope.eaten.length; i++) {
            var food = $scope.eaten[i];
            $scope.eatenSums['weight'] += food['_weight'];
            ['kcal', 'proteins', 'carbs', 'fat'].forEach(type => {
                $scope.eatenSums[type] += food['_weight_' + type];
            });
        }
    };
    $scope.updateFood = function (food, calcFnName) {
        food[calcFnName]();
        $scope.updateSums();
        $scope.saveEaten();
    };

    $scope.addEaten = food => {
        console.log('addEaten', food);
        $scope.eaten.push(new Food(food));
        $scope.searchFood = $scope.searchText = null;
        $scope.saveEaten();
        //focus($('input.weight').last());
    };

    $scope.$watch('searchFood.food', searchFood => {
            console.log('searchFood', searchFood);
            if (searchFood) {
                $scope.addEaten(searchFood);
            }
        }
    );

    $scope.saveEaten = function () {
        var data = {
            date: dateFilter($scope.date, 'dd.MM.yyyy'),
            foodList: $scope.eaten.map(food => {
                return {
                    food: food._id,
                    eatenWeight: food._weight
                }
            })
        };
        $http.post('/api/eaten', data).then(res => console.log(res));
    };

    $scope.$watch('dayType.workout', function (val) {
        $scope.dayType.text = val ? 'Trening' : 'Odpoczynek';
    });

    //$scope.$watch(angular.bind(this, ctrl=>ctrl.ctrl.dayType.workout), workout => {
    //        console.log('workout', workout);
    //        $scope.dayType.text = workout ? 'Trening' : 'Odpoczynek';
    //    }
    //);

    $scope.offsetDate = function (days) {
        $scope.date.setDate($scope.date.getDate() + days);
    };

    $scope.requirements = new Requirements(76, 11.66);

    var day = new Date().getDate();
    $scope.dayType = {};
    if ([3, 5, 6, 8, 10, 11, 13, 14].indexOf(day) !== -1) {
        $scope.dayType.workout = true;
        $scope.dayType.text = 'Trening';
    } else {
        $scope.dayType.workout = false;
        $scope.dayType.text = 'Odpoczynek';
    }

    $http.get('/api/eaten/' + dateFilter($scope.date, 'dd.MM.yyyy')).success(data => {
        $scope.eaten = data.foodList.map(foodObj => {
            var f = new Food(foodObj.food);
            f._weight = foodObj.eatenWeight;
            f.calcUnits();
            f.calcNutrition();
            return f;
        });
        $scope.updateSums();
    }).error(function (err) {
    });
}
