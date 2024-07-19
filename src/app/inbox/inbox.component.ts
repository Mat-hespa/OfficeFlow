import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  documents: any[] = [];
  recados: any[] = [];
  loading: boolean = false;

  constructor(private http: HttpClient, private toast: NgToastService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadDocuments();
    this.loadRecados();
  }

  loadDocuments() {
    this.loading = true;
    const recipientEmail = sessionStorage.getItem('userEmail');
    this.http.get(`${environment.apiUrl}/documentos/${recipientEmail}`).subscribe(
      (response: any) => {
        this.documents = response.documentos.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.loading = false;
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao carregar documentos.' });
        this.loading = false;
      }
    );
  }

  loadRecados() {
    this.loading = true;
    const recipientEmail = sessionStorage.getItem('userEmail');
    this.http.get(`${environment.apiUrl}/recados/${recipientEmail}`).subscribe(
      (response: any) => {
        this.recados = response.recados;
        this.loading = false;
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao carregar recados.' });
        this.loading = false;
      }
    );
  }

  markDocumentAsRead(documentId: string) {
    this.http.patch(`${environment.apiUrl}/documentos/${documentId}/read`, {}).subscribe(
      (response: any) => {
        this.toast.success({ detail: 'SUCCESS', summary: 'Documento marcado como lido.' });
        this.loadDocuments(); // Recarregar os documentos após marcar como lido
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao marcar documento como lido.' });
      }
    );
  }

  markRecadoAsRead(recadoId: string) {
    this.http.patch(`${environment.apiUrl}/recados/${recadoId}/read`, {}).subscribe(
      (response: any) => {
        this.toast.success({ detail: 'SUCCESS', summary: 'Recado marcado como lido.' });
        this.loadRecados(); // Recarregar os recados após marcar como lido
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao marcar recado como lido.' });
      }
    );
  }
}