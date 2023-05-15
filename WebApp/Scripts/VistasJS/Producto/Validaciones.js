$(document).ready(function () {
    // Agregar reglas de validación requerida
    $("#FormularioProducto").validate({
        rules: {
            Nombre: {
                required: true
            },
            Modelo: {
                required: true
            },
            Stock: {
                required: true
            },
            GarantiaEnMeses: {
                required: true
            },
            IdMarca: {
                required: true
            },
            IdCategoria: {
                required: true
            },
            PrecioCompra: {
                required: true
            },
            PrecioVenta: {
                required: true
            },
            Descripcion: {
                required: true
            }
        },
        messages: {
            Nombre: {
                required: "Ingrese el nombre del producto"
            },
            Modelo: {
                required: "Ingrese el modelo del producto"
            },
            Stock: {
                required: "Ingrese la cantidad en stock"
            },
            GarantiaEnMeses: {
                required: "Ingrese el periodo de garantía"
            },
            IdMarca: {
                required: "Seleccione una marca"
            },
            IdCategoria: {
                required: "Seleccione una categoría"
            },
            PrecioCompra: {
                required: "Ingrese el precio de compra"
            },
            PrecioVenta: {
                required: "Ingrese el precio de venta"
            },
            Descripcion: {
                required: "Ingrese una descripción"
            }
        },
        errorElement: "span",
        highlight: function (element, errorClass, validClass) {
            if ($(element).hasClass("selectpicker")) {
                $(element)
                    .closest(".form-group")
                    .addClass("is-invalid")
                    .removeClass("is-valid")
                    .find("button.dropdown-toggle")
                    .addClass("is-invalid");
            } else {
                $(element).addClass("is-invalid").removeClass("is-valid");
            }
        },

        // Función para quitar el resaltado del contenedor del selectpicker
        unhighlight: function (element, errorClass, validClass) {
            if ($(element).hasClass("selectpicker")) {
                $(element)
                    .closest(".form-group")
                    .addClass("is-valid")
                    .removeClass("is-invalid")
                    .find("button.dropdown-toggle")
                    .removeClass("is-invalid");
            } else {
                $(element).addClass("is-valid").removeClass("is-invalid");
            }
        },

        // Función para mostrar los mensajes de error del selectpicker
        errorPlacement: function (error, element) {
            if ($(element).hasClass("selectpicker")) {
                element.closest(".form-group").append(error);
            } else {
                error.insertAfter(element);
            }
        }
    });

    // Manejar el evento change de los selectpicker para ocultar los mensajes de error
    $('#MarcaSelect, #categoriaSelect').on('changed.bs.select', function () {
        $(this).valid();
    });
});

