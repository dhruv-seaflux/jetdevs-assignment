import { Request, Response } from "express";

export interface Me {
  id: number;
  permissions?: string[];
}

export interface TRequest<T = any> extends Request {
  me?: Me;
  dto?: T;
  files: any;
  t: (key: string, opts?: any) => string;
  pager: {
    page: number;
    limit: number;
  };
}

export interface TResponse extends Response { }

export enum Roles { }

export enum EQueue {
  Comment = "Comment"
}
