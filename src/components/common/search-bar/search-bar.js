import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import Close from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { BotigaCalendarWithButton } from "../../common/BotigaCalendar/BotigaCalendar";
import {
  getMinDateRangeToViewDelivery,
  getMaxDateRangeForDeliveryAction,
} from "../../../helpers/util";
import { generateDeliveryExcel } from "../../../helpers/generateDeliveryExcel";
import Icon from "@material-ui/core/Icon";
import msExcelIcon from "../../../assets/icons/microsoft-excel.svg";

import "./search-bar.css";

const useStyles = makeStyles((_) => ({
  input: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none",
      },
      width: "335px",
      height: "44px",
      background: "#FFFFFF",
      borderRadius: "4px",
      fontFamily: "Montserrat",
    },
    "& .MuiInputAdornment-positionStart": {
      marginRight: "0px",
    },
  },
}));

export default function SearchBar({
  screenName,
  reset,
  handleChange,
  searchValue,
  placeHolder = "",
  onEnter,
}) {
  const classes = useStyles();
  return (
    <div className="search-bar">
      <div className="screen-title">{screenName}</div>
      <TextField
        value={searchValue}
        onChange={handleChange}
        id="search"
        placeholder={placeHolder}
        variant="outlined"
        className={classes.input}
        onKeyDown={(event) => {
          if (typeof onEnter === "function" && event.keyCode === 13) {
            onEnter();
          }
        }}
        InputProps={{
          endAdornment: searchValue ? (
            <InputAdornment position="start">
              <IconButton aria-label="delete" size="small" onClick={reset}>
                <Close />
              </IconButton>
            </InputAdornment>
          ) : (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

export function SearchBarDelivery({
  screenName,
  reset,
  handleChange,
  searchValue,
  placeHolder = "",
  onDateChange,
  selectedDeliverydate,
  aggregateDelivery = [],
  toggleDrawer,
  setError,
  brandName,
}) {
  const classes = useStyles();

  function _generateDeliveryExcel() {
    generateDeliveryExcel(
      aggregateDelivery,
      setError,
      brandName,
      selectedDeliverydate
    );
  }

  const excelSvgIcon = (
    <Icon>
      <img className="ms-excelIcon" alt="excel-download" src={msExcelIcon} />
    </Icon>
  );

  return (
    <div className="search-bar">
      <div className="screen-title-conatiner">
        <div className="screen-title">{screenName}</div>
        <div className="spacer" />
        <BotigaCalendarWithButton
          disableToolbar
          currentSelectedDate={selectedDeliverydate}
          onDateChange={onDateChange}
          btnClassName="delivery-date-selection-btn"
          id="delivery-date"
          variant="inline"
          minDate={getMinDateRangeToViewDelivery(-45)}
          maxDate={getMaxDateRangeForDeliveryAction(7)}
        />
      </div>
      <div className="screen-search-container">
        <Button
          className="sec-action"
          onClick={() => toggleDrawer(true)}
          startIcon={<ListAltIcon />}
        >
          Product Breakup
        </Button>
        <div className="spacer" />
        <Button
          className="sec-action"
          onClick={_generateDeliveryExcel}
          startIcon={excelSvgIcon}
        >
          Download Excel
        </Button>
        <div className="spacer" />
        <TextField
          value={searchValue}
          onChange={handleChange}
          id="search"
          placeholder={placeHolder}
          variant="outlined"
          className={classes.input}
          InputProps={{
            endAdornment: searchValue ? (
              <InputAdornment position="start">
                <IconButton aria-label="delete" size="small" onClick={reset}>
                  <Close />
                </IconButton>
              </InputAdornment>
            ) : (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
}
