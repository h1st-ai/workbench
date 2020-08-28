import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { response } from 'express';

@Injectable()
export class DataService {
  request(url: string, options: any) {
    console.log('requestiong ', url, options);
    return fetch(url, options);
  }

  makeUrl(path: string) {
    return `${process.env.DATA_HOST}/${path}`;
  }

  async getAllProjects(username: string) {
    const response = await this.request(
      this.makeUrl(`workbenches?user_id=${username}`),
      { method: 'GET' },
    );

    console.log('result', response);
    const result = await response.json();

    return result;
  }

  async startProject(project_id: string, username: string) {
    const response = await this.request(
      this.makeUrl(`workbenches/${project_id}/start?user_id=${username}`),
      { method: 'POST' },
    );

    console.log('result', response);
    const result = await response.json();

    return result;
  }

  async stopProject(project_id: string, username: string) {
    const response = await this.request(
      this.makeUrl(`workbenches/${project_id}/stop?user_id=${username}`),
      { method: 'POST' },
    );

    console.log('result', response);
    const result = await response.json();

    return result;
  }

  async getProjectInfo(project_id: string, username: string) {
    const response = await this.request(
      this.makeUrl(`workbenches/${project_id}?user_id=${username}`),
      { method: 'GET' },
    );

    const result = await response.json();

    return result;
  }

  async createProject(username: string) {
    const response = await this.request(
      this.makeUrl(`workbenches?user_id=${username}`),
      { method: 'POST' },
    );

    const result = await response.json();

    return result;
  }
}
