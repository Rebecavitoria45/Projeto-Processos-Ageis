import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabela-municipios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-usuarios.component.html',
  styleUrls: ['./tabela-usuarios.component.css']
})
export class TabelaMunicipiosComponent {
  @Input() municipios: any[] = [];
  @Output() verDetalhes = new EventEmitter<any>();
  @Output() remover = new EventEmitter<any>(); 
  @Output() editar = new EventEmitter<any>();

  abrirDetalhes(municipio: any) {
    this.verDetalhes.emit(municipio);
  }

  solicitarEdicao(municipio: any) {
    this.editar.emit(municipio);
  }

  solicitarRemocao(municipio: any) {
    this.remover.emit(municipio);
  }
}
