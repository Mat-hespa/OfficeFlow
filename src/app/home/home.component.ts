import { Component, OnInit, AfterViewInit } from '@angular/core';
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
export class HomeComponent implements OnInit, AfterViewInit {

  empresaCadastrada: boolean = false;

  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit(): void {
    this.getNumeroEmpresas();
    this.getCargoUsuario(sessionStorage.getItem('userEmail'));
  }

  ngAfterViewInit(): void {
    this.initializeLazyLoading();
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
    console.log(user);
    this.http.get<ApiResponse>(`${environment.apiUrl}/student/${user}/cargo`).subscribe(
      response => {
        if (response.status) {
          sessionStorage.setItem('userRole', response.cargo);
        } else {
          console.error('Erro ao recuperar o cargo do usuário:', response.message);
        }
      },
      error => {
        console.error('Erro ao recuperar o cargo do usuário:', error);
      }
    );
  }

  initializeLazyLoading(): void {
    const lazyImages = document.querySelectorAll('img.lazyload');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset['src'] ?? '';
          img.classList.remove('lazyload');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
}