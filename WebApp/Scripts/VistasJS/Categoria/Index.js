$(function () {

    var vistaCategoriaComponente, tablaCategoria;
    var modo = "";

    // contenedor para rotar las vistas
    vistaCategoriaComponente = {
        url: baseUrl + 'Categoria',
        contenedorTabla: $('#categoriaIndexContainer'),
        contenedorFormulario: $('#categoriaFormularioContainer')
    }

    // se oculta el formulario
    vistaCategoriaComponente.contenedorFormulario.hide();

    // se hace una peticion de las categorias para cargar la data table (la tabla de jquery)
    cargarTablaCategoria()

    // poblar el formularion con editar:
    $("#TablaCategoria").on('click', '.btnEditar', function () {
        // Obtener el ID del cliente
        var IdCategoria = $(this).data('id');
        modo = "editar"

        // Llamar al método de búsqueda por ID para obtener la información del cliente
        $.ajax({
            url: vistaCategoriaComponente.url + '/BuscarCategoriaPorID',
            type: 'GET',
            data: { id: IdCategoria },
            success: function (categoria) {
                // Poblar el formulario con la información del cliente
                $('#IdCategoria').val(categoria.IdCategoria);
                $('#NombreCategoria').val(categoria.Nombre);


                // Mostrar el formulario
                vistaCategoriaComponente.contenedorTabla.hide();
                vistaCategoriaComponente.contenedorFormulario.show();
            },
            error: function () {
                console.log('Error al obtener la información de la categoria.');
            }
        });
    });

    // formulario
    // función de clic del botón "Guardar"
    $('#btnGuardarCategoria').click(function (e) {
        e.preventDefault(); // Evita que se envíe el formulario de forma predeterminada

        if ($('#FormularioCategoria').valid()) {
            // Obtener los valores de los campos de entrada del formulario
            var id = $('#IdCategoria').val();
            var nombre = $('#NombreCategoria').val();


            // Crear un objeto con los datos del formulario
            var data = {
                Nombre: nombre,
            };

            if (modo === "editar") {
                data.IdCategoria = id;
            }

            // determinar si se trata de una operación de creación o edición
            var url = "";
            if (modo === "editar") {
                url = vistaCategoriaComponente.url + '/EditarCategoria'; // establecer la URL para la edición

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
                                    cargarTablaCategoria();
                                    vistaCategoriaComponente.contenedorTabla.show();
                                    vistaCategoriaComponente.contenedorFormulario.hide();
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
                url = vistaCategoriaComponente.url + '/AgregarCategoria'; // establecer la URL para la creación
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
                            cargarTablaCategoria();
                            vistaCategoriaComponente.contenedorTabla.show();
                            vistaCategoriaComponente.contenedorFormulario.hide();
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
    $("#TablaCategoria").on('click', '.btnEliminar', function () {
        var idCategoria = $(this).data('id');

        Swal.fire({
            title: '¿Está seguro de eliminar esta categoria?',
            text: 'No podrás revertir esta acción después de eliminar la categoria',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: vistaCategoriaComponente.url + '/EliminarCategoria',
                    type: 'POST',
                    data: { id: idCategoria },
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            Swal.fire(
                                'Eliminado',
                                response.message,
                                'success'
                            ).then(() => {
                                // Actualizar la tabla
                                cargarTablaCategoria();
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

    function cargarTablaCategoria() {
        $.ajax({
            url: "/Categoria/ListarCategorias",
            type: "GET",
            success: function (data) {
                if ($.fn.DataTable.isDataTable('#TablaCategoria')) {
                    $('#TablaCategoria').DataTable().destroy();
                }
                tablaCategoria = $("#TablaCategoria").DataTable({
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
                                    '<button type="button" class="btn btn-primary btnEditar" data-id="' + row.IdCategoria + '"> <i class="fas fa-solid fa-pen"></i> </button>' +
                                    '<button type="button" class="btn btn-danger btnEliminar" data-id="' + row.IdCategoria + '"> <i class="fas fa-solid fa-trash"></i> </button>' +
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
                                $('#FormularioCategoria')[0].reset();
                                modo = "crear";
                                vistaCategoriaComponente.contenedorTabla.hide();
                                vistaCategoriaComponente.contenedorFormulario.show();
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
    $('#btnRegresarCategoria').click(function () {
        $("#FormularioCategoria").find(".is-invalid").removeClass("is-invalid");
        $("#FormularioCategoria").find(".is-valid").removeClass("is-valid");
        vistaCategoriaComponente.contenedorTabla.show();
        vistaCategoriaComponente.contenedorFormulario.hide();
    });
});
