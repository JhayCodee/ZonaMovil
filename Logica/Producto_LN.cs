using Datos;
using Modelo;
using System;
using System.Collections.Generic;
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
                    PrecioVenta = p.PrecioVenta

                }).ToList();

                return true;

            }
            catch (Exception ex)
            {
                errorMsj = ex.Message;
                return false;
            }
        }
    }
}
