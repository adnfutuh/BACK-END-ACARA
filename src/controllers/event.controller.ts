import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import EventModel, { eventDAO, TEvent } from "../models/event.model";
import { FilterQuery } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body, createdBy: req.user?.id } as TEvent;
      await eventDAO.validate(payload);
      const result = await EventModel.create(payload);
      response.success(res, result, "Success to create an event");
    } catch (error) {
      response.error(res, error, "Failed to create an event");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery;
    try {
      const query: FilterQuery<TEvent> = {};
      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await EventModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await EventModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          total: count,
          totalPages: Math.ceil(count / limit),
          current: page,
        },
        "Success find all an event"
      );
    } catch (error) {
      response.error(res, error, "Failed find all an event");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await EventModel.findById(id);
      response.success(res, result, "Success find one an event");
    } catch (error) {
      response.error(res, error, "Failed find one an event");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await EventModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "Success update an event");
    } catch (error) {
      response.error(res, error, "Failed update an event");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await EventModel.findByIdAndDelete(id, {
        new: true,
      });
      response.success(res, result, "Success remove an event");
    } catch (error) {
      response.error(res, error, "Failed remove an event");
    }
  },

  async findOneBySlug(req: IReqUser, res: Response) {
    try {
      const { slug } = req.params;
      const result = await EventModel.findOne({ slug });
      response.success(res, result, "Success find one by slug an event");
    } catch (error) {
      response.error(res, error, "Failed find one by slug an event");
    }
  },
};
