import type { Company } from '../../Persistence/Entities/Company';

import { database } from '../../Persistence/Database';

export async function create(value: Company): Promise<boolean>
{
    const transaction = database?.transaction('companies', 'readwrite');
    const companies = transaction?.objectStore('companies');

    let request;

    request = companies?.index('by_ticker').get(value.stock.ticker);

    await new Promise((resolve) => {
        request!.onsuccess = () => {
            if (request!.result !== undefined) {
                throw new Error('COMPANY_ALREADY_EXISTS');
            }
            resolve(undefined);
        };
    });

    request = companies?.add(value);

    return new Promise((resolve) => {
        request!.onsuccess = () => resolve(true);
    });
}

export async function update(value: Company): Promise<boolean>
{
    const transaction = database?.transaction('companies', 'readwrite');
    const companies = transaction?.objectStore('companies');

    const request = companies?.put(value);

    return new Promise((resolve) => {
        request!.onsuccess = () => resolve(true);
    });
}

export async function remove(id: number): Promise<boolean>
{
    const transaction = database?.transaction('companies', 'readwrite');
    const companies = transaction?.objectStore('companies');

    const request = companies?.delete(id);

    return new Promise((resolve) => {
        request!.onsuccess = () => resolve(true);
    });
}

export function getAll(): Promise<Company[]>
{
    const transaction = database?.transaction('companies', 'readonly');
    const companies = transaction?.objectStore('companies');

    const request = companies?.getAll();

    return new Promise((resolve) => {
        request!.onsuccess = () => resolve(request!.result);
    });
}

export async function getById(id: number): Promise<Company>
{
    const transaction = database?.transaction('companies', 'readonly');
    const companies = transaction?.objectStore('companies');

    const request = companies?.get(id);

    return new Promise((resolve) => {
        request!.onsuccess = () => {
            if (request!.result === undefined) {
                throw new Error('COMPANY_NOT_FOUND');
            }
            resolve(request!.result);
        }
    });
}
