import dset from 'dset';

/**
 *
 * Convert a flat object with paths to a nested structure:
 *
 * eg:
 *
 * ```ts
 * const obj = {
 *    "name": "Shane",
 *    "region.region": "Nottingham",
 *    "region.region_id": "NOTTS",
 *    "address.street.0": "Big Barn Lane",
 *    "address.street.1": "Mansfield",
 * }
 *
 * const output = {
 *     "name": "Shane",
 *     "region": {
 *         "region": "Nottingham",
 *         "region_id": "NOTTS"
 *     },
 *     "address": {
 *         street: [
 *             "Big Barn Lane",
 *             "Mansfield"
 *         ]
 *     }
 * }
 * ```
 *
 * @param obj
 */
export function expand(obj: { [index: string]: any }): { [index: string]: any } {
    const outgoing = {};
    Object.keys(obj).forEach(key => {
        dset(outgoing, key, obj[key]);
    });
    return outgoing;
}
