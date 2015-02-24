'use strict';

app.controller('HomeController', function ($scope) {
    $scope.levels = {};
    $scope.unlockedLevels = [];
    $scope.levelsByCategory = {};

    DBGetUserLevels($scope.user, function (err, result) {
        var levels = [];
        for (var i = 0; i < result.rows.length; i++) {
            levels.push(result.rows[i].doc);
        }

        $scope.unlockedLevels = levels;
        $scope.$apply();
    });

    /* 
     * The first thing the controller will do is get the levels and place them on
     * the view as unlocked levels
     */
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
                if (levels[j].name == level.difficulty) {
                    if (!$scope.unlockedLevels.contains(level))
                        level.imageName = 'lock.png';

                    levels[j].levels.push(level);
                }
            }
        }

        // Then we fill the levels array with actual levels
        $scope.levels = levels;
        $scope.$apply();
    });

    /* 
     * After the levesl are set we go through them updating the ones that are unlocked
     */
    

    /*
     * This function will recieve the amount of levels per category and
     * return an array with the amount of rows of levels per category.
     */
    $scope.divideRows = function(length) {
        return new Array(length / 5);
    };

    Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i]._id === obj._id) {
            return true;
        }
    }
    return false;
}
});

