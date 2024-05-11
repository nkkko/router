# Route\<TKey, TPath, TQuery, TDisabled\>

```ts
type Route<TKey, TPath, TQuery, TDisabled>: object;
```

Represents the structure of a route within the application. Return value of `createRoutes`

## Type parameters

| Type parameter | Value | Description |
| :------ | :------ | :------ |
| `TKey` *extends* `string` \| `undefined` | `string` | Represents the unique key identifying the route, typically a string. |
| `TPath` *extends* `string` \| `Path` | `Path` | The type or structure of the route's path. |
| `TQuery` *extends* `string` \| `Query` \| `undefined` | `Query` | The type or structure of the query parameters associated with the route. |
| `TDisabled` *extends* `boolean` \| `undefined` | `boolean` | Indicates whether the route is disabled, which could affect routing logic. |

## Type declaration

### depth

```ts
depth: number;
```

### disabled

```ts
disabled: TDisabled extends boolean ? TDisabled : false;
```

Indicates if the route is disabled.

### key

```ts
key: TKey;
```

Unique identifier for the route, generated by joining route `name` by period. Key is used for routing and for matching.

### matched

```ts
matched: RouteProps;
```

The specific route properties that were matched in the current route. [RouteProps](/api/types/RouteProps)

### matches

```ts
matches: RouteProps[];
```

The specific route properties that were matched in the current route, including any ancestors.
Order of routes will be from greatest ancestor to narrowest matched. [RouteProps](/api/types/RouteProps)

### path

```ts
path: ToPath<TPath>;
```

Represents the structured path of the route, including path params.

### query

```ts
query: ToQuery<TQuery>;
```

Represents the structured query of the route, including query params.