import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const ESN_LOGO_PATH = "m403.06 422.17 13.81-85.65h-184.5l7.23-44.72h184.5l14.34-88.75-232.49-.02c-58.43 0-62.56 61.63-66.95 88.75l-34.16 211.53c-4.68 29.07 15.07 52.61 44.11 52.61h232.5l14.36-89.04h-184.5l7.21-44.72h184.52Zm613.89-219.11H784.63l-14.33 88.75h168.98l-42.67 264.12h115.98l48.48-300.26c4.71-29.04-15.04-52.61-44.11-52.61ZM727.89 555.93h113.48l35.43-219.4H763.33l-35.43 219.4Zm11.89-264.12 14.34-88.75-232.47-.02c-58.43 0-62.56 61.63-66.95 88.75s0 .01 0 .01h285.08Zm-58.27 44.72h-233.7l-5.65 35.23a43.49 43.49 0 0 0 9.82 35.12 43.48 43.48 0 0 0 32.97 15.29h133.26l-7.25 44.72H426.45l-14.39 89.04h232.48c29.04 0 56.4-23.54 61.1-52.61l18.8-116.38a43.482 43.482 0 0 0-42.93-50.41m382.23 170.69c-14.19 0-25.72 11.53-25.72 25.72s11.53 25.7 25.72 25.7 25.7-11.53 25.7-25.7-11.53-25.72-25.7-25.72m0 45.73c-11 0-20.04-9.04-20.04-20.02s9.04-20.04 20.04-20.04 20.02 9.04 20.02 20.04-9.04 20.02-20.02 20.02m11.69-24.1c0-9.39-7.8-9.39-9.91-9.39h-11.35v26.05h6.38v-7.27h2.84l4.43 7.27h7.09l-5.32-8.15c2.84-1.07 5.85-3.56 5.85-8.51Zm-11.51 4.26h-3.38v-8.16h3.38c3.36 0 4.78.89 4.78 3.91s-1.42 4.26-4.78 4.26Zm-862.27 87.75H186.9v13.73h25.53v3.22h-29.12v-35.02h27.94v3.22H186.9v11.69h14.75zm25.1-18.08v31.8h22.52v3.22h-26.12v-35.02h3.59Zm31.91 35.03v-35.02h3.59v35.02zm13.52-35.03h30.62V606h-13.51v31.8h-3.59V606h-13.51v-3.22Zm58.88 18.08h-14.75v13.73h25.53v3.22h-29.12v-35.02h27.94v3.22h-24.35v11.69h14.75zm73.32-11.32c-2.15-1.99-6.7-4.51-13.19-4.51-4.72 0-10.08 1.77-10.08 6.76s6.27 5.25 12.23 5.58c6.06.38 15.87.97 15.87 10.03 0 7.88-7.35 11.26-15.77 11.26s-14.16-3.7-17.86-7.13l2.2-2.47c3.06 2.84 7.94 6.49 15.71 6.49 6.54 0 12.12-2.41 12.12-7.72 0-5.9-6.38-6.6-12.28-6.97-7.4-.43-15.82-.96-15.82-8.79s7.67-10.08 13.84-10.08c7.08 0 12.6 2.89 15.23 5.09l-2.2 2.47Zm16.25 28.27v-35.02h18.56c4.34 0 7.35 1.13 9.6 3.49 1.72 1.82 2.63 4.07 2.63 6.54 0 2.73-1.13 5.15-3 6.97-2.14 2.09-5.09 3.11-9.22 3.11h-14.96v14.91h-3.59Zm3.59-31.81v13.73h14.96c2.36 0 4.72-.38 6.6-2.2 1.34-1.23 2.04-2.95 2.04-4.72 0-1.67-.64-3.17-1.82-4.45-1.72-1.83-4.02-2.36-6.81-2.36h-14.96Zm53.79-4.02c10.78 0 19.36 8.15 19.36 18.23s-8.58 18.45-19.36 18.45-19.2-8.21-19.2-18.45 8.47-18.23 19.2-18.23m0 33.46c8.74 0 15.61-6.81 15.61-15.23s-6.86-15.07-15.61-15.07-15.39 6.76-15.39 15.07 6.76 15.23 15.39 15.23m31.21 2.37v-35.02h19.25c4.4 0 7.45 1.18 9.55 3.43 1.66 1.77 2.63 4.08 2.63 6.7 0 4.72-3.27 8.58-8.47 9.55l8.8 15.34h-4.08l-8.37-14.91h-15.71v14.91h-3.59Zm3.6-31.81v13.73h16.95c4.4 0 7.29-3.16 7.29-6.86 0-1.77-.64-3.32-1.82-4.56-1.66-1.71-3.92-2.3-6.76-2.3h-15.66Zm35.18-3.22h30.62V606h-13.51v31.8h-3.59V606h-13.51v-3.22Zm65.53 6.76c-2.15-1.99-6.7-4.51-13.19-4.51-4.72 0-10.08 1.77-10.08 6.76s6.27 5.25 12.23 5.58c6.06.38 15.87.97 15.87 10.03 0 7.88-7.35 11.26-15.77 11.26s-14.16-3.7-17.86-7.13l2.2-2.47c3.06 2.84 7.94 6.49 15.71 6.49 6.54 0 12.12-2.41 12.12-7.72 0-5.9-6.38-6.6-12.28-6.97-7.4-.43-15.82-.96-15.82-8.79s7.67-10.08 13.84-10.08c7.08 0 12.6 2.89 15.23 5.09l-2.2 2.47Zm73.9-6.76v35.02h-3.38l-23.81-28.85h-.05v28.85h-3.59v-35.02h3.38l23.81 28.85h.05v-28.85zm44.89 0v22.58c0 8.47-6.54 13.3-15.34 13.3s-15.23-4.83-15.23-13.3v-22.58h3.59v22.58c0 6.49 5.04 10.08 11.64 10.08s11.74-3.59 11.74-10.08v-22.58h3.59Zm9.17 0h30.62V606H758.6v31.8h-3.59V606H741.5v-3.22Zm40.55 35.03v-35.02h19.25c4.4 0 7.45 1.18 9.55 3.43 1.66 1.77 2.63 4.08 2.63 6.7 0 4.72-3.27 8.58-8.47 9.55l8.8 15.34h-4.08l-8.37-14.91h-15.71v14.91h-3.59Zm3.59-31.81v13.73h16.95c4.4 0 7.29-3.16 7.29-6.86 0-1.77-.64-3.32-1.82-4.56-1.66-1.71-3.92-2.3-6.76-2.3h-15.66Zm40.33 31.81v-35.02h3.59v35.02zm13.52-35.03h30.62V606h-13.51v31.8H853V606h-13.51v-3.22Zm40.54 35.03v-35.02h3.59v35.02zm34.65-35.83c10.78 0 19.36 8.15 19.36 18.23s-8.58 18.45-19.36 18.45-19.2-8.21-19.2-18.45 8.47-18.23 19.2-18.23m0 33.46c8.74 0 15.61-6.81 15.61-15.23s-6.86-15.07-15.61-15.07-15.39 6.76-15.39 15.07 6.76 15.23 15.39 15.23m62.05-32.66v35.02h-3.38l-23.81-28.85h-.05v28.85h-3.59v-35.02h3.38l23.81 28.85h.05v-28.85z";

