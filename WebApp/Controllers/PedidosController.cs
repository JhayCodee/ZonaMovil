using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Logica;
using Datos;

namespace WebApp.Controllers
{
    public class PedidosController : Controller
    {

        public FacturaVenta_LN mibd = new FacturaVenta_LN();
        // GET: Pedidos

        public ActionResult Index(string cadena = "", string fi = "", string ff = "")
        {
            List<FacturaVenta> pedido = null;
            if (cadena != "" && fi != "" && ff != "")
                pedido = mibd.buscarPedidos(cadena, DateTime.Parse(fi), DateTime.Parse(ff));
            return View(pedido);



        }
    }
}