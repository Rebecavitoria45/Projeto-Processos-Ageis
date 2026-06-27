import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { PublicLayoutComponent } from '../../../components/public-layout/public-layout.component';
import { ModalSolicitacaoAdminComponent } from './modal-solicitacao/modal-solicitacao.component';
import { SolicitacaoService } from '../../../Service/solicitacao';
import { UsuarioService } from '../../../Service/usuario.service';
import { KitService } from '../../../Service/kitproduto.service';
interface Solicitacao {
  id: number;
  tipo_kit?: string;
  produto?: string; 
  quantidadeSolicitada: number;
  quantidadeAtendida?: number;
  quantidadeEstoque?: number;
  dataSolicitacao: string;
  municipioOuUsuario: string;
  status: string;
  observacao?: string;
  historico?: any[];
  raw?: any;
}

@Component({
  selector: 'app-solicitacoes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ModalSolicitacaoAdminComponent,
    PublicLayoutComponent
  ],
  templateUrl: './solicitacoes-admin.html',
  styleUrls: ['./solicitacoes-admin.css']
})
export class SolicitacoesComponent implements OnInit {

  solicitacoes: Solicitacao[] = [];
  mostrarModal = false;
  solicitacaoSelecionada: 
  Solicitacao | null = null;
  
  carregando = false;
  erro: string | null = null;
  roleUsuarioLogado = '';
  kitsDisponiveis: any[] = [];

  constructor(
    private solicitacaoService: SolicitacaoService,
    private usuarioService: UsuarioService,
    private kitService: KitService
  ) {}

  ngOnInit(): void {
    this.roleUsuarioLogado = localStorage.getItem('role') || '';

    this.kitService.listar().subscribe({
      next: kits => {
        this.kitsDisponiveis = kits;
        this.carregarSolicitacoes();
      },
      error: () => this.carregarSolicitacoes()
    });
  }

  carregarSolicitacoes(): void {
    this.carregando = true;

    this.solicitacaoService.listarSolicitacoes().subscribe({
      next: (res: any[]) => {
        const lista = Array.isArray(res) ? res : [];

        forkJoin(lista.map(s =>
          forkJoin({ usuarios: this.usuarioService.listarUsuarios() }).pipe(
            map(({ usuarios }) => {
              const usuario = usuarios.find(u => (u.usuario_id || u.id) === (s.usuario_id || s.id_usuario));
              const kitEncontrado = this.kitsDisponiveis.find(k =>
                (k.tipo_kit || '').toLowerCase().trim() === (s.tipo_kit || '').toLowerCase().trim()
              );

              return {
                id: s.solicitacao_id,
                tipo_kit: s.tipo_kit,
                quantidadeSolicitada: s.quantidade_solicitada || 0,
                quantidadeAtendida: s.quantidade_atendida ?? 0,
                quantidadeEstoque: kitEncontrado?.quantidade_kit ?? 0,
                dataSolicitacao: new Date(s.data_solicitacao).toLocaleDateString(),
                municipioOuUsuario: usuario?.municipio || usuario?.nome || '—',
                status: s.status,
                observacao: s.observacao || '—',
                historico: s.historico || [],
                raw: s
              };
            })
          )
        )).subscribe({
          next: resultado => {
            this.solicitacoes = resultado;
            this.carregando = false;
          },
          error: () => {
            this.erro = 'Erro ao processar solicitações.';
            this.carregando = false;
          }
        });
      },
      error: () => {
        this.erro = 'Erro ao carregar solicitações.';
        this.carregando = false;
      }
    });
  }

  abrirDetalhes(solicitacao: Solicitacao) {
    this.solicitacaoSelecionada = { ...solicitacao };
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
    this.solicitacaoSelecionada = null;
  }

  atualizarTabela(solicitacaoAtualizada: any) {
    const i = this.solicitacoes.findIndex(s => s.id === solicitacaoAtualizada.id);
    if (i < 0) return;

    this.solicitacoes[i] = {
      ...this.solicitacoes[i],
      ...solicitacaoAtualizada
    };

    const kit = this.kitsDisponiveis.find(k =>
      (k.tipo_kit || '').toLowerCase() === 
      (this.solicitacoes[i].tipo_kit || '').toLowerCase()
    );

    if (kit) {
      this.solicitacoes[i].quantidadeEstoque = kit.quantidade_kit;
    }
  }
}
