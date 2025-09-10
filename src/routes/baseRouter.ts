import { Router, Request, Response, NextFunction } from "express";

export interface BaseRouterOptions {
  prefix?: string;
  middleware?: Array<(req: Request, res: Response, next: NextFunction) => void>;
}

export class BaseRouter {
  public router: Router;
  private prefix: string;

  constructor(options: BaseRouterOptions = {}) {
    this.router = Router();
    this.prefix = options.prefix ?? "";

    if (options.middleware) {
      options.middleware.forEach((middleware) => {
        this.router.use(middleware);
      });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
