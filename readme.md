# Documentación API Nodepop

La API de nodepop te ayuda a obtener y manipular los anuncios que ofrece la aplicación Nodepop a través de peticiones.

## Puesta en marcha

### Instalación

Antes de nada tenemos que asegurarnos que el servicio de DB está en marcha. En este caso la API usa MongoDB como DB.

En segundo lugar ejecutaremos el comando ```npm install``` para instalar todas las dependencias que usa la API.

Finalmente, renombramos el archivo .env_example a .env y modificamos los dos valores que nos sirven para hacer la autenticación mediante JSON Web Token.

### Inicializar la DB

Para poder trabajar y probar la API, ejecuta el comando ```npm run installDB``` para inicializar la base de datos con algunas colecciones que contienen unos anuncios de prueba y un usuario admin para poder hacer pruebas con él.

### Ejecutar API

Lo siguiente es poner el marcha la API para poder hacerle petiones. Hay tres maneras de poner el marcha la API:

1. Arranque normal: ```npm run start```
2. Arranque en modo cluster: ```npm run cluster```
3. Arranque en modo desarrollo: ```npm run dev```

Tras realizar estos pasos podemos pasar a realizar peticiones a la API.

## Funcionamiento

### Operaciones con Usuarios

Los usuarios podrán registrarse y tras eso logearse para luego poder acceder a los anuncios que ofrece la aplicación. Para ello accederemos a la siguiente ruta:

```http://localhost:3000/apiv1/usuarios/registro```

Esto se realiza a través de una petición POST y necesita de los siguientes tres parámetros:

- Un nombre.
- Una dirección de email.
- Una contraseña.

> Ejemplo de json:
> ```json
> {
>	"nombre": "Example",
>	"email": "example@example.com",
>	"clave": "1234"
> }
> ```

Tras haberse registrado, un usuario podrá iniciar sesión. Para ello realizaremos una petición POST a la siguiente ruta:

```http://localhost:3000/apiv1/usuarios/login```

En este caso los parámetros necesarios serán los siguientes:

- La dirección de email con la que se ha registrado.
- La contraseña.

> Ejemplo de json:
> ```json
> {
>	"email": "example@example.com",
>	"clave": "1234"
> }
> ```

Una vez logeados correctamente nos generará una token con el que podremos acceder a los anuncios de la aplicación.

### Operaciones con Anuncios

Como he comentado anteriormente, los anuncios solo se pueden ver una vez se haya iniciado sesión con un usuario. Para ello, hay que pasar el token generado al iniciar sesión como parámetro en la ruta de la petición:

```http://localhost:3000/apiv1/anuncios?token=fe89yrhi34qh97jdfsadgFDdfsadfEEgk8es9ew```

De esta forma te listará todos los anuncios que se encuentran disponibles.

Por lo tanto **el parámetro del token es obligatorio**, pero **hay otra serie de parámetros que no son obligatorios** y nos sirven para filtrar los anuncios a mostrar:

- **tag**: para poder filtrar anuncios por tag.
```http://localhost:3000/apiv1/anuncios?token=ifne8jw&tag=lifestyle```

- **venta**: indica si el artículo está a la venta o no. Tiene un valor booleano. 
```http://localhost:3000/apiv1/anuncios?token=ifne8jw&venta=true```

- **precio**: con este parámetro filtramos anuncios por precio. Puede tener diferentes formatos dependiendo de lo que queramos filtrar:
    * ```10-50```: busca anuncios cuyo precio este comprendido entre los dos números indicados.
    * ```10-```: busca anuncios cuyo precio sea mayor que el número indicado.
    * ```-50```: busca anuncios cuyo precio sea menor al número indicado.
    * ```50```: busca anuncios cuyo precio sea igual al número indicado.

   ```http://localhost:3000/apiv1/anuncios?token=ifne8jw&precio=100-200```
   
- **nombre**: busca los anuncios cuyos nombres empiecen por lo indicado en este parámetro.
```http://localhost:3000/apiv1/anuncios?token=ifne8jw&nombre=iphone```

- **skip**: mediante este parámetro podemos evitar que nos muestre los primeros x anuncios de la lista, donde x es el número que pasamos mediante el parámetro.
```http://localhost:3000/apiv1/anuncios?token=ifne8jw&skip=2```

- **limit**: con este parámetro limitamos el listado de anuncios al número que le hayamos indicado.
```http://localhost:3000/apiv1/anuncios?token=ifne8jw&limit=3```

- **sort**: a este parámetro podemos indicarle sobre que queremos que nos ordene el listado de anuncios (nombre, precio).
```http://localhost:3000/apiv1/anuncios?token=ifne8jw&sort=nombre```

**Se pueden usar tanto parámetros opcionales como se quieran en una misma petición.**

### Listado de tags

Podemos sacar un listado de los tags que se están usando en los anuncios existentes.

```http://localhost:3000/apiv1/anuncios/tags?token=ifne8jw```

Como se puede ver en el ejemplo de arriba, al tratarse de los tags de los anuncios, también hay que estar logeado con un usuario para poder acceder a ellos.

### Idioma

Los mensajes que se le muestran al usuario pueden ser mostrados en español o en ingles. Por defecto el idioma es el español, pero en caso de querer que estos mensajes se muestren en ingles, ya sea sobre operaciones sobre usuarios o anuncios, habrá que pasar ese parámetro en la propia ruta de la petición, usando el parámetro **lang** e indicando ```en``` para ingles y ```es``` para el español.

```http://localhost:3000/apiv1/anuncios?token=ifne8jw&lang=en```

# Práctica DevOps

**Dirección IP del servidor:** 52.15.48.24

**URL aplicación node:** https://nodepop.ironmacdev.com

* *Acceder al login:* https://nodepop.ironmacdev.com/apiv1/usuarios/login
* *Acceder al regitro:* https://nodepop.ironmacdev.com/apiv1/usuarios/registro
* *Acceder a los anuncios:* https://nodepop.ironmacdev.com/apiv1/anuncios

**URL archivo estático:**

* https://nodepop.ironmacdev.com/images/anuncios/cuboRubik.jpg
* https://nodepop.ironmacdev.com/stylesheets/style.css