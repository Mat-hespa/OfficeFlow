import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';

interface Pessoa {
  email: string;
  nome: string;
}

@Component({
  selector: 'app-cadastro-documento',
  templateUrl: './cadastro-documento.component.html',
  styleUrls: ['./cadastro-documento.component.scss']
})
export class CadastroDocumentoComponent implements OnInit {
  documentForm: FormGroup;
  selectedFile: File | null = null;
  pessoasNames: any[] = [];
  loading: boolean = false;
  setores: any[] = [];

  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private toast: NgToastService, 
    private router: Router,
    private apiServiceService: ApiServiceService
  ) {
    this.documentForm = this.formBuilder.group({
      registrant: [{ value: sessionStorage.getItem('userEmail'), disabled: true }, Validators.required],
      documentFile: ['', Validators.required],
      recipient: ['', Validators.required],
      description: ['']  // Adicionando o campo de descrição ao formulário
    });
  }

  ngOnInit(): void {
    this.getSetores();
  }

  getSetores(): void {
    this.http.get(`${environment.apiUrl}/setores`).subscribe(
      (response: any) => {
        this.setores = response.setores;
        console.log(this.setores)
      },
      (error) => {
        console.error('Erro ao buscar setores:', error);
      }
    );
  }

  onSetorChange(event: any): void {
    const setorNome = event.target.value;
    console.log(setorNome)
    // Chamar o serviço para buscar pessoas pelo nome do setor
    this.http.get(`${environment.apiUrl}/pessoa/api/${setorNome}`).subscribe(
      (response: any) => {
        this.pessoasNames = response.pessoas;
        console.log(this.pessoasNames)
      },
      (error) => {
        console.error('Erro ao buscar pessoas:', error);
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Arquivo selecionado:', this.selectedFile);
  }

  registerDocument() {
    console.log('Formulário válido:', this.documentForm.valid);
    console.log('Arquivo selecionado:', this.selectedFile);

    if (this.documentForm.valid && this.selectedFile) {
      console.log('Entrando no envio do formulário');

      this.loading = true; // Set loading to true

      const formData = new FormData();
      formData.append('registrant', this.documentForm.get('registrant')?.value);
      formData.append('recipient', this.documentForm.get('recipient')?.value);
      formData.append('description', this.documentForm.get('description')?.value);
      formData.append('documentFile', this.selectedFile);

      this.http.post(`${environment.apiUrl}/api/documentos`, formData).subscribe(
        (response: any) => {
          this.toast.success({ detail: 'SUCCESS', summary: 'Documento cadastrado com sucesso!' });
          this.router.navigateByUrl('/home');
          this.loading = false; // Set loading to false
        },
        (error) => {
          this.toast.error({ detail: 'ERROR', summary: 'Erro ao cadastrar documento.' });
          this.loading = false; // Set loading to false
        }
      );
    } else {
      this.toast.warning({ detail: 'WARNING', summary: 'Preencha todos os campos corretamente.' });
    }
  }
}