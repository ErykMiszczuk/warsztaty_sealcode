const rest = require('qwest')

console.log("rest")
rest.get('/api/todos')
    .then(function(xhr, response) {
			console.log(response)
			console.table(response)
			render(response)
    })
		
		var tasks = [
{
	id: "1",
	category: "Glowne",
	title: "Przynieść Gnarowi 10 wilczych skór",
	content: "Ork kolekcjonuje skóry i skupuje każde ilości. Chętnie kupi 10 skór -Zdobądź 10 wilczych skór -Sprzedaj skory Gnarowi",
	done: true,
},
{
	id: "2",
	category: "Poboczne",
	title: "Mięso dla ekipy",
	content: "Ork kolekcjonuje skóry i skupuje każde ilości. Chętnie kupi 10 skór -Zdobądź 10 wilczych skór -Sprzedaj skory Gnarowi",
	done: false,
},
{
	id: "3",
	category: "Zlecenia",
	title: "Przynieść Gnarowi 10 wilczych skór",
	content: "Ork kolekcjonuje skóry i skupuje każde ilości. Chętnie kupi 10 skór -Zdobądź 10 wilczych skór -Sprzedaj skory Gnarowi",
	done: true,
}
]

//render(tasks)

function render(todos) {
	console.log('Get todos')
        todos.forEach(function(todo){
					console.log('Gen task')
          var container = document.querySelector("#render")
          var box = document.createElement("div")
          var title = document.createElement("h2")
					var content = document.createElement("p")
					var doneTask = document.createElement("<input type")
          title.textContent = todo.title
					content.textContent = todo.content
          box.appendChild(title)
					box.appendChild(content)
          container.appendChild(box)
					console.log('Render task')
        })
      }
      //render();
