import { Request, Response, NextFunction } from "express"

export interface Req extends Request {
  user?: any
}
export interface Res extends Response {}
export interface Next extends NextFunction {}
