import { signIn, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import { formField, postData } from "~/lib/clientFunctions";
import classes from "~/styles/signin.module.css";
import {
  Facebook,
  Instagram,
  Person,
  Pinterest,
  Twitter,
  Youtube,
} from "@styled-icons/bootstrap";

const Link = dynamic(() => import("next/link"));

export default function Verifyotp() {
  const mobile = useRef();
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useTranslation();
  const settings = useSelector((state) => state.settings);
  const { facebook, google } = settings.settingsData.login;
  const { otpverifydetails, phone } = router.query;

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://2factor.in/API/V1/99835995-7d26-11ed-9158-0200cd936042/SMS/VERIFY/${otpverifydetails}/${mobile.current.value}`)
      const responceData = await res.json();

      if(responceData.Status === "Success"){

        const data = new FormData();
        data.append("phone", phone);
        data.append("email", `${phone}@gmail.com`);

        const isUserExist = await postData(`/api/auth/checkuser`, data);
        console.log(isUserExist)

        if(isUserExist.success == true){
          console.log("ready");
          const res = await signIn("credentials", {
            redirect: false,
            phone,
          });
          if (res.error) {
            const errorMessage = res.error && (errors[res.error] ?? errors.default);
            toast.error(errorMessage);
          }
          if (res.ok) {
            toast.success("Login successful");
            router.push('/');
          }
        }
       
       //If user new then we will register into db
        const response = await postData(`/api/auth/signup`, data);
        console.log(response)
        if(response.success){
          // const { mobile } = formField(e.target.elements);
          const res = await signIn("credentials", {
            redirect: false,
            phone,
          });
          if (res.error) {
            const errorMessage = res.error && (errors[res.error] ?? errors.default);
            toast.error(errorMessage);
          }
          if (res.ok) {
            toast.success("Login successful");
            router.push('/');
          }
        }
      }else{
        toast.error("Wrong OTP")
      }
    
       
          // ? (toast.success("New account added successfully"),
          //   document.querySelector("#signup_form").reset())
          // : !response.success && response.duplicate
          // ? toast.error("User with the given email is already exists")
          // : toast.error("Something went Wrong");
     
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <HeadData title="Register" />
      <div className={classes.container}>
        <div className={classes.card}>
          <div className={classes.info}>
            <div className={classes.icon}>
              <Person width={60} height={60} />
            </div>
            <p>{settings.settingsData.description}</p>
            <div className={classes.social}>
              <a
                href={settings.settingsData.social.facebook}
                className={classes.social_icon}
                aria-label="Facebook"
              >
                <Facebook width={24} height={24} />
              </a>
              <a
                href={settings.settingsData.social.instagram}
                className={classes.social_icon}
                aria-label="Instagram"
              >
                <Instagram width={24} height={24} />
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
                <Youtube width={24} height={24} />
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
          <div className={classes.form_container}>
            <h1>{t("Verify Otp")}</h1>
            <form
              
              id="signup_form"
              className={classes.form}
            >
               <input
                type="text"
                ref={mobile}
                required
                placeholder={`${t("Enter OTP Here..")}*`}
                className="form-control"
              />

              <button type="button" onClick={handleForm}>{t("Proceed")}</button>
            </form>
            
            
          </div>
        </div>
      </div>
    </>
  );
}
