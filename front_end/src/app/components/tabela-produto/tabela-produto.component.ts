import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core'; // 1. Adicionado OnChanges e ChangeDetectorRef
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabela-saidas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-produto.component.html',
  styleUrls: ['./tabela-produto.component.css']
})
export class TabelaSaidasComponent implements OnChanges { 
  @Input() saidas: any[] = [];
  @Output() verDetalhes = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['saidas']) {
      this.cdr.detectChanges();
    }
  }

  abrirDetalhes(item: any) {
    this.verDetalhes.emit(item);
  }
}