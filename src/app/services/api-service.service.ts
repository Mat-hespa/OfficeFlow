import { Injectable } from '@angular/core';
import { EmpresaModel } from '../shared/models/empresaModel';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(
    private http: HttpClient,
    private toast: NgToastService,
  ) { }

  getEmpresas(): Observable<EmpresaModel> {
    return this.http.get<EmpresaModel>(`${environment.apiUrl}/companies`);
  }

  getNumeroEmpresas(): Observable<number> {
    return this.http.get<EmpresaModel>(`${environment.apiUrl}/companies`).pipe(
      map(response => {
        if (response.status) {
          return response.companies.length;
        } else {
          console.error('Erro ao recuperar empresas:', response.message);
          return 0;
        }
      }),
      catchError(error => {
        console.error('Erro ao recuperar empresas:', error);
        return of(0); // Retorna 0 em caso de erro
      })
    );
  }

  loadSetores(): Observable<any> {
    return this.http.get<EmpresaModel>(`${environment.apiUrl}/setores`).pipe(
      map(response => {
        if (response.status) {
          return response.setores;
        } else {
          console.error('Erro ao recuperar setores:', response.message);
          return [];
        }
      }),
      catchError(error => {
        console.error('Erro ao recuperar setores:', error);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }

  loadNomePessoas(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/namePessoas`).pipe(
      map(response => {
        if (response.status) {
          return response.pessoasNames;
        } else {
          console.error('Erro ao recuperar nomes de pessoas:', response.message);
          return [];
        }
      }),
      catchError(error => {
        console.error('Erro ao recuperar nomes de pessoas:', error);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }
}