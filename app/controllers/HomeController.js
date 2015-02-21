'use strict';

app.controller('HomeController', function ($scope) {
    $scope.levels = {};
    $scope.levelsByCategory = {};

    function pushLevel(levels, level) {

    };

    // First we count how many levels per difficulty are
    DBGetLevels(function (err, result) {
        if (err)
            return;

        var levels = [];
        var difficulties = [];

        // First we loop through the levels to get the different difficulties
        for (var i = 0; i < result.rows.length; i++) {
            var difficulty = result.rows[i].doc.difficulty;

            if (difficulties.indexOf(difficulty) == -1)
                difficulties.push(difficulty);
        }

        // Then we create the objects in the levels array followinf this pattern
        // {difficulty, [levels]}
        for (var i = 0; i < difficulties.length; i++) {
            levels.push({
                name : difficulties[i], 
                levels : []
            });
        }

        // The we loop again through the levels adding each to the levels inner array
        for (var i = 0; i < result.rows.length; i++) {
            var level = result.rows[i].doc;

            for (var j = 0; j < levels.length; j++) {
                if (levels[j].name == level.difficulty)
                    levels[j].levels.push(level);
            }
        }

        // Then we fill the levels array with actual levels

        $scope.levels = levels;
        $scope.$apply();
    });

    // Then we get the user levels
    /*DBGetUserLevels($scope.user, function (err, result) {
        var levels = [];
        for (var i = 0; i < result.rows.length; i++) {
            levels.push(result.rows[i].doc);
        }

        $scope.levels = levels;
        $scope.$apply();
    });*/

    $scope.getlevels = function(n, levels) {
        var result = [];
        for (var i = 0; i < 5; i++) {
            result.push(levels[n*2 + i]);
        }
        return result;
    };

    $scope.divideRows = function(length) {
        return new Array(length / 5);
    };
});

