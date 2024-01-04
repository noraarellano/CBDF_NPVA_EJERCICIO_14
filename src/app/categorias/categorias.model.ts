export interface Categoria{
  id:number,
  nombre:string,
  descripcion:string,
}

export interface Respuesta{
  estado:number,
  mensaje:string,
  categoria:Categoria[]
}
