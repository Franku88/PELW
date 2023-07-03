/**
 * Eventos al cargar cualquier pagina
 */
document.addEventListener('DOMContentLoaded', function() {
  //Importo profile.json a localStorage
  if (!("PROFILE__DATA" in localStorage)) {
    fetch("/TPFinal/project/info/profile.json")
    .then(response => response.json())
    .then(data => {
      actualizarLocalStorage("PROFILE__DATA", data);
      location.reload();
    });
  }
  //Importo productos.json a localStorage
  if (!("PRODUCTS__DATA" in localStorage)) {
    fetch("/TPFinal/Project/info/productos.json")
    .then(response => response.json())
    .then(data => {
      actualizarLocalStorage("PRODUCTS__DATA", data);
      location.reload();
    });
  }

  if (!("NEWS__DATA" in localStorage)) {
    fetch("/TPFinal/Project/info/noticias.json")
    .then(response => response.json())
    .then(data => {
      actualizarLocalStorage("NEWS__DATA", data);
      location.reload();
    });
  }

  if (!("CART__DATA" in localStorage)) {
    fetch("/TPFinal/Project/info/carro.json")
    .then(response => response.json())
    .then(data => {
      actualizarLocalStorage("CART__DATA", data);
      location.reload();
    });
  }

  // Captura el formulario de busqueda por su ID
  var form = document.getElementById('formulario__busqueda');
  // Agrega un controlador de eventos para el evento 'submit'
  form.addEventListener('submit', function(event) {
    // Evita que el formulario se envíe
    event.preventDefault();
    redirigirBusqueda();
  });

  recuperarFotoPerfil(document.getElementById("navtop__profile__image"));
});

//Parseo PROFILE__DATA y PRODUCTS__DATA del localStorage
const PROFILE__DATA = JSON.parse(localStorage.getItem("PROFILE__DATA"));
const NEWS__DATA = JSON.parse(localStorage.getItem("NEWS__DATA"));
const PRODUCTS__DATA = JSON.parse(localStorage.getItem("PRODUCTS__DATA"));
const CART__DATA = JSON.parse(localStorage.getItem("CART__DATA"));


/**
 * Actualiza los datos de una llave en local storage
 * por los de un objetoJson
 * @param {String} llave //Identificador donde se guardaran los datos nuevos
 * @param {JSON} objetoJson //Donde se obtienen datos nuevos
 */
function actualizarLocalStorage(llave, objetoJson) {
  localStorage.setItem(llave, JSON.stringify(objetoJson));
}

/**
 * Redirige la pagina actual a catalogo.html junto al parametro de busqueda
 */
function redirigirBusqueda() {
  //Obtiene elemento con filtro de busqueda y obtiene string
  const buscador = document.getElementById("buscar");
  const valorBusqueda = buscador.value.toLowerCase();

  //Redirigir a catalogo.html con los parámetros de búsqueda (string) en la URL
  window.location.href = `catalogo.html?busqueda=${encodeURIComponent(valorBusqueda)}`;
}

/**
 * Carga foto de perfil a un contenedor desde url del localStorage 
 * @param {Element} elementoImg //Contenedor de la imagen a cargar
 */
function recuperarFotoPerfil(elementoImg) {
  elementoImg.src = PROFILE__DATA.fotoPerfil;
}

/**
 * Cambia de estado disabled/enabled a un conjunto de elementos de un arreglo 
 * @param {input[]} arreglo //array con inputs a modificar 
 */
function interruptorInputs(arreglo) {
  for (var i = 0; i < arreglo.length; i++) {
    interruptorInput(arreglo[i]);
  }
}

/**
 * Cambia de estado disabled/enabled a un conjunto de elementos de una clase
 * @param {String} clase //clase de elementos a modificar
 */
function interruptorInputsClase(clase) {
  var inputs = document.getElementsByClassName(clase);
  interruptorInputs(inputs);
}

/**
 * 
 * @param {Element} form //Formulario a modificar
 * @param {String} tipo //Tipo de input a modificar
 */
