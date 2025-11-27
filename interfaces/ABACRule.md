[**@ak-network/permkit v0.1.0**](../README.md)

***

[@ak-network/permkit](../globals.md) / ABACRule

# Interface: ABACRule

Defined in: [src/lib/shared/\_types.ts:34](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/shared/_types.ts#L34)

An individual ABAC rule.

## Properties

### condition()

> **condition**: (`ctx`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [src/lib/shared/\_types.ts:45](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/shared/_types.ts#L45)

#### Parameters

##### ctx

[`PermissionContext`](PermissionContext.md)

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### description?

> `optional` **description**: `string`

Defined in: [src/lib/shared/\_types.ts:36](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/shared/_types.ts#L36)

***

### effect

> **effect**: `"allow"` \| `"deny"`

Defined in: [src/lib/shared/\_types.ts:39](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/shared/_types.ts#L39)

***

### name

> **name**: `string`

Defined in: [src/lib/shared/\_types.ts:35](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/shared/_types.ts#L35)

***

### priority

> **priority**: `number`

Defined in: [src/lib/shared/\_types.ts:42](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/shared/_types.ts#L42)
