using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Logica;
using Modelo;

namespace WebApp.Controllers
{
    public class ProveedorController : Controller
    {
        private readonly Proveedor_LN proveedorLN;


        public ProveedorController()
        {
            proveedorLN = new Proveedor_LN();
        }

        // GET: Proveedor
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ListarProveedores()
        {
            List<Proveedor_VM> ListaProveedores = new List<Proveedor_VM>();
            string errorMsj = string.Empty;
            // hola
            var res = proveedorLN.ListarProveedores(ref ListaProveedores, ref errorMsj);

            if (res)
            {
                return Json(ListaProveedores, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { error = errorMsj }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult BuscarProveedorPorID(int id)
        {
            var proveedor = proveedorLN.BuscarProveedorPorId(id);
            return Json(proveedor, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AgregarProveedor(Proveedor_VM proveedor)
        {
            string mensaje = string.Empty;
            bool resultado = proveedorLN.AgregarProveedor(ref proveedor, ref mensaje);

            if (resultado)
            {
                return Json(new { success = true, message = "Proveedor agregado correctamente" });
            }
            else
            {
                return Json(new { success = false, message = mensaje });
            }
        }


        [HttpPost]
        public ActionResult EditarProveedor(Proveedor_VM proveedor)
        {
            int id = proveedor.IdProveedor;
            string mensaje = "";
            bool resultado = proveedorLN.EditarProveedor(id, ref proveedor, ref mensaje);

            if (resultado)
            {
                return RedirectToAction("Index");
            }
            else
            {
                ViewBag.Mensaje = mensaje;
                return View(proveedor);
            }
        }

        [HttpPost]
        public JsonResult EliminarProveedor(int id)
        {
            string mensaje = string.Empty;

            bool res = proveedorLN.EliminarProveedor(id, ref mensaje);

            if (res)
            {
                return Json(new { success = true, message = "Proveedor Eliminado correctamente" });
            }
            else
            {
                return Json(new { success = false, message = mensaje });
            }
        }



    }
}