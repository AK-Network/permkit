[**@ak-network/permkit v0.1.0**](../README.md)

***

[@ak-network/permkit](../globals.md) / PermissionStore

# Interface: PermissionStore

Defined in: [src/lib/client/store.ts:24](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/client/store.ts#L24)

A Svelte store exposing the current user and a `can` method
to check permissions against the server.

## Extends

- `Writable`\<`PermissionStoreValue`\>

## Methods

### can()

> **can**(`permission`, `resource?`): `Promise`\<`boolean`\>

Defined in: [src/lib/client/store.ts:30](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/client/store.ts#L30)

Checks a permission against a resource on the server.

#### Parameters

##### permission

`string`

The permission string to check

##### resource?

`Record`\<`string`, `any`\>

Optional resource context

#### Returns

`Promise`\<`boolean`\>

***

### set()

> **set**(`this`, `value`): `void`

Defined in: node\_modules/.pnpm/svelte@5.43.14/node\_modules/svelte/types/index.d.ts:2596

Set value and inform subscribers.

#### Parameters

##### this

`void`

##### value

`PermissionStoreValue`

to set

#### Returns

`void`

#### Inherited from

`Writable.set`

***

### subscribe()

> **subscribe**(`this`, `run`, `invalidate?`): `Unsubscriber`

Defined in: node\_modules/.pnpm/svelte@5.43.14/node\_modules/svelte/types/index.d.ts:2587

Subscribe on value changes.

#### Parameters

##### this

`void`

##### run

`Subscriber`\<`PermissionStoreValue`\>

subscription callback

##### invalidate?

() => `void`

cleanup callback

#### Returns

`Unsubscriber`

#### Inherited from

`Writable.subscribe`

***

### update()

> **update**(`this`, `updater`): `void`

Defined in: node\_modules/.pnpm/svelte@5.43.14/node\_modules/svelte/types/index.d.ts:2602

Update value using callback and inform subscribers.

#### Parameters

##### this

`void`

##### updater

`Updater`\<`PermissionStoreValue`\>

callback

#### Returns

`void`

#### Inherited from

`Writable.update`
