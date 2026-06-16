import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../../../../Service/solicitacao';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitacao-criar-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './solicitacao-criar.component.html',
  styleUrls: ['./solicitacao-criar.component.css']
})
export class SolicitacaoCriarModalComponent {

  @Output() fechado = new EventEmitter<void>();
  @Output() criada = new EventEmitter<void>();

  form: FormGroup;
  loading = false;

  tiposKit = [
    { label: 'Kit Higiene', value: 'kit_higiene' },
    { label: 'Kit Alimentação', value: 'kit_alimentacao' }
  ];

  constructor(
    private fb: FormBuilder,
    private solicitacaoService: SolicitacaoService
  ) {
    this.form = this.fb.group({
      tipo_kit: ['', Validators.required],
      quantidade_solicitada: [null, [Validators.required, Validators.min(1)]]
    });
  }

  fechar() {
    this.fechado.emit();
  }

  salvar() {
    if (this.form.invalid) return;

    this.loading = true;

    const usuarioId = Number(localStorage.getItem('user_id'));

    const payload = {
      usuario_id: usuarioId,
      tipo_kit: this.form.value.tipo_kit,
      quantidade_solicitada: this.form.value.quantidade_solicitada
    };

    this.solicitacaoService.criarSolicitacao(payload).subscribe({
      next: () => {
        this.loading = false;
        this.criada.emit();
        this.fechar();
      },
      error: (err) => {
        console.error('Erro ao criar solicitação:', err);
        this.loading = false;
      }
    });
  }
}
