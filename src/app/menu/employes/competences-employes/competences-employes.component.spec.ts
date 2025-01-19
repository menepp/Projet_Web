import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencesEmployesComponent } from './competences-employes.component';

describe('CompetencesEmployesComponent', () => {
  let component: CompetencesEmployesComponent;
  let fixture: ComponentFixture<CompetencesEmployesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetencesEmployesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetencesEmployesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
