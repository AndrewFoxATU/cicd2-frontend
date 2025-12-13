import { useEffect, useState, useContext } from "react";
import TyreFilters from "../components/tyres/TyreFilters";
import TyreTable from "../components/tyres/TyreTable";
import classes from "./tyres.module.css";
import GlobalContext from "./store/globalContext";

export default function TyresPage() {
    const { theGlobalObject } = useContext(GlobalContext);
    const currentUser = theGlobalObject.currentUser;

    const [initialTyres, setInitialTyres] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });



    // Load tyres on mount
    useEffect(() => {
        loadTyres();
    }, []);

    async function loadTyres() {
        const response = await fetch("/api/fetchTyres");
        const data = await response.json();

        setInitialTyres(data);
        setFiltered(data);
    }

    // Guard: logged-in users only
    if (!currentUser) {
        return (
            <div className={classes.pageWrapper}>
                <div className={classes.usersCard}>
                    <h1 className={classes.title}>Tyres</h1>
                    <p>You must be logged in to view this page.</p>
                </div>
            </div>
        );
    }
    function applyFilters(filters) {
        const { size, brand, season, evOnly } = filters;

        let list = [...initialTyres];

        if (size?.trim()) list = list.filter(t => t.size.toLowerCase().includes(size.toLowerCase()));
        if (brand && brand !== "all") list = list.filter(t => t.brand === brand);
        if (season && season !== "all") list = list.filter(t => t.season === season);
        if (evOnly) list = list.filter(t => t.ev_approved === true);

        // default sort – quantity desc
        list.sort((a, b) => b.quantity - a.quantity);

        setFiltered(list);
        setSortConfig({ key: "quantity", direction: "desc" });
    }

    function handleSort(column) {
        if (!filtered.length) return;

        const sampleValue = filtered[0][column];
        const isNumber = typeof sampleValue === "number";

        let direction;
        if (sortConfig.key === column) {
            direction = sortConfig.direction === "asc" ? "desc" : "asc";
        } else {
            direction = isNumber ? "desc" : "asc";
        }

        setSortConfig({ key: column, direction });

        const sorted = [...filtered].sort((a, b) => {
            const A = a[column];
            const B = b[column];

            return isNumber
                ? direction === "asc" ? A - B : B - A
                : direction === "asc" ? String(A).localeCompare(String(B)) : String(B).localeCompare(String(A));
        });

        setFiltered(sorted);
    }

    return (
        <div className={classes.layout}>
            <div className={classes.sidebar}>
                <TyreFilters tyres={initialTyres} onFilter={applyFilters} />
            </div>

            <div className={classes.tableArea}>
                <TyreTable tyres={filtered} onSort={handleSort} sortConfig={sortConfig} />
            </div>
        </div>
    );
}
