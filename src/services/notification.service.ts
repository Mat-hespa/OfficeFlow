// notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  checkNotifications(email: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/notifications?email=${email}`);
  }
}