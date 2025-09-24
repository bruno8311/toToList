import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { CategoryItemModel } from '../models/category_item_model';

@Injectable({
  providedIn: 'root'
})
export class CategoryLocalDatasource {
  private readonly CATEGORIES_KEY = 'categories';
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init(): Promise<void> {
    this._storage = await this.storage.create();
  }

  getAllCategories(): Observable<CategoryItemModel[]> {
    return from(this.getStoredCategories());
  }

  async getCategory(id: string): Promise<CategoryItemModel | null> {
    const categories = await this.getStoredCategories();
    const found = categories.find(cat => cat.id === id);
    return found || null;
  }

  async saveCategory(category: CategoryItemModel): Promise<CategoryItemModel> {
    const categories = await this.getStoredCategories();
    const updatedCategories = [...categories, category];
    await this.saveCategories(updatedCategories);
    return category;
  }

  async updateCategory(category: CategoryItemModel): Promise<CategoryItemModel> {
    const categories = await this.getStoredCategories();
    const index = categories.findIndex(cat => cat.id === category.id);
    
    if (index === -1) {
      throw new Error('Categoría no encontrada');
    }

    categories[index] = category;
    await this.saveCategories(categories);
    return category;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getStoredCategories();
    const filteredCategories = categories.filter(cat => cat.id !== id);
    
    if (categories.length === filteredCategories.length) {
      return false; // No se encontró la categoría
    }

    await this.saveCategories(filteredCategories);
    return true;
  }

  async categoryNameExists(name: string, excludeId?: string): Promise<boolean> {
    const categories = await this.getStoredCategories();
    const trimmedName = name.trim().toLowerCase();
    
    return categories.some(cat => 
      cat.name.trim().toLowerCase() === trimmedName && 
      cat.id !== excludeId
    );
  }

  private async getStoredCategories(): Promise<CategoryItemModel[]> {
    if (!this._storage) {
      await this.init();
    }
    
    const stored = await this._storage?.get(this.CATEGORIES_KEY) || [];
    return stored.map((item: any) => CategoryItemModel.fromJson(item));
  }

  private async saveCategories(categories: CategoryItemModel[]): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
    
    const toStore = categories.map(cat => cat.toStorage());
    await this._storage?.set(this.CATEGORIES_KEY, toStore);
  }
}
