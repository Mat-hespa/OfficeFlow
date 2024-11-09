import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { RegisterComponent } from './modules/register/register.component';
import { CadastroEmpresaComponent } from './modules/cadastro-empresa/cadastro-empresa.component';
import { CadastroSetorComponent } from './modules/cadastro-setor/cadastro-setor.component';
import { CadastroPessoaComponent } from './modules/cadastro-pessoa/cadastro-pessoa.component';
import { ListaComponent } from './modules/lista/lista.component';
import { PerfilComponent } from './modules/perfil/perfil.component';
import { EditUsuarioComponent } from './modules/edit-usuario/edit-usuario.component';
import { AuthGuard } from 'src/auth/auth.guard';
import { EditSetorComponent } from './modules/edit-setor/edit-setor.component';
import { SetorTreeComponent } from './modules/setor-tree/setor-tree.component';
import { CadastroDocumentoComponent } from './modules/cadastro-documento/cadastro-documento.component';
import { RecadosComponent } from './modules/cadastro-recados/cadastro-recados.component';
import { InboxComponent } from './modules/inbox/inbox.component';
import { CadastroChamadoComponent } from './modules/cadastro-chamado/cadastro-chamado.component';
import { ListaChamadosComponent } from './modules/lista-chamados/lista-chamados.component';
import { DetalheChamadoComponent } from './modules/detalhe-chamado/detalhe-chamado.component';

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
  { path: 'cadastroDocumento', component: CadastroDocumentoComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: false }},
  { path: 'cadastroRecados', component: RecadosComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: false }},
  { path: 'inbox', component: InboxComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: false }},
  { path: 'chamadoTI', component: CadastroChamadoComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: false }},
  { path: 'listaChamados', component: ListaChamadosComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: false }},
  { path: 'detalhe-chamado/:id', component: DetalheChamadoComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: false }},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
