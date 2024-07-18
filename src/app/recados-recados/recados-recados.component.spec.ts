import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecadosRecadosComponent } from './recados-recados.component';

describe('RecadosRecadosComponent', () => {
  let component: RecadosRecadosComponent;
  let fixture: ComponentFixture<RecadosRecadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecadosRecadosComponent]
    });
    fixture = TestBed.createComponent(RecadosRecadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
