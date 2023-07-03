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

        public Nullable<System.DateTime> FechaPedido { get; set; }
        public Nullable<System.DateTime> FechaEntrega { get; set; }
        public string Direccion { get; set; }

    }

    public class DetalleFVImprimir 
    {
        public string Producto { get; set; }
        public string Modelo { get; set; }
        public string Color { get; set; }
        public Nullable<int> Cantidad { get; set; }
        public Nullable<int> RAM { get; set; }
        public Nullable<int> Almacenamiento { get; set; }
        public Nullable<int> Garantia { get; set; }
        public Nullable<decimal> Precio { get; set; }

    }

    public class spReporteVentas_VM
    {
        public string Nombreproducto { get; set; }
        public string Marcaproducto { get; set; }
        public string Modeloproducto { get; set; }
        public Nullable<int> RAM { get; set; }
        public Nullable<int> Almacenamiento { get; set; }
        public string Color { get; set; }
        public Nullable<int> Cantidadvendida { get; set; }
        public Nullable<decimal> PrecioVenta { get; set; }
        public Nullable<decimal> Total { get; set; }
        public Nullable<int> Numerofacturas { get; set; }
    }

}
