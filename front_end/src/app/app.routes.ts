import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login/login';
import { HomepageComponent } from './features/estado/homepage/homepage';
import { SolicitacoesComponent } from './features/estado/solicitacoes-admin/solicitacoes-admin'; 
import { EstoqueComponent } from './features/estado/estoque/estoque'; 
import { ProdutosComponent } from './features/estado/produtos/produtos';
import { CadastroComponent } from './features/estado/cadastro/cadastro';
import { DefinirSenhaComponent } from './features/login/definir-senha/definir-senha';
import { EsqueciSenhaComponent } from './features/login/esqueci-senha/esqueci-senha'; 
import { HomepageMunicipioComponent } from './features/user/homepage-user/homepage-user';
import { SolicitacoesMunicipioComponent } from './features/user/solicitacoes-user/solicitacoes-user';
import { RoleGuard } from './Service/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // Estado
  { 
    path: 'homepage', 
    component: HomepageComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'estadual'] }
  },
  { 
    path: 'solicitacoes', 
    component: SolicitacoesComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'estadual'] }
  },
  { 
    path: 'estoque', 
    component: EstoqueComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin','estadual'] }
  },
  { 
    path: 'esqueci', 
    component: EsqueciSenhaComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'estadual','municipal'] }
  },
  { 
    path: 'definir', 
    component: DefinirSenhaComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'estadual','municipal'] }
  },
  { 
    path: 'produtos', 
    component: ProdutosComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin','estadual'] }
  },
  { 
    path: 'cadastro', 
    component: CadastroComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },

  // Município
  { 
    path: 'homemunicipio', 
    component: HomepageMunicipioComponent,
    canActivate: [RoleGuard],
    data: { roles: ['municipal'] }
  },
  { 
    path: 'solicitacaomunicipio', 
    component: SolicitacoesMunicipioComponent,
    canActivate: [RoleGuard],
    data: { roles: ['municipal'] }
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
