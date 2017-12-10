#Nodepop

## Operaciones que debe realizar el API:

* Registro (nombre, email, contraseña)
* Autenticación (email, contraseña)
* Lista de anuncios paginada. Con filtros por tag, tipo de anuncio (venta o búsqueda),
  rango de precio (precio min. y precio max.) y nombre de artículo (que empiece por el
  dato buscado)
* Lista de tags existentes

## Para arrancar MongoDB podemos usar

./bin/mongod --dbpath ./data/db --directoryperdb

## Desplegue

Copiar .env.example a .env y revisar los valores

## Para ejecutar el proyecto en modo desarrollo

npm run dev
