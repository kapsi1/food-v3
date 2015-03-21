'use strict';

import Food from '../Food';
import Requirements from '../Requirements';

export default function MenuCtrl($scope, $http, dateFilter) {
    $scope.searchFood = {};
    $scope.date = new Date();
    $scope.eaten = [];
    $scope.dayTypeText = {workout: 'Trening', rest: 'Odpoczynek'};

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
        $scope.eaten.push(new Food(food));
        $scope.searchFood = $scope.searchText = null;
        $scope.saveEaten();
    };

    $scope.deleteEaten = index => {
        $scope.eaten.splice(index, 1);
        $scope.saveEaten();
    };

    $scope.$watch('searchFood.food', searchFood => {
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
        $http.post('/api/eaten', data).then(res => {
            if(res.status !== 200) alert(res.statusText);
        });
        $scope.updateSums();
    };


    $scope.offsetDate = function (days) {
        $scope.date.setDate($scope.date.getDate() + days);
    };

    $scope.requirements = new Requirements(75.2, 12); //TODO

    var day = new Date().getDate();
    if ([18, 20, 21].indexOf(day) !== -1) { //TODO
        $scope.dayType = 'workout';
    } else {
        $scope.dayType = 'rest';
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
