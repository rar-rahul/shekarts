import mongoose from "mongoose";

export const settings = {
  name: String,
  title: String,
  address: String,
  shortAddress: String,
  email: String,
  description: String,
  phoneHeader: String,
  phoneFooter: String,
  copyright: String,
  logo: Array,
  favicon: Array,
  gatewayImage: Array,
  headerCustomScript: String,
  footerCustomScript: String,
  language: { type: String, default: "en" },
  footerBanner: {
    security: {
      title: String,
      description: String,
    },
    support: {
      title: String,
      description: String,
    },
    delivery: {
      title: String,
      description: String,
    },
  },
  seo: {
    title: String,
    description: String,
    keyword: String,
    image: Array,
  },
  social: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
    pinterest: String,
  },
  currency: {
    name: { type: String, default: "USD" },
    symbol: { type: String, default: "$" },
    exchangeRate: { type: Number, default: 1 },
  },
  color: {
    primary: String,
    primary_hover: String,
    secondary: String,
    body_gray: String,
    body_gray_contrast: String,
    primary_contrast: String,
    primary_hover_contrast: String,
    secondary_contrast: String,
  },
  script: {
    googleSiteVerificationId: String,
    facebookAppId: String,
    googleAnalyticsId: String,
    facebookPixelId: String,
    messengerPageId: String,
  },
  paymentGateway: {
    cod: { type: Boolean, default: true },
    paypal: { type: Boolean, default: false },
    stripe: { type: Boolean, default: false },
    sslCommerz: { type: Boolean, default: false },
    razorpay: { type: Boolean, default: false },
  },
  login: {
    facebook: { type: Boolean, default: false },
    google: { type: Boolean, default: false },
  },
  security: {
    loginForPurchase: { type: Boolean, default: true },
  },
};

export const attribute = {
  name: String,
  values: Array,
};

export const category = {
  categoryId: String,
  name: String,
  icon: Array,
  slug: String,
  subCategories: [
    {
      id: String,
      name: String,
      slug: String,
      child: [
        {
          name: String,
          slug: String,
        },
      ],
    },
  ],
  topCategory: { type: Boolean, default: false },
};

export const brand = {
  brandId: String,
  name: String,
  image: Array,
  slug: String,
  topBrand: { type: Boolean, default: false },
};

export const color = {
  name: String,
  value: String,
};

export const coupon = {
  code: { type: String, unique: true },
  amount: Number,
  active: Date,
  expired: Date,
};

export const newsletter = {
  subscribers: [
    {
      email: String,
      date: { type: Date, default: Date.now },
    },
  ],
};

export const order = {
  orderId: String,
  orderDate: { type: Date, default: Date.now },
  products: Array,
  status: String,
  paymentStatus: String,
  billingInfo: Object,
  shippingInfo: Object,
  deliveryInfo: Object,
  paymentMethod: String,
  paymentId: String,
  totalPrice: Number,
  payAmount: Number,
  coupon: Object,
  orderStatus: String,
  paymentStatus: String,
  vat: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  new: { type: Boolean, default: true },
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
};

export const product = {
  date: { type: Date, default: Date.now },
  name: String,
  slug: String,
  productId: String,
  unit: String,
  unitValue: String,
  price: Number,
  discount: Number,
  description: String,
  shortDescription: String,
  type: String,
  image: Array,
  gallery: Array,
  categories: Array,
  subcategories: Array,
  childCategories: Array,
  brand: String,
  currency: String,
  trending: { type: Boolean, default: false },
  new: { type: Boolean, default: false },
  bestSelling: { type: Boolean, default: false },
  quantity: Number,
  sku: String,
  colors: Array,
  attributes: Array,
  variants: Array,
  attributeIndex: String,
  seo: {
    title: String,
    description: String,
    image: Array,
  },
  review: [
    {
      date: { type: Date, default: Date.now },
      userName: String,
      email: String,
      rating: Number,
      comment: String,
    },
  ],
  question: [
    {
      date: { type: Date, default: Date.now },
      userName: String,
      email: String,
      question: String,
      answer: String,
    },
  ],
  vat: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
};

export const shippingCharge = {
  area: [
    {
      name: String,
      price: Number,
      pincode:Number,
    },
  ],
  internationalCost: Number,
};

export const user = {
  name: String,
  email: { type: String, default: null },
  phone: { type: String, unique: true,trim: true},
  house: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  image: String,
  hash: String,
  salt: String,
  isAdmin: { type: Boolean, default: false },
  isStaff: {
    status: { type: Boolean, default: false },
    surname: String,
    permissions: Array,
  },
  emailVerified: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
  favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
  refundRequest: [
    { type: mongoose.Schema.Types.ObjectId, ref: "refundRequest" },
  ],
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: "address" }],
};

export const webpage = {
  homePage: {
    carousel: {
      background: Array,
      carouselData: Array,
    },
    banner: {
      title: String,
      subTitle: String,
      description: String,
      url: String,
      image: Array,
    },
    collection: {
      scopeA: {
        title: String,
        url: String,
        image: Array,
      },
      scopeB: {
        title: String,
        url: String,
        image: Array,
      },
      scopeC: {
        title: String,
        url: String,
        image: Array,
      },
      scopeD: {
        title: String,
        url: String,
        image: Array,
      },
    },
  },
  aboutPage: {
    content: String,
  },
  privacyPage: {
    content: String,
  },
  termsPage: {
    content: String,
  },
  returnPolicyPage: {
    content: String,
  },
  faqPage: {
    content: String,
  },
};

export const notification = {
  message: String,
  createdAt: { type: Date, expires: 604800, default: Date.now },
};

export const refundRequest = {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  product: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    name: String,
    color: String,
    attribute: String,
    price: Number,
    qty: Number,
    vat: Number,
    tax: Number,
  },
  refundReason: String,
  status: String,
  attachments: [],
  refundAmount: Number,
  orderId: String,
  note: String,
  date: { type: Date, default: Date.now },
};

export const address = {
  name: String,
  email: String,
  phone: String,
  house: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  addressType: String,
  addressTitle: String,
};