function interruptorInputsTipo(form, tipo) {
  //Cambia de estado disabled/enabled a un conjunto de elementos de un tipo dentro de un form
  var inputs = form.querySelectorAll('input[type="'+tipo+'"]');
  interruptorInputs(inputs);
}

/**
 * Habilita/deshabilita input
 * @param {input} input 
 */
function interruptorInput(input) {
  input.disabled = !input.disabled;
}

/**
 * FUNCIONES PARA ARRAYS DE SUBARRAYS QUE CONTENGAN DATOS DE PRODUCTOS 
 * merch/soft[i].titulo, merch/soft[i].ruta, merch/soft[i].icono, 
 * merch/soft[i].precio U$D, merch/soft[i].etiquetas
 * PRODUCTS__DATA: array con 2 subarrays
 * PRODUCTS__DATA.software: array de software
 * PRODUCTS__DATA.merchandising: array de merchandising
**/

/**
 * Recupera productos en el div #main__principal
 * tomando en cuenta los filtros del form #busqueda__filtros__formulario
 */
function recuperarProductosFiltrados() {
  //Borro divs del div principal
  eliminarHijosMain();
  
  //Filtro productos con datos de formulario
  var productosMostrados = PRODUCTS__DATA;
  productosMostrados = filtrarProductos(productosMostrados);
  

  //Cargo productos en #main__principal
  recuperarProductos(productosMostrados, '#main__principal');
}

/**
 * Filtra y ordena array de productos, segun formulario de filtros
 * dado por su id, quita elementos que no
 * cumplen condiciones, Retorna array filtrado y ordenado
*/
function filtrarProductos(productos) {
  //Recupera formulario con filtros elegidos
  var formBusqueda = document.getElementById("busqueda__filtros__formulario");

  //Busca filtros seleccionados y los aplica
  var filtros = buscarFiltros(formBusqueda); 
  productos = aplicarFiltros(productos, filtros);

  //Realiza filtro de busqueda
  productos = filtrarBusqueda(productos, filtros);

  //Ordena arreglo de productos filtrado
  var orden = buscarOrden(formBusqueda);
  ordenar(productos, orden);
 
  return productos;
}

/**
 * Busca los filtros marcadados en el formulario
 * Retorna un arreglo de strings con cada seleccion
 * Agregar nuevos filtros al array filtros[]
 * @param {Element} form //Formulario donde obtienen los filtros
 */
function buscarFiltros(form) {
  //Array con filtros a aplicar, debe existir su funcion en filtrar()
  var filtros = ["categoria"]; //Se agrega un string por cada filtro agregado
  var seleccion = [];
  var inputs;
  var j;
  var encontrado;
  //Busca filtros en el formulario
  for (var i = 0; i < filtros.length; i++) {
    inputs = form.querySelectorAll( '[name='+filtros[i]+']');
    j = 0; encontrado = false;
    //Busca de cada input, los que esten marcados y los agrega a seleccion
    while (j < inputs.length) {
      encontrado = inputs[j].checked;
      if (encontrado) {
        seleccion.push(inputs[j].id);
      }
      j++;
    }
  }
  return seleccion;
}

/**
 * Aplica filtros de un array de strings a un arreglo de productos
 * Retorna el nuevo arreglo filtrado
 * @param {Array} productos //Conjunto de productos
 * @param {Array} filtros //Cadenas referenciando a filtros
 */
function aplicarFiltros(productos, filtros) {
  for (var i = 0; i < filtros.length; i++) {
    productos = filtrar(productos, filtros[i]);
  }
  return productos;
}

/**
 * Filtra un arreglo segun un filtro ingresado
 * Retorna array nuevo modificado
 * @param {Array} productos 
 * @param {String} filtro 
 */
