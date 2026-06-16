import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitacao-detalhes-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitacao-detalhe.component.html',
  styleUrls: ['./solicitacao-detalhe.component.css']
})
export class SolicitacaoDetalhesModalComponent {
  @Input() solicitacao: any;
  @Output() fecharModal = new EventEmitter<void>();

  fechar() {
    this.fecharModal.emit();
  }
}
