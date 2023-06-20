using Datos;
using System;
using System.Collections.Generic;
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
        #endregion

        #region consultas
        //public bool ListarTablaFacturaCompra(ref List<> lista, ref string errorMessage)
        //{
        //    try
        //    {
        //        lista = _db.PedidoVenta
        //            .Where(f => f.Activo == true)
        //            .Select(f => new TablaFacturaCompra
        //            {
        //                NumeroFactura = f.NumeroFactura,
        //                Fecha = f.Fecha,
        //                IdFacturaCompra = f.IdFacturaCompra,
        //                Total = f.Total,
        //                ProveedorX = f.Proveedor.Nombre,

        //            }).ToList();

        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        errorMessage = ex.Message;
        //        return false;
        //    }
        //}

        #endregion


    }
}
