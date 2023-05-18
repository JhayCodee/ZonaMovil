using Datos;
using Modelo;
using Modelo.ProcedimientosAlmacenados;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica
{
    public class Producto_LN
    {
        private readonly db_a97d9e_zonamovilEntities _db;

        public Producto_LN()
        {
            _db = new db_a97d9e_zonamovilEntities();
        }

        public bool ListarProductos(ref List<Producto_VM> listaProducto, ref string errorMsj)
        {
            try
            {
                listaProducto = _db.Producto.Select(p => new Producto_VM
                {
                    IdProducto = p.IdProducto,
                    Nombre = p.Nombre,
                    Modelo = p.Modelo,
                    Descripcion = p.Descripcion,
                    Stock = p.Stock,
                    GarantiaEnMeses = p.GarantiaEnMeses,
                    IdMarca = p.IdMarca,
                    IdCategoria = p.IdCategoria,
                    Activo = p.Activo,
                    PrecioCompra = p.PrecioCompra,
                    PrecioVenta = p.PrecioVenta,

                }).Where(x => x.Activo == true)
                    .ToList();

                return true;

            }
            catch (Exception ex)
            {
                errorMsj = ex.Message;
                return false;
            }
        }

        public bool AgregarProducto(Producto_VM p, ref string errMsj)
        {
            try
            {
                var producto = new Producto
                {
                    Nombre = p.Nombre,
                    Descripcion = p.Descripcion,
                    Modelo = p.Modelo,
                    Stock = p.Stock,
                    GarantiaEnMeses = p.GarantiaEnMeses,
                    IdCategoria = p.IdCategoria,
                    IdMarca = p.IdMarca,
                    PrecioCompra = p.PrecioCompra,
                    PrecioVenta = p.PrecioVenta,
                    Activo = true
                };

                _db.Producto.Add(producto);
                _db.SaveChanges();
                return true;
            }
            catch(Exception ex)
            {
                errMsj = ex.Message;
                return false;
            }
        }

        // Edita un producto existente
        public bool EditarProducto(int id, Producto_VM p, ref string errMsg)
        {
            try
            {
                Producto producto = _db.Producto.FirstOrDefault(c => c.IdProducto == id);
                if (producto != null)
                {
                    producto.Nombre = p.Nombre;
                    producto.Modelo = p.Modelo;
                    producto.Descripcion = p.Descripcion;
                    producto.Stock = p.Stock;
                    producto.GarantiaEnMeses = p.GarantiaEnMeses;
                    producto.IdCategoria = p.IdCategoria;
                    producto.IdMarca = p.IdMarca;
                    producto.PrecioCompra = p.PrecioCompra;
                    producto.PrecioVenta = p.PrecioCompra;

                    _db.Entry(producto).State = EntityState.Modified;
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    errMsg = "No se encontró el cliente con ID " + id;
                    return false;
                }
            }
            catch (Exception ex)
            {
                errMsg = "Error al editar el cliente: " + ex.Message;
                return false;
            }
        }
        public bool EliminarProducto(int id, ref string errMsg)
        {
            try
            {
                Producto producto = _db.Producto.FirstOrDefault(c => c.IdProducto == id);
                if (producto != null)
                {
                    producto.Activo = false;

                    _db.Entry(producto).State = EntityState.Modified;
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    errMsg = "No se encontró el producto con ID " + id;
                    return false;
                }
            }
            catch (Exception ex)
            {
                errMsg = "Error al eliminar el producto: " + ex.Message;
                return false;
            }
        }
        

        public bool ObtenerDetalleProducto(int id, ref string errorMessage, ref ObtenerDetalleProducto_VM Detalle)
        {
            try
            {
                if (_db.Producto.Any(e => e.IdProducto == id))
                {
                    var dp = _db.spObtenerDetalleProducto(id).FirstOrDefault() as spObtenerDetalleProducto_Result;

                    // Realizar la asignación de propiedades al objeto Detalle
                    Detalle.Nombre = dp.Nombre;
                    Detalle.Modelo = dp.Modelo;
                    Detalle.Descripcion = dp.Descripcion;
                    Detalle.Stock = dp.Stock;
                    Detalle.GarantiaEnMeses = dp.GarantiaEnMeses;
                    Detalle.Activo = dp.Activo;
                    Detalle.PrecioCompra = dp.PrecioCompra;
                    Detalle.PrecioVenta = dp.PrecioVenta;
                    Detalle.Marca = dp.Marca;
                    Detalle.Categoria = dp.Categoria;

                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }


        public Producto_VM BuscarProductoPorId(int id)
        {
            try
            {
                var p = _db.Producto.FirstOrDefault(c => c.IdProducto  == id);
                if (p != null)
                {
                    var Producto = new Producto_VM
                    {
                        IdProducto = p.IdProducto,
                        Nombre = p.Nombre,
                        Modelo = p.Modelo,
                        Descripcion = p.Descripcion,
                        Stock = p.Stock,
                        GarantiaEnMeses = p.GarantiaEnMeses,
                        IdMarca = p.IdMarca,
                        IdCategoria = p.IdCategoria,
                        PrecioCompra = p.PrecioCompra,
                        PrecioVenta = p.PrecioVenta
                    };

                    return Producto;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al obtener el Producto: " + ex.Message);
                return null;
            }
        }
    }
}
