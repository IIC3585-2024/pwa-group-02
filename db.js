// Código basado en: https://www.youtube.com/watch?v=VNFDoawcmNc&ab_channel=ChromeforDevelopers

async function openDB(){
    const db = indexedDB.open('db-lists', 1);
    if (!db.objectStoreNames.contains('song-lists')){
        let songListOS = db.createObjectStore('song-lists', {keyPath:'name'});
        songListOS.createIndex('name', 'name', {unique: true});
    }
    return db;
}

function createSongList(db, name){
    const transaction = db.transaction(['song-lists'], 'readwrite');
    const store = transaction.objectStore('song-lists');
    store.add({name: name, songs: []});
    return transaction.complete;
}

function createSong(db, listName, song){
    const transaction = db.transaction(['song-lists'], 'readwrite');
    const songListStore = transaction.objectStore('song-lists');
    const songList = songListStore.get(listName);
    songList.songs.add(song);
    return transaction.complete;
}

function getSongList(db, name){
    const transaction = db.transaction(['song-lists'], 'readonly');
    const songListStore = transaction.objectStore('song-lists');
    return songListStore.get(name); 
}

function updateSongList(db, list){
    const transaction = db.transaction(['song-lists'], 'readwrite');
    const songListStore = transaction.objectStore('song-lists');
    songListStore.put(list);
    return transaction.complete;
}

function updateSong(db, listName, song){
    const transaction = db.transaction(['song-lists'], 'readwrite');
    const songListStore = transaction.objectStore('song-lists');
    const songList = songListStore.get(listName);
    songList.songs = songList.songs.map(s => s.name === song.name ? song : s);
    songListStore.put(songList);
    return transaction.complete;
}

function deleteSongList(db, name){
    const transaction = db.transaction(['song-lists'], 'readwrite');
    const songListStore = transaction.objectStore('song-lists');
    songListStore.delete(name);
    return transaction.complete;
}

function deleteSong(db, listName, song){
    const transaction = db.transaction(['song-lists'], 'readwrite');
    const songListStore = transaction.objectStore('song-lists');
    const songList = songListStore.get(listName);
    songList.songs = songList.songs.filter(s => s.name !== song.name);
    songListStore.put(songList);
    return transaction.complete;
}

function deleteAllSongLists(db){
    const transaction = db.transaction(['song-lists'], 'readwrite');
    const songListStore = transaction.objectStore('song-lists');
    songListStore.clear();
    return transaction.complete;
}

function deleteAllSongs(db, listName){
    const transaction = db.transaction(['song-lists'], 'readwrite');
    const songListStore = transaction.objectStore('song-lists');
    const songList = songListStore.get(listName);
    songList.songs = [];
    songListStore.put(songList);
    return transaction.complete;
}

export { openDB, createSongList, createSong, getSongList, updateSongList, deleteSongList, updateSong, deleteSong, deleteAllSongLists, deleteAllSongs}