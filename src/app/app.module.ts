import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { LoginComponent } from './modules/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { NgToastModule } from 'ng-angular-popup';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './modules/register/register.component';
import { HeaderComponent } from './modules/header/header.component';
import { CadastroEmpresaComponent } from './modules/cadastro-empresa/cadastro-empresa.component';
import { CadastroSetorComponent } from './modules/cadastro-setor/cadastro-setor.component';
import { CadastroPessoaComponent } from './modules/cadastro-pessoa/cadastro-pessoa.component';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ListaComponent } from './modules/lista/lista.component';
import { PerfilComponent } from './modules/perfil/perfil.component';
import { EditUsuarioComponent } from './modules/edit-usuario/edit-usuario.component';
import { NumericOnlyDirective } from './directives/numeric-only.directive';
import { EditSetorComponent } from './modules/edit-setor/edit-setor.component';
import { SetorTreeComponent } from './modules/setor-tree/setor-tree.component';
import { CadastroDocumentoComponent } from './modules/cadastro-documento/cadastro-documento.component';
import { RecadosComponent } from './modules/cadastro-recados/cadastro-recados.component';
import { InboxComponent } from './modules/inbox/inbox.component';
import { HistoryComponent } from './modules/history/history.component';
import { CadastroChamadoComponent } from './modules/cadastro-chamado/cadastro-chamado.component';
import { ListaChamadosComponent } from './modules/lista-chamados/lista-chamados.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    CadastroEmpresaComponent,
    CadastroSetorComponent,
    CadastroPessoaComponent,
    ListaComponent,
    PerfilComponent,
    EditUsuarioComponent,
    NumericOnlyDirective,
    EditSetorComponent,
    SetorTreeComponent,
    CadastroDocumentoComponent,
    RecadosComponent,
    InboxComponent,
    HistoryComponent,
    CadastroChamadoComponent,
    ListaChamadosComponent,
  ],
  imports: [
    BrowserModule,
    ModalModule.forRoot(), // Importe o ModalModule aqui
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgToastModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    NgbModule
  ],
  providers: [BsDatepickerConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
