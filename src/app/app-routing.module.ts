import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ChamadosComponent } from './chamados/chamados.component';
import { CadastroEmpresaComponent } from './cadastro-empresa/cadastro-empresa.component';
import { CadastroSetorComponent } from './cadastro-setor/cadastro-setor.component';
import { CadastroPessoaComponent } from './cadastro-pessoa/cadastro-pessoa.component';
import { ListaComponent } from './lista/lista.component';
import { PerfilComponent } from './perfil/perfil.component';
import { EditUsuarioComponent } from './edit-usuario/edit-usuario.component';
import { AuthGuard } from 'src/auth/auth.guard';
import { EditSetorComponent } from './edit-setor/edit-setor.component';
import { SetorTreeComponent } from './setor-tree/setor-tree.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { requiresLogin: true }},
  { path: 'cadastroEmpresa', component: CadastroEmpresaComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: true }},
  { path: 'cadastroSetor', component: CadastroSetorComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: true }},
  { path: 'cadastroPessoa', component: CadastroPessoaComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: true }},
  { path: 'lista', component: ListaComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: true }},
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: false }},
  { path: 'editUser', component: EditUsuarioComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: true }},
  { path: 'editSetor', component: EditSetorComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: true }},
  { path: 'setorTree', component: SetorTreeComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
