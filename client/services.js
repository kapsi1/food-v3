//import 'client/app';
export default angular.module('foodDiaryApp-services', [])
  .factory('focus', function ($timeout) {
    return function (el) {
      // timeout makes sure that it is invoked after any other event has been triggered.
      // e.g. click events that need to run before the focus or
      // inputs elements that are in a disabled state but are enabled when those events
      // are triggered.
      $timeout(function () {
        if (el)
          el.focus();
      }, 100);
    };
  });
