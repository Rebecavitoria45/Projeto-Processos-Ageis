import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-cadastro.component.html',
  styleUrls: ['./modal-cadastro.component.css']
})
export class ModalCadastroComponent implements OnInit {
  @Input() usuario: any | null = null;
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();
  @Output() deletar = new EventEmitter<any>();

  form!: FormGroup;

  // Nome corrigido e mais semântico
  cidadesDisponiveis: string[] = [
    'Araçoiaba',
    'Cabo de Santo Agostinho',
    'Camaragibe',
    'Goiana',
    'Igarassu',
    'Ilha de Itamaracá',
    'Ipojuca',
    'Itapissuma',
    'Jaboatão dos Guararapes',
    'Moreno',
    'Olinda',
    'Recife'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: [this.usuario?.nome || this.usuario?.municipio || '', Validators.required],
      email: [this.usuario?.email || '', [Validators.required, Validators.email]],
      role: [this.usuario?.role || 'usuario', Validators.required]
    });
  }

  fecharModal() {
    this.fechar.emit();
  }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const { nome, email, role } = this.form.value;
    const payload = { nome, email, role };
  
    this.salvar.emit(payload);
  }
  
  solicitarDelete() {
    if (this.usuario) {
      const id = this.usuario.id || this.usuario.usuario_id;
      if (id) {
        this.deletar.emit(id);
      }
    }
  }
}