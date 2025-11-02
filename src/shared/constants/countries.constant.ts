import { Country, Currency } from '../../common/enums/country.enum';

export const COUNTRY_SETTINGS = {
  [Country.UAE]: {
    countryCode: 'UAE',
    countryName: 'United Arab Emirates',
    currencyCode: Currency.AED,
    currencySymbol: 'د.إ',
    defaultVatRate: 5.0,
    requiresTrn: true,
    dateFormat: 'DD/MM/YYYY',
    locale: 'ar-AE',
    targetAudience: 'business_owners'
  },
  [Country.KSA]: {
    countryCode: 'KSA',
    countryName: 'Kingdom of Saudi Arabia',
    currencyCode: Currency.SAR,
    currencySymbol: 'ر.س',
    defaultVatRate: 15.0,
    requiresTrn: true,
    dateFormat: 'DD/MM/YYYY',
    locale: 'ar-SA',
    targetAudience: 'business_owners'
  },
  [Country.EGYPT]: {
    countryCode: 'Egypt',
    countryName: 'Egypt',
    currencyCode: Currency.EGP,
    currencySymbol: 'ج.م',
    defaultVatRate: 14.0,
    requiresTrn: false,
    dateFormat: 'DD/MM/YYYY',
    locale: 'ar-EG',
    targetAudience: 'business_owners'
  }
};