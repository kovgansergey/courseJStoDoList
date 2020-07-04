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
        <button class="todo-edit"></button>
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

  hideItemAnimate(elem) {
    let coin = 0;

    requestAnimationFrame(function hiding() {
      elem.style.transform = `translateX(-${coin}%)`;

      if (coin < 111) {
        coin += 3;
        requestAnimationFrame(hiding);
      }
    });
  }

  emergenceItemAnimate(elem) {
    let coin = 111;

    requestAnimationFrame(function emergence() {
      elem.style.transform = `translateX(-${coin}%)`;

      if (coin > 0) {
        coin -= 3;
        requestAnimationFrame(emergence);
      }
    });
  }

  deleteItem(item) {
    this.hideItemAnimate(item);
    
    setTimeout(() => {
      this.todoData.delete(item.key);
      this.render();
    }, 673);
  }

  completedItem(item) {
    this.hideItemAnimate(item);

    setTimeout(() => {
      this.todoData.get(item.key).completed = !this.todoData.get(item.key).completed;
      this.render();
      
      const newItem = document.querySelectorAll('.todo-item');
      newItem.forEach(element => {
        if (element.key === item.key) {
          this.emergenceItemAnimate(element);
        }
      });
    }, 673);
  }

  editItem(item) {
    const changeText = () => {
      if (item.textContent.trim()) {
        this.todoData.get(item.key).value = item.textContent.trim();
        this.addToStorage();
        item.removeAttribute('contenteditable');
        item.removeEventListener('blur', changeText);
      } else {
        alert('Поле не должно быть пустым!');
        this.render();
      }
    };

    item.setAttribute('contenteditable', true);
    item.addEventListener('blur', changeText);
    item.focus();
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

      if (target.classList.contains('todo-edit')) {
        this.editItem(target.closest('li'));
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