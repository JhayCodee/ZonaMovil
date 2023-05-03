$(document).ready(function () {
    // Agrega la regla de validación de cédula
    $.validator.addMethod("cedulaFormato", function (value, element) {
        return this.optional(element) || /^\d{3}-\d{6}-\d{4}[A-Za-z]$/.test(value);
    }, "Por favor ingrese una cédula válida en formato 000-000000-0000A.");

    $("#FormularioCliente").validate({
        rules: {
            Nombres: {
                required: true,
            },
            Apellidos: {
                required: true,
            },
            Cedula: {
                required: true,
                cedulaFormato: true,
                minlength: 16,
                maxlength: 16,
            },
            Correo: {
                required: true,
                email: true,
            },
            Telefono: {
                required: true,
                digits: true,
            },
        },
        messages: {
            Nombres: {
                required: "Este campo es requerido",
            },
            Apellidos: {
                required: "Este campo es requerido",
            },
            Cedula: {
                required: "Este campo es requerido",
                cedulaFormato: "Por favor ingrese una cédula válida en formato 000-000000-0000A.",
                minlength: "La cédula debe contener 16 caracteres",
                maxlength: "La cédula debe contener 16 caracteres",
            },
            Correo: {
                required: "Este campo es requerido",
                email: "Ingresa un correo válido",
            },
            Telefono: {
                required: "Este campo es requerido",
                digits: "Ingresa sólo números",
            },
        },
        errorElement: "span",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            element.closest(".form-group").append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        }
    });
});