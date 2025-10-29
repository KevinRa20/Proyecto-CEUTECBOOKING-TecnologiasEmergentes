import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaBienvenida } from './pagina-bienvenida';

describe('PaginaBienvenida', () => {
  let component: PaginaBienvenida;
  let fixture: ComponentFixture<PaginaBienvenida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaBienvenida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaBienvenida);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
