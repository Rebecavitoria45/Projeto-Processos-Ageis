import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicLayoutComponent } from '../../../components/public-layout/public-layout.component';
import { SolicitacaoService } from '../../../Service/solicitacao';
import { SaidaService } from '../../../Service/saida.service';
import { KitService } from '../../../Service/kitproduto.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



interface Kit {
  tipo_kit?: string;
  produto?: string;
  quantidade_kit: number;
}

interface Saida {
  nomeKit: string;
  quantidade: number;
  createdAt: string;
  municipio: string;
}

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, PublicLayoutComponent, FormsModule],
  templateUrl: './estoque.html',
  styleUrls: ['./estoque.css']
})
export class EstoqueComponent implements OnInit {

  kits: Kit[] = [];
  totalEstoque: number = 0;

  saidas: Saida[] = [];
  saidasFiltradas: Saida[] = [];
  totalSaidas: number = 0;

  dataInicio: string = '';
  dataFim: string = '';
  carregando: boolean = false;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private saidaService: SaidaService,
    private kitService: KitService
  ) {}

  ngOnInit(): void {
    this.carregarKits();
    this.buscarSaidas();
  }

  aplicarFiltro(): void {
    const inicio = this.dataInicio ? new Date(this.dataInicio) : null;
    const fim = this.dataFim ? new Date(this.dataFim) : null;

    this.saidasFiltradas = this.saidas.filter(s => {
      const data = new Date(s.createdAt);
      if (inicio && data < inicio) return false;
      if (fim && data > fim) return false;
      return true;
    });

    this.totalSaidas = this.saidasFiltradas.reduce((sum, s) => sum + s.quantidade, 0);
  }

  gerarRelatorioPDF(): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Relatório de Saídas de Kits', 14, 20);

    const head = [['Nome do Kit', 'Quantidade', 'Data', 'Município']];
    const body = this.saidasFiltradas.map(s => [
      s.nomeKit,
      s.quantidade.toString(),
      new Date(s.createdAt).toLocaleDateString(),
      s.municipio
    ]);

    autoTable(doc, { head, body, startY: 30 });
    doc.save('relatorio_saidas.pdf');
  }

  carregarKits(): void {
    this.carregando = true;
    this.kitService.listar().subscribe({
      next: (kits) => {
        const mapKits = new Map<string, { tipo_kit: string, quantidade_kit: number }>();

        kits.forEach(k => {
          const nome = k.tipo_kit || k.produto || '—';
          const qtd = k.quantidade_kit || 0;

          if (mapKits.has(nome)) {
            mapKits.get(nome)!.quantidade_kit += qtd;
          } else {
            mapKits.set(nome, { tipo_kit: nome, quantidade_kit: qtd });
          }
        });

        this.kits = Array.from(mapKits.values());
        this.totalEstoque = this.kits.reduce((sum, k) => sum + k.quantidade_kit, 0);
        this.carregando = false;
      },
      error: (err) => {
        console.error("Erro ao carregar kits:", err);
        this.carregando = false;
      }
    });
  }
  buscarSaidas(): void {
    this.carregando = true;
  
    this.saidaService.listarSaidas().subscribe({
      next: async (saidas) => {
        const resultados: Saida[] = [];
  
        for (const s of saidas) {
          try {
            const solicitacao: any = await this.solicitacaoService.buscarPorId(s.solicitacao_id).toPromise();
            const usuario: any = await this.solicitacaoService.buscarUsuarioPorId(solicitacao.usuario_id).toPromise();
  
            resultados.push({
              nomeKit: solicitacao.tipo_kit || '—',
              quantidade: s.quantidade || solicitacao.quantidade_atendida || 0,
              createdAt: s.createdAt,
              municipio: usuario?.municipio || '—'
            });
  
          } catch (error) {
            console.error("Erro ao buscar dados da saída:", error);
          }
        }
  
        this.saidas = resultados;
        this.saidasFiltradas = [...resultados];
        this.totalSaidas = this.saidasFiltradas.reduce((sum, s) => sum + s.quantidade, 0);
  
        this.carregando = false;
      },
      error: (err) => {
        console.error("Erro ao carregar saídas:", err);
        this.carregando = false;
      }
    });
  }
}  