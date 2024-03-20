import { Component } from '@angular/core';
import { User } from '../../types/user';
import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  user: User = {
    email: '',
    nickname: '',
    password: '',
    passwordC: ''
  }
  passwordMatch: boolean = true
  emailorNicknameExists: boolean = false
  data: any = []

  constructor(private userService: UserService, private router: Router){
   userService.userDataServerObs.subscribe((data: any) => {
      this.data = data
      console.log(this.data, 'data')
   })
  }

  registerUser(){
        if(!this.isPasswordMatch()){
          this.passwordMatch = false
        } 
        else if(this.data.some((data: any) => data.email === this.user.email || data.nickname === this.user.nickname)){
          this.emailorNicknameExists = true
        }
        else {
          this.userService.createUser(this.user).subscribe(
            (response) => {
              console.log('User created successfully:', response);
              this.router.navigate(['/login-page']);
            },
            (error) => {
              console.error('Error creating user:', error);
            }
          );
        }
      }
   

      

  isPasswordMatch(){
    return this.user.password === this.user.passwordC
  }

  
}
