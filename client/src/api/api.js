import axios from "../utils/axios";
import { GET_COUNTRIES } from './apiRoutes';

/**
 * function used to search countries by search term
 * @param {string} searchTerm - users input
 */
export const fetchCountries = async (searchTerm) => {
  return await axios.get(`${GET_COUNTRIES}?searchTerm=${searchTerm}`);
};
