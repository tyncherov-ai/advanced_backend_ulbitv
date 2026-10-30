import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  messages: string[];

  constructor(messages: string[]) {
    super(messages, HttpStatus.BAD_REQUEST);
    this.messages = messages;
  }
}
