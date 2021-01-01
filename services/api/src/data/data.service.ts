import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { response } from 'express';
import { ICreateProjectPayload } from '../types';

@Injectable()
export class DataService {
  request(url: string, options: any) {
    console.log('fetching remote data ', url, options);
    let { body, headers, method } = options;

    body = body ? JSON.stringify(body) : null;

    return fetch(url, {
      method,
      body,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DATA_HOST_TOKEN ||
          'NawsP7pLMw7hTKKC'}`,
      },
    });
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

  async getProjectSharings(project_id: string, username: string) {
    const response = await this.request(
      this.makeUrl(
        `workbenches/${project_id}/shares?user_id=${encodeURIComponent(
          username,
        )}`,
      ),
      { method: 'GET' },
    );

    // console.log('getProjectSharings', await response.text());

    return await response.json();
  }

  async addProjectSharings(project_id: string, username: string, items: any) {
    const response = await this.request(
      this.makeUrl(
        `workbenches/${project_id}/shares?user_id=${encodeURIComponent(
          username,
        )}`,
      ),
      {
        method: 'POSt',
        body: {
          items: JSON.parse(items),
        },
      },
    );

    // console.log('getProjectSharings', await response.text());

    return await response.json();
  }

  async createProject(payload: ICreateProjectPayload) {
    const {
      username,
      workbench_name,
      cpu: requested_cpu,
      ram: requested_memory,
      gpu: requested_gpu,
    } = payload;

    const response = await this.request(
      this.makeUrl(`workbenches?user_id=${encodeURIComponent(username)}`),
      {
        method: 'POST',
        body: {
          workbench_name,
          requested_cpu,
          requested_memory,
          requested_gpu,
        },
      },
    );

    return await response.json();
  }

  async deleteProject(id: string, username: string) {
    console.log('deleting project');
    const response = await this.request(
      this.makeUrl(`workbenches/${id}?user_id=${encodeURIComponent(username)}`),
      { method: 'DELETE' },
    );

    console.log('result from remote data ', response);
    const res = await response.json();
    console.log('project delete ', res);
    return res;
  }
}
