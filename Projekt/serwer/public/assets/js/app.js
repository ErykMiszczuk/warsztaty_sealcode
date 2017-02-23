const rest = require('qwest')

// console.log("rest")
rest.get('/api/todos')
    .then(function(xhr, response) {
			// console.log(response)
			// console.table(response)
			render(response)
    })

// render(tasks)

function render(todos) {
	console.log('Get todos')
        todos.forEach(function(todo){
					console.log('Gen task')
          // Dodanie questa do małej listy
          var catClass = ".cat_"+todo.category
          console.log(catClass)
          var listCat = document.querySelector(catClass)
          console.log('Category found')
          var liel = document.createElement("li")
          console.log('element created')
          liel.textContent = todo.title
          console.log('nice title added')
          listCat.appendChild(liel)
          console.log("Render list")
          // Box szczegółów questa
          var container = document.querySelector(".main_quests_details")
          // Element zawierający zadanie
          var box = document.createElement("li")
          var header = document.createElement("header")
          var title = document.createElement("h1")
					var content = document.createElement("p")
					var doneTask = document.createElement("input")
          var deleteTask = document.createElement("button")
          deleteTask.textContent = "Usuń Zadanie"
          var moveTask = document.createElement("button")
          moveTask.textContent = "Przenieś Zadanie"
          var editTask = document.createElement("button")
          editTask.textContent = "Edytuj Zadanie"
          var taskOptions  = document.createElement("div")
          console.log("Add classes");
          taskOptions.setAttribute("class", "quest_details_options")
          console.log("break");
          // Opcje dotyczące zadania
          taskOptions.appendChild(moveTask)
          taskOptions.appendChild(deleteTask)
          taskOptions.appendChild(editTask)
          title.textContent = todo.title
					content.textContent = todo.content
          console.log("Add text");
          header.appendChild(title)
					box.appendChild(header)
					box.appendChild(content)
					box.appendChild(taskOptions)
          container.appendChild(box)
					console.log('Render task')
        })
      }
      //render();
