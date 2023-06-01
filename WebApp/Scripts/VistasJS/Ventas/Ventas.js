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


// Evento de envío del formulario
$('#FacturaVentaFormulario').submit(function (event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Obtener los datos del cliente seleccionado
    var clienteId = $('#clienteSelectFV').val();

    // Obtener los datos de la tabla
    var productos = [];
    $('#tablaFacturaVentaProductos tbody tr').each(function () {
        var producto = {
            nombre: $(this).find('td:eq(0)').text(),
            modelo: $(this).find('td:eq(1)').text(),
            precioVenta: parseFloat($(this).find('td:eq(2)').text())
        };
        productos.push(producto);
    });

    // Obtener los datos de la sección "Facturar"
    var subtotal = parseFloat($('#subtotalFv').val());
    var impuesto = parseFloat($('#ImpuestoFV').val());
    var total = parseFloat($('#TotalFV').val());

    // Crear un objeto con todos los datos recopilados
    var datosFactura = {
        clienteId: clienteId,
        productos: productos,
        subtotal: subtotal,
        impuesto: impuesto,
        total: total
    };

    // Aquí puedes realizar la lógica para procesar los datos, como enviarlos a través de una solicitud AJAX o realizar otras operaciones necesarias

    // Mostrar los datos en la consola para verificar que se obtuvieron correctamente
    console.log(datosFactura);
});


$("#tablaFacturasVentas").on('click', '.btnVer', function () {
    var id = $(this).data('id');
    $("#detalleFacturaVentaModal").modal("show");
    $.ajax({
        url: "/Ventas/ListarDetalleFacturaVenta",
        type: "POST",
        data: { nf: id },
        success: function (response) {

            var data = response.data;
            var d = data[0];

            console.log(d);

            $("#detalleNumeroFactura").val(d.NumeroFactura);
            $("#detalleCliente").val(d.Cliente);
            $("#detalleCedula").val(d.Cedula);
            $("#detalletotal").val(d.Total);
            $("#detalleTelefono").val(d.Telefono);
            $("#detalleFecha").val(moment(parseInt(d.Fecha.substr(6))).format("DD/MM/YYYY"));

            var tabla = "";
            for (var i = 0; i < data.length; i++) {
                tabla += "<tr>";
                tabla += "<td>" + data[i].Producto + "</td>";
                tabla += "<td>" + data[i].Modelo + "</td>";
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

// Evento de clic para el botón "Agregar producto"
$('#addProductoFV').click(function () {
    // Obtener el producto seleccionado del selectpicker
    var productoId = $('#productoSelectFV').val();

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
                if (data) {
                    // Crear una nueva fila en la tabla con los datos del producto obtenidos
                    var newRow = $('<tr>');
                    newRow.append('<td>' + data.Nombre + '</td>');
                    newRow.append('<td>' + data.Modelo + '</td>');
                    newRow.append('<td>' + data.PrecioVenta + '</td>');
                    newRow.append('<td><button type="button" class="btn btn-danger btn-sm eliminarPFV-btn"><i class="fas fa-trash"></i></button></td>');

                    // Agregar la nueva fila a la tabla
                    $('#tablaFacturaVentaProductos tbody').append(newRow);

                    // Actualizar los valores de SubTotal, Impuesto y Total
                    actualizarValoresFactura();

                    // Limpiar el selectpicker seleccionado
                    $('#productoSelectFV').val('');

                    // Actualizar el selectpicker
                    $('#productoSelectFV').selectpicker('refresh');
                }
            },
            error: function (xhr, status, error) {
                // Manejar errores
                console.log(error);
            }
        });
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
        var precioVenta = parseFloat($(this).find('td:eq(2)').text());
        subtotal += precioVenta;
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

            // Obtener la opción "Seleccionar categoría"
            var opcionSeleccionar = selectpicker.find('option[value=""]');

            // Deshabilitar la opción "Seleccionar categoría"
            opcionSeleccionar.prop('disabled', true);

            // Agregar opciones al selectpicker
            $.each(data, function (key, value) {
                selectpicker.append('<option value="' + value.IdCliente + '">' + value.Nombres + ' ' + value.Apellidos + '</option>');
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

            // Obtener la opción "Seleccionar categoría"
            var opcionSeleccionar = selectpicker.find('option[value=""]');

            // Deshabilitar la opción "Seleccionar categoría"
            opcionSeleccionar.prop('disabled', true);

            // Agregar opciones al selectpicker
            $.each(data, function (key, value) {
                selectpicker.append('<option value="' + value.IdProducto + '">' + value.Nombre + '</option>');
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
                            //resetFormProduct();
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