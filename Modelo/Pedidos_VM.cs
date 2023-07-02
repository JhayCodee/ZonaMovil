using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo
{
    public class Pedidos_VM
    {
        public int IdPedidoVenta { get; set; }
        public Nullable<int> NumeroPedido { get; set; }
        public Nullable<System.DateTime> FechaPedido { get; set; }
        public Nullable<System.DateTime> FechaEntrega { get; set; }
        public Nullable<int> IdCliente { get; set; }
        public Nullable<bool> Activo { get; set; }
        public string Cliente { get; set; }
        public Nullable<decimal> Impuesto { get; set; }
        public string Pago { get; set; }
        public Nullable<decimal> Total { get; set; }
    }

    public class PedidoVentaDetalle_VM
    {
        public int NumeroPedido { get; set; }
        public string Cliente { get; set; }
        public string Cedula { get; set; }
        public string Telefono { get; set; }
        public DateTime FechaEntrega { get; set; }
        public DateTime FechaPedido { get; set; }
        public string Producto { get; set; }
        public string Modelo { get; set; }
        public decimal PrecioVenta { get; set; }
        public int Cantidad { get; set; }
        public decimal Impuesto { get; set; }
        public decimal Total { get; set; }
        public int Almacenamiento { get; set; }
        public int RAM { get; set; }
        public string Color { get; set; }
    }

}
