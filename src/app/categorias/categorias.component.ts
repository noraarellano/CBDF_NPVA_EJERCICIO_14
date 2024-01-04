import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriasService } from './categorias.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers:[CategoriasService],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})

  //Consumir el servicio 
  //Agregar el constructor - parámetros del servicio
  //
export class CategoriasComponent {
  categoria = {
    id:0, nombre:"", descripcion:""
  }
  categorias = [
    {id:1, nombre:"Zapateria", descripcion:"Todo lo relacionado con zapatos"},
    {id:2, nombre:"Pesca", descripcion:"Todo lo relacionado a la pesca"},
    {id:3, nombre:"Deportes", descripcion:"Todo lo relacionado con los deportes"},
    {id:4, nombre:"Hogar", descripcion:"Todo lo relacionado al mantenimiento del hogar"},
    {id:5, nombre:"Electrónica", descripcion:"Todo lo relacionado a la electrónica"}
  ]
  
  constructor(private servicioCategorias:CategoriasService){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //Cuando ya todos los elementos estan cargados - OnLoad, jquery
    this.consultarTodasLasCategorias();
  }

  //Este método consume el servicio 
  consultarTodasLasCategorias() {
    this.servicioCategorias.getAllCategorias().subscribe({
      next: (v) => {
        if (v.categoria) {
          this.categorias = v.categoria; // Ajusta aquí
        } else {
          console.error("Error: La respuesta no contiene la propiedad 'categoria'", v);
          // Puedes mostrar un mensaje al usuario informando sobre el problema
        }
      },
      error: (e) => {
        console.error("Error en la solicitud:", e);
        // Puedes mostrar un mensaje al usuario informando sobre el problema
      },
      complete: () => console.info("Se completa la llamada: Si hay error o no"),
    });
  }
   
agregarCategoria() {
  // Verificamos que la categoría tenga un ID positivo y que no exista en el arreglo
  if (this.categoria.id > 0 && this.categorias.every((cat) => cat.id !== this.categoria.id)) {
    // Creamos una copia de la categoría sin vínculos
    const categoriaSinVincular = { ...this.categoria };

    // Suscribirse al servicio para crear la categoría
    this.servicioCategorias.createCategoria(categoriaSinVincular).subscribe({
      next: (resAPI) => {
        console.log('Respuesta del servicio:', resAPI); // Agrega esta línea para imprimir la respuesta

        // Verificamos el estado de la respuesta del servicio
        if (resAPI && resAPI.estado === 1 && resAPI.categoria && resAPI.categoria[0]) {
          // Actualizamos el ID de la categoría con el ID devuelto por el servicio
          categoriaSinVincular.id = resAPI.categoria[0].id || 0;

          // Agregamos la categoría al arreglo en la vista
          this.categorias.push(categoriaSinVincular);

          // Limpiamos la categoría actual
          this.categoria = { id: 0, nombre: "", descripcion: "" };
        }
      },
      error: (error) => {
        console.error(error);
        // Mostramos un mensaje de error en caso de problemas de comunicación
        alert("Error de comunicación al agregar la categoría.");
      },
      complete: () => console.info("Llamada de creación completada."),
    });
  } else {
    // Mostramos un mensaje de error si los datos no son válidos
    alert("Error: Verifica tus datos");
  }
  this.consultarTodasLasCategorias()
}

  

  eliminarCategoria(id:number){
    if(confirm("Estas seguro de que deseas eliminar el registro?")){
      this.servicioCategorias.deleteCategoria(id).subscribe({
        next:(respuesta) => {
          if(respuesta.estado==1){
            const posId = this.categorias.findIndex((categoria)=>categoria.id==id)
            this.categorias.splice(posId,1)
            alert(respuesta.mensaje)
          }else{
            alert(respuesta.mensaje)
          }
        },
        error:(error)=> console.error("error"+error),
        complete:() => console.info("completado")
      })

    }
  }

//Para saber qué categoria actualizar
  seleccionarCategoria(categoriaSeleccionada : {id:number, nombre:string, descripcion:string}){
    this.categoria.id = categoriaSeleccionada.id;
    this.categoria.nombre = categoriaSeleccionada.nombre;
    this.categoria.descripcion = categoriaSeleccionada.descripcion;
  }

// Para actualizar la categoria seleccionada
actualizarCategoria() {
  const idActualizar = this.categorias.findIndex((cat) => cat.id == this.categoria.id);

  if (idActualizar !== -1) {
    // Actualizamos la categoría en la vista
    this.categorias[idActualizar].nombre = this.categoria.nombre;
    this.categorias[idActualizar].descripcion = this.categoria.descripcion;

    // Llamamos al servicio para actualizar la categoría en la base de datos
    this.servicioCategorias.updateCategoria(this.categoria.id, this.categoria).subscribe({
      next: (resAPI) => {
        if (resAPI.estado == 1) {
          alert(resAPI.mensaje);
        } else {
          // Si hay un error en la respuesta del servicio, puedes manejarlo aquí
          alert("Error al actualizar la categoría: " + resAPI.mensaje);
        }
      },
      error: (error) => {
        console.error(error);
        // Puedes manejar el error de comunicación aquí
        alert("Error de comunicación al actualizar la categoría.");
      },
      complete: () => console.info("Llamada de actualización completada."),
    });
  } else {
    alert("Error: La categoría no existe en el arreglo.");
  }
}

}


