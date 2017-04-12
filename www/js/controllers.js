angular.module('bookie.controllers', [])

.controller('LoginCtrl', function($rootScope, $scope, $ionicViewSwitcher, $ionicModal, $state, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  $scope.doLogin = function() {
    //TODO: Verify via Firebase
    firebase.auth().signInWithEmailAndPassword($scope.loginData.email, $scope.loginData.password)
    .then(function() {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('app.home');
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  }
  $scope.onCreateAccount = function() {
    $scope.createAccount();
  }

  // Form data for the login modal
  $scope.createAccountData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/createAccount.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.createAccountModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeCreateAccount = function() {
    $scope.createAccountModal.hide();
  };

  // Open the login modal
  $scope.createAccount = function() {
    $scope.createAccountModal.show();
  };

  $scope.doCreateAccount = function() {
    //TODO: Verify via Firebase
    firebase.auth()
    .createUserWithEmailAndPassword($scope.createAccountData.email, $scope.createAccountData.password)
    .then(function() {
      //$ionicViewSwitcher.nextDirection('back');
      //$state.go('login');
      $timeout(function() {
        $scope.closeCreateAccount();
      }, 1000);
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  }
})

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $ionicViewSwitcher, $timeout, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/logout.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.logoutModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogout = function() {
    $scope.logoutModal.hide();
  };

  // Open the login modal
  $scope.logout = function() {
    $scope.logoutModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogout = function() {
    console.log('Doing logout');
    //TODO: Verify via Firebase
    firebase.auth().signOut()
    .then(function() {
      //$ionicViewSwitcher.nextDirection('forward');
      $state.go('login');
      $timeout(function() {
        $scope.closeLogout();
      }, 1000);
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
      console.log(error);
    });
  };
})

.controller('HomeCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
