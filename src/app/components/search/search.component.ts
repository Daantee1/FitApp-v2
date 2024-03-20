import { Component, EventEmitter, Output } from '@angular/core';
import { error } from 'console';
import { Product } from '../../types/product';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  @Output() dataEmitter = new EventEmitter<Product[]>();

  productsDatabse = './assets/products.json';
  products: Product[] = [];
  searchTerm: string = '';

  constructor() {
    fetch(this.productsDatabse)
      .then((response) => response.json())
      .then((data) => {
        this.products = data;
      })
      .catch((error) => console.log(error));
  }

  get filteredProducts() {
    if (this.searchTerm) {
      return this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    return null;
  }
  addToMyFood(product: any) {
    this.dataEmitter.emit(product);
    
  }
}
