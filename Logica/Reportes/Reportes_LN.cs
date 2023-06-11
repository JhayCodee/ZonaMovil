using Datos;
using Modelo.ProcedimientosAlmacenados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Reportes
{
    public class Reportes_LN
    {
        private readonly db_a97d9e_zonamovilEntities _db;

        public Reportes_LN()
        {
            _db = new db_a97d9e_zonamovilEntities();
        }

        public bool ListarFacturas(ref List<spBuscarFacturaVentaPorRangoFechas_VM> listaFactura, ref string errorMessage, DateTime f1, DateTime f2)
        {
            try
            {
                listaFactura = _db.spBuscarFacturaVentaPorRangoFechas(f1, f2).Select(f => new spBuscarFacturaVentaPorRangoFechas_VM
                {

                    IdFacturaVenta = f.IdFacturaVenta,
                    IdCliente = f.IdCliente,
                    Cliente = f.Cliente,
                    NumeroFactura = f.NumeroFactura,
                    Fecha = f.Fecha,
                    Impuesto = f.Impuesto,
                    Total = f.Total,

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
    }
}
