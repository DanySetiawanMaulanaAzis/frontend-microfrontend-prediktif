import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorDashboardSelectedMachine } from './operator-dashboard-selected-machine';

describe('OperatorDashboardSelectedMachine', () => {
  let component: OperatorDashboardSelectedMachine;
  let fixture: ComponentFixture<OperatorDashboardSelectedMachine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorDashboardSelectedMachine],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorDashboardSelectedMachine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
