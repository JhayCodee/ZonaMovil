using Datos;
using Modelo;
using System.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica
{
    public class Proveedor_LN
    {
        private readonly db_a97d9e_zonamovilEntities _db;
        
        // con _db accedemos a las tablas de la bd
        public Proveedor_LN()
        {
            _db = new db_a97d9e_zonamovilEntities();
        }

        public bool ListarProveedores(ref List<Proveedor_VM> listaProveedores, ref string errorMsj)
        {
            try
            {
                listaProveedores = _db.Proveedor
                    .Select(c => new Proveedor_VM
                    {
                        IdProveedor = c.IdProveedor,
                        Nombre = c.Nombre,
                        Telefono = c.Telefono,
                        Correo = c.Correo,
                        Direccion = c.Direccion,
                        Activo=c.Activo
                    })
                    .Where(c => c.Activo == true)
                    .ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMsj = ex.Message;
                return false;
            }
        }

        // Agrega un nuevo Proveedor
       
        public bool AgregarProveedor(ref Proveedor_VM proveedor, ref string mensaje)
        {
            try
            {
                Proveedor nuevoProveedor = new Proveedor()
                {
                    Nombre = proveedor.Nombre,
                    Telefono = proveedor.Telefono,
                    Correo = proveedor.Correo,
                    Direccion = proveedor.Direccion,
                    Activo = true
                };
                _db.Proveedor.Add(nuevoProveedor);
                _db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                mensaje = "Error al agregar el Proveedor: " + ex.Message;
                return false;
            }
        }

        // Edita un cliente existente
        public bool EditarProveedor(int id, ref Proveedor_VM proveedor, ref string mensaje)
        {
            try
            {
                Proveedor proveedorExistente = _db.Proveedor.FirstOrDefault(c => c.IdProveedor == id);
                if (proveedorExistente != null)
                {
                    proveedorExistente.Nombre = proveedor.Nombre;
                    proveedorExistente.Telefono = proveedor.Telefono;
                    proveedorExistente.Correo = proveedor.Correo;
                    proveedorExistente.Direccion = proveedor.Direccion;
                    _db.Entry(proveedorExistente).State = EntityState.Modified;
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    mensaje = "No se encontró el proveedor con ID " + id;
                    return false;
                }
            }
            catch (Exception ex)
            {
                mensaje = "Error al editar el proveedor: " + ex.Message;
                return false;
            }
        }

        // set activo = 0
        public bool EliminarProveedor(int id, ref string mensaje)
        {
            try
            {
                Proveedor proveedorExistente = _db.Proveedor.FirstOrDefault(c => c.IdProveedor == id);

                if (proveedorExistente != null)
                {
                    proveedorExistente.Activo = false;
                    _db.Entry(proveedorExistente).State = EntityState.Modified;
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    mensaje = "No se encontró el proveedor con ID " + id;
                    return false;
                }

            }
            catch (Exception ex)
            {
                mensaje = "Error al eliminar el proveedor: " + ex.Message;
                return false;
            }
        }

        public Proveedor_VM BuscarProveedorPorId(int id)
        {
            try
            {
                var proveedor = _db.Proveedor.FirstOrDefault(c => c.IdProveedor == id);
                if (proveedor != null)
                {
                    var proveedorVM = new Proveedor_VM
                    {
                        IdProveedor = proveedor.IdProveedor,
                        Nombre = proveedor.Nombre,
                        Telefono = proveedor.Telefono,
                        Correo = proveedor.Correo,
                        Direccion = proveedor.Direccion,
                    };

                    return proveedorVM;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al obtener el proveedor: " + ex.Message);
                return null;
            }
        }


    }
}
