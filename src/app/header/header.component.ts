import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  hasNewDocuments: boolean = false;
  newRecadosCount: number = 0;
  private checkRecadosSubscription: Subscription | undefined;
  private checkDocumentsSubscription: Subscription | undefined;

  constructor(public authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.checkForNewDocuments();
    this.checkRecados();
    this.checkRecadosSubscription = interval(60000).subscribe(() => this.checkRecados()); // Verifica a cada minuto
    this.checkDocumentsSubscription = interval(60000).subscribe(() => this.checkForNewDocuments()); // Verifica a cada minuto
  }

  ngOnDestroy(): void {
    if (this.checkRecadosSubscription) {
      this.checkRecadosSubscription.unsubscribe();
    }
    if (this.checkDocumentsSubscription) {
      this.checkDocumentsSubscription.unsubscribe();
    }
  }

  checkRecados(): void {
    const recipientEmail = sessionStorage.getItem('userEmail');
    if (recipientEmail) {
      this.http.get(`${environment.apiUrl}/recados/${recipientEmail}/unread-count`).subscribe(
        (response: any) => {
          this.newRecadosCount = response.unreadCount;
        },
        (error) => {
          console.error('Erro ao verificar novos recados.', error);
        }
      );
    }
  }

  checkForNewDocuments(): void {
    // Lógica para verificar novos documentos e definir hasNewDocuments como true ou false
    // Exemplo:
    this.http.get(`${environment.apiUrl}/documentos/unread-count`).subscribe(
      (response: any) => {
        this.hasNewDocuments = response.unreadCount > 0;
      },
      (error) => {
        console.error('Erro ao verificar novos documentos.', error);
      }
    );
  }

  openRecadosDocumentos() {
    this.hasNewDocuments = false;
    this.router.navigateByUrl('/recados-documentos');
  }

  openRecados(): void {
    this.newRecadosCount = 0;
    this.router.navigateByUrl('/recados');
  }
}