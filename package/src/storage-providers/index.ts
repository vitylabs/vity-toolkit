import { PinataStorageProvider } from "./pinata";


export enum StorageProvider {
    PINATA,
}


export const storageProviderMap = {
    [StorageProvider.PINATA]: PinataStorageProvider,
}
