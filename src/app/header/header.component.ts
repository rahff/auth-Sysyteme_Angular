import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/interfaces.model';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public user : User | null = null
  constructor(private uservice: UserService, 
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit(): void {
    this.uservice.getUser().subscribe((user: User | null)=>{
      if(user){
        console.log(user);
        this.user = user;
      }else{
        this.user = null
      }
    },
    (error)=>{
      console.log(error);
    })
  }
  logout(): void {
    this.uservice.logout().subscribe(()=>{
      this.alertService.simpleAlert({icon: 'info', title: 'Vous êtes déconnecter', timer: 2000}).then(()=>{
        this.router.navigate(['/'])
      })
    })
  }

}
