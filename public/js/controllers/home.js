angular.module('timmisNames')
	.controller('HomeCtrl', function ($scope, $auth, $alert) {
		$scope.isAuthenticated = function() {
			return $auth.isAuthenticated();
		};
		
		$scope.todos = [];



		$scope.addTodo = function (todo){
			if (todo.text==='') {return;}		
			
			$scope.todos.push({
				text: todo.text, 
				importance: 0
			});
			//resets the form 
			todo.text = '';
		};


	});

