import userModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";
import { parseForm } from "../../../utils/parseForm";

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const data = await parseForm(req);
       
        const { phone } = data.field;
        const users = await userModel
          .findOne({ phone: phone })

       if(users){
        res.status(200).json({ success: true, users });
       }else{  
       res.status(200).json({ success: false, users });
      }  
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;
   
    default:
      res.status(400).json({ success: false });
      break;
  }
}
