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
  loading: boolean = false;

  constructor(private http: HttpClient, private toast: NgToastService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading = true;
    const recipientEmail = sessionStorage.getItem('userEmail'); // Substitua pelo email do recipient vindo do frontend
    this.http.get(`${environment.apiUrl}/documentos/${recipientEmail}`).subscribe(
      (response: any) => {
        this.documents = response.documentos;
        this.loading = false;
      },
      (error) => {
        this.toast.error({ detail: 'ERROR', summary: 'Erro ao carregar documentos.' });
        this.loading = false;
      }
    );
  }
}