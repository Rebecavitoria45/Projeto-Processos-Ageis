import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core'; // 1. Adicionado OnChanges e ChangeDetectorRef
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabela-municipios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-usuarios.component.html',
  styleUrls: ['./tabela-usuarios.component.css']
})
export class TabelaMunicipiosComponent implements OnChanges { 
  @Input() municipios: any[] = [];
  @Output() verDetalhes = new EventEmitter<any>();
  @Output() remover = new EventEmitter<any>(); 
  @Output() editar = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['municipios']) {
      this.cdr.detectChanges();
    }
  }

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