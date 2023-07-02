using Datos;
using Modelo;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Pedidos
{
    public class Pedido_LN
    {
        private readonly db_a97d9e_zonamovilEntities _db;

        public Pedido_LN()
        {
            _db = new db_a97d9e_zonamovilEntities();
        }

        #region crud

        public bool AgregarPedido(Pedidos_VM fv, List<DetalleFacturaVentaAdd_VM> dfv, ref string errorMessage)
        {
            try
            {
                var factura = new PedidoVenta
                {
                    NumeroPedido = ObtenerUltimoNumeroPedido(),
                    FechaPedido = DateTime.Now,
                    FechaEntrega = fv.FechaEntrega,
                    Impuesto = fv.Impuesto,
                    TipoPago = fv.Pago,
                    Total = fv.Total,
                    IdCliente = fv.IdCliente,
                    Activo = true
                };

                _db.PedidoVenta.Add(factura);
                _db.SaveChanges();

                // Verificar si se agregó correctamente la factura
                if (factura.IdPedidoVenta > 0)
                {
                    // Obtener el ID de la factura recién creada
                    int facturaId = factura.IdPedidoVenta;

                    // Agregar los detalles de la factura
                    foreach (var detalle in dfv)
                    {
                        var detalleFactura = new DetallePedidoVenta
                        {
                            IdPedidoVenta = facturaId,
                            IdProducto = detalle.IdProducto,
                            Cantidad = detalle.Cantidad,
                            Precio = detalle.Precio
                        };

                        _db.DetallePedidoVenta.Add(detalleFactura);

                        // Restar la cantidad del producto al stock
                        var producto = _db.Producto.Find(detalle.IdProducto);
                        if (producto != null)
                        {
                            producto.Stock -= detalle.Cantidad;
                            _db.Entry(producto).State = EntityState.Modified;
                        }
                    }

                    _db.SaveChanges();

                    return true;

                }
                else
                {
                    // No se pudo agregar la factura
                    errorMessage = "No se pudo agregar la factura.";
                    return false;
                }
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool EliminarPedido(int id, ref string errroMessgae)
        {
            try
            {
                var fact = _db.PedidoVenta.FirstOrDefault(x => x.IdPedidoVenta == id);

                if (fact != null)
                {
                    fact.Activo = false;
                    _db.Entry(fact).State = EntityState.Modified;
                    _db.SaveChanges();

                    // Obtener los detalles de la factura
                    var detallesFactura = _db.DetallePedidoVenta.Where(x => x.IdPedidoVenta == id).ToList();

                    // Devolver los productos al stock
                    foreach (var detalleFactura in detallesFactura)
                    {
                        var producto = _db.Producto.Find(detalleFactura.IdProducto);
                        if (producto != null)
                        {
                            producto.Stock += detalleFactura.Cantidad;
                            _db.Entry(producto).State = EntityState.Modified;
                        }
                    }

                    _db.SaveChanges();
                }
                else
                {
                    errroMessgae = "Pedido no encontrado";
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                errroMessgae = ex.Message;
                return false;
            }
        }

        #endregion

        #region consultas
        public bool ListarPedidos(ref List<Pedidos_VM> lista, ref string errorMessage)
        {
            try
            {
                lista = _db.PedidoVenta
                    .Where(f => f.Activo == true)
                    .Select(f => new Pedidos_VM
                    {
                        NumeroPedido = f.NumeroPedido,
                        FechaPedido = f.FechaPedido,
                        FechaEntrega = f.FechaEntrega,
                        Cliente = f.Cliente.Nombres + " " + f.Cliente.Apellidos,
                        IdPedidoVenta = f.IdPedidoVenta,
                        Impuesto = f.Impuesto,
                        Total = f.Total,
                        Pago = f.TipoPago
                    }).OrderByDescending(x => x.NumeroPedido)
                    .ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        private int ObtenerUltimoNumeroPedido()
        {
            int ultimoNumeroFactura = 0; // Valor predeterminado si no se encuentra ningún número de factura

            try
            {
                // Obtener el último número de factura ordenando de forma descendente y tomando el primer registro
                var factura = _db.PedidoVenta.OrderByDescending(f => f.NumeroPedido).FirstOrDefault();

                if (factura != null && factura.NumeroPedido.HasValue)
                {
                    ultimoNumeroFactura = factura.NumeroPedido.Value;
                }
            }
            catch (Exception ex)
            {
                // Manejar errores
                Console.WriteLine(ex.Message);
            }

            ultimoNumeroFactura++;

            return ultimoNumeroFactura;
        }


        public bool ListarDetallePedidos(int nf, ref List<PedidoVentaDetalle_VM> detalle, ref string errorMesagge)
        {
            try
            {
                detalle = (from dpv in _db.DetallePedidoVenta
                                 join pv in _db.PedidoVenta on dpv.IdPedidoVenta equals pv.IdPedidoVenta
                                 join p in _db.Producto on dpv.IdProducto equals p.IdProducto
                                 join c in _db.Cliente on pv.IdCliente equals c.IdCliente
                                 where pv.NumeroPedido == nf
                                 select new PedidoVentaDetalle_VM
                                 {
                                     NumeroPedido = (int)pv.NumeroPedido,
                                     Cliente = c.Nombres + " " + c.Apellidos,
                                     Cedula = c.Cedula,
                                     Telefono = c.Telefono,
                                     FechaEntrega = (DateTime)pv.FechaEntrega,
                                     FechaPedido = (DateTime)pv.FechaPedido,
                                     Producto = p.Nombre,
                                     Modelo = p.Modelo,
                                     PrecioVenta = (decimal)p.PrecioVenta,
                                     Cantidad = (int)dpv.Cantidad,
                                     Impuesto = (decimal)pv.Impuesto,
                                     Total = (decimal)pv.Total,
                                     Almacenamiento = (int)p.Almacenamiento,
                                     RAM = (int)p.RAM,
                                     Color = p.Color
                                 }).ToList();


                return true;
            }
            catch (Exception ex)
            {
                errorMesagge = ex.Message;
                return false;
            }
        }

        #endregion


    }
}
