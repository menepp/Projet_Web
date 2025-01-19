import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerMissionComponent } from './creer-mission.component';

describe('CreerMissionComponent', () => {
  let component: CreerMissionComponent;
  let fixture: ComponentFixture<CreerMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerMissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
