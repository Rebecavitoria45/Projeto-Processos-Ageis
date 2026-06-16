import { Component, OnInit } from '@angular/core';
import { PublicLayoutComponent } from '../../../components/public-layout/public-layout.component';
// import { GraficoComponent } from "../../../components/grafico.component/grafico.component";
import { RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../Service/solicitacao';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage-user',
  standalone: true,
  imports: [PublicLayoutComponent, RouterModule, CommonModule],
  templateUrl: './homepage-user.html',
  styleUrls: ['./homepage-user.css']
})
export class HomepageUser implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

 
}
