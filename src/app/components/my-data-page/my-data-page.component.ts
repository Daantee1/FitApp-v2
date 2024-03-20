import {  Component, ElementRef, ViewChild } from '@angular/core';
import { Profile } from '../../types/profile';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../types/user';
import { UserService } from '../../services/user.service';
import { catchError, filter, timeout } from 'rxjs';
import { Chart, PieController, ArcElement, CategoryScale, Tooltip, Legend  } from 'chart.js';
import { NutritionalValue } from '../../types/nutritionalValue';

@Component({
  selector: 'app-my-data-page',
  standalone: true,
  templateUrl: './my-data-page.component.html',
  styleUrl: './my-data-page.component.css',
  imports: [FormsModule],
})
export class MyDataPageComponent {
  @ViewChild('myChart', { static: false }) myChartElement!: ElementRef;
  chartInstance!: any;

  
  profileData: Profile[] = [];
  hideButtonAddData: boolean = false;
  logIn: boolean = false;
  changeData: boolean = false;
  addData: boolean = false;
  showMyData: boolean = true;
  showResultBMI: boolean = false;
  showResultBMR: boolean = false;
  showLoader: boolean = false;
  showChart: boolean = false;
  resultNumberBMI: number = 0;
  resultBMI: string = '';
  resultBMR: number = 0;
  currentUser: User = {
    email: '',
    nickname: '',
    password: '',
    passwordC: '',
  };
 
  

  hideButtonChangeData: boolean = false;

  profile: Profile = {
    gender: '',
    age: null,
    weight: null,
    height: null,
    activity: '',
    goal: '',
  };

  constructor(
    private profileService: ProfileService,
    private userService: UserService
  ) {
    Chart.register(PieController, ArcElement, CategoryScale, Tooltip, Legend);
    userService.getCurrentUserObs().subscribe((data: any) => {
      if (data && data.length > 0) {
        this.currentUser = data[0];
        this.logIn = true;
        profileService.getProfileObsFromServer().subscribe((data: any) => {
          this.profileData = data.filter(
            (profile: any) => profile.id === this.currentUser.profileId
          );
          if (this.profileData.length > 0) {
            this.hideButtonAddData = true;
          }
          if (this.profileData.length < 1) {
            this.hideButtonChangeData = true;
          }
        });
      }
    });

    if (this.showResultBMR) {
      this.createChart([0, 0, 0]);
    }
  }
 

 

  changeDataButton() {
    this.showResultBMI = false;
    this.showResultBMR = false;
    this.changeData = true;
    this.showMyData = false;
    this.profile = this.profileData[0];
  }
  addDataButton() {
    this.addData = true;
    this.showMyData = false;
  }

  

