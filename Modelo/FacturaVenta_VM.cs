using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo
{
    public class FacturaVenta_VM
    {
        public int IdFacturaVenta { get; set; }
        public Nullable<int> NumeroFactura { get; set; }
        public Nullable<System.DateTime> Fecha { get; set; }
        public Nullable<decimal> Impuesto { get; set; }
        public Nullable<decimal> Total { get; set; }
        public string TipoPago { get; set; }
        public Nullable<int> IdCliente { get; set; }
        public Nullable<bool> Activo { get; set; }
    }

    public class ImprimirFactura_VM {
        public int IdFacturaVenta { get; set; }
        public Nullable<int> NumeroFactura { get; set; }
        public Nullable<System.DateTime> Fecha { get; set; }
        public Nullable<decimal> Impuesto { get; set; }
        public Nullable<decimal> Total { get; set; }
        public string TipoPago { get; set; }
        public string Cedula { get; set; }
        public Nullable<int> IdCliente { get; set; }
        public Nullable<bool> Activo { get; set; }

        public List<DetalleFVImprimir> listaProducto { get; set; }
        public string Cliente { get; set; }
    }

    public class DetalleFVImprimir 
    {
        public string Producto { get; set; }
        public string Modelo { get; set; }
        public int Cantidad { get; set; }
        public decimal Precio { get; set; }

    }

}
