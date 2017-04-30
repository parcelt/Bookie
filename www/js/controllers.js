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
    $scope.loginData.email="zkocken@wisc.edu";
    $scope.loginData.password="bookie";

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
              photoURL: "http://i.ebayimg.com/images/g/aJUAAOSwT6pVw1wO/s-l300.jpg"
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
    $scope.images = [];
    var location = '/posts/' + $stateParams.key;
    firebase.database().ref(location).once("value", function(snap) {
      if(snap.val() != null) $scope.post = snap.val();
      $scope.images = $scope.parseJSON($scope.post.images);
      document.getElementById("editMessage").style.height = 'auto';
      document.getElementById("editMessage").style.height = (this.scrollHeight) + 'px';
      $state.go($state.current, {}, {reload: true});
      console.log("num images: " + $scope.images.length);
    });

    $scope.$watch(function() {
      return $rootScope.images;
    }, function() {
      $scope.images = $scope.images.concat($rootScope.images);
      $rootScope.images = [];
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
            images: JSON.stringify($scope.images)
          });
        console.log("Post successfully stored");
        $scope.images = []; //Reset images array to be empty
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
      $scope.images = [];
      $scope.onSaveChanges();
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
  })

  .controller('MyProfileCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Review, $firebaseArray) {

    // It seems we'll have to track total rating and count of ratings to compute the average, since nothing I've tried
    // works for getting the size of a dictionary. ANSWER: .length

    var reviewsRef = firebase.database().ref('/user/' + $rootScope.user.uid + '/reviews/');
    $scope.myReviewsList = $firebaseArray(reviewsRef);

    $scope.name = $rootScope.user.displayName;
    $scope.photo = $rootScope.user.photoURL;
    $scope.ratingTotal = 0.0;
    $scope.ratingCount = 0.0;
    $scope.ratingAve = 0;

    $scope.$watch(function() {
      return $rootScope.images;
    }, function() {
      $scope.photo = $rootScope.images[0];
      $rootScope.images = [];
    });

    $scope.init = function() {
      angular.forEach($scope.myReviewsList, function(review) {
        $scope.ratingTotal += parseFloat(review.rating, 10);
        $scope.ratingCount++;
      });

      $scope.ratingAve = $scope.ratingTotal / $scope.ratingCount;
    };
    $scope.myReviewsList.$loaded()
      .then(function(){
        if($scope.myReviewsList.length) $scope.init();
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
      var photoURL = $scope.photo;
      $rootScope.user.updateProfile({
        displayName: name,
        photoURL: photoURL
      }).then(function() {
        // Update user data
        firebase.database().ref('/user/' + $rootScope.user.uid).update({"displayName": name});
        firebase.database().ref('/user/' + $rootScope.user.uid).update({"photoURL": photoURL});

        // Update posts
        $scope.updatePosts(name, photoURL);

        // Update reviews TODO: and chats
        $scope.findUsers(name, photoURL);

        console.log("Update queued");
      }).catch(function(error) {
        alert(error.message);
        console.log(error);
      })
    }

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

  })

  .controller('UserProfileCtrl', function($rootScope, $scope, $ionicViewSwitcher, $state, Review, $stateParams, $firebaseArray) {
    // It seems we'll have to track total rating and count of ratings to compute the average, since nothing I've tried
    // works for getting the size of a dictionary.
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

    $scope.init = function() {
      angular.forEach($scope.userReviewsList, function(review) {
        $scope.ratingTotal += parseFloat(review.rating, 10);
        $scope.ratingCount++;
      });

      $scope.ratingAve = $scope.ratingTotal / $scope.ratingCount;
    };
    $scope.userReviewsList.$loaded()
      .then(function(){
        if($scope.userReviewsList.length) $scope.init();
      });

    $scope.onMessage = function() {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('app.chatUser', {
        'user': $scope.name
      });
    };

    $scope.onLeaveReview = function() {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('app.review', {
        'user': $scope.name
      });
    }

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
    }

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
        encodingType: navigator.camera.EncodingType.PNG,
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
