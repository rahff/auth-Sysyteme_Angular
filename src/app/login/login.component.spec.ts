import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { userTest } from 'src/test/data.test';
import { AlertService } from '../services/alert.service';
import { LoginComponent } from './login.component';
import { UserService } from '../services/user.service';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let routerSpy: any;
  let userServiceSpy: any;
  let alertServiceSpy: any;
  let fixture: ComponentFixture<LoginComponent>;
  beforeEach(async() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    userServiceSpy = jasmine.createSpyObj('UserService', ['postLogin', 'postSignup'])
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['simpleAlert'])
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            queryParamMap: of({get: ()=> of({test: true})})
          }
        },
        {
          provide: FormBuilder
        },
        {
          provide: Router,  useValue: routerSpy
        },
        {
          provide: UserService, useValue: userServiceSpy
        },
        {
          provide: AlertService, useValue: alertServiceSpy
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should go to correct tab when have queryParam on url", fakeAsync(()=>{
    component.queryParam = {signup: true};
    component.chooseTabByParams();
    tick(150);
    const buttons = fixture.debugElement.queryAll(By.css(".nav-link"));
    expect(buttons[1].classes.active).toBeTrue()
    fixture.detectChanges();
    component.queryParam = {contact: true};
    component.chooseTabByParams();
    tick(150);
    expect(buttons[2].classes.active).toBeTrue();
  }));
  it('should not call service method when form is invalid', ()=>{
    const onSubmitSpy = spyOn(component, "onSubmit")
    const callServiceSpy = spyOn(component, "callUserService")
    const buttonSubmit = fixture.debugElement.query(By.css('#signinSubmit'))
    buttonSubmit.triggerEventHandler('click', 'signin')
    expect(onSubmitSpy).toHaveBeenCalled()
    expect(callServiceSpy).not.toHaveBeenCalled()
    
  })
  it('should call service method when form is valid', ()=>{
    const callServiceSpy = spyOn(component, "callUserService");
    const buttonSubmit = fixture.debugElement.query(By.css('#signinSubmit'));
    component.loginForm.controls['email'].setValue('raphaelandrey@gmail.com');
    component.loginForm.controls['password'].setValue('Mo2$asse');
    component.onSubmit('signin');
    expect(callServiceSpy).toHaveBeenCalledWith('signin',{email:'raphaelandrey@gmail.com', password: 'Mo2$asse'});
  })
  it('should call success alert on status 200', fakeAsync(()=>{
    userServiceSpy.postLogin.and.returnValue(of({status: 200, response: userTest}))
    const simpleAlertSpy = alertServiceSpy.simpleAlert.and.returnValue(new Promise((resolve)=> resolve(true)))
    component.callUserService('signin', {email:'raphaelandrey@gmail.com', password: 'Mo2$asse'})
    flush()
    tick(2500)
    expect(simpleAlertSpy).toHaveBeenCalledWith({icon: "success", timer :2000, title: "Vous êtes connecter !"})
  }));
  it('should call error alert on status 403', fakeAsync(()=>{
    userServiceSpy.postLogin.and.returnValue(of({status: 403, error: 'password'}))
    const simpleAlertSpy = alertServiceSpy.simpleAlert.and.returnValue(new Promise((resolve)=> resolve(true)))
    component.callUserService('signin', {email:'raphaelandrey@gmail.com', password: 'Mo2$asse'})
    flush()
    tick(2500)
    expect(simpleAlertSpy).toHaveBeenCalledWith({timer: 2000, title: "Vos indentifiants sont incorrect", icon: 'error'})
  }))
  it('should call warring alert on status 500', fakeAsync(()=>{
    userServiceSpy.postLogin.and.returnValue(of({status: 500, error: 'unknown'}))
    const simpleAlertSpy = alertServiceSpy.simpleAlert.and.returnValue(new Promise((resolve)=> resolve(true)))
    component.callUserService('signin', {email:'raphaelandrey@gmail.com', password: 'Mo2$asse'})
    flush()
    tick(2500)
    expect(simpleAlertSpy).toHaveBeenCalledWith({timer: 2000, title: "Une erreur est survenue !", icon: 'warning'})
  }))
  it('should call success alert on status 200 for signup', fakeAsync(()=>{
    userServiceSpy.postSignup.and.returnValue(of({status: 200, response: userTest}))
    const simpleAlertSpy = alertServiceSpy.simpleAlert.and.returnValue(new Promise((resolve)=> resolve(true)))
    component.callUserService('signup', {email:'raphaelandrey@gmail.com', password: 'Mo2$asse', name: 'test', firstname: 'tester', avatar: '😀'})
    flush()
    tick(2500)
    expect(simpleAlertSpy).toHaveBeenCalledWith({icon: "success", timer: 2000, title: "Votre compte a été crée avec succès !"})
  }));
  it('should call warring alert on status 500 for signup', fakeAsync(()=>{
    userServiceSpy.postSignup.and.returnValue(of({status: 500, error: 'unknown'}))
    const simpleAlertSpy = alertServiceSpy.simpleAlert.and.returnValue(new Promise((resolve)=> resolve(true)))
    component.callUserService('signup', {email:'raphaelandrey@gmail.com', password: 'Mo2$asse', name: 'test', firstname: 'tester', avatar: '😀'})
    flush()
    tick(2500)
    expect(simpleAlertSpy).toHaveBeenCalledWith({timer: 2000, title: "Une erreur est survenue !", icon: 'warning'})
  }))
});

