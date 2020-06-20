'use strict';

const todoControl = document.querySelector('.todo-control');
const headerInput = document.querySelector('.header-input');
const todoList = document.querySelector('.todo-list');
const todoCompleted = document.querySelector('.todo-completed');
let todoData;
let json = localStorage.getItem('todoData');

if (!json) {
  todoData = [];
} else {
  todoData = JSON.parse(json);
}

function render() {
  todoList.textContent = '';
  todoCompleted.textContent = '';

  todoData.forEach(function(item) {
    const li = document.createElement('li');
    li.classList.add('todo-item');

    li.innerHTML = '<span class="text-todo">' + item.value + '</span>' +
        '<div class="todo-buttons">' +
        '<button class="todo-remove"></button>' +
        '<button class="todo-complete"></button>' +
        '</div>';

        if (item.completed) {
          todoCompleted.append(li);
        } else {
          todoList.append(li);
        }

        const todoCompleteBtn = li.querySelector('.todo-complete');
        todoCompleteBtn.addEventListener('click', function() {
          item.completed = !item.completed;
          render();
        });

        const todoRemoveBtn = li.querySelector('.todo-remove');
        todoRemoveBtn.addEventListener('click', function() {
          let pos = todoData.indexOf(item);
          todoData.splice(pos, 1);
          render();
        });
  });
  
  json = JSON.stringify(todoData);
  localStorage.setItem('todoData', json);
}

todoControl.addEventListener('submit', function(event) {
  event.preventDefault();

  if (headerInput.value.trim() === '') {
    alert('Заполните поле!');
    return;
  }

  const newTodo = {
    value: headerInput.value,
    completed: false
  };

  todoData.push(newTodo);

  headerInput.value = '';

  render();
});

render();