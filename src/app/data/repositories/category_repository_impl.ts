import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { CategoryRepository } from '../../domain/repositories/category_repository';
import { Category } from '../../domain/entities/category';
import { CategoryMapper } from '../mappers/category_mapper';
import { CategoryReactiveDatasource } from '../datasources/category_reactive_datasource';
import { CategoryLocalDatasource } from '../datasources/category_local_datasource';

@Injectable({
  providedIn: 'root'
})
export class CategoryRepositoryImpl implements CategoryRepository {

  constructor(
    private reactiveDatasource: CategoryReactiveDatasource,
    private localDatasource: CategoryLocalDatasource
  ) {
  }

  getAllCategories(): Observable<Category[]> {
    return this.reactiveDatasource.categories$.pipe(
      map(categoryModels => CategoryMapper.toDomainList(categoryModels)),
      catchError(error => {
        console.error('Error al obtener todas las categorías:', error);
        return throwError(() => new Error('Error al obtener las categorías'));
      })
    );
  }

  getCategory(id: string): Observable<Category | null> {
    if (!id || id.trim().length === 0) {
      return throwError(() => new Error('El ID de la categoría es requerido'));
    }

    return from(this.localDatasource.getCategory(id)).pipe(
      map(categoryModel => {
        return categoryModel ? CategoryMapper.toDomain(categoryModel) : null;
      }),
      catchError(error => {
        console.error('Error al obtener la categoría:', error);
        return throwError(() => new Error('Error al obtener la categoría'));
      })
    );
  }

  addCategory(category: Category): Observable<Category> {
    if (!category) {
      return throwError(() => new Error('La categoría es requerida'));
    }

    return from(this.reactiveDatasource.categoryNameExists(category.name)).pipe(
      switchMap(exists => {
        if (exists) {
          return throwError(() => new Error('Ya existe una categoría con ese nombre'));
        }

        const categoryModel = CategoryMapper.toData(category);
        return from(this.reactiveDatasource.addCategory(categoryModel)).pipe(
          map(savedModel => CategoryMapper.toDomain(savedModel)),
          catchError(error => {
            console.error('Error al agregar la categoría:', error);
            return throwError(() => new Error('Error al agregar la categoría'));
          })
        );
      })
    );
  }

  updateCategory(category: Category): Observable<Category> {
    if (!category) {
      return throwError(() => new Error('La categoría es requerida'));
    }

    return this.getCategory(category.id).pipe(
      switchMap(existingCategory => {
        if (!existingCategory) {
          return throwError(() => new Error('La categoría no existe'));
        }

        return from(this.reactiveDatasource.categoryNameExists(category.name, category.id)).pipe(
          switchMap(exists => {
            if (exists) {
              return throwError(() => new Error('Ya existe una categoría con ese nombre'));
            }

            const categoryModel = CategoryMapper.toData(category);
            return from(this.reactiveDatasource.updateCategory(categoryModel)).pipe(
              map(updatedModel => CategoryMapper.toDomain(updatedModel)),
              catchError(error => {
                console.error('Error al actualizar la categoría:', error);
                return throwError(() => new Error('Error al actualizar la categoría'));
              })
            );
          })
        );
      })
    );
  }

  deleteCategory(id: string): Observable<boolean> {
    if (!id || id.trim().length === 0) {
      return throwError(() => new Error('El ID de la categoría es requerido'));
    }

    return this.getCategory(id).pipe(
      switchMap(category => {
        if (!category) {
          return throwError(() => new Error('La categoría no existe'));
        }

        return from(this.reactiveDatasource.deleteCategory(id)).pipe(
          catchError(error => {
            console.error('Error al eliminar la categoría:', error);
            return throwError(() => new Error('Error al eliminar la categoría'));
          })
        );
      })
    );
  }
}
