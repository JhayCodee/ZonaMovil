using Logica.Ventas;
using Modelo;
using Modelo.ProcedimientosAlmacenados;
using Rotativa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using WebApp.Permisos;

namespace WebApp.Controllers.reportes
{
    [Authorize]
    [PermisoRol(Modelo.Seguridad.Rol_EN.Administrador)]

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


        public ActionResult print(DateTime f1, DateTime f2)
        {
            return new ActionAsPdf("ReporteVenta", new { inicio = f1, fin = f2 })
            { FileName = $"Reporte.pdf" };
        }

        public ActionResult ReporteVenta(DateTime inicio, DateTime fin)
        {
            List<spReporteVentas_VM> lista = new List<spReporteVentas_VM>();

            if (new ReporteVentas_LN().ObtenerReporteVentas(ref lista, inicio, fin))
            {
                ViewBag.Periodo = inicio.ToString("dd/MM/yyyy") + " - " + fin.ToString("dd/MM/yyyy");
                return View(lista);
            }
            else
            {
                return View();
            }
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