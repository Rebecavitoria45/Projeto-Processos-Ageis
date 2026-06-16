import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private apiUrl = 'http://localhost:3000/api/produtos';
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  listarProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`, { headers: this.getHeaders() });
  }


  atualizarProduto(id: number, dados: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/atualizar/${id}`, dados, { headers: this.getHeaders() });
  }

  buscarProdutoPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscar/${id}`, { headers: this.getHeaders() });
  }

  deletarProduto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`, { headers: this.getHeaders() });
  }
}
