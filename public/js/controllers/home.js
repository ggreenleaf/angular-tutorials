angular.module('timmisNames')
	.controller('HomeCtrl', function ($scope, $auth, $alert, $http) {
		
		$scope.isAuthenticated = function() {
			return $auth.isAuthenticated();
		};
					
		$http.get('/api/todos')
			.success(function (data) {
				$scope.todos = data;
				console.log(data);
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

		$scope.addTodo = function (todo) {
			$http.post('/api/todos', todo)
				.success(function (data) {
					todo.text = ''; //clear the form
					$scope.todos = data;
					console.log(data);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});	
		};

		$scope.deleteTodo = function (id) {
			$http.delete('/api/todos/'+id)
				.success(function (data) {
					$scope.todos = data;
				})
				.error(function (data) {
					console.log('Error: '+ data);
				});
		};

	});

