import { Component, OnInit } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { MyFoodComponent } from '../my-food/my-food.component';
import { Product } from '../../types/product';
import { NgClass } from '@angular/common';
import { NutritionalValue } from '../../types/nutritionalValue';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-menu-page',
  standalone: true,
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.css',
  imports: [SearchComponent, MyFoodComponent, NgClass],
})
export class MenuPageComponent implements OnInit {
  myListOfProducts: any = [];
  myListOfBreakfast: any = [];
  myListOfLunch: any = [];
  myListOfDinner: any = [];
  myListOfTea: any = [];
  myListOfSupper: any = [];

  sumOfKcal: number = 0;
  sumOfFat: number = 0;
  sumOfCarbs: number = 0;
  sumOfProtein: number = 0;
  BMRShow: boolean = false;
  breakfast: boolean = false;
  lunch: boolean = false;
  dinner: boolean = false;
  tea: boolean = false;
  supper: boolean = false;

  currentMeal: string = 'breakfast';

  BMR: NutritionalValue[] = [];
  constructor(private profileService: ProfileService) {
    this.profileService.BMRValuesObs.subscribe((data) => {
      this.BMR = data;
      console.log(this.BMR);
    });
  }
  ngOnInit(): void {
    if (this.BMR.length > 0) {
      this.BMRShow = true;
    }
  }

  onDataEmit(data: any) {
    const newProduct = { ...data, quantity: 1 };
    switch (this.currentMeal) {
      case 'breakfast':
        this.myListOfBreakfast = [...this.myListOfBreakfast, newProduct];
        this.myListOfProducts = [...this.myListOfProducts, newProduct];
        break;
      case 'lunch':
        this.myListOfLunch = [...this.myListOfLunch, newProduct];
        this.myListOfProducts = [...this.myListOfProducts, newProduct];
        break;
      case 'dinner':
        this.myListOfDinner = [...this.myListOfDinner, newProduct];
        this.myListOfProducts = [...this.myListOfProducts, newProduct];
        break;
      case 'tea':
        this.myListOfTea = [...this.myListOfTea, newProduct];
        this.myListOfProducts = [...this.myListOfProducts, newProduct];
        break;
      case 'supper':
        this.myListOfSupper = [...this.myListOfSupper, newProduct];
        this.myListOfProducts = [...this.myListOfProducts, newProduct];
        break;
    }
    this.allCalcualte();
  }
  deleteItemPermanently(data: any) {
    console.log(data);
    this.myListOfBreakfast = this.myListOfBreakfast.filter(
      (item: any) => item !== data
    );
    this.myListOfLunch = this.myListOfLunch.filter(
      (item: any) => item !== data
    );
    this.myListOfDinner = this.myListOfDinner.filter(
      (item: any) => item !== data
    );
    this.myListOfTea = this.myListOfTea.filter((item: any) => item !== data);
    this.myListOfSupper = this.myListOfSupper.filter(
      (item: any) => item !== data
    );
    this.myListOfProducts = this.myListOfProducts.filter(
      (item: any) => item !== data
    );
  }

  ngOnChanges(): void {
    this.allCalcualte();
  }

  resetMeals() {
    this.currentMeal = '';
  }

  createBreakfast() {
    this.breakfast = true;
    this.currentMeal = 'breakfast';
  }

  createLunch() {
    this.lunch = true;
    this.currentMeal = 'lunch';
  }

  createDinner() {
    this.dinner = true;
    this.currentMeal = 'dinner';
  }

  createTea() {
    this.tea = true;
    this.currentMeal = 'tea';
  }

  createSupper() {
    this.supper = true;
    this.currentMeal = 'supper';
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
      this.deleteItemPermanently(product);
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
          .reduce((acc: any, product: any) => acc + product.kcal, 0)
          .toFixed(1)
      );
      this.sumOfFat = parseFloat(
        this.myListOfProducts
          .reduce((acc: any, product: any) => acc + product.fat, 0)
          .toFixed(1)
      );
      this.sumOfCarbs = parseFloat(
        this.myListOfProducts
          .reduce((acc: any, product: any) => acc + product.carbs, 0)
          .toFixed(1)
      );
      this.sumOfProtein = parseFloat(
        this.myListOfProducts
          .reduce((acc: any, product: any) => acc + product.protein, 0)
          .toFixed(1)
      );
    }
  }
}
