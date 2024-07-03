import Link from "next/dist/client/link";
import ImageLoader from "../Image";
import classes from "./brand.module.css";
import Image from "next/image";
function Brand(props) {
 
  return (
    <Link href={`/gallery/?brand=${props.slug}`}>
      <div className={classes.category_root}>
        <div>
          <figure>
            <div>
            <Image
                src={props.img}
                alt={props.name}
                width={140}
                height={140}
                style={{objectFit: "cover",borderRadius: "50%",position: "absolute",top:"0",left:"0",padding:"10px"}}
              />
            </div>
          </figure>
        </div>
      </div>
      {/* <div className={classes.name}>{props.name}</div> */}
    </Link>
  );
}

export default Brand;
