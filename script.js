import { openDB, createSongList, createSong, getSongList, updateSongList, deleteSongList, updateSong, deleteAllSongLists, deleteAllSongs } from "./db.js";


let listTodos = {};
let actualList = "";
let todo;

openDB();


const songInput = document.getElementById("todoInput");
const songList = document.getElementById("todoList");
const songCount = document.getElementById("todoCount");
const songListName = document.getElementById("titleToDo");

const addButton = document.getElementById("addButton");
const deleteButton = document.getElementById("deleteButton");
const backButton = document.getElementById("backButton");
const artistButton = document.getElementById("artist");


const newListButton = document.getElementById("newListButton");
const songListInput = document.getElementById("listOfTodosInput");
const addSongListButton = document.getElementById("addListOfTodosButton");


document.addEventListener("DOMContentLoaded", function () {
    changeDisplayForNewList();
    addSongListButton.addEventListener("click", addSongList);
    
    songListInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevents default Enter key behavior
            addSongList();
        }
    }
    );
    
    addButton.addEventListener("click", addSong);
    songInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevents default Enter key behavior
            addSong();
        }
    });

    deleteButton.addEventListener("click", deleteAllSongsFromList);
    backButton.addEventListener("click", changeDisplayElements);
    newListButton.addEventListener("click", changeDisplayForNewList);
    

    displaySongs();
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

}

async function addSongList() {
    const listName = songListInput.value.trim();
    if (listName !== "") {
        if (await getSongList(listName) === undefined) {
            const name = await createSongList(listName); 
            console.log("lista creada:", name);
        }
        actualList = listName;
        
        todo = await getSongList(listName)
        songListInput.value = "";
        displaySongs();
    }
}


async function addSong() {
    const newSong = songInput.value.trim();
    if (newSong !== "") {
        let song = { 'song': newSong, 'disabled': false, 'artist': "", 'album': "" };
        await createSong(actualList, song);
        songInput.value = "";
        displaySongs();
    }
}


function vanishCreateListAndShowTodo(){
    document.getElementById("listOfTodos").style.display = "none";
    document.getElementById("todo").style.display = "flex";
}

async function displayTodo(){
    songList.innerHTML = "";
    console.log(actualList);
    todo = await getSongList(actualList);

    let editSong =(index )=>{
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



        const existingName = todo[index]["song"];
        const existingArtist = todo[index]["artist"];
        const existingAlbum = todo[index]["album"];



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

        let editedSong;

        inputAlbum.addEventListener("blur", function () {
            const updatedText = inputAlbum.value.trim();
            if (updatedText) {
                ///
                todo[index]["album"] = updatedText;
                editedSong = todo[index]
                updateSong(actualList, editedSong)

                // saveToLocalStorage();
            }
            displaySongs();
        }
        );

        inputArtist.addEventListener("blur", function () {

            const updatedText = inputArtist.value.trim();
            if (updatedText) {

                todo[index]["artist"] = updatedText;
                editedSong = todo[index]
                updateSong(actualList, editedSong)
                // saveToLocalStorage();
            }
            displaySongs();
        });

        inputName.addEventListener("blur", function () {
            const updatedText = inputName.value.trim();
            if (updatedText) {
                todo[index]["song"] = updatedText;
                editedSong = todo[index]
                updateSong(actualList, editedSong)
                // saveToLocalStorage();
            }
            displaySongs();
        });

    }
    if (todo["songs"] !== undefined) {
        todo["songs"].forEach((item, index) => {
            const p = document.createElement("p");
            p.innerHTML = `
        <div class="todo-container">
            <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item['disabled'] ? "checked" : ""
                }>
            <p id="todo-${index}" class="${item['disabled'] ? "disabled" : ""
                }" >${item['song']}</p>
        </div>
        `;
            p.querySelector(".todo-checkbox").addEventListener("change", () =>
                toggleSong(index)
            );
            songList.appendChild(p);
        });
    }
    
}


async function displaySongs() {
    todo = await getSongList(actualList);
    songListName.textContent = actualList; // Display nombre como titulo
    if (actualList !== "") {
        vanishCreateListAndShowTodo();
    }
    displayTodo();
    songCount.textContent = todo.length;
}




function editSong(index) {
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



    const existingName = todo[index]["song"];
    const existingArtist = todo[index]["artist"];
    const existingAlbum = todo[index]["album"];



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

    let editedSong;

    inputAlbum.addEventListener("blur", function () {
        const updatedText = inputAlbum.value.trim();
        if (updatedText) {
            ///
            todo[index]["album"] = updatedText;
            editedSong = todo[index]
            updateSong(actualList, editedSong)
            
            // saveToLocalStorage();
        }
        displaySongs();
    }
    );

    inputArtist.addEventListener("blur", function () {
        
        const updatedText = inputArtist.value.trim();
        if (updatedText) {

            todo[index]["artist"] = updatedText;
            editedSong = todo[index] 
            updateSong(actualList, editedSong)
            // saveToLocalStorage();
        }
        displaySongs();
    });

    inputName.addEventListener("blur", function () {
        const updatedText = inputName.value.trim();
        if (updatedText) {
            todo[index]["song"] = updatedText;
            editedSong = todo[index]
            updateSong(actualList, editedSong)
            // saveToLocalStorage();
        }
        displaySongs();
    });
}

async function toggleSong(index) {
    todo = await getSongList(actualList);
    todo = todo["songs"]
    todo[index]["disabled"] = !todo[index]["disabled"];
    let editedSong = todo[index]
    updateSong(actualList, editedSong)

    // saveToLocalStorage();

    displaySongs();
}

function deleteAllSongsFromList() {

    todo = [];
    listTodos[actualList] = [];
    deleteAllSongs(actualList)
    displaySongs();
}