import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cadastro-empresa',
  templateUrl: './cadastro-empresa.component.html',
  styleUrls: ['./cadastro-empresa.component.scss']
})
export class CadastroEmpresaComponent {
  companyForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toast: NgToastService,
  ) {
    this.companyForm = this.formBuilder.group({
      razaoSocial: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      inscricaoEstadual: [''],
      inscricaoMunicipal: [''],
      observacoes: [''],
      tipoTelefone: [''],
      numeroTelefone: [''],
      descricaoTelefone: [''],
      email: ['', [Validators.required, Validators.email]],
      descricaoEmail: [''],
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      cidade: [''],
      estado: [''],
      bairro: [''],
      logradouro: [''],
      numeroCasa: ['']
    });
  }

  registerCompany() {
    if (this.companyForm.valid) {
      const companyData = this.companyForm.value;
      this.http
        .post(`${environment.apiUrl}/company/create`, companyData)
        .subscribe((resultData: any) => {
          if (resultData.status) {
            this.toast.success({ detail: 'SUCCESS', summary: 'Empresa cadastrada com sucesso' });
            this.router.navigateByUrl('/home');
          } else {
            this.toast.warning({ detail: 'WARNING', summary: 'Erro ao cadastrar empresa' });
          }
        });
    }
    else {
      this.toast.warning({ detail: 'WARNING', summary: 'Preencha todos os campos'});
    }
  }

  buscarEnderecoPorCep() {
    const cep = this.companyForm.get('cep')?.value;
    if (cep && cep.length === 8) { // Verifica se o CEP tem 8 caracteres
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
        (endereco) => {
          this.companyForm.patchValue({
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
