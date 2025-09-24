import { Category } from '../../domain/entities/category';
import { CategoryItemModel } from '../models/category_item_model';

export class CategoryMapper {

  static toDomain(model: CategoryItemModel): Category {
    return new Category(
      model.id,
      model.name
    );
  }

  static toData(entity: Category): CategoryItemModel {
    return new CategoryItemModel(
      entity.id,
      entity.name,
    );
  }

  static toDomainList(models: CategoryItemModel[]): Category[] {
    return models.map(model => CategoryMapper.toDomain(model));
  }

}
