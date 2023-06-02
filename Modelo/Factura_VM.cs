using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo
{
    public class Factura_VM
    {
        public int IdFacturaVenta { get; set; }
        public Nullable<int> NumeroFactura { get; set; }
        public DateTime Fecha { get; set; }
        public Nullable<decimal> Impuesto { get; set; }
        public Nullable<decimal> Total { get; set; }
        public string TipoPago { get; set; }
        public Nullable<int> IdCliente { get; set; }
        public Nullable<bool> Activo { get; set; }
    }
}
