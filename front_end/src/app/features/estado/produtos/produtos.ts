import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KitService } from '../../../Service/kitproduto.service';
import { ProdutoService } from '../../../Service/produto.service';
import { ModalKitComponent } from './modais/modal-kit-criar/modal-kit-criar.component';
import { ModalKitDetalhesComponent } from './modais/modal-kit-detalhe/modal-kit-detalhe.component';
import { PublicLayoutComponent } from "../../../components/public-layout/public-layout.component";
import { FiltroPipe } from './pipes/filtro.pipe';



@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalKitComponent, ModalKitDetalhesComponent, PublicLayoutComponent],
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.css']
})
export class ProdutosComponent implements OnInit {

  kits: any[] = [];
  produtos: any[] = [];

  filtro: string = '';

  showModalKit = false;
  modalDetalhesData: any = null;

  constructor(
    private kitService: KitService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit() {
    this.carregarKits();
    this.carregarProdutos();
  }

  carregarKits() {
    this.kitService.listar().subscribe({
      next: (res) => this.kits = res,
      error: (err) => console.error(err)
    });
  }carregarProdutos() {
    this.produtos = [];  
    this.produtoService.listarProdutos().subscribe({
      next: (res) => {
        this.produtos = res.map((p: any) => ({
          nome: p.nome || p.Produto?.nome,
          produto_id: p.produto_id || p.Produto?.produto_id,
          quantidade: p.quantidade,
          data_validade: p.data_validade || p.Produto?.data_validade,
          origem: p.origem || p.Produto?.origem 
        }));
      },
      error: (err) => console.error(err)
    });
  }
  
  
  abrirModalKit() {
    this.showModalKit = true;
  }

  abrirModalDetalhes(kit: any) {
    this.modalDetalhesData = kit;
  }

  fecharModalKit(atualizar = false) {
    this.showModalKit = false;
    if (atualizar) {
      this.carregarKits();
      this.carregarProdutos();
    }
  }
  fecharModalDetalhes(atualizar: boolean = false) {
    this.modalDetalhesData = null;
    if (atualizar) {
      this.carregarKits();
      this.carregarProdutos();
    }
  }
  
  
}
