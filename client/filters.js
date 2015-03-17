'use strict';
export default angular.module('foodDiaryApp-filters', [])
  .filter('round', function () {
    return function (num, fix) {
      if (num === undefined || num === null || isNaN(parseInt(num))) return 0;
      if (fix === undefined || fix === null) fix = 0;
      var n = Math.pow(10, fix);
      return Math.round(num * n) / n
    }
  });