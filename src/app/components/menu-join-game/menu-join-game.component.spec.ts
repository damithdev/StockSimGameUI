import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuJoinGameComponent } from './menu-join-game.component';

describe('MenuJoinGameComponent', () => {
  let component: MenuJoinGameComponent;
  let fixture: ComponentFixture<MenuJoinGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuJoinGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuJoinGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
