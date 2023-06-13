function validar() {
    //Metodo que al realizar el submit, hace las comprobaciones necesarias
    //Verifica input de nombre
    verificaInputTexto(document.getElementById("nombre"));
    //Verifica input de apellido
    verificaInputTexto(document.getElementById("apellido"));
    //Verifica input de obra social
    verificaInputTexto(document.getElementById("obras_sociales"));
}

function verificaInputTexto(input) {
    //Verifica el contenido de un input de texto
    var verifTexto = (input.value.trim() != "");
    //Depende el caso, cambia color de border
    if (verifTexto) {
        notificaOk(input);
    } else {
        notificaError(input);
    }
}

function notificaError(input) {
    input.style.borderColor = "red";
}

function notificaOk(input) {
    input.style.borderColor = "green";
}

function esEnteroPositivo(num) {
    //Metodo que retorna positivo si un valor es entero y positivo
    var verifica = Number.isInteger(num) && num > 0;
    return verifica;
}

function esFechaValida(dia, mes, anio) {
    //Metodo que retorna verdadero si una fecha ingresada es valida
    //Variable de retorno
    var valida = true;
    //Cantidad de dias por mes
    var diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    //Modifica dias de febrero si es anio bisiesto
    if (verificaBisiesto(anio)) {
        diasPorMes[1] = 29;
    }
    //Verifica que el dia y mes sean validos
    var mesValido = (mes > 0 && mes < 13);
    var diaValido = (dia > 0 && dia <= diasPorMes[mes-1]);
    valida =  diaValido && mesValido;

    return valida;
}

function verificaBisiesto(anio) {
    //Metodo que verifica si un anio ingresado es bisiesto
    var verifica = (anio%4 == 0 && (anio%100 != 0 || anio%400 == 0))
    return verifica;
}

function esFechaNacimientoValida(dia, mes, anio) {
    //Metodo que retorna verdadero si una fecha ingresada es valida para un nacimiento (anterior a fecha actual)
    //Variable de retorno
    var valida = esFechaValida(dia, mes, anio);
    //Si la fecha ingresada es valida
    if (valida) {
        //Obtengo datos de fecha actual
        var fechaActual = new Date();
        var anioActual = fechaActual.getFullYear();
        var diaActual = fechaActual.getDate();
        var mesActual = fechaActual.getMonth()+1;

        //Verifica que la fecha sea anterior o igual a la actual
        if (anio <= anioActual) {
            if (anio == anioActual) { //Si estamos en el mismo anio
                if (mes <= mesActual) { //Si mes no es mayor al actual
                    valida = dia <= diaActual; //Verifica que el dia no sea mayor al actual
                    notificaError();
                } else { //mes mayor al actual con anio igual al actual, no sucedio nacimiento
                    valida = false;
                }
            }
        } else { //anio mayor al actual, no sucedio nacimiento
            valida = false;
        }
        return valida;
    }   
}

function esEmailValido(email) {
    var valido;
    indiceArroba = email.indexOf("@");
    if (indiceArroba > 0) {
        var user, dominio;
        user = email.substring(0,indiceArroba);
        if (validarUserMail(user)) {
            dominio = email.substring(indiceArroba+1, email.length);
            valido = validarDominioMail(dominio);
        }
        

    } else {
        valido = false;
    }
    return valido;
}

function validarUserMail(userMail) {
    //Retorna verdadero si userMail cumple con la expresion regular ex
    var ex = /^[A-Za-z0-9+_.-]+(?<!\.)$/;
    return ex.test(userMail);
}

function validarDominioMail(dominioMail) {
    //Retorna verdadero si dominioMail cumple con la expresion regular ex
    var ex = /^[A-Za-z0-9.-]+(?<!\.)\.[A-Za-z]+$/;
    return ex.test(dominioMail);
}