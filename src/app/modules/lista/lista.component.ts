import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiServiceService } from 'src/app/services/api-service.service';

interface ApiResponse {
  status: boolean;
  message?: string;
  companies: any[];
  setores: any[];
  pessoas: any[];
  pessoasNames: any[];
}

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {
  selectedOption: string = 'SETOR';
  loading: boolean = true; // Estado de carregamento
  headers: { [key: string]: string[] } = {
    EMPRESA: [
      'Razão Social',
      'Nome Fantasia',
      'CNPJ',
      'IE',
      'IM',
      'Telefone',
      'Email',
    ],
    PESSOA: [
      'Nome',
      'CPF',
      'RG',
      'CTPS',
      'Telefone',
      'Email',
      'Empresa',
      'Setor',
      'Cargo',
      'Ações',
    ],
    SETOR: [
      'Empresa',
      'Nome do setor',
      'Responsavel',
      'Contato',
      'Status do setor',
      'Ações',
    ],
  };
  empresas: any[] = [];
  setores: any[] = [];
  pessoas: any[] = [];
  usuarioLogadoEmail: string = '';
  pessoasNames: any[] = [];

  constructor(
    private http: HttpClient, 
    private router: Router,
    private apiServiceService: ApiServiceService
  ) {}

  ngOnInit(): void {
    this.loadNomePessoas();
    this.loadSetores();
  }

  loadNomePessoas(): void {
    this.loading = true;
    this.apiServiceService.loadNomePessoas().subscribe(
      pessoasNames => {
        this.pessoasNames = pessoasNames;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  loadSetores(): void {
    this.apiServiceService.loadSetores().subscribe(
      setores => {
        this.setores = setores;
      }
    );
  }
  loadPessoas(): void {
    this.loading = true;
    this.http.get<ApiResponse>(`${environment.apiUrl}/pessoas`).subscribe(
      (response) => {
        if (response.status) {
          this.pessoas = response.pessoas;
        } else {
          console.error('Erro ao recuperar pessoas:', response.message);
        }
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao recuperar pessoas:', error);
        this.loading = false;
      }
    );
  }

  editarPessoa(email: string) {
    sessionStorage.setItem('emailParaEdicao', email);
    this.router.navigate(['/editUser']);
  }

  editarSetor(nomeSetor: string) {
    sessionStorage.setItem('nomeSetor', nomeSetor);
    this.router.navigate(['/editSetor']);
  }
}
