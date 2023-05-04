$(document).ready(function () {

    $("#FormularioProveedor").validate({
        rules: {
            Nombre: {
                required: true,
            },
            Telefono: {
                required: true,
            },
            Correo: {
                required: true,
            },
            Direccion: {
                required: true,
            },
        },
        messages: {
            Nombre: {
                required: "Este campo es requerido",
            },
            Telefono: {
                required: "Este campo es requerido",
            },
            Correo: {
                required: "Este campo es requerido",
            },
            Direccion: {
                required: "Este campo es requerido",
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