import type { Id } from "../common/id";
import type { Item } from "./item";

export interface ItemRepository {
  create(item: Item): Promise<Id>;
  update(item: Item): Promise<void>;
  findById(id: Id): Promise<Item | null>;
  deleteById(item: Item): Promise<void>;
}