function filtrar(productos, filtro){
  //Todos los filtros (usa ids del form)
  //productos: un array con 2 subarrays
  //productos.software: array de software
  //productos.merchandising: array de merchandising
  switch(filtro) {
    case "software":
      productos = productos.software;
      break;
    case "merchandising":
      productos = productos.merchandising;
      break;
    default:
      var software = productos.software;
      var merchandising = productos.merchandising;
      productos = software.concat(merchandising);
      break;
  }
  return productos;
}

/**
 * Crea nuevo arreglo con titulos que contengan a la cadena de busqueda
 * Retorna arreglo nuevo
 * @param {Array} productos 
 */
function filtrarBusqueda(productos) {
  //Obtener los parámetros de búsqueda de la URL
  var parametrosURL = new URLSearchParams(window.location.search);
  var valorBusqueda = (parametrosURL.get("busqueda"));
  //Filtra arreglo segun cadena
  productos = filtrarCadena(productos, valorBusqueda);
  return productos;
}

/**
 * Filtra array de subarrays, quita elementos que no
 * cumplen condicion, retorna array nuevo modificado
 * @param {Array} productos
 * @param {String} cadena
 */
function filtrarCadena(productos, cadena) {
  //crea nuevo arreglo, con elementos que contengan la cadena
  if (cadena) {
    productos = productos.filter(elemento => 
        (elemento.titulo).toLowerCase().includes(cadena.toLowerCase().trim())
      );
  }
  return productos;
}

/**
 * Busca orden seleccionado en formulario.
 * Retorna id del input en estado checked de la coleccion
 * de elementos con name="orden".
 * @param {Element} form //Formulario donde obtiene el orden elegido
 */
function buscarOrden(form) {
  var encontrado = false;
  var i = 0;
  var orden = null;
  //Busca inputs con name orden del formulario ingreasado
  inputs = form.querySelectorAll('[name="orden"]');
  while (!encontrado && i < inputs.length) {
    encontrado = inputs[i].checked;
    if(encontrado) {
      orden = inputs[i].id;
    }
    i++;
  } 
  return orden;
}

/**
 * Ordena un arreglo segun un caso ingresado
 * Modifica el array directamente
 * @param {Array} productos 
 * @param {String} caso 
 */
function ordenar(productos, caso) {
  //Todos los ordenes (usa ids del form)
  switch (caso) {
    case "ascendenteA":
      ordenarAscendenteA(productos);
      break;
    case "descendenteA":
      ordenarDescendenteA(productos);
      break;
    case "ascendenteP":
      ordenarAscendenteP(productos);
      break;
    case "descendenteP":
      ordenarDescendenteP(productos);
      break;
  }
}

/**
 * Ordena ascendentemente un array de productos, tomando en cuenta
 * el titulo de los mismos 
 * @param {Array} productos //array de productos
 */
function ordenarAscendenteA(productos) {
  //Ordena arreglo
  productos.sort(function(a,b) {
    var tituloA = (a.titulo).toUpperCase();
    var tituloB = (b.titulo).toUpperCase();
    var res = comparaStrings(tituloA, tituloB);
    return res;
  });
}

/**
 * Ordena descendentemente un array de subarrays, tomando en cuenta
 * la primer posicion de los mismos 
 * @param {Array} productos //array de subarrays
 */
function ordenarDescendenteA(productos) {
  //Ordena arreglo
  productos.sort(function(a,b) {
    var tituloA = (a.titulo).toUpperCase();
    var tituloB = (b.titulo).toUpperCase();
    var res = comparaStrings(tituloA, tituloB);
    return -res;
  });
}

/**
 * Ordena ascendentemente un array de subarrays, tomando en cuenta
 * la cuarta posicion de los mismos (precio) 
 * @param {Array} productos //array de subarrays
 */
function ordenarAscendenteP(productos) {
  //Ordena arreglo
  productos.sort(function(a,b) {
      //obtengo los precios
      var precioA = a.precio;
      var precioB = b.precio;
      return  precioA - precioB;
  });
}

/**
 * Ordena descendentemente un array de subarrays, tomando en cuenta
 * la cuarta posicion de los mismos (precio) 
 * @param {Array} productos //array de subarrays
 */
