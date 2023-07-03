using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Logica;
using Modelo;
using WebApp.Permisos;

namespace WebApp.Controllers
{
    [Authorize]
    [PermisoRol(Modelo.Seguridad.Rol_EN.Administrador)]
    public class CategoriaController : Controller
    {
        private readonly Categoria_LN categoriaLN;

        public CategoriaController()
        {
            categoriaLN = new Categoria_LN();
        }



        // GET: Categoria
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ListarCategorias()
        {
            List<Categoria_VM> ListaCategorias = new List<Categoria_VM>();
            string errorMsj = string.Empty;
            // hola
            var res = categoriaLN.ListarCategorias(ref ListaCategorias, ref errorMsj);

            if (res)
            {
                return Json(ListaCategorias, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { error = errorMsj }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult BuscarCategoriaPorID(int id)
        {
            var categoria = categoriaLN.BuscarCategoriaPorId(id);
            return Json(categoria, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AgregarCategoria(Categoria_VM categoria)
        {
            string mensaje = string.Empty;
            bool resultado = categoriaLN.AgregarCategoria(ref categoria, ref mensaje);

            if (resultado)
            {
                return Json(new { success = true, message = "Categoria agregada correctamente" });
            }
            else
            {
                return Json(new { success = false, message = mensaje });
            }
        }

        [HttpPost]
        public ActionResult EditarCategoria(Categoria_VM categoria)
        {
            int id = categoria.IdCategoria;
            string mensaje = "";
            bool resultado = categoriaLN.EditarCategoria(id, ref categoria, ref mensaje);

            if (resultado)
            {
                return RedirectToAction("Index");
            }
            else
            {
                ViewBag.Mensaje = mensaje;
                return View(categoria);
            }
        }

        [HttpPost]
        public JsonResult EliminarCategoria(int id)
        {
            string mensaje = string.Empty;

            bool res = categoriaLN.EliminarCategoria(id, ref mensaje);

            if (res)
            {
                return Json(new { success = true, message = "Cliente Eliminado correctamente" });
            }
            else
            {
                return Json(new { success = false, message = mensaje });
            }
        }
    }
}