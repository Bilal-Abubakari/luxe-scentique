import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from '../../core/services/api.service';
import { ExpenseCategory } from '@luxe-scentique/shared-types';
import type { IExpense } from '@luxe-scentique/shared-types';
interface CategoryOption { label: string; value: ExpenseCategory | null }
const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.INVENTORY_PURCHASE]: 'Inventory Purchase',
  [ExpenseCategory.SALARY]: 'Salary',
  [ExpenseCategory.RENT]: 'Rent',
  [ExpenseCategory.UTILITIES]: 'Utilities',
  [ExpenseCategory.MARKETING]: 'Marketing',
  [ExpenseCategory.SUPPLIES]: 'Supplies',
  [ExpenseCategory.TRANSPORT]: 'Transport',
  [ExpenseCategory.MAINTENANCE]: 'Maintenance',
  [ExpenseCategory.TAX]: 'Tax',
  [ExpenseCategory.INSURANCE]: 'Insurance',
  [ExpenseCategory.OTHER]: 'Other',
};
const CATEGORY_SEVERITY: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
  INVENTORY_PURCHASE: 'info', SALARY: 'secondary', RENT: 'warn',
  UTILITIES: 'warn', MARKETING: 'info', SUPPLIES: 'secondary',
  TRANSPORT: 'secondary', MAINTENANCE: 'warn', TAX: 'danger',
  INSURANCE: 'secondary', OTHER: 'secondary',
};
@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, DatePipe,
    TableModule, ButtonModule, DialogModule, SelectModule, InputTextModule,
    InputNumberModule, TextareaModule, DatePickerModule, TagModule, ToastModule,
    SkeletonModule, ConfirmDialogModule, CardModule, RippleModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly msg = inject(MessageService);
  private readonly confirm = inject(ConfirmationService);
  private readonly fb = inject(FormBuilder);
  expenses = signal<IExpense[]>([]);
  total = signal(0);
  isLoading = signal(true);
  isSaving = signal(false);
  showDialog = signal(false);
  editingId = signal<string | null>(null);
  currentPage = signal(0);
  pageSize = signal(15);
  filterCategory = signal<ExpenseCategory | null>(null);
  filterStartDate = signal<Date | null>(null);
  filterEndDate = signal<Date | null>(null);
  totalAmount = signal(0);
  readonly categoryFilterOptions: CategoryOption[] = [
    { label: 'All Categories', value: null },
    ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ label, value: value as ExpenseCategory })),
  ];
  readonly categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ label, value: value as ExpenseCategory }));
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    category: [null as ExpenseCategory | null, Validators.required],
    date: [new Date(), Validators.required],
    vendor: [''],
    description: [''],
    reference: [''],
  });
  ngOnInit(): void { this.loadExpenses(); }
  loadExpenses(page = 0): void {
    this.isLoading.set(true);
    this.currentPage.set(page);
    const query: Record<string, string | number> = { page: page + 1, limit: this.pageSize() };
    if (this.filterCategory()) query['category'] = this.filterCategory()!;
    if (this.filterStartDate()) query['startDate'] = (this.filterStartDate() as Date).toISOString().split('T')[0];
    if (this.filterEndDate()) query['endDate'] = (this.filterEndDate() as Date).toISOString().split('T')[0];
    this.api.getExpenses(query).subscribe({
      next: ({ data, total }) => {
        this.expenses.set(data); this.total.set(total);
        this.totalAmount.set(data.reduce((s, e) => s + e.amount, 0));
        this.isLoading.set(false);
      },
      error: () => { this.isLoading.set(false); this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to load expenses.' }); },
    });
  }
  openAddDialog(): void {
    this.editingId.set(null);
    this.form.reset({ date: new Date() });
    this.showDialog.set(true);
  }
  openEditDialog(expense: IExpense): void {
    this.editingId.set(expense.id);
    this.form.patchValue({
      title: expense.title, amount: expense.amount, category: expense.category,
      date: new Date(expense.date), vendor: expense.vendor ?? '',
      description: expense.description ?? '', reference: expense.reference ?? '',
    });
    this.showDialog.set(true);
  }
  saveExpense(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving.set(true);
    const val = this.form.getRawValue();
    const dto = {
      title: val.title!, amount: val.amount!, category: val.category!,
      date: (val.date as Date).toISOString().split('T')[0],
      vendor: val.vendor || undefined, description: val.description || undefined,
      reference: val.reference || undefined,
    };
    const id = this.editingId();
    const obs = id ? this.api.updateExpense(id, dto) : this.api.createExpense(dto);
    obs.subscribe({
      next: () => {
        this.showDialog.set(false); this.isSaving.set(false);
        this.msg.add({ severity: 'success', summary: id ? 'Updated' : 'Created', detail: `Expense "${dto.title}" ${id ? 'updated' : 'recorded'}.` });
        this.loadExpenses(id ? this.currentPage() : 0);
      },
      error: () => { this.isSaving.set(false); this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to save expense.' }); },
    });
  }
  deleteExpense(expense: IExpense): void {
    this.confirm.confirm({
      header: 'Delete Expense', message: `Delete "${expense.title}"?`, icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: { severity: 'danger', label: 'Delete' },
      rejectButtonProps: { severity: 'secondary', label: 'Cancel', outlined: true },
      accept: () => {
        this.api.deleteExpense(expense.id).subscribe({
          next: () => { this.msg.add({ severity: 'success', summary: 'Deleted', detail: `"${expense.title}" removed.` }); this.loadExpenses(0); },
          error: () => { this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete.' }); },
        });
      },
    });
  }
  onPageChange(event: { first: number; rows: number }): void {
    this.pageSize.set(event.rows);
    this.loadExpenses(Math.floor(event.first / event.rows));
  }
  applyFilters(): void { this.loadExpenses(0); }
  clearFilters(): void {
    this.filterCategory.set(null); this.filterStartDate.set(null); this.filterEndDate.set(null);
    this.loadExpenses(0);
  }
  getCategorySeverity(cat: string) { return CATEGORY_SEVERITY[cat] ?? 'secondary'; }
  getCategoryLabel(cat: string): string { return CATEGORY_LABELS[cat as ExpenseCategory] ?? cat; }
  fmt(amount: number): string {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', minimumFractionDigits: 2 }).format(amount ?? 0);
  }
  get skeletonRows(): null[] { return Array.from({ length: 8 }); }
  get dialogTitle(): string { return this.editingId() ? 'Edit Expense' : 'Record New Expense'; }
  isFieldInvalid(field: string): boolean { const c = this.form.get(field); return !!(c && c.invalid && c.touched); }
}
