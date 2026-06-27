import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicLayoutComponent } from '../../../components/public-layout/public-layout.component';
import { SolicitacaoService } from '../../../Service/solicitacao';
import { SaidaService } from '../../../Service/saida.service';
import { KitService } from '../../../Service/kitproduto.service';
import { forkJoin, of } from 'rxjs'; 
import { catchError, map, switchMap } from 'rxjs/operators';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Kit {
  tipo_kit?: string;
  produto?: string;
  quantidade_kit: number;
}

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, PublicLayoutComponent, FormsModule],
  templateUrl: './estoque.html',
  styleUrls: ['./estoque.css']
})
export class EstoqueComponent implements AfterViewInit {

  kits: Kit[] = [];
  totalEstoque: number = 0;

  saidas: any[] = [];
  saidasFiltradas: any[] = [];
  totalSaidas: number = 0;

  dataInicio: string = '';
  dataFim: string = '';
  carregando: boolean = false;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private saidaService: SaidaService,
    private kitService: KitService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.carregarKits();
      this.buscarSaidasOtimizado();
    }, 200);
  }

  carregarKits(): void {
    this.carregando = true;
    this.kitService.listar().subscribe({
      next: (kits) => {
        const mapKits = new Map<string, { tipo_kit: string, quantidade_kit: number }>();

        kits.forEach(k => {
          const nome = k.tipo_kit || k.produto || k.nome || '—';
          const qtd = k.quantidade_kit ?? k.quantidade ?? 0;
        
          if (mapKits.has(nome)) {
            mapKits.get(nome)!.quantidade_kit += qtd;
          } else {
            mapKits.set(nome, { tipo_kit: nome, quantidade_kit: qtd }); //  Correto
                      }
        });

        this.kits = Array.from(mapKits.values());
        this.totalEstoque = this.kits.reduce((sum, k) => sum + k.quantidade_kit, 0);
        this.carregando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Erro ao carregar kits:", err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscarSaidasOtimizado(): void {
    this.carregando = true;
  
    this.saidaService.listarSaidas().subscribe({
      next: (saidas) => {
        console.log('Saídas recebidas do serviço:', saidas);
  
        if (!saidas || !Array.isArray(saidas) || saidas.length === 0) {
          this.saidas = [];
          this.saidasFiltradas = [];
          this.carregando = false;
          this.cdr.detectChanges();
          return;
        }
  
        const requisicoes = saidas.map((s: any) => {
          const solicitacaoId = s.solicitacao_id || s.solicitacaoId || s.solicitacao;
          
          if (!solicitacaoId) {
            return of({
              nomeKit: 'Movimentação Avulsa',
              quantidade: s.quantidade || 0,
              createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
              municipio: '—'
            });
          }
          
          return this.solicitacaoService.buscarPorId(solicitacaoId).pipe(
            switchMap((solicitacao: any) => {
              if (!solicitacao) throw new Error('Solicitação não encontrada');
              
              const usuarioId = solicitacao.usuario_id || solicitacao.usuarioId || solicitacao.usuario;
              
              return this.solicitacaoService.buscarUsuarioPorId(usuarioId).pipe(
                map((usuario: any) => ({
                  nomeKit: solicitacao.tipo_kit || solicitacao.nome || '—',
                  quantidade: s.quantidade || solicitacao.quantidade_atendida || 0,
                  createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
                  municipio: usuario?.municipio || usuario?.nome || '—'
                })),
                catchError(() => of({
                  nomeKit: solicitacao.tipo_kit || '—',
                  quantidade: s.quantidade || 0,
                  createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
                  municipio: '—'
                }))
              );
            }),
            catchError(() => {
              return of({
                nomeKit: 'Kit Desconhecido',
                quantidade: s.quantidade || 0,
                createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
                municipio: '—'
              });
            })
          );
        });
  
        forkJoin(requisicoes).subscribe({
          next: (resultados) => {
            this.saidas = resultados.filter(r => r !== null);
            console.log('Saídas prontas para a tabela:', this.saidas);
            
            this.aplicarFiltro(); 
            this.carregando = false;
            this.cdr.detectChanges(); 
          },
          error: (err) => {
            console.error("Erro no forkJoin das requisições:", err);
            this.carregando = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error("Erro crítico ao listar saídas:", err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }


  aplicarFiltro(): void {
    if (!this.dataInicio && !this.dataFim) {
      this.saidasFiltradas = [...this.saidas];
      this.totalSaidas = this.saidasFiltradas.reduce((sum, s) => sum + s.quantidade, 0);
      this.cdr.detectChanges();
      return;
    }

    const inicio = this.dataInicio ? new Date(this.dataInicio + 'T00:00:00') : null;
    const fim = this.dataFim ? new Date(this.dataFim + 'T23:59:59') : null;

    this.saidasFiltradas = this.saidas.filter(s => {
      const dataMovimentacao = new Date(s.createdAt);
      
      if (inicio && dataMovimentacao < inicio) return false;
      if (fim && dataMovimentacao > fim) return false;
      
      return true;
    });

    this.totalSaidas = this.saidasFiltradas.reduce((sum, s) => sum + s.quantidade, 0);
    this.cdr.detectChanges(); 
  }

  gerarRelatorioPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Saídas de Kits', 14, 20);

    const head = [['Nome do Kit', 'Quantidade', 'Data', 'Município']];
    const body = this.saidasFiltradas.map(s => [
      s.nomeKit,
      s.quantidade.toString(),
      new Date(s.createdAt).toLocaleDateString('pt-BR'),
      s.municipio
    ]);

    autoTable(doc, { head, body, startY: 30 });
    doc.save('relatorio_saidas.pdf');
  }
}