export default function HeaderESN() {
  const navigate = useNavigate();
  const { count: itemCount } = useCart();
  const [cartCount, setCartCount] = useState(0);

  const updateCount = () => {
    try {
      const saved = sessionStorage.getItem("cart");
      const cart = saved ? JSON.parse(saved) : [];
      const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    updateCount();
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  const displayCount = itemCount > 0 ? itemCount : cartCount;

  return (
    <>
      {/* Main Header */}
      <header className="esnhdr">
        <div className="esnhdr__inner">
          {/* Left: Mobile Menu + Search */}
          <div className="esnhdr__left">
            <button className="esnhdr__btn" aria-label="Menü umschalten">
              <svg className="esnhdr__icon" viewBox="0 0 24 24">
                <path d="M2.75 12a1 1 0 0 1 1-1h16.5a1 1 0 1 1 0 2H3.75a1 1 0 0 1-1-1ZM2.75 6a1 1 0 0 1 1-1h16.5a1 1 0 1 1 0 2H3.75a1 1 0 0 1-1-1ZM2.75 18a1 1 0 0 1 1-1h16.5a1 1 0 1 1 0 2H3.75a1 1 0 0 1-1-1Z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>
            <button className="esnhdr__btn esnhdr__mobile-only" aria-label="Suche umschalten">
              <svg className="esnhdr__icon" viewBox="0 0 24 24">
                <path d="M10.875 4a6.875 6.875 0 1 0 0 13.75 6.875 6.875 0 0 0 0-13.75ZM2 10.875a8.875 8.875 0 1 1 17.75 0 8.875 8.875 0 0 1-17.75 0Z" fillRule="evenodd" clipRule="evenodd" />
                <path d="M15.736 15.737a1 1 0 0 1 1.414 0l4.556 4.556a1 1 0 1 1-1.414 1.414l-4.556-4.556a1 1 0 0 1 0-1.414Z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Center: Logo */}
          <div className="esnhdr__center">
            <button className="esnhdr__logo" onClick={() => navigate("/")}>
              <span className="visually-hidden">ESN</span>
              <svg className="esnhdr__logo-svg" viewBox="104.15 203.03 985.29 435.63">
                <path d={ESN_LOGO_PATH} />
              </svg>
            </button>
          </div>

          {/* Right: Search, Country, Account, Wishlist, Cart */}
          <div className="esnhdr__right">
            {/* Desktop Search */}
            <form className="esnhdr__search" onSubmit={e => e.preventDefault()}>
              <input
                type="search"
                placeholder="Suche nach Protein, Kreatin, ..."
                className="esnhdr__search-input"
              />
              <button type="submit" className="esnhdr__search-btn" aria-label="Suche umschalten">
                <svg className="esnhdr__icon" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" />
                </svg>
              </button>
            </form>

            {/* Country Switcher */}
            <button className="esnhdr__btn esnhdr__country" type="button">
              <img
                className="esnhdr__flag"
                src="https://cdn.shopify.com/static/images/flags/de.svg"
                alt="Deutschland"
              />
              <span className="esnhdr__country-label">DE</span>
              <svg className="esnhdr__icon esnhdr__icon--sm" viewBox="0 0 24 24">
                <path d="M3.793 8.293a1 1 0 0 1 1.414 0L12 15.086l6.793-6.793a1 1 0 1 1 1.414 1.414l-7.5 7.5a1 1 0 0 1-1.414 0l-7.5-7.5a1 1 0 0 1 0-1.414Z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>

            {/* Account */}
            <button className="esnhdr__btn esnhdr__desktop-only" aria-label="Konto">
              <svg className="esnhdr__icon" viewBox="0 0 24 24">
                <path d="M12 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM5 9a7 7 0 1 1 14 0A7 7 0 0 1 5 9Z" fillRule="evenodd" clipRule="evenodd" />
                <path d="M12 16a9.504 9.504 0 0 0-8.229 4.75 1 1 0 0 1-1.732-1.001 11.503 11.503 0 0 1 19.922 0 1 1 0 1 1-1.732 1A9.504 9.504 0 0 0 12 16Z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>

            {/* Wishlist */}
            <button className="esnhdr__btn esnhdr__desktop-only" aria-label="Wunschzettel">
              <svg className="esnhdr__icon" viewBox="0 0 24 24">
                <path d="M14.7 3.167A5.875 5.875 0 0 1 21.246 4.7c2.17 2.41 1.779 6.085-.412 8.275l-7.597 7.597-.707-.707.707.707a1.75 1.75 0 0 1-2.474 0L2.97 12.78a5.875 5.875 0 0 1 .228-8.525c2.41-2.17 6.084-1.779 8.275.412L12 5.19l.72-.72a5.875 5.875 0 0 1 1.98-1.304Zm2.28 1.584a3.875 3.875 0 0 0-2.845 1.134l-1.428 1.428a1 1 0 0 1-1.414 0L10.06 6.08c-1.542-1.542-4.009-1.703-5.523-.34v.001a3.875 3.875 0 0 0-.152 5.624L12 18.98l7.42-7.42c1.542-1.542 1.703-4.009.34-5.523h-.001a3.875 3.875 0 0 0-2.78-1.286Z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>

            {/* Cart */}
            <button
              className="esnhdr__btn esnhdr__cart"
              onClick={() => window.dispatchEvent(new CustomEvent("open-cart"))}
              aria-label="Warenkorb umschalten"
            >
              <svg className="esnhdr__icon" viewBox="0 0 24 24">
                <path d="m3.367 7.75 1.278 11.5h14.71l1.278-11.5H3.367Zm-.993-1.848c.224-.1.468-.152.714-.152h17.824a1.75 1.75 0 0 1 1.74 1.943l-1.334 12a1.75 1.75 0 0 1-1.74 1.557H4.422a1.75 1.75 0 0 1-1.739-1.557l-1.333-12 .993-.11-.993.11a1.75 1.75 0 0 1 1.025-1.79Z" fillRule="evenodd" clipRule="evenodd" />
                <path d="M12 4a2.75 2.75 0 0 0-2.75 2.75 1 1 0 0 1-2 0 4.75 4.75 0 1 1 9.5 0 1 1 0 1 1-2 0A2.75 2.75 0 0 0 12 4Z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
              {displayCount > 0 && (
                <span className="esnhdr__badge">{displayCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <style>{`
        /* ── Visually Hidden ── */
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* ── Header ── */
        .esnhdr {
          background: #fff;
          border-bottom: 1px solid #edf1f2;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Wix Madefor Text', Helvetica, Arial, sans-serif;
        }
        .esnhdr__inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Left */
        .esnhdr__left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        /* Center: Logo */
        .esnhdr__center {
          min-width: 90px;
          display: flex;
          justify-content: center;
        }
        .esnhdr__logo {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .esnhdr__logo-svg {
          height: 35px;
          width: 90px;
          fill: #000;
        }

        /* Right */
        .esnhdr__right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          justify-content: flex-end;
        }

        /* Buttons */
        .esnhdr__btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          color: #232323;
          transition: opacity 0.15s;
        }
        .esnhdr__btn:hover {
          opacity: 0.7;
        }

        /* Icons */
        .esnhdr__icon {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }
        .esnhdr__icon--sm {
          width: 16px;
          height: 16px;
        }

        /* Country */
        .esnhdr__country-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .esnhdr__flag {
          width: 20px;
          height: 14px;
          object-fit: cover;
        }

        /* Search - Desktop */
        .esnhdr__search {
          display: none;
          position: relative;
          margin-right: 8px;
        }
        .esnhdr__search-input {
          padding: 10px 40px 10px 16px;
          border-radius: 24px;
          border: 1px solid #edf1f2;
          background: #f8f9fa;
          font-size: 13px;
          width: 250px;
          outline: none;
          font-family: 'Wix Madefor Text', Helvetica, Arial, sans-serif;
          color: #232323;
        }
        .esnhdr__search-input::placeholder {
          color: #757575;
        }
        .esnhdr__search-input:focus {
          border-color: #000;
          background: #fff;
        }
        .esnhdr__search-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          color: #6b7280;
        }

        /* Cart */
        .esnhdr__cart {
          position: relative;
        }
        .esnhdr__badge {
          position: absolute;
          top: -2px;
          left: -2px;
          background: #4ec3e0;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          line-height: 1;
        }

        /* Mobile-only elements */
        .esnhdr__mobile-only {
          display: flex;
        }
        .esnhdr__desktop-only {
          display: none;
        }

        /* Desktop (>=1024px) */
        @media (min-width: 1024px) {
          .esnhdr__inner {
            padding: 16px 32px;
          }
          .esnhdr__left {
            display: none;
          }
          .esnhdr__center {
            min-width: 141px;
          }
          .esnhdr__logo-svg {
            height: 35px;
            width: 90px;
          }
          .esnhdr__search {
            display: block;
          }
          .esnhdr__mobile-only {
            display: none;
          }
          .esnhdr__desktop-only {
            display: flex;
          }
          .esnhdr__country {
            display: flex;
          }
        }

        /* Mobile (<=768px) */
        @media (max-width: 768px) {
          .esnhdr__inner {
            padding: 12px 16px;
            gap: 8px;
          }
          .esnhdr__logo-svg {
            height: 28px;
            width: 72px;
          }
          .esnhdr__country-label {
            display: none;
          }
          .esnhdr__flag {
            width: 18px;
            height: 12px;
          }
        }

        @media (max-width: 480px) {
          .esnhdr__inner {
            padding: 10px 12px;
          }
          .esnhdr__logo-svg {
            height: 24px;
            width: 62px;
          }
        }
      `}</style>
    </>
  );
}
