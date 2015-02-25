'use strict';

app.controller('CollectionController', function ($scope) {
    
    DBGetCards(function (err, response) {
      if (err)
            return;
        
      console.log(response);
      $scope.cards = response.rows.sort(function(a, b) {
                    if (a.doc.number > b.doc.number) return 1;
                    else if (a.doc.number < b.doc.number) return -1;
                    else return 0;
                });
      $scope.$apply();
    });
});