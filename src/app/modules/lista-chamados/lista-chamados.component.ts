import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-chamados',
  templateUrl: './lista-chamados.component.html',
  styleUrls: ['./lista-chamados.component.scss']
})
export class ListaChamadosComponent implements OnInit {
  chamados: any[] = [];
  chamadosAbertos: any[] = [];
  chamadosEmProcesso: any[] = [];
  chamadosFinalizados: any[] = [];
  selectedChamado: any = null;
  novoComentario: string = '';
  userRole: string | null;
  userEmail: string | null;

  constructor(private http: HttpClient) {
    this.userRole = sessionStorage.getItem('userRole');
    this.userEmail = sessionStorage.getItem('userEmail');
  }

  ngOnInit(): void {
    this.getChamados();
  }

  getChamados() {
    this.http.get(`${environment.apiUrl}/api/chamados`, {
      params: { userRole: this.userRole ?? '', userEmail: this.userEmail ?? '' }
    }).subscribe(
      (data: any) => {
        this.chamados = data;
        this.filterChamados();
      },
      (error) => {
        console.error('Erro ao buscar chamados:', error);
      }
    );
  }

  filterChamados() {
    this.chamadosAbertos = this.chamados.filter(chamado => chamado.status === 'aberto');
    this.chamadosEmProcesso = this.chamados.filter(chamado => chamado.status === 'processo');
    this.chamadosFinalizados = this.chamados.filter(chamado => chamado.status === 'fechado');
  }

  abrirModal(chamado: any) {
    this.selectedChamado = { ...chamado }; // Clonando o objeto chamado
    this.novoComentario = '';
  }

  closeModal() {
    this.selectedChamado = null;
    this.novoComentario = '';
  }

  toggleHistorico(chamado: any): void {
    chamado.showHistorico = !chamado.showHistorico;
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
          this.closeModal();
          this.getChamados(); // Atualiza a lista de chamados após a mudança
        },
        (error) => {
          console.error('Erro ao atualizar o chamado:', error);
        }
      );
    }
  }
}