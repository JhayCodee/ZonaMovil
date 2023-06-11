using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo
{
    public class DetalleFacturaVentaAdd_VM
    {
        public int IdDetalleFacturaVenta { get; set; }
        public Nullable<int> IdFacturaVenta { get; set; }
        public Nullable<int> IdProducto { get; set; }
        public Nullable<int> Cantidad { get; set; }
        public Nullable<decimal> Precio { get; set; }
    }
}
