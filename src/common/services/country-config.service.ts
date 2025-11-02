import { Injectable } from '@nestjs/common';
import { Country } from '../enums/country.enum';
import { COUNTRY_SETTINGS } from '../../shared/constants/countries.constant';

@Injectable()
export class CountryConfigService {
  getCountryConfig(country: Country) {
    const config = COUNTRY_SETTINGS[country];
    if (!config) {
      throw new Error(`Unsupported country: ${country}`);
    }
    return config;
  }

  getAllCountries() {
    return Object.values(COUNTRY_SETTINGS);
  }

  getVatRate(country: Country): number {
    const config = COUNTRY_SETTINGS[country];
    if (!config) {
      throw new Error(`Unsupported country: ${country}`);
    }
    return config.defaultVatRate;
  }

  requiresTrn(country: Country): boolean {
    const config = COUNTRY_SETTINGS[country];
    if (!config) {
      throw new Error(`Unsupported country: ${country}`);
    }
    return config.requiresTrn;
  }

  getCurrency(country: Country) {
    const config = COUNTRY_SETTINGS[country];
    if (!config) {
      throw new Error(`Unsupported country: ${country}`);
    }
    return {
      code: config.currencyCode,
      symbol: config.currencySymbol,
    };
  }
}
