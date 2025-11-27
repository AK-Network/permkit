[**@ak-network/permkit v0.1.0**](../README.md)

***

[@ak-network/permkit](../globals.md) / RuleSource

# Interface: RuleSource

Defined in: [src/lib/shared/\_types.ts:61](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/shared/_types.ts#L61)

## Properties

### load()

> **load**: () => `Promise`\<[`ABACRule`](ABACRule.md)[]\>

Defined in: [src/lib/shared/\_types.ts:62](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/shared/_types.ts#L62)

#### Returns

`Promise`\<[`ABACRule`](ABACRule.md)[]\>

***

### watch()?

> `optional` **watch**: (`onChange`) => `void` \| () => `void`

Defined in: [src/lib/shared/\_types.ts:63](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/shared/_types.ts#L63)

#### Parameters

##### onChange

() => `void`

#### Returns

`void` \| () => `void`
