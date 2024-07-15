import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recados-documentos',
  templateUrl: './recados-documentos.component.html',
  styleUrls: ['./recados-documentos.component.scss']
})
export class RecadosDocumentosComponent implements OnInit {
  documents: any[] = [];

  constructor(private http: HttpClient, private toast: NgToastService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.http.get(`${environment.apiUrl}/documents`).subscribe(
      (documents: any) => {
        this.documents = documents;
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao carregar documentos.' });
      }
    );
  }

  updateStatus(document: any, status: string) {
    const updatedDocument = { ...document, status };
    this.http.put(`${environment.apiUrl}/document/update`, updatedDocument).subscribe(
      () => {
        this.toast.success({ detail: 'SUCCESS', summary: 'Status atualizado com sucesso!' });
        this.loadDocuments();
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao atualizar status.' });
      }
    );
  }
}
