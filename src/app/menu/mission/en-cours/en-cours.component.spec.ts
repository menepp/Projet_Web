import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnCoursComponent } from './en-cours.component';

describe('EnCoursComponent', () => {
  let component: EnCoursComponent;
  let fixture: ComponentFixture<EnCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnCoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
