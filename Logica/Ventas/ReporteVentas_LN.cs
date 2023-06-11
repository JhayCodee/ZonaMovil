﻿using Datos;
using Modelo;
using Modelo.ProcedimientosAlmacenados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Ventas
{
    public class ReporteVentas_LN
    {
        private readonly db_a97d9e_zonamovilEntities _db;

        public ReporteVentas_LN()
        {
            _db = new db_a97d9e_zonamovilEntities();
        }

        public bool FacturaPorRangoFecha(ref List<spBuscarFacturaVentaPorRangoFechas_VM> lista, DateTime f1, DateTime f2)
        {
            try
            {
                lista = _db.spBuscarFacturaVentaPorRangoFechas(f1, f2)
                    .Select(x => new spBuscarFacturaVentaPorRangoFechas_VM
                    {
                        IdCliente = x.IdCliente,
                        IdFacturaVenta = x.IdFacturaVenta,
                        NumeroFactura = x.NumeroFactura,
                        Cliente = x.Cliente,
                        Fecha = x.Fecha,
                        Impuesto = x.Impuesto,
                        Total = x.Total,
                        Activo = x.Activo
                    })
                    .OrderByDescending(x => x.Fecha) // Ordenar por fecha de forma descendente
                    .ToList();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool ImprimirFactura(int numeroFactura, ref string errorMessage, ref ImprimirFactura_VM factura)
        {
            try
            {
                factura = _db.FacturaVenta
                    .Where(f => f.NumeroFactura == numeroFactura)
                    .Select(f => new ImprimirFactura_VM
                    {
                        IdFacturaVenta = f.IdFacturaVenta,
                        NumeroFactura = f.NumeroFactura,
                        Fecha = f.Fecha,
                        Impuesto = f.Impuesto,
                        Total = f.Total,
                        Cliente = f.Cliente.Nombres + " " + f.Cliente.Apellidos,
                        Cedula = f.Cliente.Cedula,

                        listaProducto = _db.DetalleFacturaVenta
                                    .Where(d => d.IdFacturaVenta == f.IdFacturaVenta)
                                    .Select(d => new DetalleFVImprimir
                                    {
                                        Producto = d.Producto.Nombre,
                                        Cantidad = (int)d.Cantidad,
                                        Precio = (decimal)d.Producto.PrecioVenta,
                                        Modelo = d.Producto.Modelo
                                    }).ToList()

                    }).FirstOrDefault();

                if (factura != null)
                {
                    return true;
                }
                else
                {
                    errorMessage = "No se encontró la factura con el número: " + numeroFactura;
                    return false;
                }
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

    }
}
