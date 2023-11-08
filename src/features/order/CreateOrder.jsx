// import { useState } from "react";

import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const dispatch = useDispatch();
  //userSLice
  const {
    username,
    status: addressStatus,
    position,
    error: errorAddress,
    address,
  } = useSelector((state) => state.user);
  const isLoadingAddress = addressStatus === "loading";

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const foremErrors = useActionData();
  const [withPriority, setWithPriority] = useState(false);

  //cartSlice
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-8">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex  flex-col gap-2 sm:flex-row sm:items-center ">
          <label className=" sm:basis-40">First Name</label>
          <div className="grow">
            <input
              className="input "
              type="text"
              name="customer"
              defaultValue={username}
              required
            />
          </div>
        </div>

        <div className="mb-5 flex  flex-col gap-2 sm:flex-row sm:items-center ">
          <label className=" sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input" type="tel" name="phone" required />
            {foremErrors?.phone && (
              <p className="text-xm mt-2 twxt-red-700 bg-red-100 p-2 rounded-md">
                {foremErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex  flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className=" sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input"
              disabled={isLoadingAddress}
              type="text"
              name="address"
              required
            />
            {addressStatus === "error" && (
              <p className="text-xm mt-2 twxt-red-700 bg-red-100 p-2 rounded-md">
                {errorAddress} error
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className=" absolute right-[3px] sm:right-[1px] z-50 top-[3px] md:top-[1px]">
              <Button
                type="small"
                disabled={isLoadingAddress}
                defaultValue={address}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get postion
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex gap-5 items-center">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring-offset-2 focus:ring focus:ring-yellow-400"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority font-medium">
            Want to yo give your order priority?
          </label>
        </div>
        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />
          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting
              ? "Placing order..."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  const error = {};
  if (!isValidPhone(order.phone))
    error.phone = "Please give us your correct phone number.";
  if (Object.keys(error).length > 0) return error;
  const newOrder = await createOrder(order);

  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);

  // return null;
}

export default CreateOrder;
