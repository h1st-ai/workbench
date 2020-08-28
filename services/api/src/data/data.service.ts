import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { response } from 'express';

@Injectable()
export class DataService {
  request(url: string, options: any) {
    console.log('fetching remote data ', url, options);
    return fetch(url, options);
  }

  makeUrl(path: string) {
    return `${process.env.DATA_HOST}/${path}`;
  }

  async getAllProjects(username: string) {
    const response = await this.request(
      this.makeUrl(`workbenches?user_id=${encodeURIComponent(username)}`),
      { method: 'GET' },
    );

    return await response.json();
  }

  async startProject(project_id: string, username: string) {
    const response = await this.request(
      this.makeUrl(
        `workbenches/${project_id}/start?user_id=${encodeURIComponent(
          username,
        )}`,
      ),
      { method: 'POST' },
    );

    return await response.json();
  }

  async stopProject(project_id: string, username: string) {
    const response = await this.request(
      this.makeUrl(
        `workbenches/${project_id}/stop?user_id=${encodeURIComponent(
          username,
        )}`,
      ),
      { method: 'POST' },
    );

    return await response.json();
  }

  async getProjectInfo(project_id: string, username: string) {
    const response = await this.request(
      this.makeUrl(
        `workbenches/${project_id}?user_id=${encodeURIComponent(username)}`,
      ),
      { method: 'GET' },
    );

    return await response.json();
  }

  async createProject(username: string) {
    console.log('creating project');
    const response = await this.request(
      this.makeUrl(`workbenches?user_id=${encodeURIComponent(username)}`),
      { method: 'POST' },
    );

    const res = await response.json();
    console.log('project created ', res);
    return res;
  }
}
