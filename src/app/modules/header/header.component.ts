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
  newNotificationsCount: number = 0;
  private checkNotificationsSubscription: Subscription | undefined;

  constructor(public authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.checkForNewNotifications();
    this.checkNotificationsSubscription = interval(60000).subscribe(() => this.checkForNewNotifications()); // Verifica a cada minuto
  }

  ngOnDestroy(): void {
    if (this.checkNotificationsSubscription) {
      this.checkNotificationsSubscription.unsubscribe();
    }
  }

  checkForNewNotifications(): void {
    const recipientEmail = sessionStorage.getItem('userEmail');
    if (recipientEmail) {
      // Reset notifications count before fetching new counts
      this.newNotificationsCount = 0;

      this.http.get(`${environment.apiUrl}/recados/${recipientEmail}/unread-count`).subscribe(
        (response: any) => {
          this.newNotificationsCount += response.unreadCount;
        },
        (error) => {
          console.error('Erro ao verificar novos recados.', error);
        }
      );

      this.http.get(`${environment.apiUrl}/documentos/${recipientEmail}/unread`).subscribe(
        (response: any) => {
          console.log('Novos documentos:', response);
          this.newNotificationsCount += response.unreadCount;
        },
        (error) => {
          console.error('Erro ao verificar novos documentos:', error);
        }
      );
    }
  }

  openInbox(): void {
    this.newNotificationsCount = 0;
    this.router.navigateByUrl('/inbox');
  }

  openPerfil(): void {
    this.router.navigateByUrl('/perfil');
  }
}