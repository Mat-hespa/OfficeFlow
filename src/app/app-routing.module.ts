import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { CadastroEmpresaComponent } from './cadastro-empresa/cadastro-empresa.component';
import { CadastroSetorComponent } from './cadastro-setor/cadastro-setor.component';
import { CadastroPessoaComponent } from './cadastro-pessoa/cadastro-pessoa.component';
import { ListaComponent } from './lista/lista.component';
import { PerfilComponent } from './perfil/perfil.component';
import { EditUsuarioComponent } from './edit-usuario/edit-usuario.component';
import { AuthGuard } from 'src/auth/auth.guard';
import { EditSetorComponent } from './edit-setor/edit-setor.component';
import { SetorTreeComponent } from './setor-tree/setor-tree.component';
import { CadastroDocumentoComponent } from './cadastro-documento/cadastro-documento.component';
import { RecadosDocumentosComponent } from './recados-documentos/recados-documentos.component';
import { RecadosComponent } from './cadastro-recados/cadastro-recados.component';
import { RecadosRecadosComponent } from './recados-recados/recados-recados.component';
import { InboxComponent } from './inbox/inbox.component';

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
  { path: 'cadastroDocumento', component: CadastroDocumentoComponent},
  { path: 'recados-documentos', component: RecadosDocumentosComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: false }},
  { path: 'cadastroRecados', component: RecadosComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: false }},
  { path: 'recados', component: RecadosRecadosComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: false }},
  { path: 'inbox', component: InboxComponent, canActivate: [AuthGuard], data: { requiresLogin: true, requiresAdmin: false }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
