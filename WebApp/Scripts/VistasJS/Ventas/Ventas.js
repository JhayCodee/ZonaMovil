$(function () {
    cargarTablaFacturaVenta();
});

var vistaProductoComponente, tablaProducto;
var modo = "";

// contenedor para rotar las vistas
ComponenteFacturaVenta = {
    url: baseUrl + 'Ventas',
    contenedorTabla: $('#facturaVentaTablaContainer'),
    contenedorFormulario: $('#FacturaVentaFormularioContainer')
}


$("#tablaFacturasVentas").on('click', '.btnVer', function () {
    var id = $(this).data('id');
    limpiarModal();
    $("#detalleFacturaVentaModal").modal("show");
    $.ajax({
        url: "/Ventas/ListarDetalleFacturaVenta",
        type: "POST",
        data: { nf: id },
        success: function (response) {

            var data = response.data;
            var d = data[0];

            $("#detalleNumeroFactura").val(d.NumeroFactura);
            $("#detalleCliente").val(d.Cliente);
            $("#detalleCedula").val(d.Cedula);
            $("#detalletotal").val(d.Total);
            $("#detalleTelefono").val(d.Telefono);
            $("#detalleFecha").val(moment(parseInt(d.Fecha.substr(6))).format("DD/MM/YYYY"));

            var tabla = "";
            for (var i = 0; i < data.length; i++) {
                tabla += "<tr>";
                tabla += "<td>" + data[i].Producto + ' - ' + data[i].Color + "</td>";
                tabla += "<td>" + data[i].Modelo + "</td>";
                tabla += "<td>" + data[i].RAM + "</td>";
                tabla += "<td>" + data[i].Almacenamiento + "</td>";
                tabla += "<td>" + data[i].PrecioVenta + "</td>";
                tabla += "<td>" + data[i].Cantidad + "</td>";
                tabla += "</tr>";
            }

            $("#tablaFacturasPVendidos tbody").html(tabla);
        },
        error: function () {
            console.log("Error al obtener las facturas.");
        }
    });
});

$("#tablaFacturasVentas").on('click', '.btnImprimir', function () {
    var nf = $(this).data('id');
    window.location.href = '/Ventas/ImprimirFactura?numeroFactura=' + nf;
});


