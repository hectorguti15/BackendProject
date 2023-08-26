import {  fakerES  as faker} from "@faker-js/faker";


export const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.number.int({min: 6000}),
    price: faker.commerce.price(),
    status: faker.datatype.boolean(),
    stock: faker.number.int({ min: 0, max: 100 }),
    thumbnails: faker.image.url(),
  };
};
