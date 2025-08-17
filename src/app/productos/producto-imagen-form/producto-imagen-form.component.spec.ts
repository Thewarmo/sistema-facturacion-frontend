import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoImagenFormComponent } from './producto-imagen-form.component';

describe('ProductoImagenFormComponent', () => {
  let component: ProductoImagenFormComponent;
  let fixture: ComponentFixture<ProductoImagenFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoImagenFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoImagenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
