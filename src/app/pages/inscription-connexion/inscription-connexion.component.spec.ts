import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionConnexionComponent } from './inscription-connexion.component';

describe('InscriptionConnexionComponent', () => {
  let component: InscriptionConnexionComponent;
  let fixture: ComponentFixture<InscriptionConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionConnexionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscriptionConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
