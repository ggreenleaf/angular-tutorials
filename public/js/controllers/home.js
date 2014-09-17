angular.module('timmisNames')
	.controller('HomeCtrl', function ($scope, $auth, $alert, $http) {
		
		$scope.isAuthenticated = function() {
			return $auth.isAuthenticated();
		};
					
		$http.get('/api/todos')
			.success(function (data) {
				$scope.todos = data;
				$scope.text = '';
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

		$scope.addTodo = function (todo) {
			console.log(todo.text);
			if (todo.text === '' || todo.text === undefined) {return; }
			
			$http.post('/api/todos', todo)
			.success(function (data) {
				todo.text = ''; //clear the form
				$scope.todos = data;
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

		$scope.incrementUpvotes = function (id) {
			$http.put('/api/todos/upvote/'+id)
				.success(function (data) {
					$scope.todos = data;
				})
				.error(function (data) {
					console.log('Error: ' +data);
				});
		}
	});

