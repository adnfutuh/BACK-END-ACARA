import mongoose from "mongoose";
import * as yup from "yup";

const Schema = mongoose.Schema;

export const categotyDAO = yup.object({
  name: yup.string().required(),

  description: yup.string().required(),

  icon: yup.string().required(),
});

export type Category = yup.InferType<typeof categotyDAO>;

const CategotySchema = new Schema<Category>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    icon: {
      type: Schema.Types.String,
      required: true,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", CategotySchema);

export default CategoryModel;
