import axios from 'axios';
import type { Project } from '../types/Project';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get('/api/projects');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch projects');
  }
};