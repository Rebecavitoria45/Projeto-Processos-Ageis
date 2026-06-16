import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  role: string | null = null;
  menuItems: { label: string; route: string }[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.role = this.authService.getUserRole();
    this.setMenuByRole();
  }

  goHome() {
    const role = this.role;
  
    if (role === 'admin') {
      this.router.navigate(['/homepage']);
    } else if (role === 'usuario') {
      this.router.navigate(['/homeUser']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  setMenuByRole() {
    const roleMockada = 'admin'; 
  
    const menuPorRole: Record<string, { label: string; route: string }[]> = {
      admin: [
        { label: 'Homepage', route: '/homepage' },
        { label: 'Solicitações', route: '/solicitacoes' },
        { label: 'Estoque', route: '/estoque' },
        { label: 'Produtos', route: '/produtos' },
        { label: 'Usuários', route: '/cadastro' }
      ],
  
      usuario: [
        { label: 'Homepage', route: '/homeUser' },
        { label: 'Solicitações', route: '/solicitacaoUser' },
      ]
    };
  
    this.menuItems = menuPorRole[roleMockada] || [];
  
  }
  
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
