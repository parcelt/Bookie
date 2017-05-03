// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('bookie', ['ionic', 'bookie.controllers', 'ngCordova', 'firebase'])

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
        cache: false,
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
        cache: false,
        url: '/chats',
        views: {
          'menuContent': {
            templateUrl: 'templates/chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })

      .state('app.chatUser', {
        cache: false,
        url: '/chatUser/:user',
        params: {
          'uid': 'uid_placeholder',
          'displayName': 'displayName_placeholder',
          'email': 'email_placeholder',
          'photoURL': 'photoURL_placeholder'
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/chatUser.html',
            controller: 'ChatUserCtrl'
          }
        }
      })

      .state('app.posts', {
        cache: false,
        url: '/posts',
        views: {
          'menuContent': {
            templateUrl: 'templates/posts.html',
            controller: 'PostsCtrl'
          }
        }
      })

      .state('app.editPost', {
        cache: false,
        url: '/editPost/:key',
        params: {
          'key': "key_placeholder"
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/editPost.html',
            controller: 'EditPostCtrl'
          }
        }
      })

      .state('app.search', {
        cache: false,
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
          }
        }
      })

      .state('app.myProfile', {
        cache: false,
        url: '/myProfile',
        views: {
          'menuContent': {
            templateUrl: 'templates/myProfile.html',
            controller: "MyProfileCtrl"
          }
        }
      })

      .state('app.userProfile', {
        cache: false,
        url: '/userProfile/:uid',
        params: {
          'uid': 'uid_placeholder',
          'displayName': 'displayName_placeholder',
          'email': 'email_placeholder',
          'photoURL': 'photoURL_placeholder'
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/userProfile.html',
            controller: 'UserProfileCtrl'
          }
        }
      })

      .state('app.settings', {
        cache: false,
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })

      .state('app.home', {
        cache: false,
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
