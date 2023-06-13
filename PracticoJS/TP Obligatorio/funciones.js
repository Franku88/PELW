function validar() {
    //Metodo que al realizar el submit, hace las comprobaciones necesarias
    //Verifica input de nombre
    var nom = verificaInputTexto(document.getElementById("nombre"));
    //Verifica input de apellido
    var ape = verificaInputTexto(document.getElementById("apellido"));
    //Verifica input de obra social
    var os = verificaInputTexto(document.getElementById("obras_sociales"));
    //Verifica input de direccion de correo electronico
    var em = verificarDireccionCorreo(document.getElementById("email"));
    //Verifica inputs de dia, mes y anio
    var fe = esFechaValida(document.getElementById("dia"), document.getElementById("mes"), document.getElementById("anio"));

    var todoOk = nom && ape && os && os && em;
    if (todoOk) {
        alert("Datos ingresados exitosamente")
    }
    return todoOk; 
}

function verificaInputTexto(input) {
    //Verifica el contenido de un input de texto
    var verifTexto = (input.value.trim() != "");
    if (verifTexto) {
        //Si es valido, lo resalta en verde
        notificaOk(input);
    } else {
        //Si no es valido, lo resalta en rojo
        notificaError(input);
    }
    return verifTexto;
}

function verificarDireccionCorreo(input) {
    //Verifica el contenido del input, que debe ser una direccion de correo
    var verifEmail = esEmailValido(input.value.trim());
    if (verifEmail) {
        //Si es valido, lo resalta en verde
        notificaOk(input);
    } else {
        //Si no es valido, lo resalta en rojo
        notificaError(input);
    }
    return verifEmail;
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
            //Almacena parte de dominio (antes del @)
            dominio = email.substring(indiceArroba+1, email.length);
            //Verifica formato del dominio
            valido = validarDominioMail(dominio); //Si ambos son validos, retorna true
        }
    }
    return valido;
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

function verificarFechaNacimiento(inputDia, inputMes, inputAnio) {
    //Metodo que retorna verdadero si una fecha ingresada es valida para un nacimiento (anterior a fecha actual)
    var valida = esFechaValida(inputDia, inputMes, inputAnio);
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
                notificarOk(inputDia);
                notificarOk(inputMes);
                notificaError(inputAnio);
                break;
            case (anio === anioActual) && (mes > mesActual):
                //Si mes mayor al actual con anio igual al actual, no sucedio nacimiento 
                notificarOk(inputDia);
                notificaError(inputMes);
                notificarOk(inputAnio);
                break;
            case (anio === anioActual) && (mes === mesActual) && (dia > diaActual):
                //Si dia mayor al actual con anio y mes iguales a los actuales, no sucedio nacimiento
                notificaError(inputDia);
                notificarOk(inputMes);
                notificarOk(inputAnio)
                break;
            default:
                notificarOk(inputDia);
                notificarOk(inputMes);
                notificarOk(inputAnio);
                break;
        }
    }
}

function esFechaValida(inputDia, inputMes, inputAnio) {
    //Metodo que retorna verdadero si una fecha ingresada es valida
    //Verifica que los valores sean enteros positivos
    var valida = esEnteroPositivo(inputDia) && esEnteroPositivo(inputMes) && esEnteroPositivo(inputAnio);
    if (valida) {
        //Almaceno datos ingresados
        var dia = parseInt(inputDia.value);
        var mes = parseInt(inputMes.value);
        var anio = parseInt(inputAnio.value);
        //Cantidad de dias por mes
        var diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        //Modifica dias de febrero si es anio bisiesto
        if (verificaBisiesto(anio)) {
            diasPorMes[1] = 29;
        }
        //Verifica que el dia y mes sean validos
        var mesValido = (mes > 0 && mes < 13);
        var diaValido = (dia > 0 && dia <= diasPorMes[mes-1]);
        //Notifica si alguno no es valido
        if (!diaValido) {
            notificaError(inputDia);
        } else {
            notificaOk(inputDia);
        }
        if (!mesValido) {
            notificaError(inputMes);
        } else {
            notificaOk(inputMes);
        }
        notificaOk(inputAnio);
        
        valida =  diaValido && mesValido;
    }
    return valida;
}

function esEnteroPositivo(input) {
    //Metodo que retorna positivo si un valor es entero y positivo
    var num = parseInt(input.value);
    var verifica = Number.isInteger(num) && num > 0;
    if (!verifica) {
        notificaError(input);
    }
    return verifica;
}

function verificaBisiesto(anio) {
    //Metodo que verifica si un anio ingresado es bisiesto
    var verifica = (anio%4 === 0 && (anio%100 != 0 || anio%400 === 0));
    return verifica;
}

function notificaError(input) {
    input.style.borderColor = "red";
}

function notificaOk(input) {
    input.style.borderColor = "green";
}