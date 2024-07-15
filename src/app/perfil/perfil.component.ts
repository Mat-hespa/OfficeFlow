import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';

interface Student {
  nomeCompleto: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  errorMessage: string = '';
  showPassword: boolean = false;
  loading: boolean = true; // Estado de carregamento

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toast: NgToastService,
    private elementRef: ElementRef
  ) {
    this.perfilForm = this.formBuilder.group({
      nomeCompleto: ['', Validators.required],
      email: [{value: sessionStorage.getItem('userEmail'), disabled: true}, Validators.required],
      senhaAntiga: ['', Validators.required],
      novaSenha: ['', Validators.required],
      confirmarSenha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getStudentDetails(); // Chama a função para obter os detalhes do estudante quando o componente é inicializado
  }

  getStudentDetails(): void {
    const email = sessionStorage.getItem('userEmail');
    if (email) {
      this.http.get<{ status: boolean, student: Student }>(`${environment.apiUrl}/student/` + email).subscribe(
        response => {
          if (response.status && response.student) {
            const student = response.student;
            this.perfilForm.patchValue({
              nomeCompleto: student.nomeCompleto,
              senhaAntiga: student.password
            });
          } else {
            console.error('Nenhum estudante encontrado para o email:', email);
          }
          this.loading = false; // Desativa o estado de carregamento após a conclusão da requisição
        },
        error => {
          console.error('Erro ao recuperar os detalhes do estudante:', error);
          this.loading = false; // Desativa o estado de carregamento em caso de erro
        }
      );
    } else {
      console.error('Email não encontrado na sessão');
      this.loading = false; // Desativa o estado de carregamento se o email não for encontrado
    }
  }

  togglePasswordVisibility(): void {
    const senhaInput = this.elementRef.nativeElement.querySelector('#senhaInput');
    senhaInput.type = this.showPassword ? 'password' : 'text';
    this.showPassword = !this.showPassword;
  }

  logout() {
    sessionStorage.removeItem('userEmail');
    this.router.navigateByUrl('/login');
  }

  generateAsterisks(length: number): string {
    console.log(length);
    console.log('*'.repeat(length));
    return '*'.repeat(length);
  }

  changePassword(): void {
    const novaSenha = this.perfilForm.get('novaSenha')?.value;
    const confirmarSenha = this.perfilForm.get('confirmarSenha')?.value;
    if (novaSenha === confirmarSenha && novaSenha !== '' && confirmarSenha !== '') {
      const email = sessionStorage.getItem('userEmail');
      if (email) {
        const requestBody = {
          email: email,
          newPassword: novaSenha
        };

        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        this.http.post<any>(`${environment.apiUrl}/student/change-password`, requestBody, { headers: headers }).subscribe(
          response => {
            if (response.status) {
              this.toast.success({ detail: 'Sucesso', summary: 'Senha alterada com sucesso' });
              this.router.navigateByUrl('/home');
            } else {
              this.toast.error({ detail: 'Erro', summary: 'Erro ao alterar senha' });
            }
          },
          error => {
            console.error('Erro ao alterar senha:', error);
            this.toast.error({ detail: 'Erro', summary: 'Erro ao alterar senha' });
          }
        );
      } else {
        console.error('Email não encontrado na sessão');
        this.toast.error({ detail: 'Erro', summary: 'Erro ao alterar senha' });
      }
    } else {
      this.toast.warning({ detail: 'Atenção ', summary: 'Senhas vazias ou não conferem' });
    }
  }
}
