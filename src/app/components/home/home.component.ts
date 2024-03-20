import { Component } from '@angular/core';
import { SearchComponent } from "../search/search.component";
import { MyFoodComponent } from "../my-food/my-food.component";


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [SearchComponent, MyFoodComponent]
})
export class HomeComponent {
    data: any = []

    onDataEmit(data: any){
        const newProduct = {...data, quantity: 1};
        this.data = [...this.data, newProduct];
        
    }
    deleteItem(data: any){
        this.data = [...this.data.filter((item: any) => item !== data)]
    }

}
