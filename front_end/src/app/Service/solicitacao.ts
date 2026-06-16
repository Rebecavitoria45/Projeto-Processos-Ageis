import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Saida {
  nomeKit: string;
  quantidade: number;
  createdAt: string;
  municipio: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token') || '';

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getEstoquePorOrigem(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/kits/estoque-por-origem`);
  }
  
  criarSolicitacao(data: any): Observable<any> {
    console.log("Headers enviados:", this.getHeaders());
    return this.http.post(
      `${this.apiUrl}/solicitacoes/cadastro`,
      data,
      this.getHeaders()
    );
  }

  listarKits(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/kits', this.getHeaders());
  }
  listarSaidas(): Observable<Saida[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/kitsaidas`,
      this.getHeaders()
    ).pipe(
      map(saidas => {
        console.log("Saídas recebidas do backend:", saidas); // DEBUG
  
        return saidas.map(s => ({
          nomeKit:
            s.kit_nome || 
            s.nome_kit ||
            s.tipo_kit ||
            s.kits?.tipo_kit ||
            s.kit?.tipo_kit ||
            'Não informado',
  
          quantidade:
            s.quantidade_atendida ||
            s.quantidade_solicitada ||
            s.quantidade ||
            0,
  
          createdAt:
            s.data_saida ||
            s.data_solicitacao ||
            s.createdAt ||
            new Date().toISOString(),
  
          municipio:
            s.municipio_nome ||
            s.nome_municipio ||
            s.municipio ||
            s.municipios?.nome ||
            s.municipio?.nome ||
            'Não informado'
        }));
      })
    );
  }
  

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/usuarios`,
      this.getHeaders()
    );
  }
  listarMunicipios(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/municipios`,
    this.getHeaders()
  );
}


  listarSolicitacoes(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/solicitacoes/listar`,
      this.getHeaders()
    );
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/solicitacoes/${id}`,
      this.getHeaders()
    );
  }
  buscarUsuarioPorId(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/usuarios/${id}`,
      this.getHeaders()
    );
  }
  
  listarSolicitacoesDoUsuario(id: number): Observable<any> {
    return this.http.get<any[]>(
      `${this.apiUrl}/solicitacoes/usuario/${id}`,
      this.getHeaders()
    ).pipe(
      map(solicitacoes => {
        return solicitacoes.map(s => ({
          ...s,
          pdf: s.status === 'aprovado' ? `/pdfs/solicitacao_${s.id}.pdf` : null
        }));
      })
    );
  }

  atualizarSolicitacao(id: number, body: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/solicitacoes/${id}`,
      body,
      this.getHeaders()
    );
  }
}
