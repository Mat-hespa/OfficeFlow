import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { EmpresaModel } from 'src/app/shared/models/empresaModel';
import { environment } from 'src/environments/environment';

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
    private apiServiceService: ApiServiceService
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
      email: [''],
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
    this.apiServiceService.getEmpresas().subscribe(
      response => {
        if (response.status) {
          console.log('Empresas recuperadas com sucesso:', response.companies);
          this.empresas = response.companies;
          console.log('Empresas no cadastro:', this.empresas);
        } else {
          console.error('Erro ao recuperar empresas:', response.message);
        }
      },
      error => {
        console.error('Erro ao recuperar empresas:', error);
      }
    );
    this.getPessoaDetails();
    this.loadSetores();
  }

  getPessoaDetails(): void {
    const email = sessionStorage.getItem('emailParaEdicao');
    if (email) {
      this.http.get<{ pessoa: Pessoa }>(`${environment.apiUrl}/pessoa/` + email).subscribe(
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

  loadSetores(): void {
    this.apiServiceService.loadSetores().subscribe(
      setores => {
        this.setores = setores;
      }
    );
  }

  registerPessoa() {
    if (this.pessoaForm.valid) {
      const pessoaData = this.pessoaForm.value; 
      console.log('ENVIO NO EDICAO DE PESSOA', pessoaData.email)
      this.http
        .put(`${environment.apiUrl}/pessoa/${pessoaData.email}/update`, pessoaData) // Requisição PUT com o email na URL
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
