import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

interface Pessoa {
  nomeCompleto: string;
  cpf: string;
  rg: string;
  ctps: string;
  dataNascimento: string;
  nacionalidade: string;
  estadoCivil: string;
  tipoTelefone: string;
  numeroTelefone: string;
  descricaoTelefone: string;
  email: string;
  descricaoEmail: string;
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
  logradouro: string;
  numeroCasa: string;
  empresa: string;
  setorEmprego: string;
  cargoEmprego: string;
}

interface ApiResponse {
  status: boolean;
  companies: any[];
  message: string;
  setores: any[];
}

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrls: ['./edit-usuario.component.scss']
})
export class EditUsuarioComponent implements OnInit {
  
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
      cpf: [''],
      rg: [''],
      ctps: [''],
      dataNascimento: [''],
      nacionalidade: [''],
      estadoCivil: [''],
      tipoTelefone: [''],
      numeroTelefone: [''],
      descricaoTelefone: [''],
      email: [{value: sessionStorage.getItem('userEmail'), disabled: true}, Validators.required],
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
    this.getPessoaDetails();
    this.loadSetores();
  }

  getPessoaDetails(): void {
    const email = sessionStorage.getItem('emailParaEdicao');
    if (email) {
      this.http.get<{ pessoa: Pessoa }>('http://localhost:9992/pessoa/' + email).subscribe(
        response => {
          const pessoa = response.pessoa;
          if (pessoa) {
            this.pessoaForm.patchValue(pessoa);
            console.log(pessoa)
          } else {
            console.error('Nenhuma pessoa encontrada para o email:', email);
          }
        },
        error => {
          console.error('Erro ao recuperar detalhes da pessoa:', error);
        }
      );
    } else {
      console.error('Email não encontrado na sessão');
    }
  }

  getEmpresas(): void {
    this.http.get<ApiResponse>('http://localhost:9992/companies').subscribe(
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

  loadSetores(): void {
    this.http.get<ApiResponse>('http://localhost:9992/setores').subscribe(
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
      const email = sessionStorage.getItem('userEmail');
      const pessoaData = this.pessoaForm.value; 
      delete pessoaData.email;
      this.http
        .put(`http://localhost:9992/pessoa/${email}/update`, pessoaData) // Requisição PUT com o email na URL
        .subscribe((resultData: any) => {
          if (resultData.status) {
            this.toast.success({ detail: 'SUCCESS', summary: 'Pessoa editada com sucesso' });
            this.router.navigateByUrl('/home');
          } else {
            this.toast.warning({ detail: 'WARNING', summary: 'Erro ao editar pessoa' });
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
