# PWA - Play Planner 🎵
Este es el repositorio de la tarea 3 del grupo 2 del curso IIC3585.

## ♦ Descripción de la aplicación
Play planner es un aplicación que permite crear listas de canciones que quieres aprender. Creas una lista y luego puedes ir agregando canciones con su título. Luego, al hacer doble click, puedes entrar al detalle y modificar más aún sus propiedades como el artista o el album. También, Play Planner te notifica todos los días para que recuerdes practicar.

## 💡 Cómo funciona y 📑 Features
- Play Planner es una PWA que registra un service worker a partir del script `service-worker.js`
- El SW guarda un cache de la PWA con la Cache API para funcionar en modo offline.
- De igual manera, se tiene una BDD con IndexedDB. En esta se almacena el contenido de la aplicación y permite que siga funcionando de forma offline.
- Se intentó tener un back en un server, pero no pudimos conectarlo con la aplicación, por lo que funciona completamente con IndexedDB.
- Las notificaciones push son una alerta del tipo recordatorio que te acuerdan de practicar. Están programadas en Firebase para que se genere una notificación a las 9:00 am, 1:00 pm y 5:00 pm.

## 🚀 Correr App
Para correr la App, es necesario entrar a [este link](https://iic3585-2024.github.io/pwa-group-02/) en el que está alojada la aplicación. De ahí puede ser instalada como PWA. Para recibir las notificaciones push será necesario que se permitan las notificaciones. Para probar el modo offline, se puede hacer desde las devtools de Google Chrome en Network seleccionando el modo Offline.