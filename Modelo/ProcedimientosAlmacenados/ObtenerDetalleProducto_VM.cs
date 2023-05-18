using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.ProcedimientosAlmacenados
{
    public class ObtenerDetalleProducto_VM
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; }
        public string Modelo { get; set; }
        public string Descripcion { get; set; }
        public Nullable<int> Stock { get; set; }
        public Nullable<int> GarantiaEnMeses { get; set; }
        public Nullable<bool> Activo { get; set; }
        public Nullable<decimal> PrecioCompra { get; set; }
        public Nullable<decimal> PrecioVenta { get; set; }
        public string Marca { get; set; }
        public string Categoria { get; set; }
    }
}
