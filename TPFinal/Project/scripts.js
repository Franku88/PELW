document.addEventListener('DOMContentLoaded', function() {
    // Captura el formulario por su ID
    var form = document.getElementById('miFormulario');

    // Agrega un controlador de eventos para el evento 'submit'
    form.addEventListener('submit', function(event) {
      // Evita que el formulario se envíe
      event.preventDefault();
      buscar();
    });
});

function buscar() {
    var input = document.getElementById("buscar");
    var text = input.value;
    alert(text);
}