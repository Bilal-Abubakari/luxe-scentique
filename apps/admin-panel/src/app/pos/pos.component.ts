import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { ApiService } from '../core/services/api.service';
import type { IPerfume, CreateWalkInOrderDto } from '@luxe-scentique/shared-types';

interface CartItem {
  product: IPerfume;
  quantity: number;
  lineTotal: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AutoCompleteModule,
    InputNumberModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    CardModule,
    DividerModule,
    TagModule,
    ToastModule,
    BadgeModule,
    RippleModule,
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss',
})
export class PosComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  // Product search
  searchQuery = signal('');
  searchResults = signal<IPerfume[]>([]);
  isSearching = signal(false);
  selectedProduct = signal<IPerfume | null>(null);
  addQuantity = signal(1);

  // Cart
  cartItems = signal<CartItem[]>([]);

  // Sale state
  isSubmitting = signal(false);
  completedOrderNumber = signal<string | null>(null);

  customerForm!: FormGroup;

  ngOnInit(): void {
    this.initCustomerForm();
  }

  private initCustomerForm(): void {
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerEmail: ['', [Validators.email]],
      customerPhone: ['', [Validators.pattern(/^[0-9\s+\-()]{7,15}$/)]],
      notes: [''],
    });
  }

  // ============================================================
  // Product Search
  // ============================================================

  onSearchProducts(event: AutoCompleteCompleteEvent): void {
    const query = event.query;
    if (!query || query.length < 2) {
      this.searchResults.set([]);
      return;
    }

    this.isSearching.set(true);
    this.apiService.getProducts({ search: query, limit: 10, isActive: true }).subscribe({
      next: (result) => {
        const products = (result.data ?? result);
        this.searchResults.set(products.filter((p) => p.stock > 0));
        this.isSearching.set(false);
      },
      error: () => {
        this.isSearching.set(false);
        this.searchResults.set([]);
      },
    });
  }

  onProductSelect(product: IPerfume): void {
    this.selectedProduct.set(product);
    this.addQuantity.set(1);
  }

  // ============================================================
  // Cart Operations
  // ============================================================

  addToCart(): void {
    const product = this.selectedProduct();
    if (!product) return;

    const qty = this.addQuantity();
    if (qty < 1) return;

    const existingIndex = this.cartItems().findIndex(
      (item) => item.product.id === product.id
    );

    if (existingIndex >= 0) {
      this.cartItems.update((items) => {
        const updated = [...items];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + qty;
        const maxQty = product.stock;
        updated[existingIndex] = {
          ...existing,
          quantity: Math.min(newQty, maxQty),
          lineTotal: Math.min(newQty, maxQty) * product.price,
        };
        return updated;
      });
      this.messageService.add({
        severity: 'info',
        summary: 'Updated',
        detail: `${product.title} quantity updated in cart.`,
        life: 2000,
      });
    } else {
      this.cartItems.update((items) => [
        ...items,
        {
          product,
          quantity: qty,
          lineTotal: qty * product.price,
        },
      ]);
      this.messageService.add({
        severity: 'success',
        summary: 'Added to Cart',
        detail: `${product.title} added to cart.`,
        life: 2000,
      });
    }

    // Reset selection
    this.selectedProduct.set(null);
    this.addQuantity.set(1);
    this.searchQuery.set('');
  }

  updateItemQuantity(index: number, newQty: number): void {
    if (newQty < 1) {
      this.removeFromCart(index);
      return;
    }

    this.cartItems.update((items) => {
      const updated = [...items];
      const item = updated[index];
      const maxQty = item.product.stock;
      const safeQty = Math.min(newQty, maxQty);
      updated[index] = {
        ...item,
        quantity: safeQty,
        lineTotal: safeQty * item.product.price,
      };
      return updated;
    });
  }

  removeFromCart(index: number): void {
    const item = this.cartItems()[index];
    this.cartItems.update((items) => items.filter((_, i) => i !== index));
    this.messageService.add({
      severity: 'warn',
      summary: 'Removed',
      detail: `${item.product.title} removed from cart.`,
      life: 2000,
    });
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.customerForm.reset();
    this.selectedProduct.set(null);
    this.addQuantity.set(1);
    this.searchQuery.set('');
    this.completedOrderNumber.set(null);
  }

  // ============================================================
  // Totals
  // ============================================================

  getCartSubtotal(): number {
    return this.cartItems().reduce((sum, item) => sum + item.lineTotal, 0);
  }

  getCartTotal(): number {
    // Walk-in orders have no service fee — pay immediately
    return this.getCartSubtotal();
  }

  getItemCount(): number {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  // ============================================================
  // Complete Sale
  // ============================================================

  completeSale(): void {
    if (this.cartItems().length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Empty Cart',
        detail: 'Please add at least one product to complete the sale.',
      });
      return;
    }

    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please fill in the required customer details.',
      });
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.customerForm.value as {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      notes: string;
    };

    const dto: CreateWalkInOrderDto = {
      customerName: formValue.customerName,
      customerEmail: formValue.customerEmail || undefined,
      customerPhone: formValue.customerPhone || undefined,
      notes: formValue.notes || undefined,
      items: this.cartItems().map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      amountPaid: this.getCartTotal(),
    };

    this.apiService.createWalkInOrder(dto).subscribe({
      next: (order) => {
        this.isSubmitting.set(false);
        const orderNum = order.orderNumber ?? order.id.slice(-8) ?? 'N/A';
        this.completedOrderNumber.set(orderNum);

        this.messageService.add({
          severity: 'success',
          summary: 'Sale Complete!',
          detail: `Order #${orderNum} created successfully. Total: ${this.formatCurrency(this.getCartTotal())}`,
          life: 6000,
        });

        this.clearCart();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Sale Failed',
          detail: 'Could not complete the sale. Please try again.',
        });
      },
    });
  }

  // ============================================================
  // Helpers
  // ============================================================

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getVibeSeverity(
    vibe: string
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | undefined {
    const map: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'secondary'> = {
      CORPORATE: 'secondary',
      CASUAL: 'success',
      EVENING: 'info',
      SPORT: 'warning',
      UNISEX: 'info',
      FEMININE: 'danger',
      MASCULINE: 'warning',
    };
    return map[vibe] ?? 'secondary';
  }
}
