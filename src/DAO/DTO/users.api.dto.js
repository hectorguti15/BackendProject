export default class UsersDto{
    constructor(user){
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.cartId = user.cartId;
        this.password = user.password;
        this.age = user.age;
    }
}