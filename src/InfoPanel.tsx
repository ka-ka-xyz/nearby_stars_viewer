import { useState } from "react";
import {
  IconButton,
  Drawer,
  Grid,
  Box,
  TextField,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Star } from "./Star";
import { useSize } from "./utils";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

export const NORMAL_HEIGHT_PX = 300;
export const MOBILE_HEIGHT_PX = 165;

const StyledGridContainer = styled(Grid)({
  padding: "20px",
});
const StyledGridItem = styled(Grid)({
  borderBottom: "solid",
  borderBottomWidth: "1px",
  paddingTop: "5px",
  paddingRight: "5px",
  overflowWrap: "break-word",
})

const SearchStarInput = (props: {
  selected: Star | null,
  setSelected: (star: Star | null) => void,
  starsMap: Map<string, Star>,
}) => {
  const [current, setCurrent] = useState<{
    label: string,
    value: Star
  } | null>(null);
  const options = Array.from(props.starsMap.entries()).map(([k, v]) => {
    return {
      label: v.dispNames.join(", "),
      value: v
    }
  })
  return (
    <Autocomplete
      value={current}
      disablePortal
      style={{ width: "95%"}}
      options={options}
      sx={{ width: 300 }}
      onChange={(event: any, newValue: {label: string, value: Star} | null) => {
        const newStar = newValue?.value ?? null;
        props.setSelected(newStar);
      }}
      renderInput={(params) => <TextField {...params} label="Name" />}
    />
  );
}

export const InfoPanel = (props: {
  selected: Star | null,
  setSelected: (star: Star | null) => void,
  starsMap: Map<string, Star>,
}) => {
  const [showFullMobile, setShowFullMobile] = useState<boolean>(false);
  const { isMobileSize } = useSize();

  if (!isMobileSize) {
    return (
      <Drawer
        variant="permanent"
        anchor="right"
      >
        <div
          style={{ width: `${NORMAL_HEIGHT_PX}px` }}
        >
          <StyledGridContainer container>
            <StyledGridItem item xs={12}>
              <SearchStarInput
                {...props}
              />
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Name
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.dispNames.join(", ")}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Spectal Type
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.spectralType}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Distance (ly)
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.distance}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Actual Magnitude
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.actualMagnitude}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Absolute Magnitude
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.absoluteMagnitude}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Ra.
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.ra}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Dec.
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.dec}
            </StyledGridItem>
          </StyledGridContainer>
        </div>
      </Drawer>
    );
  }

  if (showFullMobile) {
    return (
      <Drawer
        variant="permanent"
        anchor="bottom"
      >
        <div
          style={{ width: "100%" }}
        >
          <Box display="flex" justifyItems="flex-end">
            <IconButton style={{ marginLeft: "auto" }} onClick={() => setShowFullMobile(false)}>
              <KeyboardDoubleArrowDownIcon />
            </IconButton>
          </Box>
          <StyledGridContainer container>
            <StyledGridItem item xs={12}>
              <SearchStarInput
                {...props}
              />
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Name
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.dispNames.join(", ")}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Spectal Type
            </StyledGridItem>
            <StyledGridItem item xs={2}>
              {props.selected?.spectralType}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Distance (ly)
            </StyledGridItem>
            <StyledGridItem item xs={2}>
              {props.selected?.distance}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Actual Magnitude
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.actualMagnitude}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Absolute Magnitude
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.absoluteMagnitude}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Ra.
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.ra}
            </StyledGridItem>
            <StyledGridItem item xs={4}>
              Dec.
            </StyledGridItem>
            <StyledGridItem item xs={8}>
              {props.selected?.dec}
            </StyledGridItem>
          </StyledGridContainer>
        </div>
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      anchor="bottom"
    >
      <div
        style={{ width: "100%", height: `${MOBILE_HEIGHT_PX}px` }}
      >
        <Box display="flex" justifyItems="flex-end">
          <IconButton style={{ marginLeft: "auto" }} onClick={() => setShowFullMobile(true)}>
            <KeyboardDoubleArrowUpIcon />
          </IconButton>
        </Box>
        <StyledGridContainer container>
          <StyledGridItem item xs={4}>
            Name
          </StyledGridItem>
          <StyledGridItem item xs={8}>
            {props.selected?.dispNames.join(", ")}
          </StyledGridItem>
          <StyledGridItem item xs={4}>
            Spectal Type
          </StyledGridItem>
          <StyledGridItem item xs={2}>
            {props.selected?.spectralType}
          </StyledGridItem>
          <StyledGridItem item xs={4}>
            Distance (ly)
          </StyledGridItem>
          <StyledGridItem item xs={2}>
            {props.selected?.distance}
          </StyledGridItem>
        </StyledGridContainer>
      </div>
    </Drawer>
  );
}
