using Logica.Pedidos;
using Logica.Ventas;
using Modelo;
using Rotativa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApp.Controllers
{
    [Authorize]
    public class PedidosController : Controller
    {
        private readonly Pedido_LN ln;

        public PedidosController()
        {
            ln = new Pedido_LN();
        }

        // GET: Pedidos
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult AgregarPedido(Pedidos_VM fv, List<DetalleFacturaVentaAdd_VM> dfv)
        {
            string errorMessage = "xdf";

            bool status = ln.AgregarPedido(fv, dfv, ref errorMessage);

            if (status)
            {
                return Json(new { status });
            }
            else
            {
                return Json(new { error = errorMessage }, JsonRequestBehavior.AllowGet);

            }

        }


        [HttpPost]
        public JsonResult EliminarPedido(int id)
        {
            string errorMessage = string.Empty;

            bool res = ln.EliminarPedido(id, ref errorMessage);

            if (res)
            {
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false, errorMessage = errorMessage }, JsonRequestBehavior.AllowGet);
            }
        }



        [HttpGet]
        public JsonResult ListarPedidos()
        {
            List<Pedidos_VM> lista = new List<Pedidos_VM>();
            string errorMessage = string.Empty;

            bool res = ln.ListarPedidos(ref lista, ref errorMessage);

            if (res)
            {
                return Json(new { success = true, data = lista }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false, errorMessage = errorMessage }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ListarDetallePedidos(int nf)
        {
            List<PedidoVentaDetalle_VM> detalle = new List<PedidoVentaDetalle_VM>();
            string errorMessage = string.Empty;

            bool res = ln.ListarDetallePedidos(nf, ref detalle, ref errorMessage);

            if (res)
            {
                return Json(new { success = true, data = detalle }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false, errorMessage = errorMessage }, JsonRequestBehavior.AllowGet);
            }
        }






        public ActionResult ImprimirPedido(int numeroFactura)
        {
            return new ActionAsPdf("PedidoVentaFactura", new { numeroFactura = numeroFactura })
            { FileName = $"Factura-{numeroFactura}.pdf" };
        }

        public ActionResult PedidoVentaFactura(int numeroFactura)
        {
            ImprimirFactura_VM f = new ImprimirFactura_VM();
            string errorMessage = string.Empty;

            if (new ReporteVentas_LN().Imprimirpedido(numeroFactura, ref errorMessage, ref f))
            {
                return View(f);
            }
            else
            {
                return View();
            }
        }


    }
}