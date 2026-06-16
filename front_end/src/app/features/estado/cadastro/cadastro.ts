import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../Service/usuario.service'; 
import { CommonModule } from '@angular/common';
import { ModalCadastroComponent } from './modais/modal-cadastro/modal-cadastro.component';
import { TabelausuariosComponent } from '../../../components/tabela-usuarios/tabela-usuarios.component'; 
import { PublicLayoutComponent } from '../../../components/public-layout/public-layout.component'; 

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    TabelausuariosComponent,
    ModalCadastroComponent,
    PublicLayoutComponent
  ],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class CadastroComponent implements OnInit {
  usuarios: any[] = [];
  usuarioSelecionado: any | null = null;
  mostrarModal = false;

  constructor(private usuarioService: UsuarioService) {}
  
  ngOnInit() {
    this.carregarUsuarios();
  }
  
  carregarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res.filter((u: any) => u.role !== 'admin');
      },
      error: (err) => console.error('Erro ao listar usuários:', err)
    });
  }
  
  salvarOuAtualizar(dados: any) {
    if (this.usuarioSelecionado) {
      const id = Number(this.usuarioSelecionado.id || this.usuarioSelecionado.usuario_id);
      const payload = { email: dados.email, role: dados.role, municipio: dados.nome };
  
      this.usuarioService.atualizarUsuario(id, payload).subscribe({
        next: () => {
          alert('Usuário updated com sucesso!');
          this.fecharModal();
          this.carregarUsuarios();
        },
        error: (err) => console.error('Erro ao atualizar:', err)
      });
    }
    else {
      const payload = {
        nome: dados.nome,    
        email: dados.email,
        role: dados.role,
        municipio: dados.nome 
      };
    
      console.log('Payload enviado:', payload); 
      this.usuarioService.cadastrarUsuario(payload).subscribe({
        next: () => {
          alert('Usuário cadastrado com sucesso! Um e-mail foi enviado para ativação.');
          this.fecharModal();
          this.carregarUsuarios();
        },
        error: (err) => console.error('Erro ao cadastrar:', err)
      });
    }
  }
  
  deletarUsuario(usuario: any) {
    const id = typeof usuario === 'object' ? usuario.usuario_id || usuario.id : usuario;
  
    console.log('ID recebido para exclusão:', id);
  
    if (!id || isNaN(id)) {
      console.error('ID inválido para deletar usuário:', usuario);
      alert('Erro: ID do usuário inválido.');
      return;
    }
  
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
  
    console.log('Deletando usuário com ID:', id);
  
    this.usuarioService.deletarUsuario(Number(id)).subscribe({
      next: () => {
        alert('Usuário deletado com sucesso!');
        this.carregarUsuarios();
      },
      error: (err) => {
        console.error('Erro ao deletar:', err);
        alert('Erro ao deletar usuário. Verifique o console.');
      }
    });
  }
  
  abrirModalCadastro() {
    this.usuarioSelecionado = null;
    this.mostrarModal = true;
  }

  abrirDetalhes(usuario: any) {
    this.usuarioSelecionado = usuario;
    this.mostrarModal = true;
  }

  editarUsuario(usuario: any) {
    this.usuarioSelecionado = usuario;
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
  }
}