import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardOGComponent } from './dasboard-og.component';

describe('DasboardOGComponent', () => {
  let component: DasboardOGComponent;
  let fixture: ComponentFixture<DasboardOGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasboardOGComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasboardOGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
