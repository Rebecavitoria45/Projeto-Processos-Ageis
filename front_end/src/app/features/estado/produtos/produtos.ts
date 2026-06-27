import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KitService } from '../../../Service/kitproduto.service';
import { ProdutoService } from '../../../Service/produto.service';
import { ModalKitComponent } from './modais/modal-kit-criar/modal-kit-criar.component';
import { ModalKitDetalhesComponent } from './modais/modal-kit-detalhe/modal-kit-detalhe.component';
import { PublicLayoutComponent } from "../../../components/public-layout/public-layout.component";
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalKitComponent, ModalKitDetalhesComponent, PublicLayoutComponent],
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.css']
})
export class ProdutosComponent implements OnInit, OnDestroy, AfterViewInit { // 

  kits: any[] = [];
  produtos: any[] = [];
  filtro: string = '';

  showModalKit = false;
  modalDetalhesData: any = null;
  private routerSub!: Subscription;

  constructor(
    private kitService: KitService,
    private produtoService: ProdutoService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}
  
  ngOnInit() {
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.carregarTudo();
      });
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.carregarTudo();
    }, 200);
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }
  
  carregarTudo() {
    this.carregarKits();
    this.carregarProdutos();
  }
  
  carregarKits() {
    this.kitService.listar().subscribe({
      next: (res) => {
        console.log('KITS VINDOS DO BACKEND:', res);
        this.kits = res;
        
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Erro ao carregar kits:', err);
        this.cdr.detectChanges();
      }
    });
  }

  carregarProdutos() {
    this.produtoService.listarProdutos().subscribe({
      next: (res) => {
        if (!res) {
          this.cdr.detectChanges();
          return;
        }
        
        const mapeado = res.map((p: any) => ({
          nome: p.nome || p.Produto?.nome || '—',
          produto_id: p.produto_id || p.id || p.Produto?.produto_id,
          quantidade: p.quantidade ?? 0,
          data_validade: p.data_validade || p.Produto?.data_validade,
          origem: p.origem || p.Produto?.origem || '—'
        }));
  
        this.produtos = [...mapeado];

        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.cdr.detectChanges();
      }
    });
  }
  
  abrirModalKit() {
    this.showModalKit = true;
  }

  abrirModalDetalhes(kit: any) {
    this.modalDetalhesData = kit;
  }

  fecharModalKit(atualizar?: boolean) {
    this.showModalKit = false;
  
    if (atualizar) {
      this.carregarTudo();
    }
  }

  fecharModalDetalhes(atualizar: boolean = false) {
    this.modalDetalhesData = null;
    if (atualizar) {
      this.carregarTudo();
    }
  }
}