type Link = {
    href: string
}

type TemplatedLink = Link & {
    templated: string
}

type StoreDataMeta = {
    _meta: {
        self: string
        loading: boolean
        deleting: boolean
        reloading: boolean
    }
}

type StoreDataEntity = StoreDataMeta & {
    items: never,
    _meta: {
        load: Promise<StoreDataEntity>
    }
}

type StoreDataCollection = StoreDataMeta & {
    items: Array<Link>,
    _meta: {
        load: Promise<StoreDataCollection>
    }
}

type StoreData = StoreDataEntity | StoreDataCollection

export { StoreData, Link, TemplatedLink, StoreDataEntity, StoreDataCollection }

export default StoreData
