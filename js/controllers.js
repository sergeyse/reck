angular.module('starter.controllers', []).controller('AppCtrl', function($scope, $ionicModal, $timeout, fireURL, $firebase,$state) {
    // Form data for the login modal
    $scope.loginData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    }
    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        var ref = new Firebase(fireURL);
        ref.authWithPassword({
         
             email:$scope.loginData.username,
            password:$scope.loginData.password
        },function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
        $scope.closeLogin();
    $state.go("app.ut");// ath the back buttom in a main screen from ui router ionic need tobe disabled     
  }
});
     
    };

     $scope.logOut = function (){
        console.log ('logging out ')
        var ref = new Firebase(fireURL);
        ref.unauth();
        $state.go("app.welcome");

    };

}).controller('UtCtrl', function($scope, $ionicModal, $http, $firebaseArray, fireURL, $filter, $firebaseObject, $timeout,currentAuth ,$ionicPopup) {
    console.log("autorisation "+ currentAuth);
   $scope.exceptEmptyComparator = function (actual, expected) {
    if (!expected) {
       return true;
    }
    return angular.equals(expected, actual);
}

    var orderHistory = new Firebase(fireURL + "history/");
    $scope.historyOrders = $firebaseArray(orderHistory);
    var homeList = new Firebase(fireURL + "home/");
    $scope.orders = $firebaseArray(homeList);

    function recUt() {
        $scope.order.lendOut = true;
        $scope.orders.$add($scope.order).then(function(ref) {
            console.log("added a new rec" + ref.key());
        });
    };
    $scope.order = {};
    $ionicModal.fromTemplateUrl('templates/skraut.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.showModal = function() {
        $scope.modal.show();
    };
    $scope.closeUt = function() {
        $scope.modal.hide();
    };
    $scope.fetch = function() {
       var restIP =  window.localStorage.getItem('IP');
        $scope.spinner = true;
        //here we fatch json and populate form in modal 
        console.log("My order", $scope.order);
        console.log("local storage IP ",restIP);
      //  $http.get('templates/' + $scope.order.number + '.json').then(function(resp) {
             $http.get('http://'+ restIP +':8080/orders/search/findByPontun?pontun=' + $scope.order.number).then(function(resp) {
            console.log('Success', resp.data._embedded.orders[0]);
            $scope.order.name = resp.data._embedded.orders[0].name;
            $scope.order.address = resp.data._embedded.orders[0].address;
            $scope.order.phone = resp.data._embedded.orders[0].phone;
            $scope.order.delivaddress = resp.data._embedded.orders[0].delivaddress;
            $scope.order.delivphone = resp.data._embedded.orders[0].delivPhone;
            $scope.order.postN = resp.data._embedded.orders[0].deliverypostn;
        }, function(err) {
            console.error('ERR', err);
            alert("Vinsamlegast stilla backend", err);
            // err.status will contain the status code
        });
        $scope.spinner = false;
    };
    $scope.doSkraUt = function() {
        console.log("in skraut");
        //here we write to a firebase 
        $scope.order.lendOutTime = $filter("date")(Date.now(), 'yyyy-MM-dd');
        if ($scope.orders) {
            //checking an empty array on a database initialization/access
            for (var i = 0; i < $scope.orders.length; i++) { // the sequense need fix .promise is deleting  a wrong rec 
                console.log('all objects ' + $scope.orders[i]);
                if ($scope.orders[i].rack == $scope.order.rack) {
                    // var historyObjClone = clone($scope.objects[i]);
                    //do rec to a history firebase an delete from home
                    $scope.orders[i].comeHomeTime = $filter("date")(Date.now(), 'yyyy-MM-dd');
                    $scope.historyOrders.$add($scope.orders[i]).then(function(refer) {});
                    $scope.orders.$remove($scope.orders[i]).then(function(r) {
                        console.log("remved id " + r);
                    });
                };
            };
            recUt();
        };
        console.log("Order obj", $scope.order);
        $scope.closeUt();
        $scope.order = {};
    };
    //----- using popup for a confirm 
       $scope.showConfirm = function(){
           var confirmPopup = $ionicPopup.confirm(
           {
            title:'Skrá rekkan inn',
            template: 'Yttu  á OK ef þið viljið skrá rekka inn'
           }); 
           confirmPopup.then(function(res){
            if(res){
                $scope.recIn();
                $scope.order = {};
            }else {
                console.log('cancel');
            }
           });  
        };

    $scope.recIn = function() {
        for (var i = 0; i < $scope.orders.length; i++) {
            if ($scope.orders[i].rack === $scope.order.rack) {
                $scope.orders[i].lendOut = false;
                  $scope.orders[i].comeHomeTime = $filter("date")(Date.now(), 'yyyy-MM-dd');
               // $scope.orders.$save($scope.orders[i]);
                console.log("we got one " + $scope.order.rack);
                 $scope.historyOrders.$add($scope.orders[i]).then(function(refer) {});
                $scope.orders.$remove($scope.orders[i]).then(function(r) {
                    console.log("remved id " + r);
                });
            }
        }
        $scope.order.lendOut = false;
        $scope.order.comeHomeTime = $filter("date")(Date.now(), 'yyyy-MM-dd');
        $scope.orders.$add($scope.order).then(function(ref) {
            console.log("added a new rec to come home" + ref.key());
        });

        
    $scope.order = {};
    }
}).controller('HeimaCtrl', function($scope, $firebaseArray,fireURL) {

    //-empty comparator filter fix ------
$scope.exceptEmptyComparator = function (actual, expected) {
    if (!expected) {
       return true;
    }
    return angular.equals(expected, actual);
}

  var homeList = new Firebase(fireURL + "home/");
    $scope.orders = $firebaseArray(homeList);
    $scope.data ={
        showDelete: false
    };
    $scope.onItemDelete= function(item){
        console.log("item =",item);
        $scope.orders.$remove(item).then(function(id){
            console.log('removed :',id);
        })
    };

}).controller('LostCtrl', function ($scope) {
    $scope.data = "hi";
    
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
    $scope.id = $stateParams.playlistId;
}).controller('SagaCtrl',  function ($scope,$firebaseArray,fireURL) {
  var historyList = new Firebase(fireURL +"history/");
  $scope.historyRecs =$firebaseArray(historyList);
  
})
.controller('WelcomeCtrl' , function($scope){
        console.log("in the rest1")
  $scope.data ={};
   $scope.setRest =function(){
       console.log("in the rest");
       window.localStorage.setItem('IP',$scope.data.ip);

   };

   /* $scope.doLog=function(){
       $scope.doLogin();

    };
*/
});