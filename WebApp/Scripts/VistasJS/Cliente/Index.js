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
    $.ajax({
        url: "/Cliente/ListarClientes",
        type: "GET",
        success: function (data) {
            tablaCliente = $("#TablaClientes").DataTable({
                "data": data,
                dom: "<'row'<'col-md-12'B>>" + "<'row'<'col-md-6'l><'col-md-6'f>>" + "<'row'<'col-md-12'tr>>" + "<'row'<'col-md-5'i><'col-md-7'p>>",
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "TODOS"]],
                pageLength: 10,
                "columns": [
                    { "data": "IdCliente" },
                    { "data": "Nombres" },
                    { "data": "Apellidos" },
                    { "data": "Cedula" },
                    { "data": "Correo" },
                    { "data": "Telefono" },
                    {
                        "data": null,
                        "render": function (data, type, row, meta) {
                            return '<button type="button" class="btn btn-primary btnEditar" data-id="' + row.IdCliente + '"> Editar </button>';
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
        } else {
            url = vistaClienteComponente.url + '/AgregarCliente'; // establecer la URL para la creación
        }

        // Enviar una solicitud POST al controlador
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: function (response) {
                // Manejar la respuesta del controlador si es necesario
                console.log(response);
                vistaClienteComponente.contenedorTabla.show();
                vistaClienteComponente.contenedorFormulario.hide();
                $('#tablaClientes').DataTable().ajax.reload();
            },
            error: function (xhr, status, error) {
                // Manejar el error si es necesario
                console.log(xhr.responseText);
            }
        });

        
    });

    // boton para regresar del formulario a la tabla
    $('#btnRegresarCliente').click(function () {
        vistaClienteComponente.contenedorTabla.show();
        vistaClienteComponente.contenedorFormulario.hide();
    });
});