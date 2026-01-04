import classes from "./TyreTable.module.css";

export default function TyreTable({
	tyres,
	onSort,
	sortConfig = { key: null, direction: null },
	onRowClick
}) {
	if (!tyres || tyres.length === 0) {
		return (
			<div className={classes.empty}>
				No tyres match your filters. Start by entering a tyre size.
			</div>
		);
	}

	const headers = [
		{ key: "brand", label: "Brand" },
		{ key: "model", label: "Model" },
		{ key: "size", label: "Size" },
		{ key: "load_rate", label: "Load Rate" },
		{ key: "speed_rate", label: "Speed Rate" },
		{ key: "season", label: "Season" },
		{ key: "supplier", label: "Supplier" },
		{ key: "fuel_efficiency", label: "Fuel Efficiency" },
		{ key: "noise_level", label: "Noise Level (dB)" },
		{ key: "weather_efficiency", label: "Weather Efficiency" },
		{ key: "ev_approved", label: "EV Approved" },
		{ key: "cost", label: "Cost (€)" },
		{ key: "retail_cost", label: "Retail Cost (€)" },
		{ key: "quantity", label: "Quantity" },
	];

	function renderArrow(column) {
		if (!sortConfig.key || sortConfig.key !== column) return "↕";
		return sortConfig.direction === "asc" ? "↑" : "↓";
	}

	return (
		<div className={classes.tableWrapper}>
			<table className={classes.table}>
				<thead>
					<tr
						key={t.id}
						className={classes.bodyRow}
						onClick={() => onRowClick(t)}
					>

						{headers.map((h) => (
							<th
								key={h.key}
								className={classes.headCell}
								onClick={() => onSort(h.key)}
							>
								<span>{h.label}</span>
								<span className={classes.arrow}>{renderArrow(h.key)}</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{tyres.map((t) => (
						<tr key={t.id} className={classes.bodyRow}>
							<td className={classes.bodyCell}>{t.brand}</td>
							<td className={classes.bodyCell}>{t.model}</td>
							<td className={classes.bodyCell}>{t.size}</td>
							<td className={classes.bodyCell}>{t.load_rate}</td>
							<td className={classes.bodyCell}>{t.speed_rate}</td>
							<td className={classes.bodyCell}>{t.season}</td>
							<td className={classes.bodyCell}>{t.supplier}</td>
							<td className={classes.bodyCell}>{t.fuel_efficiency}</td>
							<td className={classes.bodyCell}>{t.noise_level}</td>
							<td className={classes.bodyCell}>{t.weather_efficiency}</td>
							<td className={classes.bodyCell}>{t.ev_approved ? "Yes" : "No"}</td>
							<td className={classes.bodyCell}>€{t.cost}</td>
							<td className={classes.bodyCell}>€{t.retail_cost}</td>
							<td className={`${classes.bodyCell} ${t.quantity <= 4 ? classes.lowStock : ""}`}>{t.quantity}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}