import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Product } from '../../types/product';
import { Profile } from '../../types/profile';
import { ProfileService } from '../../services/profile.service';
import { NutritionalValue } from '../../types/nutritionalValue';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-my-food',
  standalone: true,
  imports: [NgClass],
  templateUrl: './my-food.component.html',
  styleUrl: './my-food.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFoodComponent implements OnChanges {
  @Input() myListOfProducts: Product[] = [];
  @Output() deleteItemEmitter = new EventEmitter<Product>();
  sumOfKcal: number = 0;
  sumOfFat: number = 0;
  sumOfCarbs: number = 0;
  sumOfProtein: number = 0;
  BMRShow: boolean = false;
  BMR: NutritionalValue[] = []
  constructor(private profileService: ProfileService) {
    this.profileService.BMRValuesObs.subscribe((data) => {
      this.BMR = data
      
    })
  }
  ngOnChanges(): void {
    this.allCalcualte();
    if(this.BMR.length > 0){
      this.BMRShow = true
     }
  }
  addItem(product: Product) {
    const originalKcal = parseFloat(
      (product.kcal / product.quantity).toFixed(1)
    );
    const originalFat = parseFloat((product.fat / product.quantity).toFixed(1));
    const originalCarbs = parseFloat(
      (product.carbs / product.quantity).toFixed(1)
    );
    const originalProtein = parseFloat(
      (product.protein / product.quantity).toFixed(1)
    );
    product.quantity++;
    product.kcal = parseFloat((originalKcal * product.quantity).toFixed(1));
    product.fat = parseFloat((originalFat * product.quantity).toFixed(1));
    product.carbs = parseFloat((originalCarbs * product.quantity).toFixed(1));
    product.protein = parseFloat(
      (originalProtein * product.quantity).toFixed(1)
    );
    this.allCalcualte();
  }

  deleteItem(product: Product) {
    const originalKcal = parseFloat(
      (product.kcal / product.quantity).toFixed(1)
    );
    const originalFat = parseFloat((product.fat / product.quantity).toFixed(1));
    const originalCarbs = parseFloat(
      (product.carbs / product.quantity).toFixed(1)
    );
    const originalProtein = parseFloat(
      (product.protein / product.quantity).toFixed(1)
    );
    product.quantity--;
    if (product.quantity > 0) {
      product.kcal = parseFloat((originalKcal * product.quantity).toFixed(1));
      product.fat = parseFloat((originalFat * product.quantity).toFixed(1));
      product.carbs = parseFloat((originalCarbs * product.quantity).toFixed(1));
      product.protein = parseFloat(
        (originalProtein * product.quantity).toFixed(1)
      );
    } else {
      this.deleteItemEmitter.emit(product);
    }
    this.allCalcualte();
  }

  allCalcualte() {
    if (this.myListOfProducts.length === 0) {
      this.sumOfKcal = 0;
      this.sumOfFat = 0;
      this.sumOfCarbs = 0;
      this.sumOfProtein = 0;
    } else {
      this.sumOfKcal = parseFloat(
        this.myListOfProducts
          .reduce((acc, product) => acc + product.kcal, 0)
          .toFixed(1)
      );
      this.sumOfFat = parseFloat(
        this.myListOfProducts
          .reduce((acc, product) => acc + product.fat, 0)
          .toFixed(1)
      );
      this.sumOfCarbs = parseFloat(
        this.myListOfProducts
          .reduce((acc, product) => acc + product.carbs, 0)
          .toFixed(1)
      );
      this.sumOfProtein = parseFloat(
        this.myListOfProducts
          .reduce((acc, product) => acc + product.protein, 0)
          .toFixed(1)
      );
    }
  }
}
