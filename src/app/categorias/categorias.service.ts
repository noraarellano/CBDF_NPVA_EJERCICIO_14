import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Respuesta } from './categorias.model';

@Injectable({
  providedIn: 'root'
})

export class CategoriasService {
  private urlAPI = "http://localhost:3000/socios/v1/categorias";

  constructor(private http:HttpClient) { }

  //Metodos
  //GET
  getAllCategorias(): Observable<Respuesta> {
    return this.http.get<Respuesta>(this.urlAPI).pipe(
      catchError((error: any) => {
        console.error("Error:", error);
        return throwError("Error al obtener las categorías");
      })
    );
  }
  
  //GETBYID
  getCategoriaById(id:number):Observable<Respuesta>{
    return this.http.get<Respuesta>(this.urlAPI+'/'+id);
  }

  //POST
  createCategoria(categoria:object):Observable<Respuesta>{
    return this.http.post<Respuesta>(this.urlAPI,categoria)
  }

  //PUT
  updateCategoria(id:number,categoria:object):Observable<Respuesta>{
    return this.http.put<Respuesta>(this.urlAPI+'/'+id,categoria)
  }
  //DELETE
  deleteCategoria(id:number):Observable<Respuesta>{
    return this.http.delete<Respuesta>(this.urlAPI+'/'+id)
  }
}
