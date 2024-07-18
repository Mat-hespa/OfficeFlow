import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';

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
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toast: NgToastService
  ) {
    this.recadoForm = this.formBuilder.group({
      emailRemetente: [{ value: sessionStorage.getItem('userEmail'), disabled: true }, Validators.required],
      emailDestinatario: ['', Validators.required],
      mensagem: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEmails();
  }

  loadEmails(): void {
    this.loading = true;
    this.http.get<ApiResponse>(`${environment.apiUrl}/namePessoas`).subscribe(
      (response) => {
        if (response.status) {
          this.emails = response.pessoasNames.map(pessoa => pessoa.email);
        } else {
          console.error('Erro ao recuperar emails:', response.message);
        }
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao recuperar emails:', error);
        this.loading = false;
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

      this.http.post(`${environment.apiUrl}/recados`, recado).subscribe(
        (response: any) => {
          this.toast.success({ detail: 'SUCCESS', summary: 'Recado enviado com sucesso!' });
        },
        (error) => {
          this.toast.error({ detail: 'ERROR', summary: 'Erro ao enviar recado.' });
        }
      );
    } else {
      this.toast.warning({ detail: 'WARNING', summary: 'Preencha todos os campos corretamente.' });
    }
  }
}