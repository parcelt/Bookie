// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('bookie', ['ionic', 'bookie.controllers', 'ngCordova'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('app.chats', {
        url: '/chats',
        views: {
          'menuContent': {
            templateUrl: 'templates/chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })

      .state('app.chatUser', {
        url: '/chatUser/:user',
        views: {
          'menuContent': {
            templateUrl: 'templates/chatUser.html',
            params: {
              'user': 'user_placeholder'
            },
            controller: 'ChatUserCtrl'
          }
        }
      })

      .state('app.posts', {
        url: '/posts',
        views: {
          'menuContent': {
            templateUrl: 'templates/posts.html',
            controller: 'PostsCtrl'
          }
        }
      })

      .state('app.editPost', {
        url: '/editPost/:index',
        views: {
          'menuContent': {
            templateUrl: 'templates/editPost.html',
            params: {
              'index': 0
            },
            controller: 'EditPostCtrl'
          }
        }
      })

      .state('app.myProfile', {
        url: '/myProfile',
        views: {
          'menuContent': {
            templateUrl: 'templates/myProfile.html',
            controller: "MyProfileCtrl"
          }
        }
      })

      .state('app.userProfile', {
        url: '/userProfile/:user',
        views: {
          'menuContent': {
            templateUrl: 'templates/userProfile.html',
            params: {
              'user': 'user_placeholder'
            },
            controller: 'UserProfileCtrl'
          }
        }
      })

      .state('app.review', {
        url: '/review/:user',
        views: {
          'menuContent': {
            templateUrl: 'templates/review.html',
            params: {
              'user': 'user_placeholder'
            },
            controller: 'ReviewCtrl'
          }
        }
      })

      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html'
          }
        }
      })

      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  });
