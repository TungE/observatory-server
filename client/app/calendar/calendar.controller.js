'use strict';

angular.module('observatory3App')
.controller('CalendarCtrl', function ($scope, $stateParams, $http, Auth, User, Smallgroup, $location, notify) {
  $scope.allUsers = User.query();
  $scope.isMentor = Auth.isMentor;

  var loadSmallGroup = function (callback) {
    callback = callback || function () {};
    return User.smallgroup()
      .$promise.then(function(smallgroup){
        $scope.smallgroup = smallgroup;
        if (!$scope.smallgroup._id) {
          $scope.smallgroup = false;
          return false;
        }
        return $http.get('/api/calendar/' + $scope.smallgroup._id + '/members').success(function (members) {
          $scope.leaders = [];
          $scope.members = [];
          members.sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            } else if (a.name > b.name) {
              return 1;
            } else {
              return 0;
            }
          });
          for (var person = 0; person < members.length; person++)
          {
            if (members[person].role === 'admin' || members[person].role === 'mentor')
            {
              $scope.leaders.push(members[person]);
            } else
            {
              $scope.members.push(members[person]);
            }
          }
          callback(smallgroup);
        });
      });
  };
})
.directive('hname', function () {
  return {
    restrict: 'E',
  };
});
