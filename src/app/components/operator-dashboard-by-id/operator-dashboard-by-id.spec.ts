import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorDashboardById } from './operator-dashboard-by-id';

describe('OperatorDashboardById', () => {
  let component: OperatorDashboardById;
  let fixture: ComponentFixture<OperatorDashboardById>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorDashboardById],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorDashboardById);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
