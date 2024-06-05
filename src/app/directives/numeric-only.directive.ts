import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[numericOnly]'
})
export class NumericOnlyDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];
    // Permitir apenas números de 0 a 9 e os caracteres de controle permitidos
    if (allowedKeys.includes(event.key) ||
        /[0-9]/.test(event.key)) {
      return; // Permitir a entrada
    } else {
      event.preventDefault(); // Impedir a entrada
    }
  }
}