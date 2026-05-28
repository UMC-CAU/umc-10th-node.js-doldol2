import { AppError } from "./app.error.js";

// ── User ─────────────────────────────────────────────
export class DuplicateUserEmailError extends AppError {
  constructor(message: string, data?: unknown) {
    super({ errorCode: "U001", statusCode: 409, message, data });
  }
}

export class UserNotFoundError extends AppError {
  constructor(message: string, data?: unknown) {
    super({ errorCode: "U002", statusCode: 404, message, data });
  }
}

// ── Store ─────────────────────────────────────────────
export class RegionNotFoundError extends AppError {
  constructor(message: string, data?: unknown) {
    super({ errorCode: "S001", statusCode: 404, message, data });
  }
}

export class StoreNotFoundError extends AppError {
  constructor(message: string, data?: unknown) {
    super({ errorCode: "S002", statusCode: 404, message, data });
  }
}

// ── Mission ───────────────────────────────────────────
export class MissionNotFoundError extends AppError {
  constructor(message: string, data?: unknown) {
    super({ errorCode: "M001", statusCode: 404, message, data });
  }
}

export class AlreadyChallengedError extends AppError {
  constructor(message: string, data?: unknown) {
    super({ errorCode: "M002", statusCode: 409, message, data });
  }
}

export class MissionNotInProgressError extends AppError {
  constructor(message: string, data?: unknown) {
    super({ errorCode: "M003", statusCode: 400, message, data });
  }
}

// ── Review ────────────────────────────────────────────
export class InvalidRatingError extends AppError {
  constructor(message: string, data?: unknown) {
    super({ errorCode: "R001", statusCode: 400, message, data });
  }
}
