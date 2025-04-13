import axios from 'axios';
import { type Rocket } from '../types/rocket';

const API_URL = 'https://api.spacexdata.com/v4/rockets';

export async function getRockets(): Promise<Rocket[]> {
  const response = await axios.get(API_URL);
  return response.data;
}