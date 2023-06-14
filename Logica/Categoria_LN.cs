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
        public bool ListarCategorias(ref List<Categoria_VM> listaCategoria, ref string errorMsj) //se manda una lista de datos de la clase categoria
        {                                                                                        //y una string de mensaje de error
            try
            {
                listaCategoria = _db.Categoria  //se accede a la base de datos en la tabla categoria
                    .Select(c => new Categoria_VM       //se seleccionan los datos en la clase categoria
                    {                                           
                        IdCategoria = c.IdCategoria,    //los datos en la tabla categoria se le pasan a la clase
                        Nombre = c.Nombre,
                        Activo = c.Activo
                    })
                    .Where(c => c.Activo == true)   //en donde las categorias sean Activas (no eliminadas) 
                    .ToList();                      //se convierten a una lista

                return true;
            }
            catch (Exception ex)
            {
                errorMsj = ex.Message;
                return false;
            }
        }

        // Agrega una nuevoa categoria
        public bool AgregarCategoria(ref Categoria_VM categoria, ref string mensaje) //se le pasan los datos de la clase categoria 
        {
            try
            {
                Categoria nuevaCategoria = new Categoria() //se crea una instancia de la tabla categoria para acceder a los campos
                {
                    Nombre = categoria.Nombre,              //se le pasan los datos en la clase a la tabla 
                    Activo=true                             // Activo se deja true 
                };
                _db.Categoria.Add(nuevaCategoria);  //en la bd se añaden los nuevos datos en la tabla categoria
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
        
        public bool EditarCategoria(int id, ref Categoria_VM categoria, ref string mensaje) //se le pasa el id de la categoria
        {
            try
            {
                Categoria categoriaExistente = _db.Categoria.FirstOrDefault(c => c.IdCategoria == id); //se busca la categoria si existe
                if (categoriaExistente != null) //si no es nulo (no existente)
                {
                    categoriaExistente.Nombre = categoria.Nombre;               
                    _db.Entry(categoriaExistente).State = EntityState.Modified; //se actualizan los campos en la bd
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

        public bool EliminarCategoria(int id, ref string mensaje) //se le pasa el id
        {
            try
            {
                Categoria categoriaExistente = _db.Categoria.FirstOrDefault(c => c.IdCategoria == id); //se busca por id si existe 

                if (categoriaExistente != null) //si no es nulo
                {
                    categoriaExistente.Activo = false;  //el campo Activo se cambia a falso (inactivo)

                    _db.Entry(categoriaExistente).State = EntityState.Modified; //se modifica el campo activo de categoria en la bd
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
        

        public Categoria_VM BuscarCategoriaPorId(int id) //se le pasa el id
        {
            try
            {
                var categoria = _db.Categoria.FirstOrDefault(c => c.IdCategoria == id); //se busca si existe en la bd
                if (categoria != null) //si existe y no es nulo
                {
                    var categoriaVM = new Categoria_VM
                    {
                        IdCategoria = categoria.IdCategoria,    //se le pasan los datos de la bd a los de la clase
                        Nombre = categoria.Nombre
                    };

                    return categoriaVM;  //se retornan los datos encontrados
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
