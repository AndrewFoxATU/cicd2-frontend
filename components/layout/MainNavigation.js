import classes from './MainNavigation.module.css';
import Link from 'next/link';
import HamMenu from "../generic/HamMenu";
import { useState, useContext } from 'react';
import { useRouter } from "next/router";
import GlobalContext from "../../pages/store/globalContext";

function MainNavigation() {
  const router = useRouter();
  const { theGlobalObject, updateGlobals } = useContext(GlobalContext);

  const [popupToggle, setPopupToggle] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const currentUser = theGlobalObject.currentUser;
  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser && currentUser.permissions === "admin";
  const isEmployeePlus = currentUser && currentUser.permissions === "employee+";

  let menuPopupJsx = null;

  function toggleMenuHide() {
    setPopupToggle((prev) => !prev);
  }

  if (popupToggle && isAdmin) {
    menuPopupJsx = (
      <div className={classes.popupMenu}>
        <li className={classes.navItem}>
          <Link href="/users">Users</Link>
        </li>
        <li className={classes.navItem}>
          <Link href="/modify-inventory">Modify Inventory</Link>
        </li>
      </div>
    );
  }

    if (popupToggle && isEmployeePlus) {
    menuPopupJsx = (
      <div className={classes.popupMenu}>
        <li className={classes.navItem}>
          <Link href="/modify-inventory">Modify Inventory</Link>
        </li>
      </div>
    );
  }

  async function handleAuthClick() {
    if (isLoggedIn) {
      // Logout then go to login/register page
      await updateGlobals({ cmd: "logout" });
      router.push("/");
    } else {
      // Go to login/register page
      router.push("/");
    }
  }

  function toggleProfile() {
    if (!isLoggedIn) {
      router.push("/");
      return;
    }
    setProfileOpen((prev) => !prev);
  }
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        Tyre<span>Manager</span>
      </div>

      <nav className={classes.nav}>
        <ul className={classes.navList}>
          {isLoggedIn && (
            <>
              <li className={classes.navItem}>
                <Link href="/tyres">Inventory</Link>
              </li>

              {(isAdmin || isEmployeePlus) && (
                <>
                  <li>{menuPopupJsx}</li>
                  <li>
                    <HamMenu toggleMenuHide={toggleMenuHide} />
                  </li>
                </>
              )}
            </>
          )}

          <li>
            <button
              className={classes.navButton}
              type="button"
              onClick={toggleProfile}
            >
              Profile
            </button>
          </li>

          <li>
            <button
              className={classes.navButton}
              type="button"
              onClick={handleAuthClick}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </li>
        </ul>
      </nav>

      {profileOpen && isLoggedIn && (
        <>
          <div
            className={classes.backdrop}
            onClick={() => setProfileOpen(false)}
          />
          <aside className={classes.profileSidebar}>
            <h2>Profile</h2>
            <p>
              <strong>Name:</strong> {currentUser.name}
            </p>
            <p>
              <strong>Permissions:</strong> {currentUser.permissions}
            </p>

            <button
              type="button"
              className={classes.closeProfile}
              onClick={() => setProfileOpen(false)}
            >
              Close
            </button>
          </aside>
        </>
      )}
    </header>
  );

}

export default MainNavigation;
