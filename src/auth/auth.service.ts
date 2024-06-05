import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('userEmail');
  }

  isAdmin(): boolean {
    // Verificar se o usuário é um administrador com base no cargo armazenado no sessionStorage
    const userRole = sessionStorage.getItem('userRole');
    return userRole === 'admin';
  }
}