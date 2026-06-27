import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginFormComponent } from '../../../components/login-form/login-form.component';
import { UsuarioService } from '../../../Service/usuario.service'; // <--- Importe o seu serviço de autenticação

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoginFormComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private usuarioService: UsuarioService // <--- Injete o serviço aqui
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login enviado', this.loginForm.value);
      this.errorMsg = '';

      this.usuarioService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          console.log('Login efetuado com sucesso!', res);
          
          if (res.token) {
            localStorage.setItem('token', res.token);
          }
          
          this.router.navigate(['/homemunicipio']);
        },
        error: (err: any) => {
          console.error('Erro ao fazer login:', err);
          this.errorMsg = err.error?.message || 'E-mail ou senha incorretos.';
        }
      });

    } else {
      this.errorMsg = 'Preencha todos os campos corretamente.';
    }
  }

  irParaEsqueciSenha(event: Event) {
    event.preventDefault(); 
    this.router.navigate(['/esqueci-senha']); 
  }
}