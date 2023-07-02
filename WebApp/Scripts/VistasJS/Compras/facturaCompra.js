$(function () {
    cargarTablaFacturaCompra();
});

var ComponenteFacturaCompra;
var modo = "";

ComponenteFacturaCompra = {
    url: baseUrl + 'Compras',
    contenedorTabla: $('#facturaCompraTablaContainer'),
    contenedorFormulario: $('#FacturaCompraFormularioContainer')
}

function cargarTablaFacturaCompra() {
    $.ajax({
        url: "/Compras/ListarFacturasCompras",
        type: "GET",
        success: function (data) {
            if ($.fn.DataTable.isDataTable('#tablaFacturaCompra')) {
                $('#tablaFacturaCompra').DataTable().destroy();
            }
            $("#tablaFacturaCompra").DataTable({
                "data": data.data,
                dom: "<'row'<'col-md-12'B>>" + "<'row'<'col-md-6'l><'col-md-6'f>>" + "<'row'<'col-md-12'tr>>" + "<'row'<'col-md-5'i><'col-md-7'p>>",
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "TODOS"]],
                pageLength: 10,
                "columns": [
                    { "data": "NumeroFactura" },
                    { "data": "ProveedorX" },
                    {
                        "data": "Fecha",
                        "render": function (data, type, row, meta) {
                            var fechaEnMilisegundos = parseInt(data.substr(6));
                            var fechaFormateada = moment(fechaEnMilisegundos).format("DD/MM/YYYY");
                            return fechaFormateada;
                        }
                    },
                    { "data": "Total" },
                    {
                        "data": null,
                        "render": function (data, type, row, meta) {
                            return '<div class="centrar" style="display:flex; justify-content:center; gap:6px;">' +
                                '<button type="button" class="btn btn-info btnVer" data-id="' + row.NumeroFactura + '"> <i class="fas fa-solid fa-eye"></i> </button>' +
                                '<button type="button" class="btn btn-danger btnEliminar" data-id="' + row.IdFacturaCompra + '"> <i class="fas fa-solid fa-trash"></i> </button>' +
                                '</div>';
                        }
                    }
                ],
                buttons: [
                    {
                        text: 'Nueva Compra',
                        className: 'btn btn-primary mb-2',
                        titleAttr: "Crear un nuevo registro",
                        // si se da click en el boton mostrar el formulario y ocultar la tabla
                        action: function (e, dt, node, config) {
                            //resetFormProduct();
                            cargarSelectProveedores();
                            cargarSelectProductosFC();
                            ComponenteFacturaCompra.contenedorTabla.hide();
                            ComponenteFacturaCompra.contenedorFormulario.show();
                            modo = "crear"
                        }
                    },

                ]
            });
        },
        error: function () {
            console.log("Error al obtener las facturas.");
        }
    });
}

function limpiarModalFV() {
    // limpia todos los campos de entrada
    $('#detalleFacturaCompraModal input[type="text"], #detalleFacturaCompraModal input[type="number"]').val('');

    // limpia la tabla
    $('#detalleFacturaCompraModal tbody').empty();
}

function cargarSelectProductosFC() {
    $.ajax({
        url: "/Producto/ListarProductos",
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Obtener el selectpicker
            var selectpicker = $('#productoSelectFC');

            // Limpiar las opciones existentes en el selectpicker
            selectpicker.find('option').remove();

            // Agregar la opción "Seleccionar categoría" al principio de la lista
            selectpicker.append('<option value="">Seleccionar producto</option>');

            // Agregar solo las opciones de productos con stock mayor a 0
            $.each(data, function (key, value) {
                if (value.Stock >= 0) {
                    var optionText = value.Nombre;

                    if (value.RAM != null) {
                        optionText += ' - ' + value.RAM + 'GB RAM';
                    }
                    if (value.Almacenamiento != null) {
                        optionText += ' - ' + value.Almacenamiento + 'GB Almacenamiento';
                    }

                    optionText += ' - ' + value.Color;

                    selectpicker.append('<option value="' + value.IdProducto + '" data-stock="' + value.Stock + '">' + optionText + '</option>');
                }
            });

            // Actualizar selectpicker
            selectpicker.selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            // Manejar errores
            console.log(error);
        }
    });
}