function ordenarDescendenteP(productos) {
  //Ordena arreglo
  productos.sort(function(a,b) {
      //obtengo los precios
      var precioA = a.precio;
      var precioB = b.precio;
      return precioB - precioA;
  });
}

/**
 * Carga un array de urls, titulos, icono y precio en divs 
 * y los inserta en el contenedor indicado por cadenaCont
 * @param {Array} productos //Arreglo productos
 * @param {String} cadenaCont //String con id, clase o etiqueta de contenedor a cargar
 */
function recuperarProductos(productos, cadenaCont) {
  //Obtengo primer contenedor que se identifique o sea clase de cadenaCont
  var divPrincipal = document.querySelector(cadenaCont);
  var cantPaginas = productos.length;
  var pesoSeleccionado = (document.getElementById("peso")).checked;
  if (cantPaginas > 0) {
    for (var i = 0; i < cantPaginas; i++) {
      var producto = productos[i];
      //Crea elemento <div> donde se mostrara cada producto y su precio
      var nuevoDiv = document.createElement("div");
      nuevoDiv.classList.add("borde__activo");
      nuevoDiv.classList.add("div__cargado");

      //Crea elemento <a>
      var enlace = document.createElement("a");
      enlace.classList.add("producto__link");
      var titulo = document.createElement("p");
      titulo.textContent = producto.titulo;
      //Modificar el texto y href del enlace
      enlace.appendChild(titulo);
      enlace.href = producto.ruta;

      //Crea elemento <img> 
      var image = document.createElement("img");
      image.classList.add("producto__icon");
      //Modificar imagen de img
      image.src = producto.icono;
      //Agrega imagen a enlace
      enlace.appendChild(image);

      //Agrega enlace al nuevo div
      nuevoDiv.appendChild(enlace);

      if (producto.precio >= 0) {
        //Crea elemento <div> y <p> que contendran al precio
        var contPrecio = document.createElement("div");
        contPrecio.classList.add("div__producto__precio");
        var precio = document.createElement("p");
        precio.classList.add("producto__precio");
        precio.id = "producto__precio";
        //Modifica texto de <p> y lo agrego a su <div>
        if (producto.precio > 0) {
          //Verifico la opcion de moneda
          if (pesoSeleccionado) {
            precio.textContent = "AR$ "+ (dolarAPeso(producto.precio));  
          } else {
            precio.textContent = "U$D "+ (producto.precio);  
          }
          
        } else {
          precio.textContent = "GRATIS";
        }
        //Agrego precio a su contenedor
        contPrecio.appendChild(precio);

        //Crea elemento button para agregar producto al carro
        var agregarCarro = document.createElement("button");
        agregarCarro.classList.add("producto__agregar__carro");
        agregarCarro.classList.add("borde__inactivo");
        agregarCarro.textContent = "Agregar al carro";
        //QUEDASTE ACA. LOGRASTE PONER IMAGENES, FALTA PRECIO Y TITULO
        //QUE LOS PRECIOS SE VAYAN SUMANDO Y QUE SE PUEDAN ELIMINAR CON UN BOTON
        //ADEMAS DE AGREGAR EXISTENCIAS
        agregarCarro.onclick = agregarAlCarro.bind(null, producto);
        contPrecio.appendChild(agregarCarro);
        
        //Agrega precio y boton al nuevoDiv
        nuevoDiv.appendChild(contPrecio);
      }

      //Agrega div contenedor del producto al principal
      divPrincipal.appendChild(nuevoDiv);
    }
  } else {
    //Si el arreglo no tiene paginas, agrega un div de aviso
    var nuevoDiv = document.createElement("div");
    nuevoDiv.classList.add("borde__activo");
    nuevoDiv.classList.add("div__cargado");
    var parrafo = document.createElement("p");

    //Modificar el texto del enlace
    parrafo.textContent = "Sin coincidencias";
    
    nuevoDiv.appendChild(parrafo);
    divPrincipal.appendChild(nuevoDiv);
  }
}

