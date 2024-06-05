import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSetorComponent } from './edit-setor.component';

describe('EditSetorComponent', () => {
  let component: EditSetorComponent;
  let fixture: ComponentFixture<EditSetorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSetorComponent]
    });
    fixture = TestBed.createComponent(EditSetorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
