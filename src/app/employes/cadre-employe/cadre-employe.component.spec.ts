import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadreEmployeComponent } from './cadre-employe.component';

describe('CadreEmployeComponent', () => {
  let component: CadreEmployeComponent;
  let fixture: ComponentFixture<CadreEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadreEmployeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadreEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
