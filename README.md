# KC BootCamp Web X.

# Módulo 10. Desarrollo Backend Avanzado con Node.

## Fco Ríos.

## THIS PROJECT STARTS FROM PREVIOUS REPO -https://github.com/prgbono/KC_p4_introNodeJS

## This Readme file also covers práctica Módulo 12 - Configuración de servidores, DEPLOYING:

- Ejercicio 1 - Node App deployed: http://ec2-3-220-12-170.compute-1.amazonaws.com/
  Alberto @kasappeal, en la carga inicial de la web se produce una carga de anuncios desde la BD sin necesidad de JWT. Ahí podrás ver la cabecera personalizada en los archivos estáticos (js, css, favicon e imágenes).
- Ejercicio 2 - React/Static app deployed: http://3.220.12.170/

## JWT

- This project needs JWT header 'Authorization' in its requests.
- The endpoint /api/authenticate retrieves a 1h valid accessToken.
- Url '/api/ads' is protected by JWT. '/' (localhost:3000) also should be, it is not because there is no 'FrontEnd login page' implemented. So request to '/' works without set JWT header Authorization.
  TODO: FrontEnd login page
  TODO: Set JWT auth for '/' in /routes/index.js

## Init the project in few steps:

1. `./bin/mongod --dbpath ./data/db` - Start a MongoDB local instance with
2. `npm install`
3. Copy .env file to .env and review the config
4. [`npm run installDB`] - Init db. [Optional], if you want to refresh / init the database
5. `npm run ms_thumbnailMaker` - start thumbmailMaker microservice.
6. `npm start` -> Run an http server on localhost:3000

## API Methods

### GET /api/ads

Get a list of ads

### GET /api/tags

Get a list of current tags

### POST /api/ads (body)

Insert a new ad. Data must be in the body.
This endpoint trigger the microservice 'thumbnailMaker.js' which will create a thumbnail 100x100 aprox of the image uploaded. This thumbnail will be stored in /public/images folder in this way:

- randomName_thumbnail. This randomName will be the same for thumbnail and uploaded image.

Thumbnails are not showed in the UI. They need stylising so I preferred to maintain the original and bigger image in http://localhost:3000/

### PUT /api/ads:id (body)

Modify ad.

### DELETE /api/ads:id

Remove an ad.

### Advertisement model:

See nodepop/models/Ad.js

### Images:

We can get images stored in the server directly with the url:
http://localhost:3000/images/<nombreRecurso>

### Filters:

Filters can be applied on HomePage (/) and also /api/ads
We can filter by names, tags, price and kind of advertisement.
The key words to add in the url for properly filtering are **'nombre'**, **'tag'**, **'precio'** and **'venta'** respectively.
Our 'venta' filter condition is not a boolean, it is an `enum: ["vende", "busca"]` instead.

By Model property isType -> http://localhost:3000/api/ads?venta=<value>
<value> is enum: ["vende", "busca"]

By Model property name -> http://localhost:3000/api/ads?venta=vende&nombre=ta

By Model property tag -> http://localhost:3000/api/ads?tag=work
http://localhost:3000/api/ads?tag=work&tag=lifestyle

By Model property price:

- Price = X http://localhost:3000/api/ads?precio=350.15
- Price > X http://localhost:3000/api/ads?precio=200-
- Price < X http://localhost:3000/api/ads?precio=-200
- X > Price > Y http://localhost:3000/api/ads?precio=100-500

We can mix filters -> http://localhost:3000/api/ads?venta=vende&nombre=ta&precio=50-300&tag=lifestyle

### Pagination:

We can set the number of items retrieved and shown with the param `limit` in the url:
_http://localhost:3000/api/ads?limit=4_
Also available the param `skip` for the next pages in the list (user interaction needed)
_http://localhost:3000/api/ads?limit=4&skip=4_
