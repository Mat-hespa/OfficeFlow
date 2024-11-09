import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-detalhe-chamado',
  templateUrl: './detalhe-chamado.component.html',
  styleUrls: ['./detalhe-chamado.component.scss']
})
export class DetalheChamadoComponent implements OnInit {
  chamado: any;
  novoComentario: string = '';
  userRole: string | null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toast: NgToastService
  ) {
    this.userRole = sessionStorage.getItem('userRole');
  }

  ngOnInit(): void {
    const chamadoId = this.route.snapshot.paramMap.get('id');
    if (chamadoId) {
      this.getChamadoDetalhes(chamadoId);
    } else {
      console.error('ID do chamado não encontrado na URL');
    }
  }

  getChamadoDetalhes(id: string) {
    this.http.get(`${environment.apiUrl}/api/chamados/unico/${id}`).subscribe(
      (data: any) => {
        this.chamado = data;
      },
      (error) => {
        console.error('Erro ao buscar detalhes do chamado:', error);
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao buscar detalhes do chamado.' });
      }
    );
  }

  getEmailUsuarioLogado(): string {
    return sessionStorage.getItem('userEmail') || 'Usuário Desconhecido'; // Retorna um valor padrão se não encontrar
  }

  atualizarChamado() {
    if (this.novoComentario && this.chamado) {
      const novoHistorico = {
        status: this.chamado.status,
        updatedAt: new Date(),
        updatedBy: this.getEmailUsuarioLogado(), // Captura o email do usuário logado
        comment: this.novoComentario
      };

      // Adiciona o novo comentário ao histórico
      this.chamado.history.push(novoHistorico);

      // Faz a requisição PUT para atualizar o chamado no backend
      this.http.put(`${environment.apiUrl}/api/chamados/${this.chamado._id}`, {
        status: this.chamado.status,
        comment: this.novoComentario,
        updatedBy: this.getEmailUsuarioLogado(), // Envia o usuário logado
        userRole: this.userRole // Envia o userRole
      }).subscribe(
        (response) => {
          console.log('Chamado atualizado com sucesso', response);
          this.toast.success({ detail: 'SUCCESS', summary: 'Chamado atualizado com sucesso.' });
          this.novoComentario = ''; // Limpa o campo de comentário após a atualização
        },
        (error) => {
          console.error('Erro ao atualizar o chamado:', error);
          this.toast.error({ detail: 'ERROR', summary: 'Erro ao atualizar o chamado.' });
        }
      );
    }
  }

  voltar() {
    this.router.navigate(['/listaChamados']);
  }
}