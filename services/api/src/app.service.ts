import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHeartBeat(): string {
    return 'Hello World 1!';
  }
}
