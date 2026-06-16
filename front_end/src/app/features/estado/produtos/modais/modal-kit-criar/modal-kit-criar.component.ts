import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KitService } from '../../../../../Service/kitproduto.service';

interface ProdutoItem {
  nome_produto: string;
  quantidade: number;
  data_validade: string;
}

@Component({
  selector: 'app-modal-kit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-kit-criar.component.html',
  styleUrls: ['./modal-kit-criar.component.css']
})
export class ModalKitComponent implements OnInit {

  @Output() close = new EventEmitter<boolean>();

  tipo_kit: string = '';
  quantidade_kit: number = 1;
  origemKit: string = 'Compra'; 
  tiposKit = [
    { label: 'Kit Higiene', value: 'kit_higiene' },
    { label: 'Kit Alimentação', value: 'kit_alimentacao' }
  ];

  origemProdutos = [
    { label: 'Compra', value: 'Compra' },
    { label: 'Doação', value: 'Doação' }
  ];

  produtos: ProdutoItem[] = [
    { nome_produto: '', quantidade: 1, data_validade: '' }
  ];

  loading = false;

  constructor(private kitService: KitService) {}

  ngOnInit(): void {}

  adicionarProduto() {
    this.produtos.push({ nome_produto: '', quantidade: 1, data_validade: '' });
  }

  removerProduto(index: number) {
    if (this.produtos.length > 1) { 
      this.produtos.splice(index, 1);
    }
  }

  salvar() {
    if (!this.tipo_kit) return alert('Selecione o tipo de kit.');
    if (!this.origemKit) return alert('Selecione a origem do kit.');

    for (let p of this.produtos) {
      if (!p.nome_produto || p.quantidade <= 0 || !p.data_validade) {
        return alert('Preencha corretamente todos os produtos.');
      }
    }

    const origemMap: Record<string, string> = {
      'Compra': 'compra',
      'Doação': 'doacao'
    };

    const payload = {
      tipo_kit: this.tipo_kit,
      quantidade_kit: Math.max(1, Number(this.quantidade_kit)),
      origem: origemMap[this.origemKit] || 'compra',
      produtos: this.produtos.map(p => ({
        nome_produto: p.nome_produto.trim(),
        quantidade: Number(p.quantidade),
        data_validade: p.data_validade
      }))
    };

    this.loading = true;

    this.kitService.criarKit(payload).subscribe({
      next: () => {
        alert('Kit cadastrado com sucesso!');
        this.loading = false;
        this.close.emit(true);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao salvar kit: ' + (err.error?.mensagem || 'Erro desconhecido'));
        this.loading = false;
      }
    });
  }

  fechar() {
    this.close.emit(false);
  }
}