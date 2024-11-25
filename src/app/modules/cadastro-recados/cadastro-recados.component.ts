import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';

interface ApiResponse {
  status: boolean;
  pessoasNames: { email: string }[];
  message: string;
}

@Component({
  selector: 'app-recados',
  templateUrl: './cadastro-recados.component.html',
  styleUrls: ['./cadastro-recados.component.scss']
})
export class RecadosComponent implements OnInit {
  recadoForm: FormGroup;
  emails: string[] = [];
  setores: any[] = [];
  pessoasNames: any[] = [];
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toast: NgToastService,
    private router: Router,
    private apiServiceService: ApiServiceService
  ) {
    this.recadoForm = this.formBuilder.group({
      emailRemetente: [{ value: sessionStorage.getItem('userEmail'), disabled: true }, Validators.required],
      setor: ['', Validators.required],
      emailDestinatario: ['', Validators.required],
      mensagem: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getSetores();
  }

  getSetores(): void {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/setores`).subscribe(
      (response: any) => {
        this.setores = response.setores;
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.error('Error loading sectors:', error);
      }
    );
  }

  onSetorChange(event: any): void {
    const setorNome = event.target.value;
    this.http.get(`${environment.apiUrl}/pessoa/api/${setorNome}`).subscribe(
      (response: any) => {
        this.pessoasNames = response.pessoas;
        this.emails = this.pessoasNames.map(pessoa => pessoa.email);
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.error('Error loading people:', error);
      }
    );
  }

  enviarRecado(): void {
    if (this.recadoForm.valid) {
      const recado = {
        emailRemetente: this.recadoForm.get('emailRemetente')?.value,
        emailDestinatario: this.recadoForm.get('emailDestinatario')?.value,
        mensagem: this.recadoForm.get('mensagem')?.value
      };

      this.loading = true;
      this.http.post(`${environment.apiUrl}/recados`, recado).subscribe(
        (response: any) => {
          this.toast.success({ detail: 'SUCCESS', summary: 'Recado enviado com sucesso!' });
          this.router.navigateByUrl('/home');
          this.loading = false;
        },
        (error) => {
          console.error('Error sending recado:', error);
          this.toast.error({ detail: 'ERROR', summary: 'Erro ao enviar recado.' });
          this.loading = false;
        }
      );
    } else {
      this.toast.warning({ detail: 'WARNING', summary: 'Preencha todos os campos corretamente.' });
    }
  }
}