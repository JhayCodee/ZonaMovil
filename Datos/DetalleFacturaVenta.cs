//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Datos
{
    using System;
    using System.Collections.Generic;
    
    public partial class DetalleFacturaVenta
    {
        public int IdDetalleFacturaVenta { get; set; }
        public Nullable<int> IdFacturaVenta { get; set; }
        public Nullable<int> IdProducto { get; set; }
        public Nullable<int> Cantidad { get; set; }
        public Nullable<decimal> Precio { get; set; }
    
        public virtual FacturaVenta FacturaVenta { get; set; }
        public virtual Producto Producto { get; set; }
    }
}
