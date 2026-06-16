import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SaidaService {

  private apiUrl = 'http://localhost:3000/api/saidas'; // 
  constructor(private http: HttpClient) {}

  listarSaidas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  listarSaidasPorSolicitacao(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}`);
  }
}
