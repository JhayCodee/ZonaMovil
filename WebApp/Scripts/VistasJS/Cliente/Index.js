$(function () {

    var vistaClienteComponente, tablaCliente;
    var modo = "";

    // contenedor para rotar las vistas
    vistaClienteComponente = {
        url: baseUrl + 'Cliente',
        contenedorTabla: $('#clienteIndexContainer'),
        contenedorFormulario: $('#clienteFormularioContainer')
    }

    // se oculta el formulario
    vistaClienteComponente.contenedorFormulario.hide();

    // se hace una peticion de los clientes para cargar la data table (la tabla de jquery)
    cargarTablaClientes()

    // poblar el formularion con editar:
    $("#TablaClientes").on('click', '.btnEditar', function () {
        // Obtener el ID del cliente
        var idCliente = $(this).data('id');
        modo = "editar"

        // Llamar al método de búsqueda por ID para obtener la información del cliente
        $.ajax({
            url: vistaClienteComponente.url + '/BuscarClientePorID',
            type: 'GET',
            data: { id: idCliente },
            success: function (cliente) {
                // Poblar el formulario con la información del cliente
                $('#IdCliente').val(cliente.IdCliente);
                $('#NombreCliente').val(cliente.Nombres);
                $('#ApellidoClientes').val(cliente.Apellidos);
                $('#CedulaCliente').val(cliente.Cedula);
                $('#CorreoCliente').val(cliente.Correo);
                $('#TelefonoCliente').val(cliente.Telefono);

                // Mostrar el formulario
                vistaClienteComponente.contenedorTabla.hide();
                vistaClienteComponente.contenedorFormulario.show();
            },
            error: function () {
                console.log('Error al obtener la información del cliente.');
            }
        });
    });

    // formulario
    // función de clic del botón "Guardar"
    $('#btnGuardarCliente').click(function (e) {
        e.preventDefault(); // Evita que se envíe el formulario de forma predeterminada

        if ($('#FormularioCliente').valid()) {
            // Obtener los valores de los campos de entrada del formulario
            var id = $('#IdCliente').val();
            var nombre = $('#NombreCliente').val();
            var apellidos = $('#ApellidoClientes').val();
            var cedula = $('#CedulaCliente').val();
            var correo = $('#CorreoCliente').val();
            var telefono = $('#TelefonoCliente').val();

            // Crear un objeto con los datos del formulario
            var data = {
                Nombres: nombre,
                Apellidos: apellidos,
                Cedula: cedula,
                Correo: correo,
                Telefono: telefono
            };

            if (modo === "editar") {
                data.IdCliente = id;
            }

            // determinar si se trata de una operación de creación o edición
            var url = "";
            if (modo === "editar") {
                url = vistaClienteComponente.url + '/EditarCliente'; // establecer la URL para la edición

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
                                    cargarTablaClientes();
                                    vistaClienteComponente.contenedorTabla.show();
                                    vistaClienteComponente.contenedorFormulario.hide();
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
                url = vistaClienteComponente.url + '/AgregarCliente'; // establecer la URL para la creación
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
                            cargarTablaClientes();
                            vistaClienteComponente.contenedorTabla.show();
                            vistaClienteComponente.contenedorFormulario.hide();
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
    $("#TablaClientes").on('click', '.btnEliminar', function () {
        var idCliente = $(this).data('id');

        Swal.fire({
            title: '¿Está seguro de eliminar este cliente?',
            text: 'No podrás revertir esta acción después de eliminar al cliente',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: vistaClienteComponente.url + '/EliminarCliente',
                    type: 'POST',
                    data: { id: idCliente },
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            Swal.fire(
                                'Eliminado',
                                response.message,
                                'success'
                            ).then(() => {
                                // Actualizar la tabla
                                cargarTablaClientes();
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

    function cargarTablaClientes() {
        $.ajax({
            url: "/Cliente/ListarClientes",
            type: "GET",
            success: function (data) {
                if ($.fn.DataTable.isDataTable('#TablaClientes')) {
                    $('#TablaClientes').DataTable().destroy();
                }
                tablaCliente = $("#TablaClientes").DataTable({
                    "data": data,
                    dom: "<'row'<'col-md-12'B>>" + "<'row'<'col-md-6'l><'col-md-6'f>>" + "<'row'<'col-md-12'tr>>" + "<'row'<'col-md-5'i><'col-md-7'p>>",
                    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "TODOS"]],
                    pageLength: 10,
                    "columns": [
                        //{ "data": "IdCliente" },
                        { "data": "Nombres" },
                        { "data": "Apellidos" },
                        { "data": "Cedula" },
                        { "data": "Correo" },
                        { "data": "Telefono" },
                        {
                            "data": null,
                            "render": function (data, type, row, meta) {
                                return '<div class="centrar" style="display:flex; justify-content:center; gap:6px;">' +
                                    '<button type="button" class="btn btn-primary btnEditar" data-id="' + row.IdCliente + '"> <i class="fas fa-solid fa-pen"></i> </button>' +
                                    '<button type="button" class="btn btn-danger btnEliminar" data-id="' + row.IdCliente + '"> <i class="fas fa-solid fa-trash"></i> </button>' +
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
                                $('#FormularioCliente')[0].reset();
                                modo = "crear";
                                vistaClienteComponente.contenedorTabla.hide();
                                vistaClienteComponente.contenedorFormulario.show();
                            }

                        },
                    ]
                });
            },
            error: function () {
                console.log("Error al obtener los clientes.");
            }
        });
    }

    // boton para regresar del formulario a la tabla
    $('#btnRegresarCliente').click(function () {
        $("#FormularioCliente").find(".is-invalid").removeClass("is-invalid");
        $("#FormularioCliente").find(".is-valid").removeClass("is-valid");
        vistaClienteComponente.contenedorTabla.show();
        vistaClienteComponente.contenedorFormulario.hide();
    });
});
