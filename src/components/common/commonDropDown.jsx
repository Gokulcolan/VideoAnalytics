// src/components/common/commonDropdown.js
import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const CommonDropdown = ({
  id,
  label,
  options,
  sx,
  customStyles,
  value,
  required,
  customChange,
  onOpen,
}) => {
  const handleChange = (event) => {
    if (customChange) {
      customChange(event.target.value);
    }
  };

  return (
    <FormControl fullWidth sx={sx} style={customStyles}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        label={label}
        required={required}
        onOpen={onOpen}
      >
        {options &&
          options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default CommonDropdown;
