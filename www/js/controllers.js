angular.module('bookie.controllers', ["firebase"])

  // Generic item factory for posts and the like
  .factory('Item', function() {
    return function(index, name, time, content) {
      this.index = index;
      this.name = name;
      this.time = time;
      this.content = content;
    }
  })

  // Factory for reviews
  .factory('Review', function() {
    return function(index, name, rating, content) {
      this.index = index;
      this.name = name;
      this.rating = rating;
      this.content = content;
    }
  })

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
          $scope.loginData.email = $scope.createAccountData.email;
          $scope.loginData.password = $scope.createAccountData.password;
          $scope.doLogin();
          var user = firebase.auth().currentUser;
          user.updateProfile({
            displayName: $scope.createAccountData.username,
            photoURL: "http://i.ebayimg.com/images/g/aJUAAOSwT6pVw1wO/s-l300.jpg"
          }).then(function() {
            console.log("Update successful");
          }).catch(function(error) {
            alert(errorMessage);
            console.log(error);
          })

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

  .controller('ChatsCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Item) {
    $scope.chats = {};

    $scope.index_t1 = 0;
    $scope.name_t1 = "Bill";
    $scope.time_t1 = "1:24pm";
    $scope.content_t1 = "I'll meet you there.";
    $scope.index_t2 = 1;
    $scope.name_t2 = "John";
    $scope.time_t2 = "12:07pm";
    $scope.content_t2 = "I got this thing to get rid of.";

    $scope.init = function() {
      var chat_t1 = new Item($scope.index_t1, $scope.name_t1, $scope.time_t1, $scope.content_t1);
      var chat_t2 = new Item($scope.index_t2, $scope.name_t2, $scope.time_t2, $scope.content_t2);
      $scope.chats[0] = chat_t1;
      $scope.chats[1] = chat_t2;
    }
    $scope.init();


    $scope.onSearch = function() {

    }

    $scope.onSelectChat = function(selectedChat) {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('app.chatUser', {
        'user': selectedChat.name
      });
    }
  })

  .controller('ChatUserCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Item, $stateParams) {
    $scope.chatStream = {};
    $scope.user = $stateParams.user;

    // Fill chatStream via Firebase TODO: Firebase
    $scope.index_t1 = 0;
    $scope.name_t1 = $scope.user;
    $scope.time_t1 = "1:24pm";
    $scope.content_t1 = "I'll meet you there.";
    $scope.index_t2 = 1;
    $scope.name_t2 = $scope.user;
    $scope.time_t2 = "1:20";
    $scope.content_t2 = "Okay, sounds good.";
    $scope.index_t3 = 2;
    $scope.name_t3 = firebase.auth().currentUser.displayName;
    $scope.time_t3 = "12:08";
    $scope.content_t3 = "Your post. I'll take it. Can you get to that one place at the time and stuff?"

    $scope.init = function() {
      var chatStream_t1 = new Item($scope.index_t1, $scope.name_t1, $scope.time_t1, $scope.content_t1);
      var chatStream_t2 = new Item($scope.index_t2, $scope.name_t2, $scope.time_t2, $scope.content_t2);
      var chatStream_t3 = new Item($scope.index_t3, $scope.name_t3, $scope.time_t3, $scope.content_t3);
      $scope.chatStream[0] = chatStream_t1;
      $scope.chatStream[1] = chatStream_t2;
      $scope.chatStream[2] = chatStream_t3;
    };
    $scope.init();

    $scope.onSelectMessage = function(selectedMessage) {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('app.userProfile', {
        'user': selectedMessage.name
      });
    };

    $scope.onSend = function() {
      //TODO: Add to top of chatStream
    }
  })

  .controller('PostsCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Item) {
    $rootScope.myPosts = {};

    $scope.index_t1 = 0;
    $scope.name_t1 = firebase.auth().currentUser.displayName;
    $scope.time_t1 = "9:45am";
    $scope.content_t1 = "Also I'm selling this thing.";
    $scope.index_t2 = 1;
    $scope.name_t2 = firebase.auth().currentUser.displayName;
    $scope.time_t2 = "9:29am";
    $scope.content_t2 = "I just super NEED this book out of my sight, please.";

    $scope.init = function() {
      var post_t1 = new Item($scope.index_t1, $scope.name_t1, $scope.time_t1, $scope.content_t1);
      var post_t2 = new Item($scope.index_t2, $scope.name_t2, $scope.time_t2, $scope.content_t2);
      $rootScope.myPosts[0] = post_t1;
      $rootScope.myPosts[1] = post_t2;
    }
    $scope.init();


    $scope.onSearch = function() {

    }

    $scope.onSelectPost = function(selectedPost) {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('app.editPost', {
        'index': selectedPost.index
      });
    }
  })

  .controller('EditPostCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Item, $stateParams) {
    $scope.post = $rootScope.myPosts[$stateParams.index];
    $scope.content = $scope.post.content;

    $scope.onSaveChanges = function() {
      // TODO: Update index to place at top
      $scope.post.time = 'TIME UPDATED' // TODO: Update time properly
      $rootScope.myPosts[$stateParams.index] = new Item($scope.post.index, $scope.post.name, $scope.post.time, $scope.content);

      $ionicViewSwitcher.nextDirection('back');
      $state.go('app.posts');
    }
  })

  .controller('MyProfileCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Review) {

    // It seems we'll have to track total rating and count of ratings to compute the average, since nothing I've tried
    // works for getting the size of a dictionary.
    $scope.ratingTotal = 0;
    $scope.ratingCount = 0;
    $scope.ratingAve = 0;
    $scope.name = $scope.user.displayName;
    $scope.bio = "ADD BIO HERE"
    $scope.myReviews = {};

    $scope.index_t1 = 0;
    $scope.name_t1 = "Bill";
    $scope.rating_t1 = 5;
    $scope.content_t1 = "As advertised.";
    $scope.index_t2 = 1;
    $scope.name_t2 = "Alice";
    $scope.rating_t2 = 2;
    $scope.content_t2 = "It's the book, but like, really bad.";

    $scope.init = function() {
      var review_t1 = new Review($scope.index_t1, $scope.name_t1, $scope.rating_t1, $scope.content_t1);
      var review_t2 = new Review($scope.index_t2, $scope.name_t2, $scope.rating_t2, $scope.content_t2);

      $scope.myReviews[0] = review_t1;
      $scope.ratingTotal += review_t1.rating;
      $scope.ratingCount++;

      $scope.myReviews[1] = review_t2;
      $scope.ratingTotal+= review_t2.rating;
      $scope.ratingCount++;

      $scope.ratingAve = $scope.ratingTotal / $scope.ratingCount;
    }
    $scope.init();

    $scope.onSaveChanges = function() {
      // TODO: Update user info via Firebase
    }
  })

  .controller('UserProfileCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Review, $stateParams) {
    // It seems we'll have to track total rating and count of ratings to compute the average, since nothing I've tried
    // works for getting the size of a dictionary.
    $scope.ratingTotal = 0;
    $scope.ratingCount = 0;
    $scope.ratingAve = 0;
    $scope.name = $stateParams.user;
    $scope.bio = "USER'S BIO HERE"
    $scope.userReviews = {};

    $scope.index_t1 = 0;
    $scope.name_t1 = "Ted";
    $scope.rating_t1 = 4;
    $scope.content_t1 = "Pretty good, I guess.";
    $scope.index_t2 = 1;
    $scope.name_t2 = "Rachel";
    $scope.rating_t2 = 0;
    $scope.content_t2 = "Never showed up and hasn't replied since.";

    $scope.init = function() {
      var review_t1 = new Review($scope.index_t1, $scope.name_t1, $scope.rating_t1, $scope.content_t1);
      var review_t2 = new Review($scope.index_t2, $scope.name_t2, $scope.rating_t2, $scope.content_t2);

      $scope.userReviews[0] = review_t1;
      $scope.ratingTotal += review_t1.rating;
      $scope.ratingCount++;

      $scope.userReviews[1] = review_t2;
      $scope.ratingTotal+= review_t2.rating;
      $scope.ratingCount++;

      $scope.ratingAve = $scope.ratingTotal / $scope.ratingCount;
    }
    $scope.init();

    $scope.onMessage = function() {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('app.chatUser', {
        'user': $scope.name
      });
    }

    $scope.onLeaveReview = function() {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('app.review', {
        'user': $scope.name
      });
    }
  })

  .controller('ReviewCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Review, $stateParams) {
    // It seems we'll have to track total rating and count of ratings to compute the average, since nothing I've tried
    // works for getting the size of a dictionary.
    $scope.name = $stateParams.user;
    $scope.userReviews = {};
    $scope.ratingTotal = 0;
    $scope.ratingCount = 0;

    $scope.init = function() {
      // TODO: Get user's review list, rating total, and rating count from Firebase
    };
    $scope.init();

    $scope.onSubmitReview = function() {
      var review = new Review($scope.ratingCount+1, firebase.auth().currentUser.displayName, $scope.rating, $scope.reviewContent);

      // TODO: Add review to the user's review list, update rating total, update rating count
      $ionicViewSwitcher.nextDirection('back');
      $state.go('app.userProfile', {
        'user': $scope.name
      });
    };
  })

  .controller('AppCtrl', function($rootScope, $scope, $ionicModal, $ionicViewSwitcher, $timeout, $state) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.user = firebase.auth().currentUser;

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
          var errorMessage = error.message;
          alert(errorMessage);
          console.log(error);
        });
    };
  })

  .controller('HomeCtrl', function($rootScope, $scope, $stateParams) {
    $scope.user = firebase.auth().currentUser;

    $scope.doPost = function() {
      var textarea = document.getElementById("postMessage");
      var postMessage = textarea.value;
      if(postMessage !== "") {
        console.log('Doing post');
        var postFolder = '/user/' + $scope.user.uid + '/public/posts/'
          + (Math.round(new Date().getTime()) / 1000).toString();
        var metadata = {
          contentType: 'image/png'
        };
        firebase.storage().ref(postFolder).child('message.txt').putString(textarea.value) //TODO: Add metadata for date and time
          .then(function () {
            console.log("Message successfully stored");
            textarea.value = "";
            firebase.storage().ref(postFolder).child('photo.png')
              .putString($rootScope.images[0], 'base64', { contentType: 'image/png' })
              .then(function () {
                alert("Success!");
                console.log("Photo successfully stored");
                $rootScope.images = [];
              })
              .catch(function (error) {
                alert(error.message);
                console.log(error);
              });
          })
          .catch(function (error) {
            alert(error.message);
            console.log(error);
          });
      }
      else {
        alert("Text box must contain input in order to post.");
      }
    };

    $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  })

  .controller('ImageCtrl', function($rootScope, $scope, $cordovaCamera, $cordovaFile) {
    //The scope array is used for our ng-repeat to store the links to the images
    $rootScope.images = [];

    $scope.addImage = function() {
      // The options array is passed to the cordovaCamera with specific options.
      // For more options see the official docs for cordova camera.
      var options = {
        quality: 50,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: navigator.camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: navigator.camera.PopoverArrowDirection.ARROW_UP,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };

      // Call the ngCordova module cordovaCamera we injected to our controller
      $cordovaCamera.getPicture(options).then(function(imageData) {

        $rootScope.images.push(imageData);

        // When the image capture returns data, we pass the information to our success function,
        // which will call some other functions to copy the original image to our app folder.

        //onImageSuccess(imageData);

        function onImageSuccess(fileURI) {
          createFileEntry(fileURI);
        }

        function createFileEntry(fileURI) {
          window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
        }

        // This function copies the original file to our app directory. As we might have to deal with duplicate images,
        // we give a new name to the file consisting of a random string and the original name of the image.
        function copyFile(fileEntry) {
          var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
          var newName = makeid() + name;

          window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
              fileEntry.copyTo(
                fileSystem2,
                newName,
                onCopySuccess,
                fail
              );
            },
            fail);
        }

        // If the copy task finishes successful, we push the image url to our scope array of images.
        // Make sure to use the apply() function to update the scope and view!
        function onCopySuccess(entry) {
          $scope.$apply(function () {
            $rootScope.images.push(entry.nativeURL);
          });
        }

        function fail(error) {
          console.log("fail: " + error.code);
        }

        function makeid() {
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          for (var i=0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          return text;
        }

      }, function(err) {
        console.log(err);
      });
    };

    $scope.urlForImage = function(imageName) {
      var name = imageName.substr(imageName.lastIndexOf('/') + 1);
      var trueOrigin = cordova.file.dataDirectory + name;
      return trueOrigin;
    };

    $scope.getImage = function() {
      return $rootScope.images.pop().image;
    }
  })
;
