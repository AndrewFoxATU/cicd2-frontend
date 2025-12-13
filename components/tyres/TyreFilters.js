"use client";

import { useState, useMemo, useEffect } from "react";
import classes from "./TyreFilters.module.css";

export default function TyreFilters({ tyres, onFilter }) {
	const [size, setSize] = useState("");
	const [brand, setBrand] = useState("all");
	const [season, setSeason] = useState("all");
	const [evOnly, setEvOnly] = useState(false);

	// Create filter object once and push it to parent when any filter changes
	useEffect(() => {
		onFilter({
			size,
			brand,
			season,
			evOnly,
		});
	}, [size, brand, season, evOnly]);

	const brandOptions = useMemo(() => {
		const unique = [...new Set(tyres.map((t) => t.brand))];
		return unique.sort();
	}, [tyres]);

	return (
		<div className={classes.card}>
			<h2 className={classes.title}>Filters</h2>

			{/* Tyre Size */}
			<div className={classes.field}>
				<label className={classes.label}>Tyre Size</label>
				<input
					className={classes.input}
					placeholder="e.g. 205/55R16"
					value={size}
					onChange={(e) => setSize(e.target.value)}
				/>
			</div>

			{/* Brand */}
			<div className={classes.field}>
				<label className={classes.label}>Brand</label>
				<select
					className={classes.select}
					value={brand}
					onChange={(e) => setBrand(e.target.value)}
				>
					<option value="all">All Brands</option>
					{brandOptions.map((b) => (
						<option key={b} value={b}>
							{b}
						</option>
					))}
				</select>
			</div>

			{/* Season */}
			<div className={classes.field}>
				<label className={classes.label}>Season</label>
				<select
					className={classes.select}
					value={season}
					onChange={(e) => setSeason(e.target.value)}
				>
					<option value="all">All</option>
					<option value="Summer">Summer</option>
					<option value="Winter">Winter</option>
					<option value="All Season">All Season</option>
				</select>
			</div>

			{/* EV Approved */}
			<div className={classes.checkboxRow}>
				<input
					type="checkbox"
					checked={evOnly}
					onChange={(e) => setEvOnly(e.target.checked)}
				/>
				<label className={classes.label}>EV Approved Only</label>
			</div>
		</div>
	);
}