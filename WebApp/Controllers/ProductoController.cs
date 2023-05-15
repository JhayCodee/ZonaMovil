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

        [HttpPost]
        public JsonResult AgregarProducto(Producto_VM Data)
        {
            if (true)
            {
                return Json(new { success = true, message = "Cliente agregado correctamente" });
            }
        }

        [HttpPost]
        public JsonResult BuscarProductoPorID(int id)
        {
            var producto = new Producto_LN().BuscarProductoPorId(id);

            if (producto == null)
            {
                // El producto no se encontró, puedes devolver un mensaje de error o un objeto indicando que no se encontró el producto
                return Json(new { mensaje = "Producto no encontrado" }, JsonRequestBehavior.AllowGet);
            }

            return Json(producto, JsonRequestBehavior.AllowGet);
        }


    }
}