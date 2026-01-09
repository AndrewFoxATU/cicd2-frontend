import { useContext, useEffect, useState } from "react";
import classes from "./modify-inventory.module.css";
import GlobalContext from "../store/globalContext";

const SPEED_RATINGS = [
  "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8",
  "B", "C", "D", "E", "F", "G", "H", "J", "K", "L",
  "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "Y", "ZR"
];

const SEASONS = ["summer", "winter", "all season"];

const GRADE_VALUES = ["A", "B", "C", "D", "E"];

export default function ModifyInventoryPage() {
  const { theGlobalObject } = useContext(GlobalContext);
  const currentUser = theGlobalObject.currentUser;

  const [tyres, setTyres] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [mode, setMode] = useState("create");

  const [selectedTyreId, setSelectedTyreId] = useState(null);
  const [currentTyre, setCurrentTyre] = useState(null);
  const [newTyre, setNewTyre] = useState({
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
    ev_approved: null,
    cost: "",
    quantity: "",
  });

  useEffect(() => {
    if (
      currentUser &&
      (currentUser.permissions === "admin" || currentUser.permissions === "employee+")
    ) {
      loadTyres();
    }
  }, [currentUser]);

  async function loadTyres() {
    setErrorMsg("");
    try {
      const response = await fetch("/api/fetchTyres");
      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.detail || result.error || "Failed to load tyres");
        return;
      }

      setTyres(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name === "ev_approved") return;
    setNewTyre((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function setFormFromTyre(tyre) {
    if (!tyre) return;

    setNewTyre({
      brand: tyre.brand || "",
      model: tyre.model || "",
      size: tyre.size || "",
      load_rate: tyre.load_rate ?? "",
      speed_rate: tyre.speed_rate || "",
      season: tyre.season || "",
      supplier: tyre.supplier || "",
      fuel_efficiency: tyre.fuel_efficiency || "",
      noise_level: tyre.noise_level ?? "",
      weather_efficiency: tyre.weather_efficiency || "",
      ev_approved: null,
      cost: tyre.cost ?? "",
      quantity: tyre.quantity ?? "",
    });
  }

  async function handleDelete(tyreId) {
    setErrorMsg("");

    try {
      const response = await fetch(`/api/delete-tyre/${tyreId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        setErrorMsg(result.detail || result.error || "Failed to delete tyre");
        return;
      }

      await loadTyres();
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    }
  }

  function buildCreatePayload() {
    return {
      brand: newTyre.brand,
      model: newTyre.model,
      size: newTyre.size,
      load_rate: parseInt(newTyre.load_rate, 10),
      speed_rate: newTyre.speed_rate,
      season: newTyre.season,
      supplier: newTyre.supplier,
      fuel_efficiency: newTyre.fuel_efficiency,
      noise_level: parseInt(newTyre.noise_level, 10),
      weather_efficiency: newTyre.weather_efficiency,
      ev_approved: !!newTyre.ev_approved,
      cost: parseFloat(newTyre.cost),
      quantity: parseInt(newTyre.quantity, 10),
    };
  }

  function buildPatchPayload() {
    const payload = {};

    const setIfFilled = (key, value) => {
      if (value === "" || value === null || value === undefined) return;
      payload[key] = value;
    };

    setIfFilled("brand", newTyre.brand);
    setIfFilled("model", newTyre.model);
    setIfFilled("size", newTyre.size);
    setIfFilled("speed_rate", newTyre.speed_rate);
    setIfFilled("season", newTyre.season);
    setIfFilled("supplier", newTyre.supplier);
    setIfFilled("fuel_efficiency", newTyre.fuel_efficiency);
    setIfFilled("weather_efficiency", newTyre.weather_efficiency);

    if (newTyre.load_rate !== "") payload.load_rate = parseInt(newTyre.load_rate, 10);
    if (newTyre.noise_level !== "") payload.noise_level = parseInt(newTyre.noise_level, 10);
    if (newTyre.cost !== "") payload.cost = parseFloat(newTyre.cost);
    if (newTyre.quantity !== "") payload.quantity = parseInt(newTyre.quantity, 10);
    if (newTyre.ev_approved !== null && newTyre.ev_approved !== undefined) {
      payload.ev_approved = !!newTyre.ev_approved;
    }

    return payload;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (mode === "create") {
        const response = await fetch("/api/tyre", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildCreatePayload()),
        });

        const result = await response.json();

        if (!response.ok) {
          setErrorMsg(result.detail || result.error || "Failed to create tyre");
          return;
        }

        setNewTyre({
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

        setSelectedTyreId(null);
        setCurrentTyre(null);
        await loadTyres();
      } else {
        if (!selectedTyreId) return;

        const response = await fetch(`/api/update-tyre/${selectedTyreId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPatchPayload()),
        });

        const result = await response.json();

        if (!response.ok) {
          setErrorMsg(
            result.detail ||
              result.error ||
              result.upstream_body?.detail?.[0]?.msg ||
              "Failed to update tyre"
          );
          return;
        }

        await loadTyres();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    }
  }

  if (
    !currentUser ||
    (currentUser.permissions !== "admin" && currentUser.permissions !== "employee+")
  ) {
    return (
      <div className={classes.pageWrapper}>
        <div className={classes.usersCard}>
          <h1 className={classes.title}>Modify Inventory</h1>
          <p>Access restricted. Admins or Employee+ only.</p>
        </div>
      </div>
    );
  }

  const evChecked =
    mode === "edit"
      ? (newTyre.ev_approved !== null ? !!newTyre.ev_approved : !!currentTyre?.ev_approved)
      : !!newTyre.ev_approved;

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.usersGrid}>
        {/* LEFT: LIST */}
        <div className={classes.usersCard}>
          <h1 className={classes.title}>Inventory</h1>

          {errorMsg && <p className={classes.error}>{errorMsg}</p>}

          <table className={classes.userTable}>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Model</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {tyres.map((tyre) => (
                <tr key={tyre.id}>
                  <td>{tyre.brand}</td>
                  <td>{tyre.model}</td>
                  <td>{tyre.size}</td>
                  <td>{tyre.quantity}</td>
                  <td>
                    <button
                      type="button"
                      className={classes.deleteButton}
                      onClick={() => handleDelete(tyre.id)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT: FORM */}
        <div className={classes.usersCard}>
          <h1 className={classes.title}>Add / Edit Tyres</h1>

          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.inputGroup}>
              <label>Mode</label>
              <select
                value={mode}
                onChange={(e) => {
                  const value = e.target.value;
                  setMode(value);

                  if (value === "edit" && tyres.length > 0) {
                    const first = tyres[0];
                    setSelectedTyreId(first.id);
                    setCurrentTyre(first);
                    setFormFromTyre(first); // sets ev_approved = null
                  }

                  if (value === "create") {
                    setSelectedTyreId(null);
                    setCurrentTyre(null);
                    setNewTyre({
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
                  }
                }}
              >
                <option value="create">Create</option>
                <option value="edit">Edit</option>
              </select>
            </div>

            {mode === "edit" && (
              <div className={classes.inputGroup}>
                <label>Tyre to edit</label>
                <select
                  value={selectedTyreId ?? ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedTyreId(Number.isFinite(id) ? id : null);

                    const tyre = tyres.find((t) => t.id === id);
                    setCurrentTyre(tyre || null);

                    if (tyre) setFormFromTyre(tyre);
                  }}
                >
                  <option value="">-- Select tyre --</option>
                  {tyres.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.brand} {t.model} ({t.size})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={classes.inputGroup}>
              <label>Brand</label>
              <input
                name="brand"
                value={newTyre.brand}
                onChange={handleChange}
                required={mode === "create"}
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Model</label>
              <input
                name="model"
                value={newTyre.model}
                onChange={handleChange}
                required={mode === "create"}
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Size</label>
              <input
                name="size"
                value={newTyre.size}
                onChange={handleChange}
                required={mode === "create"}
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Load rating</label>
              <input
                name="load_rate"
                type="number"
                value={newTyre.load_rate}
                onChange={handleChange}
                required={mode === "create"}
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Speed rating</label>
              <select
                name="speed_rate"
                value={newTyre.speed_rate}
                onChange={handleChange}
                required={mode === "create"}
              >
                <option value="">Select speed rating</option>
                {SPEED_RATINGS.map((rate) => (
                  <option key={rate} value={rate}>{rate}</option>
                ))}
              </select>
            </div>

            <div className={classes.inputGroup}>
              <label>Season</label>
              <select
                name="season"
                value={newTyre.season}
                onChange={handleChange}
                required={mode === "create"}
              >
                <option value="">Select season</option>
                {SEASONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className={classes.inputGroup}>
              <label>Supplier</label>
              <input
                name="supplier"
                value={newTyre.supplier}
                onChange={handleChange}
                required={mode === "create"}
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Fuel efficiency</label>
              <select
                name="fuel_efficiency"
                value={newTyre.fuel_efficiency}
                onChange={handleChange}
                required={mode === "create"}
              >
                <option value="">Select fuel efficiency</option>
                {GRADE_VALUES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className={classes.inputGroup}>
              <label>Noise level (dB)</label>
              <input
                name="noise_level"
                type="number"
                value={newTyre.noise_level}
                onChange={handleChange}
                required={mode === "create"}
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Weather efficiency</label>
              <select
                name="weather_efficiency"
                value={newTyre.weather_efficiency}
                onChange={handleChange}
                required={mode === "create"}
              >
                <option value="">Select weather efficiency</option>
                {GRADE_VALUES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* EV approved checkbox: auto-ticks based on current tyre in edit mode */}
            <div className={classes.inputGroupCheckbox}>
              <label>
                <input
                  type="checkbox"
                  name="ev_approved"
                  checked={evChecked}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setNewTyre((prev) => ({
                      ...prev,
                      // create mode: store boolean
                      // edit mode: store boolean (and no longer "null", meaning user changed it)
                      ev_approved: checked,
                    }));
                  }}
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
                value={newTyre.cost}
                onChange={handleChange}
                required={mode === "create"}
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Quantity</label>
              <input
                name="quantity"
                type="number"
                value={newTyre.quantity}
                onChange={handleChange}
                required={mode === "create"}
              />
            </div>

            <button type="submit" className={classes.addButton}>
              {mode === "create" ? "Add Tyre" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
