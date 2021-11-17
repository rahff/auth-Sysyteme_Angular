import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { ResServer, User } from 'src/models/interfaces.model';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('pillsRegisterTab', { static: true })
  public registerTabLink!: ElementRef<HTMLButtonElement>;
  @ViewChild('pillsContactTab', { static: true })
  public contactTabLink!: ElementRef<HTMLButtonElement>;
  @ViewChild('pillsLoginTab', { static: true })
  public loginTabLink!: ElementRef<HTMLButtonElement>;
  queryParam: Params | null = null;
  public loginForm: FormGroup = new FormGroup({});
  public contactForm: FormGroup = new FormGroup({});
  public signupForm: FormGroup = new FormGroup({});
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((queryparam: ParamMap) => {
      if (queryparam.get('signup')) {
        this.queryParam = { signup: !!queryparam.get('signup') };
        this.chooseTabByParams();
      } else if (queryparam.get('contact')) {
        this.queryParam = { contact: !!queryparam.get('contact') };
        setTimeout(() => {
          this.chooseTabByParams();
        }, 100);
      } else {
        this.queryParam = null;
        setTimeout(() => {
          this.chooseTabByParams(true);
        }, 100);
      }
    });
  }
  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      signupEmail: ['', [Validators.email, Validators.required]],
      signupPassword: ['', [Validators.required]],
      confirm: ['', [Validators.required]],
    });
    this.contactForm = this.fb.group({
      contactEmail: ['', [Validators.email, Validators.required]],
      message: ['', [Validators.required]],
    });
  }
  chooseTabByParams(defaultValue?: boolean): void {
    if (defaultValue) {
      this.queryParam = null;
      setTimeout(() => {
        this.loginTabLink.nativeElement.click();
      }, 100);
    }
    if (this.queryParam?.signup) {
      setTimeout(() => {
        this.registerTabLink.nativeElement.click();
      }, 100);
    } else if (this.queryParam?.contact) {
      this.contactTabLink.nativeElement.click();
    }
  }
  onSubmit(formName: string): void {
    switch (formName) {
      case 'signin':
        if (this.loginForm.valid) {
          const body = {
            email: this.loginForm.get('email')?.value,
            password: this.loginForm.get('password')?.value,
          };
          this.callUserService(formName, body);
        } else {
          return;
        }
        break;
      case 'signup':
        if (this.signupForm.valid) {
          const body = {
            name: this.signupForm.get('name')?.value,
            firstname: this.signupForm.get('firstname')?.value,
            email: this.signupForm.get('signupEmail')?.value,
            password: this.signupForm.get('password')?.value,
            avatar: '😀',
          };
          this.callUserService(formName, body);
        } else {
          return;
        }
        break;
      case 'contact':
        if (this.contactForm.valid) {
          const body = {
            email: this.loginForm.get('contactEmail')?.value,
            message: this.loginForm.get('message')?.value,
          };
          this.callUserService(formName, body);
        } else {
          return;
        }
        break;
      default:
        return;
    }
  }

  callUserService(service: string, body: any | User): void {
    switch (service) {
      case 'signin':
        this.userService.postLogin(body).subscribe((res: ResServer)=>{
          if(res.status === 200){
            localStorage.setItem('user', JSON.stringify(res.response));
            this.alertService.simpleAlert({timer: 2000, title: "Vous êtes connecter !", icon: 'success'})
            .then(()=>{
              this.router.navigate(['/'])
            })
          }else if(res.status === 403){
            this.alertService.simpleAlert({timer: 2000, title: "Vos indentifiants sont incorrect", icon: 'error'})
            .then(()=>{})
          }else{
            this.alertService.simpleAlert({timer: 2000, title: "Une erreur est survenue !", icon: 'warning'})
            .then(()=>{})
          }
        });
        break;
      case 'signup':
        this.userService.postSignup(body).subscribe((res: ResServer)=>{
          if(res.status === 200){
            localStorage.setItem('user', JSON.stringify(res.response));
            this.alertService.simpleAlert({timer: 2000, title: "Votre compte a été crée avec succès !", icon: 'success'})
            .then(()=>{
              this.router.navigate(['/'])
            })
          }else{
            this.alertService.simpleAlert({timer: 2000, title: "Une erreur est survenue !", icon: 'warning'})
            .then(()=>{})
          }
        });
        break;
      case 'contact':
        // this.userService.postMessage(body);
        break;
      default:
        break;
    }
  }
}
