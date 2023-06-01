using Datos;
using Modelo.Consultas;
using Modelo.ProcedimientosAlmacenados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Ventas
{
    public class FacturaVenta_LN
    {
        private readonly db_a97d9e_zonamovilEntities _db;

        public FacturaVenta_LN()
        {
            _db = new db_a97d9e_zonamovilEntities();
        }


        public bool ListarFacturas(ref List<InfoFacturaVenta_VM> listaFactura, ref string errorMessage)
        {
            try
            {
                listaFactura = _db.spInfoFacturaVenta().Select(f => new InfoFacturaVenta_VM { 
                    
                    IdFacturaVenta = f.IdFacturaVenta,
                    IdCliente = f.IdCliente,
                    Cliente = f.Cliente,
                    NumeroFactura = f.NumeroFactura,
                    Fecha = f.Fecha,
                    Impuesto = f.Impuesto,
                    Total = f.Total,
                    TipoPago = f.TipoPago,
                    Activo = f.Activo
                
                }).Where (x => x.Activo == true)
                    .ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool ListarDetalleFacturaVenta(int nf, ref List<DetalleFacturaVenta_VM> detalle, ref string errorMesagge)
        {
            try
            {
                detalle = _db.spDetalleFacturaVenta(nf).Select(d => new DetalleFacturaVenta_VM {
                    NumeroFactura = d.NumeroFactura,
                    Cliente = d.Cliente,
                    Telefono = d.Telefono,
                    Cedula = d.Cedula,
                    Fecha = d.Fecha,
                    Producto = d.Producto,
                    Cantidad = d.Cantidad,
                    PrecioVenta = d.PrecioVenta,
                    Modelo = d.Modelo,
                    Impuesto = d.Impuesto,
                    Total = d.Total
                })
                .ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMesagge = ex.Message;
                return false;
            }
        }

        //public bool ListarDetalleFacturaVenta2(int nf, ref List<DetalleFacturaVentaConProductos_VM> detalle, ref string errorMesagge)
        //{
        //    try
        //    {
        //        detalle = _db.


        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        errorMesagge = ex.Message;
        //        return false;
        //    }
        //}


    }
}
