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
    cargarTablaProductos();
    cargarOpcionesCategoria();
    cargarOpcionesMarca();

    // poblar el formularion con editar:
    $("#tablaProducto").on('click', '.btnEditar', function () {
        // Obtener el ID del cliente
        var producto = $(this).data('id');
        modo = "editar"
        resetFormProduct();
        // Llamar al método de búsqueda por ID para obtener la información del cliente
        $.ajax({
            url: vistaProductoComponente.url + '/BuscarProductoPorID',
            type: 'POST',
            data: { id: producto },
            success: function (producto) {
                // Poblar el formulario con la información del cliente
                $("#IdProducto").val(producto.IdProducto);
                $('#NombreProducto').val(producto.Nombre);
                $('#ModeloProducto').val(producto.Modelo);
                $('#StockProducto').val(producto.Stock);
                $('#GarantiaProducto').val(producto.GarantiaEnMeses);
                $('#PrecioCompra').val(producto.PrecioCompra);
                $('#PrecioVenta').val(producto.PrecioVenta);
                $('#DescripcionProducto').val(producto.Descripcion);

                //poblar los selectpicker
                

                // Seleccionar la opción correspondiente al ID de categoría del producto
                $('#categoriaSelect').val(producto.IdCategoria);
                // Actualizar el selectpicker de categoría
                $('#categoriaSelect').selectpicker('refresh');

                // Seleccionar la opción correspondiente al ID de marca del producto
                $('#MarcaSelect').val(producto.IdMarca);
                // Actualizar el selectpicker de marca
                $('#MarcaSelect').selectpicker('refresh');

                // Mostrar el formulario
                vistaProductoComponente.contenedorTabla.hide();
                vistaProductoComponente.contenedorFormulario.show();
            },
            error: function () {
                console.log('Error al obtener la información del cliente.');
            }
        });
    });

    $("#tablaProducto").on('click', '.btnEliminar', function () {
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
                    url: '/Producto/EliminarProducto',
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
                                cargarTablaProductos()
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

    

    $('#btnGuardarProducto').click(function (e) {

        e.preventDefault();

        if ($('#FormularioProducto').valid()) {
            console.log('Valido');

            idP = $("#IdProducto").val();

            var data = {
                Nombre: $('#NombreProducto').val(),
                Modelo: $('#ModeloProducto').val(),
                Stock: $('#StockProducto').val(),
                GarantiaEnMeses: $('#GarantiaProducto').val(),
                IdMarca: $('#MarcaSelect').val(),
                IdCategoria: $('#categoriaSelect').val(),
                PrecioCompra: $('#PrecioCompra').val(),
                PrecioVenta: $('#PrecioVenta').val(),
                Descripcion: $('#DescripcionProducto').val(),
                Activo: true
            };

            // determinar si se trata de una operación de creación o edición
            var url = "";
            if (modo === "editar") {
                data.IdProducto = idP;
                url = vistaProductoComponente.url + '/EditarProducto';
                Swal.fire({
                    title: 'Estas seguro?',
                    text: "Este registro se actualizará",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, Actualizar!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Realizar solicitud AJAX para actualizar el registro
                        $.ajax({
                            type: 'POST',
                            url: url,
                            data: data,
                            success: function (response) {
                                // Verificar si la propiedad success es igual a true
                                if (response.success) {
                                    // Manejar la respuesta del controlador si es necesario
                                    console.log(response);
                                    // Mostrar SweetAlert de éxito y volver a la tabla
                                    Swal.fire(
                                        'Actualizado!',
                                        'Este registro se ha actualizado.',
                                        'success'
                                    ).then(() => {
                                        cargarTablaProductos();
                                        vistaProductoComponente.contenedorTabla.show();
                                        vistaProductoComponente.contenedorFormulario.hide();
                                    });
                                } else {
                                    // Mostrar SweetAlert de error si la propiedad success no es true
                                    Swal.fire(
                                        'Error!',
                                        'Ha ocurrido un error al actualizar el registro.',
                                        'error'
                                    );
                                }
                            },
                            error: function (xhr, status, error) {
                                // Manejar el error si es necesario
                                console.log(xhr.responseText);

                                // Obtener el mensaje de error del objeto JSON de respuesta
                                var response = JSON.parse(xhr.responseText);
                                var errorMessage = response.error;

                                // Mostrar SweetAlert de error con el mensaje específico
                                Swal.fire(
                                    'Error!',
                                    errorMessage,
                                    'error'
                                );
                            }
                        });
                    }
                });
            }
            else {
                $.ajax({
                    type: 'POST',
                    url: '/Producto/AgregarProducto',
                    data: data,
                    success: function (response) {
                        // Manejar la respuesta del controlador si es necesario
                        console.log(response);
                        // Mostrar SweetAlert de éxito y volver a la tabla
                        Swal.fire(
                            'Agregado!',
                            'Este Producto se ha Agregado.',
                            'success'
                        ).then(() => {
                            cargarTablaProductos();
                            resetFormProduct();
                            vistaProductoComponente.contenedorTabla.show();
                            vistaProductoComponente.contenedorFormulario.hide();
                        });
                    },
                    error: function (xhr, status, error) {
                        // Manejar el error si es necesario
                        console.log(xhr.responseText);
                    }
                });
            }
        }
        else {
            console.log('Invalido');
        }

    });

    $("#tablaProducto").on('click', '.btnVer', function () {
        var id = $(this).data('id');
        $.ajax({
            url: '/Producto/ObtenerDetalleProducto',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                if (response.success) {
                    var data = response.data;
                    // Cargar los valores en los inputs bloqueados
                    $("#detalleIdProducto").val(data.IdProducto);
                    $("#detalleNombreProducto").val(data.Nombre);
                    $("#detalleModeloProducto").val(data.Modelo);
                    $("#detalleStockProducto").val(data.Stock);
                    $("#detalleGarantiaProducto").val(data.GarantiaEnMeses);
                    $("#detalleMarcaInput").val(data.Marca);
                    $("#detalleCategoriaInput").val(data.Categoria);
                    $("#detallePrecioCompra").val(data.PrecioCompra);
                    $("#detallePrecioVenta").val(data.PrecioVenta);
                    $("#detalleDescripcionProducto").val(data.Descripcion);

                    // Abrir el modal
                    $("#detalleproductoModal").modal("show");
                } else {
                    console.log("Error: " + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });


    // Listener para el evento "changed.bs.select" del selectpicker categoria
    $('#categoriaSelect').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
        // Obtener ID de la categoría seleccionada
        var categoriaId = $(this).val();

        // Establecer valor del input oculto
        $('#categoriaIdInput').val(categoriaId);
    });

    // Listener para el evento "changed.bs.select" del selectpicker marca
    $('#MarcaSelect').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
        // Obtener ID de la categoría seleccionada
        var MarcaId = $(this).val();

        // Establecer valor del input oculto
        $('#MarcaIdInput').val(MarcaId);
    });

    function cargarTablaProductos() {
        $.ajax({
            url: "/Producto/ListarProductos",
            type: "GET",
            success: function (data) {
                if ($.fn.DataTable.isDataTable('#tablaProducto')) {
                    $('#tablaProducto').DataTable().destroy();
                }
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
                                    '<button type="button" class="btn btn-info btnVer" data-id="' + row.IdProducto + '"> <i class="fas fa-solid fa-eye"></i> </button>' +
                                    '<button type="button" class="btn btn-primary btnEditar" data-id="' + row.IdProducto + '"> <i class="fas fa-solid fa-pen"></i> </button>' +
                                    '<button type="button" class="btn btn-danger btnEliminar" data-id="' + row.IdProducto + '"> <i class="fas fa-solid fa-trash"></i> </button>' +
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
                                resetFormProduct();
                                modo = "crear"
                                vistaProductoComponente.contenedorTabla.hide();
                                vistaProductoComponente.contenedorFormulario.show();
                            }

                        },
                        {
                            extend: 'excel',
                            text: 'Exportar a Excel',
                            className: 'btn btn-success mb-2',
                            titleAttr: "Exportar a Excel"
                        },
                        {
                            extend: 'pdf',
                            text: 'Exportar a PDF',
                            className: 'btn btn-danger mb-2',
                            titleAttr: "Exportar a PDF"
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
                console.log("Error al obtener los clientes.");
            }
        });
    }

    // Función para cargar opciones del selectpicker
    function cargarOpcionesCategoria() {
        $.ajax({
            url: '/Categoria/ListarCategorias',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Obtener el selectpicker
                var selectpicker = $('#categoriaSelect');

                // Obtener la opción "Seleccionar categoría"
                var opcionSeleccionar = selectpicker.find('option[value=""]');

                // Deshabilitar la opción "Seleccionar categoría"
                opcionSeleccionar.prop('disabled', true);

                // Agregar opciones al selectpicker
                $.each(data, function (key, value) {
                    selectpicker.append('<option value="' + value.IdCategoria + '">' + value.Nombre + '</option>');
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

    // Función para cargar opciones del selectpicker
    function cargarOpcionesMarca() {
        $.ajax({
            url: '/Marca/ListarMarcas',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Obtener el selectpicker
                var selectpicker = $('#MarcaSelect');

                // Obtener la opción "Seleccionar categoría"
                var opcionSeleccionar = selectpicker.find('option[value=""]');

                // Deshabilitar la opción "Seleccionar categoría"
                opcionSeleccionar.prop('disabled', true);

                // Agregar opciones al selectpicker
                $.each(data, function (key, value) {
                    selectpicker.append('<option value="' + value.IdMarca + '">' + value.Nombre + '</option>');
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

    function resetFormProduct() {
        $("#FormularioProducto")[0].reset();
        $("#FormularioProducto").validate().resetForm();
        $('#MarcaSelect').val('').selectpicker('refresh');
        $('#categoriaSelect').val('').selectpicker('refresh');
        $("#FormularioProducto").find(".is-invalid").removeClass("is-invalid");
        $("#FormularioProducto").find(".is-valid").removeClass("is-valid");
    }

    $('#btnRegresarProducto').click(function () {
        resetFormProduct();
        vistaProductoComponente.contenedorTabla.show();
        vistaProductoComponente.contenedorFormulario.hide();
    });

});