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
    
    public partial class FacturaCompra
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public FacturaCompra()
        {
            this.DetalleFacturaCompra = new HashSet<DetalleFacturaCompra>();
        }
    
        public int IdFacturaCompra { get; set; }
        public Nullable<int> NumeroFactura { get; set; }
        public Nullable<System.DateTime> Fecha { get; set; }
        public Nullable<decimal> Impuesto { get; set; }
        public Nullable<decimal> Total { get; set; }
        public string TipoPago { get; set; }
        public Nullable<int> IdProveedor { get; set; }
        public Nullable<bool> Activo { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DetalleFacturaCompra> DetalleFacturaCompra { get; set; }
        public virtual Proveedor Proveedor { get; set; }
    }
}
