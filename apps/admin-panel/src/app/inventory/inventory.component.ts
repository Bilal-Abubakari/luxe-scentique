import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../core/services/api.service';
import type { IPerfume, CreateProductDto, UpdateProductDto } from '@luxe-scentique/shared-types';

interface VibeOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    InputSwitchModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    SkeletonModule,
    BadgeModule,
    RippleModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  @ViewChild('productTable') productTable!: Table;

  products = signal<IPerfume[]>([]);
  totalProducts = signal(0);
  isLoading = signal(true);
  isSubmitting = signal(false);
  showDialog = signal(false);
  editingProduct = signal<IPerfume | null>(null);
  selectedImageFile = signal<File | null>(null);

  currentPage = signal(0);
  pageSize = signal(10);
  searchTerm = signal('');

  productForm!: FormGroup;

  readonly vibeOptions: VibeOption[] = [
    { label: 'Fresh', value: 'Fresh' },
    { label: 'Woody', value: 'Woody' },
    { label: 'Floral', value: 'Floral' },
    { label: 'Oriental', value: 'Oriental' },
    { label: 'Aquatic', value: 'Aquatic' },
    { label: 'Citrus', value: 'Citrus' },
    { label: 'Gourmand', value: 'Gourmand' },
    { label: 'Chypre', value: 'Chypre' },
    { label: 'Fougère', value: 'Fougère' },
    { label: 'Spicy', value: 'Spicy' },
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      brand: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      vibe: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
    });
  }

  loadProducts(page = 0): void {
    this.isLoading.set(true);
    this.currentPage.set(page);

    this.apiService
      .getProducts({
        page: page + 1,
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
      })
      .subscribe({
        next: (result) => {
          const products = result.data ?? result;
          this.products.set(products);
          this.totalProducts.set(result.total ?? products.length);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load products. Please try again.',
          });
        },
      });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.loadProducts(0);
  }

  openAddDialog(): void {
    this.editingProduct.set(null);
    this.productForm.reset({ isActive: true, stock: 0 });
    this.selectedImageFile.set(null);
    this.showDialog.set(true);
  }

  openEditDialog(product: IPerfume): void {
    this.editingProduct.set(product);
    this.productForm.patchValue({
      title: product.title,
      brand: product.brand,
      vibe: product.vibe,
      description: product.description,
      price: product.price,
      stock: product.stock,
      isActive: product.isActive ?? true,
    });
    this.selectedImageFile.set(null);
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingProduct.set(null);
    this.productForm.reset({ isActive: true, stock: 0 });
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Invalid File',
          detail: 'Please select a valid image file.',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'warn',
          summary: 'File Too Large',
          detail: 'Image must be smaller than 5MB.',
        });
        return;
      }
      this.selectedImageFile.set(file);
    }
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.productForm.value as CreateProductDto;
    const editing = this.editingProduct();

    const request = editing
      ? this.apiService.updateProduct(editing.id, formValue as UpdateProductDto)
      : this.apiService.createProduct(formValue);

    request.subscribe({
      next: (savedProduct) => {
        const imageFile = this.selectedImageFile();
        if (imageFile && savedProduct.id) {
          this.apiService.uploadProductImage(savedProduct.id, imageFile).subscribe({
            next: () => {
              this.onSaveSuccess(editing);
            },
            error: () => {
              // Product saved, but image upload failed
              this.onSaveSuccess(editing);
              this.messageService.add({
                severity: 'warn',
                summary: 'Image Upload Failed',
                detail: 'Product saved but image could not be uploaded.',
              });
            },
          });
        } else {
          this.onSaveSuccess(editing);
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${editing ? 'update' : 'create'} product. Please try again.`,
        });
      },
    });
  }

  private onSaveSuccess(editing: IPerfume | null): void {
    this.isSubmitting.set(false);
    this.closeDialog();
    this.loadProducts(this.currentPage());
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Product ${editing ? 'updated' : 'created'} successfully.`,
    });
  }

  confirmDelete(product: IPerfume, event: Event): void {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: `Are you sure you want to delete "${product.title}"? This action cannot be undone.`,
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteProduct(product);
      },
    });
  }

  private deleteProduct(product: IPerfume): void {
    this.apiService.deleteProduct(product.id).subscribe({
      next: () => {
        this.loadProducts(this.currentPage());
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `"${product.title}" has been deleted.`,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete product. Please try again.',
        });
      },
    });
  }

  onPageChange(event: { first: number; rows: number }): void {
    const page = Math.floor(event.first / event.rows);
    this.pageSize.set(event.rows);
    this.loadProducts(page);
  }

  getVibeSeverity(
    vibe: string
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
    const map: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'secondary'> = {
      Fresh: 'success',
      Woody: 'warning',
      Floral: 'info',
      Oriental: 'danger',
      Aquatic: 'info',
      Citrus: 'success',
      Gourmand: 'warning',
      Chypre: 'secondary',
      Fougère: 'secondary',
      Spicy: 'danger',
    };
    return map[vibe] ?? 'secondary';
  }

  getStockSeverity(stock: number): 'success' | 'warning' | 'danger' {
    if (stock === 0) return 'danger';
    if (stock < 10) return 'warning';
    return 'success';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field?.errors) return '';
    if (field.errors['required']) return `${fieldName} is required.`;
    if (field.errors['minlength'])
      return `Minimum ${field.errors['minlength'].requiredLength as number} characters.`;
    if (field.errors['maxlength'])
      return `Maximum ${field.errors['maxlength'].requiredLength as number} characters.`;
    if (field.errors['min']) return `Minimum value is ${field.errors['min'].min as number}.`;
    return 'Invalid value.';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  }
}
