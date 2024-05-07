// Retrieve todo from local storage or initialize an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
const backButton = document.getElementById("backButton");
const artistButton = document.getElementById("artist");


// Initialize
document.addEventListener("DOMContentLoaded", function () {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevents default Enter key behavior
            addTask();
        }
    });
    deleteButton.addEventListener("click", deleteAllTasks);
    backButton.addEventListener("click", changeDisplayElements);
    // artistButton.addEventListener("click", editArtist);
    

    displayTasks();
});

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
        todo.push({ text: newTask, disabled: false, artist: "", album: ""});
        saveToLocalStorage();
        todoInput.value = "";
        displayTasks();
    }
}

function displayTasks() {
    todoList.innerHTML = "";
    todo.forEach((item, index) => {
        const p = document.createElement("p");
        p.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item.disabled ? "checked" : ""
            }>
        <p id="todo-${index}" class="${item.disabled ? "disabled" : ""
            }" onclick="editTask(${index})">${item.text}</p>
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


    const existingName = todo[index].text;
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
            todo[index].text = updatedText;
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
    saveToLocalStorage();
    displayTasks();
}

function saveToLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(todo));
}