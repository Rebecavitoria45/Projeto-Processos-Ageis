import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KitService } from '../../../../../Service/kitproduto.service';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-modal-kit-detalhes',
  standalone: true,
  imports: [CommonModule, FormsModule,A11yModule],
  templateUrl: './modal-kit-detalhe.component.html',
  styleUrls: ['./modal-kit-detalhe.component.css']
})
export class ModalKitDetalhesComponent {

  @Input() kit: any;
  @Output() fechar = new EventEmitter<boolean>();

  produtosKit: any[] = [];

  constructor(private kitService: KitService) {}

  ngOnInit() {
    if (this.kit) this.carregarProdutosDoKit();
  }


  carregarProdutosDoKit() {
    this.kitService.listarProdutosDoKit(this.kit.kit_id).subscribe({
      next: (produtos: any[]) => {
        // Mapear produtos do back para incluir a origem
        this.produtosKit = produtos.map(p => ({
          nome_produto: p.nome_produto || p.Produto.nome,
          quantidade: p.quantidade,
          data_validade: p.data_validade || p.Produto.data_validade,         
          origem: p.origem || this.kit.origem 
        }));
      },
      error: () => {
        console.error("Erro ao carregar produtos do kit");
        this.produtosKit = [];
      }
    });
  }
  
  adicionarProduto() {
    this.produtosKit.push({
      nome_produto: '',
      quantidade: 1,
      data_validade: '',
      origem: this.kit.origem 
    });
  }
  
  salvar() {
    const payload = {
      tipo_kit: this.kit.tipo_kit,
      quantidade_kit: this.kit.quantidade_kit,
      origem: this.kit.origem,
      produtos: this.produtosKit.map(p => ({
        nome_produto: p.nome_produto,
        quantidade: Number(p.quantidade),
        data_validade: p.data_validade,
        origem: p.origem
      }))
    };
  
    this.kitService.atualizar(this.kit.kit_id, payload).subscribe({
      next: () => {
        alert("Kit atualizado com sucesso!");
        this.fechar.emit(true);
      },
      error: (err) => alert("Erro: " + (err.error?.mensagem || "Erro desconhecido"))
    });
  }
  
  
  
  deletar() {
    if (!confirm("Tem certeza que deseja deletar este kit?")) return;

    this.kitService.deletar(this.kit.kit_id).subscribe({
      next: () => {
        alert("Kit deletado com sucesso!");
        this.fechar.emit(true); 
      },
      error: () => alert("Erro ao deletar kit")
    });
  }

  removerProduto(i: number) {
    if (this.produtosKit.length > 1) {
      this.produtosKit.splice(i, 1);
    } else {
      alert('O kit precisa ter pelo menos um produto.');
    }
  }
  

  fecharModal() {
    this.fechar.emit(false);
  }
}
