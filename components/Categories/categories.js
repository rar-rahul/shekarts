import Link from "next/dist/client/link";
import ImageLoader from "../Image";
import classes from "./category.module.css";
import Image from "next/image";

function Category(props) {
  return (
    <Link href={`/gallery/?category=${props.slug}`}>
      <div className={classes.category_root}>
        <div>
          <figure>
            <div>
              <Image
                src={props.img}
                alt={props.name}
              
                fill
                style={{objectFit: "cover",borderRadius: "50%",position: "absolute",top:"0",left:"0",padding:"0px"}}
              />
             
            </div>
          </figure>
        
        </div>
      </div>
      <div className={classes.name}>{props.name}</div>
    </Link>
  );
}

export default Category;
