import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerDetailAddMachineDialog } from './engineer-detail-add-machine-dialog';

describe('EngineerDetailAddMachineDialog', () => {
  let component: EngineerDetailAddMachineDialog;
  let fixture: ComponentFixture<EngineerDetailAddMachineDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerDetailAddMachineDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerDetailAddMachineDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
