import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import classes from "~/components/Checkout/checkout.module.css";
import NewAddress from "~/components/Profile/addressForm";
import HeadData from "~/components/Head";
import GlobalModal from "~/components/Ui/Modal/modal";
import { checkPercentage, fetchData, postData } from "~/lib/clientFunctions";
import { applyCoupon, resetCart, updateBillingData } from "~/redux/cart.slice";
import SignIn from "~/components/Auth/signin";
import SignUp from "~/components/Auth/signup";

const CheckoutNav = dynamic(() => import("~/components/Checkout/checkoutNav"));
const PaymentGatewayList = dynamic(() =>
  import("~/components/Checkout/paymentGatewayList")
);
const ImageLoader = dynamic(() => import("~/components/Image"));

const Checkout = () => {
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  const dispatch = useDispatch();
  const router = useRouter();
  const couponCode = useRef("");
  const { session, status } = useSelector((state) => state.localSession);
  const [visibleTab, setVisibleTab] = useState(1);
  const [changeTab, setChangeTab] = useState(false);
  const [sameShippingAddressValue, setSameShippingAddressValue] =
    useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({});
  const [showPinAvailable, setShowPinAvailable] = useState(false);
  const [shippingChargeInfo, setShippingChargeInfo] = useState({});
  const [newCustomer, setNewCustomer] = useState(false);
  const [_address, _setAddress] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [shippingId, setShippingId] = useState("");
  const [hasMainAddress, setHasMainAddress] = useState(false);
  const [preInfo, setPreInfo] = useState({
    billingInfo: {},
    shippingInfo: {},
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const deliveryLocation = useRef();
  const deliveryArea = useRef();
  const infoForm = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowLoginModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function fetchShippingCharge() {
    try {
      const response = await fetchData(`/api/home/shipping`);
      console.log("res",response)
      if (response.success) {
        setShippingChargeInfo(response.shippingCharge);
      } else {
        toast.error("something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchAddress() {
    try {
      const response = await fetchData(`/api/profile/address`);
      if (response.success && response.user?.address) {
        _setAddress(response.user.address);
        const resp = response.user.address.find(
          (e) => e.addressType === "main address"
        );
        if (resp) {
          const {
            name,
            email,
            phone,
            house,
            city,
            state,
            zipCode,
            country,
            addressTitle,
          } = resp;
          const data = {
            fullName: name,
            phone,
            email,
            house,
            city,
            state,
            zipCode,
            country,
            addressTitle,
          };
          const preData = {
            billingInfo: data,
            shippingInfo: data,
          };
          setPreInfo(preData);
          setAddressId(resp._id);
          setShippingId(resp._id);
          setHasMainAddress(true);
        }
      } else {
        const { billingInfo, shippingInfo } = cartData;
        setPreInfo({ billingInfo, shippingInfo });
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchShippingCharge();
    fetchAddress();
    setDeliveryLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sameShippingAddress = (e) => {
    const isChecked = e.target.checked;
    setSameShippingAddressValue(isChecked);
    let preData = { ...preInfo };
    preData.shippingInfo = preData.billingInfo;
    setPreInfo(preData);
    setShippingId(addressId);
  };

  function selectInfo(id, type) {
    const resp = _address.find((e) => e._id === id);
    if (resp) {
      const {
        name,
        email,
        phone,
        house,
        city,
        state,
        zipCode,
        country,
        addressTitle,
      } = resp;
      const data = {
        fullName: name,
        phone,
        email,
        house,
        city,
        state,
        zipCode,
        country,
        addressTitle,
      };
      let preData = { ...preInfo };
      preData[type === "billing_address" ? "billingInfo" : "shippingInfo"] =
        data;
      setPreInfo(preData);
      type === "billing_address"
        ? setAddressId(resp._id)
        : setShippingId(resp._id);
    }
  }

  const handleInfoSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!deliveryInfo.cost && !deliveryInfo.area) {
        return toast.warning("Please Update The Delivery Information");
      }
      if (!preInfo.billingInfo?.fullName && !preInfo.shippingInfo?.fullName) {
        return toast.warning("Please Update The Billing Information");
      }

      dispatch(
        updateBillingData({
          billingInfo: preInfo.billingInfo,
          shippingInfo: preInfo.shippingInfo,
          deliveryInfo,
        })
      );
      setVisibleTab(2);
      setChangeTab(true);
    } catch (err) {
      console.log(err);
    }
  };

  const setDeliveryLocation = () => {
    const loc = "Local Delivery";
    if (loc.length > 0) {
      if (loc === "International Delivery") {
        const deliveryData = {
          type: "International Delivery",
          cost: shippingChargeInfo.internationalCost,
          area: null,
        };
        setDeliveryInfo(deliveryData);
      } else {
        const deliveryData = {
          type: "Local Delivery",
          cost: 0,
          area: null,
        };
        setDeliveryInfo(deliveryData);
      }
    }
  };

  const setDeliveryArea = () => {
    const area = deliveryArea.current.value;
    const areaInfo = shippingChargeInfo.area.filter((item) =>
      area.includes(item.pincode)
    );

    if(areaInfo.length == 0 && area.length == 6){
      console.log(areaInfo.length)
      setShowPinAvailable(true);
      console.log(showPinAvailable);
    }
    if(areaInfo.length == 1 ){
      console.log(areaInfo.length)
      setShowPinAvailable(false);
      console.log(showPinAvailable);
    }
   
   
    if (area.length > 0) {
      const deliveryData = {
        type: "Local Delivery",
        cost: areaInfo[0]?.price,
        area: areaInfo[0]?.name,
      };
      setDeliveryInfo(deliveryData);
      
    }
  };

  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const selectPaymentMethod = (e) => setPaymentMethod(e.target.value);

  const getTotalPrice = decimalBalance(
    cartData.items.reduce(
      (accumulator, item) => accumulator + item.qty * item.price,
      0
    )
  );

  const discountPrice = (cartData.coupon.discount / 100) * getTotalPrice;

  const getTotalVat = decimalBalance(
    cartData.items.reduce(
      (accumulator, item) =>
        accumulator + checkPercentage(item.qty * item.price, item.vat),
      0
    )
  );

  const getTotalTax = decimalBalance(
    cartData.items.reduce(
      (accumulator, item) =>
        accumulator + checkPercentage(item.qty * item.price, item.tax),
      0
    )
  );

  const finalPrice =
    getTotalPrice +
    getTotalVat +
    getTotalTax +
    (deliveryInfo.cost || 0) -
    discountPrice;

  async function processOrder(method) {
    const data = {
      coupon: cartData.coupon,
      products: cartData.items,
      billingInfo: preInfo.billingInfo,
      shippingInfo: preInfo.shippingInfo,
      deliveryInfo,
      paymentData: {
        method: method,
        id: null,
      },
    };

  const curiorData = { 
    "data": {
       "shipments": [
            {
                "waybill": "",
                "order": "11105874456",
                "sub_order": "BA",
                "order_date": "08-08-2024",
                "total_amount": "299",
                "name": "Raut P",
                "company_name": "",
                "add": "JP Main Road",
                "add2": "",
                "add3": "",
                "pin": "440034",
                "city": "",
                "state": "",
                "country": "IN",
                "phone": "8007656192",
                "alt_phone": "",
                "email": "rahulraut430@gmail.com",
                "is_billing_same_as_shipping": "Yes",
                "billing_name": "",
                "billing_company_name": "",
                "billing_add": "",
                "billing_add2": "",
                "billing_add3": "",
                "billing_pin": "",
                "billing_city": "",
                "billing_state": "",
                "billing_country": "",
                "billing_phone": "",
                "billing_alt_phone": "",
                "billing_email": "",
                "products":[
                    {
                        "product_name": "Jezara Pure Vitamin-C Face Wash | 100% Oil Free Skin",
                        "product_sku": "SKU003",
                        "product_quantity": "1",
                        "product_price": "199",
                        "product_tax_rate": "35.82",
                        "product_hsn_code": "HSN500",
                        "product_discount": "30"
                    }
                ],
                "shipment_length": "10",
                "shipment_width": "10",
                "shipment_height": "10",
                "weight": "0.24",
                "shipping_charges": "0",
                "giftwrap_charges": "",
                "transaction_charges": "",
                "total_discount": "00",
                "first_attemp_discount": "",
                "cod_charges": "",
                "advance_amount": "",
                "cod_amount": "0",
                "payment_mode": "Prepaid",
                "reseller_name": "",
                "eway_bill_number": "",
                "gst_number": "",
                "return_address_id": "1293",
                "api_source" : "1",
                "store_id" :"",
            }
         ], 
      "pickup_address_id" :"1293",
      "access_token" :"5a7b40197cd919337501dd6e9a3aad9a", 
      "secret_key" : "2b54c373427be180d1899400eeb21aab", 
      "logistics" : "Delhivery",  
      "s_type" : "", 
      "order_type" : "" 
     }
    }
    const url = `/api/order/new`;
    const curiUrl = `https://pre-alpha.ithinklogistics.com/api_v3/order/add.json`;
    const formData = new FormData();
    formData.append("checkoutData", JSON.stringify(data));
    const response = await postData(url, formData);
    const delresponse = await postData(curiUrl, curiorData);
    console.log(delresponse);
    response && response.success
      ? (dispatch(resetCart()),
        toast.success("Order successfully placed"),
        router.push(`/checkout/success/${response.createdOrder._id}`))
      : toast.error(response.message || "Something Went Wrong (500)");
  }

  const submitOrder = async () => {
    try {
      if (cartData.items.length === 0) {
        return toast.warning("Your Cart Is Empty");
      }
      if (!deliveryInfo.cost && !deliveryInfo.area) {
        return toast.warning("Please Update The Delivery Information");
      }
      if (!preInfo.billingInfo?.fullName && !preInfo.shippingInfo?.fullName) {
        return toast.warning("Please Update The Billing Information");
      }
      if (paymentMethod === "cod") {
        await processOrder("Cash On Delivery");
      } else if (paymentMethod === "wallet") {
        await processOrder("Wallet");
      } else {
        router.push(`/checkout/${paymentMethod}`);
      }
    } catch (err) {
      toast.error(`Something Went Wrong ${err}`);
      console.log(err);
    }
  };

  return (
    <>
      <HeadData title="Checkout" />
      <div className={classes.top}>
        <div className={classes.card}>
          <div className="custom_container">
            <div className="row">
              <div className="col-lg-7">
                <CheckoutNav
                  tab={visibleTab}
                  setTab={setVisibleTab}
                  changeTab={changeTab}
                />
                {/* shipping, billing and delivery form */}
                <form
                  className={classes.checkout_form}
                  onSubmit={handleInfoSubmit}
                  ref={infoForm}
                  style={{ display: visibleTab === 1 ? "block" : "none" }}
                >
                  <div className={classes.box}>{deliveryTypeJsx()}</div>
                  <div className={classes.box}>
                    {billingInfoJsx()}
                    {!sameShippingAddressValue && shippingInfoJsx()}
                    <button type="submit">{t("continue")}</button>
                  </div>
                </form>
                {/* Payment form */}
                <div
                  className={classes.checkout_form}
                  style={{ display: visibleTab === 2 ? "block" : "none" }}
                >
                  <div className={classes.box}>
                    <PaymentGatewayList
                      selectPaymentMethod={selectPaymentMethod}
                      submitOrder={submitOrder}
                      settings={settings.settingsData.paymentGateway}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className={classes.box}>{reviewJsx()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GlobalModal
        isOpen={newCustomer}
        handleCloseModal={() => {
          setNewCustomer(false);
          fetchAddress();
        }}
      >
        <NewAddress hasMainAddress={hasMainAddress} />
      </GlobalModal>
      {showLoginModal && (
        <div className={classes.overlay}>
          <SignUp
            popup
            hidePopup={() => {
              setShowLoginModal(false);
              router.reload();
            }}
          />
        </div>
      )}
    </>
  );

  function reviewJsx() {
    const validateCoupon = (data) => {
      const coupon = {
        code: data.code,
        discount: data.discount,
      };
      dispatch(applyCoupon(coupon));
    };

    const checkCoupon = async () => {
      try {
        const data = await postData("/api/order/coupon", {
          code: couponCode.current.value.trim(),
        });
        data && data.success
          ? (toast.success(data.message), validateCoupon(data))
          : toast.error(data.message);
      } catch (err) {
        console.log(err);
        toast.error("Something Went Wrong!");
      }
    };
    return (
      <div>
        <h5 className="mt-3">{t("items_in_your_cart")} :</h5>
        <div className={classes.cart_item_list}>
          <table className="table">
            <thead className={classes.cart_item_header}>
              <tr>
                <th>Product</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartData.items.map((item, index) => (
                <tr className={classes.cart_item} key={index}>
                  <td>
                    <div className={classes.cart_container}>
                      <span className={classes.cart_image}>
                        <ImageLoader
                          src={item.image[0]?.url}
                          height={50}
                          width={50}
                          alt={item.name}
                        />
                      </span>
                      <span className={classes.cart_disc}>
                        <b>{item.name}</b>
                        {item.color.name && (
                          <span>Color: {item.color.name}</span>
                        )}
                        {item.attribute.name && (
                          <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
                        )}
                        <span>Qty: {item.qty}</span>
                      </span>
                    </div>
                  </td>
                  <td>
                  
                  ₹{decimalBalance(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className={classes.priceTable}>
            <tbody>
              <tr>
                <td colSpan="2"></td>
                <td className="text-end">{t("Total MRP")}:</td>
                <td className="text-end">
                  
                  ₹{decimalBalance(getTotalPrice)}
                </td>
              </tr>
             
              <tr>
                <td colSpan="2"></td>
                {/* <td className="text-end">{t("vat")}:</td>
                <td className="text-end">
                  {currencySymbol}
                  {decimalBalance(getTotalVat)}
                </td> */}
              </tr>
              <tr>
                <td colSpan="2"></td>
                <td className="text-end">{t("discount")}:</td>
                <td className="text-end">
                  {currencySymbol}.
                  {decimalBalance(discountPrice)}
                </td>
              </tr>
              <tr>
                <td colSpan="2"></td>
                <td className="text-end">{t("Shipping Charge")}:</td>
                <td className="text-end">
                  {currencySymbol}.
                  {decimalBalance(deliveryInfo.cost || 0)}
                </td>
              </tr>
              <tr>
                <td colSpan="2"></td>
                <td className="text-end">{t("tax")}:</td>
                <td className="text-end">
                  {currencySymbol}.
                  {decimalBalance(getTotalTax)}
                </td>
              </tr>
              <tr>
                <td colSpan="2"></td>
                <td className="text-end fw-bold">{t("total")}:</td>
                <td className="text-end fw-bold">
                  {currencySymbol}.
                  {decimalBalance(finalPrice)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="input-group mt-3">
          <input
            type="text"
            ref={couponCode}
            defaultValue={cartData.coupon.code}
            className="form-control p-auto"
            placeholder={t("please_enter_promo_code")}
          />
          <div className="input-group-append">
            <button onClick={checkCoupon}>{t("apply_discount")}</button>
          </div>
        </div>
      </div>
    );
  }

  function shippingInfoJsx() {
    return (
      <div>
        <div className="mb-3">
          <h5>{t("shipping_info")}</h5>
          <div className={classes.payment_list}>
            {_address.map((x, i) => (
              <label className={classes.payment_card_label} key={i}>
                <input
                  type="radio"
                  name="shipping_address"
                  value={x._id}
                  defaultChecked={x._id === shippingId}
                  onChange={() => selectInfo(x._id, "shipping_address")}
                />
                <div
                  className={`${classes.payment_card} ${classes.address_card}`}
                >
                  <span>{x.name}</span>
                  <span>{x.phone}</span>
                  <span>{`${x.house} ${x.state} ${x.zipCode} ${x.country}`}</span>
                  {x.addressType === "main address" && (
                    <div className="badge bg-primary">default</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function billingInfoJsx() {
    return (
      <div>
        {session && (
          <button
            className={classes.updateButton}
            onClick={() => setNewCustomer(true)}
            type="button"
          >
            {t("add_address")}
          </button>
        )}
        <div className="mb-3">
          <h5 className={classes.top_space}>{t("billing_info")}</h5>
          <div className={classes.payment_list}>
            {_address.map((x, i) => (
              <label className={classes.payment_card_label} key={i}>
                <input
                  type="radio"
                  name="billing_address"
                  value={x._id}
                  defaultChecked={x._id === addressId}
                  onChange={() => selectInfo(x._id, "billing_address")}
                />
                <div
                  className={`${classes.payment_card} ${classes.address_card}`}
                >
                  <span>{x.name}</span>
                  <span>{x.phone}</span>
                  <span>{`${x.house} ${x.state} ${x.zipCode} ${x.country}`}</span>
                  {x.addressType === "main address" && (
                    <div className="badge bg-primary">default</div>
                  )}
                </div>
              </label>
            ))}
          </div>
          <div className="py-2 mt-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="Check1"
              onClick={sameShippingAddress}
            />
            <label className="form-check-label" htmlFor="Check1">
              {t("shipping_address_same_as_billing_address")}
            </label>
          </div>
        </div>
      </div>
    );
  }

  function deliveryTypeJsx() {
    return (
      <div>
        <div className="mb-3">
          <div className={classes.input}>
            {/* <h5>{t("select_delivery_type")}*</h5>
            <select
              className="form-control mb-3"
              defaultValue=""
              onChange={setDeliveryLocation}
              ref={deliveryLocation}
            >
              <option value="" disabled>
                {t("select_delivery_type")}*
              </option>
              <option value="International Delivery">
                International Delivery
              </option>
              <option value="Local Delivery">Local Delivery</option>
            </select> */}
            {deliveryInfo.type && deliveryInfo.type === "Local Delivery" && (
              <div>
                <label>{t("Enter Delivery Area")}*</label>
                {/* <select
                  className="form-control mb-3"
                  defaultValue=""
                  onChange={setDeliveryArea}
                  ref={deliveryArea}
                >
                  <option value="" disabled>
                    {t("select_delivery_area")}*
                  </option>
                  {shippingChargeInfo.area?.map((ct, idx) => (
                    <option value={ct._id} key={idx}>
                      {ct.name}
                    </option>
                  ))}
                </select> */}
                <input type="text"
                className="form-control mb-3"
                defaultValue=""
                onKeyUp={setDeliveryArea}
                ref={deliveryArea}
                placeholder="Enter Your Delivery Pincode"
                maxLength={6}
                />
                {deliveryInfo.area && (
                 <span> Delivery Availbale in Your Area </span>
                )}
                 {showPinAvailable &&(
                 <span> Delivery Not Availbale!</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Checkout;
