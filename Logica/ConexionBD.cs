using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modelo;
namespace Logica
{
    public class ConexionBD
    {


        public List<Pedido> buscarPedidos(string cadena, DateTime fi, DateTime ff)
        {
            -
             List <  > pedidos = new List<Pedido>();

            try
            {
                abrir();
                string sql = "SELECT p.id,p. fechapedido, p. fechaentrega,p.idclient
                MySqlCommand cmd = new MySqlCommand((sql, con);
                cmd.Parameters.. .Add("@cadena", MySqlDbType VarChar);
                cmd. "%" + cadena + "%";
                MySqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                    int i = dr.GetInt32(e);
                DateTime fp = dr. .GetDateTime(1);
                DateTime fe e = dr.GetDateTime(2);
                int ic = dr.GetInt32(3);
            }
            }
    }
}
