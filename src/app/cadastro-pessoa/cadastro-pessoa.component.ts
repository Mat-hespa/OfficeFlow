import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { environment } from 'src/environments/environment';

interface ApiResponse {
  status: boolean;
  companies: any[];
  message: string;
  setores: any[];
}

@Component({
  selector: 'app-cadastro-pessoa',
  templateUrl: './cadastro-pessoa.component.html',
  styleUrls: ['./cadastro-pessoa.component.scss']
})
export class CadastroPessoaComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig> | undefined;


  @ViewChild ('dropdwon', {static: false}) dropdwon?: ElementRef;
  selectedValue?: string;

  pessoaForm: FormGroup;
  errorMessage: string = '';
  empresas: any[] = [];
  setores: any[] = []; 

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toast: NgToastService,
  ) {
    this.datePickerConfig = Object.assign({}, {
      isAnimated: true,
      dateInputFormat: 'YYYY-MM-DD',
      containerClass: 'theme-dark-blue'
    });

    this.pessoaForm = this.formBuilder.group({
      nomeCompleto: ['', Validators.required],
      cpf: ['', Validators.pattern(/^\d{11}$/)],
      rg: ['', Validators.pattern(/^\d{9}$/)],
      ctps: [''],
      dataNascimento: [''],
      nacionalidade: [''],
      estadoCivil: [''],
      tipoTelefone: [''],
      numeroTelefone: [''],
      descricaoTelefone: [''],
      email: ['', [Validators.required, Validators.email]],
      descricaoEmail: [''],
      cep: [''],
      cidade: [''],
      estado: [''],
      bairro: [''],
      logradouro: [''],
      numeroCasa: [''],
      empresa: [''],
      setorEmprego: [''],
      cargoEmprego: ['']
    });
  }

  ngOnInit(): void {
    this.getEmpresas();
  }

  getEmpresas(): void {
    this.http.get<ApiResponse>(`${environment.apiUrl}/companies`).subscribe(
      response => {
        if (response.status) {
          this.empresas = response.companies;
        } else {
          console.error('Erro ao recuperar empresas:', response.message);
        }
      },
      error => {
        console.error('Erro ao recuperar empresas:', error);
      }
    );
  }

  onEmpresaChange(event: any): void {
    this.http.get<ApiResponse>(`${environment.apiUrl}/setor/` + event).subscribe(
      response => {
        this.setores = response.setores;
      },
      error => {
        console.error('Erro ao recuperar setores:', error);
      }
    );
  }

  registerPessoa() {
    if (this.pessoaForm.valid) {
      const companyData = this.pessoaForm.value;
      console.log(companyData)
      this.http
        .post(`${environment.apiUrl}/pessoa/create`, companyData)
        .subscribe((resultData: any) => {
          if (resultData.status) {
            this.toast.success({ detail: 'SUCCESS', summary: 'Pessoa cadastrada com sucesso' });
            this.router.navigateByUrl('/home');
          } else {
            this.toast.warning({ detail: 'WARNING', summary: 'Erro ao cadastrar pessoa' });
          }
        });
    }
    else {
      this.toast.warning({ detail: 'WARNING', summary: 'Preencha todos os campos'});
    }
  }

  returnNameEmpresa(){
    return this.dropdwon?.nativeElement.value;
  }

  buscarEnderecoPorCep() {
    const cep = this.pessoaForm.get('cep')?.value;
    if (cep && cep.length === 8) { // Verifica se o CEP tem 8 caracteres
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
        (endereco) => {
          this.pessoaForm.patchValue({
            cidade: endereco.localidade,
            estado: endereco.uf,
            bairro: endereco.bairro,
            logradouro: endereco.logradouro
          });
        },
        (error) => {
          console.error('Erro ao buscar endereço:', error);
        }
      );
    }
  }
}
