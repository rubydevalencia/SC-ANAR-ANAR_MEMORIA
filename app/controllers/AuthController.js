'use strict';

app.controller('AuthController', function($scope) {
    // This function is used to login the user
    $scope.loginUser = function (id, password) {
        var resultCode = DBloginUser(id, password, function(status){
            if (status == 200) {
                $scope.user.name = id;
                $scope.changePage('home');
            }
            else if(status == 401)
                console.log("unathorized");
            else if(status == 404)
                console.log("not found");
            else 
                console.log(status);
        });
    }

    // This function is used to register the user
    $scope.registerUser = function (id, password) {
        DBregisterUser(id, password, function(status){
            
            //TODO check possible errors
            if (status == 200)
                console.log("success");
            else if(status == 409)
                console.log("already exists");
            else 
                console.log(status);
        });
    }
});