function cargarSelectProveedores() {
    $.ajax({
        url: '/Proveedor/ListarProveedores',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Obtener el selectpicker
            var selectpicker = $('#ProveedorSelectPickFC');

            // Limpiar las opciones existentes en el selectpicker
            selectpicker.empty();
            console.log(data);
            // Agregar la opción "Seleccionar Producto" deshabilitada y seleccionada por defecto
            selectpicker.append('<option value="" disabled selected>Seleccionar Proveedor</option>');

            // Agregar solo las opciones de productos con stock mayor a 0
            $.each(data, function (key, value) {
                selectpicker.append('<option value="' + value.IdProveedor + '">' + value.Nombre + '</option>');
            });

            // Actualizar selectpicker
            selectpicker.selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            // Manejar errores
            console.log(error);
        }
    });
}

function actualizarValoresFacturaCompra() {
    var subtotal = 0;
    var impuesto = 0;
    var total = 0;

    // Recorrer las filas de la tabla y sumar los valores de PrecioVenta
    $('#tablaFacturaCompraProductos tbody tr').each(function () {
        var precioVenta = parseFloat($(this).find('td:eq(4)').text());
        var cantidad = parseInt($(this).find('td:eq(5) .cantidad').text());
        subtotal += precioVenta * cantidad;  // multiplicamos por la cantidad para obtener el total por cada producto
    });

    // Calcular el impuesto
    impuesto = subtotal * 0.15;

    // Calcular el total
    total = subtotal + impuesto;

    // Actualizar los valores en los campos de entrada correspondientes
    $('#subtotalFc').val(subtotal.toFixed(2));
    $('#ImpuestoFc').val(impuesto.toFixed(2));
    $('#TotalFc').val(total.toFixed(2));
}



$("#tablaFacturaCompra").on('click', '.btnEliminar', function () {
    var id = $(this).data('id');

    // Mostrar Sweet Alert para confirmar la eliminación
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará la compra.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la eliminación del producto mediante una petición AJAX
            $.ajax({
                url: "/Compras/EliminarFacturaCompra",
                type: 'POST',
                data: { id: id },
                success: function (response) {
                    if (response.success) {
                        // El producto se eliminó correctamente
                        Swal.fire({
                            title: 'Eliminado',
                            text: response.message,
                            icon: 'success'
                        }).then(() => {
                            // Actualizar la tabla o realizar otras acciones necesarias
                            // por ejemplo, recargar la página:
                            cargarTablaFacturaCompra();
                        });
                    } else {
                        // Ocurrió un error al eliminar el producto
                        Swal.fire('Error', response.message, 'error');
                    }
                },
                error: function (xhr, status, error) {
                    // Ocurrió un error en la petición AJAX
                    Swal.fire('Error', 'Ocurrió un error en la petición.', 'error');
                }
            });
        }
    });
});


// Evento de clic para los botones de eliminar
$(document).on('click', '.eliminarPFV-btn', function () {
    // Obtener la fila a la que pertenece el botón
    var row = $(this).closest('tr');

    // Eliminar la fila de la tabla
    row.remove();

    // Actualizar los valores de SubTotal, Impuesto y Total
    actualizarValoresFactura();
});

