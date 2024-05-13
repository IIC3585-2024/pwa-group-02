// Código basado en: https://www.youtube.com/watch?v=VNFDoawcmNc&ab_channel=ChromeforDevelopers y https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB


let db;

async function openDB() {
        const request = window.indexedDB.open('db-lists', 1);

        request.onerror = function () {
            console.error("Database failed to open");
            reject("Failed to open database");
        };

        request.onsuccess = function () {
            db = request.result;
        };

        request.onupgradeneeded = function (event) {
            db = event.target.result;
            // if (!db.objectStoreNames.contains('song-lists')) {
                const songListOS = db.createObjectStore('song-lists', { keyPath: 'id', autoIncrement: true });
                songListOS.createIndex('name', 'name', { unique: true });
            // }
        };
        
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (db) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
}

function getDB(){
    return db;
}

function createSongList(name){
    return new Promise((resolve, reject) => {
        const db = getDB();
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const store = transaction.objectStore('song-lists');
        const request = store.add({ "name": name, "songs": [] });
        
        request.onsuccess = function(){
            
            resolve(request.result.name);
        }
        request.onerror = function(){
            reject("Failed to create song list");
        }
    });
}

async function createSong(listName, song){
    
    return await  new Promise((resolve, reject) => {
        const db = getDB();
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const store = transaction.objectStore('song-lists');
        const request = store.index('name').get(listName);
        request.onsuccess = function(){
            
            if(request.result === undefined){
                reject("Song list not found");
            }
            else{
                const newList = request.result["songs"].push(song);
                
                store.put(request.result);
                resolve(song);
            }
        }
        request.onerror = function(){
            reject("Failed to create song");
        }
    });
}

function getSongList(name){
    
    return new Promise((resolve, reject) =>  {
        const db = getDB();
        const transaction = db.transaction(['song-lists'], 'readonly');

        const songListStore = transaction.objectStore('song-lists');
        const request = songListStore.index("name").get(name);
        request.onsuccess = function(){
            resolve(request.result);
        }
        request.onerror = function(){
            reject("Failed to get song list");
        }
    });
}

async function updateSongList(list){
    
    return await new Promise((resolve, reject) => {
        const db = getDB();
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        songListStore.onsuccess = function(){
            const request = songListStore.index("name").get(listName);
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
    
    return await new Promise((resolve, reject) => {
        const db = getDB();
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        const request = songListStore.index("name").get(listName);
        request.onsuccess = function(){
            if(request.result === undefined){
                reject("Song list not found");
            }
            else{
                request.result["songs"] = request.result["songs"].map(s => s["name"] === song["name"] ? song : s);
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
    
    return await new Promise((resolve, reject) => {
        const db = getDB();
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        const request = songListStore.index("name").get(name);
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
    
    return await new Promise((resolve, reject) => {
        const db = getDB();
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        const request = songListStore.index("name").get(listName);
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
    
    return await new Promise((resolve, reject) => {
        const db = getDB();
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        songListStore.clear();
        resolve();
    });
}

async function deleteAllSongs(listName){
    
    return await new Promise((resolve, reject) => {
        const db = getDB();
        const transaction = db.transaction(['song-lists'], 'readwrite');
        const songListStore = transaction.objectStore('song-lists');
        const songList = songListStore.index("name").get(listName);
        songList.songs = [];
        songListStore.put(songList);
        return transaction.complete;
    });
}

export { openDB, createSongList, createSong, getSongList, updateSongList, deleteSongList, updateSong, deleteSong, deleteAllSongLists, deleteAllSongs}