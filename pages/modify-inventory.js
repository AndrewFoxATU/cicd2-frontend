import { useState } from "react";
import classes from "./modify-inventory.module.css";
import GlobalContext from "./store/globalContext";
import { useContext } from "react";

const SPEED_RATINGS = [
  "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8",
  "B", "C", "D", "E", "F", "G", "H", "J", "K", "L",
  "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "Y", "ZR"
];

const SEASONS = ["Summer", "Winter", "All Season"];

const GRADE_VALUES = ["A", "B", "C", "D", "E"];

export default function ModifyInventoryPage() {
  const { theGlobalObject } = useContext(GlobalContext);
  const currentUser = theGlobalObject.currentUser;


  const [form, setForm] = useState({
    brand: "",
    model: "",
    size: "",
    load_rate: "",
    speed_rate: "",
    season: "",
    supplier: "",
    fuel_efficiency: "",
    noise_level: "",
    weather_efficiency: "",
    ev_approved: false,
    cost: "",
    quantity: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

    // Guard: admin or employee+ only

  if (!currentUser || (currentUser.permissions !== "admin" && currentUser.permissions !== "employee+")) {
    return (
      <div className={classes.pageWrapper}>
        <div className={classes.usersCard}>
          <h1 className={classes.title}>Users</h1>
          <p>Access restricted. Admins or Employee+ only.</p>
        </div>
      </div>
    );
  }
  
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      brand: form.brand,
      model: form.model,
      size: form.size,
      load_rate: parseInt(form.load_rate, 10),
      speed_rate: form.speed_rate,
      season: form.season,
      supplier: form.supplier,
      fuel_efficiency: form.fuel_efficiency,
      noise_level: parseInt(form.noise_level, 10),
      weather_efficiency: form.weather_efficiency,
      ev_approved: !!form.ev_approved,
      cost: parseFloat(form.cost),
      quantity: parseInt(form.quantity, 10)
    };

    try {
      const res = await fetch("/api/tyre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to add tyre");
        return;
      }

      setMessage("Tyre added to inventory.");
      setForm({
        brand: "",
        model: "",
        size: "",
        load_rate: "",
        speed_rate: "",
        season: "",
        supplier: "",
        fuel_efficiency: "",
        noise_level: "",
        weather_efficiency: "",
        ev_approved: false,
        cost: "",
        quantity: "",
      });
    } catch (err) {
      console.error("Error adding tyre:", err);
      setError("Error adding tyre");
    }
  }


  return (
    <div className={classes.pageWrapper}>
      <div className={classes.card}>
        <h1 className={classes.title}>Modify Inventory</h1>
        <p className={classes.subtitle}>Add a new tyre to the inventory.</p>

        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.grid}>
            <div className={classes.inputGroup}>
              <label>Brand</label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. Michelin, Faroad, Kormoran"
                required
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Model</label>
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="e.g. Primacy 4, FRD 16, Road Performance"
                required
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Size</label>
              <input
                name="size"
                value={form.size}
                onChange={handleChange}
                placeholder="e.g. 205/55R16"
                required
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Load rating</label>
              <input
                name="load_rate"
                type="number"
                value={form.load_rate}
                onChange={handleChange}
                required
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Speed rating</label>
              <select
                name="speed_rate"
                value={form.speed_rate}
                onChange={handleChange}
                placeholder="e.g. KeithRevins, Tractormotors, Michelin PLC"
                required
              >
                <option value="">Select speed rating</option>
                {SPEED_RATINGS.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.inputGroup}>
              <label>Season</label>
              <select
                name="season"
                value={form.season}
                onChange={handleChange}
                required
              >
                <option value="">Select season</option>
                {SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.inputGroup}>
              <label>Supplier</label>
              <input
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="e.g. KeithRevins, Tractormotors, Michelin PLC"
                required
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Fuel efficiency</label>
              <select
                name="fuel_efficiency"
                value={form.fuel_efficiency}
                onChange={handleChange}
                required
              >
                <option value="">Select fuel efficiency</option>
                {GRADE_VALUES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.inputGroup}>
              <label>Noise level (dB)</label>
              <input
                name="noise_level"
                type="number"
                value={form.noise_level}
                onChange={handleChange}
                required
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Weather efficiency</label>
              <select
                name="weather_efficiency"
                value={form.weather_efficiency}
                onChange={handleChange}
                required
              >
                <option value="">Select weather efficiency</option>
                {GRADE_VALUES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.inputGroupCheckbox}>
              <label>
                <input
                  type="checkbox"
                  name="ev_approved"
                  checked={form.ev_approved}
                  onChange={handleChange}
                />
                EV approved
              </label>
            </div>

            <div className={classes.inputGroup}>
              <label>Cost (€)</label>
              <input
                name="cost"
                type="number"
                step="0.01"
                value={form.cost}
                onChange={handleChange}
                required
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Quantity</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <p className={classes.error}>{error}</p>}
          {message && <p className={classes.success}>{message}</p>}

          <button type="submit" className={classes.submitButton}>
            Add Tyre
          </button>
        </form>
      </div>
    </div>
  );
}
