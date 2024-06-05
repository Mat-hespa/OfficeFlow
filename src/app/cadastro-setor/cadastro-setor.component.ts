import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

interface ApiResponse {
  status: boolean;
  companies: any[];
  setores: any[];
  message?: string;
}

@Component({
  selector: 'app-cadastro-setor',
  templateUrl: './cadastro-setor.component.html',
  styleUrls: ['./cadastro-setor.component.scss'],
})
export class CadastroSetorComponent {
  setorForm: FormGroup;
  errorMessage: string = '';
  empresas: any[] = [];
  setores: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toast: NgToastService
  ) {
    this.setorForm = this.formBuilder.group({
      empresa: [, Validators.required],
      nomeSetor: ['', Validators.required],
      isSubSetor: [''],
      setorPai: [''],
      responsavel: [''],
      contato: [''],
      status: [''],
      tipoTelefoneResponsavel: [''],
      numeroTelefoneResponsavel: [''],
      descricaoTelefoneResponsavel: [''],
    });
  }

  ngOnInit(): void {
    this.getEmpresas();
  }

  getEmpresas(): void {
    this.http.get<ApiResponse>('http://localhost:9992/companies').subscribe(
      (response) => {
        if (response.status) {
          this.empresas = response.companies;
          if (this.empresas.length > 0) {
            this.setorForm.get('empresa')?.setValue(this.empresas[0].nomeFantasia);
          }
        } else {
          console.error('Erro ao recuperar empresas:', response.message);
        }
      },
      (error) => {
        console.error('Erro ao recuperar empresas:', error);
      }
    );
  }

  registerSetor() {
    if (this.setorForm.valid) {
      const setorData = this.setorForm.value;
      console.log(setorData)
      this.http
        .post('http://localhost:9992/setor/create', setorData)
        .subscribe((resultData: any) => {
          if (resultData.status) {
            this.toast.success({
              detail: 'SUCCESS',
              summary: 'Setor cadastrado com sucesso',
            });
            this.router.navigateByUrl('/home');
          } else {
            this.toast.warning({
              detail: 'WARNING',
              summary: 'Erro ao cadastrar setor',
            });
          }
        });
    } else {
      console.log(this.setorForm)
      this.toast.warning({
        detail: 'WARNING',
        summary: 'Preencha todos os campos',
      });
    }
  }

  loadSetores() {
    this.http.get<ApiResponse>('http://localhost:9992/setores').subscribe(
      (response) => {
        if (response.status) {
          this.setores = response.setores;
        } else {
          console.error('Erro ao recuperar setores:', response.message);
        }
      },
      (error) => {
        console.error('Erro ao recuperar setores:', error);
      }
    );
  }
}