/**
 * Agrega unidad del producto ingresado al carro, aumentando el 
 * precio total de compra (U$D)
 * @param {Array} producto 
 */
function agregarAlCarro(producto) {
  var i = 0;
  var encontrado = false;
  while (i < CART__DATA.productos.length && !encontrado) {
    encontrado = CART__DATA.productos[i].titulo == producto.titulo;
    if (encontrado) {
      //Si ya se encuentra en el carro, aumenta unidades
      CART__DATA.productos[i].unidades++;
    }
    i++;
  }
  //Si no se encuentra, crea el objeto y lo agrega al carro
  if (!encontrado) {
    var agregado = {
      "titulo": producto.titulo,
      "ruta": producto.ruta,
      "icono": producto.icono,
      "precio": producto.precio,
      "etiquetas": producto.etiquetas,
      "unidades": 1
    };
    CART__DATA.productos.push(agregado);
  }
  //Aumenta total del carrito
  CART__DATA.total +=  producto.precio;
  //Aplica cambios
  actualizarLocalStorage("CART__DATA", CART__DATA);
  recuperarCarro("main__carro", "main__carro__total");
}


/**
 * Quita unidad del carro de un producto con titulo ingresado
 * si es que se encuentra, y disminuye el total de la compra (U$D)
 * @param {String} titulo 
 */
function quitarDelCarro(titulo) {
  var i = 0;
  var encontrado = false;
  while (i < CART__DATA.productos.length && !encontrado) {
    encontrado = CART__DATA.productos[i].titulo == titulo;
    if (encontrado) {
      //Si lo encuentra, disminuye unidades
      CART__DATA.productos[i].unidades--;
      //Disminuye total del carro
      CART__DATA.total -= CART__DATA.productos[i].precio;
      if (CART__DATA.productos[i].unidades < 1) {
        //Si hay 0 unidades, quita elemento del carro
        CART__DATA.productos.splice(i, 1);
      }
    }
    i++;
  }
  //Aplica cambios
  actualizarLocalStorage("CART__DATA", CART__DATA);
  recuperarCarro("main__carro", "main__carro__total");
}

/**
 * Agrega a un contenedor indicado por su id, el contenido
 * de CART__DATA
 */
function recuperarCarro(idContenedor, idTotal) {
  var divPrincipal = document.getElementById(idContenedor);
  eliminarHijos(divPrincipal);

  var moneda = document.getElementById("pesosTotal").checked;
  for (var i = 0; i < CART__DATA.productos.length; i++) {
    var producto = CART__DATA.productos[i];
    var nuevoDiv = document.createElement("div");
    nuevoDiv.classList.add("producto__carro"); 
    nuevoDiv.classList.add("borde__inactivo");
    divPrincipal.appendChild(nuevoDiv);

    //Conteneodr de titulo e icon
    var tituloDiv = document.createElement("div");
    tituloDiv.classList.add("producto__titulo__carro");
    nuevoDiv.appendChild(tituloDiv);

    //Creo <div> para botones de aumentar y disminuir unidades
    var botones = document.createElement("div");
    botones.classList.add("botones__carro");
    var sumar = document.createElement("button");
    sumar.classList.add("boton__carro");
    var signomas = document.createElement("p");
    signomas.textContent= "+";
    sumar.appendChild(signomas);
    sumar.onclick = agregarAlCarro.bind(null, producto);
    var restar = document.createElement("button");
    restar.classList.add("boton__carro");
    var signomenos = document.createElement("p");
    signomenos.textContent= "-";
    restar.appendChild(signomenos);
    restar.onclick = quitarDelCarro.bind(null, producto.titulo);
    var unidades = document.createElement("input");
    unidades.disabled = true;
    unidades.value = producto.unidades;
    unidades.classList.add("boton__carro");
    botones.appendChild(sumar);
    botones.appendChild(unidades);
    botones.appendChild(restar);
    nuevoDiv.appendChild(botones);

    //Crea elemento <img>
    var image = document.createElement("img");
    image.classList.add("producto__icon__carro");
    image.src = producto.icono;
    tituloDiv.appendChild(image);

    var titulo = document.createElement("p");
    titulo.id = "producto__titulo__carro";
    titulo.textContent = producto.titulo;
    tituloDiv.appendChild(titulo);  
    
    var precio = document.createElement("p");
    if (moneda) {
      precio.textContent = "AR$ " + dolarAPeso(producto.precio);
    } else {
      precio.textContent = "U$D " + producto.precio;
    }
    
    nuevoDiv.appendChild(precio); 
  }
  var pTotal = document.getElementById(idTotal);
  var total;
  if (moneda) {
    total = dolarAPeso(CART__DATA.total);
    pTotal.textContent = "AR$ " + total;
  } else {
    total = (CART__DATA.total).toFixed(2);
    pTotal.textContent = "U$D " + total
  }
  
}

