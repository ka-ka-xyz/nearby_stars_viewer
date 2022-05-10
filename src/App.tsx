import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import * as colors from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";
import { Viewer } from "./Viewer";
import { loadCatalog } from "./CatalogLoader";
import { Star } from "./Star";
import { InfoPanel } from "./InfoPanel";

function App() {

  const [starsMap, setStarsMap] = useState(new Map<string, Star>());
  const [selected, setSelected] = useState<Star | null>(null);
  useEffect(() => {
    const init = async (): Promise<void> => {
      const stars = await loadCatalog();
      setStarsMap(stars.reduce((acc, star) => {
        acc.set(`star_${star.idx}`, star);
        return acc;
      }, new Map<string, Star>()));
    }
    init();
    return () => setStarsMap(new Map());
  }, []);
  const theme = createTheme({
    palette: {
      primary: {
        main: colors.blue[800],
      },
      mode: "dark",
    },
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Viewer
          starsMap={starsMap}
          setSelected={setSelected}
          selected={selected}
        />
        <InfoPanel
          starsMap={starsMap}
          setSelected={setSelected}
          selected={selected}
        />
      </ThemeProvider>
    </div>
  );
}

export default App;
