import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators"; 

@Injectable({ providedIn: 'root' })
export class KitService {
  private apiUrl = 'http://localhost:3000/api/kits';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('TOKEN USADO NO KIT SERVICE:', token);
  
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`, {
      headers: this.getHeaders(),
      observe: 'response'
    }).pipe(
      map((resp: any) => {
        console.log('RESPOSTA LISTAR KITS:', resp.status, resp.body);
  
        if (resp.status === 204) return [];
        return resp.body || [];
      })
    );
  }
  criarKit(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastro`, dados, {
      headers: this.getHeaders()
    });
  }

  atualizar(id: number, dados: any) {
    return this.http.put(`${this.apiUrl}/${id}`, dados, {
      headers: this.getHeaders()
    });
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  listarProdutosDoKit(kitId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${kitId}/produtos`, {
      headers: this.getHeaders()
    });
  }
}