/**
 * Recupera paginas al div indicado mostrando titulo e imagen
 * @param {Array} noticias //Contiene noticias 
 * @param {String} cadenaCont //Identificador de div (class o id)
 */
function recuperarNoticias(noticias, cadenaCont) {
  //Obtengo primer contenedor que se identifique o sea clase de cadenaCont
  var divPrincipal = document.querySelector(cadenaCont);
  var cantPaginas = noticias.length;
  if (cantPaginas > 0) {
    for (var i = 0; i < cantPaginas; i++) {
      var noticia = noticias[i];
      //Crea elemento <div> donde se mostrara cada producto y su precio
      var nuevoDiv = document.createElement("div");
      nuevoDiv.classList.add("borde__activo");
      nuevoDiv.classList.add("div__cargado");

      //Crea elemento <a>
      var enlace = document.createElement("a");
      enlace.classList.add("producto__link");
      //Modificar el texto y href del enlace
      enlace.textContent = noticia.titulo;
      enlace.href = noticia.ruta;

      //Crea elemento <img> 
      var image = document.createElement("img");
      image.classList.add("producto__icon");
      //Modificar imagen de img
      image.src = noticia.icono;
      //Agrega enlace e imagen 
      enlace.appendChild(image);

      //Agrega enlace al nuevo div
      nuevoDiv.appendChild(enlace);

      //Agrega div contenedor del producto al principal
      divPrincipal.appendChild(nuevoDiv);
    }
  } else {
    //Si el arreglo no tiene paginas, agrega un div de aviso
    var nuevoDiv = document.createElement("div");
    nuevoDiv.classList.add("borde__activo");
    nuevoDiv.classList.add("div__cargado");
    var parrafo = document.createElement("p");

    //Modificar el texto del enlace
    parrafo.textContent = "Sin coincidencias";
    
    nuevoDiv.appendChild(parrafo);
    divPrincipal.appendChild(nuevoDiv);
  }
}

/**
 * Compara dos cadenas lexicograficamente
 * Retorna + si cadenaA>cadenaB, - en lo contrario
 * Retorna 0 si son iguales
 * @param {String} cadenaA 
 * @param {String} cadenaB 
 * @returns 
 */
function comparaStrings(cadenaA, cadenaB) {
  var res;
  //comparo lexicograficamente los strings
  if (cadenaA > cadenaB) {
    res = 1;
  } else {
    if (cadenaA < cadenaB) {
      res = -1;
    } else  {
        res = 0;
    }
  }
  return res;
}

/**
 * Pasa un valor en dolares a pesos con dos decimales
 * Considerando U$D 1.00 == AR$ 256.45
 * @param {Number} valor 
 */
function dolarAPeso(valor) {
  var resultado = (valor * 256.45).toFixed(2);
  return resultado;
}

/**
 * Elimina todos los elementos hijos de contenedor #main__principal
 */
function eliminarHijosMain() {
  var contenedor = document.getElementById('main__principal');
  eliminarHijos(contenedor);
}

/**
 * Elimina todos los elementos hijos de contenedor
 * @param {Element} contenedor 
 */
function eliminarHijos(contenedor) {
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
}
