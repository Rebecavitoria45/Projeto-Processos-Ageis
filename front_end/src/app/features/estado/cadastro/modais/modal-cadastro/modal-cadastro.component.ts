import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-cadastro.component.html',
  styleUrls: ['./modal-cadastro.component.css']
})
export class ModalCadastroComponent {
  @Input() municipio: any | null = null;
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();
  @Output() deletar = new EventEmitter<any>();

  form!: FormGroup;

  municipiosDisponiveis: string[] = [
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
      nome: [
        this.municipio?.nome || this.municipio?.municipio || '',
        Validators.required
      ],
      email: [
        this.municipio?.email || '',
        [Validators.required, Validators.email]
      ],
      role: [
        this.municipio?.role || 'usuario',
        Validators.required
      ]
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
  
    const payload = {
      nome,
      email,
      role,
      municipio: nome
    };
  
    this.salvar.emit(payload);
  }
  
  solicitarDelete() {
    if (this.municipio) {
      const id = this.municipio.id || this.municipio.usuario_id;
      if (id) {
        this.deletar.emit(id);
      }
    }
  }
}