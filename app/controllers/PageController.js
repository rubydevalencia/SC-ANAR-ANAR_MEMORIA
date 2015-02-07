'use strict';

app.controller('PageController', function($scope) {
    $scope.page = {};
    $scope.page.page = 'auth';

    $scope.user = {};

    $scope.$watch('page.page', function(newVal, oldVal) {
        console.log("Page changed to " + newVal);
        $scope.page.page = newVal;
    });
});