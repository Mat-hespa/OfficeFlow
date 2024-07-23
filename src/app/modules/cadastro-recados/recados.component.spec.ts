import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecadosComponent } from './cadastro-recados.component';

describe('RecadosComponent', () => {
  let component: RecadosComponent;
  let fixture: ComponentFixture<RecadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecadosComponent]
    });
    fixture = TestBed.createComponent(RecadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
