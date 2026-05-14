import "express";

declare module "express-serve-static-core" {
  interface Response {
    error: (params: {
      errorCode?: string | null;
      message?: string | null;
      data?: unknown;
    }) => this;
  }
}
