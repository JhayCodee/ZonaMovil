var ComponenteVentasPorFecha;

// contenedor para rotar las vistas
ComponenteVentasPorFecha = {
    url: baseUrl + 'Ventas',
    contenedorTabla: $('#VentasPorFechasContainer'),
}

// buttons 

var startDate;
var endDate;

$('#btnBuscarRangoFecha').click(function () {
    var dateRange = $('input[name="VentasPorFechasDTP"]').data('daterangepicker');
    startDate = dateRange.startDate.format('YYYY-MM-DD');
    endDate = dateRange.endDate.format('YYYY-MM-DD');

    cargarTablaVentasPorFecha(startDate, endDate);
});

$("#tablaVentasPorFechas").on('click', '.btnVer', function () {
    var id = $(this).data('id');
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

// funciones

function cargarTablaVentasPorFecha(f1, f2) {
    $.ajax({
        url: "/ReporteVentas/ListarFacturasVentas",
        type: "POST",
        data: {
            startDate: f1,
            endDate: f2
        },
        success: function (data) {
            if ($.fn.DataTable.isDataTable('#tablaVentasPorFechas')) {
                $('#tablaVentasPorFechas').DataTable().destroy();
            }
            data.data.forEach(function (row) {
                row.Fecha = new Date(parseInt(row.Fecha.substr(6)));
            });

            $("#tablaVentasPorFechas").DataTable({
                // Configuración de la DataTable
                dom: "<'row'<'col-md-12'B>>" + "<'row'<'col-md-6'l><'col-md-6'f>>" + "<'row'<'col-md-12'tr>>" + "<'row'<'col-md-5'i><'col-md-7'p>>",
                data: data.data,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "TODOS"]],
                pageLength: 10,
                // Columnas y renderizado personalizado
                columns: [
                    { data: "NumeroFactura" },
                    { data: "Cliente" },
                    {
                        data: "Fecha",
                        render: function (data, type, row, meta) {
                            var fechaFormateada = moment(data).format("DD/MM/YYYY");
                            return fechaFormateada;
                        }
                    },
                    { data: "Impuesto" },
                    { data: "Total" },
                    {
                        data: "Activo",
                        render: function (data, type, row, meta) {
                            return (row.Activo) ? '<span class="badge badge-success">Activa</span>' : '<span class="badge badge-danger">Anulada</span>';
                        }
                    },
                    {
                        data: null,
                        render: function (data, type, row, meta) {
                            return '<div class="centrar" style="display:flex; justify-content:center; gap:6px;">' +
                                '<button type="button" class="btn btn-info btnVer" data-id="' + row.NumeroFactura + '"> <i class="fas fa-solid fa-eye"></i> </button>' +
                                '</div>';
                        }
                    }
                ],
                columnDefs: [
                    { type: "datetime-moment", targets: 2 }
                ],
                buttons: [
                    {
                        text: 'Generar Reporte',
                        className: 'btn btn-info mb-2',
                        action: function (e, dt, node, config) {
                            window.location.href = '/ReporteVentas/print?f1=' + startDate + '&f2=' + endDate;
                        },
                        attr: {
                            id: 'btnGenerarReporte'
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


// set

$('input[name="VentasPorFechasDTP"]').daterangepicker({
    startDate: moment(),
    opens: 'right',
    locale: {
        format: 'DD/MM/YYYY',
        separator: ' - ',
        applyLabel: 'Aplicar',
        cancelLabel: 'Cancelar',
        fromLabel: 'Desde',
        toLabel: 'Hasta',
        customRangeLabel: 'Rango personalizado',
        weekLabel: 'S',
        daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        monthNames: [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre'
        ],
    }
}, function (start, end, label) {
});