$(function () {

    var vistaMarcaComponente, tablaMarca;
    var modo = "";

    // contenedor para rotar las vistas
    vistaMarcaComponente = {
        url: baseUrl + 'Marca',
        contenedorTabla: $('#marcaIndexContainer'),
        contenedorFormulario: $('#marcaFormularioContainer')
    }

    // se oculta el formulario
    vistaMarcaComponente.contenedorFormulario.hide();

    // se hace una peticion de las marcas para cargar la data table (la tabla de jquery)
    cargarTablaMarca()

    // poblar el formularion con editar:
    $("#TablaMarca").on('click', '.btnEditar', function () {
        // Obtener el ID de marca
        var IdMarca = $(this).data('id');
        modo = "editar"

        // Llamar al método de búsqueda por ID para obtener la información de la marca
        $.ajax({
            url: vistaMarcaComponente.url + '/BuscarMarcaPorID',
            type: 'GET',
            data: { id: IdMarca },
            success: function (marca) {
                // Poblar el formulario con la información de la marca
                $('#IdMarca').val(marca.IdMarca);
                $('#NombreMarca').val(marca.Nombre);


                // Mostrar el formulario
                vistaMarcaComponente.contenedorTabla.hide();
                vistaMarcaComponente.contenedorFormulario.show();
            },
            error: function () {
                console.log('Error al obtener la información de la marca.');
            }
        });
    });

    // formulario
    // función de clic del botón "Guardar"
    $('#btnGuardarMarca').click(function (e) {
        e.preventDefault(); // evita que se envíe el formulario de forma predeterminada

        if ($('#FormularioMarca').valid()) {
            // obtener los valores de los campos de entrada del formulario
            var id = $('#IdMarca').val();
            var nombre = $('#NombreMarca').val();


            // crear un objeto con los datos del formulario
            var data = {
                Nombre: nombre,
            };

            if (modo === "editar") {
                data.IdMarca = id;
            }

            // determinar si se trata de una operación de creación o edición
            var url = "";
            if (modo === "editar") {
                url = vistaMarcaComponente.url + '/EditarMarca'; // establecer la url para la edición

                swal.fire({
                    title: 'Estas seguro?',
                    text: "Este registro se actualizará",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, Actualizar!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // realizar solicitud ajax para actualizar el registro
                        $.ajax({
                            type: 'POST',
                            url: url,
                            data: data,
                            success: function (response) {
                                // manejar la respuesta del controlador si es necesario
                                console.log(response);
                                // mostrar sweetalert de éxito y volver a la tabla
                                swal.fire(
                                    'Actualizado!',
                                    'Este registro se ha actualizado.',
                                    'success'
                                ).then(() => {
                                    cargarTablaMarca();
                                    $("#FormularioMarca").find(".is-invalid").removeClass("is-invalid");
                                    $("#FormularioMarca").find(".is-valid").removeClass("is-valid");
                                    vistaMarcaComponente.contenedorTabla.show();
                                    vistaMarcaComponente.contenedorFormulario.hide();
                                });
                            },
                            error: function (xhr, status, error) {
                                // manejar el error si es necesario
                                console.log(xhr.responseText);
                            }
                        });
                    }
                })

            } else {
                url = vistaMarcaComponente.url + '/AgregarMarca'; // establecer la url para la creación
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    success: function (response) {
                        // manejar la respuesta del controlador si es necesario
                        console.log(response);
                        // mostrar sweetalert de éxito y volver a la tabla
                        Swal.fire(
                            'Creado!',
                            'Este registro se ha creado con éxito.',
                            'success'
                        ).then(() => {
                            cargarTablaMarca();
                            $("#FormularioMarca").find(".is-invalid").removeClass("is-invalid");
                            $("#FormularioMarca").find(".is-valid").removeClass("is-valid");
                            vistaMarcaComponente.contenedorTabla.show();
                            vistaMarcaComponente.contenedorFormulario.hide();
                        });
                    },
                    error: function (xhr, status, error) {
                        // manejar el error si es necesario
                        console.log(xhr.responseText);
                    }
                });
            }
        } else {
            console.log('Inválido');
        }
    });

    //Botón eliminar 
    $("#TablaMarca").on('click', '.btnEliminar', function () {
        var idMarca = $(this).data('id');

        Swal.fire({
            title: '¿Está seguro de eliminar esta marca?',
            text: 'No podrás revertir esta acción después de eliminar la marca',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: vistaMarcaComponente.url + '/EliminarMarca',
                    type: 'POST',
                    data: { id: idMarca },
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            Swal.fire(
                                'Eliminado',
                                response.message,
                                'success'
                            ).then(() => {
                                // Actualizar la tabla
                                cargarTablaMarca();
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

    function cargarTablaMarca() {
        $.ajax({
            url: vistaMarcaComponente.url + '/ListarMarcas',
            type: "GET",
            success: function (data) {
                if ($.fn.DataTable.isDataTable('#TablaMarca')) {
                    $('#TablaMarca').DataTable().destroy();
                }
                tablaMarca = $("#TablaMarca").DataTable({
                    "data": data,
                    dom: "<'row'<'col-md-12'B>>" + "<'row'<'col-md-6'l><'col-md-6'f>>" + "<'row'<'col-md-12'tr>>" + "<'row'<'col-md-5'i><'col-md-7'p>>",
                    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "TODOS"]],
                    pageLength: 10,
                    "columns": [
                        //{ "data": "IdCliente" },
                        { "data": "Nombre" },
                        {
                            "data": null,
                            "render": function (data, type, row, meta) {
                                return '<div class="centrar" style="display:flex; justify-content:center; gap:6px;">' +
                                    '<button type="button" class="btn btn-primary btnEditar" data-id="' + row.IdMarca + '"> <i class="fas fa-solid fa-pen"></i> </button>' +
                                    '<button type="button" class="btn btn-danger btnEliminar" data-id="' + row.IdMarca + '"> <i class="fas fa-solid fa-trash"></i> </button>' +
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
                                $('#FormularioMarca')[0].reset();
                                modo = "crear";
                                vistaMarcaComponente.contenedorTabla.hide();
                                vistaMarcaComponente.contenedorFormulario.show();
                            }

                        },
                    ]
                });
            },
            error: function () {
                console.log("Error al obtener las categorias.");
            }
        });
    }

    // boton para regresar del formulario a la tabla
    $('#btnRegresarMarca').click(function () {
        $("#FormularioMarca").find(".is-invalid").removeClass("is-invalid");
        $("#FormularioMarca").find(".is-valid").removeClass("is-valid");
        vistaMarcaComponente.contenedorTabla.show();
        vistaMarcaComponente.contenedorFormulario.hide();
    });
});