import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerDetail } from './engineer-detail';

describe('EngineerDetail', () => {
  let component: EngineerDetail;
  let fixture: ComponentFixture<EngineerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
