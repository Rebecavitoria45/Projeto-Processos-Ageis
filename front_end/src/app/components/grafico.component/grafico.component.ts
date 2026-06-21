import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [CommonModule],
  template: `
   <div class="grafico-container">
  <canvas #chartCanvas></canvas>
</div>

  `,
  styles: [`
.grafico-container {
  box-sizing: border-box;            
  display: flex;
  flex-direction: column;
  align-items: stretch;              
  gap: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  width: 100%;                      
  margin-bottom: 4.5rem;

  overflow: hidden;                  
}

.grafico-container canvas {
  display: block;                    
  width: 100% !important;            
  max-width: 100% !important;        
  height: 420px !important;        
  box-sizing: border-box;
}




@media (max-width: 900px) {
  .grafico-container canvas {
    height: 300px !important;
  }


    }
  `]
})
export class GraficoComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() graficoData: number[] = [0, 0, 0, 0]; // [Totais, Aprovadas, Reprovadas, Pendentes]

  private chart: Chart<'bar'> | null = null;

  ngAfterViewInit() {
    this.inicializarGrafico();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['graficoData'] && this.chart) {
      this.chart.data.datasets[0].data = this.graficoData;
      this.chart.update();
    }
  }

  private inicializarGrafico() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Totais', 'Aprovadas', 'Reprovadas', 'Pendentes'],
        datasets: [{
          label: 'Solicitações',
          data: this.graficoData,
          backgroundColor: ['#42A5F5', '#66BB6A', '#EF5350', '#ffd344'],
          borderRadius: 10,
          borderSkipped: false,
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#000',
            font: { size: 14, weight: 'bold' }
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Distribuição de Solicitações',
            color: '#1f1f1f',
            font: { size: 18, weight: 'bold' },
            padding: { top: 10, bottom: 20 }
          },
          datalabels: {
            display: true
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 14 } }
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: '#eeeeee' }
          }
        }
      },
      plugins: [ChartDataLabels]
    };

    this.chart = new Chart(ctx, config);
  }
}
