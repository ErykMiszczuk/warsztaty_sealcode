const express = require('express')
const app = express()
const bodyParser = require('body-parser')

var todos = [
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
	done: true,
},
{
	id: "3",
	category: "Zlecenia",
	title: "Przynieść Gnarowi 10 wilczych skór",
	content: "Ork kolekcjonuje skóry i skupuje każde ilości. Chętnie kupi 10 skór -Zdobądź 10 wilczych skór -Sprzedaj skory Gnarowi",
	done: true,
}
]

app.use(bodyParser.urlencoded({extended: true}))

app.get('/api/todos', function(req, res) {
  res.status(200).send(todos)
})

app.get('/api/todos/:id', function(req, res) {
  res.status(200).send(todos.find(function(todo){
    return todo.id == req.params.id
  }))
})

app.post('/api/todos/', function(req, res) {
  //var id = Date.now()
  var todo = {
    id: Date.now();
    category: "Glowne",
    title: "Alan add details",
    content: "Alan add details",
    done: false,
  }
  todos.push(todo)
  res.status(201).send(`/api/todos/${id}`)
})

app.delete('/api/todos/:id', function(req, res) {
  var objectDeleteIndex = todos.findIndex(function(todo){
    return todo.id == req.params.id
  })
  todos.splice(objectDeleteIndex, 1)
  res.status(200).send();
})

app.patch('api/todos/:id', function(req, res) {
  console.log('Patch');
  res.status(404).send()
})

app.listen(3000, function() {
  console.log('App listening on port 3000')
})

/*
tworzenie, usuwanie, wyświetlanie zadań
*/
