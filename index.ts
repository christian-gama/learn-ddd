import { ItemQuery } from "./src/application/item.query";
import { ItemService, type ItemDTO } from "./src/application/item.service";
import { OrderQuery } from "./src/application/order.query";
import {
  type OrderDTO,
  OrderService,
  type ReassignDeliveryPersonDTO,
} from "./src/application/order.service";
import { Id } from "./src/domain/common/id";
import { Item } from "./src/domain/item/item";
import { PostgresItemRepository } from "./src/infrastructure/repository/item.repository";
import { PostgresOrderRepository } from "./src/infrastructure/repository/order.repository";

const postgresOrderRepository = new PostgresOrderRepository();
const postgresItemRepository = new PostgresItemRepository();
const itemQuery = new ItemQuery();
const orderService = new OrderService(postgresOrderRepository, itemQuery);
const orderQuery = new OrderQuery();
const itemService = new ItemService(postgresItemRepository);

const itemDTO: ItemDTO = {
  name: "Bola",
  price: 10,
  category: "Esportes",
  sku: "SKU-123",
};

const itemID = await itemService.createItem(itemDTO);

await itemService.updateItem(itemID, {
  name: "Bola de Futebol",
});

const orderDTO: OrderDTO = {
  address: {
    city: "Vitória da Conquista",
    country: "Brasil",
    zip: "45000-000",
    number: "123",
    street: "Rua 1",
  },
  deliveryPersonId: Bun.randomUUIDv7(),
  customerId: Bun.randomUUIDv7(),
  orderItems: [
    {
      id: itemID,
      price: 20,
      quantity: 3,
    },
  ],
};

const id = await orderService.createOrder(orderDTO);

const order = await postgresOrderRepository.findById(Id.fromString(id));

if (!order) {
  throw new Error("Order not found");
}

order?.deliver();

await postgresOrderRepository.update(order);

await orderService.reassignDeliveryPerson(id, { deliveryPersonId: Bun.randomUUIDv7() });
