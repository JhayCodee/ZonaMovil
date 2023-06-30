using Modelo.Seguridad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApp.Permisos
{
    public class PermisoRolAttribute : ActionFilterAttribute
    {
        private Rol_EN idRol;

        public PermisoRolAttribute(Rol_EN _idRol)
        {
            idRol = _idRol;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (HttpContext.Current.Session["Usuario"] != null)
            {
                Usuarios_VM user = HttpContext.Current.Session["Usuario"] as Usuarios_VM;

                if (user.IdRol != this.idRol)
                {
                    filterContext.Result = new RedirectResult("~/Home/SinPermiso");
                    return;
                }
            }

            base.OnActionExecuting(filterContext);
        }
    }
}