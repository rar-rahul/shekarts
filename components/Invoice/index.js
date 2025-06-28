import React from "react";
import { useSelector } from "react-redux";
import customId from "custom-id-new";
import classes from "~/components/Checkout/checkout.module.css";
import styles from './Invoice.module.css';
import { checkPercentage, decimalBalance } from "~/lib/clientFunctions";
import ImageLoader from "../Image";
import { useTranslation } from "react-i18next";

const Invoice = ({ data }) => {
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  const { t } = useTranslation();
  const invoiceId = `WGTL202407${customId({ randomLength: 1, upperCase: true })}`;
  const isoString = data.orderDate;
const date = new Date(isoString);
const year = date.getFullYear();
const month = date.getMonth() + 1; // +1 because getMonth() returns 0-11
const day = date.getDate();
const address = data.billingInfo.house;
const addressParts = address.split(" ");
const part1 = addressParts.slice(0, 5).join(" ");
const part2 = addressParts.slice(5).join(" ");
console.log(data)

  return (
    <div className={styles.invoiceBox}>
    <table cellPadding="0" cellSpacing="0">
        <tr className={styles.top}>
            <td colSpan="4">
                <table>
                    <tr>
                        <td className={styles.title}>
                        {settings.settingsData.logo[0] && (
          <ImageLoader
            src={settings.settingsData.logo[0]?.url}
            width={75}
            height={75}
            alt={settings.settingsData.name}
            quality={100}
          />
        )}                        </td>
        
                        <td>
                        <span className={styles.heading2}>WINTEL GLOBAL TECHNOLOGY
                        PVT LTD</span> <br />
                           <span className={styles.address}>16/1 Shakkar Bazar, Cloth Market Indore</span> <br />
                           <span className={styles.address}>GSTIN:23AADCW7267K1ZX</span><br />
                           <span className={styles.address}>State: 23-Madhya Pradesh</span> 
                       
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        {/* <h3 className={styles.headTax}>Tax Invoice</h3> */}
        <tr className={styles.heading}>
       <td colSpan={4} className={styles.headTax}>
           Tax Invoice
       </td>
   </tr>
        <tr className={styles.information}>
            
            <td colSpan={4}>
                <table>
                    <tr>
                        <td>
                        <span className={styles.heading2}>Bill To</span><br />
                        <span className={styles.heading}>{data.billingInfo.fullName}</span><br />
                      <span className={styles.address}>{part1}</span> <br />
                      <span className={styles.address}>{part2}</span> <br />
                      <span className={styles.address}>{data.billingInfo.city},{data.billingInfo.zipCode}</span> <br />
                      <span className={styles.address}>{data.billingInfo.state}</span> <br />
                      <span className={styles.address}>{data.billingInfo.phone}</span> <br />
                        </td>
                     
                     
                        <td>
                        <span className={styles.heading2}>Invoice Details</span><br />
                        <span className={styles.heading}>Invoice No:</span> #<span className={styles.address}>{invoiceId}</span><br />
                        <span className={styles.heading}>Order Id:</span> #<span className={styles.address}>{data.orderId}</span><br/>
                        <span className={styles.heading}>Order Date:</span> {`${day}-${month}-${year}`}<br />
                        <span className={styles.heading}>Payment Method:</span> <span className={styles.address}>{data.paymentMethod}</span> <br />

                        </td>
                    </tr>
                </table>
            </td>
        </tr>
       
        <tr className={styles.heading}>
       
            <td>
                Item Name
            </td>
            <td>Quantity</td>
            <td align="end">Unit</td>
            
            <td colSpan={2} align="end">
                Price
            </td>
        </tr>
        {data.products.map((item, index) => (
        <tr className={styles.item} key={index}>
        
            <td>
            {item.name}<br/>
            {item.color.name && <span className={styles.heading}>Color: {item.color.name}</span>} <br/> 
                  {item.attribute.name && (
                    <span className={styles.heading}>{`${item.attribute.for}: ${item.attribute.name}`}</span>
                  )}
            </td>
            <td>{item.qty}</td>
            <td align="end">Nos</td>
           
            <td colSpan={2} align="end">
            ₹{item.price}
            </td>
        </tr>
      ))}
       
       <tr className={styles.total}>
            <td colSpan={3}></td>
            <td>
                Amount: ₹{decimalBalance(data.totalPrice)}
            </td>
        </tr>
       <tr className={styles.total}>
            <td colSpan={3}></td>
            <td>
                Discount: ₹{decimalBalance(
                checkPercentage(data.totalPrice, data.coupon?.discount || 0)
              )}
            </td>
        </tr>
       <tr className={styles.total}>
            <td colSpan={3}></td>
            <td>
                Shipping Charges: ₹{data.deliveryInfo.cost}
            </td>
        </tr>
        <tr className={styles.total}>
            <td colSpan={3}></td>
            <td>
                GST: ₹{decimalBalance(data.tax)}
            </td>
        </tr>
        <tr className={styles.total}>
            <td colSpan={3}></td>
            <td>
                Total Amount: ₹{decimalBalance(data.payAmount)}
            </td>
        </tr>
    </table>
</div>
  );
};

export default Invoice;
