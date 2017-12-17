# Nodepop

> Es una pequeña API para gestionar el backend de una plataforma de compra y venta

![](header.png)

Con está API podrás gestionar usuarios con distintos privilegios y progeter las imágenes de los anuncios. Esta preparada para devolver errores en **distintos idiomas.**
Está optimizada para aprovechar al máximo los recursos haciendo uso de promesas y desplegandose en el servidor con tantos clúster como soporte.

## Ìndice

* [Instalación](#instalación)
* [Configuración](#configuracion)
* [Producción](#produccion)
* [Desarrollo](#desarrollo)
* [Seguridad](#seguridad)
* [Modelos](#modelos)
* [Rutas](#rutas)
* **[Módulos creados desde 0 importantes](#módulos-creados-desde-0-importantes)** 🦄
* [Roadmap](#roadmap)

## Instalación

---

Clona el repositorio y ejecuta:

```sh
npm install
```

&nbsp;

## Configuración

### No olvides crear y configurar .env

He creado un .env.example que puedes renombrar y configurar

```
// Clave para aplicar encriptar el token
JWT_SECRET=dsvdsvasdvsa

// Tiempo de expiración del tokens generado
JWT_EXPIRES_IN=2d

// Nivel de seguridad de encriptación de contraseñas
BCRYPT_SALT_ROUNDS=12

// Número máximo de intentos al identificarse
MAX_LOGIN_ATTEMPTS=5,

// Tiempo en milisegundos para bloquear usuario si utiliza todos los intentos
LOCK_TIME=7200000

// Propiedades del usuario Admin
ADMIN_NAME=admin
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=1234
ADMIN_ROLE=Admin

// npm run installDB:
// Ruta para cargar usuarios
INITIAL_USERS=test/mockupData/MOCK_USER_10.json

// Ruta para cargar productos
INITIAL_PRODUCTS=test/mockupData/MOCK_PRODUCT_10.json

// Dirección dónde se encuentra la base de datos
dbURI=localhost/nodepop

// Puerto por defecto de la plataforma
PORT=3000
```

&nbsp;

## Producción

---

Para desplegar la API en el servidor tienes la siguientes formas:

#### Único proceso

Esto ejecutará un único en el servidor

```sh
npm run start
```

#### Múltiproceso

Creará tantos hilos como sea posible para dar mayor rendimiento

```sh
npm run start
```

Para cargar usuarios y productos de prueba puedes utilizar, **optimizado** con promesas para una carga rápida

```sh
npm run installDB
```

&nbsp;

## Desarrollo

---

Para poder ver los cambios que hagas en tiempo real

```sh
npm run dev
```

&nbsp;

## Seguridad

---

En la carga inicial y cada vez que se guarda un usuario la clave será encriptada mediante el algoritmo bcrypt
Una vez identificado se enviará un token el cual será tendrá que devolver en el header para acceder al API:

| key            | value |
| -------------- | :---: |
| x-access-token | TOKEN |

### Está preparado para usar HTTPS

Buscar en **www** o **cluster** dentro de bin los comentarios _Uncomment_ y seguir instrucciones indicadas

&nbsp;

## Modelos

---

### Usuario

Campos:

* **name**: obligatorio
* **email**: obligatorio y único
* **password**: obligatorio

### Producto

Campos:

* **name**: obligatorio
* **sale**: obligatario y booleano
* **price**: obligatorio. Mínimo: 0 y máximo: `Number.MAX_SAFE_INTEGER`
* **photo**
* **tags**: enumerado ["work", "lifestyle", "motor", "mobile"]

&nbsp;

## Rutas

---

Resumen de parámetros y restricciones del uso de la aplicación según privilegios

**Los parámetros se recogen del body**

### Identificación

`http://[URL]/api/authenticate`

| ACCESO        | POST |
| ------------- | :--: |
| Usuario       |  X   |
| Administrador |  X   |

##### POST

Parámetros:

* **email**
* **password**

### Usuarios

`http://[URL]/api/users`

| ACCESO        | POST | PUT | DELETE | GET | GET :id |
| ------------- | :--: | :-: | :----: | :-: | :-----: |
| Usuario       |  X   |  X  |   X    |     |         |
| Administrador |  X   |  X  |   X    |  X  |    X    |

##### POST

Parámetros:

* **name**
* **email**
* **password**

##### PUT

Solo se puede modificar uno mismo una vez identificado

Parámetros:

* **name**
* **email**
* **password**

##### DELETE

Solo se puede borrar uno mismo una vez identificado

##### GET

Consulta:

* **name**
* **email**

filtros:

* **select**
* **sort**
* **lean**: return plain javascript objects, not Mongoose Documents
* **leanWithId**: return plain javascript objects with ID, not Mongoose Documents
* **limit**: por defecto 10
* **page**
* **offset**

Devuelve:
Una lista de usarios con los criterios anteriores

##### GET :id

Devuelve:
Usario con el id proporcionado

### Usuarios

`http://[URL]/api/users`

| ACCESO        | POST | PUT | DELETE | GET | GET :id | GET tags |
| ------------- | :--: | :-: | :----: | :-: | :-----: | :------: |
| Usuario       |      |     |        |  X  |    X    |    x     |
| Administrador |  X   |  X  |   X    |  X  |    X    |    x     |

##### GET

Consulta:

* **name**
* **sale**
* **sale**
* **price**

filtros:

* **select**
* **sort**
* **lean**: return plain javascript objects, not Mongoose Documents
* **leanWithId**: return plain javascript objects with ID, not Mongoose Documents
* **limit**: por defecto 10
* **page**
* **offset**

Devuelve:
Una lista de productos con los criterios anteriores

##### GET tags

`http://[URL]/api/users/tags`
Devuelve:
Una lista de etiquetas disponibles

##### GET :id

Devuelve:
Producto con el id proporcionado

##### POST

Parámetros:

* **name**
* **sale**
* **price**
* **photo**
* **tags**

##### PUT

Solo se puede modificar uno mismo una vez identificado

Parámetros:

* **name**
* **sale**
* **price**
* **photo**
* **tags**

##### DELETE :id

Borra el producto con el id proporcionado

&nbsp;

## Módulos creados desde 0 importantes

---

### ValidatorError

Utilizando los propios mensajes proporcionados por los built-in validators del propio mongoose transforma sus mensajes para poder ser traducidos.

Ejemplo de error:

```javascript
// error lanzado por mongoose por esta restricción
const min = [0, "number_min::{PATH}::{VALUE}::0"];
```

```javascript
// es.json
"number_min": "El valor de {{path}} es {{value}} y es inferior a {{min}}"
```

Parametriza para poder utilizar la funcionalidades de i18n de personalización

### FilterRangeNumber

Valida la expresión mediante Regex siguiendo las instrucciones para devolver un filtro en mongoose

Rango de precio (precio min. y precio max.), podemos usar un parámetro en la query string llamado precio que tenga una de estas combinaciones :

* 10-50 buscará anuncios con precio incluido entre estos valores `{ precio: { '$gte': '10', '$lte': '50' } }`
* 10- buscará los que tengan precio mayor que 10 `{ precio: { '$gte': '10' } }`
* -50 buscará los que tengan precio menor de 50 `{ precio: { '$lte': '50' } }`
* 50 buscará los que tengan precio igual a 50 `{ precio: '50' }`

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
* [x] ENV
* [ ] Change bcrypt to bcryptjs:https://github.com/jedireza/frame/wiki/bcrypt-Installation-Trouble
