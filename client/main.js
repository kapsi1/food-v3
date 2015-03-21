import angular from 'angular';
import 'angular-material';
import 'lib/angular-locale_pl-pl'
import 'font-awesome/css/font-awesome.min.css!';

import MainCtrl from 'main.controller';
import MenuCtrl from 'menu/menu.controller';
import services from 'services';
import filters from 'filters';

//import 'client/app.less!';
//import 'client/menu/menu.less!';
//TODO

angular.module('foodDiaryApp', [
    'ngMaterial',
    services.name,
    filters.name
])
    .controller(MainCtrl.name, MainCtrl)
    .controller(MenuCtrl.name, MenuCtrl);

angular.element(document).ready(function() {
    angular.bootstrap(document, ['foodDiaryApp']);
    document.querySelector('body').style.display = 'block';
});