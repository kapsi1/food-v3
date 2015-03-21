import angular from 'angular';
import 'angular-material';
import 'lib/angular-locale_pl-pl'
import 'font-awesome/css/font-awesome.min.css!';

import MainCtrl from 'main.controller';
import MenuCtrl from 'menu/menu.controller';
import services from 'services';
import filters from 'filters';

angular.module('foodDiaryApp', [
    'ngMaterial',
    services.name,
    filters.name
])
    .controller('MainCtrl', MainCtrl)
    .controller('MenuCtrl', MenuCtrl);

angular.element(document).ready(function() {
    angular.bootstrap(document, ['foodDiaryApp'], {strictDi: true});
    document.querySelector('body').style.display = 'block';
});