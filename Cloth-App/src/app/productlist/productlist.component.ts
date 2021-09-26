import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductListService } from '../services/product-list.service';
import { ToastrService } from 'ngx-toastr';
import { product } from '../shared/productlist-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {
  @ViewChild('closeModal') public closeModal: any;
  productId: number = 0;
  productName: string = '';
  productDescription: string = '';
  productBase: string = '';
  productPrice: number = 0;
  createProductForm: FormGroup;
  errors: string[] = [];
  dropdownSettings:IDropdownSettings = {};
  selectedProductIds:[];
  list: product[] = [];

  constructor(public service: ProductListService,
    private toastr: ToastrService, private formBuilder: FormBuilder) {
    this.createProductForm = this.formBuilder.group({
      id: [0],
      productName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      base: ['', Validators.required],
      price: [0, Validators.required],
      description: [''],
      relatedProductIds: [''],
      relatedProducts:[],
      selectedProducts:[]
    });
  }

  ngOnInit(): void {
    this.service.getAll().subscribe((res:product[]) => {
        this.list = res;
        debugger;
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'id',
          textField: 'productName',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          allowSearchFilter: false
        };
    });
    
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  populateForm(selectedRow: product) {
    //this.service.formData = Object.assign({}, selectedRow);
    this.productBase = selectedRow.base;
    this.productId = selectedRow.id;
    this.productDescription = selectedRow.description;
    this.productName = selectedRow.productName;
    this.productPrice = selectedRow.price;
  }

  getProductById(id: number) {
    this.service.getById(id).subscribe((res: product) => {
      this.productBase = res.base;
      this.productDescription = res.description;
      this.productName = res.productName;
      this.productPrice = res.price;
      this.productId = res.id;
    });
  }

  addProduct(formData: product): void {
    debugger;
    if (this.createProductForm.valid) {
      this.service.formData.id = formData.id;
      this.service.formData.productName = formData.productName;
      this.service.formData.price = formData.price;
      this.service.formData.description = formData.description;
      this.service.formData.base = formData.base;
      this.service.formData.relatedProductIds = '';
      this.service.formData.relatedProducts = formData.selectedProducts;
      this.service.formData.relatedProductsSelected=[];
      if (formData.id > 0)
        this.service.updateProductDetails().subscribe(res => {
          this.toastr.success("Product has been updated.");
          this.service.getAll().subscribe((res:product[]) => {
            this.list = res;
            debugger;
            this.dropdownSettings = {
              singleSelection: false,
              idField: 'id',
              textField: 'productName',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              itemsShowLimit: 3,
              allowSearchFilter: false
            };
        });
          this.closeModal.nativeElement.click();
        });
      else
        this.service.postProduct().subscribe(res => {
          this.toastr.success("Product has been added.");
          this.service.getAll().subscribe((res:product[]) => {
            this.list = res;
            debugger;
            this.dropdownSettings = {
              singleSelection: false,
              idField: 'id',
              textField: 'productName',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              itemsShowLimit: 3,
              allowSearchFilter: false
            };
        });
          this.closeModal.nativeElement.click();
        });
    }
    else {
      this.validateForm(this.createProductForm);
      //this.validationModal.show();
    }
  }

  editProduct(id: number) {
    this.service.getById(id).subscribe((res: product) => {
      debugger;
      this.createProductForm.patchValue({
        id: res.id,
        productName: res.productName,
        base: res.base,
        price: res.price,
        description: res.description,
        relatedProductIds: res.relatedProductIds,
        relatedProducts:res.relatedProducts,
        selectedProducts:res.relatedProducts
      });
      // this.createProductForm.setValue() = res.base;
      // this.productDescription = res.description;
      // this.productName = res.productName;
      // this.productPrice = res.price;
      // this.productId = res.id;
    });
  }

  validateForm(formGroup: FormGroup): void {
    this.errors = [];
    Object.keys(formGroup.controls).forEach(field => {
      let control = formGroup.controls[field];
      let errors = control.errors;
      if (errors === null || errors.count === 0) {
        return;
      }
      // Handle the 'required' case
      if (errors.required) {
        this.errors.push(`${field} is required`);
      }
      // Handle 'minlength' case
      if (errors.minlength) {
        this.errors.push(`${field} minimum length is ${errors.minlength.requiredLength}.`);
      }
      // Handle custom messages.
      if (errors.message) {
        this.errors.push(`${field} ${errors.message}`);
      }


      // const control = formGroup.get(field);
      // control.markAsTouched({ onlySelf: true });
      // control.markAsDirty({ onlySelf: true });
    });
  }

  deletePayment(id: number) {
    if (confirm('Are you sure, you want to delete this record?')) {
      this.service.deletePaymentDetail(id).subscribe(res => {
        this.service.getAll();
        this.toastr.error('Deleted successfully', 'Product List');
      });
    }
  }
}
