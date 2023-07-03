using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Logica;
using Modelo;

namespace WebApp.Controllers
{
    [Authorize]
    public class ClienteController : Controller
    {
        private readonly Cliente_LN clienteLN;

        public ClienteController()
        {
            clienteLN = new Cliente_LN();
        }

        // GET: Cliente
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ListarClientes()
        {
            List<Cliente_VM> listaClientes = new List<Cliente_VM>();
            string errorMsj = string.Empty;
            // hola
            var res = clienteLN.ListarClientes(ref listaClientes, ref errorMsj);

            if (res)
            {
                return Json(listaClientes, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { error = errorMsj }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult BuscarClientePorID(int id)
        {
            var cliente = clienteLN.BuscarClientePorId(id);
            return Json(cliente, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AgregarCliente(Cliente_VM cliente)
        {
            string mensaje = string.Empty;
            bool resultado = clienteLN.AgregarCliente(ref cliente, ref mensaje);

            if (resultado)
            {
                return Json(new { success = true, message = "Cliente agregado correctamente" });
            }
            else
            {
                return Json(new { success = false, message = mensaje });
            }
        }

        [HttpPost]
        public ActionResult EditarCliente(Cliente_VM cliente)
        {
            int id = cliente.IdCliente;
            string mensaje = "";
            bool resultado = clienteLN.EditarCliente(id, ref cliente, ref mensaje);

            if (resultado)
            {
                return RedirectToAction("Index");
            }
            else
            {
                ViewBag.Mensaje = mensaje;
                return View(cliente);
            }
        }

        [HttpPost]
        public JsonResult EliminarCliente(int id)
        {
            string mensaje = string.Empty;

            bool res = clienteLN.EliminarCliente(id, ref mensaje);

            if (res)
            {
                return Json(new { success = true, message = "Cliente Eliminado correctamente" });
            }
            else
            {
                return Json(new { success = false, message = mensaje });
            }
        }

        [HttpPost]
        public ActionResult ValidarCedulaAjax(string cedula)
        {
            // Llama al método de la capa lógica para validar la cédula
            bool esValida = clienteLN.ValidarCedula(cedula);

            // Crea un objeto anónimo con la respuesta
            var respuesta = new { esValida = esValida };

            // Devuelve la respuesta como JSON
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

    }
}