using Datos;
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


        #region Ventas
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
                                    Cantidad = d.Cantidad,
                                    Precio = d.Producto.PrecioVenta,
                                    Modelo = d.Producto.Modelo,
                                    Almacenamiento = (int?)d.Producto.Almacenamiento,
                                    RAM = d.Producto.RAM,
                                    Color = d.Producto.Color,
                                    Garantia = d.Producto.GarantiaEnMeses
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

        public bool ObtenerReporteVentas(ref List<spReporteVentas_VM> lista, DateTime fechaInicio, DateTime fechaFin)
        {
            try
            {
                lista = _db.spReporteVentas(fechaInicio, fechaFin)
                    .Select(x => new spReporteVentas_VM
                    {
                        Nombreproducto = x.Nombreproducto,
                        Marcaproducto = x.Marcaproducto,
                        Modeloproducto = x.Modeloproducto,
                        RAM = x.RAM,
                        Almacenamiento = x.Almacenamiento,
                        Color = x.Color,
                        Cantidadvendida = x.Cantidadvendida,
                        PrecioVenta = x.PrecioVenta,
                        Total = x.Total,
                        Numerofacturas = x.Numerofacturas
                    })
                    .ToList();

                return true;
            }
            catch
            {
                return false;
            }
        }

        #endregion


        #region Pedidos

        public bool Imprimirpedido(int numeroFactura, ref string errorMessage, ref ImprimirFactura_VM factura)
        {
            try
            {
                factura = _db.PedidoVenta
                    .Where(p => p.NumeroPedido == numeroFactura)
                    .Select(p => new ImprimirFactura_VM
                    {
                        IdFacturaVenta = p.IdPedidoVenta,
                        NumeroFactura = p.NumeroPedido,
                        FechaPedido = p.FechaPedido,
                        FechaEntrega = p.FechaEntrega,
                        Impuesto = p.Impuesto,
                        Total = p.Total,
                        Cliente = p.Cliente.Nombres + " " + p.Cliente.Apellidos,
                        Cedula = p.Cliente.Cedula,

                        listaProducto = _db.DetallePedidoVenta
                            .Where(d => d.IdPedidoVenta == p.IdPedidoVenta)
                            .Select(d => new DetalleFVImprimir
                            {
                                Producto = d.Producto.Nombre,
                                Cantidad = d.Cantidad,
                                Precio = d.Producto.PrecioVenta,
                                Modelo = d.Producto.Modelo,
                                Almacenamiento = (int?)d.Producto.Almacenamiento,
                                RAM = d.Producto.RAM,
                                Color = d.Producto.Color,
                                Garantia = d.Producto.GarantiaEnMeses
                            }).ToList()
                    }).FirstOrDefault();

                if (factura != null)
                {
                    return true;
                }
                else
                {
                    errorMessage = "No se encontró el pedido con el número: " + numeroFactura;
                    return false;
                }
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        #endregion

    }
}
