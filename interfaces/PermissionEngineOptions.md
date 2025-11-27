[**@ak-network/permkit v0.1.0**](../README.md)

***

[@ak-network/permkit](../globals.md) / PermissionEngineOptions

# Interface: PermissionEngineOptions

Defined in: [src/lib/server/\_engineTypes.ts:12](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/server/_engineTypes.ts#L12)

Options used to configure the Permission Engine.

## Properties

### defaultDeny?

> `optional` **defaultDeny**: `boolean`

Defined in: [src/lib/server/\_engineTypes.ts:16](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/server/_engineTypes.ts#L16)

***

### onRulesLoaded()?

> `optional` **onRulesLoaded**: (`rules`) => `void`

Defined in: [src/lib/server/\_engineTypes.ts:17](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/server/_engineTypes.ts#L17)

#### Parameters

##### rules

[`ABACRule`](ABACRule.md)[]

#### Returns

`void`

***

### permissions?

> `optional` **permissions**: `string`[]

Defined in: [src/lib/server/\_engineTypes.ts:14](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/server/_engineTypes.ts#L14)

***

### roles

> **roles**: [`RoleDefinition`](RoleDefinition.md)

Defined in: [src/lib/server/\_engineTypes.ts:13](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/server/_engineTypes.ts#L13)

***

### ruleSource

> **ruleSource**: [`RuleSource`](RuleSource.md)

Defined in: [src/lib/server/\_engineTypes.ts:15](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/server/_engineTypes.ts#L15)
