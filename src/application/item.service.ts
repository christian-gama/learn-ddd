import { Id } from "../domain/common/id";
import { Price } from "../domain/common/price";
import { Item } from "../domain/item/item";
import type { ItemRepository } from "../domain/item/repository";

export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async createItem(dto: ItemDTO): Promise<string> {
    const item = Item.create({
      name: dto.name,
      price: Price.fromNumber(dto.price),
      category: dto.category,
      sku: dto.sku,
    });

    const id = await this.itemRepository.create(item);

    return id.toString();
  }

  async updateItem(id: string, dto: Partial<ItemDTO>): Promise<void> {
    const item = await this.itemRepository.findById(Id.fromString(id));
    if (!item) {
      throw new Error("Item not found");
    }

    if (dto.name) {
      item.rename(dto.name);
    }

    if (dto.price) {
      item.changePrice(Price.fromNumber(dto.price));
    }

    if (dto.category) {
      item.changeCategory(dto.category);
    }

    if (dto.sku) {
      item.changeSku(dto.sku);
    }

    await this.itemRepository.update(item);
  }
}

export type ItemDTO = {
  name: string;
  price: number;
  category: string;
  sku: string;
};
