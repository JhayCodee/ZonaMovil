using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Logica;
using Modelo;

namespace WebApp.Controllers
{
    public class ProductoController : Controller
    {
        private readonly Producto_LN ProductoLN;

        public ProductoController()
        {
            ProductoLN = new Producto_LN();
        }

        // GET: Producto
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ListarProductos()
        {
            List<Producto_VM> listaProducto = new List<Producto_VM>();
            string errorMsj = string.Empty;
            var res = ProductoLN.ListarProductos(ref listaProducto, ref errorMsj);

            if (res)
            {
                return Json(listaProducto, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { error = errorMsj }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}