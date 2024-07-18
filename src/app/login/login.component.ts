import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AnimationOptions } from 'ngx-lottie';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  options: AnimationOptions = {
    path: '../../assets/animation1.json',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toast: NgToastService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value
      let bodyData = {
        email: email,
        password: password,
      };
      this.http
        .post(`${environment.apiUrl}/student/login`, bodyData)
        .subscribe((resultData: any) => {
          if (resultData.status) {
            this.toast.success({ detail: 'SUCCESS', summary: 'Login efetuado' });
            sessionStorage.setItem('userEmail', email);
            this.router.navigateByUrl('/home');
          } else {
            this.toast.warning({ detail: 'WARNING', summary: 'Email ou senha incorretos' });
          }
        });
    }
  }
}
