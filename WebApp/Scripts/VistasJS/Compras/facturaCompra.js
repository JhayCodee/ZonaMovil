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
                                '<button type="button" class="btn btn-secondary btnImprimir" data-id="' + row.NumeroFactura + '"> <i class="fas fa-solid fa-print"></i> </button>' +
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
            selectpicker.empty();

            // Agregar la opción "Seleccionar Producto" deshabilitada y seleccionada por defecto
            selectpicker.append('<option value="" disabled selected>Seleccionar Producto</option>');

            // Agregar solo las opciones de productos con stock mayor a 0
            $.each(data, function (key, value) {
                if (value.Stock > 0) {
                    console.log(value);
                    selectpicker.append('<option value="' + value.IdProducto + '">' + value.Nombre + '</option>');
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
        var precioVenta = parseFloat($(this).find('td:eq(2)').text());
        var canti = parseFloat($(this).find('td:eq(3)').text());
        subtotal += precioVenta * canti;
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

// Evento de clic para el botón "Agregar producto"
$('#addProductoFC').click(function () {
    // Obtener el producto seleccionado del selectpicker
    var productoId = $('#productoSelectFC').val();
    var cant = $('#cantidadProdFc').val()
    console.log(productoId);

    // Verificar si se seleccionó un producto válido
    if (productoId) {
        // Realizar la solicitud AJAX para obtener la información del producto
        $.ajax({
            url: '/Producto/BuscarProductoPorID',
            type: 'POST',
            data: { id: productoId },
            dataType: 'json',
            success: function (data) {
                // Verificar si se obtuvo la información del producto correctamente
                console.log(data);
                if (data) {
                    // Crear una nueva fila en la tabla con los datos del producto obtenidos
                    var newRow = $('<tr>');
                    newRow.append('<td>' + data.Nombre + '</td>');
                    newRow.append('<td>' + data.Modelo + '</td>');
                    newRow.append('<td>' + data.PrecioCompra + '</td>');
                    newRow.append('<td>' + cant + '</td>');
                    newRow.append('<td style="display: none;">' + data.IdProducto + '</td>');
                    newRow.append('<td><button type="button" class="btn btn-danger btn-sm eliminarPFC-btn"><i class="fas fa-trash"></i></button></td>');

                    // Agregar la nueva fila a la tabla
                    $('#tablaFacturaCompraProductos tbody').append(newRow);

                    // Actualizar los valores de SubTotal, Impuesto y Total
                    actualizarValoresFacturaCompra();

                    // Limpiar el selectpicker seleccionado
                    $('#productoSelectFV').val('');

                    // Actualizar el selectpicker
                    cargarSelectProductosFC();
                }
            },
            error: function (xhr, status, error) {
                // Manejar errores
                console.log(error);
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

$('#FacturaCompraFormulario').submit(function (event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Obtener el método de pago seleccionado
    var metodoPago = "Efectivo"; // Valor predeterminado para Efectivo
    if ($('#checkTarjetaFc').is(':checked')) {
        metodoPago = "Tarjeta"; // Cambiar a 1 si Tarjeta está seleccionada
    }

    // Obtener los datos del cliente seleccionado
    var ProveedorId = $('#ProveedorSelectPickFC').val();
    var facturaId = $('#IdFacturaVenta').val();

    // Obtener los datos de la tabla
    var productos = [];
    $('#tablaFacturaCompraProductos tbody tr').each(function () {
        var producto = {
            nombre: $(this).find('td:eq(0)').text(),
            Cantidad: parseInt($(this).find('td:eq(3)').text()),
            Precio: parseFloat($(this).find('td:eq(2)').text()),
            IdProducto: parseFloat($(this).find('td:eq(4)').text())
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
                'Agregado!',
                'Este Producto se ha Agregado.',
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
