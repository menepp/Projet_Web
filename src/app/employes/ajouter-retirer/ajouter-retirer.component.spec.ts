import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterRetirerComponent } from './ajouter-retirer.component';

describe('AjouterRetirerComponent', () => {
  let component: AjouterRetirerComponent;
  let fixture: ComponentFixture<AjouterRetirerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterRetirerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterRetirerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
