export const generateUserErrorInfo = (user) => {
  return `
      Completar los campos obligatorios
      Lista de propiedades obligatgorias:
          * first_name: Must be a string. (${user.firstName})
          * last_name: Must be a string. (${user.lastName})
          * email: Must be a string. (${user.email})    
      `;
};

export const generateProductInfo = (product) => {
  return `
      Completar los campos obligatorios
      Lista de propiedades obligatgorias:
          * title: Must be a string. (${product.title})
          * description: Must be a string. (${product.description})
          * Stock: Must be a number. (${product.stock}) 
          * Price: Must be a number. (${product.price})       
          * Code: Must be a string. (${product.code})   
      `;
};

export const generateMessage = (message) => {
  return `
      Completar los campos obligatorios
      Lista de propiedades obligatgorias:
          * user: Must be a string. (${message.user})
          * message: Must be a string. (${message.message})`;
};
