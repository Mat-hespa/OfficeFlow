import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/auth/auth.service';
import { environment } from 'src/environments/environment';
import { ApiServiceService } from 'src/app/services/api-service.service';

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

  constructor(
    private http: HttpClient, 
    public authService: AuthService,
    private apiServiceService: ApiServiceService
  ) {}

  ngOnInit(): void {
    this.apiServiceService.getNumeroEmpresas().subscribe(
      numEmpresas => {
        this.empresaCadastrada = numEmpresas === 1;
      }
    );
    this.getCargoUsuario(sessionStorage.getItem('userEmail'));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeLazyLoading();
    }, 100); // Pequeno atraso para garantir que as imagens estejam na DOM
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

    if ('IntersectionObserver' in window) {
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
    } else {
      // Fallback for browsers that do not support IntersectionObserver
      lazyImages.forEach(img => {
        const imageElement = img as HTMLImageElement;
        imageElement.src = imageElement.dataset['src'] ?? '';
        imageElement.classList.remove('lazyload');
      });
    }
  }
}