// Extarcting DOM Elements in Variables
const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("#total-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const remainingTasks = document.querySelector("#remaining-tasks");
const mainInput = document.querySelector("#todo-form input");
const completeAllTasks = document.querySelector("#complete-all-tasks");
const clearAll = document.querySelector("#clear-all");

// Creating tasks  Array or object for Storing TODO Tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// for when page is reload then show from localstorage
if (localStorage.getItem("tasks")) {
  tasks.map((task) => {
    createTask(task);
  });
}

// Extracting the input value and sending to createTask function
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = mainInput.value;

  if (inputValue == "") return;

  // Creating task Object with id , ID which is using dateTime function
  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isCompleted: false,
  };

  // Pushing in tasks Array and Store in LOCAL STORAGE
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  createTask(task);
  mainInput.value = "";
});

// Create A New TODO Task Function
function createTask(task) {
  const taskEl = document.createElement("li"); // Creating Li for storing TODO Task

  taskEl.setAttribute("id", task.id); // setting id of li from task object

  if (task.isCompleted) {
    // when task is Complete then add class which name is Complete
    taskEl.classList.add("complete");
  }

  // Creating all HTML to show TODO Task
  const taskElMarkup = `
    <div>
      <input type="checkbox" id="${task.id}" name="tasks" ${
    task.isCompleted ? "checked" : ""
  }/>
      <span ${!task.isCompleted ? "contenteditable" : ""}>${task.name}</span>
    </div>

    <button title="Remove the "${task.name}" task" class="remove-task">
    <i class="fa-regular fa-circle-xmark"></i>
    </button>
    `;

  taskEl.innerHTML = taskElMarkup;

  todoList.appendChild(taskEl); // Pushing in ul
  countTasks(); // Counting the tasks
}

// For reomove task form TODO list
todoList.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("remove-task") ||
    e.target.parentElement.classList.contains("remove-task") ||
    e.target.parentElement.parentElement.classList.contains("remove-task")
  ) {
    const taskId = e.target.closest("li").id;

    removeTask(taskId);
  }
});

// Remove TODO Task Function
function removeTask(taskId) {
  // here filter out element which is not same with ID
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));

  // Update local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Remove element from DOM
  document.getElementById(taskId).remove();

  countTasks();
}

// Updating TODO Task  Function
todoList.addEventListener("input", (e) => {
  // console.log(e);
  const taskId = e.target.closest("li").id;
  // console.log(taskId)
  updateTask(taskId, e.target);
});

// Updating TODO task and check box toggle Function
function updateTask(taskId, el) {
  // console.log(el);
  // Finding the id from tasks arrays
  const task = tasks.find((task) => task.id === parseInt(taskId));

  // here check element has Attribute which name is contentEditable then edit the task value
  if (el.hasAttribute("contenteditable")) {
    task.name = el.textContent;
  } else {
    const span = el.nextElementSibling;
    const parent = el.closest("li"); // extarcting LI DOM
    // console.log(parent)

    task.isCompleted = !task.isCompleted;

    if (task.isCompleted) {
      // when isCompletd true the remove edit todo task and add complete class otherwise using viceversa
      span.removeAttribute("contenteditable");
      parent.classList.add("complete");
    } else {
      span.setAttribute("contenteditable", "true");
      parent.classList.remove("complete");
    }
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  countTasks();
}

// Counting all Remaining , Completed and Total task
function countTasks() {
  const completedTasksArray = tasks.filter((task) => task.isCompleted === true);

  totalTasks.textContent = tasks.length;

  completedTasks.textContent = completedTasksArray.length;

  remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

// Complete all task from one button
completeAllTasks.addEventListener("click", () => {
  tasks.map((task) => {
    const taskId = task.id;
    const li = document.getElementById(`${taskId}`);
    li.classList.add("complete");
    const checkbox = li.querySelector('input[type="checkbox"]');
    // console.log(checkbox)
    task.isCompleted = true;

    checkbox.checked = true;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  countTasks();
});

// Clear all from one Button
clearAll.addEventListener("click", () => {
  tasks.map((task) => {
    const taskId = task.id;
    const li = document.getElementById(`${taskId}`);
    li.remove();
  });

  tasks = [];

  localStorage.setItem("tasks", JSON.stringify(tasks));

  countTasks();
});