// Evento de clic para el botón "Agregar producto"
$('#addProductoFC').click(function () {
    // Obtener el producto seleccionado del selectpicker
    var productoId = $('#productoSelectFC').val();

    // Verificar si se seleccionó un producto válido
    if (productoId) {
        var productoYaAgregado = false;

        // Recorremos las filas de la tabla para comprobar si el producto ya fue agregado
        $('#tablaFacturaCompraProductos tbody tr').each(function () {
            var idProductoEnTabla = $(this).find('td:last-child').text();
            if (productoId === idProductoEnTabla) {
                productoYaAgregado = true;
                return false;  // esto detiene el bucle .each() en caso de que ya se haya encontrado el producto
            }
        });

        if (productoYaAgregado) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Este producto ya ha sido agregado a la tabla. Por favor, seleccione otro producto.'
            });
            return;  // detenemos la ejecución de la función aquí si el producto ya fue agregado
        }

        // Realizar la solicitud AJAX para obtener la información del producto
        $.ajax({
            url: '/Producto/BuscarProductoPorID',
            type: 'POST',
            data: { id: productoId },
            dataType: 'json',
            success: function (data) {
                // Verificar si se obtuvo la información del producto correctamente
                if (data) {
                    // Crear una nueva fila en la tabla con los datos del producto obtenidos
                    var newRow = $('<tr>');
                    newRow.append('<td>' + data.Nombre + ' - ' + data.Color + '</td>');
                    newRow.append('<td>' + data.Modelo + '</td>');
                    newRow.append('<td>' + (data.RAM ? data.RAM + ' GB' : '-') + '</td>');
                    newRow.append('<td>' + (data.Almacenamiento ? data.Almacenamiento + ' GB' : ' - ') + '</td>');
                    newRow.append('<td>' + data.PrecioVenta + '</td>');
                    newRow.append('<td style="text-align: center;"><button type="button" class="btn btn-primary decrement" style="margin-right: 5px; padding: 3px 6px; font-size: 12px;">-</button><span class="cantidad" style="margin: 0 5px;">1</span><button type="button" class="btn btn-primary increment" style="margin-left: 5px; padding: 3px 6px; font-size: 12px;">+</button></td>');
                    newRow.append('<td><button type="button" class="btn btn-danger btn-sm eliminarPFV-btn"><i class="fas fa-trash"></i></button></td>');
                    newRow.append('<td class="stock" style="display: none;">' + data.Stock + '</td>');
                    newRow.append('<td style="display: none;">' + data.IdProducto + '</td>');

                    // Agregar la nueva fila a la tabla
                    $('#tablaFacturaCompraProductos tbody').append(newRow);

                    // Actualizar los valores de SubTotal, Impuesto y Total
                    actualizarValoresFacturaCompra();

                    // Limpiar el selectpicker seleccionado
                    $('#productoSelectFC').val('');

                    // Actualizar el selectpicker
                    cargarSelectProductosFC();
                }
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error al buscar el producto: ' + error
                });
            }
        });
    }
});

// Evento de clic para los botones de eliminar
$(document).on('click', '.eliminarPFC-btn', function () {
    // Obtener la fila a la que pertenece el botón
    var row = $(this).closest('tr');

    // Eliminar la fila de la tabla
    row.remove();

    // Actualizar los valores de SubTotal, Impuesto y Total
    actualizarValoresFacturaCompra();
});

// ver detalle
$("#tablaFacturaCompra").on('click', '.btnVer', function () {
    var id = $(this).data('id');
    limpiarModalFV();
    $("#detalleFacturaCompraModal").modal("show");
    $.ajax({
        url: "/Compras/ListarDetalleFacturaCompra",
        type: "POST",
        data: { nf: id },
        success: function (response) {

            var d = response.data;

            $("#detalleNumeroFactura").val(d.NumeroFactura);
            $("#detalleProveedor").val(d.ProveedorX);
            $("#detalleTelefono").val(d.Telefono);
            $("#detalletotal").val(d.Total);
            $("#detalleFecha").val(moment(parseInt(d.Fecha.substr(6))).format("DD/MM/YYYY"));

            var tabla = "";
            for (var i = 0; i < d.Productos.length; i++) {
                tabla += "<tr>";
                tabla += "<td>" + d.Productos[i].Producto + "</td>";
                tabla += "<td>" + d.Productos[i].Modelo + "</td>";
                tabla += "<td>" + d.Productos[i].PrecioCompra + "</td>";
                tabla += "<td>" + d.Productos[i].Cantidad + "</td>";
                tabla += "</tr>";
            }

            $("#tablaFacturasPComprados tbody").html(tabla);
        },
        error: function () {
            console.log("Error al obtener las facturas.");
        }
    });
});

