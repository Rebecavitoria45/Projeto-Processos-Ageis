import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../../Service/solicitacao';  
import { SolicitacaoCriarModalComponent } from './modais/solicitacao-criar/solicitacao-criar.component'; 
import { SolicitacaoDetalhesModalComponent } from './modais/solicitacao-detalhe/solicitacao-detalhe.component'; 
import { PublicLayoutComponent } from "../../../components/public-layout/public-layout.component";
import { MatIconModule } from '@angular/material/icon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-solicitacoes-municipio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SolicitacaoCriarModalComponent,
    MatIconModule,
    PublicLayoutComponent,
    SolicitacaoDetalhesModalComponent
  ],
  templateUrl: './solicitacoes-user.html',
  styleUrls: ['./solicitacoes-user.css']
})
export class SolicitacoesMunicipioComponent implements OnInit {

  filtro: string = '';
  mostrarModal = false;

  periodoFiltro: 'dia' | 'semana' | 'mes' | 'ano' = 'mes';
  ordenarCampo: 'data' | 'quantidade' | '' = '';
  ordenarAsc: boolean = true;

  solicitacoes: any[] = [];
  solicitacaoSelecionada: any = null;

  municipioUsuario: string = '';

  constructor(private solicitacaoService: SolicitacaoService) {}
  usuarios: any[] = []; 

  ngOnInit() {
    this.carregarUsuarios();
    this.carregarSolicitacoesDoUsuario();
  }
  
  carregarUsuarios() {
    this.solicitacaoService.listarUsuarios().subscribe({
      next: (res) => this.usuarios = res,
      error: (err) => console.error('Erro ao buscar usuários:', err)
    });
  }
  
  carregarSolicitacoesDoUsuario() {
    const usuarioId = Number(localStorage.getItem('user_id'));
    if (!usuarioId) return;

    this.solicitacaoService.listarSolicitacoesDoUsuario(usuarioId).subscribe({
      next: (res: any[]) => {
        this.solicitacoes = res.map((s: any) => ({
          produto: s.tipo_kit || '—',
          quantidade: s.quantidade_solicitada || 0,
          dataSolicitacao: s.data_solicitacao
            ? new Date(s.data_solicitacao)
            : new Date(),
          status: s.status === 'aprovado'
            ? 'Aprovado'
            : s.status === 'reprovado'
            ? 'Reprovado'
            : 'Em análise',
          raw: s
        }));
      },
      error: (err) => console.error('Erro ao buscar solicitações do usuário:', err)
    });
  }

  gerarRelatorioPDF() {
    if (!this.solicitacoesFiltradas.length) {
      alert('Não há dados para gerar relatório.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Solicitações', 14, 20);

    const head = [['Produto', 'Quantidade', 'Data', 'Status']];
    const body = this.solicitacoesFiltradas.map(s => [
      s.produto,
      String(s.quantidade),
      s.dataSolicitacao.toLocaleDateString(),
      s.status,
    ]);

    autoTable(doc, { head, body, startY: 30 });
    doc.save('relatorio_solicitacoes.pdf');
  }

  get solicitacoesFiltradas() {
    const termo = this.filtro.toLowerCase().trim();
    const hoje = new Date();
    let dataInicio: Date;

    switch (this.periodoFiltro) {
      case 'dia':
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        break;
      case 'semana':
        const diaSemana = hoje.getDay(); 
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - diaSemana);
        break;
      case 'mes':
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        break;
      case 'ano':
        dataInicio = new Date(hoje.getFullYear(), 0, 1);
        break;
      default:
        dataInicio = new Date(0);
    }

    let filtradas = this.solicitacoes.filter(s => s.dataSolicitacao >= dataInicio);

    if (termo) {
      filtradas = filtradas.filter(s =>
        s.produto.toLowerCase().includes(termo) ||
        s.status.toLowerCase().includes(termo) ||
        String(s.quantidade).includes(termo)
      );
    }

    if (this.ordenarCampo) {
      filtradas.sort((a, b) => {
        let valorA: any, valorB: any;
        if (this.ordenarCampo === 'data') {
          valorA = a.dataSolicitacao;
          valorB = b.dataSolicitacao;
        } else {
          valorA = a.quantidade;
          valorB = b.quantidade;
        }
        if (valorA < valorB) return this.ordenarAsc ? -1 : 1;
        if (valorA > valorB) return this.ordenarAsc ? 1 : -1;
        return 0;
      });
    }

    return filtradas;
  }

  ordenar(campo: 'data' | 'quantidade') {
    if (this.ordenarCampo === campo) {
      this.ordenarAsc = !this.ordenarAsc;
    } else {
      this.ordenarCampo = campo;
      this.ordenarAsc = true;
    }
  }

  abrirModal() { this.mostrarModal = true; }
  fecharModal() { this.mostrarModal = false; }
  salvarSolicitacao() { this.mostrarModal = false; this.carregarSolicitacoesDoUsuario(); }

  verDetalhes(s: any) {
    const d = s.raw;

    this.solicitacaoSelecionada = {
      solicitacao_id: d.solicitacao_id || d.id,
      produto: d.tipo_kit || '—',
      quantidade_solicitada: d.quantidade_solicitada || 0,
      quantidade_atendida: d.quantidade_atendida || 0,
      data_solicitacao: d.data_solicitacao ? new Date(d.data_solicitacao) : new Date(),
      status: d.status === 'aprovado' ? 'Aprovado' : d.status === 'reprovado' ? 'Reprovado' : 'Em análise',
      observacao: d.observacao || '—',
      usuario_id: d.usuario_id || '—',
      municipio: this.municipioUsuario 
    };
  
  }
    
}
