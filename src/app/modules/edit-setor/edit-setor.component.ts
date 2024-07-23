import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { EmpresaModel } from 'src/app/shared/models/empresaModel';
import { environment } from 'src/environments/environment';

interface Setor {
  empresa: string;
  nomeSetor: string;
  isSubSetor: string;
  setorPai: string;
  responsavel: string;
  contato: string;
  status: string;
  tipoTelefoneResponsavel: string;
  numeroTelefoneResponsavel: string;
  descricaoTelefoneResponsavel: string;
}

@Component({
  selector: 'app-edit-setor',
  templateUrl: './edit-setor.component.html',
  styleUrls: ['./edit-setor.component.scss']
})
export class EditSetorComponent implements OnInit {

  @ViewChild ('dropdwon', {static: false}) dropdwon?: ElementRef;
  selectedValue?: string;

  setorForm: FormGroup;
  errorMessage: string = '';
  empresas: any[] = [];
  setores: any[] = []; 
  setorNovo: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toast: NgToastService,
    private apiServiceService: ApiServiceService
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
    this.getSetorDetails();
    this.loadSetores();
  }

  getSetorDetails(): void {
    const nomeSetor = sessionStorage.getItem('nomeSetor');
    if (nomeSetor) {
      this.http.get<{ setor: Setor }>(`${environment.apiUrl}/setores/` + nomeSetor).subscribe(
        response => {
          const setor = response.setor;
          // console.log(setor)
          if (setor) {
            this.setorNovo = setor.setorPai
            this.setorForm.patchValue(setor);
            console.log(this.setorForm)
            // console.log(setor)
          } else {
            console.error('Nenhum setor encontradp para o nome:', setor);
          }
        },
        error => {
          console.error('Erro ao recuperar detalhes do setor:', error);
        }
      );
    } else {
      console.error('Nome do setor não encontrado na sessão');
    }
  }

  loadSetores(): void {
    this.apiServiceService.loadSetores().subscribe(
      setores => {
        this.setores = setores;
      }
    );
  }

  registerSetor() {
    if (this.setorForm.valid) {
      const nomeSetor = sessionStorage.getItem('nomeSetor');
      const setorData = this.setorForm.value; 
      this.http
        .put(`${environment.apiUrl}/setor/${nomeSetor}/update`, setorData) // Requisição PUT com o email na URL
        .subscribe((resultData: any) => {
          if (resultData.status) {
            this.toast.success({ detail: 'SUCCESS', summary: 'Setor editado com sucesso' });
            this.router.navigateByUrl('/home');
          } else {
            this.toast.warning({ detail: 'WARNING', summary: 'Erro ao editar setor' });
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

}
