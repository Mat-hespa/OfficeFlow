import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Setor {
  nomeSetor: string;
  subSetores: Setor[];
}

@Component({
  selector: 'app-setor-tree',
  templateUrl: './setor-tree.component.html',
  styleUrls: ['./setor-tree.component.scss']
})
export class SetorTreeComponent implements OnInit {
  setores: Setor[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSetores();
  }

  fetchSetores(): void {
    this.http.get<{ status: boolean, setores: Setor[] }>('http://localhost:9992/setore/tree')
      .subscribe(response => {
        if (response.status) {
          this.setores = response.setores;
          console.log(this.setores)
        } else {
          console.error('Erro ao buscar setores');
        }
      }, error => {
        console.error('Erro ao buscar setores:', error);
      });
  }
}
