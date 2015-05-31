// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'starter.controllers']).run(function($ionicPlatform, $rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $state.go("app");
        }
    });
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
}).config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    }).state('app.saga', {
        url: "/saga",
        resolve: {
            "currentAuth": function(Auth) {
                // $waitForAuth returns a promise so the resolve waits for it to complete
                return Auth.$requireAuth();
            }
        },
        views: {
            'menuContent': {
                templateUrl: "templates/saga.html",
                controller: 'SagaCtrl'
            }
        }
    }).state('app.ut', {
        url: "/ut",
        resolve: {
            "currentAuth": function(Auth) {
                // $waitForAuth returns a promise so the resolve waits for it to complete
                return Auth.$requireAuth();
            }
        },
        views: {
            'menuContent': {
                templateUrl: "templates/ut.html",
                controller: 'UtCtrl'
            }
        }
    }).state('app.heima', {
        url: "/heima",
        resolve: {
            "currentAuth": function(Auth) {
                // $waitForAuth returns a promise so the resolve waits for it to complete
                return Auth.$requireAuth();
            }
        },
        views: {
            'menuContent': {
                templateUrl: "templates/heima.html",
                controller: 'HeimaCtrl'
            }
        }
    }).state('app.lost', {
        url: "/lost",
        resolve: {
            "currentAuth": function(Auth) {
                // $waitForAuth returns a promise so the resolve waits for it to complete
                return Auth.$requireAuth();
            }
        },
        views: {
            'menuContent': {
                templateUrl: "templates/lost.html",
                controller: 'LostCtrl'
            }
        }
    }).state('app.welcome', {
        url: "/welcome",
        views: {
            'menuContent': {
                templateUrl: "templates/welcome.html",
                controller: 'WelcomeCtrl'
            }
        }
    }).state('app.single', {
        url: "/playlists/:playlistId",
        views: {
            'menuContent': {
                templateUrl: "templates/playlist.html",
                controller: 'PlaylistCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/welcome');
}).value('fireURL', 'https://iorc.firebaseio.com/').factory("Auth", function($firebaseAuth, fireURL) {
    var ref = new Firebase(fireURL);
    return $firebaseAuth(ref);
});;