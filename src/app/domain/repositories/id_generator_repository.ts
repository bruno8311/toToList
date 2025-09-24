/**
 * Interfaz del repositorio para generación de identificadores únicos
 * Define el contrato que debe cumplir cualquier implementación
 */
export interface IdGeneratorRepository {
  generateId(): string;
}
