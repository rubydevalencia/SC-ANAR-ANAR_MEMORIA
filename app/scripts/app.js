angular.module('AnarApp', ['ngRoute'])
.controller('AuthController', function($scope, $timeout) {

    // This function is used to login the user
    $scope.loginUser = function loginUser(id, password) {
        DBloginUser(id, password, function(status){
            
            if (status == 200)
                console.log("success");
            else if(status == 401)
                console.log("unathorized");
            else if(status == 404)
                console.log("not found");
            else 
                console.log(status);
        });
    }
});