import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-cadastro-chamado',
  templateUrl: './cadastro-chamado.component.html',
  styleUrls: ['./cadastro-chamado.component.scss']
})
export class CadastroChamadoComponent implements OnInit {
  chamadoForm: FormGroup;
  selectedFiles: File[] = [];
  titulos: string[] = ['Erro de Conexão', 'Computador Lento', 'Tela Azul', 'Erro de Impressora', 'Problema de Rede'];
  tituloPrioridadeMap: { [key: string]: string } = {
    'Erro de Conexão': 'Alta',
    'Computador Lento': 'Média',
    'Tela Azul': 'Alta',
    'Erro de Impressora': 'Baixa',
    'Problema de Rede': 'Alta'
  };

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toast: NgToastService,
  ) {
    this.chamadoForm = this.formBuilder.group({
      solicitante: [{ value: sessionStorage.getItem('userEmail'), disabled: true }, Validators.required],
      titulo: ['', Validators.required],
      ocorrencia: ['', Validators.required],
      descricao: ['', Validators.required],
      anexos: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  registerChamado() {
    if (this.chamadoForm.valid) {
      const formData = new FormData();

      const titulo = this.chamadoForm.get('titulo')?.value;
      const prioridade = this.tituloPrioridadeMap[titulo];

      formData.append('solicitante', this.chamadoForm.get('solicitante')?.value);
      formData.append('titulo', titulo);
      formData.append('ocorrencia', this.chamadoForm.get('ocorrencia')?.value);
      formData.append('descricao', this.chamadoForm.get('descricao')?.value);
      formData.append('prioridade', prioridade);

      for (const file of this.selectedFiles) {
        formData.append('anexos', file);
      }

      this.http.post(`${environment.apiUrl}/api/chamados`, formData).subscribe(
        response => {
          console.log('Chamado criado com sucesso', response);
          this.toast.success({ detail: 'SUCCESS', summary: 'Chamado de TI cadastrado com sucesso.' });
          this.router.navigateByUrl('/home');
        },
        error => {
          console.error('Erro ao criar o chamado:', error);
        }
      );
    } else {
      this.toast.warning({ detail: 'WARNING', summary: 'Preencha todos os campos corretamente.' });
    }
  }
}