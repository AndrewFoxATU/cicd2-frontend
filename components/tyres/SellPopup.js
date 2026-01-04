import { useEffect, useState } from "react";
import classes from "./SellPopup.module.css";

function SellPopup(props) {
	const { show, onClose, tyre, currentUser, onSuccess } = props;

	const [qty, setQty] = useState(1);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (show) {
			setQty(1);
			setError(null);
			setIsLoading(false);
		}
	}, [show]);

	if (!show || !tyre) {
		return null;
	}

	const unitPrice = Number(tyre.retail_cost || 0);
	const totalCharge = (unitPrice * Number(qty || 0)).toFixed(2);

	async function confirmSale() {
		setError(null);

		const qtyNumber = Number(qty);

		if (!currentUser || !currentUser.id) {
			setError("No active user found.");
			return;
		}

		if (!Number.isInteger(qtyNumber) || qtyNumber <= 0) {
			setError("Quantity must be a whole number greater than 0.");
			return;
		}

		if (qtyNumber > tyre.quantity) {
			setError(`Not enough stock. Available: ${tyre.quantity}`);
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/sell", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					seller_user_id: currentUser.id,
					tyre_id: tyre.id,
					quantity: qtyNumber
				})
			});

			if (!response.ok) {
				setError("Sell failed.");
				setIsLoading(false);
				return;
			}

			const result = await response.json();
			onSuccess(qtyNumber, result);
			onClose();
		} catch (err) {
			setError("Network error.");
		}

		setIsLoading(false);
	}

	return (
		<>
			<div className={classes.backdrop} onClick={onClose} />

			<aside className={classes.popupCard}>
				<h2 className={classes.title}>Sell Tyre</h2>

				<div className={classes.info}>
					<p><strong>User:</strong> {currentUser.name}</p>
					<p><strong>Tyre:</strong> {tyre.brand} {tyre.model}</p>
					<p><strong>Size:</strong> {tyre.size}</p>
					<p><strong>Stock:</strong> {tyre.quantity}</p>
					<p><strong>Unit Price:</strong> €{unitPrice.toFixed(2)}</p>
				</div>

				<div className={classes.form}>
					<div className={classes.inputGroup}>
						<label>Quantity sold</label>
						<input
							type="number"
							min="1"
							max={tyre.quantity}
							value={qty}
							onChange={(e) => setQty(e.target.value)}
						/>
					</div>

					<div className={classes.totalRow}>
						<span>Total charge</span>
						<strong>€{totalCharge}</strong>
					</div>

					{error && <p className={classes.error}>{error}</p>}

					<div className={classes.actions}>
						<button
							type="button"
							className={classes.cancelButton}
							onClick={onClose}
							disabled={isLoading}
						>
							Cancel
						</button>

						<button
							type="button"
							className={classes.confirmButton}
							onClick={confirmSale}
							disabled={isLoading}
						>
							{isLoading ? "Selling..." : "Confirm Sale"}
						</button>
					</div>
				</div>
			</aside>
		</>
	);
}

export default SellPopup;
