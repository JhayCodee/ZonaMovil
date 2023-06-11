using Logica.Ventas;
using Modelo.ProcedimientosAlmacenados;
using Rotativa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApp.Controllers.reportes
{
    public class ReporteVentasController : Controller
    {
        private readonly ReporteVentas_LN ln;

        public ReporteVentasController()
        {
            ln = new ReporteVentas_LN();
        }

        #region vistas 

        // GET: ReporteVentas
        public ActionResult Index()
        {
            return View();
        }

        // factruas por rango de fecha
        public ActionResult VentasFecha()
        {
            return View();
        }

        public ActionResult ImprimirReporteVentas() 
        {
            return new ActionAsPdf("ReporteDeVentasPorFechas")
            { FileName = "ReportedeVentas.pdf" };
        }

        public ActionResult ReporteDeVentasPorFechas()
        {
            List<spBuscarFacturaVentaPorRangoFechas_VM> lista = new List<spBuscarFacturaVentaPorRangoFechas_VM>();
            ln.FacturaPorRangoFecha(ref lista, DateTime.Parse("2023-06-01"), DateTime.Parse("2023-06-30"));
            return View(lista);
        }

        #endregion


        #region consultas
        [HttpPost]
        public JsonResult ListarFacturasVentas(DateTime startDate, DateTime endDate)
        {
            List<spBuscarFacturaVentaPorRangoFechas_VM> lista = new List<spBuscarFacturaVentaPorRangoFechas_VM>();

            ln.FacturaPorRangoFecha(ref lista, startDate, endDate);

            return Json(new { data = lista }, JsonRequestBehavior.AllowGet);
        }
        #endregion



    }
}