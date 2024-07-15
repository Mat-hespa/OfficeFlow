import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecadosDocumentosComponent } from './recados-documentos.component';

describe('RecadosDocumentosComponent', () => {
  let component: RecadosDocumentosComponent;
  let fixture: ComponentFixture<RecadosDocumentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecadosDocumentosComponent]
    });
    fixture = TestBed.createComponent(RecadosDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
