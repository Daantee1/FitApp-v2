import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isLogged: boolean = false
  constructor(private auth: AuthService) {
    auth.isLogged.subscribe((data: any)=>{
      this.isLogged = data
    })
   }

   logOut(){
      this.auth.isLogged.next(false)
   }
}
