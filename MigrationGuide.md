

# Migration

1. Upgrade your packages with the following command
```
npm i @ui5/webcomponents-react@2.0.0-rc.2 @ui5/webcomponents@latest @ui5/webcomponents-fiori@latest @ui5/webcomponents-base@latest
```

2. Adjust the imports in App.tsx. Instead of importing
```js
import { Table, TableColumn, TableRow, TableCell, Button, Bar, Title } from '@ui5/webcomponents-react';
```

we are removing `TableColumn` and replace it with `TableHeaderRow` and `TableHeaderCell`

```js
import { Table, TableHeaderRow, TableRow, TableCell, Button, Bar, Title, TableHeaderCell } from '@ui5/webcomponents-react';
```

3. Remove all incompatible/wrong properties from `Table` and `TableRow`. This includes the following properties...

...Table:
- `growing`
- `onLoadMore`
- `growingButtonSubText`
- `mode`
- `onSelectionChange`
- `columns`

...TableRow:
- `type`

4. Add the `TableHeaderRow` to the in the `Table`. Use the `headerRow` property for that.
```tsx
<Table
	onRowClick={onRowClick}
	headerRow={
		<TableHeaderRow>
		<TableHeaderCell>Vendor</TableHeaderCell>
		<TableHeaderCell>City</TableHeaderCell>
		<TableHeaderCell>Company</TableHeaderCell>
		<TableHeaderCell>Country</TableHeaderCell>
		</TableHeaderRow>
	}>
```

This should be enough to have the application up and running with limited functionality!

5. To enable popins, you need to set `overflowMode` to `Popin`. By default, the table will always be in horizontal scroll mode.

```tsx
<Table
	onRowClick={onRowClick}
	overflowMode='Popin'
```

The popin behavior changed. Instead of defining `minWidth` as in `minScreenWidth` (the minimum screen width, when a column should pop in), the table now offers a "natural" overflow handling.
Just set a `minWidth`, `width` or `maxWidth` for your `TableHeaderCell` and the table will determine on resize, which columns still fit into the table.
You can also manipulate the order by providing an `importance`.

```tsx
<TableHeaderRow>
	<TableHeaderCell minWidth="12rem" importance={100}>Vendor</TableHeaderCell>
	<TableHeaderCell importance={-1} minWidth='400px'>City</TableHeaderCell>
	<TableHeaderCell minWidth='500px'>Company</TableHeaderCell>
	<TableHeaderCell minWidth='200px'>Country</TableHeaderCell>
</TableHeaderRow>
```

5. Add the `interactive` property to the row. This is equivalent to the old `type="Active"` setting.

```tsx
<TableRow id={vendor.id} key={vendor.id} interactive>
```

6. To add growing, we need to add the `TableGrowing` feature, as we want to "extend" the functionality of our table. Set the `type` to `Button` to enable growing via a button. `growingSubText` can be used for the subtext of the button. Attach the 'loadMore' event to the feature, as it is now a separate entity to the `Table`.

```tsx
<Table
	...
	features={<>
		<TableGrowing
		type='Button'
		growingSubText={`[${vendors.length} of ${count}]`}
		onLoadMore={onLoadMore}>
		</TableGrowing>
	</>}>
```

7. To add selection capabilities, we need to add the `TableSelection` feature, as it is not part of the "default" table.
Set the `mode` property to `Multiple` to enable multi selection capabilities.
The `selectionChange` event is now simply the `change` event, so attach the listener to this event

```tsx
<Table
	...
	features={<>
		...
		<TableSelection
		mode='Multiple'
		onChange={onSelectionChange}>
		</TableSelection>
	</>}>
```

Additionally, selection is now key-based instead of index-based. Therefore, we also need to add the `row-key` property to the `TableRow`.

```tsx
<TableRow id={vendor.id} key={vendor.id} interactive rowKey={vendor.id}>
```

We also need to slightly change the event listener. The event itself does not return any
details. It is possible to determine the state of selection directly from the selection
feature by examining the `selected` property. This property holds the selected keys separated by spaces.

We need to create a reference to access the `TableSelection` feature in the event listener.
Be aware, that the `selected` property contains `row-key`s, which is why we need to adjust the logic to find the vendor.

```tsx
const selection = useRef(null);
```

```tsx
<TableSelection
	ref={selection}
```

```tsx
function onSelectionChange(event: CustomEvent) {
	if (!selection.current) {
		return;
	}

	const selectionFeature: TableSelectionDomRef = selection.current;
	const selected = selectionFeature.selected.split(" ");
	const newMarkers = selected.reduce((acc: MarkerInfo[], rowKey: any) => {
		const vendor = vendors.find((vendor: Vendor) => vendor.id === rowKey);
		if (vendor) {
		acc.push({ id: vendor.id, position: [vendor.location.latitude, vendor.location.longitude], city: vendor.location.city, name: vendor.name });
		}
		return acc;
	}, []);
	setMarkers(newMarkers);

	if (current !== null && selected.find((row: any) => row.id === current.id)) {
		setCurrent(null);
	}
}
```