import { fakeAsync, flush, flushMicrotasks, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { UserService } from './user.service';
import { userTest } from 'src/test/data.test';
import { User } from 'src/models/interfaces.model';


describe('UserService: postLogin', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should post to server', fakeAsync(() => {
    expect(service).toBeTruthy();
    service.postLogin({email: 'test123@email.com', password: 'rrrrrrr'}).subscribe((res:any)=>{
      expect(res).toBeTruthy()
    })
    const req = httpTestingController.expectOne('http://localhost:3000/api/auth/login')
    req.flush({status: 200, response: {name: 'test', firstname: 'test', local:{email: 'test123@EmailValidator.com'}, avatar: '😀'}})
    flush()
  }));

  afterEach(()=>{
    httpTestingController.verify()
  })
});
describe('UserService: postSignupForm', ()=>{
  let service: UserService;
  let httpTestingController: HttpTestingController
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });
  it('should post signupForm' ,fakeAsync(()=>{
    service.postSignup({email: 'test123@email.com', password: 'rrrrrrr'}).subscribe((res:any)=>{
      expect(res).toBeTruthy()
    })
    const req = httpTestingController.expectOne('http://localhost:3000/api/auth/signup')
    req.flush({status: 200, response:{name: 'test', firstname: 'test', local:{email: 'test123@EmailValidator.com'}, avatar: '😀'}})
    flush()
  }))
  afterEach(()=>{
    httpTestingController.verify()
  })
})
describe('getUser', ()=>{
  let service: UserService;
  let httpTestingController: HttpTestingController
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });
  it('should return an observable with an user', fakeAsync(()=>{
    spyOnAllFunctions(service).user$.next(userTest)
    service.getUser().subscribe((user: User | null)=>{
      expect(user).toEqual(userTest)
    })
    flush()
  }))
})
