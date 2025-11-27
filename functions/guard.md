[**@ak-network/permkit v0.1.0**](../README.md)

***

[@ak-network/permkit](../globals.md) / guard

# Function: guard()

> **guard**\<`T`\>(`permission`, `loadFn`, `getResource?`): (`event`) => `Promise`\<`T`\>

Defined in: [src/lib/sveltekit/guard.ts:20](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/sveltekit/guard.ts#L20)

## Type Parameters

### T

`T`

## Parameters

### permission

`string`

{string}

### loadFn

[`LoadFunction`](../type-aliases/LoadFunction.md)\<`T`\>

### getResource?

(`event`) => `any`

## Returns

#### This provides the magic:
```ts
export const load = guard("posts.write", async (event) => { ... })
```
Works in any `+page.server.ts` or `+layout.server.ts`.

> (`event`): `Promise`\<`T`\>

### Parameters

#### event

`RequestEvent`

### Returns

`Promise`\<`T`\>
