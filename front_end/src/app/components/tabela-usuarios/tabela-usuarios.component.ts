import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabela-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-usuarios.component.html',
  styleUrls: ['./tabela-usuarios.component.css']
})
export class TabelausuariosComponent {
  @Input() usuarios: any[] = [];
  @Output() verDetalhes = new EventEmitter<any>();
  @Output() remover = new EventEmitter<any>(); 
  @Output() editar = new EventEmitter<any>();

  abrirDetalhes(usuario: any) {
    this.verDetalhes.emit(usuario);
  }

  solicitarEdicao(usuario: any) {
    this.editar.emit(usuario);
  }

  solicitarRemocao(usuario: any) {
    this.remover.emit(usuario);
  }
}