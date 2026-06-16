import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../Service/usuario.service'; 

@Component({
  selector: 'app-definir-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './definir-senha.html',
  styleUrls: ['./definir-senha.css']
})
export class DefinirSenhaComponent {
  form!: FormGroup;
  token: string | null = null;
  msg: string | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.error = 'Link inválido ou expirado.';
      return;
    }

    this.form = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { novaSenha, confirmarSenha } = this.form.value;
    if (novaSenha !== confirmarSenha) {
      this.error = 'As senhas não coincidem.';
      return;
    }

    this.usuarioService.definirSenha(this.token!, novaSenha).subscribe({
      next: (res) => {
        this.msg = 'Senha definida com sucesso! Você já pode fazer login.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.msg || 'Erro ao definir senha.';
      }
    });
  }
}