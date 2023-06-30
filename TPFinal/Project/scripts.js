/**
 * Eventos al cargar las paginas
 */
document.addEventListener('DOMContentLoaded', function() {
  // Captura el formulario por su ID
  var form = document.getElementById('formulario__busqueda');

  // Agrega un controlador de eventos para el evento 'submit'
  form.addEventListener('submit', function(event) {
    // Evita que el formulario se envíe
    event.preventDefault();
    buscar();
  });
});


function buscar() {
  const buscador = document.getElementById("buscar");
  const valorBusqueda = buscador.value.toLowerCase();

  // Redirigir a catalogo.html con los parámetros de búsqueda en la URL
  window.location.href = `catalogo.html?busqueda=${encodeURIComponent(valorBusqueda)}`;
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
 * Carga un array de url y nombres a divs y los inserta en el cont
 * @param {Array} arregloPaginas //Arreglo de url con sus titulos
 * @param {String} cadenaCont //String con id, clase o etiqueta de contenedor a cargar
 */
function recuperarPaginas(arregloPaginas, cadenaCont) {
  //Obtengo primer contenedor que se identifique o sea clase de cadenaCont
  const divPrincipal = document.querySelector(cadenaCont);

  for (var i = 0; i <  arregloPaginas.length; i++) {
    //Crea elemento <div> y <a>
    var nuevoDiv = document.createElement("div");
    nuevoDiv.classList.add("borde__activo");
    nuevoDiv.classList.add("div__cargado");
    var enlace = document.createElement("a");

    //Modificar el texto del enlace y href
    enlace.textContent = arregloPaginas[i][0];
    enlace.href = arregloPaginas[i][1];
    
    //Agregar enlace al nuevoDiv
    nuevoDiv.appendChild(enlace);
    divPrincipal.appendChild(nuevoDiv);
  }  
}

/**
 * Ordena ascendentemente un array de subarrays, tomando en cuenta
 * la primer posicion de los mismos 
 * @param {Array} arreglo //array de subarrays
 */
function ordenarAscendente(arreglo) {
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
function ordenarDescendente(arreglo) {
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
 * Filtra array de subarrays, elimina elementos que no
 * cumplen condicion, retorna array nuevo modificado
 * @param {Array} arreglo
 * @param {String} cadena
 */
function eliminaNoRequeridos(arreglo, cadena) {
  //crea nuevo arreglo, quitando los elementos que no cumplan la condicion
  var nuevo = arreglo.filter(elemento => ((elemento[0].toLowerCase()).startsWith(cadena.toLowerCase())));
  return nuevo;
}