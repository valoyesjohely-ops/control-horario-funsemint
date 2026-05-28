import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEstadistica } from './card-estadistica';

describe('CardEstadistica', () => {
  let component: CardEstadistica;
  let fixture: ComponentFixture<CardEstadistica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEstadistica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEstadistica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
