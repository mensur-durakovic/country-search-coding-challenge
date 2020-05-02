import axios from "../utils/axios";
import { GET_COUNTRIES } from './apiRoutes';

export const fetchCountries = async (searchTerm) => {
  return await axios.get(`${GET_COUNTRIES}?searchTerm=${searchTerm}`);
};
