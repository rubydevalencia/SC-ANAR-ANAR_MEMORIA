# ANAR_MEMORIA
Chrome app del juego de memoria para el Archivo Nacional de Arte Rupestre.

## Instalación
1. Como primer paso se debe instalar Node.js.
   https://nodejs.org/
   
2. Luego debes actualizar tu version de npm.

   ```
    sudo npm install npm -g
   ```
   
3. Despues de tener npm funcionando deberas descargar e instalar bower.

  ```
    npm install -g bower
  ```

4. Luego deberas instalar grunt.

  ```
    npm install -g grunt-cli
  ```
  
Esto concluye las dependencias requeridas. El resto de las librerias utilizadas estan dentro del proyecto.

## Ejecución
Para ejecutar el proyecto deberas ir al directorio de la app y correr el siguiente comando:

```
  grunt debug
```

Esto permitira correr la app directamente como una chrome app o desde localhost:9000.

## Producción
Para generar un ejecutable del proyecto deberas ir al directorio de la app y correr el siguiente comando:

```
  grunt build
```

Luego extraer los contenidos en una carpeta, ir a chrome://extensions/, darle al boton de Pack extension y seleccionar la carpeta. Esto generara un .crx y un .pem. El .pem se usara si se quiere subir la app a la web store y el .crx es el "ejecutable". Para correr la app basta con hacer drag del archivo a la ventana de chrome y darle aceptar.

Si la app generada no funciona correctamente se puede seleccionar la carpeta app del directorio y hacer pack de ella. No estara optimizada pero funcionara.

## Referencias
- https://nodejs.org/
- https://www.npmjs.com/
- http://bower.io/
- http://gruntjs.com/
- https://angularjs.org/
- http://pouchdb.com/
- http://getbootstrap.com/
- https://github.com/FezVrasta/bootstrap-material-design

## Licencia
TODO
