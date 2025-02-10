import { Id } from "../common/id";
import { Price } from "../common/price";
import type { ToJSON } from "../common/toJSON";
import type { ValueObject } from "../common/value-object";

export class OrderItem implements ValueObject {
  protected constructor(
    private readonly ordemId: Id,
    private readonly itemId: Id,
    private readonly quantity: number,
    private readonly price: Price,
  ) {}

  static create(input: CreateOrderItemInput) {
    return new OrderItem(input.orderId, input.itemId, input.quantity, input.price);
  }

  static fromJSON(input: ToJSON<OrderItem>) {
    return new OrderItem(
      new Id(input.orderId),
      new Id(input.itemId),
      input.quantity,
      Price.fromNumber(input.price),
    );
  }

  equals(other: this): boolean {
    return (
      this.ordemId.equals(other.ordemId) &&
      this.itemId.equals(other.itemId) &&
      this.quantity === other.quantity
    );
  }

  getTotal() {
    return this.price.multiply(this.quantity);
  }

  toJSON() {
    return {
      orderId: this.ordemId.toString(),
      itemId: this.itemId.toString(),
      quantity: this.quantity,
      price: this.price.valueOf(),
    };
  }
}

export type CreateOrderItemInput = {
  orderId: Id;
  itemId: Id;
  quantity: number;
  price: Price;
};
