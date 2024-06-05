import { Component } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
}
