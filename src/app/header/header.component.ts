import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  hasNewDocuments: boolean = false;

  authService: AuthService;

  constructor(authService: AuthService, private router: Router) {
    this.authService = authService;
  }

  checkForNewDocuments() {
    // Lógica para verificar novos documentos e definir hasNewDocuments como true ou false
  }

  openRecadosDocumentos() {
    this.hasNewDocuments = false;
    this.router.navigateByUrl('/recados-documentos');
  }
}
