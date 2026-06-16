import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone: true
})
export class FiltroPipe implements PipeTransform {

  transform(lista: any[], texto: string, campo: string): any[] {
    if (!lista) return [];
    if (!texto) return lista;

    texto = texto.toLowerCase();

    return lista.filter(item =>
      item[campo]?.toString().toLowerCase().includes(texto)
    );
  }
}
