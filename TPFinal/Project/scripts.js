/**
 * Eventos al cargar cualquier pagina
 */
document.addEventListener('DOMContentLoaded', function() {
  //Importo json a localStorage
  if (!("profileData" in localStorage)) {
    fetch("/TPFinal/project/info/profile.json")
    .then(response => response.json())
    .then(data => {
      actualizarLocalStorage("profileData", data);
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

//Parseo profileData del localStorage
var DATOS__PERFIL = JSON.parse(localStorage.getItem("profileData"));

const arregloSoft = [
      ["Portal 2", "products/games/portal2/portal2.html", "products/games/portal2/game.gif", 9.99, "soft", ["puzzles", "fps", ]], 
      ["Dark Souls: Prepare To Die Edition", "products/games/darksouls/darksouls.html", "products/games/darksouls/game.gif", 19.99, "soft"],
      ["Dota 2", "products/games/dota2/dota2.html", "products/games/dota2/game.png", 0, "soft"], 
      ["The Elder Scrolls V: Skyrim", "products/games/skyrim/skyrim.html", "products/games/skyrim/game.png", 19.99, "soft"], 
      ["The Binding of Isaac: Rebirth", "products/games/tboir/tboir.html", "products/games/tboir/game.gif", 14.99, "soft"],
      ["Hotline Miami", "products/games/hotline/hotline.html", "products/games/hotline/game.gif", 9.99, "soft"],
      ["Counter Strike: Global Offensive", "products/games/csgo/csgo.html", "products/games/csgo/game.png", 0, "soft"],
      ["Garry's Mod", "products/games/gmod/gmod.html", "products/games/gmod/game.png", 9.99, "soft"],
      ["Mortal Kombat 11", "products/games/mk11/mk11.html", "products/games/mk11/game.png", 49.99, "soft"],
      ["Hatsune Miku: Project DIVA Mega Mix+", "products/games/projectdiva/projectdiva.html", "products/games/projectdiva/game.png", 39.39, "soft"]
  ];

const arregloMerch = [
    ["", "pages/products/merch/", "", "", "merch", ""],
    ["", "pages/products/merch/", "", "", "merch", ""],
    ["", "pages/products/merch/", "", "", "merch", ""],
    ["", "pages/products/merch/", "", "", "merch", ""],
    ["", "pages/products/merch/", "", "", "merch", ""],
    ["", "pages/products/merch/", "", "", "merch", ""],
    ["", "pages/products/merch/", "", "", "merch", ""],
    ["", "pages/products/merch/", "", "", "merch", ""],
    ["", "pages/products/merch/", "", "", "merch", ""],
    ["", "pages/products/merch/", "", "", "merch", ""]
  ];

const allPages = arregloSoft.concat(arregloMerch);

const arregloNoticias = [
  ['¡Inauguramos Black Mesa!', 'pages/news/n1/n1.html', "pages/news/n1/img.png", "", "", ""],
  ["Nuevos juegos", 'pages/news/n2/n2.html', "pages/news/n2/img.png", "", "", ""]
];

var paginasMostradas = [];

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
  elementoImg.src = DATOS__PERFIL.fotoPerfil;
}

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
 * FUNCIONES PARA ARRAYS DE SUBARRAYS QUE CONTENGAN DATOS DE PAGINAS 
 * [i][0]: Titulo, [i][1]: Ruta, [i][2]: Icono, [i][3]: Precio U$D
 * [i][4]: Categoria [i][5]: Etiquetas
**/

/**
 * Recupera paginas en el div #main__principal
 * tomando en cuenta los filtros del form #busqueda__filtros__formulario
 */
function recuperarProductosFiltrados() {
  //Borro divs del div principal
  eliminarHijosMain();

  //Filtro paginas con datos de formulario
  paginasMostradas = filtrarPaginas(allPages);

  //Cargo paginas en #main__principal
  recuperarProductos(paginasMostradas, '#main__principal');
}

/**
 * Carga un array de urls, titulos, icono y precio en divs 
 * y los inserta en el contenedor indicado por cadenaCont
 * @param {Array} arregloPaginas //Arreglo de url con sus titulos
 * @param {String} cadenaCont //String con id, clase o etiqueta de contenedor a cargar
 */
function recuperarProductos(arregloPaginas, cadenaCont) {
  //Obtengo primer contenedor que se identifique o sea clase de cadenaCont
  var divPrincipal = document.querySelector(cadenaCont);
  var cantPaginas = arregloPaginas.length;
  var pesoSeleccionado = (document.getElementById("peso")).checked;
  if (cantPaginas > 0) {
    for (var i = 0; i < cantPaginas; i++) {
      var paginaActual = arregloPaginas[i];
      //Crea elemento <div> donde se mostrara cada producto y su precio
      var nuevoDiv = document.createElement("div");
      nuevoDiv.classList.add("borde__activo");
      nuevoDiv.classList.add("div__cargado");

      //Crea elemento <a>
      var enlace = document.createElement("a");
      enlace.classList.add("producto__link");
      //Modificar el texto y href del enlace
      enlace.textContent = paginaActual[0];
      enlace.href = paginaActual[1];

      //Crea elemento <img> 
      var image = document.createElement("img");
      image.classList.add("producto__icon");
      //Modificar imagen de img
      image.src = paginaActual[2];
      //Agrega imagen a enlace
      enlace.appendChild(image);

      //Agrega enlace al nuevo div
      nuevoDiv.appendChild(enlace);

      if (paginaActual[3] >= 0) {
        //Crea elemento <div> y <p> que contendran al precio
        var contPrecio = document.createElement("div");
        contPrecio.classList.add("div__producto__precio");
        var precio = document.createElement("p");
        precio.classList.add("producto__precio");
        precio.id = "producto__precio";
        //Modifica texto de <p> y lo agrego a su <div>
        if (paginaActual[3] > 0) {
          //Verifico la opcion de moneda
          if (pesoSeleccionado) {
            precio.textContent = "AR$ "+ (dolarAPeso(paginaActual[3]));  
          } else {
            precio.textContent = "U$D "+ (paginaActual[3]);  
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
        agregarCarro.onclick = agregarProductoCarro.bind(null, paginaActual);
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
 * Recupera paginas al div indicado mostrando titulo e imagen
 * @param {Array} arregloPaginas //Contiene paginas 
 * @param {String} cadenaCont //Identificador de div (class o id)
 */
function recuperarPaginas(arregloPaginas, cadenaCont) {
  //Obtengo primer contenedor que se identifique o sea clase de cadenaCont
  var divPrincipal = document.querySelector(cadenaCont);
  var cantPaginas = arregloPaginas.length;
  if (cantPaginas > 0) {
    for (var i = 0; i < cantPaginas; i++) {
      var paginaActual = arregloPaginas[i];
      //Crea elemento <div> donde se mostrara cada producto y su precio
      var nuevoDiv = document.createElement("div");
      nuevoDiv.classList.add("borde__activo");
      nuevoDiv.classList.add("div__cargado");

      //Crea elemento <a>
      var enlace = document.createElement("a");
      enlace.classList.add("producto__link");
      //Modificar el texto y href del enlace
      enlace.textContent = paginaActual[0];
      enlace.href = paginaActual[1];

      //Crea elemento <img> 
      var image = document.createElement("img");
      image.classList.add("producto__icon");
      //Modificar imagen de img
      image.src = paginaActual[2];
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
 * Ordena ascendentemente un array de subarrays, tomando en cuenta
 * la primer posicion de los mismos 
 * @param {Array} arreglo //array de subarrays
 */
function ordenarAscendenteA(arreglo) {
  //Ordena arreglo
  arreglo.sort(function(a,b) {
      //obtengo los nombres de la posicion 0
      const nombreA = a[0].toUpperCase();
      const nombreB = b[0].toUpperCase();
      var res = comparaStrings(nombreA, nombreB);
      return res;
  });
}

/**
 * Ordena descendentemente un array de subarrays, tomando en cuenta
 * la primer posicion de los mismos 
 * @param {Array} arreglo //array de subarrays
 */
function ordenarDescendenteA(arreglo) {
  //Ordena arreglo
  arreglo.sort(function(a,b) {
      //obtengo los nombres de la posicion 0
      const nombreA = a[0].toUpperCase();
      const nombreB = b[0].toUpperCase();
      var res = comparaStrings(nombreA, nombreB);
      return -res;
  });
}

/**
 * Ordena ascendentemente un array de subarrays, tomando en cuenta
 * la cuarta posicion de los mismos (precio) 
 * @param {Array} arreglo //array de subarrays
 */
function ordenarAscendenteP(arreglo) {
  //Ordena arreglo
  arreglo.sort(function(a,b) {
      //obtengo los precios de la posicion 3
      return a[3] - b[3];
  });
}

/**
 * Ordena descendentemente un array de subarrays, tomando en cuenta
 * la cuarta posicion de los mismos (precio) 
 * @param {Array} arreglo //array de subarrays
 */
function ordenarDescendenteP(arreglo) {
  //Ordena arreglo
  arreglo.sort(function(a,b) {
      //obtengo los precios de la posicion 3
      return b[3] - a[3];
  });
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
 * Filtra y ordena array de paginas, segun formulario de filtros
 * dado por su id, quita elementos que no
 * cumplen condiciones, Retorna array filtrado y ordenado
*/
function filtrarPaginas(paginas) {
  //Recupera formulario con filtros elegidos
  var formBusqueda = document.getElementById("busqueda__filtros__formulario");

  //Busca filtros seleccionados y los aplica
  var filtros;
  filtros = buscarFiltros(formBusqueda);
  paginas = aplicarFiltros(paginas, filtros);

  //Realiza filtro de busqueda
  paginas = filtrarBusqueda(paginas, filtros);

  //Ordena arreglo de paginas filtrado
  var orden = null;
  orden = buscarOrden(formBusqueda);
  ordenar(paginas, orden);
 
  return paginas;
}

/**
 * Busca los filtros marcadados en el formulario
 * Retorna un arreglo de strings con cada seleccion
 * Agregar nuevos filtros al array filtros[]
 * @param {Element} form //Formulario donde obtienen los filtros
 */
function buscarFiltros(form) {
  //Array con filtros a aplicar, debe existir su funcion en filtrar()
  var filtros = ["categoria", "genero"]; //Se agrega un string por cada filtro agregado
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
 * Aplica filtros de un array de strings a un arreglo de paginas
 * Retorna el nuevo arreglo filtrado
 * @param {Array} arreglo //Conjunto de paginas
 * @param {Array} filtros //Cadenas referenciando a filtros
 */
function aplicarFiltros(arreglo, filtros) {
  for (var i = 0; i < filtros.length; i++) {
    arreglo = filtrar(arreglo, filtros[i]);
  }
  return arreglo;
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
 * Crea nuevo arreglo que contenga a la cadena de busqueda
 * Retorna arreglo nuevo
 * @param {Array} arreglo 
 */
function filtrarBusqueda(arreglo) {
  //Obtener los parámetros de búsqueda de la URL
  var parametrosURL = new URLSearchParams(window.location.search);
  var valorBusqueda = (parametrosURL.get("busqueda"));
  //Filtra arreglo segun cadena
  arreglo = filtrarCadena(arreglo, valorBusqueda);
  return arreglo;
}

/**
 * Filtra array de subarrays, quita elementos que no
 * cumplen condicion, retorna array nuevo modificado
 * @param {Array} arreglo
 * @param {String} cadena
 */
function filtrarCadena(arreglo, cadena) {
  //crea nuevo arreglo, con elementos que contengan la cadena
  if (cadena) {
    arreglo = arreglo.filter(elemento => 
        (elemento[0].toLowerCase().includes(cadena.toLowerCase().trim()))
      );
  }
  return arreglo;
}

/**
 * Ordena un arreglo segun un caso ingresado
 * Modifica el array directamente
 * @param {Array} arreglo 
 * @param {String} caso 
 */
function ordenar(arreglo, caso) {
  //Todos los ordenes (usa ids del form)
  switch (caso) {
    case "ascendenteA":
      ordenarAscendenteA(arreglo);
      break;
    case "descendenteA":
      ordenarDescendenteA(arreglo);
      break;
    case "ascendenteP":
      ordenarAscendenteP(arreglo);
      break;
    case "descendenteP":
      ordenarDescendenteP(arreglo);
      break;
  }
}

/**
 * Filtra un arreglo segun un filtro ingresado
 * Retorna array nuevo modificado
 * @param {Array} arreglo 
 * @param {String} filtro 
 */
function filtrar(arreglo, filtro){
  //Todos los filtros (usa ids del form)
  switch(filtro) {
    case "software":
      arreglo = filtrarSoftware(arreglo);
      break;
    case "merchandising":
      arreglo = filtrarMerchandising(arreglo);
      break;
  }
  return arreglo;
}

/**
 * Filtra un array, manteniendo el software
 * * Retorna array nuevo modificado
 * Considera posicion 4 de subarray
 * @param {Array} arreglo 
 */
function filtrarSoftware(arreglo) {
  arreglo = arreglo.filter(function(elemento) {
    return elemento[4] == "soft";
  });
  return arreglo;
}

/**
 * Filtra un array, manteniendo el merchandising
 * Retorna array nuevo modificado
 * Considera posicion 4 de subarray
 * @param {Array} arreglo 
 */
function filtrarMerchandising(arreglo) {
  arreglo = arreglo.filter(function(elemento) {
    return elemento[4] == "merch";
  });
  return arreglo;
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

function agregarProductoCarro(producto) {
  
  
    var divMain = document.getElementById("main__carro");
    var nuevoDiv = document.createElement("div");
    nuevoDiv.classList.add("producto__carro"); 
    nuevoDiv.classList.add("borde__inactivo");
    divMain.appendChild(nuevoDiv);



    //Crea elemento <img>
    var image = document.createElement("img");
    image.classList.add("producto__icon__carro");
    image.src = producto[2];
    nuevoDiv.appendChild(image);

    var titulo = document.createElement("p");
    titulo.id = "producto__titulo__carro";
    titulo.textContent = producto[0];
    nuevoDiv.appendChild(titulo);  
  
  


  /**
  * [i][0]: Titulo, [i][1]: Ruta, [i][2]: Icono, [i][3]: Precio U$D
  * [i][4]: Categoria [i][5]: Etiquetas
  */

    



}



