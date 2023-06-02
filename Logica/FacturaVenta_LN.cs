using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Datos;
using Modelo;
using MySql.Data.MySqlClient;

namespace Logica
{
    public class FacturaVenta_LN
    {
        private static string connectionString = "server=SQL5063.site4now.net;user=db_a97d9e_zonamovil_admin;password=4bdZ0naMob1l;database=db_a97d9e_zonamovil;";
        MySqlConnection con = new MySqlConnection(connectionString);

        public List<FacturaVenta> buscarPedidos(string cadena, DateTime fi, DateTime ff)
        { 
        List<FacturaVenta> pedidos = new List<FacturaVenta>();
            try
            {

                string sql = "SELECT p.IdFacturaVenta,p.NumeroFactura,p.Fecha,p.Impuesto,p.Total,p.TipoPago,c.Nombres FROM  FacturaVenta p,Cliente c WHERE p.IdCliente=c.IdCliente AND (p.Fecha between @fi and @ff) AND c.Nombres Like @cadena"; 

                MySqlCommand cmd = new MySqlCommand(sql, con);
                cmd.Parameters.Add("@fi", MySqlDbType.DateTime);
                cmd.Parameters.Add("@ff", MySqlDbType.DateTime);
                cmd.Parameters.Add("@cadena", MySqlDbType.VarChar);
                cmd.Parameters["@cadena"].Value = "%" + cadena + "%";
                cmd.Parameters["@fi"].Value = fi;
                cmd.Parameters["@fi"].Value = ff;
                MySqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {


                    int id = dr.GetInt32(0);
                    int numeroFactura = dr.GetInt32(10);
                    DateTime fecha = dr.GetDateTime(10);
                    decimal impuesto = dr.GetDecimal(10);
                    decimal total = dr.GetDecimal(10);
                    string tipoPago = dr.GetString(10);
                    int IdCliente = dr.GetInt32(10);

                    FacturaVenta facturaVenta = new FacturaVenta()
                    {
                        IdFacturaVenta = id,
                        NumeroFactura = numeroFactura,
                        Fecha = fecha,
                        Impuesto = impuesto,
                        Total = total,
                        TipoPago = tipoPago,
                        IdCliente = IdCliente
                    };

                    pedidos.Add(facturaVenta);


                }
                dr.Close();
            }
            catch (Exception ex)
            { 

                throw;


              }
            return pedidos;
        }


    }
}
