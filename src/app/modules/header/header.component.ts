import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  newNotificationsCount: number = 0;
  private checkNotificationsSubscription: Subscription | undefined;

  constructor(
    public authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkForNewNotifications();
    this.checkNotificationsSubscription = interval(60000).subscribe(() => this.checkForNewNotifications()); // Verifica a cada minuto

    // Subscribe to the notification service to get updates
    this.notificationService.unreadCount$.subscribe(count => {
      this.newNotificationsCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.checkNotificationsSubscription) {
      this.checkNotificationsSubscription.unsubscribe();
    }
  }

  checkForNewNotifications(): void {
    const recipientEmail = sessionStorage.getItem('userEmail');
    if (recipientEmail) {
      // Inicialize um contador temporário
      let tempNotificationsCount = 0;

      // Verifique recados não lidos
      this.http.get(`${environment.apiUrl}/recados/${recipientEmail}/unread-count`).subscribe(
        (response: any) => {
          tempNotificationsCount += response.unreadCount;

          // Verifique documentos não lidos
          this.http.get(`${environment.apiUrl}/documentos/${recipientEmail}/unread`).subscribe(
            (response: any) => {
              tempNotificationsCount += response.unreadCount;
              this.notificationService.updateUnreadCount(tempNotificationsCount); // Update the notification service
            },
            (error) => {
              console.error('Erro ao verificar novos documentos:', error);
            }
          );
        },
        (error) => {
          console.error('Erro ao verificar novos recados:', error);
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

  openChamado(): void {
    this.router.navigateByUrl('/listaChamados');
  }
}