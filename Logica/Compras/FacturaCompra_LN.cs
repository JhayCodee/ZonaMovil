using Datos;
using Modelo;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Compras
{
    public class FacturaCompra_LN
    {
        private readonly db_a97d9e_zonamovilEntities _db;

        public FacturaCompra_LN()
        {
            _db = new db_a97d9e_zonamovilEntities();
        }

        #region crud

        public bool AgregarFactura(FacturaCompraJs fv, List<DetalleFacturaVentaAdd_VM> dfv, ref string errorMessage)
        {
            try
            {
                var factura = new FacturaCompra
                {
                    NumeroFactura = ObtenerUltimoNumeroFacturaCompra(),
                    Fecha = DateTime.Now,
                    Impuesto = fv.Impuesto,
                    TipoPago = fv.TipoPago,
                    Total = fv.Total,
                    IdProveedor = fv.IdProveedor,
                    Activo = true
                };

                _db.FacturaCompra.Add(factura);
                _db.SaveChanges();

                // Verificar si se agregó correctamente la factura
                if (factura.IdFacturaCompra > 0)
                {
                    // Obtener el ID de la factura recién creada
                    int facturaId = factura.IdFacturaCompra;

                    // Agregar los detalles de la factura
                    foreach (var detalle in dfv)
                    {
                        var detalleFactura = new DetalleFacturaCompra
                        {
                            IdFacturaCompra = facturaId,
                            IdProducto = detalle.IdProducto,
                            Cantidad = detalle.Cantidad,
                            Precio = detalle.Precio
                        };

                        _db.DetalleFacturaCompra.Add(detalleFactura);

                        // sumar la cantidad del producto al stock
                        var producto = _db.Producto.Find(detalle.IdProducto);
                        if (producto != null)
                        {
                            producto.Stock += detalle.Cantidad;
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

        #endregion

        #region consultas

        public bool ListarTablaFacturaCompra(ref List<TablaFacturaCompra> lista, ref string errorMessage)
        {
            try
            {
                lista = _db.FacturaCompra
                    .Where(f => f.Activo == true)
                    .Select(f => new TablaFacturaCompra
                    {
                        NumeroFactura = f.NumeroFactura,
                        Fecha = f.Fecha,
                        IdFacturaCompra = f.IdFacturaCompra,
                        Total = f.Total,
                        ProveedorX = f.Proveedor.Nombre,


                    }).ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool ListarDetalleFacturaCompra(int nf, ref DetalleFacturaConmpra detalle, ref string errorMesagge)
        {
            try
            {
                var resultado = _db.DetalleFacturaCompra
                    .Join(
                        _db.Proveedor,
                        d => d.FacturaCompra.IdProveedor,
                        p => p.IdProveedor,
                        (d, p) => new { Detalle = d, Proveedor = p }
                    )
                    .Where(det => det.Detalle.FacturaCompra.NumeroFactura == nf)
                    .GroupBy(g => new
                    {
                        g.Detalle.FacturaCompra.NumeroFactura,
                        g.Proveedor.Nombre,
                        g.Proveedor.Telefono,
                        g.Detalle.FacturaCompra.Fecha,
                        g.Detalle.FacturaCompra.Total
                    })
                    .Select(g => new DetalleFacturaConmpra
                    {
                        NumeroFactura = g.Key.NumeroFactura,
                        ProveedorX = g.Key.Nombre,
                        Telefono = g.Key.Telefono,
                        Fecha = g.Key.Fecha,
                        Total = g.Key.Total,

                        Productos = g.SelectMany(det =>
                            _db.Producto
                            .Where(p => p.IdProducto == det.Detalle.IdProducto)
                            .Select(p => new PVendidos
                            {
                                Producto = p.Nombre,
                                Modelo = p.Modelo,
                                PrecioCompra = (decimal)p.PrecioCompra,
                                Cantidad = (int)det.Detalle.Cantidad
                            })).ToList()
                    }).FirstOrDefault();

                if (resultado != null)
                {
                    detalle = resultado;
                    return true;
                }
                else
                {
                    errorMesagge = "No se encontraron detalles de factura para el número de factura especificado.";
                    return false;
                }
            }
            catch (Exception ex)
            {
                errorMesagge = ex.Message;
                return false;
            }
        }

        private int ObtenerUltimoNumeroFacturaCompra()
        {
            int ultimoNumeroFactura = 0; // Valor predeterminado si no se encuentra ningún número de factura

            try
            {
                // Obtener el último número de factura ordenando de forma descendente y tomando el primer registro
                var factura = _db.FacturaCompra.OrderByDescending(f => f.NumeroFactura).FirstOrDefault();

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

        #endregion

        /*
            listatabla = nf, proveedor, fecha, impuesto, total, id

            listaDetalle = nf, prove, tel, dir, correo, id, numerof, prod, cantidad precioCompra
         
         */

    }
}
