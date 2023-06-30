using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Seguridad
{
    public class Usuarios_VM
    {
        public int IdUsuario { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Usuario { get; set; }
        public string Contrasena { get; set; }
        public Rol_EN IdRol { get; set; }
    }
}
