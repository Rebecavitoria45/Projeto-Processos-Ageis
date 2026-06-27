import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core'; 
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
export class SolicitacoesComponent implements OnInit, AfterViewInit { 

  solicitacoes: Solicitacao[] = [];
  mostrarModal = false;
  solicitacaoSelecionada: Solicitacao | null = null;
  
  carregando = false;
  erro: string | null = null;
  roleUsuarioLogado = '';
  kitsDisponiveis: any[] = [];

  constructor(
    private solicitacaoService: SolicitacaoService,
    private usuarioService: UsuarioService,
    private kitService: KitService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.roleUsuarioLogado = localStorage.getItem('role') || '';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.carregarDadosIniciais();
    }, 200);
  }

  carregarDadosIniciais(): void {
    this.kitService.listar().subscribe({
      next: kits => {
        this.kitsDisponiveis = kits;
        this.carregarSolicitacoes();
      },
      error: () => {
        this.carregarSolicitacoes();
      }
    });
  }

  carregarSolicitacoes(): void {
    this.carregando = true;
    this.erro = null;
  
    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => {
        const listaUsuarios = Array.isArray(usuarios) ? usuarios : [];
  
        this.solicitacaoService.listarSolicitacoes().subscribe({
          next: (res: any[]) => {
            const listaSolicitacoes = Array.isArray(res) ? res : [];
  
            const resultado = listaSolicitacoes.map((s: any) => {
              const usuario = listaUsuarios.find(u => (u.usuario_id || u.id) === (s.usuario_id || s.id_usuario));
              
              const kitEncontrado = this.kitsDisponiveis.find(k =>
                (k.tipo_kit || '').toLowerCase().trim() === (s.tipo_kit || s.produto || '').toLowerCase().trim()
              );
  
              return {
                id: s.solicitacao_id || s.id, 
                tipo_kit: s.tipo_kit || s.produto || '—',
                quantidadeSolicitada: s.quantidade_solicitada || s.quantidade || 0,
                quantidadeAtendida: s.quantidade_atendida ?? 0,
                quantidadeEstoque: kitEncontrado?.quantidade_kit ?? kitEncontrado?.quantidade ?? 0,
                dataSolicitacao: s.data_solicitacao ? new Date(s.data_solicitacao).toLocaleDateString() : '—',
                municipioOuUsuario: usuario?.municipio || usuario?.nome || '—',
                status: s.status || 'Pendente',
                observacao: s.observacao || '—',
                historico: s.historico || [],
                raw: s
              };
            });
  
            this.solicitacoes = [...resultado];
            this.carregando = false;

            this.cdr.detectChanges(); 
          },
          error: (err) => {
            console.error(err);
            this.erro = 'Erro ao carregar solicitações.';
            this.carregando = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.erro = 'Erro ao carregar lista de usuários para cruzamento.';
        this.carregando = false;
        this.cdr.detectChanges();
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

    this.cdr.detectChanges(); 
  }
}