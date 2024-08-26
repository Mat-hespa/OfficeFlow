import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  documents: any[] = [];
  recados: any[] = [];
  loading: boolean = false;
  selectedDocument: any;
  selectedType: string = '';
  newRegistrantEmail: string = sessionStorage.getItem('userEmail') || '';
  recipientEmail: string = '';
  emails: string[] = [];
  comment = '';

  @ViewChild('forwardModal') forwardModal: TemplateRef<any> | undefined;

  constructor(
    private http: HttpClient, 
    private toast: NgToastService, 
    private modalService: NgbModal,
    private apiServiceService: ApiServiceService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadDocuments();
    this.loadRecados();
    this.loadNomePessoas();
  }

  loadDocuments() {
    this.loading = true;
    const recipientEmail = sessionStorage.getItem('userEmail');
    if (recipientEmail) {
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
    } else {
      this.toast.error({ detail: 'ERROR', summary: 'Email do destinatário não encontrado.' });
      this.loading = false;
    }
  }

  loadRecados() {
    this.loading = true;
    const recipientEmail = sessionStorage.getItem('userEmail');
    if (recipientEmail) {
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
    } else {
      this.toast.error({ detail: 'ERROR', summary: 'Email do destinatário não encontrado.' });
      this.loading = false;
    }
  }

  markDocumentAsRead(documentId: string) {
    const recipientEmail = sessionStorage.getItem('userEmail');
    if (recipientEmail) {
      this.http.post(`${environment.apiUrl}/documentos/${documentId}/read`, { recipientEmail }).subscribe(
        (response: any) => {
          this.toast.success({ detail: 'SUCCESS', summary: 'Documento marcado como lido.' });
          this.loadDocuments();
        },
        (error) => {
          this.toast.error({ detail: 'ERROR', summary: 'Erro ao marcar documento como lido.' });
        }
      );
    } else {
      this.toast.error({ detail: 'ERROR', summary: 'Email do destinatário não encontrado.' });
    }
  }

  markRecadoAsRead(recadoId: string) {
    this.http.patch(`${environment.apiUrl}/recados/${recadoId}/read`, {}).subscribe(
      (response: any) => {
        this.toast.success({ detail: 'SUCCESS', summary: 'Recado marcado como lido.' });
        this.loadRecados();
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao marcar recado como lido.' });
      }
    );
  }

  openForwardModal(item: any, type: string) {
    this.selectedDocument = item;
    this.selectedType = type;
    this.modalService.open(this.forwardModal);
  }

  forwardItem(newRegistrantEmail: string, recipientEmail: string, comment: string) {
    if (this.selectedType === 'document') {
      this.http.post(`${environment.apiUrl}/documentos/forward`, { 
        documentId: this.selectedDocument._id, 
        newRegistrant: newRegistrantEmail, 
        newRecipient: recipientEmail,
        comment: comment // Passa o comentário aqui
      }).subscribe(
        (response: any) => {
          this.toast.success({ detail: 'SUCCESS', summary: 'Documento encaminhado com sucesso.' });
          this.loadDocuments();
        },
        (error) => {
          this.toast.error({ detail: 'ERROR', summary: 'Erro ao encaminhar documento.' });
        }
      );
    } else if (this.selectedType === 'recado') {
      this.http.post(`${environment.apiUrl}/recados/forward`, { recadoId: this.selectedDocument._id, newRegistrant: newRegistrantEmail, newRecipient: recipientEmail }).subscribe(
        (response: any) => {
          this.toast.success({ detail: 'SUCCESS', summary: 'Recado encaminhado com sucesso.' });
          console.log(recipientEmail);
          this.loadRecados();
        },
        (error) => {
          this.toast.error({ detail: 'ERROR', summary: 'Erro ao encaminhar recado.' });
        }
      );
    }
  }

  updateDocumentStatus(documentId: string, status: string) {
    const updatedBy = sessionStorage.getItem('userEmail');
    this.http.patch(`${environment.apiUrl}/documentos/${documentId}/status`, { status, updatedBy }).subscribe(
      (response: any) => {
        this.toast.success({ detail: 'SUCCESS', summary: 'Status do documento atualizado.' });
        this.loadDocuments();
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao atualizar status do documento.' });
      }
    );
  }

  updateRecadoStatus(recadoId: string, status: string) {
    const updatedBy = sessionStorage.getItem('userEmail');
    this.http.patch(`${environment.apiUrl}/recados/${recadoId}/status`, { status, updatedBy }).subscribe(
      (response: any) => {
        this.toast.success({ detail: 'SUCCESS', summary: 'Status do recado atualizado.' });
        this.loadRecados();
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao atualizar status do recado.' });
      }
    );
  }

  loadNomePessoas(): void {
    this.loading = true;
    this.apiServiceService.loadNomePessoas().subscribe(
      (pessoasNames: { email: string }[]) => {
        this.emails = pessoasNames.map(pessoa => pessoa.email);
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

}