export const loadReducerError = new Error('Failed to load reducers.');

export class ExpiredTokenError extends Error {
  constructor() {
    super();
    this.name = 'ExpiredToken';
    this.message = 'The token being used to perform the request is expired.';
  }
}

export class InvalidControllerDefinition extends Error {
  constructor() {
    super();
    this.name = 'InvalidControllerDefinition';
    // TODO: find a better message if the user defines a controller and opts out from every solution type
    this.message =
      'Need to define the controller for at least one solution type (search, listing, recommendation).';
  }
}

export class DisconnectedError extends Error {
  public statusCode: number;
  constructor(url: string, statusCode?: number) {
    super();
    this.name = 'Disconnected';
    this.message = `Client could not connect to the following URL: ${url}`;
    this.statusCode = statusCode ?? 0;
  }
}
