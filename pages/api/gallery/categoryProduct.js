import ProductModel from "~/models/product";
import SettingModel from "~/models/setting";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { category } = req.query;
        console.log(category)
       
        const product = await ProductModel.find({ slug: category });
       
          res.status(200).json({ success: true, product });
        
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
