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
  
    if (role === 'admin' || role === 'estadual') {
      this.router.navigate(['/homepage']);
    } else if (role === 'municipal') {
      this.router.navigate(['/homemunicipio']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  setMenuByRole() {
    const menuPorRole: Record<string, { label: string; route: string }[]> = {
      admin: [
        { label: 'Homepage', route: '/homepage' },
        { label: 'Solicitações', route: '/solicitacoes' },
        { label: 'Estoque', route: '/estoque' },
        { label: 'Produtos', route: '/produtos' },
        { label: 'Usuários', route: '/cadastro' }
      ],
  
      estadual: [
        { label: 'Homepage', route: '/homepage' },
        { label: 'Solicitações', route: '/solicitacoes' },
        { label: 'Estoque', route: '/estoque' },
        { label: 'Produtos', route: '/produtos' },
      ],
  
      municipal: [
        { label: 'Homepage', route: '/homemunicipio' },
        { label: 'Solicitações', route: '/solicitacaomunicipio' },
      ]
    };
  
    this.menuItems = menuPorRole[this.role || ''] || [];
  }
  
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
