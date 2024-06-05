import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetorTreeComponent } from './setor-tree.component';

describe('SetorTreeComponent', () => {
  let component: SetorTreeComponent;
  let fixture: ComponentFixture<SetorTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetorTreeComponent]
    });
    fixture = TestBed.createComponent(SetorTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
