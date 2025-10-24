import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { signOut } from "next-auth/react";
import { Inter } from 'next/font/google'

import "react-toastify/dist/ReactToastify.css";
import classes from "./footer.module.css";
import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";
import {
  Headset,
  ShieldCheck,
  Truck,
  Facebook,
  Instagram,
  Pinterest,
  Twitter,
  Youtube,
  Envelope,
  GeoAlt ,
  Phone 
} from "@styled-icons/bootstrap";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

const ImageLoader = dynamic(() => import("~/components/Image"));
const Newsletter = dynamic(() => import("./newsletter"));

const inter = Inter({
  subsets: ['latin'],
  style: 'normal',
  display: 'swap',
})

const Footer = (props) => {
  // Selecting settings from global state
  const settings = useSelector((state) => state.settings);
  const { session } = useSelector((state) => state.localSession);
  const { t } = useTranslation();
  const footer_link = {
    company: [
      {
        name: t("about_us"),
        link: "/about",
      },
    ],
    shop: [
      
      {
        name: t("privacy_policy"),
        link: "/privacy",
      },
      {
        name: t("terms_and_conditions"),
        link: "/terms",
      },
      {
        name: t("return_policy"),
        link: "/return",
      },
    ],
    account: [
      {
        name: t("signin"),
        link: "/signin",
      },
      {
        name: t("profile"),
        link: "/profile",
      },
      {
        name: t("track_order"),
        link: "/order-track",
      },
    ],
  };

  if (props.visibility)
    return (
      <>
        <footer className={classes.footer_container}>
          <div className="custom_container">
            <div className="row m-0">
              <div className="col-md-4 px-0 py-4">
                <div className={classes.icon_container}>
                  <ShieldCheck className={classes.icon} />
                </div>
                <div className={classes.content}>
                  <h6>{settings.settingsData.footerBanner.security.title}</h6>
                  <p>
                    {settings.settingsData.footerBanner.security.description}
                  </p>
                </div>
              </div>
              <div className="col-md-4 px-0 py-4">
                <div className={classes.icon_container}>
                  <Headset className={classes.icon} />
                </div>
                <div className={classes.content}>
                  <h6>{settings.settingsData.footerBanner.support.title}</h6>
                  <p>
                    {settings.settingsData.footerBanner.support.description}
                  </p>
                </div>
              </div>
              <div className="col-md-4 px-0 py-4">
                <div className={classes.icon_container}>
                  <Truck className={classes.icon} />
                </div>
                <div className={classes.content}>
                  <h6>{settings.settingsData.footerBanner.delivery.title}</h6>
                  <p>
                    {settings.settingsData.footerBanner.delivery.description}
                  </p>
                </div>
              </div>
            </div>
            <hr className="mx-0" />
            <Newsletter />
            <div className="row">
              <div className="col-md-3 px-3 py-2">
                <Link href="/">
                  <div className={classes.logo}>
                    {settings.settingsData.logo[0] && (
                      <ImageLoader
                        src={settings.settingsData.logo[0]?.url}
                        width={250}
                        height={85}
                        alt={settings.settingsData.name}
                      />
                    )}
                  </div>
                </Link>
                <div className={classes.address}>
                  <h1>{settings.settingsData.description}</h1>
                </div>
              </div>
              <div className="col-md-3 px-3 py-2">
                <h3 className={classes.footer_heading}>{t("contact_info")}</h3>
                <div className={classes.address}>
                  <div className="d-flex py-2">
      <label className="me-2"><GeoAlt width={18} height={18} /></label>
      <p className="mb-0">{settings.settingsData.address}</p>
    </div>
                  <div className="d-flex py-2">
      <label className="me-2"><Envelope width={18} height={18} /></label>
      <a
        className={`${classes.address_content} mb-0`}
        href={`mailto:${settings.settingsData.email}`}
      >
         
        {settings.settingsData.email}
      </a>
    </div>
                   <div className="d-flex py-2">
      <label className="me-2"><Phone width={18} height={18} /></label>
      <a
        className={`${classes.address_content} mb-0`}
        href={`tel:${settings.settingsData.phoneFooter}`}
      >
        {settings.settingsData.phoneFooter}
      </a>
    </div>
                </div>
              </div>
              <div className="col-md-3 px-3 py-2">
                <h3 className={classes.footer_heading}>{t("quick_links")}</h3>
                <ul className={classes.list}>
                  {footer_link.shop.map((link) => (
                    <li className={classes.list_item} key={link.name}>
                      <Link href={link.link}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-3 px-3 py-2">
                <h3 className={classes.footer_heading}>{t("my_account")}</h3>
                <ul className={classes.list}>
                  {footer_link.account.map((link) => (
                    <li className={classes.list_item} key={link.name}>
                      <Link href={link.link}>{link.name}</Link>
                    </li>
                  ))}
                  <li> {session && (
                  <span onClick={() => signOut({ callbackUrl: "/" })}>
                    {t("signout")}
                  </span>
              )}</li>
                </ul>
              </div>
             
            </div>
            <hr />
            <div className="row m-0">
              <div className="col-md-3 p-2">
                <p className={classes.copyright}>
                  {settings.settingsData.copyright}
                </p>
              </div>
              <div className="col-md-6 p-2">
                <div className={classes.gateway}>
                  {settings.settingsData.gatewayImage[0] && (
                    <ImageLoader
                      src={settings.settingsData.gatewayImage[0]?.url}
                      alt={settings.settingsData.gatewayImage[0]?.name}
                      width={565}
                      height={37}
                      style={{
                        width: "auto",
                        height: "100%",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="col-md-3 p-2">
                <div className={classes.social}>
                  <a
                    href={settings.settingsData.social.facebook}
                    className={classes.social_icon}
                    aria-label="Facebook"
                  >
                    <FaFacebook size={32} color="#1877F2" />
                  </a>
                  <a
                    href={settings.settingsData.social.instagram}
                    className={classes.social_icon}
                    aria-label="Instagram"
                  >
                   <FaInstagram size={32} color="#E4405F" />
                  </a>
                  <a
                    href={settings.settingsData.social.twitter}
                    className={classes.social_icon}
                    aria-label="Twitter"
                  >
                    <Twitter width={24} height={24} />
                  </a>
                  <a
                    href={settings.settingsData.social.youtube}
                    className={classes.social_icon}
                    aria-label="Youtube"
                  >
                  <FaYoutube size={32} color="#FF0000" />
                  </a>
                  <a
                    href={settings.settingsData.social.pinterest}
                    className={classes.social_icon}
                    aria-label="Pinterest"
                  >
                    <Pinterest width={24} height={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </>
    ); 


  return null;
};

export default React.memo(Footer);
