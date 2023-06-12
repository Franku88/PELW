function suma(x, y) {
    var result;
    result = x+y;
    return result; 
}

function resta(x, y) {
    var result;
    result = x-y;
    return result;
}

function division(x, y) {
    var result;
    result = x/y;
    return result;
}

function multiplicacion(x, y) {
    var result;
    result = x*y;
    return result;
}

function potencia(x, y) {
    var result = x;
    for(var i = 1; i < y; i++) {
        result = result * x;
    }
    return result;
}

function cuadrado(x) {
    var result;
    result = x*x;
    return result;
}

function factorial(x) {
    var result;
    if (x==0) {
        result = 1;
    } else {
        result = x * factorial(x-1);
    }   
    return result;
}

function valorSeleccionado(valor) {
    var result;
    switch (true) {
        case valor < 0:
            result = -1;
            break;
        case valor < 10:
            result = 0;
            break;
        case valor < 50:
            result = 1;
            break;
        case valor < 100:
            result = 2;
            break;
        case valor >= 100:
            result = 3;
            break;
    }
    return result;
}