$("#tablaFacturasVentas").on('click', '.btnEliminar', function () {
    var id = $(this).data('id');

    // Mostrar Sweet Alert para confirmar la eliminación
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará el producto.",
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
                url: "/Ventas/EliminarFacturaVenta",
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
                            cargarTablaFacturaVenta();
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

// Evento de clic para el botón "Agregar producto"
$('#addProductoFV').click(function () {
    // Obtener el producto seleccionado del selectpicker
    var productoId = $('#productoSelectFV').val();

    // Verificar si se seleccionó un producto válido
    if (productoId) {
        var productoYaAgregado = false;

        // Recorremos las filas de la tabla para comprobar si el producto ya fue agregado
        $('#tablaFacturaVentaProductos tbody tr').each(function () {
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
                    $('#tablaFacturaVentaProductos tbody').append(newRow);

                    // Actualizar los valores de SubTotal, Impuesto y Total
                    actualizarValoresFactura();

                    // Limpiar el selectpicker seleccionado
                    $('#productoSelectFV').val('');

                    // Actualizar el selectpicker
                    cargarSelectProductos();
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


$('#tablaFacturaVentaProductos').on('click', '.increment', function () {
    var tr = $(this).closest('tr');
    var cantidad = parseInt(tr.find('.cantidad').text());
    var stock = parseInt(tr.find('.stock').text());

    // Asegúrate de que la nueva cantidad no exceda el stock
    if (cantidad < stock) {
        tr.find('.cantidad').text(cantidad + 1);

        // Actualizar los totales después de cambiar la cantidad
        actualizarValoresFactura();
    }
});

$('#tablaFacturaVentaProductos').on('click', '.decrement', function () {
    var tr = $(this).closest('tr');
    var cantidad = parseInt(tr.find('.cantidad').text());

    // Asegúrate de que la cantidad no sea menor que 1
    if (cantidad > 1) {
        tr.find('.cantidad').text(cantidad - 1);

        // Actualizar los totales después de cambiar la cantidad
        actualizarValoresFactura();
    }
});




// Evento de envío del formulario
$('#FacturaVentaFormulario').submit(function (event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Verificar cliente, productos y método de pago
    if (!verificarClienteSeleccionado() || !verificarListaProductos() || !verificarMetodoPago()) {
        return;
    }

    // Obtener el método de pago seleccionado
    var metodoPago = "Efectivo"; // Valor predeterminado para Efectivo
    if ($('#checkTarjetaFV').is(':checked')) {
        metodoPago = "Tarjeta"; // Cambiar a 1 si Tarjeta está seleccionada
    }

    // Obtener los datos del cliente seleccionado
    var clienteId = $('#clienteSelectFV').val();
    var facturaId = $('#IdFacturaVenta').val();

    // Obtener los datos de la tabla
    var productos = [];
    $('#tablaFacturaVentaProductos tbody tr').each(function () {
        var producto = {
            Nombre: $(this).find('td:eq(0)').text(),
            Precio: parseFloat($(this).find('td:eq(4)').text()) * parseFloat($(this).find('.cantidad').text()),
            Cantidad: parseInt($(this).find('.cantidad').text()),
            IdProducto: parseFloat($(this).find('td:eq(8)').text())
        };
        productos.push(producto);
    });


    // Obtener los datos de la sección "Facturar"
    var subtotal = parseFloat($('#subtotalFv').val());
    var impuesto = parseFloat($('#ImpuestoFV').val());
    var total = parseFloat($('#TotalFV').val());

    var factura = {
        IdCliente: clienteId,
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
        url: ComponenteFacturaVenta.url + '/AgregarFactura',
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
                cargarTablaFacturaVenta();
                ComponenteFacturaVenta.contenedorTabla.show();
                ComponenteFacturaVenta.contenedorFormulario.hide();
            });
        },
        error: function (xhr, status, error) {
            // Manejar el error de la petición AJAX
            console.log('Error en la petición AJAX:', error);
        }
    });

});


$("#btnRegresarFV").click(function () {
    resetFormularioFacturaVenta();
    ComponenteFacturaVenta.contenedorTabla.show();
    ComponenteFacturaVenta.contenedorFormulario.hide();
});

// Manejar el cambio en el checkbox "Efectivo"
$('#checkEfectivoFV').change(function () {
    if ($(this).is(':checked')) {
        $('#checkTarjetaFV').prop('checked', false);
    }
});

// Manejar el cambio en el checkbox "Tarjeta"
$('#checkTarjetaFV').change(function () {
    if ($(this).is(':checked')) {
        $('#checkEfectivoFV').prop('checked', false);
    }
});


// funciones 
// Función para actualizar los valores de SubTotal, Impuesto y Total
function actualizarValoresFactura() {
    var subtotal = 0;
    var impuesto = 0;
    var total = 0;

    // Recorrer las filas de la tabla y sumar los valores de PrecioVenta
    $('#tablaFacturaVentaProductos tbody tr').each(function () {
        var precioVenta = parseFloat($(this).find('td:eq(4)').text());
        var cantidad = parseInt($(this).find('td:eq(5) .cantidad').text());
        subtotal += precioVenta * cantidad;  // multiplicamos por la cantidad para obtener el total por cada producto
    });

    // Calcular el impuesto
    impuesto = subtotal * 0.15;

    // Calcular el total
    total = subtotal + impuesto;

    // Actualizar los valores en los campos de entrada correspondientes
    $('#subtotalFv').val(subtotal.toFixed(2));
    $('#ImpuestoFV').val(impuesto.toFixed(2));
    $('#TotalFV').val(total.toFixed(2));
}


// Evento de clic para los botones de eliminar
$(document).on('click', '.eliminarPFV-btn', function () {
    // Obtener la fila a la que pertenece el botón
    var row = $(this).closest('tr');

    // Eliminar la fila de la tabla
    row.remove();

    // Actualizar los valores de SubTotal, Impuesto y Total
    actualizarValoresFactura();
});

function cargarSelectClientes() {
    $.ajax({
        url: '/Cliente/ListarClientes',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Obtener el selectpicker
            var selectpicker = $('#clienteSelectFV');

            // Limpiar las opciones existentes en el selectpicker
            selectpicker.find('option').remove();

            // Agregar la opción "Seleccionar categoría" al principio de la lista
            selectpicker.append('<option value="">Seleccionar cliente</option>');

            // Agregar opciones al selectpicker
            $.each(data, function (key, value) {
                selectpicker.append('<option value="' + value.IdCliente + '">' + value.Nombres + ' ' + value.Apellidos + ' ' + value.Cedula + '</option>');
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

function cargarSelectProductos() {
    $.ajax({
        url: "/Producto/ListarProductos",
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Obtener el selectpicker
            var selectpicker = $('#productoSelectFV');

            // Limpiar las opciones existentes en el selectpicker
            selectpicker.find('option').remove();

            // Agregar la opción "Seleccionar categoría" al principio de la lista
            selectpicker.append('<option value="">Seleccionar producto</option>');

            // Agregar solo las opciones de productos con stock mayor a 0
            $.each(data, function (key, value) {
                if (value.Stock > 0) {
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


function cargarTablaFacturaVenta() {
    $.ajax({
        url: "/Ventas/ListarFacturasVentas",
        type: "GET",
        success: function (data) {
            if ($.fn.DataTable.isDataTable('#tablaFacturasVentas')) {
                $('#tablaFacturasVentas').DataTable().destroy();
            }
            $("#tablaFacturasVentas").DataTable({
                "data": data.data,
                dom: "<'row'<'col-md-12'B>>" + "<'row'<'col-md-6'l><'col-md-6'f>>" + "<'row'<'col-md-12'tr>>" + "<'row'<'col-md-5'i><'col-md-7'p>>",
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "TODOS"]],
                pageLength: 10,
                "columns": [
                    { "data": "NumeroFactura" },
                    { "data": "Cliente" },
                    {
                        "data": "Fecha",
                        "render": function (data, type, row, meta) {
                            var fechaEnMilisegundos = parseInt(data.substr(6));
                            var fechaFormateada = moment(fechaEnMilisegundos).format("DD/MM/YYYY");
                            return fechaFormateada;
                        }
                    },
                    { "data": "Impuesto" },
                    { "data": "Total" },
                    {
                        "data": null,
                        "render": function (data, type, row, meta) {
                            return '<div class="centrar" style="display:flex; justify-content:center; gap:6px;">' +
                                '<button type="button" class="btn btn-info btnVer" data-id="' + row.NumeroFactura + '"> <i class="fas fa-solid fa-eye"></i> </button>' +
                                '<button type="button" class="btn btn-danger btnEliminar" data-id="' + row.IdFacturaVenta + '"> <i class="fas fa-solid fa-trash"></i> </button>' +
                                '<button type="button" class="btn btn-secondary btnImprimir" data-id="' + row.NumeroFactura + '"> <i class="fas fa-solid fa-print"></i> </button>' +
                                '</div>';
                        }
                    }
                ],
                buttons: [
                    {
                        text: 'Nueva Venta',
                        className: 'btn btn-primary mb-2',
                        titleAttr: "Crear un nuevo registro",
                        // si se da click en el boton mostrar el formulario y ocultar la tabla
                        action: function (e, dt, node, config) {
                            resetFormularioFacturaVenta();
                            cargarSelectClientes();
                            cargarSelectProductos();
                            ComponenteFacturaVenta.contenedorTabla.hide();
                            ComponenteFacturaVenta.contenedorFormulario.show();
                            modo = "crear"
                        }
                    },
                    {
                        extend: 'excel',
                        text: 'Exportar a Excel',
                        className: 'btn btn-success mb-2',
                        titleAttr: "Exportar a Excel"
                    },
                    {
                        extend: 'csv',
                        text: 'Exportar a CSV',
                        className: 'btn btn-warning mb-2',
                        titleAttr: "Exportar a CSV"
                    },
                    {
                        extend: 'print',
                        text: 'Imprimir',
                        className: 'btn btn-info mb-2',
                        titleAttr: "Imprimir"
                    },
                ]
            });
        },
        error: function () {
            console.log("Error al obtener las facturas.");
        }
    });
}


function limpiarModal() {
    // limpia todos los campos de entrada
    $('#detalleFacturaVentaModal input[type="text"], #detalleFacturaVentaModal input[type="number"]').val('');

    // limpia la tabla
    $('#tablaFacturasPVendidos tbody').empty();
}

function resetFormularioFacturaVenta() {
    // Limpiar la tabla
    $('#tablaFacturaVentaProductos tbody').empty();

    // Limpiar selectpicker de productos
    $('#productoSelectFV').find('option').not('[value=""]').remove();
    $('#productoSelectFV').selectpicker('refresh');

    // Limpiar selectpicker de clientes
    $('#clienteSelectFV').find('option').not('[value=""]').remove();
    $('#clienteSelectFV').selectpicker('refresh');

    // Restablecer los campos de total, impuesto y subtotal
    $('#subtotalFv').val(0.00.toFixed(2));
    $('#ImpuestoFV').val(0.00.toFixed(2));
    $('#TotalFV').val(0.00.toFixed(2));

    // Desmarcar los checkboxes de métodos de pago
    $('#checkEfectivoFV').prop('checked', false);
    $('#checkTarjetaFV').prop('checked', false);
}

// Verificar que se ha seleccionado un cliente
function verificarClienteSeleccionado() {
    var clienteId = $('#clienteSelectFV').val();
    if (clienteId === '') {
        Swal.fire('Error!', 'Debes seleccionar un cliente.', 'error');
        return false;
    }
    return true;
}

// Verificar que la lista de productos no está vacía
function verificarListaProductos() {
    var numProductos = $('#tablaFacturaVentaProductos tbody tr').length;
    if (numProductos === 0) {
        Swal.fire('Error!', 'Debe haber al menos un producto en la lista.', 'error');
        return false;
    }
    return true;
}

function verificarMetodoPago() {
    if ($('#checkEfectivoFV').is(':checked') || $('#checkTarjetaFV').is(':checked')) {
        return true;
    }
    Swal.fire('Error!', 'Debes seleccionar un método de pago.', 'error');
    return false;
}