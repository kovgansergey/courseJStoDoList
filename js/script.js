'use strict';

class ToDo {
  constructor(form, input, todoList, todoCompleted, todoContainer) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoContainer = document.querySelector(todoContainer);
    this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
  }

  addToStorage() {
    localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }

  createItem(item) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = item.key;
    li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${item.value}</span>
      <div class="todo-buttons">
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `);

    if (item.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(event) {
    event.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.input.value = '';
      this.render();
    } else {
      alert('Пустое дело добавить нельзя!');
    }
  }

  generateKey() {
    return Math.random().toString(16).substring(2, 15) + Math.random().toString(16).substring(2, 15);
  }

  deleteItem(item) {
    this.todoData.delete(item.key);
    this.render();
  }

  completedItem(item) {
    this.todoData.get(item.key).completed = !this.todoData.get(item.key).completed;
    this.render();
  }

  handler() {
    this.todoContainer.addEventListener('click', event => {
      const target = event.target;

      if (target.classList.contains('todo-complete')) {
        this.completedItem(target.closest('li'));
      }

      if (target.classList.contains('todo-remove')) {
        this.deleteItem(target.closest('li'));
      }
    });
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
    this.handler();
  }
}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

todo.init();