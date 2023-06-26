// DOM Elements
const todoForm = document.querySelector("#todo-form");

const todoList = document.querySelector(".todos");

const totalTasks = document.querySelector("#total-tasks");

const completedTasks = document.querySelector("#completed-tasks");

const remainingTasks = document.querySelector("#remaining-tasks");

const mainInput = document.querySelector("#todo-form input");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// for when page is reload then show from localstorage
if(localStorage.getItem('tasks')) {
    tasks.map((task)=> {
        createTask(task);
    })
}

// Extracting the input value and sending to create task function
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = mainInput.value;

  if (inputValue == "") return;

  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isCompleted: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  createTask(task);
  mainInput.value = '';
});


// Create A New TODO Task
function createTask(task) {
  const taskEl = document.createElement("li");

  taskEl.setAttribute('id', task.id);

  if(task.isCompleted) {
    taskEl.classList.add('complete');
  }

  const taskElMarkup = `
    <div>
      <input type="checkbox" id="${task.id}" name="tasks" ${task.isCompleted ? "checked" : ""}/>
      <span ${!task.isCompleted ? 'contenteditable': ''}>${task.name}</span>
    </div>

    <button title="Remove the "${task.name}" task" class="remove-task">
    <i class="fa-regular fa-circle-xmark"></i>
    </button>
    `;

    taskEl.innerHTML = taskElMarkup;

    todoList.appendChild(taskEl);
    countTasks();
};

// for reomove task form todolist
todoList.addEventListener('click', (e)=> {
    if(e.target.classList.contains('remove-task') || e.target.parentElement.classList.contains('remove-task') || e.target.parentElement.parentElement.classList.contains('remove-task')) {
        const taskId = e.target.closest('li').id;

        removeTask(taskId);
    }
})



function countTasks() {
    const completedTasksArray = tasks.filter((task)=> task.isCompleted === true)

    totalTasks.textContent = tasks.length;

    completedTasks.textContent = completedTasksArray.length;

    remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

// remove Task Function
function removeTask(taskId) {
    tasks = tasks.filter((task)=> task.id !== parseInt(taskId))

    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById(taskId).remove();

    countTasks();
}

// updating task in todo list
todoList.addEventListener('input', (e)=> {
    const taskId = e.target.closest('li').id;
    console.log(taskId)
    updateTask(taskId, e.target);
})

function updateTask(taskId, el) {
    const task =  tasks.find((task)=> task.id === parseInt(taskId));

    if(el.hasAttribute('contenteditable')) {
        task.name = el.textContent;
    }else {
        const span = el.nextElementSibling;
        const parent = el.closest('li');

        task.isCompleted = !task.isCompleted;

        if(task.isCompleted) {
            span.removeAttribute('contenteditable');
            parent.classList.add('complete');
        } else {
            span.setAttribute('contenteditable', 'true');
            parent.classList.remove('complete')
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));

    countTasks();
}