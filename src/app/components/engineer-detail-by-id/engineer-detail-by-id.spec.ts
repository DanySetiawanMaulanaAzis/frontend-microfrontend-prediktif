import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerDetailById } from './engineer-detail-by-id';

describe('EngineerDetailById', () => {
  let component: EngineerDetailById;
  let fixture: ComponentFixture<EngineerDetailById>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerDetailById],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerDetailById);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
