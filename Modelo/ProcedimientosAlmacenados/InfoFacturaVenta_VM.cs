using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.ProcedimientosAlmacenados
{
    public class InfoFacturaVenta_VM
    {
        public int IdFacturaVenta { get; set; }
        public int IdCliente { get; set; }
        public string Cliente { get; set; }
        public Nullable<int> NumeroFactura { get; set; }
        public Nullable<System.DateTime> Fecha { get; set; }
        public Nullable<decimal> Impuesto { get; set; }
        public Nullable<decimal> Total { get; set; }
        public string TipoPago { get; set; }
        public Nullable<bool> Activo { get; set; }
    }
}
