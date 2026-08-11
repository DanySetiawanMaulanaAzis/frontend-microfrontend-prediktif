import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerSmartprioritization } from './engineer-smartprioritization';

describe('EngineerSmartprioritization', () => {
  let component: EngineerSmartprioritization;
  let fixture: ComponentFixture<EngineerSmartprioritization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerSmartprioritization],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerSmartprioritization);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