  setDataProfile() {
    this.addData = false;
    this.showMyData = true;
    this.profileService.addProfile(this.profile);
    this.profileService.createProfile(this.profile).subscribe(
      (createdProfile: any) => {
        if (createdProfile[0] && createdProfile[0].id) {
          const nowCreatedProfile = createdProfile[createdProfile.length - 1];
          nowCreatedProfile.userId = this.currentUser.id;
          this.profileService.updateProfile(nowCreatedProfile).subscribe(
            (updatedProfile: any) => {
              this.getProfileData();
            },
            (error: any) => {
              console.error('Error updating profile:', error);
            }
          );
          if (this.currentUser && this.currentUser.id) {
            this.currentUser.profileId = nowCreatedProfile.id;
            this.userService
              .updateUser(this.currentUser)
              .subscribe((updatedUsers: any) => {
                const updatedUser = updatedUsers.find(
                  (user: any) => user.id === this.currentUser.id
                );
                if (updatedUser) {
                  this.currentUser = updatedUser;
                  console.log('User updated successfully:', updatedUser);
                } else {
                  console.error('Updated user not found in response');
                }
              });
          } else {
            console.error('currentUser.id is not set');
          }
        } else {
          console.error('createdProfile.id is not set');
        }
      },
      (error) => {
        console.error('Error creating profile:', error);
        console.log(error.errors);
      }
    );
  }
  updateDataProfile() {
    this.changeData = false;
    this.showMyData = true;
    this.profileService.updateProfile(this.profile).subscribe(
      (response) => {
        console.log('Profile updated successfully:', response);
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }

  getProfileData() {
    this.profileService.getProfileObsFromServer().subscribe((data: any) => {
      this.profileData = data.filter(
        (profile: any) => profile.id === this.currentUser.profileId
      );
      if (this.profileData.length > 0) {
        this.hideButtonAddData = true;
      }
      if (this.profileData.length > 0) {
        this.hideButtonChangeData = false;
      }
    });
  }

  calculateBMI() {
    this.showResultBMI = false;
    this.showResultBMR = false;
    this.showLoader = true;
    this.showChart = false;

    setTimeout(() => {
      this.showLoader = false;

      if (!this.showLoader) {
        this.showResultBMI = true;

        let weight = this.profileData[0].weight;
        let height = this.profileData[0].height;
        if (weight && height !== null) {
          this.resultNumberBMI = parseFloat(
            (weight / (((height / 100) * height) / 100)).toFixed(1)
          );
          if (this.resultNumberBMI < 16) {
            this.resultBMI = 'wygłodzenie';
          }
          if (this.resultNumberBMI >= 16 && this.resultNumberBMI <= 17) {
            this.resultBMI = 'wychudzenie';
          }
          if (this.resultNumberBMI > 17 && this.resultNumberBMI <= 18.5) {
            this.resultBMI = 'niedowaga';
          }
          if (this.resultNumberBMI > 18.5 && this.resultNumberBMI <= 25) {
            this.resultBMI = 'wartość prawidłowa';
          }
          if (this.resultNumberBMI > 25 && this.resultNumberBMI <= 30) {
            this.resultBMI = 'nadwaga';
          }
          if (this.resultNumberBMI > 30 && this.resultNumberBMI <= 35) {
            this.resultBMI = 'I stopień otyłości';
          }
          if (this.resultNumberBMI > 35 && this.resultNumberBMI <= 40) {
            this.resultBMI = 'II stopień otyłości';
          }
          if (this.resultNumberBMI > 40) {
            this.resultBMI = 'III stopień otyłości';
          }
        }
      }
    }, 2000);
  }

  calculateBMR() {
    this.showResultBMR = false;
    this.showResultBMI = false;
    this.showLoader = true;
    this.showChart = false;
    
    setTimeout(() => {
      this.showLoader = false;

      if (!this.showLoader) {
        this.showResultBMR = true;
        this.showChart = true;
        let weight = this.profileData[0].weight;
        let height = this.profileData[0].height;
        let age = this.profileData[0].age;
        let activity = this.profileData[0].activity;
        let gender = this.profileData[0].gender;
        let goal = this.profileData[0].goal;
        let proteinGrams = 0;
        let carbsGrams = 0;
        let fatGrams = 0; 
        let activityValue;
        let goalValue;
        switch (activity) {
          case 'Znikoma':
            activityValue = 1.2;
            break;
          case 'Bardzo mała':
            activityValue = 1.375;
            break;
          case 'Umiarkowana':
            activityValue = 1.55;
            break;
          case 'Duża':
            activityValue = 1.725;
            break;
          case 'Bardzo duża':
            activityValue = 1.9;
            break;
          default:
            activityValue = 1;
        }
        switch (goal) {
          case 'Schudnąć':
            goalValue = -500;
            break;
          case 'Przytyć':
            goalValue = 500;
            break;
          case 'Utrzymać wagę':
          default:
            goalValue = 0;
        }
        if (weight && height && age && activity !== null) {
          if (gender === 'kobieta') {
            this.resultBMR = parseFloat(
              (
                (655 + 9.6 * weight + 1.8 * height - 4.7 * age) *
                  activityValue +
                goalValue
              ).toFixed(0)
            );
            let proteinKcal = this.resultBMR * 0.2;
            let carbsKcal = this.resultBMR * 0.5;
            let fatKcal = this.resultBMR * 0.3;

            proteinGrams = parseFloat((proteinKcal / 4).toFixed(1));
            carbsGrams = parseFloat((carbsKcal / 4).toFixed(1));
            fatGrams = parseFloat((fatKcal / 9).toFixed(1));
            this.updateChart([proteinGrams, carbsGrams, fatGrams])
            let nutritionalValue: NutritionalValue = {
              kcal: this.resultBMR,
              protein: proteinGrams,
              carbs: carbsGrams,
              fat: fatGrams
            };
            this.profileService.addBMR(nutritionalValue);
          } else {
            this.resultBMR = parseFloat(
              (
                (66 + 13.7 * weight + 5 * height - 6.8 * age) * activityValue +
                goalValue
              ).toFixed(0)
            );
            let proteinKcal = this.resultBMR * 0.2;
            let carbsKcal = this.resultBMR * 0.5;
            let fatKcal = this.resultBMR * 0.3;

            proteinGrams = parseFloat((proteinKcal / 4).toFixed(1));
            carbsGrams = parseFloat((carbsKcal / 4).toFixed(1));
            fatGrams = parseFloat((fatKcal / 9).toFixed(1));
            this.updateChart([proteinGrams, carbsGrams, fatGrams])
            let nutritionalValue: NutritionalValue = {
              kcal: this.resultBMR,
              protein: proteinGrams,
              carbs: carbsGrams,
              fat: fatGrams
            };
            this.profileService.addBMR(nutritionalValue);
          }
        }
      }
    }, 2000);
  }

  updateChart(data: any){
    if (this.chartInstance) {
      this.chartInstance.data.datasets[0].data = data;
      this.chartInstance.update();
    } else {
      this.createChart(data);
    }
  }
  createChart(data: any): void {
    if (this.myChartElement) {
      const context = this.myChartElement.nativeElement.getContext('2d');
      this.chartInstance = new Chart(context, {
        type: 'pie',
        data: {
          labels: ['Białko', 'Węglowodany', 'Tłuszcze'],
          datasets: [{
            data: data,
            backgroundColor: ['rgb(0, 0, 255)', 'rgb(70, 130, 180)', 'rgb(135, 206, 235)'],
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
             align: 'start',
             labels: {
              padding: 10,
              color: 'white'
             },
            },
          },
          events: ['mousemove', 'mouseout', 'touchstart', 'touchmove', 'touchend'],
        },
      });
    } 
  }
 
  

}
