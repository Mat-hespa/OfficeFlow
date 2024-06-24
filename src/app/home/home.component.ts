import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/auth/auth.service';
import { environment } from 'src/environments/environment';

interface ApiResponse {
  status: boolean;
  companies: any[];
  message?: string;
  cargo: any;
}

@Component({
  selector: 'app-sorted',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  empresaCadastrada: boolean = false;
  authService: AuthService;

  constructor(private http: HttpClient, authService: AuthService) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.getNumeroEmpresas();
    this.getCargoUsuario(sessionStorage.getItem('userEmail'));
  }

  getNumeroEmpresas(): void {
    this.http.get<ApiResponse>(`${environment.apiUrl}/companies`).subscribe(
      response => {
        if (response.status) {
          const numEmpresas = response.companies.length;
          this.empresaCadastrada = numEmpresas === 1; // Habilita ou desabilita o botão com base no número de empresas
        } else {
          console.error('Erro ao recuperar empresas:', response.message);
        }
      },
      error => {
        console.error('Erro ao recuperar empresas:', error);
      }
    );
  }

  getCargoUsuario(user: any): void {
    console.log(user)
    this.http.get<ApiResponse>(`${environment.apiUrl}/student/${user}/cargo`).subscribe(
      response => {
        if (response.status) {
          sessionStorage.setItem('userRole', response.cargo)
        } else {
          console.error('Erro ao recuperar o cargo do usuário:', response.message);
        }
      },
      error => {
        console.error('Erro ao recuperar o cargo do usuário:', error);
      }
    );
  }
}
