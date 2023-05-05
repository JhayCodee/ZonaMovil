$(document).ready(function () {

    $("#FormularioMarca").validate({
        rules: {
            Nombre: {
                required: true,
            },
        },
        messages: {
            Nombre: {
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