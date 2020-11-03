
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export abstract class IQuery {
    abstract getCountries(): Country[] | Promise<Country[]>;
}

export class Country {
    id?: string;
    name?: string;
    slug?: string;
}
