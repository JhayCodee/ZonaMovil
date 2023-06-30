using Logica.Seguridad;
using Modelo.Seguridad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace WebApp.Controllers
{
    public class LoginController : Controller
    { 
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(string username, string password)
        {
            Usuarios_VM user;
            var result = new Usuarios_LN().EncontrarUsuario(username, password, out user);

            if (!result.Item1)
            {
                ViewBag.ErrorMessages = result.Item2;
                return View();
            }

            FormsAuthentication.SetAuthCookie(user.Usuario, false);
            Session["Usuario"] = user;
            return RedirectToAction("Index", "Home");
        }
    }
}