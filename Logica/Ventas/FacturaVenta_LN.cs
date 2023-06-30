using Datos;
using Modelo;
using Modelo.Consultas;
using Modelo.ProcedimientosAlmacenados;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Ventas
{
    public class FacturaVenta_LN
    {
        private readonly db_a97d9e_zonamovilEntities _db;

        public FacturaVenta_LN()
        {
            _db = new db_a97d9e_zonamovilEntities();
        }


        public bool AgregarFactura(FacturaVenta_VM fv, List<DetalleFacturaVentaAdd_VM> dfv, ref string errorMessage)
        {
            try
            {
                var factura = new FacturaVenta
                {
                    NumeroFactura = ObtenerUltimoNumeroFactura(),
                    Fecha = DateTime.Now,
                    Impuesto = fv.Impuesto,
                    TipoPago = fv.TipoPago,
                    Total = fv.Total,
                    IdCliente = fv.IdCliente,
                    Activo = true
                };

                _db.FacturaVenta.Add(factura);
                _db.SaveChanges();

                // Verificar si se agregó correctamente la factura
                if (factura.IdFacturaVenta > 0)
                {
                    // Obtener el ID de la factura recién creada
                    int facturaId = factura.IdFacturaVenta;

                    // Agregar los detalles de la factura
                    foreach (var detalle in dfv)
                    {
                        var detalleFactura = new DetalleFacturaVenta
                        {
                            IdFacturaVenta = facturaId,
                            IdProducto = detalle.IdProducto,
                            Cantidad = detalle.Cantidad,
                            Precio = detalle.Precio
                        };

                        _db.DetalleFacturaVenta.Add(detalleFactura);

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

        public bool EliminarFactura(int id, ref string errroMessgae)
        {
            try
            {
                var fact = _db.FacturaVenta.FirstOrDefault(x => x.IdFacturaVenta == id);

                if (fact != null)
                {
                    fact.Activo = false;
                    _db.Entry(fact).State = EntityState.Modified;
                    _db.SaveChanges();

                    // Obtener los detalles de la factura
                    var detallesFactura = _db.DetalleFacturaVenta.Where(x => x.IdFacturaVenta == id).ToList();

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
                    errroMessgae = "Factura no encontrada";
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




        public bool ListarFacturas(ref List<InfoFacturaVenta_VM> listaFactura, ref string errorMessage)
        {
            try
            {
                listaFactura = _db.spInfoFacturaVenta().Select(f => new InfoFacturaVenta_VM
                {

                    IdFacturaVenta = f.IdFacturaVenta,
                    IdCliente = f.IdCliente,
                    Cliente = f.Cliente,
                    NumeroFactura = f.NumeroFactura,
                    Fecha = f.Fecha,
                    Impuesto = f.Impuesto,
                    Total = f.Total,
                    TipoPago = f.TipoPago,
                    Activo = f.Activo

                }).Where(x => x.Activo == true)
                    .ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool ListarDetalleFacturaVenta(int nf, ref List<DetalleFacturaVenta_VM> detalle, ref string errorMesagge)
        {
            try
            {
                detalle = _db.spDetalleFacturaVenta(nf).Select(d => new DetalleFacturaVenta_VM
                {
                    NumeroFactura = d.NumeroFactura,
                    Cliente = d.Cliente,
                    Telefono = d.Telefono,
                    Cedula = d.Cedula,
                    Fecha = d.Fecha,
                    Producto = d.Producto,
                    Cantidad = d.Cantidad,
                    PrecioVenta = d.PrecioVenta,
                    Modelo = d.Modelo,
                    Impuesto = d.Impuesto,
                    Total = d.Total,
                    RAM = d.RAM, 
                    Almacenamiento = d.Almacenamiento, 
                    Color = d.Color

                })
                .ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMesagge = ex.Message;
                return false;
            }
        }

        private int ObtenerUltimoNumeroFactura()
        {
            int ultimoNumeroFactura = 0; // Valor predeterminado si no se encuentra ningún número de factura

            try
            {
                // Obtener el último número de factura ordenando de forma descendente y tomando el primer registro
                var factura = _db.FacturaVenta.OrderByDescending(f => f.NumeroFactura).FirstOrDefault();

                if (factura != null && factura.NumeroFactura.HasValue)
                {
                    ultimoNumeroFactura = factura.NumeroFactura.Value;
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


    }
}
