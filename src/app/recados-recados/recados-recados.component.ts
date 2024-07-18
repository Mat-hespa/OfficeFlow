// src/app/components/recados-recebidos/recados-recebidos.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recados-recados',
  templateUrl: './recados-recados.component.html',
  styleUrls: ['./recados-recados.component.scss']
})
export class RecadosRecadosComponent implements OnInit {
  recados: any[] = [];
  loading: boolean = false;

  constructor(private http: HttpClient, private toast: NgToastService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadRecados();
  }

  loadRecados() {
    this.loading = true;
    const recipientEmail = sessionStorage.getItem('userEmail'); // Substitua pelo email do destinatário vindo do frontend
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
  markAsRead(recadoId: string) {
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