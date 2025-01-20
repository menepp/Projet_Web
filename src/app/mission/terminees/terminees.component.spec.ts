import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermineesComponent } from './terminees.component';

describe('TermineesComponent', () => {
  let component: TermineesComponent;
  let fixture: ComponentFixture<TermineesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermineesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermineesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
