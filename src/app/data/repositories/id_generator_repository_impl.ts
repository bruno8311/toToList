import { Injectable } from '@angular/core';
import { IdGeneratorRepository } from '../../domain/repositories/id_generator_repository';
import { UuidDatasource } from '../datasources/uuid_datasource';

/**
 * Implementación del repositorio de generación de IDs usando UUID
 */
@Injectable({
  providedIn: 'root'
})
export class IdGeneratorRepositoryImpl implements IdGeneratorRepository {
  
  constructor(private uuidDatasource: UuidDatasource) {}

  generateId(): string {
    return this.uuidDatasource.generateUuid();
  }
}
