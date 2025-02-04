---
title: "Principales conceptos de las API RESTful"
description: "Un repaso sobre que tener en cuenta al momento de construir una API RESTful"
pubDate: "Feb 04 2025"
heroImage: "/image.png"
---

Las API REST descansan sobre la arquitectura de Cliente-Servidor, donde se separan las responsabilidades de almacenamiento datos y lógica de negocio del cliente, proporcionando a este, solo lo necesario. Dicha separación permite que una API pueda ser escrita en diferentes lenguajes, sin importar el lenguaje del cliente, siempre y cuando se respete el protocolo de comunicación (HTTP, JSON, etc.).

En resumen, lo que sucede dentro de la API, como la implementación, lenguaje, lógica, esquema de base de datos, tecnologías, bibliotecas, etc. debe ser totalmente transparentes al cliente.

La filosofía de REST de basa principalmente en unos principios, los cuales se muestran a continuación.

**Diseño en torno a recursos**: Los recursos son cualquier tipo de objeto, dato o servicio que puede ser accedido por el cliente. Cada recurso debe poder ser accedido mediante un identificador, el cual se le conoce como URI.

**Utilizan una interfaz uniforme**: Es decir, un esquema que permita desacoplar el cliente del servicio. En el caso de API HTTP, se utilizan los verbos tales como: GET, POST, PUT, PATCH, DELETE.

**Sin estado**: Quiere decir que las peticiones deben ser independientes y pueden producirse en cualquier orden. La información se almacena en los propios recursos, es decir, cuando un cliente obtiene una representación de un recurso, este debe contener la información suficiente para poder manipular el recurso.

**Manejadas mediante enlaces hipermedia**: Estos enlaces deben estar contenidos en la propia representación y deben permitir navegar por las distintas interfaces asociadas.

Una ventaja adicional es que, si se cumplen con los principios (en especial, sin estado), los datos resultantes de un petición pueden ser almacenados en caché, permitiendo un ahorro significativo en los recursos (computación, ancho de banda, latencia, etc).

Las claves para una buena API REST, son las siguientes:

- Fácil de aprender.
- Fácil de usar.
- Difícil de usar mal.
- Código fácil de leer y mantener.
- Suficientemente potente para cumplir con los requerimientos.
- Fácil de extender.
- Adecuado para uso público.

#### Modelo de madurez de las API REST

Propuesto en 2008 por Leonard Richardson, incluye los siguientes niveles:

- _Nivel 0_: Se define una URI, y todas las peticiones son POST.
- _Nivel 1_: Se crean URIs separadas para cada recurso individual.
- _Nivel 2_: Se usan métodos HTTP para definir las operaciones sobre los recursos.
- _Nivel 3_: Se usa hipermedia (HATEOAS).

La mayorá de APIs solo llegan al _Nivel 2_.

### Recursos

Como se mencionó anteriormente, los recursos son una de las bases fundamentales en el diseño de una API RESTful. En este contexto, un recurso puede representarse como una entidad específica o una colección de entidades. Por ejemplo, `users` puede referirse a una lista de usuarios disponibles en la API.

Cada recurso debe ser identificado de manera única mediante una URI (Uniform Resource Identifier), lo que permite su acceso a través de métodos HTTP. Por ejemplo, si un cliente necesita obtener información de todos los usuarios, podría acceder al recurso mediante una URI como `http://jesfer.com/api/users`. Para información de un usuario específico, el recurso asociado podría ser identificado como `http://jesfer.com/api/users/{id}`, donde `{id}` representa un identificador único de usuario.

> _Como recomendación, los identificadores deben ser claros y suficientemente descriptivos. En el caso de entidades, se sugiere utilizar sustantivos en plural para representar colecciones de forma intuitiva y coherente._

Aunque los recursos pueden representarse como entidades, no es necesario que reflejen exactamente el esquema de la base de datos. De hecho, esta práctica suele ser poco recomendada y, siempre que sea posible, debería evitarse. Y es que, en casos reales será necesario obtener datos de distintas tablas y servirlos mediante un único recurso; de hecho, para casos como este, una muy buena opción es el patrón **Data Mapper**.

### Endpoints anidados

Cuando hablamos de endpoints anidados nos referimos a las URIs mediante las cuales obtenemos los recursos de la API, sin embargo, cuando existen relaciones entre entidades podemos representar dichas relaciones mediante un anidamiento. A continuación, un ejemplo.

```json
/companies/{companyId}/departments/{departmentId}/employees
```

> _En el ejemplo se muestra una URI que permite obtener empleados, pero pasando por sus relaciones adyacentes; es decir, un empleado de un departamento especifico que a su vez pertenece a una compañía específica._

En realidad, no existen reglas que determine la forma que deben tener los endpoints y queda a criterio de cada desarrollador adoptar las buenas prácticas según el caso especifico al que se enfrenten.

