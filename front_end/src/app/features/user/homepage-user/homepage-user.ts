import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core'; 
import { PublicLayoutComponent } from '../../../components/public-layout/public-layout.component';
import { GraficoComponent } from "../../../components/grafico.component/grafico.component";
import { RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../Service/solicitacao';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage-municipio',
  standalone: true,
  imports: [PublicLayoutComponent, GraficoComponent, RouterModule, CommonModule],
  templateUrl: './homepage-user.html',
  styleUrls: ['./homepage-user.css']
})
export class HomepageMunicipioComponent implements AfterViewInit { 

  totalSolicitacoes = 0;
  solicitacoesAtendidas = 0;
  solicitacoesEmAberto = 0;
  solicitacoesReprovadas = 0;

  graficoData: number[] = [0, 0, 0, 0]; 

  constructor(
    private solicitacaoService: SolicitacaoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.carregarEstatisticas();
    }, 200);
  }

  carregarEstatisticas() {
    const usuarioId = Number(localStorage.getItem('user_id'));

    if (!usuarioId) {
      this.cdr.detectChanges();
      return;
    }

    this.solicitacaoService.listarSolicitacoesDoUsuario(usuarioId).subscribe({
      next: (res: any[]) => {
        this.totalSolicitacoes = res.length;
    
        this.solicitacoesAtendidas = res.filter(s =>
          s.status?.toLowerCase() === 'aprovado'
        ).length;
    
        this.solicitacoesEmAberto = res.filter(s =>
          s.status?.toLowerCase() === 'pendente'
        ).length;
    
        this.solicitacoesReprovadas = res.filter(s =>
          s.status?.toLowerCase() === 'reprovado'
        ).length;
    
        this.graficoData = [
          this.totalSolicitacoes,         // total
          this.solicitacoesAtendidas,    // aprovado
          this.solicitacoesReprovadas,   // reprovado
          this.solicitacoesEmAberto      // pendente
        ];
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar solicitações:', err);
        this.cdr.detectChanges();
      }
    });
  }
}