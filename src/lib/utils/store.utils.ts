import dayjs from 'dayjs';

export const DEFAULT_LIMIT = 1000;
export const DEFAULT_SKIP = 1;

export const UPLOAD_STORE_CSV_HEADERS = ['storeName', 'chain', 'address'];
export const OPEND_STATUS = ['opened', 'closed'];

export const STORE_NAME: string = 'storeName';
export const CHAIN: string = 'chain';
export const ADDRESS: string = 'address';
export const EMAIL: string = 'email';
export const PHONE: string = 'phone';
export const FAX: string = 'fax';
export const OPEN_STATUS: string = 'openStatus';
export const POSTAL_CODE: string = 'postalCode';
export const CATEGORY: string = 'category';
export const PARKING_LOT: string = 'parkingLot';
export const MONDAY: string = 'monday';
export const TUESDAY: string = 'tuesday';
export const WEDNESDAY: string = 'wednesday';
export const THURSDAY: string = 'thursday';
export const FRIDAY: string = 'friday';
export const SATURDAY: string = 'saturday';
export const SUNDAY: string = 'sunday';

export const IMPORT_CSV_HEADERS = {
  STORE_NAME: STORE_NAME,
  CHAIN: CHAIN,
  ADDRESS: ADDRESS,
  EMAIL: EMAIL,
  PHONE: PHONE,
  FAX: FAX,
  PARKING_LOT: PARKING_LOT,
  OPEN_STATUS: OPEN_STATUS,
  POSTAL_CODE: POSTAL_CODE,
  CATEGORY: CATEGORY,
  MONDAY: MONDAY,
  TUESDAY: TUESDAY,
  WEDNESDAY: WEDNESDAY,
  THURSDAY: THURSDAY,
  FRIDAY: FRIDAY,
  SATURDAY: SATURDAY,
  SUNDAY: SUNDAY,
};

export const getMultiStoreObjects = (data: object[]): any[] => {
  try {
    if (!data.length) {
      return [];
    }

    const filtered = {};
    const duplicateKeys = {};

    const stores = data.map((record: any) => {
      const timestamp: number = dayjs().unix();
      const monday: string = record[IMPORT_CSV_HEADERS.MONDAY];
      const tuesday: string = record[IMPORT_CSV_HEADERS.TUESDAY];
      const wednesday: string = record[IMPORT_CSV_HEADERS.WEDNESDAY];
      const thursday: string = record[IMPORT_CSV_HEADERS.THURSDAY];
      const friday: string = record[IMPORT_CSV_HEADERS.FRIDAY];
      const saturday: string = record[IMPORT_CSV_HEADERS.SATURDAY];
      const sunday: string = record[IMPORT_CSV_HEADERS.SUNDAY];
      // console.log('monday :::', typeof cleanStringNGetHours(monday));
      const operatingHours = {};
      operatingHours[timestamp] = {
        mon: monday ? cleanStringNGetHours(monday) : [],
        tue: tuesday ? cleanStringNGetHours(tuesday) : [],
        wed: wednesday ? cleanStringNGetHours(wednesday) : [],
        thu: thursday ? cleanStringNGetHours(thursday) : [],
        fri: friday ? cleanStringNGetHours(friday) : [],
        sat: saturday ? cleanStringNGetHours(saturday) : [],
        sun: sunday ? cleanStringNGetHours(sunday) : [],
      };
      const parkingLot: string = record[IMPORT_CSV_HEADERS.PARKING_LOT];
      const isParkingLot: boolean = ['1', '0'].includes(parkingLot) ? parkingLot === '0' : false;

      const store = {
        store: String(record[IMPORT_CSV_HEADERS.STORE_NAME]),
        chain: String(record[IMPORT_CSV_HEADERS.CHAIN]),
        address: String(record[IMPORT_CSV_HEADERS.ADDRESS]),
        email: String(record[IMPORT_CSV_HEADERS.EMAIL]),
        phone:
          record[IMPORT_CSV_HEADERS.PHONE] &&
          record[IMPORT_CSV_HEADERS.PHONE]
            .replace('[', '')
            .replace(']', '')
            .replace("'", '')
            .replace("'", ''),
        fax:
          record[IMPORT_CSV_HEADERS.FAX] &&
          record[IMPORT_CSV_HEADERS.FAX]
            .replace('[', '')
            .replace(']', '')
            .replace("'", '')
            .replace("'", ''),
        openStatus:
          OPEND_STATUS.includes(record[IMPORT_CSV_HEADERS.OPEN_STATUS]) &&
          record[IMPORT_CSV_HEADERS.OPEN_STATUS],
        postalCode: record[IMPORT_CSV_HEADERS.POSTAL_CODE],
        parkingLot: isParkingLot,
        operatingHours: operatingHours,
      };
      const uniqueKey = store.store + '_' + store.chain + '_' + store.address;
      if (filtered?.[uniqueKey]) {
        duplicateKeys[uniqueKey] = store;
      } else {
        filtered[uniqueKey] = store;
      }
      // return;
    });
    console.log('filtered:::', Object.values(filtered)?.length);
    console.log('duplicateKeys:::', Object.values(duplicateKeys)?.length);
    // if (filtered)
    return [Object.values(filtered), Object.values(duplicateKeys)];
  } catch (error) {
    console.log('error::', error);
    return ['unable to map csv data to store model:' + error.message];
  }
};

const cleanStringNGetHours = (time: string): string[] => {
  try {
    const splitted = time.split(',');
    const first = splitted[0]?.replace('[', '').replace("'", '').replace("'", '');
    const second = splitted[1]?.replace(']', '').replace("'", '').replace("'", '').trim();
    return [first, second];
  } catch (error) {
    return ['null', 'null'];
  }
};

export const validateStoreUploadCSVHeaders = (data: object[]): string[] => {
  const [first] = data;
  const headers = Object.keys(first);
  return UPLOAD_STORE_CSV_HEADERS.filter(header => !headers.includes(header));
};
