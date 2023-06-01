using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.ProcedimientosAlmacenados
{
    public class DetalleFacturaVenta_VM
    {
        public Nullable<int> NumeroFactura { get; set; }
        public string Cliente { get; set; }
        public string Cedula { get; set; }
        public string Telefono { get; set; }
        public Nullable<System.DateTime> Fecha { get; set; }
        public string Producto { get; set; }
        public string Modelo { get; set; }
        public Nullable<decimal> PrecioVenta { get; set; }
        public Nullable<int> Cantidad { get; set; }
        public Nullable<decimal> Impuesto { get; set; }
        public Nullable<decimal> Total { get; set; }
    }
}
