// Retrieve todo from local storage or initialize an empty array
// localStorage.setItem("listTodos", JSON.stringify({}));
let listTodos = JSON.parse(localStorage.getItem("listTodos")) || {};
let actualList = localStorage.getItem("actualList") || "";
let todo;
try {
    todo = JSON.parse(localStorage.getItem("listTodos"))[actualList] || [];
}
catch (e) {
    console.log(e);
    todo = [];
}
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const titleToDo = document.getElementById("titleToDo");

const addButton = document.getElementById("addButton");
const deleteButton = document.getElementById("deleteButton");
const backButton = document.getElementById("backButton");
const artistButton = document.getElementById("artist");


const newListButton = document.getElementById("newListButton");
const listOfTodosInput = document.getElementById("listOfTodosInput");
const addListOfTodosButton = document.getElementById("addListOfTodosButton");


// Initialize
document.addEventListener("DOMContentLoaded", function () {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevents default Enter key behavior
            addTask();
        }
    });

    addListOfTodosButton.addEventListener("click", addList);
    listOfTodosInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevents default Enter key behavior
            addList();
        }
    }
    );

    deleteButton.addEventListener("click", deleteAllTasks);
    backButton.addEventListener("click", changeDisplayElements);
    newListButton.addEventListener("click", changeDisplayForNewList);
    // artistButton.addEventListener("click", editArtist);
    

    displayTasks();
});

function changeDisplayForNewList(){
    document.getElementById("listOfTodos").style.display = "flex";
    document.getElementById("todo").style.display = "none";
}

function changeDisplayElements() {
    const displayElement = document.getElementById("additional-info");
    if (displayElement.style.display === "block") {
        displayElement.style.display = "none";
        document.getElementById("scroll").style.display = "block";
        document.getElementById("backButton").style.display = "none";
        
        
    }
    console.log("changed display");


}

function addTask() {
    const newTask = todoInput.value.trim();
    if (newTask !== "") {
        console.log(todo);
        todo.push({ song: newTask, disabled: false, artist: "", album: ""});
        saveToLocalStorage();
        todoInput.value = "";
        displayTasks();
    }
}


function addList() {
    const newTask = listOfTodosInput.value.trim();
    
    if (newTask !== "") {
        if (listTodos[newTask] === undefined) {
            listTodos[newTask] = [];
        }
        actualList = newTask;
        todo = listTodos[actualList];

        console.log("newTask", newTask);
        console.log(actualList);
        // localStorage.setItem("todo", JSON.stringify(listTodos[actualList]));
        saveListToLocalStorage();
        
        
        
        listOfTodosInput.value = "";
        

        displayTasks();


    }
}

function saveListToLocalStorage() {
    
    // 
    localStorage.setItem("todo", JSON.stringify(listTodos[actualList]));
    localStorage.setItem("actualList", actualList);
}

function displayTasks() {
    titleToDo.textContent = actualList;
    document.getElementById("listOfTodos").style.display = "none";
    document.getElementById("todo").style.display = "flex";

    console.log(listTodos);
    todoList.innerHTML = "";
    todo.forEach((item, index) => {
        const p = document.createElement("p");
        p.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item.disabled ? "checked" : ""
            }>
        <p id="todo-${index}" class="${item.disabled ? "disabled" : ""
            }" onclick="editTask(${index})">${item.song}</p>
      </div>
    `;
        p.querySelector(".todo-checkbox").addEventListener("change", () =>
            toggleTask(index)
        );
        todoList.appendChild(p);
    });
    todoCount.textContent = todo.length;
}

function editTask(index) {
    document.getElementById("additional-info").style.display = "block";
    document.getElementById("scroll").style.display = "none";
    document.getElementById("backButton").style.display = "block";

    document.getElementById("additional-info").innerHTML = `            
    <h3>Song Name</h3>
            <p id="song"></p>
            <h3>Artist</h3>
            <p id="artist"></p>
            <h3>Album</h3>
            <p id="album"></p>
                `;


    const existingName = todo[index].song;
    const existingArtist = todo[index].artist;
    const existingAlbum = todo[index].album;

    console.log(existingName, existingArtist, existingAlbum);

    const inputName = document.createElement("input");
    const inputArtist = document.createElement("input");
    const inputAlbum = document.createElement("input");
    
    inputName.value = existingName;
    inputArtist.value = existingArtist;
    inputAlbum.value = existingAlbum;

    
    const name = document.getElementById("song");
    const artist = document.getElementById("artist");
    const album = document.getElementById("album");
    
    
    name.replaceWith(inputName);
    album.replaceWith(inputAlbum);
    artist.replaceWith(inputArtist);



    inputAlbum.addEventListener("blur", function () {
        const updatedText = inputAlbum.value.trim();
        if (updatedText) {
            todo[index].album = updatedText;
            saveToLocalStorage();
        }
        displayTasks();
    }
    );

    inputArtist.addEventListener("blur", function () {
        const updatedText = inputArtist.value.trim();
        if (updatedText) {
            todo[index].artist = updatedText;
            saveToLocalStorage();
        }
        displayTasks();
    });

    inputName.addEventListener("blur", function () {
        const updatedText = inputName.value.trim();
        if (updatedText) {
            todo[index].song = updatedText;
            saveToLocalStorage();
        }
        displayTasks();
    });
}

function toggleTask(index) {
    todo[index].disabled = !todo[index].disabled;
    saveToLocalStorage();
    displayTasks();
}

function deleteAllTasks() {
    todo = [];
    listTodos[actualList] = [];
    saveToLocalStorage();
    displayTasks();
}

function saveToLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(todo));
}