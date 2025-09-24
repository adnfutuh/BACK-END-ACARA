import mongoose, { ObjectId } from "mongoose";
import * as yup from "yup";

const Schema = mongoose.Schema;

export const eventDAO = yup.object({
  name: yup.string().required(),

  startDate: yup.string().required(),

  endDate: yup.string().required(),

  description: yup.string().required(),

  banner: yup.string().required(),

  isFeatured: yup.boolean().required(),

  isOnline: yup.boolean().required(),

  isPublish: yup.boolean(),

  category: yup.string().required(),

  slug: yup.string(),

  createdBy: yup.string().required(),

  createdAt: yup.string(),

  updatedAt: yup.string(),

  location: yup.object().required(),
});

export type TEvent = yup.InferType<typeof eventDAO>;

export interface event extends Omit<TEvent, "category" | "createdBy"> {
  category: ObjectId;
  createdBy: ObjectId;
}

const EvnetSchema = new Schema<event>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    startDate: {
      type: Schema.Types.String,
      required: true,
    },
    endDate: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    banner: {
      type: Schema.Types.String,
      required: true,
    },
    isFeatured: {
      type: Schema.Types.Boolean,
      required: true,
    },
    isOnline: {
      type: Schema.Types.Boolean,
      required: true,
    },
    isPublish: {
      type: Schema.Types.Boolean,
      default: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    slug: {
      type: Schema.Types.String,
      unique: true,
    },
    location: {
      type: {
        region: {
          type: Schema.Types.Number,
        },
        coordinates: {
          type: [Schema.Types.Number],
          default: [0, 0],
        },
      },
    },
  },
  { timestamps: true }
);

EvnetSchema.pre("save", function () {
  if (!this.slug) {
    const slug = this.name.split(" ").join("-").toLocaleLowerCase();
    this.slug = `${slug}`;
  }
});

const EventModel = mongoose.model("Event", EvnetSchema);

export default EventModel;
