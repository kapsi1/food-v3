'use strict';

import Food from '../Food';
import Requirements from '../Requirements';
import 'client/services';

export default function MenuCtrl($scope, $http, focus, dateFilter) {
    this.date = new Date();
    this.eaten = [];

    this.updateSums = function () {
        this.eatenSums = {
            kcal: 0, proteins: 0, carbs: 0, fat: 0, weight: 0
        };

        for (var i = 0; i < this.eaten.length; i++) {
            var food = this.eaten[i];
            this.eatenSums['weight'] += food['_weight'];
            ['kcal', 'proteins', 'carbs', 'fat'].forEach(type => {
                this.eatenSums[type] += food['_weight_' + type];
            });
        }
    };
    this.updateFood = function (food, calcFnName) {
        food[calcFnName]();
        this.updateSums();
        this.saveEaten();
    };

    this.addEaten = food => {
        console.log('addEaten', food);
        this.eaten.push(new Food(food));
        this.searchFood = this.searchText = null;
        this.saveEaten();
        //focus($('input.weight').last());
    };

    $scope.$watch(angular.bind(this, ctrl=>{console.log(ctrl.ctrl);return ctrl.ctrl.searchFood}),
            searchFood => {
            console.log('searchFood', searchFood);
            if (searchFood) {
                this.addEaten(searchFood);
            }
        }
    );

    this.saveEaten = function () {
        var data = {
            date: dateFilter(this.date, 'dd.MM.yyyy'),
            foodList: this.eaten.map(food => {
                return {
                    food: food._id,
                    eatenWeight: food._weight
                }
            })
        };
        $http.post('/api/eaten', data).then(res => console.log(res));
    };

    //this.$watch('dayType.workout', function (val) {
    //    this.dayType.text = val ? 'Trening' : 'Odpoczynek';
    //});

    $scope.$watch(angular.bind(this, ctrl=>ctrl.ctrl.dayType.workout), workout => {
            console.log('workout', workout);
            this.dayType.text = workout ? 'Trening' : 'Odpoczynek';
        }
    );

    this.offsetDate = function (days) {
        this.date.setDate(this.date.getDate() + days);
    };

    this.requirements = new Requirements(76, 11.66);

    var day = new Date().getDate();
    this.dayType = {};
    if ([3, 5, 6, 8, 10, 11, 13, 14].indexOf(day) !== -1) {
        this.dayType.workout = true;
        this.dayType.text = 'Trening';
    } else {
        this.dayType.workout = false;
        this.dayType.text = 'Odpoczynek';
    }

    $http.get('/api/eaten/' + dateFilter(this.date, 'dd.MM.yyyy')).success(data => {
        this.eaten = data.foodList.map(foodObj => {
            var f = new Food(foodObj.food);
            f._weight = foodObj.eatenWeight;
            f.calcUnits();
            f.calcNutrition();
            return f;
        });
        this.updateSums();
    }).error(function (err) {
    });
}
