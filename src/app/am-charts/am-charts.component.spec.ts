import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmChartsComponent } from './am-charts.component';

describe('AmChartsComponent', () => {
  let component: AmChartsComponent;
  let fixture: ComponentFixture<AmChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
