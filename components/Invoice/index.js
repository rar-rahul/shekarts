"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "react-redux";
import customId from "custom-id-new";
import { checkPercentage, decimalBalance } from "~/lib/clientFunctions";

export default function Invoice({ data }) {
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  const invoiceId = `WGTL202407${customId({ randomLength: 1, upperCase: true })}`;

  // Format Date
  const date = new Date(data.orderDate);
  const formattedDate = date.toLocaleDateString("en-IN");

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200 p-6 text-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div className="flex items-center gap-3">
          {settings.settingsData.logo[0] && (
            <img
              src={settings.settingsData.logo[0]?.url}
              alt={settings.settingsData.name}
              className="w-16 h-16 object-contain"
            />
          )}
          <div>
            <h2 className="text-lg font-bold">{settings.settingsData.name}</h2>
            <p className="text-gray-600 text-xs">16/1 Shakkar Bazar, Cloth Market Indore</p>
            <p className="text-gray-600 text-xs">GSTIN: 23AADCW7267K1ZX</p>
            <p className="text-gray-600 text-xs">State: 23-Madhya Pradesh</p>
          </div>
        </div>
        <QRCodeCanvas value={invoiceId} size={80} />
      </div>

      {/* Invoice Title */}
      <h3 className="text-center text-lg font-semibold border-b pb-2 mb-4">Tax Invoice</h3>

      {/* Invoice Info */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Billing Info */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Bill To</h4>
          <p>{data.billingInfo.fullName}</p>
          <p>{data.billingInfo.house}</p>
          <p>
            {data.billingInfo.city}, {data.billingInfo.zipCode}
          </p>
          <p>{data.billingInfo.state}</p>
          <p>{data.billingInfo.phone}</p>
        </div>

        {/* Invoice Details */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Invoice Details</h4>
          <p>
            <span className="font-medium">Invoice No:</span> #{invoiceId}
          </p>
          <p>
            <span className="font-medium">Order Id:</span> #{data.orderId}
          </p>
          <p>
            <span className="font-medium">Order Date:</span> {formattedDate}
          </p>
          <p>
            <span className="font-medium">Payment Method:</span> {data.paymentMethod}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left py-2 px-3">Item</th>
              <th className="text-center py-2 px-3">Qty</th>
              <th className="text-center py-2 px-3">Unit</th>
              <th className="text-right py-2 px-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-3">
                  <span className="font-medium">{item.name}</span>
                  {item.color?.name && (
                    <p className="text-xs text-gray-600">Color: {item.color.name}</p>
                  )}
                  {item.attribute?.name && (
                    <p className="text-xs text-gray-600">
                      {item.attribute.for}: {item.attribute.name}
                    </p>
                  )}
                </td>
                <td className="text-center py-2 px-3">{item.qty}</td>
                <td className="text-center py-2 px-3">Nos</td>
                <td className="text-right py-2 px-3">
                  {currencySymbol}
                  {decimalBalance(item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-6 flex justify-end">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Amount:</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.totalPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>
              {currencySymbol}
              {decimalBalance(checkPercentage(data.totalPrice, data.coupon?.discount || 0))}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.deliveryInfo.cost)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>GST:</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.tax)}
            </span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total:</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.payAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500 border-t pt-3">
        Thank you for shopping with {settings.settingsData.name}.  
        <br />
        This is a computer-generated invoice.
      </div>
    </div>
  );
}
 
