angular.module('timmisNames', ['ngResource', 'ngMessages', 'ngRoute', 'satellizer', 'mgcrea.ngStrap'])
	.config(function ($routeProvider, $authProvider) {
		$routeProvider
			.when('/', {
				templateUrl: '../views/home.html'
			})
			.when('/login', {
				templateUrl: '../views/login.html',
				controller: 'LoginCtrl'
			})
			.when('/signup', {
				templateUrl: '../views/signup.html',
				controller: 'SignupCtrl'
			})
			.when('/logout', {
				template: null,
				controller: 'LogoutCtrl'
			})
			.when('/profile', {
				templateUrl: '../views/profile.html',
				controller: 'ProfileCtrl',
				resolve: {
					authenticated: ['$location', '$auth', function ($location, $auth) {
						if (!$auth.isAuthenticated()) {
							return $location.path('/login');
						}
					}]
				}
			})
			.otherwise({
				redirectTo: '/'
			});
			//Put 3rd party Auths Here
	});