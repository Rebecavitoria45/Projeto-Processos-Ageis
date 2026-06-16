import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Service/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  loginForm: FormGroup;
  errorMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      remember: [false]
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.errorMsg = 'Preencha todos os campos corretamente.';
      return;
    }

    const { email, senha } = this.loginForm.value;

    this.authService.login(email, senha).subscribe({
      next: (res) => {
        console.log('Login bem-sucedido:', res);

        if (res.token) {
          // Salvar token
          localStorage.setItem('token', res.token);

          //Decodificar token para pegar dados do usuário
          const decoded: any = jwtDecode(res.token);
          console.log('Usuário logado:', decoded);

          // Salvar role e user_id
          localStorage.setItem('role', decoded.role || '');
          localStorage.setItem('user_id', String(decoded.id));

          //  Redirecionamento por role
          const redirectMap: any = {
            admin: '/homepage',
            user: '/homeUser'
          };
          const destino = redirectMap[decoded.role] || '/login';

          alert(`Bem-vindo, ${decoded.email}!`);
          this.router.navigate([destino]);
        }
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.errorMsg = err.error?.msg || 'Erro ao fazer login. Verifique suas credenciais.';
      }
    });
  }

  irParaEsqueciSenha() {
    this.router.navigate(['/esqueci']);
  }
}
