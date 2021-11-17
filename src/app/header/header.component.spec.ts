import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { userTest } from 'src/test/data.test';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userServiceSpy: any;
  let alertServiceSpy: any;
  let routerSpy: any;
  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', [ 'getUser', "logout" ]);
    alertServiceSpy = jasmine.createSpyObj('AlertService', [ "simpleAlert" ]);
    routerSpy = jasmine.createSpyObj('Router', [ "navigate" ]);
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [
        {
          provide: UserService, useValue: userServiceSpy
        },
        {
          provide: AlertService, usevalue: alertServiceSpy
        },
        {
          provide: Router, useValue: routerSpy
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    userServiceSpy.getUser.and.returnValue(of(userTest))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show login and signup button when no user connected', ()=>{
    userServiceSpy.getUser.and.returnValue(of(null));
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    const connectedElement = fixture.debugElement.query(By.css('#test0'))
    expect(connectedElement).toBeTruthy()
  })
  it('should show logout button when user connected', ()=>{
    userServiceSpy.getUser.and.returnValue(of(userTest));
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    const connectedElement = fixture.debugElement.query(By.css('#test1'))
    expect(connectedElement).toBeTruthy()
  })
  it('should show login buttons when user deconnected', fakeAsync(()=>{
    spyOn(component, "logout").and.returnValue();
    const simpleAlertSpy = alertServiceSpy.simpleAlert.and.returnValue(new Promise((resolve)=>resolve(true)))
    component.user = null;
    fixture.detectChanges();
    tick(500)
    flush()
    const connectedElement = fixture.debugElement.query(By.css('#test0'))
    console.log(connectedElement);
    expect(connectedElement).toBeTruthy()
    tick(3000)
  }))
});
