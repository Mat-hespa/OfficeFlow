import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toast: NgToastService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  registerPessoa(pessoa: any) {
    this.http
      .post('http://localhost:9992/pessoa/create', pessoa)
      .subscribe((resultData: any) => {
        if (resultData.status) {
          this.router.navigateByUrl('/login');
        } else {
          console.log(resultData)
          console.log('Registro de pessoa vazia falhou')
        }
      });
  }

  register() {
    if (this.registerForm.valid) {
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      const fullname = this.registerForm.get('fullname')?.value;
      const confirmPassword = this.registerForm.get('confirmPassword')?.value;

      let bodyData = {
        nomeCompleto: fullname,
        email: email,
        password: password,
      };

      let bodyPessoa = {
        nomeCompleto: fullname,
        cpf: '',
        rg: '',
        ctps: '',
        dataNascimento: '',
        nacionalidade: '',
        estadoCivil: '',
        tipoTelefone: '',
        numeroTelefone: '',
        descricaoTelefone: '',
        email: email,
        descricaoEmail: '',
        cep: '',
        cidade: '',
        estado: '',
        bairro: '',
        logradouro: '',
        numeroCasa: '',
        empresa: '',
        setorEmprego: '',
        cargoEmprego: '',
      };

      // Verificar se as senhas coincidem
      if (password !== confirmPassword) {
        this.toast.error({
          detail:
            'As senhas não coincidem. Por favor, verifique e tente novamente.',
          summary: 'Erro',
        });
        return; // Abortar o registro se as senhas não coincidirem
      }

      this.http
        .post('http://localhost:9992/student/create', bodyData)
        .subscribe(
          (resultData: any) => {
            if (resultData.status) {
              this.toast.success({
                detail: 'Cadastro efetuado com sucesso',
                summary: 'Sucesso',
              });
              this.registerPessoa(bodyPessoa);
            }
          },
          (error) => {
            this.toast.error({
              detail:
                'Ocorreu um erro ao cadastrar. Por favor, tente novamente.',
              summary: 'Erro',
            });
          }
        );
    }
  }

  save() {
    this.register();
  }
}