Por ello, diferentes endpoints pueden obtener la misma data, como se muestra a continuación.

```json
//El hecho de que los empleados sean accesibles en el departamento:
company/{companyid}/department/{departmentid}/employees

//No significa que no puedan ser accesibles también bajo compañía:
company/{companyid}/employees
```

Según Microsoft, es tentador crear URIs anidadas como `/customers/1/orders/99/products`, pero que, en sistemas complejos, puede no ser del todo recomendable. Este anidamiento es difícil de mantener y es poco flexible si las relaciones entre entidades cambian en el futuro.

Una vez se tiene la referencia a un recurso, debería ser posible utilizar dicha referencia para encontrar elementos relacionados con ese recurso. La consulta anterior puede sustituirse por la URI `/customers/1/orders` para encontrar todos los pedidos del cliente 1 y, a continuación, `/orders/99/products` para encontrar los productos de este pedido.

> _Es preferible evitar un anidamiento profundo de recursos en las URIs, ya que un mayor nivel de anidamiento puede hacer las consultas más complicadas y afectar el rendimiento de la API. En lugar de crear URIs con anidamientos excesivos, se recomienda realizar consultas adicionales para obtener la información necesaria. En el ejemplo se muestra un anidamiento de nivel 2, lo cual podría no ser ideal dependiendo del caso._

### Carga y diseño

Cuando un cliente realiza una petición a nuestra API, esta genera una carga en el sistema. A medida que aumenta el número de peticiones, dicha carga también se incrementa. Por este motivo, es importante evitar exponer una excesiva cantidad de recursos muy pequeños que obliguen a los clientes a realizar múltiples consultas innecesarias. En su lugar, es preferible desnormalizar los datos y combinar la información en recursos más grandes, tal como se menciona en apartado de _Recursos_.

No obstante, crear recursos excesivamente grandes con información irrelevante introduce otro problema: aumenta la latencia y el consumo de ancho de banda.

> _Lo ideal es encontrar un equilibrio, creando recursos que ofrezcan al cliente solo la información estrictamente necesaria. En este sentido, es preferible realizar unas pocas consultas adicionales._

### Entidades anidadas

Recordemos las principales relaciones entre entidades:

- Many to Many
- Many to One
- One to One

Ahora, se presentan algunas formas de como trabajar con entidades anidadas.

##### Incluir las relaciones en las respuestas

La respuesta incluye los datos propios de la entidad, así como los de las relaciones subyacentes.

```json
{
  "id": 1,
  "name": "Entity",
  "description": "Principal entity",
  "relationships": [
    {
      "id": 12,
      "name": "Relationship entity",
      "description": "Relationship of principal entity"
    }
  ]
}
```

> _Como se puede apreciar en el ejemplo, se incluye la totalidad de los datos junto con las relaciones asociadas_

**Pros**

- Implementación simple
- Ideal para pocas entidades con pocas columnas.

**Contras**

- Poco eficiente, en especial para grandes cantidades de datos.
- Puede mostrar información sensible.
- Se debe personalizar el esquema.

##### Incluir información parcial

La respuesta incluye solo datos parciales o específicos.

```json
{
  "id": 1,
  "name": "Entity",
  "relationships": [
    {
      "id": 12,
      "name": "Relationship entity"
    }
  ]
}
```

> _A diferencia del ejemplo anterior el campo `description` no se encuentra presente en el esquema, es decir, las columnas se incluyen parcialmente._

**Pros**

- Solo muestra la información necesaria.
- Ideal si se solo de debe servir a un único frontend con datos muy específicos.

**Contras**

- Respuestas no estandarizadas.
- Se debe especificar un nuevo esquema.

##### Entidades poco profundas

Por lo general, se incluyen únicamente los `id` de las entidades asociadas, para que sea el cliente quien consulte por su cuenta los datos completos de dichas relaciones.

```json
{
  "id": 1,
  "name": "Entity",
  "description": "Principal entity",
  "relationships": [12, 13, 14, 15]
}
```

> \_Como se muestra, solo se incluyen los `id` de las entidades relacionadas para que el frontend se encargue del fetching.

**Pros**

- Entidades genéricas (dado que se mantiene el esquema casi original)
- Reduce el tamaño de la respuesta.
- Simplifica el diseño de la API.

**Contras**

- Requiere peticiones adicionales, por consiguiente tiempos adicionales.

> _Por lo general, es recomendable incluir únicamente los `id` de las entidades asociadas, dejando que el cliente realice consultas adicionales para obtener los datos completos de dichas relaciones. Este enfoque reduce el tamaño de la respuesta y simplifica el diseño de la API._

### Semántica HTTP

Es importante que al implementar una API RESTFul, se considere el uso de los adecuados métodos HTTP, dado que permiten una interactuar de manera consistente y predecible con los recursos.

