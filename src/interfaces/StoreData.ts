type Link = {
    href: string
}

type VirtualLink = Link & {
    virtual?: boolean
}

type TemplatedLink = Link & {
    templated: string
}

type SerializablePromise<T> = Promise<T> & {
    toJSON?: () => string
}

type StoreDataMeta = {
    _meta: {
        self: string
        loading: boolean
        deleting: boolean
        reloading: boolean
    }
}

type VirtualStoreDataMeta = StoreDataMeta & {
    _meta: {
        virtual: boolean
        owningResource: string
        owningRelation: string
    }
}

type StoreDataEntity<T> = StoreDataMeta & {
    _meta: {
        load: SerializablePromise<StoreDataEntity<T>>
    }
} & T

type StoreDataCollection<T> = StoreDataMeta & {
    items: Array<Link>,
    _meta: {
        load: SerializablePromise<StoreDataCollection<T>>
    }
} & T

type StoreData<T> = StoreDataEntity<T> | StoreDataCollection<T>

type VirtualStoreData<T> = StoreData<T> & VirtualStoreDataMeta

export { StoreData, VirtualStoreData, Link, VirtualLink, TemplatedLink, StoreDataEntity, StoreDataCollection, SerializablePromise }

export default StoreData
