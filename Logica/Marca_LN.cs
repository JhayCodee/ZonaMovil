using Datos; //se añade para poder referenciar a Capa Datos
using Modelo;
using System.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica
{
    public class Marca_LN
    {
        private readonly db_a97d9e_zonamovilEntities _db;

        // con _db accedemos a las tablas de la bd
        public Marca_LN()
        {
            _db = new db_a97d9e_zonamovilEntities();
        }


        //Listar Marcas
        public bool ListarMarcas(ref List<Marca_VM> listaMarca, ref string errorMsj)
        {
            try
            {
                listaMarca = _db.Marca
                    .Select(m => new Marca_VM
                    {
                        IdMarca = m.IdMarca,
                        Nombre = m.Nombre,
                        Activo = m.Activo
                    })
                    .Where(m => m.Activo == true)
                    .ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMsj = ex.Message;
                return false;
            }
        }

        // Agrega una nueva marca
        public bool AgregarMarca(ref Marca_VM marca, ref string mensaje)
        {
            try
            {
                Marca nuevaMarca = new Marca()
                {
                    Nombre = marca.Nombre,
                    Activo = true
                };
                _db.Marca.Add(nuevaMarca);
                _db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                mensaje = "Error al agregar la marca: " + ex.Message;
                return false;
            }
        }


        // Edita una marca existente

        public bool EditarMarca(int id, ref Marca_VM marca, ref string mensaje)
        {
            try
            {
                Marca marcaExistente = _db.Marca.FirstOrDefault(m => m.IdMarca == id);
                if (marcaExistente != null)
                {
                    marcaExistente.Nombre = marca.Nombre;
                    _db.Entry(marcaExistente).State = EntityState.Modified;
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    mensaje = "No se encontró la marca con ID " + id;
                    return false;
                }
            }
            catch (Exception ex)
            {
                mensaje = "Error al editar la marca: " + ex.Message;
                return false;
            }
        }

        // Eliminar marca
        public bool EliminarMarca(int id, ref string mensaje)
        {
            try
            {
                Marca marcaExistente = _db.Marca.FirstOrDefault(m => m.IdMarca == id);

                if (marcaExistente != null)
                {
                    marcaExistente.Activo = false;

                    _db.Entry(marcaExistente).State = EntityState.Modified;
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    mensaje = "No se encontró la marca con ID " + id;
                    return false;
                }

            }
            catch (Exception ex)
            {
                mensaje = "Error al eliminar la marca: " + ex.Message;
                return false;
            }
        }


        // Buscar Marca
        public Marca_VM BuscarMarcaPorId(int id)
        {
            try
            {
                var marca = _db.Marca.FirstOrDefault(m => m.IdMarca == id);
                if (marca != null)
                {
                    var marcaVM = new Marca_VM
                    {
                        IdMarca = marca.IdMarca,
                        Nombre = marca.Nombre
                    };

                    return marcaVM;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al obtener la marca: " + ex.Message);
                return null;
            }
        }



    }
}