// Evento de envío del formulario
$('#FacturaCompraFormulario').submit(function (event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Verificar cliente, productos y método de pago
    if (!verificarProveedorSeleccionado() || !verificarListaProductos() || !verificarMetodoPago()) {
        return;
    }

    // Obtener el método de pago seleccionado
    var metodoPago = "Efectivo"; // Valor predeterminado para Efectivo
    if ($('#checkTarjetaFV').is(':checked')) {
        metodoPago = "Tarjeta"; // Cambiar a 1 si Tarjeta está seleccionada
    }

    // Obtener los datos del cliente seleccionado
    var ProveedorId = $('#ProveedorSelectPickFC').val();
    var facturaId = $('#IdFacturaVenta').val();

    // Obtener los datos de la tabla
    var productos = [];
    $('#tablaFacturaCompraProductos tbody tr').each(function () {
        var producto = {
            Nombre: $(this).find('td:eq(0)').text(),
            Precio: parseFloat($(this).find('td:eq(4)').text()) * parseFloat($(this).find('.cantidad').text()),
            Cantidad: parseInt($(this).find('.cantidad').text()),
            IdProducto: parseFloat($(this).find('td:eq(8)').text())
        };
        productos.push(producto);
    });

    // Obtener los datos de la sección "Facturar"
    var subtotal = parseFloat($('#subtotalFc').val());
    var impuesto = parseFloat($('#ImpuestoFc').val());
    var total = parseFloat($('#TotalFc').val());

    var factura = {
        IdProveedor: ProveedorId,
        IdFacturaVenta: facturaId,
        Impuesto: impuesto,
        Total: total,
        TipoPago: metodoPago,
        Activo: true
    }

    var data = {
        fv: factura,
        dfv: productos
    };


    $.ajax({
        url: ComponenteFacturaCompra.url + '/AgregarFacturaCompra',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (response) {
            Swal.fire(
                'Facturado!',
                'Esta factura se ha creado con exito!.',
                'success'
            ).then(() => {
                cargarTablaFacturaCompra();
                ComponenteFacturaCompra.contenedorTabla.show();
                ComponenteFacturaCompra.contenedorFormulario.hide();
            });
        },
        error: function (xhr, status, error) {
            // Manejar el error de la petición AJAX
            console.log('Error en la petición AJAX:', error);
        }
    });

});


// Manejar el cambio en el checkbox "Efectivo"
$('#checkEfectivoFc').change(function () {
    if ($(this).is(':checked')) {
        $('#checkTarjetaFc').prop('checked', false);
    }
});

// Manejar el cambio en el checkbox "Tarjeta"
$('#checkTarjetaFc').change(function () {
    if ($(this).is(':checked')) {
        $('#checkEfectivoFc').prop('checked', false);
    }
});

$('#tablaFacturaCompraProductos').on('click', '.increment', function () {
    var tr = $(this).closest('tr');
    var cantidad = parseInt(tr.find('.cantidad').text());

    tr.find('.cantidad').text(cantidad + 1);

    // Actualizar los totales después de cambiar la cantidad
    actualizarValoresFacturaCompra();
});

$('#tablaFacturaCompraProductos').on('click', '.decrement', function () {
    var tr = $(this).closest('tr');
    var cantidad = parseInt(tr.find('.cantidad').text());

    // Asegúrate de que la cantidad no sea menor que 1
    if (cantidad > 1) {
        tr.find('.cantidad').text(cantidad - 1);

        // Actualizar los totales después de cambiar la cantidad
        actualizarValoresFactura();
    }
});

function verificarProveedorSeleccionado() {
    var Id = $('#ProveedorSelectPickFC').val();
    if (Id === '' || Id === null) {
        Swal.fire('Error!', 'Debes seleccionar un proveedor.', 'error');
        return false;
    }
    return true;
}

// Verificar que la lista de productos no está vacía
function verificarListaProductos() {
    var numProductos = $('#tablaFacturaCompraProductos tbody tr').length;
    if (numProductos === 0) {
        Swal.fire('Error!', 'Debe haber al menos un producto en la lista.', 'error');
        return false;
    }
    return true;
}

function verificarMetodoPago() {
    if ($('#checkEfectivoFc').is(':checked') || $('#checkTarjetaFc').is(':checked')) {
        return true;
    }
    Swal.fire('Error!', 'Debes seleccionar un método de pago.', 'error');
    return false;
}


$("#btnRegresarFc").click(function () {
    resetFormularioFacturaCompra();
    ComponenteFacturaCompra.contenedorTabla.show();
    ComponenteFacturaCompra.contenedorFormulario.hide();
});

function resetFormularioFacturaCompra() {
    // Limpiar la tabla
    $('#tablaFacturaCompraProductos tbody').empty();

    // Limpiar selectpicker de productos
    $('#productoSelectFC').find('option').not('[value=""]').remove();
    $('#productoSelectFC').selectpicker('refresh');

    // Limpiar selectpicker de proeedores
    $('#ProveedorSelectPickFC').find('option').not('[value=""]').remove();
    $('#ProveedorSelectPickFC').selectpicker('refresh');

    // Restablecer los campos de total, impuesto y subtotal
    $('#subtotalFc').val(0.00.toFixed(2));
    $('#ImpuestoFc').val(0.00.toFixed(2));
    $('#TotalFc').val(0.00.toFixed(2));

    // Desmarcar los checkboxes de métodos de pago
    $('#checkEfectivoFc').prop('checked', false);
    $('#checkTarjetaFc').prop('checked', false);
}