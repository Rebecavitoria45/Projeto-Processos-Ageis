import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios'; 

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }


  listarUsuariosComLocalizacao(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/localizacao`, {
      headers: this.getHeaders()
    });
  }
  
  cadastrarUsuario(dados: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/cadastrar`, dados, { headers });
  }
  

  atualizarUsuario(id: number, dados: any): Observable<any> {
    console.log('Chamou salvarOuAtualizar com dados:', dados);
    return this.http.put(`${this.apiUrl}/${id}`, dados, { headers: this.getHeaders() });
  }
  
  
  deletarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  
definirSenha(token: string, senha: string) {
  return this.http.post(`${this.apiUrl}/definir-senha`, { token, senha });
}
solicitarRedefinicaoSenha(email: string) {
  return this.http.post(`${this.apiUrl}/esqueci-senha`, { email });
}

}
