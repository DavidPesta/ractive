import { module, test } from 'qunit'
import Ractive from '@ractivejs/core'
import { Model, Collection } from 'ampersand'
import { modelAdaptor, collectionAdaptor } from '@ractivejs/adaptor-ampersand'

module('adaptor-ampersand collections')

test('Adaptor can detect collections', t => {
  t.ok(collectionAdaptor.filter(new Collection()))
})

test('Initialize with pre-filled collection', t => {
  const MyModel = Model.extend({ props: { name: 'string' } })
  const MyCollection = Collection.extend({ model: MyModel })
  const collection = new MyCollection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  t.strictEqual(instance.get('collection'), collection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'foo')
  t.strictEqual(instance.get('collection.1.name'), 'bar')
  t.strictEqual(instance.get('collection.2.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobarbaz')
})

test('Initialize with empty collection', t => {
  const MyModel = Model.extend({ props: { name: 'string' } })
  const MyCollection = Collection.extend({ model: MyModel })
  const collection = new MyCollection([])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  collection.add([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])

  t.strictEqual(instance.get('collection'), collection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'foo')
  t.strictEqual(instance.get('collection.1.name'), 'bar')
  t.strictEqual(instance.get('collection.2.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobarbaz')
})

test('Initialize with set collection', t => {
  const MyModel = Model.extend({ props: { name: 'string' } })
  const MyCollection = Collection.extend({ model: MyModel })
  const collection = new MyCollection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  instance.set('collection', collection)

  t.strictEqual(instance.get('collection'), collection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'foo')
  t.strictEqual(instance.get('collection.1.name'), 'bar')
  t.strictEqual(instance.get('collection.2.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobarbaz')
})

test('Adding to collection updates instance', t => {
  const MyModel = Model.extend({ props: { name: 'string' } })
  const MyCollection = Collection.extend({ model: MyModel })
  const collection = new MyCollection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  collection.add({ name: 'qux' })

  t.strictEqual(collection.at(3).name, 'qux')
  t.strictEqual(instance.get('collection.3.name'), 'qux')
  t.strictEqual(instance.toHTML(), 'foobarbazqux')
})

test('Updating collection updates instance', t => {
  const MyModel = Model.extend({ props: { name: 'string' } })
  const MyCollection = Collection.extend({ model: MyModel })
  const collection = new MyCollection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  collection.at(1).set('name', 'rar')

  t.strictEqual(collection.at(1).name, 'rar')
  t.strictEqual(instance.get('collection.1.name'), 'rar')
  t.strictEqual(instance.toHTML(), 'foorarbaz')
})

test('Deleting from collection updates instance', t => {
  const MyModel = Model.extend({ props: { name: 'string' } })
  const MyCollection = Collection.extend({ model: MyModel })
  const collection = new MyCollection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  collection.remove(collection.at(1))

  t.strictEqual(collection.at(1).name, 'baz')
  t.strictEqual(instance.get('collection.1.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobaz')
})

test('Reset collection with an array via instance', t => {
  const MyModel = Model.extend({ props: { name: 'string' } })
  const MyCollection = Collection.extend({ model: MyModel })
  const collection = new MyCollection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  instance.set('collection', [{ name: 'oof' }, { name: 'rab' }, { name: 'zab' }])

  t.strictEqual(instance.get('collection'), collection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'oof')
  t.strictEqual(instance.get('collection.1.name'), 'rab')
  t.strictEqual(instance.get('collection.2.name'), 'zab')
  t.strictEqual(instance.toHTML(), 'oofrabzab')
})

test('Reset collection with a new Collection via instance', t => {
  const MyModel = Model.extend({ props: { name: 'string' } })
  const MyCollection = Collection.extend({ model: MyModel })
  const oldCollection = new MyCollection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const newCollection = new MyCollection([{ name: 'oof' }, { name: 'rab' }, { name: 'zab' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection: oldCollection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  instance.set('collection', newCollection)

  // Holds new Collection
  t.strictEqual(instance.get('collection'), newCollection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'oof')
  t.strictEqual(instance.get('collection.1.name'), 'rab')
  t.strictEqual(instance.get('collection.2.name'), 'zab')
  t.strictEqual(instance.toHTML(), 'oofrabzab')

  // Stops listening to old model
  oldCollection.add({ name: 'qux' })
  newCollection.add({ name: 'rar' })
  t.strictEqual(instance.get('collection.3.name'), 'rar')
})

test('Reset collection with an array via collection', t => {
  const MyModel = Model.extend({ props: { name: 'string' } })
  const MyCollection = Collection.extend({ model: MyModel })
  const collection = new MyCollection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  collection.reset([{ name: 'oof' }, { name: 'rab' }, { name: 'zab' }])

  t.strictEqual(instance.get('collection'), collection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'oof')
  t.strictEqual(instance.get('collection.1.name'), 'rab')
  t.strictEqual(instance.get('collection.2.name'), 'zab')
  t.strictEqual(instance.toHTML(), 'oofrabzab')
})

test('Reset collection with a non-adapted value', t => {
  const MyModel = Model.extend({ props: { name: 'string' } })
  const MyCollection = Collection.extend({ model: MyModel })
  const collection = new MyCollection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{ collection }}`
  })

  instance.set('collection', 1)

  t.strictEqual(instance.get('collection'), 1)
  t.strictEqual(instance.toHTML(), '1')
})

// Adaptors changed behavior as of 0.8, causing the adaptor to no longer adapt
// nested collections.
//
// Also, Ampersand's model.toJSON() differs from Backbone in that it returns a
// POJO (collections as arrays, models as objects) while Backbone's doesn't
// (collections remain collection instances). This allows the Backbone adaptor
// to recursively adapt nested collections (because the filter still works),
// while the Ampersand adaptor cannot adapt beyond a model.
