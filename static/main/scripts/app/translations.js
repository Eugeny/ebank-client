angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('ru', {"About":"О нас","Copyright Gamma E-Bank ©2014":"Гамма Е-Банк © 2014"});
/* jshint +W100 */
}]);