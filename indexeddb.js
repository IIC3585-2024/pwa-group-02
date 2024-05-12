import { openDB } from 'idb';

const db = await openDB('play-planner', 1, {
    upgrade(db) {
        db.createObjectStore('static-assets', {
            autoincrement: true,
            keypath: 'id',
        });
        db.createObjectStore('dynamic-assets', {
            autoincrement: true,
            keypath: 'id',
        });
        store.createIndex('type', 'type');
    },
});

editor.onUpdate(async (content) => {
    await db.put('static-assets', content, 'content');
});

editor.setContent(await db.get('static-assets', 'content'));