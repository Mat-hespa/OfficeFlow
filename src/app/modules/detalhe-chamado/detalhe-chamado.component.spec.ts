import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheChamadoComponent } from './detalhe-chamado.component';

describe('DetalheChamadoComponent', () => {
  let component: DetalheChamadoComponent;
  let fixture: ComponentFixture<DetalheChamadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalheChamadoComponent]
    });
    fixture = TestBed.createComponent(DetalheChamadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
