$(function () {

    var vistaProveedorComponente, tablaProveedor;
    var modo = "";

    // contenedor para rotar las vistas
    vistaProveedorComponente = {
        url: baseUrl + 'Proveedor',
        contenedorTabla: $('#proveedorIndexContainer'),
        contenedorFormulario: $('#proveedorFormularioContainer')
    }

    // se oculta el formulario
    vistaProveedorComponente.contenedorFormulario.hide();

    // se hace una peticion de las categorias para cargar la data table (la tabla de jquery)
    cargarTablaProveedor()

    // poblar el formularion con editar:
    $("#TablaProveedor").on('click', '.btnEditar', function () {
        // Obtener el ID del cliente
        var IdProveedor = $(this).data('id');
        modo = "editar"

        // Llamar al método de búsqueda por ID para obtener la información del cliente
        $.ajax({
            url: vistaProveedorComponente.url + '/BuscarProveedorPorID',
            type: 'GET',
            data: { id: IdProveedor },
            success: function (proveedor) {
                // Poblar el formulario con la información del cliente
                $('#IdProveedor').val(proveedor.IdProveedor);
                $('#NombreProveedor').val(proveedor.Nombre);
                $('#TelefonoProveedor').val(proveedor.Telefono);
                $('#CorreoProveedor').val(proveedor.Correo);
                $('#DireccionProveedor').val(proveedor.Direccion);
                // Mostrar el formulario
                vistaProveedorComponente.contenedorTabla.hide();
                vistaProveedorComponente.contenedorFormulario.show();
            },
            error: function () {
                console.log('Error al obtener la información del proveedor.');
            }
        });
    });

    // formulario
    // función de clic del botón "Guardar"
    $('#btnGuardarProveedor').click(function (e) {
        e.preventDefault(); // Evita que se envíe el formulario de forma predeterminada

        if ($('#FormularioProveedor').valid()) {
            // Obtener los valores de los campos de entrada del formulario
            var id = $('#IdProveedor').val();
            var nombre = $('#NombreProveedor').val();
            var telefono = $('#TelefonoProveedor').val();
            var correo = $('#CorreoProveedor').val();
            var direccion = $('#DireccionProveedor').val();

            // Crear un objeto con los datos del formulario
            var data = {
                Nombre: nombre,
                Telefono: telefono,
                Correo: correo,
                Direccion: direccion,
            };

            if (modo === "editar") {
                data.IdProveedor = id;
            }

            // determinar si se trata de una operación de creación o edición
            var url = "";
            if (modo === "editar") {
                url = vistaProveedorComponente.url + '/EditarProveedor'; // establecer la URL para la edición

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
                                // Manejar la respuesta del controlador si es necesario
                                console.log(response);
                                // Mostrar SweetAlert de éxito y volver a la tabla
                                Swal.fire(
                                    'Actualizado!',
                                    'Este registro se ha actualizado.',
                                    'success'
                                ).then(() => {
                                    cargarTablaProveedor();
                                    $("#FormularioProveedor").find(".is-invalid").removeClass("is-invalid");
                                    $("#FormularioProveedor").find(".is-valid").removeClass("is-valid");
                                    vistaProveedorComponente.contenedorTabla.show();
                                    vistaProveedorComponente.contenedorFormulario.hide();
                                });
                            },
                            error: function (xhr, status, error) {
                                // Manejar el error si es necesario
                                console.log(xhr.responseText);
                            }
                        });
                    }
                })

            } else {
                url = vistaProveedorComponente.url + '/AgregarProveedor'; // establecer la URL para la creación
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    success: function (response) {
                        // Manejar la respuesta del controlador si es necesario
                        console.log(response);
                        // Mostrar SweetAlert de éxito y volver a la tabla
                        Swal.fire(
                            'Creado!',
                            'Este registro se ha creado con éxito.',
                            'success'
                        ).then(() => {
                            cargarTablaProveedor();
                            $("#FormularioProveedor").find(".is-invalid").removeClass("is-invalid");
                            $("#FormularioProveedor").find(".is-valid").removeClass("is-valid");
                            vistaProveedorComponente.contenedorTabla.show();
                            vistaProveedorComponente.contenedorFormulario.hide();
                        });
                    },
                    error: function (xhr, status, error) {
                        // Manejar el error si es necesario
                        console.log(xhr.responseText);
                    }
                });
            }
        } else {
            console.log('Inválido');
        }
    });

    // boton eliminar 
    $("#TablaProveedor").on('click', '.btnEliminar', function () {
        var idProveedor = $(this).data('id');

        Swal.fire({
            title: '¿Está seguro de eliminar este proveedor?',
            text: 'No podrás revertir esta acción después de eliminar el proveedor',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: vistaProveedorComponente.url + '/EliminarProveedor',
                    type: 'POST',
                    data: { id: idProveedor },
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            Swal.fire(
                                'Eliminado',
                                response.message,
                                'success'
                            ).then(() => {
                                // Actualizar la tabla
                                cargarTablaProveedor();
                            });
                        }
                        else {
                            Swal.fire(
                                'Error',
                                response.message,
                                'error'
                            );
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        Swal.fire(
                            'Error',
                            'Ha ocurrido un error en el servidor',
                            'error'
                        );
                    }
                });
            }
        })
    });

    function cargarTablaProveedor() {
        $.ajax({
            url: "/Proveedor/ListarProveedores",
            type: "GET",
            success: function (data) {
                if ($.fn.DataTable.isDataTable('#TablaProveedor')) {
                    $('#TablaProveedor').DataTable().destroy();
                }
                tablaProveedor = $("#TablaProveedor").DataTable({
                    "data": data,
                    dom: "<'row'<'col-md-12'B>>" + "<'row'<'col-md-6'l><'col-md-6'f>>" + "<'row'<'col-md-12'tr>>" + "<'row'<'col-md-5'i><'col-md-7'p>>",
                    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "TODOS"]],
                    pageLength: 10,
                    "columns": [
                        //{ "data": "IdCliente" },
                        { "data": "Nombre" },
                        { "data": "Telefono" },
                        { "data": "Correo" },
                        { "data": "Direccion" },
                        {
                            "data": null,
                            "render": function (data, type, row, meta) {
                                return '<div class="centrar" style="display:flex; justify-content:center; gap:6px;">' +
                                    '<button type="button" class="btn btn-primary btnEditar" data-id="' + row.IdProveedor + '"> <i class="fas fa-solid fa-pen"></i> </button>' +
                                    '<button type="button" class="btn btn-danger btnEliminar" data-id="' + row.IdProveedor + '"> <i class="fas fa-solid fa-trash"></i> </button>' +
                                    '</div>';
                            }
                        },
                    ],
                    buttons: [
                        {
                            text: 'Nuevo',
                            className: 'btn btn-primary mb-2',
                            titleAttr: "Crear un nuevo registro",
                            // si se da click en el boton mostrar el formulario y ocultar la tabla
                            action: function (e, dt, node, config) {
                                $('#FormularioProveedor')[0].reset();
                                modo = "crear";
                                vistaProveedorComponente.contenedorTabla.hide();
                                vistaProveedorComponente.contenedorFormulario.show();
                            }

                        },
                    ]
                });
            },
            error: function () {
                console.log("Error al obtener los proveedores.");
            }
        });
    }

    // boton para regresar del formulario a la tabla
    $('#btnRegresarProveedor').click(function () {
        $("#FormularioProveedor").find(".is-invalid").removeClass("is-invalid");
        $("#FormularioProveedor").find(".is-valid").removeClass("is-valid");
        vistaProveedorComponente.contenedorTabla.show();
        vistaProveedorComponente.contenedorFormulario.hide();
    });
});