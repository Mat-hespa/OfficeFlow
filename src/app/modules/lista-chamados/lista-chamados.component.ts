import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-lista-chamados',
  templateUrl: './lista-chamados.component.html',
  styleUrls: ['./lista-chamados.component.scss']
})
export class ListaChamadosComponent implements OnInit {
  chamados: any[] = [];
  filteredChamados: any[] = [];
  selectedChamado: any = null;
  novoComentario: string = '';
  userRole: string | null;
  userEmail: string | null;
  loading: boolean = false; // Estado de carregamento
  selectedStatus: string = ''; // Status selecionado para o filtro

  constructor(private http: HttpClient, private router: Router, private toast: NgToastService) {
    this.userRole = sessionStorage.getItem('userRole');
    this.userEmail = sessionStorage.getItem('userEmail');
  }

  ngOnInit(): void {
    this.getChamados();
  }

  getChamados() {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/api/chamados`, {
      params: { userRole: this.userRole ?? '', userEmail: this.userEmail ?? '' }
    }).subscribe(
      (data: any) => {
        this.chamados = data;
        this.filteredChamados = data;
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao buscar chamados:', error);
        this.loading = false;
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao buscar chamados.' });
      }
    );
  }

  filterChamados(status: string) {
    this.selectedStatus = status;
    if (status) {
      this.filteredChamados = this.chamados.filter(chamado => chamado.status === status);
    } else {
      this.filteredChamados = this.chamados;
    }
  }

  abrirModal(chamado: any) {
    this.selectedChamado = { ...chamado }; // Clonando o objeto chamado
    this.novoComentario = '';
  }

  closeModal() {
    this.selectedChamado = null;
    this.novoComentario = '';
  }

  getEmailUsuarioLogado(): string {
    return sessionStorage.getItem('userEmail') || 'Usuário Desconhecido'; // Retorna um valor padrão se não encontrar
  }

  atualizarChamado() {
    if (this.novoComentario && this.selectedChamado) {
      const novoHistorico = {
        status: this.selectedChamado.status,
        updatedAt: new Date(),
        updatedBy: this.getEmailUsuarioLogado(), // Captura o email do usuário logado
        comment: this.novoComentario
      };

      // Adiciona o novo comentário ao histórico
      this.selectedChamado.history.push(novoHistorico);

      // Faz a requisição PUT para atualizar o chamado no backend
      this.http.put(`${environment.apiUrl}/api/chamados/${this.selectedChamado._id}`, {
        status: this.selectedChamado.status,
        comment: this.novoComentario,
        updatedBy: this.getEmailUsuarioLogado(), // Envia o usuário logado
        userRole: this.userRole // Envia o userRole
      }).subscribe(
        (response) => {
          console.log('Chamado atualizado com sucesso', response);
          this.toast.success({ detail: 'SUCCESS', summary: 'Chamado atualizado com sucesso.' });
          this.closeModal();
          this.getChamados(); // Atualiza a lista de chamados após a mudança
        },
        (error) => {
          console.error('Erro ao atualizar o chamado:', error);
          this.toast.error({ detail: 'ERROR', summary: 'Erro ao atualizar o chamado.' });
        }
      );
    }
  }
}