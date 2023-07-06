/**
 * Eventos al cargar cualquier pagina
 */
document.addEventListener('DOMContentLoaded', function() {
    //Importo profile.json a localStorage
    if (!("PROFILE__DATA" in localStorage)) {
      fetch("/info/profile.json")
      .then(response => response.json())
      .then(data => {
        actualizarLocalStorage("PROFILE__DATA", data);
        location.reload();
      });
    }
    //Importo productos.json a localStorage
    if (!("PRODUCTS__DATA" in localStorage)) {
      fetch("/info/productos.json")
      .then(response => response.json())
      .then(data => {
        actualizarLocalStorage("PRODUCTS__DATA", data);
        location.reload();
      });
    }
    
    //Importo noticias.json a localStorage
    if (!("NEWS__DATA" in localStorage)) {
      fetch("/info/noticias.json")
      .then(response => response.json())
      .then(data => {
        actualizarLocalStorage("NEWS__DATA", data);
        location.reload();
      });
    }
  
    //Importo carro.json a localStorage
    if (!("CART__DATA" in localStorage)) {
      fetch("/info/carro.json")
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
  
    recuperarFotoPerfil("navtop__profile__image");
    recuperarCarroUnidades("main__carro__unidades");
  });
  
  /*Parseo PROFILE__DATA, NEWS__DATA, PRODUCTS__DATA, y CART__DATA del localStorage
  para ser accedidos por el codigo*/
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
    redirigir(`/pages/catalogo.html?busqueda=${encodeURIComponent(valorBusqueda)}`);
  }
  
  /**
   * Redirige la ventana actual a la direccion url
   * ingresada por parametro
   * @param {String} url 
   */
  function redirigir(url) {
    window.location.href = url;
  }
  
  /**
   * Carga foto de perfil a un elemento <img> con idImg  
   * desde url obtenida del localStorage 
   * @param {String} elementoImg //Contenedor de la imagen a cargar
   */
  function recuperarFotoPerfil(idImg) {
    var elementoImg = document.getElementById(idImg);
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
   * merch/soft[i].precio (U$D), merch/soft[i].etiquetas
   * PRODUCTS__DATA: array con 2 subarrays
   * PRODUCTS__DATA.software: array de software
   * PRODUCTS__DATA.merchandising: array de merchandising
  **/
  
  /**
   * Recupera productos en el div #main__principal
   * tomando en cuenta los filtros del form con id
   * #busqueda__filtros__formulario
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
          agregarCarro.onclick = agregarAlCarro.bind(null, producto, "main__carro");
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
   * Agrega a un contenedor indicado por su id, el contenido
   * de CART__DATA
   * @param {Element} idContenedor //Div que contendra al carro
   * @param {Element} idTotal //Div que contendra al texto con el total
   */
  function recuperarCarro(idContenedor, idTotal) {
    if (idContenedor != null) {
      var divPrincipal = document.getElementById(idContenedor);
      eliminarHijos(divPrincipal);
      var cantProductos = CART__DATA.productos.length;
      var moneda = document.getElementById("pesosTotal").checked;
      if (cantProductos > 0) {
        for (var i = 0; i < cantProductos; i++) {
          var producto = CART__DATA.productos[i];
          //Div donde se almacenara toda la info del producto
          var nuevoDiv = document.createElement("div");
          nuevoDiv.classList.add("producto__carro"); 
          nuevoDiv.classList.add("borde__inactivo");
          divPrincipal.appendChild(nuevoDiv);
  
          //Crea elemento <img>
          var image = document.createElement("img");
          image.classList.add("producto__icon__carro");
          image.src = producto.icono;
          nuevoDiv.appendChild(image);
  
          //Conteneodr de titulo y enlace
          var tituloDiv = document.createElement("div");
          tituloDiv.classList.add("producto__titulo__carro");
          nuevoDiv.appendChild(tituloDiv);
          var titulo = document.createElement("p");
          titulo.id = "producto__titulo__carro";
          titulo.textContent = producto.titulo;
          var enlace = document.createElement("a");
          enlace.href = producto.ruta;
          enlace.target = "_blank"
          enlace.appendChild(titulo);
          tituloDiv.appendChild(enlace);
  
          //Contenedor de precio
          var precioDiv = document.createElement("div");
          precioDiv.classList.add("producto__precio__carro");
          var precio = document.createElement("p");
          if (moneda) {
            precio.textContent = "AR$ " + dolarAPeso(producto.precio);
          } else {
            precio.textContent = "U$D " + producto.precio;
          }
          precioDiv.appendChild(precio);
          nuevoDiv.appendChild(precioDiv); 
  
          //Creo <div> para botones de aumentar y disminuir unidades
          var botones = document.createElement("div");
          botones.classList.add("botones__carro");
  
          var sumar = document.createElement("button");
          sumar.classList.add("boton__carro");
  
          var signomas = document.createElement("p");
          signomas.textContent= "+";
          sumar.appendChild(signomas);
          sumar.onclick = agregarAlCarro.bind(null, producto, idContenedor);
  
          var restar = document.createElement("button");
          restar.classList.add("boton__carro");
          var signomenos = document.createElement("p");
          signomenos.textContent= "-";
          restar.appendChild(signomenos);
          restar.onclick = quitarDelCarro.bind(null, producto.titulo, idContenedor);
  
          var unidades = document.createElement("input");
          unidades.disabled = true;
          unidades.value = "x" +producto.unidades;
          unidades.classList.add("boton__carro");
          botones.appendChild(sumar);
          botones.appendChild(unidades);
          botones.appendChild(restar);
          nuevoDiv.appendChild(botones);
        }
      } else {
        //Contenedor de carro vacio
        var  vacioDiv= document.createElement("div");
        vacioDiv.classList.add("div__vacio");
        vacioDiv.classList.add("borde__activo");
        divPrincipal.appendChild(vacioDiv);
  
        var texto = document.createElement("p");
        texto.classList.add("aviso__vacio"); 
        texto.textContent = "Sin productos";
        vacioDiv.appendChild(texto);
      }
      var pTotal = document.getElementById(idTotal);
      var total = (CART__DATA.total).toFixed(2);
      if (moneda) {
        total = dolarAPeso(total);
        pTotal.textContent = "AR$ " + total;
      } else {
        pTotal.textContent = "U$D " + total
      }
    }
  }
  
  /**
   * Recupera las unidades en el carro desde 
   * CART__DATA a un input con idInput
   * @param {String} idInput //Donde se cargara el dato
   */
  function recuperarCarroUnidades(idInput) {
    actualizarUnidades();
    var elementoInput = document.getElementById(idInput);
    elementoInput.value = CART__DATA.unidades;
  }
  
  /**
   * Actualiza unidades de CART__DATA
   */
  function actualizarUnidades() {
    var unidades = 0;
    var cantidadProductos = CART__DATA.productos.length;
    for (var i = 0; i < cantidadProductos; i++) {
      var productoActual = CART__DATA.productos[i];
      unidades = productoActual.unidades + unidades;
    }
    CART__DATA.unidades = unidades;
    actualizarLocalStorage("CART__DATA", CART__DATA);
  }
  
  /**
   * Agrega unidad del producto ingresado al carro, aumentando el 
   * precio total de compra (U$D), lo agrega al carro visual si
   * es dado un idCarro, el mismo puede ser null
   * @param {Array} producto 
   */
  function agregarAlCarro(producto, idCarro) {
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
    if (idCarro != null) {
      recuperarCarro(idCarro, idCarro+"__total");
    }
  }
  
  /**
   * Realiza lo mismo que agregarAlCarro pero usando el 
   * titulo, ve si el producto existe y luego intenta 
   * agregarlo al localStorage, idCarro puede ser null
   * @param {String} titulo //Titulo a agregar
   */
  function agregarAlCarroTitulo(titulo, idCarro) {
    var producto = buscarProductoTitulo(titulo);
    if (producto != null) {
      agregarAlCarro(producto, idCarro);
    }
  }
  
  /**
   * Busca un producto por su titulo en PRODUCTS__DATA,
   * si lo encuentra, lo retorna
   * @param {String} titulo //Titulo a buscar
   */
  function buscarProductoTitulo(titulo) {
    var producto = null;
    if (titulo != "" && titulo != null) {
      var encontrado = false;
      //Busca titulo en arreglo de soft
      var i = 0;
      var cantSoftware = PRODUCTS__DATA.software.length;
      while (i < cantSoftware && !encontrado) {
        encontrado = (PRODUCTS__DATA.software[i].titulo == titulo);
        if (encontrado) {
          producto = PRODUCTS__DATA.software[i];
        }
        i++;
      }
  
      if (!encontrado) {
        //Si no se encontro, lo busca en el arreglo de merch
        var cantMerchandising = PRODUCTS__DATA.merchandising.length;
        i = 0;
        while (i < cantMerchandising && !encontrado) {
          encontrado = (PRODUCTS__DATA.merchandising[i].titulo == titulo);
          if (encontrado) {
            producto = PRODUCTS__DATA.merchandising[i];
          }
          i++;
        }
      }
    }
    return producto;
  }
  
  /**
   * Quita unidad del carro de un producto con titulo ingresado
   * si es que se encuentra, y disminuye el total de la compra (U$D)
   * @param {String} titulo 
   */
  function quitarDelCarro(titulo, idCarro) {
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
    recuperarCarro(idCarro, idCarro+"__total");
  }
  
  /**
   * Simula realizar la compra del carro cargado
   * @param {String} idCarro //Id del contenedor de productos
   */
  function comprarCarro(idCarro) {
    if(prompt("Ingrese su correo electronico para enviar sus productos: ",'example@blackmesa.com')) {
      vaciarCarro(idCarro);
      alert("¡Compra realizada con exito! Pronto recibira sus productos.");
    }
    recuperarCarro(idCarro, idCarro+"__total");
  }
  
  /**
   * Vacia el carro de compras
   * @param {String} idCarro //Id del contenedor de productos
   */
  function vaciarCarro(idCarro) {
    eliminarHijos(document.getElementById(idCarro));
    CART__DATA.productos = [];
    CART__DATA.total = 0;
    actualizarLocalStorage("CART__DATA", CART__DATA);
    recuperarCarro(idCarro, idCarro+"__total");
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
    var resultado = (valor * 256).toFixed(2);
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
  
  
  /**
   * Carga los respectivos datos a la pagina actual
   * de producto, segun su titulo
   * @param {String} titulo //Producto a cargar
   */
  function recuperaProducto(titulo) {
    var producto = buscarProductoTitulo(titulo);
    if (producto) {
      var portadaDiv = document.getElementById("producto__portada");
      portadaDiv.src = producto.portada;
      var descripcionP = document.getElementById("producto__descripcion");
      descripcionP.textContent = producto.descripcion;
      var pesosP = document.getElementById("producto__precio__pesos");
      var dolaresP = document.getElementById("producto__precio__dolares");
      var precioDolares = producto.precio;
      pesosP.textContent = "AR$ " + dolarAPeso(precioDolares);
      dolaresP.textContent = "U$D " + (precioDolares).toFixed(2);
      var imagenes = producto.imagenes;
      var cantImagenes = imagenes.length;
      if (cantImagenes > 0) {
        var imgDiv = document.getElementById("producto__imagenes");
        for (var i = 0; i < cantImagenes; i++) {
          var imagenActual = imagenes[i];
          var imagenDiv = document.createElement("div");
          imagenDiv.classList.add("producto__imagen");
          var imagen = document.createElement("img");
          imagen.src = imagenActual;
          var enlace = document.createElement("a");
          enlace.href = imagenActual;
          enlace.target = "_blank"
          enlace.appendChild(imagen);
          imagenDiv.appendChild(enlace);
  
          imgDiv.appendChild(imagenDiv);
        }
      }
      
  
    }
  }