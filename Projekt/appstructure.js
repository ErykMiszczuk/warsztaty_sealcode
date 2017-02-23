const rest = require('qwest')

console.log("rest")
rest.get('/api/todos')
    .then(function(xhr, response) {
			console.log(response)
			console.table(response)
			render(response)
    })

//render(tasks)

function render(todos) {
	console.log('Get todos')
        todos.forEach(function(todo){
					console.log('Gen task')
          var container = document.querySelector(".main_quests_details")
          var box = document.createElement("li")
          var header = document.createElement("header")
          var title = document.createElement("h1")
					var content = document.createElement("p")
					var doneTask = document.createElement("input")
          var deleteTask = document.createElement("button")
          var moveTask = document.createElement("button")
          var editTask = document.createElement("button")
          var taskOptions  = document.createElement("div")
          taskOptions.appendChild(moveTask)
          taskOptions.appendChild(deleteTask)
          taskOptions.appendChild(editTask)
          title.textContent = todo.title
					content.textContent = todo.content
          header.appendChild(title)
					box.appendChild(header)
					box.appendChild(content)
					box.appendChild(taskOptions)
          container.appendChild(box)
					console.log('Render task')
        })
      }
      //render();
