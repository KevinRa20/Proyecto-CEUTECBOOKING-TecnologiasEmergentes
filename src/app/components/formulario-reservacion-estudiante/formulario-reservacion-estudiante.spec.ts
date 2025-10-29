import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioReservacionEstudiante } from './formulario-reservacion-estudiante';

describe('FormularioReservacionEstudiante', () => {
  let component: FormularioReservacionEstudiante;
  let fixture: ComponentFixture<FormularioReservacionEstudiante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioReservacionEstudiante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioReservacionEstudiante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
