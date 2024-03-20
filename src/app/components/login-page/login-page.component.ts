import { Component } from '@angular/core';
import { User } from '../../types/user';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

user: User = {
email: '',
password: '',
}
passwordOrEmailIncorrect: boolean = false

userData: User[] = []

constructor(private userService: UserService,private router: Router, private auth: AuthService){

}

loginUser() {
  this.userService.checkUser(this.user).subscribe(userExists => {
    if (userExists) {
      this.auth.isLogged.next(true);
      this.router.navigate(['/home']);
    } else {
      this.passwordOrEmailIncorrect = true;
    }
  });
}

}
