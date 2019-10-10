import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCreateGameComponent } from './menu-create-game.component';

describe('MenuCreateGameComponent', () => {
  let component: MenuCreateGameComponent;
  let fixture: ComponentFixture<MenuCreateGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCreateGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
