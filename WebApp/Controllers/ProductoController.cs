using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Logica;
using Modelo;
using Modelo.ProcedimientosAlmacenados;

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

        #region CRUD

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
            string errMsj = string.Empty;

            if (new Producto_LN().AgregarProducto(Data, ref errMsj))
            {
                return Json(new { success = true, message = "Producto agregado correctamente" });
            }
            else
            {
                return Json(new { error = errMsj }, JsonRequestBehavior.AllowGet);

            }
        }

        [HttpPost]
        public JsonResult EditarProducto(Producto_VM data)
        {
            string errMsg = string.Empty;

            if (new Producto_LN().EditarProducto(data.IdProducto, data, ref errMsg))
            {
                return Json(new { success = true, message = "Producto actualizado correctamente" });
            }
            else
            {
                return Json(new { error = errMsg, success = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult EliminarProducto(int id)
        {
            string errorMessage = string.Empty;
            bool success = ProductoLN.EliminarProducto(id, ref errorMessage);

            if (success)
            {
                // El producto se eliminó correctamente
                return Json(new { success = true, message = "El producto se eliminó correctamente." });
            }
            else
            {
                // Ocurrió un error al eliminar el producto
                return Json(new { success = false, message = errorMessage });
            }
        }


        #endregion


        #region consultas

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

        [HttpPost]
        public JsonResult ObtenerDetalleProducto(int id)
        {
            string errorMessage = "";
            ObtenerDetalleProducto_VM detalle = new ObtenerDetalleProducto_VM();

            bool success = ProductoLN.ObtenerDetalleProducto(id, ref errorMessage, ref detalle);

            if (success)
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