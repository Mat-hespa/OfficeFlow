import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cadastro-setor',
  templateUrl: './cadastro-setor.component.html',
  styleUrls: ['./cadastro-setor.component.scss'],
})
export class CadastroSetorComponent implements OnInit {
  setorForm: FormGroup;
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
    this.setorForm = this.formBuilder.group({
      empresa: [''],  // Inicialize com um valor vazio ou valor padrão
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
    this.apiServiceService.getEmpresas().subscribe(
      response => {
        if (response.status) {
          console.log('Empresas recuperadas com sucesso:', response.companies);
          this.empresas = response.companies;
          console.log('Empresas no cadastro:', this.empresas);
          // Supondo que sempre haja uma empresa e você quer definir a primeira empresa como valor inicial
          if (this.empresas.length > 0) {
            this.setorForm.patchValue({ empresa: this.empresas[0].nomeFantasia });
          }
        } else {
          console.error('Erro ao recuperar empresas:', response.message);
        }
      },
      error => {
        console.error('Erro ao recuperar empresas:', error);
      }
    );
  }

  registerSetor() {
    if (this.setorForm.valid) {
      const setorData = this.setorForm.value;
      console.log(setorData);
      this.http
        .post(`${environment.apiUrl}/setor/create`, setorData)
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
      console.log(this.setorForm);
      this.toast.warning({
        detail: 'WARNING',
        summary: 'Preencha todos os campos',
      });
    }
  }

  loadSetores(): void {
    this.apiServiceService.loadSetores().subscribe(
      setores => {
        this.setores = setores;
      }
    );
  }
}