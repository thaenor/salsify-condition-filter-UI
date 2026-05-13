import type { Product, Property } from '../domain/types';

interface Datastore {
    getProducts(): Product[];
    getProperties(): Property[];
    products: Product[];
    properties: Property[];
}

const datastore: Datastore = {
    getProducts() {
        return this.products;
    },

    getProperties() {
        return this.properties;
    },

    products: [
        {
            id: 0,
            propertyValues: [
                { propertyId: 0, value: 'Headphones' },
                { propertyId: 1, value: 'black' },
                { propertyId: 2, value: 5 },
                { propertyId: 3, value: 'electronics' },
                { propertyId: 4, value: 'false' },
            ],
        },
        {
            id: 1,
            propertyValues: [
                { propertyId: 0, value: 'Cell Phone' },
                { propertyId: 1, value: 'black' },
                { propertyId: 2, value: 3 },
                { propertyId: 3, value: 'electronics' },
                { propertyId: 4, value: 'true' },
            ],
        },
        {
            id: 2,
            propertyValues: [
                { propertyId: 0, value: 'Keyboard' },
                { propertyId: 1, value: 'grey' },
                { propertyId: 2, value: 5 },
                { propertyId: 3, value: 'electronics' },
                { propertyId: 4, value: 'false' },
            ],
        },
        {
            id: 3,
            propertyValues: [
                { propertyId: 0, value: 'Cup' },
                { propertyId: 1, value: 'white' },
                { propertyId: 2, value: 3 },
                { propertyId: 3, value: 'kitchenware' },
            ],
        },
        {
            id: 4,
            propertyValues: [
                { propertyId: 0, value: 'Key' },
                { propertyId: 1, value: 'silver' },
                { propertyId: 2, value: 1 },
                { propertyId: 3, value: 'tools' },
            ],
        },
        {
            id: 5,
            propertyValues: [
                { propertyId: 0, value: 'Hammer' },
                { propertyId: 1, value: 'brown' },
                { propertyId: 2, value: 19 },
                { propertyId: 3, value: 'tools' },
            ],
        },
    ],

    properties: [
        {
            id: 0,
            name: 'Product Name',
            type: 'string',
        },
        {
            id: 1,
            name: 'color',
            type: 'string',
        },
        {
            id: 2,
            name: 'weight (oz)',
            type: 'number',
        },
        {
            id: 3,
            name: 'category',
            type: 'enumerated',
            values: ['tools', 'electronics', 'kitchenware'],
        },
        {
            id: 4,
            name: 'wireless',
            type: 'enumerated',
            values: ['true', 'false'],
        },
    ],
};

export default datastore;
