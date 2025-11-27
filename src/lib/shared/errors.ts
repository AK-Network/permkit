
/**
 * Thrown when a permission check fails.
 */
export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

/**
 * Thrown when a permission definition or rule is invalid.
 */
export class PermissionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionValidationError";
  }
}