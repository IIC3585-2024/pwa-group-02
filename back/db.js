// Código extraído de: https://www.youtube.com/watch?v=VNFDoawcmNc&ab_channel=ChromeforDevelopers

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

function deleteSongList(db, name){
    const transaction = db.transaction(['song-lists'], 'readwrite');
    const songListStore = transaction.objectStore('song-lists');
    songListStore.delete(name);
    return transaction.complete;
}

export { openDB, createSongList, createSong, getSongList, updateSongList, deleteSongList }