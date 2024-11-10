import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  @Input() history?: any[];
  isOpen: boolean = false; // Controle de visibilidade

  toggleHistory() {
    this.isOpen = !this.isOpen; // Alterna a visibilidade
    console.log(this.history)
  }
}