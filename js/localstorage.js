import { doneTask, deleteTask} from "./main.js";

function saveToLocalStorage() { //сохранение в локальное хранилище
  const tasks = [];

  const arrayOfTasks = document.querySelectorAll(".todo-list__element");
  arrayOfTasks.forEach((task) => {
    const textTask = task.querySelector(".todo-list__element__paragraph").textContent;
    const isDone = task.querySelector("input[type='checkbox']").checked;
	const idValue = task.querySelector("input").getAttribute("id");
    tasks.push({
      text: textTask, //текст задачи
      done: isDone, //выполена ли задача?
	  id: idValue //id для кастомного checkbox
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadFromLocalStorage() { //рендер задач из локального хранилища
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    const tasks = JSON.parse(savedTasks);

    tasks.forEach((task) => {
    	const todoList = document.querySelector(".todo-list");
    	const taskLi = document.createElement("li");
    	const taskParagraph = document.createElement("p");
    	const buttonContainer = document.createElement("div");
    	const buttonDone = document.createElement("input");
    	const customButtonDone = document.createElement("label");
    	const buttonDelete = document.createElement("button");

    	taskLi.setAttribute("class", "todo-list__element");
    	taskParagraph.setAttribute("class", "todo-list__element__paragraph");
    	buttonContainer.setAttribute("class", "todo-list__element__functional-container");
		buttonDone.setAttribute("id", task.id);
    	customButtonDone.setAttribute("class", "todo-list__element__button green");
		customButtonDone.setAttribute("for", task.id);
    	buttonDelete.setAttribute("class", "todo-list__element__button red");

    	taskParagraph.textContent = task.text;
    	customButtonDone.innerHTML = "&#128504;";
    	buttonDone.type = "checkbox";
    	buttonDone.checked = task.done;

		if (task.done) {
        	taskParagraph.style.textDecoration = "line-through";
			taskLi.style.opacity = "0.75";
			customButtonDone.innerHTML = "&#8593;"
      	}

    	buttonDone.addEventListener("change", doneTask);
    	buttonDelete.textContent = "X";
    	buttonDelete.addEventListener("click", deleteTask);

    	buttonContainer.appendChild(buttonDone);
    	buttonContainer.appendChild(customButtonDone);
    	buttonContainer.appendChild(buttonDelete);

    	taskLi.appendChild(taskParagraph);
    	taskLi.appendChild(buttonContainer);

    	todoList.appendChild(taskLi);
    });
  }
}

export { saveToLocalStorage, loadFromLocalStorage };