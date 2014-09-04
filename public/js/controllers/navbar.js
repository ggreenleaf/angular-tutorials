angular.module('timmisNames')
	.controller('NavbarCtrl', function($scope, $auth) {
		$scope.isAuthenticated = function() {
			return $auth.isAuthenticated();
		};
	});