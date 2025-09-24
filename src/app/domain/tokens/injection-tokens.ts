import { InjectionToken } from '@angular/core';
import { CategoryRepository } from '../repositories/category_repository';
import { TaskRepository } from '../repositories/task_repository';
import { IdGeneratorRepository } from '../repositories/id_generator_repository';

/**
 * Tokens de inyección para los repositorios
 * Estos tokens permiten usar interfaces en la inyección de dependencias de Angular
 */
export const CATEGORY_REPOSITORY_TOKEN = new InjectionToken<CategoryRepository>('CategoryRepository');
export const TASK_REPOSITORY_TOKEN = new InjectionToken<TaskRepository>('TaskRepository');
export const ID_GENERATOR_REPOSITORY_TOKEN = new InjectionToken<IdGeneratorRepository>('IdGeneratorRepository');
