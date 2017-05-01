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

    $rootScope.defaultImg = "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";

    $scope.doLogin = function() {
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
              //photoURL: "http://i.ebayimg.com/images/g/aJUAAOSwT6pVw1wO/s-l300.jpg"
              photoURL: $rootScope.defaultImg
            }).then(function() {
              console.log("Update successful");
              firebase.database().ref('/user/' + user.uid).set(
                {
                  uid: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  photoURL: user.photoURL
                }
              );

          }).catch(function(error) {
            alert(error.message);
            console.log(error);
          })

        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/weak-password') {
            alert('The password is too weak.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
    }
  })

  .controller('SettingsCtrl', function($rootScope, $scope) {
    $scope.doUpdatePassword = function(){
      var newPassword = document.getElementById("newPassword").value;
      var newPasswordConfirm = document.getElementById("newPasswordConfirm").value;
      if(newPassword === newPasswordConfirm){
        $rootScope.user.updatePassword(newPassword).then(function() {
          alert("Password Updated");
        } , function(error) {
          alert("Password Update Failed");
        })
      } else {
        alert("Passwords Do Not Match");
      }
    };
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
    $scope.displayName = $stateParams.user;

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

  .controller('PostsCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, $firebaseArray) {
    var postsRef = firebase.database().ref('/posts/');
    var query = postsRef.orderByChild("uid").equalTo($rootScope.user.uid);
    $scope.postsList = $firebaseArray(query);
    /*$scope.postsList.$loaded()
      .then(function() {
      console.log("length = " + $scope.postsList.length);
    })
    .catch(function(error) {
      console.log("Error: ", error);
    })
    console.log($rootScope.user.uid);*/

    $scope.parseJSON = function(raw) {
      return JSON.parse(raw);
    };

    $scope.onSearch = function() {

    }

    $scope.onSelectPost = function(post) {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('app.editPost', {
        'key': $scope.postsList.$keyAt(post),
        'loaded': false
      });
      console.log("post clicked");
    }
  })

  .controller('EditPostCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Item, $stateParams, $firebaseArray) {
    $scope.parseJSON = function(raw) {
      return JSON.parse(raw);
    };

    $scope.post;
    var location = '/posts/' + $stateParams.key;
    firebase.database().ref(location).once("value", function(snap) {
      if(snap.val() != null) $scope.post = snap.val();
      $rootScope.images = $scope.parseJSON($scope.post.images);
      document.getElementById("editMessage").style.height = 'auto';
      document.getElementById("editMessage").style.height = (this.scrollHeight) + 'px';
      $state.go($state.current, {}, {reload: true});
    });

    $scope.onSaveChanges = function() {
      var textarea = document.getElementById("editMessage");
      var postMessage = textarea.value;
      var currentdate = new Date();
      var datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
      if(postMessage !== "") {
        console.log('Doing post');
        firebase.database().ref(location).set(
          {
            uid: $rootScope.user.uid,
            displayName: $rootScope.user.displayName,
            email: $rootScope.user.email,
            photoURL: $rootScope.user.photoURL,
            time: currentdate.toLocaleString() + " (edited)",
            message: postMessage,
            images: JSON.stringify($rootScope.images)
          });
        console.log("Post successfully stored");
        $rootScope.images = []; //Reset images array to be empty
        textarea.value = "";
        alert("Success!");
        $state.go($state.current, {}, {reload: true});
      }
      else {
        alert("Text box must contain input in order to post.");
      }
      $ionicViewSwitcher.nextDirection('back');
      $state.go('app.posts');
    }

    $scope.onDeletePhotos = function() {
      $rootScope.images = [];
    }

    $scope.onDeletePost = function() {
      firebase.database().ref(location).remove();
      $ionicViewSwitcher.nextDirection('back');
      $state.go('app.posts');
    }

    $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });

    $scope.$on('$ionicView.beforeLeave', function() {
      $rootScope.images = [];
    });
  })

  .controller('MyProfileCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Review, $firebaseArray) {

    var reviewsRef = firebase.database().ref('/user/' + $rootScope.user.uid + '/reviews/');
    $scope.myReviewsList = $firebaseArray(reviewsRef);

    $scope.name = $rootScope.user.displayName;
    $rootScope.images = []; // Empty the images
    $scope.ratingTotal = 0.0;
    $scope.ratingCount = 0.0;
    $scope.ratingAve = 0;

    /*$scope.$watch(function() {
      return $rootScope.images;
    }, function() {
      $scope.photo = $rootScope.images[0];
      $rootScope.images = [];
    });*/

    /*$scope.init = function() {
      angular.forEach($scope.myReviewsList, function(review) {
        $scope.ratingTotal += parseFloat(review.rating, 10);
        $scope.ratingCount++;
      });

      $scope.ratingAve = $scope.ratingTotal / $scope.ratingCount;
    };
    $scope.init();*/
    $scope.myReviewsList.$loaded()
      .then(function(){
        angular.forEach($scope.myReviewsList, function(review) {
          $scope.ratingTotal += parseFloat(review.rating);
          $scope.ratingCount++;
        });

        $scope.ratingAve = $scope.ratingTotal / $scope.ratingCount;
      });

    $scope.updatePosts = function(name, photoURL) {
      var currRef = firebase.database().ref('/posts/');
      var query = currRef.orderByChild("uid").equalTo($rootScope.user.uid);
      var list = $firebaseArray(query);
      list.$loaded()
        .then(function() {
          for(var i = 0; i < list.length; i++) {
            list[i].displayName = name;
            list[i].photoURL = photoURL;
            list.$save(i);
          }
        })
        .catch(function(error) {
          console.log("Error: ", error);
        });
    }

    $scope.findUsers = function(name, photoURL) {
      var currRef = firebase.database().ref('/user/');
      var list = $firebaseArray(currRef);
      list.$loaded()
        .then(function() {
          for(var i = 0; i < list.length; i++) {
            $scope.updateReviews(list[i].$id, name, photoURL);
            // TODO: $scope.updateChats(list[i].$id, name, photoURL);
          }
        })
        .catch(function(error) {
          console.log("Error: ", error);
        });
    }

    $scope.updateReviews = function(id, name, photoURL) {
      var currRef = firebase.database().ref('/user/' + id + '/reviews/');
      var query = currRef.orderByChild("uid").equalTo($rootScope.user.uid);
      var list = $firebaseArray(query);
      list.$loaded()
        .then(function() {
          for(var i = 0; i < list.length; i++) {
            list[i].displayName = name;
            list[i].photoURL = photoURL;
            list.$save(i);
          }
        })
        .catch(function(error) {
          console.log("Error: ", error);
        });
    }

    $scope.onSaveChanges = function() {
      var name = document.getElementById("myName-textarea").value;
      var photoURL = $rootScope.images[$rootScope.images.length - 1];
      $rootScope.user.updateProfile({
        displayName: name,
        photoURL: photoURL
      }).then(function() {
        // Update user data
        firebase.database().ref('/user/' + $rootScope.user.uid).update({"displayName": name});
        firebase.database().ref('/user/' + $rootScope.user.uid).update({"photoURL": photoURL});

        // Update posts
        $scope.updatePosts(name, photoURL);

        // Update reviews TODO: and chats (called at the end of findUsers)
        $scope.findUsers(name, photoURL);

        console.log("Update queued");
        $rootScope.images = []; // Empty images
      }).catch(function(error) {
        alert(error.message);
        console.log(error);
      })
      $rootScope.images = []; // Empty images
    };

//    $scope.user = firebase.auth().currentUser;
//
//    var ref = firebase.database().ref('/user/' + user.uid)
//    ref.once("value")
//      .then(function(snapshot) {
//        var hasName = snapshot.hasChild("reviews"); // true
//    });
//
//    if (hasName){
//       var reviewsRef = firebase.database().ref('/user/reviews');
//       $scope.myReviewsList = $firebaseArray(reviewsRef);
//    }

    $scope.goToUser = function(review) {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('app.userProfile', {
        'uid': review.uid,
        'displayName': review.displayName,
        'email': review.email,
        'photoURL': review.photoURL
      });
    }

    $scope.$on('$ionicView.beforeLeave', function() {
      $rootScope.images = [];
    });
  })

  .controller('UserProfileCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Review, $stateParams, $firebaseArray) {
    $scope.user = firebase.auth().currentUser;

    var reviewsRef = firebase.database().ref('/user/' + $stateParams.uid + '/reviews/');
    $scope.userReviewsList = $firebaseArray(reviewsRef);

    $scope.uid = $stateParams.uid;
    $scope.displayName = $stateParams.displayName;
    $scope.email = $stateParams.email;
    $scope.photoURL = $stateParams.photoURL;
    $scope.ratingTotal = 0.0;
    $scope.ratingCount = 0.0;
    $scope.ratingAve = 0;

    $scope.userReviewsList.$loaded()
      .then(function(){
        angular.forEach($scope.userReviewsList, function(review) {
          $scope.ratingTotal += parseFloat(review.rating);
          $scope.ratingCount++;
        });

        $scope.ratingAve = $scope.ratingTotal / $scope.ratingCount;
      });

    $scope.onMessage = function() {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('app.chatUser', {
        'uid': $scope.uid,
        'displayName': $scope.displayName,
        'email': $scope.email,
        'photoURL': $scope.photoURL
      });
    };

    $scope.rating = "0";

    $scope.doReview = function() {
      var textarea = document.getElementById("reviewMessage");
      var reviewMessage = textarea.value;
      var currentdate = new Date();
      if(reviewMessage !== "" && $scope.rating !== "0") {
        console.log('Doing review');
        var reviewFolder = '/user/' + $stateParams.uid + '/reviews/'
          + (Math.round(currentdate.getTime() / 1000)).toString();
        firebase.database().ref(reviewFolder).set(
          {
            uid: $scope.user.uid,
            displayName: $scope.user.displayName,
            email: $scope.user.email,
            photoURL: $scope.user.photoURL,
            time: currentdate.toLocaleString(),
            message: reviewMessage,
            rating: $scope.rating
          });
        console.log("Review successfully stored");
        textarea.value = "";
        alert("Success!");
        $scope.rating = "0";
        $state.go($state.current, {}, {reload: true});
      }
      else {
        alert("Text box must contain input in order to submit.");
      }
    };

    $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });

    $scope.goToUser = function(review) {
      if(review.uid === $scope.user.uid) {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go('app.myProfile');
      }
      else {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go('app.userProfile', {
          'uid': review.uid,
          'displayName': review.displayName,
          'email': review.email,
          'photoURL': review.photoURL
        });
      }
    }

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
          $rootScope.images = []; //Reset images array to be empty
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

  .controller('HomeCtrl', function($rootScope, $scope, $state, $firebaseArray, $ionicViewSwitcher) {
    $rootScope.user = firebase.auth().currentUser;
    $rootScope.images = [];

    var postsRef = firebase.database().ref('/posts/');
    $scope.postsList = $firebaseArray(postsRef);

    $scope.doPost = function() {
      $rootScope.user = firebase.auth().currentUser;
      var textarea = document.getElementById("postMessage");
      var postMessage = textarea.value;
      var currentdate = new Date();
      if(postMessage !== "") {
        console.log('Doing post');
        var postFolder = '/posts/'
          + (Math.round(currentdate.getTime() / 1000)).toString();
        firebase.database().ref(postFolder).set(
          {
            uid: $rootScope.user.uid,
            displayName: $rootScope.user.displayName,
            email: $rootScope.user.email,
            photoURL: $rootScope.user.photoURL,
            time: currentdate.toLocaleString(),
            message: postMessage,
            images: JSON.stringify($rootScope.images)
          });
        console.log("Post successfully stored");
        $rootScope.images = []; //Reset images array to be empty
        textarea.value = "";
        alert("Success!");
        $state.go($state.current, {}, {reload: true});
      }
      else {
        alert("Text box must contain input in order to post.");
      }
    };

    $scope.parseJSON = function(raw) {
      return JSON.parse(raw);
    };

    $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });

    $scope.goToUser = function(post) {
      if(post.uid === $scope.user.uid) {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go('app.myProfile');
      }
      else {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go('app.userProfile', {
          'uid': post.uid,
          'displayName': post.displayName,
          'email': post.email,
          'photoURL': post.photoURL
        });
      }
    };

    $scope.$on('$ionicView.beforeLeave', function() {
      $rootScope.images = [];
    });
  })

  .controller('ImageCtrl', function($rootScope, $scope, $cordovaCamera, $cordovaFile) {
    //The scope array is used for our ng-repeat to store the links to the images
    //$rootScope.images = [];

    $scope.addImage = function() {
      // The options array is passed to the cordovaCamera with specific options.
      // For more options see the official docs for cordova camera.
      var options = {
        quality: 50,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: navigator.camera.EncodingType.JPEG,
        targetWidth: 640,
        targetHeight: 640,
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
    };
  })
;
