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
import { forkJoin, map } from 'rxjs';
import '@angular/common/locales/global/pt';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, PublicLayoutComponent],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css']
})
export class HomepageComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }


}