import { saveToLocalStorage, loadFromLocalStorage } from "./localstorage.js";

const inputAddTask = document.querySelector(".header__input-add"),
	  buttonAddTask = document.querySelector(".header__button-add"),
	  todoList = document.querySelector(".todo-list"),
	  noneTask = document.querySelector(".no-task"),
	  buttonEvenTasks = document.querySelector(".js-even"),
	  buttonOddTasks = document.querySelector(".js-odd"),
	  buttonDeleteFirstTask = document.querySelector(".js-first"),
	  buttonDeleteLastTask = document.querySelector(".js-last");

let   labelId; //id для кастомного checkbox, для правильного complete задачи
	  
//Если список пуст, выводится сообщение
function isListEmpty() { 
	if (todoList.querySelector("li") !== null) {
		noneTask.classList.add("none-visible");
	} else {
		if (noneTask.classList.contains("none-visible")) {
			noneTask.classList.remove("none-visible");
			localStorage.setItem("labelId", "0"); //переменная с id для кастомного checkbox сбрасывается
		}
	}
}

function getTaskName() {
	return inputAddTask.value;
}

function renderListElement() {
	const taskLi = document.createElement("li");
	todoList.appendChild(taskLi);
	const taskParagraph = document.createElement("p");
	taskLi.appendChild(taskParagraph);
	const buttonContainer = document.createElement("div");
	taskLi.appendChild(buttonContainer);
	const buttonDone = document.createElement("input");
	buttonContainer.appendChild(buttonDone);

	buttonDone.setAttribute("type", "checkbox");
	buttonDone.setAttribute("id", `functional-checkbox-${++labelId}`);
	localStorage.setItem("labelId", JSON.stringify(labelId));
	const customButtonDone = document.createElement("label");
	buttonContainer.appendChild(customButtonDone);
	customButtonDone.setAttribute("for", `functional-checkbox-${labelId}`);
	const buttonDelete = document.createElement("button");
	buttonContainer.appendChild(buttonDelete);
	taskLi.setAttribute("class", "todo-list__element add-task");
	taskParagraph.setAttribute("class", "todo-list__element__paragraph");
	buttonContainer.setAttribute("class", "todo-list__element__functional-container");
	customButtonDone.setAttribute("class", "todo-list__element__button green")
	buttonDelete.setAttribute("class", "todo-list__element__button red");

	taskParagraph.textContent = getTaskName();
	inputAddTask.value = "";
	customButtonDone.innerHTML = "&#128504;";
	buttonDone.addEventListener("change", doneTask);
	buttonDelete.textContent = "X";
	buttonDelete.addEventListener("click", deleteTask);
	console.log("New task added!");
}

function addTaskInList() {
	if (inputAddTask.value !== "") {
		renderListElement();
		isListEmpty();
		const arrayOfTasks = todoList.querySelectorAll(".todo-list__element");
		//задачи, которые помечены complete остаются всегда внизу списка
		for (let i = arrayOfTasks.length - 2; i >= 0; i--) {
			if (arrayOfTasks[i].querySelector("input[type='checkbox']").checked) {
				const tmp = arrayOfTasks[i];
				arrayOfTasks[i].parentNode.removeChild(arrayOfTasks[i]);
				todoList.appendChild(tmp);
			} else {
				break;
			}
		}
		
		saveToLocalStorage(); //функция сохранения в локальное хранилище (повторяется в других функциях)
		
	} else {
		inputAddTask.placeholder = "Введите имя задачи!";
		buttonAddTask.classList.add("block")
		setTimeout(() => {
			inputAddTask.placeholder = "Новая задача";
			buttonAddTask.classList.remove("block")
		}, 2000)
	} //Если не введено имя задачи - показывается визуальное сообщение
}

export function deleteTask(event) {
	const childButton = event.target;
	const childContainer = childButton.parentNode;
	const currentLi = childContainer.parentNode;
	todoList.removeChild(currentLi);
	isListEmpty();
	saveToLocalStorage();
}

export function doneTask(event) {
	const arrayOfTasks = todoList.querySelectorAll(".todo-list__element");
	const childButton = event.target;
	const childContainer = childButton.parentNode;
	const currentLi = childContainer.parentNode;
	const funtionalButton = currentLi.querySelector(".green")
	const textTask = currentLi.querySelector(".todo-list__element__paragraph");
	if (childButton.checked) {
		textTask.style.textDecoration = "line-through";
		funtionalButton.innerHTML = "&#8593;"
		currentLi.style.opacity = "0.75";
		const tmp = currentLi;
		currentLi.parentNode.removeChild(currentLi);
		todoList.appendChild(tmp);
		currentLi.classList.remove("add-task");
		currentLi.classList.add("done-task");

		saveToLocalStorage();
	} else {
		textTask.style.textDecoration = "none";
		funtionalButton.innerHTML = "&#128504;"
		currentLi.style.opacity = "1";
		todoList.insertBefore(currentLi, todoList.firstChild);
		currentLi.classList.remove("done-task");
		currentLi.classList.add("add-task");

		saveToLocalStorage();
	}
}

function evenTasks() {
	const arrayOfTasks = todoList.querySelectorAll(".todo-list__element");
	for (let i = 0; i < arrayOfTasks.length; i++) {
		if ((i + 1) % 2 == 0) {
			arrayOfTasks[i].style.boxShadow = "0 0 2rem #cf7cff";
		} else {
			arrayOfTasks[i].style.boxShadow = "none";
		}
	}
}

function oddTasks() {
	const arrayOfTasks = todoList.querySelectorAll(".todo-list__element");
	for (let i = 0; i < arrayOfTasks.length; i++) {
		if ((i + 1) % 2 !== 0) {
			arrayOfTasks[i].style.boxShadow = "0 0 2rem #cf7cff";
		} else {
			arrayOfTasks[i].style.boxShadow = "none";
		}
	}
}

function deleteFirstTask() {
	const currentTask = todoList.querySelector(".todo-list__element");
	currentTask.parentNode.removeChild(currentTask);
	isListEmpty();
	saveToLocalStorage();
}

function deleteLastTask() {
	const arrayOfTasks = todoList.querySelectorAll(".todo-list__element");
	arrayOfTasks[0].parentNode.removeChild(arrayOfTasks[arrayOfTasks.length - 1])
	isListEmpty();
	saveToLocalStorage();
}

function main() {
	loadFromLocalStorage(); //выгрузка задач из локального хранилища

	const storedLabelId = localStorage.getItem("labelId");

	//Исправление бага, когда после выгрузки из localstorage задачи неправильно отмечаются complete
	if (storedLabelId !== null) {
		labelId = JSON.parse(storedLabelId);
	} else {
		labelId = 0;
	}

	isListEmpty();

	buttonAddTask.addEventListener("click", addTaskInList);
	buttonEvenTasks.addEventListener("click", evenTasks);
	buttonOddTasks.addEventListener("click", oddTasks);
	buttonDeleteFirstTask.addEventListener("click", deleteFirstTask);
	buttonDeleteLastTask.addEventListener("click", deleteLastTask);

	inputAddTask.addEventListener("keydown", function(event) {
  		if (event.key === "Enter") {
    		addTaskInList();
  		}
	}); //упрощение добавления задач в список через клавишу enter
}

main(); 
