import useMediaQuery from "@mui/material/useMediaQuery";

export const useSize = () => {
  const isMobileSize = useMediaQuery('(max-width: 400px)', {noSsr: true});
  return { isMobileSize };
};
