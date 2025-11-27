[**@ak-network/permkit v0.1.0**](../README.md)

***

[@ak-network/permkit](../globals.md) / HandlePermissionsOptions

# Interface: HandlePermissionsOptions

Defined in: [src/lib/sveltekit/handle.ts:5](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/sveltekit/handle.ts#L5)

## Properties

### clientExpose()?

> `optional` **clientExpose**: (`user`) => `Record`\<`string`, `any`\>

Defined in: [src/lib/sveltekit/handle.ts:19](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/sveltekit/handle.ts#L19)

Fields you want exposed to client (sanitize!).

#### Parameters

##### user

[`UserAttributes`](UserAttributes.md)

#### Returns

`Record`\<`string`, `any`\>

***

### engine

> **engine**: [`PermissionEngine`](PermissionEngine.md)

Defined in: [src/lib/sveltekit/handle.ts:6](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/sveltekit/handle.ts#L6)

***

### getEnv()?

> `optional` **getEnv**: (`event`) => `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [src/lib/sveltekit/handle.ts:15](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/sveltekit/handle.ts#L15)

Optional: compute environment attributes (IP, time, flags).

#### Parameters

##### event

`RequestEvent`\<`Record`\<`string`, `never`\>, `"/"` \| `"/__permissions"` \| `"/__permissions/check"` \| `"/admin"` \| `"/admin/permissions"` \| `"/admin/posts"` \| `"/admin/roles"` \| `"/admin/rules"` \| `"/admin/users"` \| `"/api"` \| `"/api/roles"` \| `"/api/rules"` \| `"/api/seed-abac"` \| `"/api/seed-roles"` \| `"/api/seed"` \| `"/api/seed/abac"` \| `"/api/seed/all"` \| `"/api/seed/posts"` \| `"/api/seed/roles"` \| `"/api/seed/users"` \| `"/api/users"` \| `"/posts"` \| `null`\>

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

***

### getUser()?

> `optional` **getUser**: (`event`) => `Promise`\<[`UserAttributes`](UserAttributes.md) \| `null`\>

Defined in: [src/lib/sveltekit/handle.ts:11](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/sveltekit/handle.ts#L11)

Extract the authenticated user from event.
You implement this in your app.

#### Parameters

##### event

`RequestEvent`\<`Record`\<`string`, `never`\>, `"/"` \| `"/__permissions"` \| `"/__permissions/check"` \| `"/admin"` \| `"/admin/permissions"` \| `"/admin/posts"` \| `"/admin/roles"` \| `"/admin/rules"` \| `"/admin/users"` \| `"/api"` \| `"/api/roles"` \| `"/api/rules"` \| `"/api/seed-abac"` \| `"/api/seed-roles"` \| `"/api/seed"` \| `"/api/seed/abac"` \| `"/api/seed/all"` \| `"/api/seed/posts"` \| `"/api/seed/roles"` \| `"/api/seed/users"` \| `"/api/users"` \| `"/posts"` \| `null`\>

#### Returns

`Promise`\<[`UserAttributes`](UserAttributes.md) \| `null`\>
