angular.module('timmisNames')
	.controller('ProfileCtrl', function($scope, $auth, $alert, Account) {
		/*
		*Get user's profile info
		*/
		Account.getProfile()
			.success(function (data) {
				$scope.user = data;
			})
			.error(function () {
				$alert({
					content: 'Unable to get user info',
					animation: 'fadeZoomFadeDown',
					type: 'material',
					duration: 3
				});
			});
		$scope.updateProfile = function() {
			Account.updateProfile({
				displayName: $scope.user.displayName,
				email: $scope.user.email
			}).then(function() {
				$alert({
					content: 'Profile has been updated',
					animation: 'fadeZoomFadeDown',
					type: 'material',
					duration: 3
				});
			});
		};
	});