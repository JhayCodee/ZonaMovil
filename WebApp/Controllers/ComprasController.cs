using Logica.Compras;
using Modelo;
using Rotativa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApp.Controllers
{
    public class ComprasController : Controller
    {
        private readonly FacturaCompra_LN ln;

        public ComprasController()
        {
            ln = new FacturaCompra_LN();
        }

        // GET: Compras
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public JsonResult AgregarFacturaCompra(FacturaCompraJs fv, List<DetalleFacturaVentaAdd_VM> dfv)
        {
            string errorMessage = "";

            bool status = ln.AgregarFactura(fv, dfv, ref errorMessage);

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
        public JsonResult EliminarFacturaCompra(int id)
        {
            string errorMessage = string.Empty;

            bool res = ln.EliminarFactura(id, ref errorMessage);

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
        public JsonResult ListarFacturasCompras()
        {
            List<TablaFacturaCompra> lista = new List<TablaFacturaCompra>();
            string errorMessage = string.Empty;

            bool res = ln.ListarTablaFacturaCompra(ref lista, ref errorMessage);

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
        public JsonResult ListarDetalleFacturaCompra(int nf)
        {
            DetalleFacturaConmpra detalle = new DetalleFacturaConmpra();
            string errorMessage = string.Empty;

            bool res = ln.ListarDetalleFacturaCompra(nf, ref detalle, ref errorMessage);

            if (res)
            {
                return Json(new { success = true, data = detalle }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false, errorMessage = errorMessage }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}