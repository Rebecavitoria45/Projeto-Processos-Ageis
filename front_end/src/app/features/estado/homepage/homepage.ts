import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicLayoutComponent } from '../../../components/public-layout/public-layout.component';
import * as L from 'leaflet';
import { FeatureCollection } from 'geojson';
import municipiosPE from './assets/geojs-26-mun.json';
import Chart from 'chart.js/auto';
import { UsuarioService } from '../../../Service/usuario.service';
import { SolicitacaoService } from '../../../Service/solicitacao';
import { KitService } from '../../../Service/kitproduto.service';
import { HttpClient } from '@angular/common/http';
import '@angular/common/locales/global/pt';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, PublicLayoutComponent],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css']
})
export class HomepageComponent implements AfterViewInit {

  private map!: L.Map;
  cadastrados: string[] = [];
  totalKitsDoacao: number = 0;

  estoqueDisponivelTotal = 0;
  estoqueUltimos30Dias: number[] = [];
  
  solicitacoesLabels: string[] = [];
  solicitacoesData: number[] = []; 

  doacoesRecebidas: number = 0;
  solicitacoesPendentes: number = 0;
  solicitacoesAtendidas: number = 0;
  totalSolicitacoes: number = 0;
  doacoesUltimos30Dias: number[] = [];
  labelsDias: string[] = [];
  totalKits = 0;
  kitsDisponiveis: any[] = [];
  dataAtual: Date = new Date();

  private ultimaContagem: { [key: string]: number } = {};

