import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmaciondeReservacion } from './confirmacionde-reservacion';

describe('ConfirmaciondeReservacion', () => {
  let component: ConfirmaciondeReservacion;
  let fixture: ComponentFixture<ConfirmaciondeReservacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmaciondeReservacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmaciondeReservacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