**GET**: Recupera la representación de un recurso, cuando la respuesta es satisfactoria por lo general se retorna un código de estado 200 (OK), sin embargo, cuando no se pudo entrar el recurso el código correspondiente es un 400 (NOT FOUND).

**POST**: Crea un nuevo recurso o activa una determinada operación. Cuando se emplea para crear un recurso nuevo, el código devuelto será un 201 (CREATED). El cuerpo de la respuesta incluye la representación de recurso creado y su ubicación se muestra en la cabecera `Location`. Cuando se ejecutan operaciones, la respuesta de éxito puede ser un código 200 (OK) e incluir el resultado de la operación en el cuerpo de la respuesta, pero si no hay ningún resultado que devolver el código puede ser un 204 (NO CONTENT). Si el cliente envía datos no validos en la solicitud el servido debe devolver un código de estado 400 (BAD REQUEST) y en el cuerpo de la respuesta se puede incluir información adicional sobre el error.

**PUT**: Crea o reemplaza un recurso especifico. Si se crea un nuevo recurso, devuelve un 201 (CREATED), pero si actualiza un recurso existente, devuelve un código 200 (OK) O 204 (NO CONTENT). En caso ocurra un problema con la actualización, es posible devolver un código 409 (CONFLICT). La solicitud debe especificar la URI del recurso y el cuerpo los detalles del recurso a modificar.

**PATCH**: Actualiza parcialmente un recurso específico. A pesar que la especificación del método PUT no indica un formato correcto para este tipo de solicitudes, uno bastante común es que en el cuerpo de la petición, la información parche tiene el misma estructura del recurso original, sin embargo, solo incluye un subconjunto de campos que deben ser actualizados.

**DELETE**: Elimina un recurso especificado. Cuando la eliminación se realiza de manera correcta el servidor debe devolver un código de estado 204 (NO CONTENT), indicando que el proceso ha sido exitoso, pero sin contenido en el cuerpo de la respuesta. Si el recurso a eliminar no existe, se pude devolver un 404 (NOT FOUND).

Siempre que el cuerpo de una respuesta correcta esté vacío, el código de estado podrá ser un 204 (NO CONTENT), como por ejemplo en una búsqueda de la cual no se encuentran resultados.

Además de los métodos mencionados, el protocolo HTTP especifica que los formatos de datos se especifican mediante el uso de tipos de medio, conocidos como MIME types. Para daros no binarios, por lo general se emplea JSON (media type = `aplication/json`), y esta información se debe incluir en el encabezado `Content-Type` tanto de la solicitud como de la respuesta, lo cual indica el formato de la representación. Si el servidor recibe un MIME type que no se puede admitir, debe devolver un código de respuesta 415 (UNSUPPORTED MEDIA TYPE).

### Navegación entre recursos

La filosofía REST establece que es posible navegar por todos los recursos de una API sin necesidad de conocer previamente su estructura o esquema. Para lograrlo, cada respuesta a una solicitud, como un **GET**, debe incluir toda la información necesaria para que el cliente pueda descubrir y acceder a los recursos relacionados. Esto se logra mediante la inclusión de **hipervínculos** dentro de la representación de los recursos, así como las operaciones disponibles para interactuar con ellos.

Este principio fundamental se denomina **HATEOAS** (Hypertext as the Engine of Application State) y garantiza que la interacción con la API sea autodescriptiva y dinámica. En otras palabras, el cliente puede explorar y consumir los recursos siguiendo los enlaces proporcionados, sin requerir conocimientos adicionales más allá del punto de entrada inicial.

Por ejemplo, al solicitar información sobre un recurso específico, como un usuario, la respuesta podría incluir enlaces relacionados para acceder a otros recursos como los pedidos realizados por ese usuario o su perfil completo. Además, estos hipervínculos podrían especificar las acciones permitidas, como editar, eliminar o añadir un nuevo recurso.

Este enfoque mejora la escalabilidad y la flexibilidad de las APIs RESTful, ya que facilita la evolución de la API y minimiza la dependencia del cliente en cambios de implementación específicos.

### Referencias

> 1. https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design
> 2. https://medium.com/@bourgeoistomas/nested-entities-in-your-api-rest-response-best-practices-and-trade-offs-81260ec49b90
> 3. https://stackoverflow.com/questions/20951419/what-are-best-practices-for-rest-nested-resources
> 4. https://www.moesif.com/blog/api-guide/getting-started-with-apis/#core-principles-of-restful-api
> 5. https://www.moesif.com/blog/technical/api-design/REST-API-Design-Best-Practices-for-Sub-and-Nested-Resources/
> 6. https://martinfowler.com/articles/richardsonMaturityModel.html
> 7. https://github.com/microsoft/api-guidelines/blob/vNext/graph/articles/collections.md
