import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueMissionComponent } from './historique-mission.component';

describe('HistoriqueMissionComponent', () => {
  let component: HistoriqueMissionComponent;
  let fixture: ComponentFixture<HistoriqueMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueMissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
