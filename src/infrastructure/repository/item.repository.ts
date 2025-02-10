import { Id } from "../../domain/common/id";
import { Item } from "../../domain/item/item";
import type { ItemRepository } from "../../domain/item/repository";
import { prisma } from "../prisma/client";

export class PostgresItemRepository implements ItemRepository {
  async create(item: Item): Promise<Id> {
    const json = item.toJSON();

    const result = await prisma.item.create({
      data: {
        id: json.id,
        name: json.name,
        isActive: json.isActive,
        price: json.price,
        category: json.category,
        sku: json.sku,
      },
    });

    return Id.fromString(result.id);
  }

  async update(item: Item): Promise<void> {
    const json = item.toJSON();

    await prisma.item.update({
      where: {
        id: json.id,
      },
      data: {
        name: json.name,
        price: json.price,
        category: json.category,
        sku: json.sku,
        isActive: json.isActive,
      },
    });
  }

  async findById(id: Id): Promise<Item | null> {
    const result = await prisma.item.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (!result) {
      return null;
    }

    return Item.fromJSON({
      id: result.id,
      sku: result.sku,
      category: result.category,
      name: result.name,
      price: result.price,
      isActive: result.isActive,
    });
  }

  deleteById(item: Item): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
