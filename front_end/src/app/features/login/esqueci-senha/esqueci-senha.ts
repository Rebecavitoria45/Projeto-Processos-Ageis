import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../Service/usuario.service';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './esqueci-senha.html',
  styleUrls: ['./esqueci-senha.css'],
})
export class EsqueciSenhaComponent {
  form!: FormGroup;
  msg: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.usuarioService.solicitarRedefinicaoSenha(this.form.value.email).subscribe({
      next: () => (this.msg = 'Verifique seu e-mail para redefinir a senha.'),
      error: (err) => (this.error = err.error?.msg || 'Erro ao solicitar redefinição.')
    });
  }

  voltarLogin() {
    this.router.navigate(['/login']);
  }
}
