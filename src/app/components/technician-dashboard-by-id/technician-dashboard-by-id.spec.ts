import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianDashboardById } from './technician-dashboard-by-id';

describe('TechnicianDashboardById', () => {
  let component: TechnicianDashboardById;
  let fixture: ComponentFixture<TechnicianDashboardById>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicianDashboardById],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicianDashboardById);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
