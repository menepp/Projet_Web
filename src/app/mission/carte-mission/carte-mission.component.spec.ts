import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteMissionComponent } from './carte-mission.component';

describe('CarteMissionComponent', () => {
  let component: CarteMissionComponent;
  let fixture: ComponentFixture<CarteMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteMissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
