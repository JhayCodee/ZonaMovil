using Logica.Ventas;
using Modelo.ProcedimientosAlmacenados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApp.Controllers
{
    public class VentasController : Controller
    {
        private readonly FacturaVenta_LN fvLN;

        public VentasController()
        {
            fvLN = new FacturaVenta_LN();
        }

        // GET: Ventas
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ListarFacturasVentas()
        {
            List<InfoFacturaVenta_VM> listaFacturaVenta = new List<InfoFacturaVenta_VM>();
            string errorMessage = string.Empty;

            bool res = fvLN.ListarFacturas(ref listaFacturaVenta, ref errorMessage);

            if (res)
            {
                return Json(new { success = true, data = listaFacturaVenta }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false, errorMessage = errorMessage }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ListarDetalleFacturaventa(int nf)
        {
            List<DetalleFacturaVenta_VM> detalle = new List<DetalleFacturaVenta_VM>();
            string errorMessage = string.Empty;

            bool res = fvLN.ListarDetalleFacturaVenta(nf, ref detalle, ref errorMessage);

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