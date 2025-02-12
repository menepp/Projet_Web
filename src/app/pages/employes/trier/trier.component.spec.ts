import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrierComponent } from './trier.component';

describe('TrierComponent', () => {
  let component: TrierComponent;
  let fixture: ComponentFixture<TrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
