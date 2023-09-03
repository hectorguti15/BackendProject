export default class ProductsDto {
    constructor(product) {
      this.title = product.title;
      this.description = product.description;
      this.code = product.code;
      this.price = product.price;
      this.status = product.status;
      this.stock = product.stock;
      this.thumbnails = product.thumbnails;
      this.owner = product.owner;
    }
  }
  