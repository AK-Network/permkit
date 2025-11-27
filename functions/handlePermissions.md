[**@ak-network/permkit v0.1.0**](../README.md)

***

[@ak-network/permkit](../globals.md) / handlePermissions

# Function: handlePermissions()

> **handlePermissions**(`opts`): `Handle`

Defined in: [src/lib/sveltekit/handle.ts:34](https://github.com/AK-Network/permkit/blob/de4dc547953cadb1ace1c147d7067f9d97c68387/src/lib/sveltekit/handle.ts#L34)

## Parameters

### opts

[`HandlePermissionsOptions`](../interfaces/HandlePermissionsOptions.md)

## Returns

`Handle`

### This hook integrates:
 * loads user from your existing auth mechanism
 * injects permissions into `event.locals`
 * attaches `locals.can(permission, resource?)`
 * serializes safe permission context to client
