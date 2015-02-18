'use strict';

app.controller('PageController', function($scope) {
    $scope.page = {};
    $scope.page.page = 'auth';

    $scope.user = {};

    $scope.changePage = function (page) {
        $scope.page.page = page;
        $scope.$apply();
    }

    $scope.$watch('page.page', function(newVal, oldVal) {
        console.log("Page changed to " + newVal);
        $scope.page.page = newVal;
    });
});