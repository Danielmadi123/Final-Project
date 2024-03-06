import { boolean } from "joi";

const normalizeData = (inputsValue) => {
  return {
    name: {
      first: inputsValue.first,
      middle: inputsValue.middle,
      last: inputsValue.last,
    },
    phone: inputsValue.phone,
    email: inputsValue.email,
    password: inputsValue.password,
    url: {
      url: inputsValue.url,
      alt: inputsValue.alt,
    },
    address: {
      state: inputsValue.state,
      country: inputsValue.country,
      city: inputsValue.city,
      street: inputsValue.street,
      houseNumber: inputsValue.houseNumber,
      zip: +inputsValue.zip,
    },
    isBusiness: boolean,
    isAdmin: boolean,
  };
};
export { normalizeData };
