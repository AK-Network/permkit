[**@ak-network/permkit v0.1.0**](../README.md)

***

[@ak-network/permkit](../globals.md) / PermissionEngine

# Interface: PermissionEngine

Defined in: [src/lib/server/\_engineTypes.ts:23](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/server/_engineTypes.ts#L23)

The Permission Engine instance.

## Methods

### check()

> **check**(`ctx`): `Promise`\<[`PermissionCheckResult`](PermissionCheckResult.md)\>

Defined in: [src/lib/server/\_engineTypes.ts:24](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/server/_engineTypes.ts#L24)

#### Parameters

##### ctx

[`PermissionContext`](PermissionContext.md)

#### Returns

`Promise`\<[`PermissionCheckResult`](PermissionCheckResult.md)\>

***

### getRules()

> **getRules**(): [`ABACRule`](ABACRule.md)[]

Defined in: [src/lib/server/\_engineTypes.ts:25](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/server/_engineTypes.ts#L25)

#### Returns

[`ABACRule`](ABACRule.md)[]

***

### replaceRules()

> **replaceRules**(`rules`): `Promise`\<`void`\>

Defined in: [src/lib/server/\_engineTypes.ts:26](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/server/_engineTypes.ts#L26)

#### Parameters

##### rules

[`ABACRule`](ABACRule.md)[]

#### Returns

`Promise`\<`void`\>

***

### stop()

> **stop**(): `void`

Defined in: [src/lib/server/\_engineTypes.ts:27](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/server/_engineTypes.ts#L27)

#### Returns

`void`
