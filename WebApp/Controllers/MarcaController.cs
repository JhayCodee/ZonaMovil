using Logica;
using Modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApp.Controllers
{
    public class MarcaController : Controller
    {
        private readonly Marca_LN marcaLN;

        public MarcaController()
        {
            marcaLN = new Marca_LN();
        }

        // GET: Marca
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ListarMarcas()
        {
            List<Marca_VM> listaMarca = new List<Marca_VM>();
            string errorMsj = string.Empty;
            // hola
            var res = marcaLN.ListarMarcas(ref listaMarca, ref errorMsj);

            if (res)
            {
                return Json(listaMarca, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { error = errorMsj }, JsonRequestBehavior.AllowGet);
            }
        }
        
        // BUSCAR MARCA POR ID
        [HttpGet]
        public JsonResult BuscarMarcaPorID(int id)
        {
            var marca = marcaLN.BuscarMarcaPorId(id);
            return Json(marca, JsonRequestBehavior.AllowGet);
        }

        // AGREGAR MARCA
        [HttpPost]
        public JsonResult AgregarMarca(Marca_VM marca)
        {
            string mensaje = string.Empty;
            bool resultado = marcaLN.AgregarMarca(ref marca, ref mensaje);

            if (resultado)
            {
                return Json(new { success = true, message = "Marca agregada correctamente" });
            }
            else
            {
                return Json(new { success = false, message = mensaje });
            }
        }

        // Editar Marca
        [HttpPost]
        public ActionResult EditarMarca(Marca_VM marca)
        {
            int id = marca.IdMarca;
            string mensaje = "";
            bool resultado = marcaLN.EditarMarca(id, ref marca, ref mensaje);

            if (resultado)
            {
                return RedirectToAction("Index");
            }
            else
            {
                ViewBag.Mensaje = mensaje;
                return View(marca);
            }
        }

        // Eliminar Marca
        [HttpPost]
        public JsonResult EliminarMarca(int id)
        {
            string mensaje = string.Empty;

            bool res = marcaLN.EliminarMarca(id, ref mensaje);

            if (res)
            {
                return Json(new { success = true, message = "Marca Eliminado correctamente" });
            }
            else
            {
                return Json(new { success = false, message = mensaje });
            }
        }
    }
}