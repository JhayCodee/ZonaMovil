using Datos;
using Modelo;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica
{
    public class Cliente_LN
    {
        private readonly db_a97d9e_zonamovilEntities _db;

        // con _db accedemos a las tablas de la bd
        public Cliente_LN()
        {
            _db = new db_a97d9e_zonamovilEntities();
        }

        public bool ListarClientes(ref List<Cliente_VM> listaClientes, ref string errorMsj)
        {
            try
            {
                listaClientes = _db.Cliente
                    .Select(c => new Cliente_VM
                    {
                        IdCliente = c.IdCliente,
                        Nombres = c.Nombres,
                        Apellidos = c.Apellidos,
                        Cedula = c.Cedula,
                        Correo = c.Correo,
                        Telefono = c.Telefono
                    })
                    .ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMsj = ex.Message;
                return false;
            }
        }

        // Agrega un nuevo cliente
        public bool AgregarCliente(ref Cliente_VM cliente, ref string mensaje)
        {
            try
            {
                Cliente nuevoCliente = new Cliente()
                {
                    Nombres = cliente.Nombres,
                    Apellidos = cliente.Apellidos,
                    Cedula = cliente.Cedula,
                    Correo = cliente.Correo,
                    Telefono = cliente.Telefono
                };
                _db.Cliente.Add(nuevoCliente);
                _db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                mensaje = "Error al agregar el cliente: " + ex.Message;
                return false;
            }
        }

        // Edita un cliente existente
        public bool EditarCliente(int id, ref Cliente_VM cliente, ref string mensaje)
        {
            try
            {
                Cliente clienteExistente = _db.Cliente.FirstOrDefault(c => c.IdCliente == id);
                if (clienteExistente != null)
                {
                    clienteExistente.Nombres = cliente.Nombres;
                    clienteExistente.Apellidos = cliente.Apellidos;
                    clienteExistente.Cedula = cliente.Cedula;
                    clienteExistente.Correo = cliente.Correo;
                    clienteExistente.Telefono = cliente.Telefono;
                    _db.Entry(clienteExistente).State = EntityState.Modified;
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    mensaje = "No se encontró el cliente con ID " + id;
                    return false;
                }
            }
            catch (Exception ex)
            {
                mensaje = "Error al editar el cliente: " + ex.Message;
                return false;
            }
        }

        public Cliente_VM BuscarClientePorId(int id)
        {
            try
            {
                var cliente = _db.Cliente.FirstOrDefault(c => c.IdCliente == id);
                if (cliente != null)
                {
                    var clienteVM = new Cliente_VM
                    {
                        IdCliente = cliente.IdCliente,
                        Nombres = cliente.Nombres,
                        Apellidos = cliente.Apellidos,
                        Cedula = cliente.Cedula,
                        Correo = cliente.Correo,
                        Telefono = cliente.Telefono
                    };

                    return clienteVM;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al obtener el cliente: " + ex.Message);
                return null;
            }
        }
    }
}
