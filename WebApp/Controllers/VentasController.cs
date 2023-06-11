using Logica.Ventas;
using Modelo;
using Modelo.ProcedimientosAlmacenados;
using Rotativa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApp.Controllers
{
    public class VentasController : Controller
    {
        private readonly FacturaVenta_LN ln;

        public VentasController()
        {
            ln = new FacturaVenta_LN();
        }


        public ActionResult ImprimirFactura(int numeroFactura)
        {
            return new ActionAsPdf("FacturaVentaTemplate", new { numeroFactura = numeroFactura })
            { FileName = $"Factura-{numeroFactura}.pdf" };
        }

        public ActionResult FacturaVentaTemplate(int numeroFactura)
        {
            ImprimirFactura_VM f = new ImprimirFactura_VM();
            string errorMessage = string.Empty;

            if (new ReporteVentas_LN().ImprimirFactura(numeroFactura, ref errorMessage, ref f))
            {
                return View(f);
            }
            else
            {
                return View();
            }
        }


        #region vistas

        // GET: Ventas
        public ActionResult Index()
        {
            return View();
        }
        #endregion


        #region crud   

        [HttpPost]
        public JsonResult AgregarFactura(FacturaVenta_VM fv, List<DetalleFacturaVentaAdd_VM> dfv)
        {
            string errorMessage = "xdf";

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
        public JsonResult EliminarFacturaVenta(int id)
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

        #endregion

        #region consultas

        [HttpGet]
        public JsonResult ListarFacturasVentas()
        {
            List<InfoFacturaVenta_VM> listaFacturaVenta = new List<InfoFacturaVenta_VM>();
            string errorMessage = string.Empty;

            bool res = ln.ListarFacturas(ref listaFacturaVenta, ref errorMessage);

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

            bool res = ln.ListarDetalleFacturaVenta(nf, ref detalle, ref errorMessage);

            if (res)
            {
                return Json(new { success = true, data = detalle }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false, errorMessage = errorMessage }, JsonRequestBehavior.AllowGet);
            }
        }

        #endregion
    }
}