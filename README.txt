FLOR PARA TI - instrucciones rapidas
=====================================

Archivos:
- index.html   -> estructura de la pagina
- style.css    -> colores, animaciones y estilos
- script.js    -> la secuencia (intro, flor armandose, mensaje final, musica)

AGREGAR TU CANCION
--------------------
1. Descarga tu cancion (por ejemplo de https://pixabay.com/music/search/romantic%20piano/,
   musica libre de derechos) en formato mp3.
2. Copia el archivo mp3 DENTRO de esta misma carpeta (junto a index.html).
3. Abre script.js y en CONFIG cambia:
     musicFile: "cancion.mp3"
   por el nombre exacto de tu archivo, por ejemplo:
     musicFile: "mi-cancion.mp3"
4. Listo, empezara a sonar apenas la persona toque "Abrir".

PERSONALIZAR EL TEXTO
----------------------
Abre script.js y edita el bloque CONFIG al principio del archivo:

  const CONFIG = {
    introText: "...",          <- mensaje de la pantalla de inicio
    finalMessageHTML: `...`,   <- mensaje final (poema)
    signature: "...",          <- tu firma / nombre
    musicEnabled: true,        <- pon false si no quieres musica
    ...
  };

PROBARLO EN TU COMPUTADORA
----------------------------
1. Abre la carpeta en Visual Studio Code.
2. Instala la extension "Live Server" (si no la tienes).
3. Click derecho sobre index.html -> "Open with Live Server".
   (O simplemente abre index.html directo en el navegador con doble clic).

ENVIARLO POR WHATSAPP
------------------------
WhatsApp no puede "abrir" una carpeta de archivos como pagina interactiva,
necesitas subirla a un link. La forma mas facil y gratis:

1. Entra a https://app.netlify.com/drop
2. Arrastra la carpeta COMPLETA (o comprimela en zip y arrastra el zip).
3. Te da un link tipo https://algo-random.netlify.app
4. Ese link se lo mandas por WhatsApp.

Tambien puedes usar GitHub Pages, Vercel, o cualquier hosting estatico.
