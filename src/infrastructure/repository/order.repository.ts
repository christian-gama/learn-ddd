import { Id } from "../../domain/common/id";
import type { ToJSON } from "../../domain/common/toJSON";
import { Order, type OrderStatus } from "../../domain/order/order";
import type { OrderItem } from "../../domain/order/order-item";
import type { OrderRepository } from "../../domain/order/repository";
import { prisma } from "../prisma/client";

export class PostgresOrderRepository implements OrderRepository {
  async create(order: Order): Promise<Id> {
    const json = order.toJSON();

    const result = await prisma.order.create({
      data: {
        id: json.id,
        status: json.status,
        customerId: json.customerId,
        deliveryPersonId: json.deliveryPersonId,
        address: {
          city: json.address.city,
          country: json.address.country,
          number: json.address.number,
          street: json.address.street,
          zip: json.address.zip,
        },
        OrderItems: {
          set: json.orderItems.map((item) => ({
            orderId: json.id,
            itemId: item.itemId,
            quantity: item.quantity,
            price: item.price.valueOf(),
          })),
        },
      },
    });

    return Id.fromString(result.id);
  }

  async update(order: Order): Promise<void> {
    const json = order.toJSON();

    await prisma.order.update({
      where: {
        id: json.id,
      },
      data: {
        status: json.status,
        deliveryPersonId: json.deliveryPersonId,
        address: {
          city: json.address.city,
          country: json.address.country,
          number: json.address.number,
          street: json.address.street,
          zip: json.address.zip,
        },
        OrderItems: {
          set: json.orderItems.map((item) => ({
            orderId: json.id,
            itemId: item.itemId,
            quantity: item.quantity,
            price: item.price.valueOf(),
          })),
        },
      },
    });
  }

  async findById(id: Id): Promise<Order | null> {
    const result = await prisma.order.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (!result) {
      return null;
    }

    return Order.fromJSON({
      id: result.id,
      customerId: result.customerId,
      deliveryPersonId: result.deliveryPersonId,
      address: {
        city: (result.address as Record<string, any>).city,
        country: (result.address as Record<string, any>).country,
        number: (result.address as Record<string, any>).number,
        street: (result.address as Record<string, any>).street,
        zip: (result.address as Record<string, any>).zip,
      },
      orderItems: result.OrderItems.map((i) => {
        const item = i as unknown as ToJSON<OrderItem>;

        return {
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price,
          orderId: item.orderId,
        };
      }),
      status: result.status as OrderStatus,
    });
  }

  deleteById(order: Order): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
