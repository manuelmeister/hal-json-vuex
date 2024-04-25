import LoadingResource from './LoadingResource'
import ResourceInterface from './interfaces/ResourceInterface'

class LoadingCollection {
  /**
   * Returns a placeholder for an array that has not yet finished loading from the API. The array placeholder
   * will respond to functional calls (like .find(), .map(), etc.) with further LoadingStoreCollections or
   * LoadingStoreValues. If passed the existingContent argument, random access and .length will also work.
   * @param loadArray       Promise that resolves once the array has finished loading
   * @param existingContent optionally set the elements that are already known, for random access
   */
  static create<StoreType> (loadArray: Promise<Array<ResourceInterface<StoreType>> | undefined>, existingContent: Array<ResourceInterface<StoreType>> = []): Array<ResourceInterface<StoreType>> {
    // if Promsise resolves to undefined, provide empty array
    // this could happen if items is accessed from a LoadingResource, which resolves to a normal entity without 'items'
    const loadArraySafely = loadArray.then(array => array ?? [])

    // proxy array function 'find' to a LoadingResource (Resource)
    const singleResultFunctions = ['find']
    singleResultFunctions.forEach(func => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      existingContent[func] = (...args: any[]) => {
        const resultLoaded = loadArraySafely.then(array => array[func](...args) as ResourceInterface<StoreType>)
        return new LoadingResource(resultLoaded)
      }
    })

    // proxy array functions with multiple results to a LoadingCollection (Array<ResourceInterface>)
    const arrayResultFunctions = ['map', 'flatMap', 'filter']
    arrayResultFunctions.forEach(func => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      existingContent[func] = (...args: any[]) => {
        const resultLoaded = loadArraySafely.then(array => array[func](...args) as Array<ResourceInterface<StoreType>>) // TODO: return type for .map() is not necessarily an Array<ResourceInterface>
        return LoadingCollection.create(resultLoaded)
      }
    })
    return existingContent
  }
}

export default LoadingCollection
