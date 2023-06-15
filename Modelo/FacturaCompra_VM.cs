using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo
{
    public class FacturaCompra_VM
    {
        public int IdFacturaCompra { get; set; }
    }

    public class TablaFacturaCompra {
        public int IdFacturaCompra { get; set; }
        public Nullable<int> NumeroFactura { get; set; }
        public Nullable<System.DateTime> Fecha { get; set; }
        public Nullable<decimal> Total { get; set; }
        public string ProveedorX { get; set; }
    }

    public class DetalleFacturaConmpra {
        public Nullable<int> NumeroFactura { get; set; }
        public string Telefono { get; set; }
        public Nullable<System.DateTime> Fecha { get; set; }
        public Nullable<decimal> Total { get; set; }
        public string ProveedorX { get; set; }
        public List<PVendidos> Productos { get; set; }
    }

    public class PVendidos {
        public string Producto { get; set; }
        public string Modelo { get; set; }
        public decimal PrecioCompra { get; set; }
        public int Cantidad { get; set; }
    }

    public class FacturaCompraJs
    {
        public int IdProveedor { get; set; }
        public int IdFacturaVenta { get; set; }
        public decimal Impuesto { get; set; }
        public decimal Total { get; set; }
        public string TipoPago { get; set; }
        public bool Activo { get; set; }
    }

    public class ImprimirFacturaCompra_VM
    {
        public int IdFacturaCompra { get; set; }
        public Nullable<int> NumeroFactura { get; set; }
        public Nullable<System.DateTime> Fecha { get; set; }
        public Nullable<decimal> Impuesto { get; set; }
        public Nullable<decimal> Total { get; set; }
        public string TipoPago { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public Nullable<int> IdProveedor { get; set; }
        public Nullable<bool> Activo { get; set; }

        public List<DetalleFVImprimir> listaProducto { get; set; }
        public string ProveedorX { get; set; }
    }

}
