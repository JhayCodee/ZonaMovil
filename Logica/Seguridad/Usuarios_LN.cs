using Datos;
using Modelo.Seguridad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Seguridad
{
    public class Usuarios_LN
    {
        private readonly db_a97d9e_zonamovilEntities _bd;

        public Usuarios_LN()
        {
            _bd = new db_a97d9e_zonamovilEntities();
        }

        public Tuple<bool, Dictionary<string, string>> EncontrarUsuario(string username, string pass, out Usuarios_VM user)
        {
            var errorMessages = new Dictionary<string, string>();

            user = _bd.Usuario
                .Where(w => w.Usuario1 == username)
                .Select(w => new Usuarios_VM
                {
                    IdUsuario = w.IdUsuario,
                    Nombres = w.Nombres,
                    Apellidos = w.Apellidos,
                    Usuario = w.Usuario1,
                    Contrasena = w.Contrasena,
                    IdRol = (Rol_EN)w.IdRol
                })
                .FirstOrDefault();

            if (user == null)
            {
                // Username does not exist
                errorMessages["username"] = "Usuario no existe";
                return new Tuple<bool, Dictionary<string, string>>(false, errorMessages);
            }
            else if (user.Contrasena != pass)
            {
                // Password does not match
                errorMessages["password"] = "La contraseña no coincide";
                return new Tuple<bool, Dictionary<string, string>>(false, errorMessages);
            }

            // Username and password match
            return new Tuple<bool, Dictionary<string, string>>(true, errorMessages);
        }


    }
}
