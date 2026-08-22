import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorDashboardCallTechnicianByIdDialog } from './operator-dashboard-call-technician-by-id-dialog';

describe('OperatorDashboardCallTechnicianByIdDialog', () => {
  let component: OperatorDashboardCallTechnicianByIdDialog;
  let fixture: ComponentFixture<OperatorDashboardCallTechnicianByIdDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorDashboardCallTechnicianByIdDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorDashboardCallTechnicianByIdDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