  constructor(
    private usuarioService: UsuarioService,
    private solicitacaoService: SolicitacaoService,
    private kitService: KitService,
    private http: HttpClient
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inicializarMapa();
      this.carregarDados();
    }, 350);
  }
  
  carregarDados() {
    this.carregarUsuarios();
    this.carregarKits();
    this.carregarSolicitacoes();
    this.carregarDoacoes();
  }

  normalizarTexto(txt: string): string {
    if (!txt) return '';
    return txt.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  inicializarMapa() {
    if (this.map) return;

    this.map = L.map('map').setView([-8.38, -37.99], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    
    setTimeout(() => {
      this.map.invalidateSize();
      if (Object.keys(this.ultimaContagem).length > 0) {
        this.atualizarMapa(this.ultimaContagem);
      }
    }, 200);
  }

  carregarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => {
        console.log('Usuários recebidos do Back-end:', usuarios);

        const contagemPorMunicipio: { [key: string]: number } = {};

        usuarios
          .filter(u => u.role !== 'admin' && u.municipio)
          .forEach(u => {
            const chaveNormalizada = this.normalizarTexto(u.municipio);
            contagemPorMunicipio[chaveNormalizada] = (contagemPorMunicipio[chaveNormalizada] || 0) + 1;
          });

        this.cadastrados = Object.keys(contagemPorMunicipio);
        this.ultimaContagem = contagemPorMunicipio;
        console.log('Objeto de contagem normalizado:', contagemPorMunicipio);

        if (this.map) {
          this.atualizarMapa(contagemPorMunicipio);
        }
      },
      error: (err) => console.error('Erro ao buscar usuários:', err)
    });
  }

  atualizarMapa(contagem: { [key: string]: number } = {}) {
    if (!this.map) return;

    this.map.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON || layer instanceof L.CircleMarker) {
        this.map.removeLayer(layer);
      }
    });

    const coordenadasCidades: { [key: string]: [number, number] } = {
      'recife': [-8.0476, -34.8778],
      'olinda': [-8.0089, -34.8553],
      'jaboatao dos guararapes': [-8.1132, -34.9213],
      'caruaru': [-8.2833, -35.9761],
      'garanhuns': [-8.8906, -36.4928],
      'petrolina': [-9.3881, -40.5031],
      'vitoria de santo antao': [-8.1192, -35.2928],
      'paulista': [-7.9408, -34.8753],
      'cabo de santo agostinho': [-8.2872, -35.0322]
    };

    Object.keys(contagem).forEach(cidadeNormalizada => {
      const qtdUsuarios = contagem[cidadeNormalizada];
      const coords = coordenadasCidades[cidadeNormalizada];

      if (coords && qtdUsuarios > 0) {
        const nomeCidade = cidadeNormalizada.charAt(0).toUpperCase() + cidadeNormalizada.slice(1);
        
        const raioDinamico = Math.min(Math.max(qtdUsuarios * 8, 12), 60);

        const circulo = L.circleMarker(coords, {
          radius: raioDinamico,
          fillColor: '#44dd44', 
          color: '#1a7f1a',     
          weight: 2,
          opacity: 1,
          fillOpacity: 0.75
        }).addTo(this.map);

        const popupContent = `
          <div style="font-family: sans-serif; text-align: center; padding: 4px;">
            <strong style="font-size: 14px; color: #2c3e50;">${nomeCidade}</strong><br/>
            <span style="font-size: 13px; color: #27ae60; font-weight: bold;">
              ${qtdUsuarios} ${qtdUsuarios === 1 ? 'usuário' : 'usuários'}
            </span>
          </div>
        `;

        circulo.bindTooltip(popupContent, {
          sticky: true,
          direction: 'top'
        });
      }
    });

    this.map.invalidateSize();
  }

  carregarDoacoes() {
    this.kitService.listar().subscribe({
      next: (kits) => {
        const kitsDoacao = kits.filter(k =>
          (k.origem || "").toLowerCase().trim() === "doacao"
        );
  
        this.doacoesRecebidas = kitsDoacao.reduce(
          (total, k) => total + Number(k.quantidade_kit || 0), 0
        );
  
        this.totalKitsDoacao = kitsDoacao.length;
  
        const labels = this.geraLabelsUltimos30Dias();
        const historico: { [key: string]: number } = {};
  
        labels.forEach(label => historico[label] = 0);
  
        kitsDoacao.forEach(k => {
          if (!k.data_entrada) return;
  
          const data = new Date(k.data_entrada).toLocaleDateString('pt-BR', {
            timeZone: 'America/Recife',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          });
  
          const qtd = Number(k.quantidade_kit || 0);
  
          if (historico.hasOwnProperty(data)) {
            historico[data] += qtd;
          }
        });
  
        this.labelsDias = labels;
        this.doacoesUltimos30Dias = Object.values(historico);
  
        setTimeout(() => this.criarGraficoDoacoes(), 200);
      },
      error: () => console.error("Erro ao carregar doações")
    });
  }

  carregarSolicitacoes() {
    this.solicitacaoService.listarSolicitacoes().subscribe({
        next: (solicitacoes) => {
            const totalDocs = solicitacoes.length; 
            
            this.solicitacoesLabels = ['Total']; 
            this.solicitacoesData = [totalDocs]; 
            this.totalSolicitacoes = totalDocs;
            this.solicitacoesPendentes = solicitacoes.filter(s =>
              (s.status || '').toLowerCase().trim() === 'pendente'
            ).length;
            this.solicitacoesAtendidas = solicitacoes.filter(s => {
              const status = (s.status || '').toLowerCase().trim();
              return status === 'aprovado' || status === 'reprovado';
        }).length;

            setTimeout(() => this.criarGraficoSolicitacoes(), 200);
        },
        error: err => console.error('Erro ao carregar solicitações:', err)
    });
  }

  carregarKits() {
    this.kitService.listar().subscribe({
      next: (kits) => {
        this.totalKits = kits.length;
        this.estoqueDisponivelTotal = kits.reduce(
          (sum, k) => sum + Number(k.quantidade_kit || 0), 0
        );
  
        const historico: { [key: string]: number } = {};
        const labels = this.geraLabelsUltimos30Dias();
  
        labels.forEach(label => historico[label] = 0);
  
        kits.forEach(k => {
          if (!k.data_entrada) return;
  
          const data = new Date(k.data_entrada).toLocaleDateString('pt-BR', {
            timeZone: 'America/Recife',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          });
          
          const qtd = Number(k.quantidade_kit || 0);
  
          if (historico.hasOwnProperty(data)) {
            historico[data] += qtd;
          }
        });
  
        const valores = Object.values(historico);
        for (let i = 1; i < valores.length; i++) {
          valores[i] += valores[i - 1];
        }
  
        this.estoqueUltimos30Dias = valores;
  
        setTimeout(() => this.criarGraficoEstoque(), 200);
      },
      error: () => console.error("Erro ao carregar kits")
    });
  }

  criarGraficoEstoque() {
    const canvas = document.getElementById('graficoEstoque') as HTMLCanvasElement;
    if (!canvas) return;
  
    const chartInstance = Chart.getChart(canvas);
    if (chartInstance) chartInstance.destroy();
  
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.geraLabelsUltimos30Dias(),
        datasets: [
          {
            label: 'Evolução do Estoque (Itens)',
            data: this.estoqueUltimos30Dias,
            borderWidth: 3,
            tension: 0.4,
            borderColor: '#2980b9',  
            pointRadius: 5,
            pointBackgroundColor: '#3498db',
            fill: true,
            backgroundColor: 'rgba(52, 152, 219, 0.15)'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  
  criarGraficoSolicitacoes() {
    const canvas = document.getElementById('graficoSolicitacoes') as HTMLCanvasElement;
    if (!canvas) return;

    const chartInstance = Chart.getChart(canvas);
    if (chartInstance) chartInstance.destroy();

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Pendentes', 'Atendidas'],
        datasets: [{
          label: 'Solicitações',
          data: [this.solicitacoesPendentes, this.solicitacoesAtendidas],
          backgroundColor: ['#e74c3c', '#2ecc71']
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  criarGraficoDoacoes() {
    const ctx2 = document.getElementById('graficoDoacoes') as HTMLCanvasElement;
    if (!ctx2) return;

    const chartInstance = Chart.getChart(ctx2);
    if (chartInstance) chartInstance.destroy();

    new Chart(ctx2, {
      type: 'line',
      data: {
        labels: this.labelsDias,
        datasets: [{
          label: 'Doações (Itens por Dia)',
          data: this.doacoesUltimos30Dias,
          borderWidth: 3,
          tension: 0.4,
          borderColor: '#27ae60',   
          pointRadius: 5,
          pointBackgroundColor: '#2ecc71',
          fill: true,
          backgroundColor: 'rgba(46, 204, 113, 0.2)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  geraLabelsUltimos30Dias(): string[] {
    const labels = [];
    const hoje = new Date();
    for (let i = 29; i >= 0; i--) {
      const dia = new Date();
      dia.setDate(hoje.getDate() - i);
      labels.push(dia.toLocaleString('pt-BR', {
        timeZone: 'America/Recife',
        day: '2-digit',
        month: 'long',  
        year: 'numeric',
      }));
    }
    return labels;
  }
}