// Código basado en: https://www.youtube.com/watch?v=VNFDoawcmNc&ab_channel=ChromeforDevelopers y https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB


let db;

async function openDB() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('db-lists', 1);

        request.onerror = function () {
            console.error("Database failed to open");
            reject("Failed to open database");
        };

        request.onsuccess = function () {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = function (event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains('song-lists')) {
                const songListOS = db.createObjectStore('song-lists', { keyPath: 'id', autoIncrement: true });
                songListOS.createIndex('name', 'name', { unique: true });
            }
        };
        
    });
}

async function createSongList(name){
    return new Promise((resolve, reject) => {
        const transaction = db.transaction.oncomplete(['song-lists'], 'readwrite');
        const store = transaction.objectStore('song-lists');
        const request = store.index('name').get(name);
        request.onsuccess = function(){
            if(requestWithIndex === undefined){
                store.add({name: name, songs: []});
                console.log('Added song list:' + name);
            }
            
            resolve(request.result.name);
        }
        request.onerror = function(){
            reject("Failed to create song list");
        }
    });
}

async function createSong(listName, song){
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const store = transaction.objectStore('song-lists');
        const request = store.index('name').get(listName);
        request.onsuccess = function(){
            if(request.result === undefined){
                reject("Song list not found");
            }
            else{
                request.result.songs.push(song);
                store.put(request.result);
                console.log('Added song:' + song + ' to list:' + listName);
                resolve(song);
            }
        }
        request.onerror = function(){
            reject("Failed to create song");
        }
    });
}

async function getSongList(name){
    new Promise((resolve, reject) => {
        const transaction = db.transaction(['song-lists'], 'readonly');
        const songListStore = transaction.objectStore('song-lists');
        const request = songListStore.get(name);
        request.onsuccess = function(){
            resolve(request.result.name);
        }
        request.onerror = function(){
            reject("Failed to get song list");
        }
    });
}

async function updateSongList(list){
    new Promise((resolve, reject) => {
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        const request = songListStore.get(list.name);
        request.onsuccess = function(){
            if(request.result === undefined){
                reject("Song list not found");
            }
            else{
                songListStore.put(list);
                resolve(list);
            }
        }
        request.onerror = function(){
            reject("Failed to update song list");
        }
    });
}

async function updateSong(listName, song){
    new Promise((resolve, reject) => {
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        const request = songListStore.get(listName);
        request.onsuccess = function(){
            if(request.result === undefined){
                reject("Song list not found");
            }
            else{
                request.result.songs = request.result.songs.map(s => s.name === song.name ? song : s);
                songListStore.put(request.result);
                resolve(song);
            }
        }
        request.onerror = function(){
            reject("Failed to update song");
        }
    });
}

async function deleteSongList(name){
    new Promise((resolve, reject) => {
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        const request = songListStore.get(name);
        request.onsuccess = function(){
            if(request.result === undefined){
                reject("Song list not found");
            }
            else{
                songListStore.delete(name);
                resolve(name);
            }
        }
        request.onerror = function(){
            reject("Failed to delete song list");
        }
    });
}

async function deleteSong(listName, song){
    new Promise((resolve, reject) => {
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        const request = songListStore.get(listName);
        request.onsuccess = function(){
            if(request.result === undefined){
                reject("Song list not found");
            }
            else{
                request.result.songs = request.result.songs.filter(s => s.name !== song.name);
                songListStore.put(request.result);
                resolve(song);
            }
        }
        request.onerror = function(){
            reject("Failed to delete song");
        }
    });
}

async function deleteAllSongLists(){
    new Promise((resolve, reject) => {
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        songListStore.clear();
        resolve();
    });
}

async function deleteAllSongs(listName){
    new Promise((resolve, reject) => {
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        const songList = songListStore.get(listName);
        songList.songs = [];
        songListStore.put(songList);
        return transaction.complete;
    });
}

export { openDB, createSongList, createSong, getSongList, updateSongList, deleteSongList, updateSong, deleteSong, deleteAllSongLists, deleteAllSongs}