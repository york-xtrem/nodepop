# Nodepop

## Para arrancar MongoDB podemos usar

`./bin/mongod --dbpath ./data/db --directoryperdb`

## Despliegue

Copiar **.env.example** a **.env** y revisar los valores

## Para ejecutar el proyecto en modo desarrollo

```shell
npm run dev
```

&nbsp;

## Roadmap

---

* [x] Crear app Express y probarla (express nodepop --ejs)
* [x] Instalar Mongoose, modelo de anuncios y probarlo (con algún anuncio.save por
      ejemplo)
* [x] Hacer un script de inicialización de la base de datos, que cargue el json de anuncios.
      Se puede llamar p.e. install_db.js, debería borrar las tablas y cargar anuncios, y algún
      usuario. Lo podemos poner en el package.json para poder usar npm run installDB.
* [x] Hacer un fichero README.md con las instrucciones de uso puede ser una muy buena
      idea, lo ponemos en la raíz del proyecto y si apuntamos ahí como arrancarlo, como
      inicializar la BD, etc nos vendrá bien para cuando lo olvidemos o lo coja otra persona
* [x] Hacer una primera versión básica del API, por ejemplo GET /apiv1/anuncios que
      devuelva la lista de anuncios sin filtros.
* [x] Para tener los errores en un formato estándar podéis hacer un módulo con un objeto
      CustomError y usarlo en los distintos sitios donde tengáis que devolverlos. Esto además nos facilitará el trabajo cuando tengamos que hacer que salgan en distintos idiomas.
* [x] Mejorar la lista de anuncios poniendo filtros, paginación, etc
* [x] Meter autenticación
* [x] Lista de tags existentes
* [x] Cluster
* [x] HTTPS
* [x] Limitar las zonas de acceso
* [ ] Config & ENV
* [ ] Change bcrypt to bcryptjs:https://github.com/jedireza/frame/wiki/bcrypt-Installation-Trouble
