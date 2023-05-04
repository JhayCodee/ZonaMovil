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
    public class Categoria_LN
    {

        private readonly db_a97d9e_zonamovilEntities _db;

        // con _db accedemos a las tablas de la bd
        public Categoria_LN()
        {
            _db = new db_a97d9e_zonamovilEntities();
        }

        //Listar Categorias
        public bool ListarCategorias(ref List<Categoria_VM> listaCategoria, ref string errorMsj)
        {
            try
            {
                listaCategoria = _db.Categoria
                    .Select(c => new Categoria_VM
                    {
                        IdCategoria = c.IdCategoria,
                        Nombre = c.Nombre
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

        // Agrega una nuevoa categoria
        public bool AgregarCategoria(ref Categoria_VM categoria, ref string mensaje)
        {
            try
            {
                Categoria nuevaCategoria = new Categoria()
                {
                    Nombre = categoria.Nombre,

                };
                _db.Categoria.Add(nuevaCategoria);
                _db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                mensaje = "Error al agregar la categoria: " + ex.Message;
                return false;
            }
        }


        // Edita una categoria existente
        
        public bool EditarCategoria(int id, ref Categoria_VM categoria, ref string mensaje)
        {
            try
            {
                Categoria categoriaExistente = _db.Categoria.FirstOrDefault(c => c.IdCategoria == id);
                if (categoriaExistente != null)
                {
                    categoriaExistente.Nombre = categoria.Nombre;
                    _db.Entry(categoriaExistente).State = EntityState.Modified;
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    mensaje = "No se encontró la categoria con ID " + id;
                    return false;
                }
            }
            catch (Exception ex)
            {
                mensaje = "Error al editar el cliente: " + ex.Message;
                return false;
            }
        }

        public bool EliminarCategoria(int id, ref string mensaje)
        {
            try
            {
                Categoria categoriaExistente = _db.Categoria.FirstOrDefault(c => c.IdCategoria == id);

                if (categoriaExistente != null)
                {
                    categoriaExistente.Activo = false;

                    _db.Entry(categoriaExistente).State = EntityState.Modified;
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    mensaje = "No se encontró la categoria con ID " + id;
                    return false;
                }

            }
            catch (Exception ex)
            {
                mensaje = "Error al eliminar el cliente: " + ex.Message;
                return false;
            }
        }
        

        public Categoria_VM BuscarCategoriaPorId(int id)
        {
            try
            {
                var categoria = _db.Categoria.FirstOrDefault(c => c.IdCategoria == id);
                if (categoria != null)
                {
                    var categoriaVM = new Categoria_VM
                    {
                        IdCategoria = categoria.IdCategoria,
                        Nombre = categoria.Nombre
                    };

                    return categoriaVM;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al obtener la categoria: " + ex.Message);
                return null;
            }
        }

    }
}
