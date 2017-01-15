const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

// Zadania w zewnętrznym pliku - notacja z kropką i ukośnikiem obowiązkowe
var todos = require('./todos.js')

app.use(bodyParser.urlencoded({extended: true}))

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.sendFile('index.html')
})

app.get('/api/todos', function(req, res) {
  res.status(200).send(todos)
})

app.get('/api/todos/:id', function(req, res) {
  res.status(200).send(todos.find(function(todo){
    return todo.id == req.params.id
  }))
})

app.post('/api/todos/:id/:title', function(req, res) {
	// TODO: Another way to generate id, because none of next comented lines works
  //var id = Date.now()
	// function genId() {
	// 	return Date.now()
	// }
	// var gen_id = genId()
	var title = req.params.title
	var id = req.params.id
  var todo = {
    id: id,
    category: "Glowne",
    title: title,
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
