import { Producto } from 'src/app/Models/ProductoModel';
import { ToastrModule } from 'ngx-toastr';

export interface CartModelServer {
total: number;
data: [{
    product: Producto,
    numInCart: number
}];
}


export interface CartModelPublic {
    Total: number;
    prodData: [
        {
            pro_id: number,
            incart: number
        }
    ];
}

