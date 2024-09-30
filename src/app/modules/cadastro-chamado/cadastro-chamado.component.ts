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
  prioridades: string[] = ['Baixa', 'Média', 'Alta'];  // Adicionando as prioridades

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toast: NgToastService, 
  ) {
    // Inicializando o formulário reativo com validações
    this.chamadoForm = this.formBuilder.group({
      solicitante: [{ value: sessionStorage.getItem('userEmail'), disabled: true }, Validators.required],
      titulo: ['', Validators.required],
      ocorrencia: ['', Validators.required],
      descricao: ['', Validators.required],
      prioridade: ['', Validators.required],
      anexos: ['', Validators.required] // Validação dos anexos pode ser feita de forma adicional se necessário
    });
  }

  ngOnInit(): void {}

  // Tratamento para anexar arquivos selecionados
  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);  // Convertendo para array de arquivos
  }

  // Envio do formulário
  registerChamado() {
    if (this.chamadoForm.valid) {
      const formData = new FormData();

      // Adicionando dados do formulário ao FormData
      formData.append('solicitante', this.chamadoForm.get('solicitante')?.value);
      formData.append('titulo', this.chamadoForm.get('titulo')?.value);
      formData.append('ocorrencia', this.chamadoForm.get('ocorrencia')?.value);
      formData.append('descricao', this.chamadoForm.get('descricao')?.value);
      formData.append('prioridade', this.chamadoForm.get('prioridade')?.value);

      // Adicionando os arquivos anexos ao FormData
      for (const file of this.selectedFiles) {
        formData.append('anexos', file);  // "anexos" é o nome esperado no backend
      }

      // Envio do formulário para a API
      this.http.post(`${environment.apiUrl}/api/chamados`, formData).subscribe(
        response => {
          console.log('Chamado criado com sucesso', response);
          this.toast.success({ detail: 'SUCCESS', summary: 'Chamado de TI cadastrado com sucesso.' });
          this.router.navigateByUrl('/home');  // Redireciona após sucesso
        },
        error => {
          console.error('Erro ao criar o chamado:', error);
        }
      );
    } else {
      // Marcar todos os campos como tocados para exibir mensagens de erro
      // this.chamadoForm.markAllAsTouched();
      this.toast.warning({ detail: 'WARNING', summary: 'Preencha todos os campos corretamente.' });

    }
  }
}
