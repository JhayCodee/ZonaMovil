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
                required: true,
                number: true,
                min: 0
            },
            GarantiaEnMeses: {
                required: true,
                number: true,
                min: 0
            },
            IdMarca: {
                required: true
            },
            IdCategoria: {
                required: true
            },
            PrecioCompra: {
                required: true,
                number: true,
                min: 0.01
            },
            PrecioVenta: {
                required: true,
                number: true,
                min: 0.01
            },
            Descripcion: {
                required: true
            },
            AlmacenamientoProducto: {
                required: true,
                number: true,
                min: 0
            },
            RAMProducto: {
                required: true,
                number: true,
                min: 0
            },
            IdColor: {
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
                required: "Ingrese la cantidad en stock",
                number: "Ingrese un valor numérico",
                min: "El valor debe ser mayor o igual a 0"
            },
            GarantiaEnMeses: {
                required: "Ingrese el periodo de garantía",
                number: "Ingrese un valor numérico",
                min: "El valor debe ser mayor o igual a 0"
            },
            IdMarca: {
                required: "Seleccione una marca"
            },
            IdCategoria: {
                required: "Seleccione una categoría"
            },
            PrecioCompra: {
                required: "Ingrese el precio de compra",
                number: "Ingrese un valor numérico",
                min: "El valor debe ser mayor a 0"
            },
            PrecioVenta: {
                required: "Ingrese el precio de venta",
                number: "Ingrese un valor numérico",
                min: "El valor debe ser mayor a 0"
            },
            Descripcion: {
                required: "Ingrese una descripción"
            },
            AlmacenamientoProducto: {
                required: "Ingrese el Almacenamiento",
                number: "Ingrese un valor numérico",
                min: "El valor debe ser mayor o igual a 0"
            },
            RAMProducto: {
                required: "Ingrese la memoria RAM",
                number: "Ingrese un valor numérico",
                min: "El valor debe ser mayor o igual a 0"
            },
            IdColor: {
                required: "Seleccione un color"
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
    $('#MarcaSelect, #categoriaSelect, #ColoresSelect').on('focusout', function () {
        $(this).valid();
    });
});

