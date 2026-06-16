import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabela-saidas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-produto.component.html',
  styleUrls: ['./tabela-produto.component.css']
})
export class TabelaSaidasComponent {
  @Input() saidas: any[] = [];
  @Output() verDetalhes = new EventEmitter<any>();

  abrirDetalhes(item: any) {
    this.verDetalhes.emit(item);
  }
}
