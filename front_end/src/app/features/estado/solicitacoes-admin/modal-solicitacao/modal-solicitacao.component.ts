import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../../../Service/solicitacao';

@Component({
  selector: 'app-modal-solicitacao-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-solicitacao.component.html',
  styleUrls: ['./modal-solicitacao.component.css']
})
export class ModalSolicitacaoAdminComponent {
  @Input() kitsDisponiveis: any[] = [];

  @Input() solicitacao: any;
  @Input() aberto: boolean = false;
  @Input() userRole: string = '';
  @Output() fechar = new EventEmitter<void>();
  @Output() atualizou = new EventEmitter<any>();

  observacao: string = '';
  carregando = false;

  constructor(private solicitacaoService: SolicitacaoService) {}

  podeAprovar(): boolean {
    return ['admin', 'estadual'].includes(this.userRole) 
      && this.solicitacao?.status === 'pendente';
  }
  
  aprovar(): void {
    if (!this.solicitacao?.id) return console.warn('ID inválido!');
    if (!this.observacao.trim()) return console.warn('Observação obrigatória!');
  
    this.carregando = true;
  
    const payload = {
      status: 'aprovado',
      observacao: this.observacao
    };
  
    this.solicitacaoService.atualizarSolicitacao(this.solicitacao.id, payload)
      .subscribe({
        next: () => {
          this.atualizou.emit({
            ...this.solicitacao,
            status: 'aprovado',
            observacao: this.observacao
          });
          this.carregando = false;
          this.fecharModal();
        },
        error: (err) => {
          console.error("Erro ao aprovar:", err);
          this.carregando = false;
        }
      });
  }
  recusar(): void {
    if (!this.solicitacao?.id) return console.warn('ID inválido!');
    if (!this.observacao.trim()) return console.warn('Observação obrigatória!');
  
    this.carregando = true;
  
    const payload = {
      status: 'reprovado',
      observacao: this.observacao
    };
  
    this.solicitacaoService.atualizarSolicitacao(this.solicitacao.id, payload)
      .subscribe({
        next: () => {
          this.atualizou.emit({
            ...this.solicitacao,
            status: 'reprovado',
            observacao: this.observacao
          });
          this.carregando = false;
          this.fecharModal();
        },
        error: (err) => {
          console.error("Erro ao reprovar:", err);
          this.carregando = false;
        }
      });
  }
  
  fecharModal(): void {
    this.observacao = '';
    this.fechar.emit();
  }
}