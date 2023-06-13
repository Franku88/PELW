/*Metodo principal, que verifica y notifica sobre los datos ingresados desde los inputs del formulario*/
function validar() {
    //Metodo que al realizar el submit, hace las comprobaciones necesarias
    //Verifica input de nombre
    var nom = verificarAlafabetico(document.getElementById("nombre"));
    //Verifica input de apellido
    var ape = verificarAlafabetico(document.getElementById("apellido"));
    //Verifica input de obra social
    var os = verificaInputTexto(document.getElementById("obras_sociales"));
    //Verifica input de direccion de correo electronico
    var em = verificarDireccionCorreo(document.getElementById("email"));
    //Verifica inputs de dia, mes y anio
    var fe = verificarFechaNacimiento(document.getElementById("dia"), document.getElementById("mes"), document.getElementById("anio"));
    //Verifica que este todo en orden
    var todoOk = nom && ape && os && os && em && fe;
    if (todoOk) {
        alert("Datos ingresados exitosamente")
    }
    return todoOk; 
}
/**********************************************************************************************/

/*Metodos verificadores, ademas de retornar un booleano, modifican el estilo de inputs para avisar errores */
function verificarAlafabetico(input) {
    //Verifica que el contenido de input contenga solo letras del alfabeto considerando tildes
    var texto = input.value;
    var verifTexto = validarAlfabetico(texto);
    if (!verifTexto) {
        //Si no es valido, lo resalta en rojo durante un tiempo determinado
        notificaError(input);
    }
    return verifTexto;
}

function verificaInputTexto(input) {
    //Verifica el contenido de un input no sea vacio
    var verifTexto = (input.value.trim() != "");
    if (!verifTexto) {
        //Si no es valido, lo resalta en rojo durante un tiempo determinado
        notificaError(input);
    }
    return verifTexto;
}

function verificarDireccionCorreo(input) {
    //Verifica el contenido del input, que debe ser una direccion de correo
    var verifEmail = esEmailValido(input.value);
    if (!verifEmail) {
        //Si no es valido, lo resalta en rojo durante un tiempo determinado
        notificaError(input);
    }
    return verifEmail;
}

function verificarFechaNacimiento(inputDia, inputMes, inputAnio) {
    //Metodo que retorna verdadero si una fecha ingresada es valida para un nacimiento (anterior a fecha actual)
    var valida = verificaFechaValida(inputDia, inputMes, inputAnio);
    //Si la fecha ingresada es valida
    if (valida) {
        //Obtengo datos de fecha ingresados
        var dia = parseInt(inputDia.value);
        var mes = parseInt(inputMes.value);
        var anio = parseInt(inputAnio.value);
        //Obtengo datos de fecha actual
        var fechaActual = new Date();
        var anioActual = fechaActual.getFullYear();
        var diaActual = fechaActual.getDate();
        var mesActual = fechaActual.getMonth()+1;
        //Verifica que la fecha sea anterior o igual a la actual
        switch (true) {
            case (anio > anioActual):
                //Si anio mayor al actual, no sucedio nacimiento
                notificaError(inputAnio);
                valida = false;
                break;
            case (anio == anioActual) && (mes > mesActual):
                //Si mes mayor al actual con anio igual al actual, no sucedio nacimiento
                notificaError(inputMes);
                valida = false;
                break;
            case (anio == anioActual) && (mes == mesActual) && (dia > diaActual):
                //Si dia mayor al actual con anio y mes iguales a los actuales, no sucedio nacimiento
                notificaError(inputDia);
                valida = false;
                break;
            default:
                break;
        }
    }
    return valida;
}

function verificaFechaValida(inputDia, inputMes, inputAnio) {
    //Metodo que retorna verdadero si una fecha ingresada es valida
    //Almaceno datos ingresados
    var dia = parseInt(inputDia.value);
    var mes = parseInt(inputMes.value);
    var anio = parseInt(inputAnio.value);
    //Cantidad de dias por mes
    var diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    //Modifica dias de febrero si es anio bisiesto
    if (esBisiesto(anio)) {
        diasPorMes[1] = 29;
    }
    //Verifica que el dia, mes y anio sean validos y lo notifica
    var diaValido = (esEnteroPositivo(dia) && (dia > 0) && (dia <= diasPorMes[mes-1]));
    if (!diaValido) {
        notificaError(inputDia);
    }
    var mesValido = (esEnteroPositivo(mes) && (mes > 0) && (mes < 13));
    if (!mesValido) {
        notificaError(inputMes);
    }
    var anioValido = esEnteroPositivo(anio);
    if (!anioValido) {
        notificaError(inputAnio);
    }
    return diaValido && mesValido && anioValido;;
}
/**********************************************************************************************/

//Metodo utilizado para resaltar una advertencia
function notificaError(input) {
    //Cambia de color del borde de un input durante un tiempo determinado
    var bordeOriginal = input.style.borderColor;
    var fondoOriginal = input.style.backgroundColor;
    input.style.borderColor = "red";
    input.style.backgroundColor = "#FFC0CB";
    setTimeout(function() {
        input.style.borderColor = bordeOriginal;
        input.style.backgroundColor = fondoOriginal;
    }, 1500);
}
/**********************************************************************************************/

/*Metodos que validan el contenido de un string*/
function validarAlfabetico(cadAlfabeto) {
    //Retorna verdadero si cadAlfabeto cumple con la expresion regular ex
    var ex = /^[a-zA-ZÀ-ÿ]+$/;
    return ex.test(cadAlfabeto);
}

function validarUserMail(userMail) {
    //Retorna verdadero si userMail cumple con la expresion regular ex
    var ex = /^(?!\.)[A-Za-z0-9+_.-]+(?<!\.)$/;
    return ex.test(userMail);
}

function validarDominioMail(dominioMail) {
    //Retorna verdadero si dominioMail cumple con la expresion regular ex
    var ex = /^(?!\.)[A-Za-z0-9.-]+(?<!\.)\.[A-Za-z]+$/;
    return ex.test(dominioMail);
}

function esEmailValido(email) {
    //Verifica que email sea una direccion de correo valida
    var valido = false;
    //Busca primer aparicion de @
    var indiceArroba = email.indexOf("@");
    if (indiceArroba > 0) {
        var user, dominio;
        //Almacena parte de user (antes del @)
        user = email.substring(0,indiceArroba);
        //Verifica formato del user 
        if (validarUserMail(user)) { //Si es valido
            //Almacena parte de dominio (despues del @)
            dominio = email.substring(indiceArroba+1, email.length);
            //Verifica formato del dominio
            valido = validarDominioMail(dominio); //Si ambos son validos, retorna true
        }
    }
    return valido;
}

function esBisiesto(anio) {
    //Verifica si un anio ingresado es bisiesto
    var verifica = (anio%4 == 0 && (anio%100 != 0 || anio%400 == 0));
    return verifica;
}

function esEnteroPositivo(num) {
    //Retorna positivo si un valor es entero y positivo
    var verifica = Number.isInteger(num) && (num > 0);
    return verifica;
}
/**********************************************************************************************/