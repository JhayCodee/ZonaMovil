//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
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
