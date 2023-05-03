$(function () {

    var vistaProductoComponente, tablaProducto;
    var modo = "";

    // contenedor para rotar las vistas
    vistaProductoComponente = {
        url: baseUrl + 'Producto',
        contenedorTabla: $('#ProductoTablaContainer'),
        contenedorFormulario: $('#ProductoFormularioContainer')
    }

    // se oculta el formulario
    vistaProductoComponente.contenedorFormulario.hide();

    // se hace una peticion de los clientes para cargar la data table (la tabla de jquery)
    $.ajax({
        url: vistaProductoComponente.url + "/ListarProductos",
        type: "GET",
        success: function (data) {
            tablaProducto = $("#tablaProducto").DataTable({
                "data": data,
                dom: "<'row'<'col-md-12'B>>" + "<'row'<'col-md-6'l><'col-md-6'f>>" + "<'row'<'col-md-12'tr>>" + "<'row'<'col-md-5'i><'col-md-7'p>>",
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "TODOS"]],
                pageLength: 10,
                "columns": [
                    { "data": "Nombre" },
                    { "data": "Modelo" },
                    { "data": "Stock" },
                    { "data": "GarantiaEnMeses" },
                    { "data": "PrecioCompra" },
                    { "data": "PrecioVenta" },
                    {
                        "data": null,
                        "render": function (data, type, row, meta) {
                            return '<div class="centrar" style="display:flex; justify-content:center; gap:6px;">' +
                                '<button type="button" class="btn btn-info btnVer" data-id="' + row.IdCliente + '"> <i class="fas fa-solid fa-eye"></i> </button>' +
                                '<button type="button" class="btn btn-primary btnEditar" data-id="' + row.IdCliente + '"> <i class="fas fa-solid fa-pen"></i> </button>' +
                                '<button type="button" class="btn btn-danger btnEliminar" data-id="' + row.IdCliente + '"> <i class="fas fa-solid fa-trash"></i> </button>' +
                                '</div>';
                        }
                    }

                ],
                buttons: [
                    {
                        text: 'Nuevo',
                        className: 'btn btn-primary mb-2',
                        titleAttr: "Crear un nuevo registro",
                        // si se da click en el boton mostrar el formulario y ocultar la tabla
                        action: function (e, dt, node, config) {
                            $('#FormularioCliente')[0].reset();
                            modo = "crear"
                            //vistaClienteComponente.contenedorTabla.hide();
                            //vistaClienteComponente.contenedorFormulario.show();
                        }

                    },
                ]
            });
        },
        error: function () {
            console.log("Error al obtener los clientes.");
        }
    });


});