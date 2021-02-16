export class User {
    username: string;
    password: string;
}

export class AuthenticationResponse {
  token: string;
  expiryTime: number; // in milliseconds
}

export class AlertMessage {
  message: string;
  messageType: string;
}



