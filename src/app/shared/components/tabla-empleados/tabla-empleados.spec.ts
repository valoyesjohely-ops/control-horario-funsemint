import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEmpleados } from './tabla-empleados';

describe('TablaEmpleados', () => {
  let component: TablaEmpleados;
  let fixture: ComponentFixture<TablaEmpleados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaEmpleados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaEmpleados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
