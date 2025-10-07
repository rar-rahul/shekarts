import {
  BoxArrowInRight,
  GeoAlt,
  Heart,
  Person,
  PersonPlus,
  Repeat,
  Telephone,
} from "@styled-icons/bootstrap";
import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchData } from "~/lib/clientFunctions";
import { toast } from "react-toastify";
import c from "./navbar.module.css";

import { useTranslation } from "react-i18next";

const CartView = dynamic(() => import("./cartView"), { ssr: false });
const CategoryMenu = dynamic(() => import("./categoryMenu"), { ssr: false });
const ImageLoader = dynamic(() => import("~/components/Image"));
const SearchBar = dynamic(() => import("./searchbar"));
const LanguageSwitcher = dynamic(() => import("~/components/LanguageSwitcher"));

const NavBar = () => {
  const [hideTopBar, setHideTopBar] = useState(false);
  // Selecting session from global state
  const { session } = useSelector((state) => state.localSession);
  // Selecting settings from global state
  const { settingsData } = useSelector((state) => state.settings);
  const { wishlist, compare } = useSelector((state) => state.cart);
  const [std, setStd] = useState(settingsData);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState([]);
  const { t } = useTranslation();

  async function GetData() {
    const url = `/api/home/categories?only_category=true`;
    const data = await fetchData(url);
    data.success ? setCat(data.category) : setCat(null);
    setLoading(false);
  }

  useEffect(() => {
    GetData();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setStd(settingsData);
  }, [settingsData]);

  const router = useRouter();

  const handleScroll = () => {
    const position = window.pageYOffset;
    if (position > 110) {
      setHideTopBar(true);
    } else {
      setHideTopBar(false);
    }
  };

  const goToWishList = () => {
    if (session) {
      router.push("/profile?tab=1");
    } else {
      toast.warning("You need to login to create a Wishlist");
    }
  };

  return (
    <>
      <nav className={`${c.nav}`}>
        {/* <div id={c.offerbanner} className={c.css37632m}>
          <div id={c.offerbanner} className={c.topstripbg}>
            <div className={c.top_strip_wrapper}>
              <div className={`${c.leftDiv} ts-wrap-l`}>
                <div className={c.leftmessage}>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    previewlistener="true"
                  >
                    BEAUTY BONANZA Get Your Amazing Deals!
                  </a>
                </div>
              </div>
              <div className={c.rightDiv}>
                <ul>
                  <li>
                    <a
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      previewlistener="true"
                    >
                      <span class="ts-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>mobile icon</title>
                          <g opacity=".92" fill="#000">
                            <path d="M17.25 3.5v17H6.75v-17h10.5zm.5-1.5H6.25a1 1 0 00-1 1v18a1 1 0 001 1h11.5a1 1 0 001-1V3a1 1 0 00-1-1z"></path>
                            <path d="M13 6h-2a.75.75 0 110-1.5h2A.75.75 0 1113 6zM12 19.48a1 1 0 100-2 1 1 0 000 2z"></path>
                          </g>
                        </svg>
                      </span>
                      <span class="ts-text">Get App</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      previewlistener="true"
                    >
                      <span class="ts-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>help icon</title>
                          <g opacity=".92" fill="#000">
                            <path d="M12 4.5c4.1 0 7.5 3.4 7.5 7.5s-3.4 7.5-7.5 7.5-7.5-3.4-7.5-7.5S7.9 4.5 12 4.5zM12 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z"></path>
                            <path d="M12 16.4a.8.8 0 100-1.6.8.8 0 000 1.6zM12 13.6c-.4 0-.7-.3-.8-.8v-1.4c0-.4.3-.8.8-.8.6 0 1.2-.5 1.2-1.1 0-.6-.5-1.2-1.1-1.2-.6 0-1.2.5-1.2 1.1 0 .4-.3.8-.8.8s-.7-.2-.7-.7c0-1.5 1.2-2.6 2.7-2.6 1.5 0 2.6 1.2 2.6 2.7 0 1.2-.8 2.2-1.9 2.5v.8c-.1.4-.4.7-.8.7z"></path>
                          </g>
                        </svg>
                      </span>
                      <span class="ts-text">Help</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}

        <div className={c.container}>
          <div className={c.start}>
            <div className={c.brand}>
              <Link href="/">
                {std.logo[0] && (
                  <ImageLoader
                    src={std.logo[0]?.url}
                    width={80}
                    height={80}
                    alt={std.name}
                  />
                )}
              </Link>
            </div>
          </div>

          <div className={c.center}>
            <SearchBar />
          </div>
          <div className={c.end}>
            <div>
              {!session ? (
                <Link href="/signin" aria-label="Account">
                  <Person width={24} height={24} />
                </Link>
              ) : (
                <div className="dropdown">
                  <a
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="Account menu"
                    className="d-inline-flex align-items-end"
                  >
                    <Person width={24} height={24} />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" href="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <span
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="dropdown-item"
                        href="/signout"
                      >
                        Logout
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div onClick={goToWishList} className={c.start}>
              <Heart width={24} height={24} />
              <span>{wishlist || 0}</span>
            </div>
            <CartView />
          </div>
        </div>
        <hr />
        <div className={c.bottom_bar}>
          <div className={c.nav_link}>
            <div className="dropdown">
              {cat?.map((item, idx) => (
                <>
                  <Link
                    href={`/gallery?category=${item.slug}`}
                    className={`${c.MegamenuContentHeading} dropdown-toggle p-3`}
                    shallow={true}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    key={idx}
                  >
                    <span>{item.name}</span>
                  </Link>
                  {item.subCategories && item.subCategories.length > 0 && (
                    <ul
                      className="dropdown-menu shadow-sm"
                      style={{ width: "250px" }}
                    >
                      {item.subCategories.map((subItem, subIdx) => (
                        <li
                          key={subIdx}
                          className={`${c.subContentHeading} p-1 dropdown-item`}
                        >
                          <Link
                            href={`/gallery?category=${subItem.slug}&parent=${item.slug}`}
                            shallow={true}
                            className="d-block dropdown-item"
                          >
                            {subItem.name}
                          </Link>
                          <div className={`${c.subMenu}`}>
                            <ul>
                              {subItem.child.map((childItem, childIdx) => (
                                <li
                                  key={childIdx}
                                  className="dropdown-item p-3"
                                >
                                  <Link
                                    href={`/gallery?category=${subItem.slug}&child=${childItem.slug}&parent=${item.slug}`}
                                    shallow={true}
                                  >
                                    <span>{childItem.name}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default memo(NavBar);
