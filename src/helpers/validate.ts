import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TRequest, TResponse } from "@types";
import { NextFunction } from "express";

export class Validator {
  public static validate<T extends object>(dtoType: new () => T) {
    return async (req: TRequest, res: TResponse, next: NextFunction) => {
      try {
        const payload = {
          ...(req.body && req.body.data ? JSON.parse(req.body.data) : req.body),
          ...req.params,
          ...req.files,
          ...req.query,
        };

        // Transform payload into the DTO instance with implicit conversion enabled
        const dtoInstance = plainToInstance(dtoType, payload, {
          enableImplicitConversion: true, // Enables automatic type conversion
        });

        // Validate the transformed DTO instance
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
          const errorMessages = errors.map(err => ({
            property: err.property,
            constraints: err.constraints,
          }));
          return res.status(400).json({ errors: errorMessages });
        }

        req.dto = dtoInstance;
        next();
      } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
    };
  }
}
