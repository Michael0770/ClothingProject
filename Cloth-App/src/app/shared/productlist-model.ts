export class product {
    id:number=0;
    productName:string='';
    description:string='';
    price:number=0;
    base:string='';
    relatedProductIds:string='';
    relatedProducts:selectedProducts[];
    selectedProducts:selectedProducts[];
    relatedProductsSelected:RelProductModel[];
}

export class selectedProducts{
    id:number=0;
    productName:string='';
}
export class RelProductModel{
    productId:number=0;
    name:string='';
}

