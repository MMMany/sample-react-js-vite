import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormGroup, FormControlLabel, Checkbox, FormLabel, Typography } from "@mui/material";
import { differenceWith, isEmpty, isEqual } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { useState, useMemo } from "react";

function FormCheckboxGroup({ name, label, values }) {
  const { control } = useFormContext();

  const [_values, setValues] = useState([]);
  useMemo(() => {
    const prev = _values.map(({ value }) => value);
    const isNotEqual = !isEqual(values, prev);
    if (isNotEqual) {
      // console.log("prev :", prev);
      // console.log("new :", values);
      const diff = differenceWith(values, prev, isEqual);
      const newValues = [
        ..._values.filter(({ value }) => values.includes(value)),
        ...diff.map((it) => ({ id: uuidv4(), value: it })),
      ];
      // console.log("newValues :", newValues);
      setValues(newValues);
    }
  }, [values, _values]);

  // console.log("_values :", _values);

  return (
    <FormControl>
      <FormLabel>{label || "Checkbox Group"}</FormLabel>
      {isEmpty(_values) ? (
        <Typography sx={{ pt: 1, color: "grey.500", fontStyle: "italic" }}>No Values</Typography>
      ) : (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <FormGroup
              onChange={(e) => {
                if (e.target.checked) {
                  field.onChange([...field.value, e.target.value]);
                } else {
                  field.onChange(field.value.filter((value) => value !== e.target.value));
                }
              }}
            >
              {_values.map(({ id, value }) => {
                return (
                  <FormControlLabel
                    key={id}
                    control={<Checkbox checked={field.value.includes(value)} />}
                    label={`${id} || ${value}`}
                    value={value}
                  />
                );
              })}
            </FormGroup>
          )}
        />
      )}
    </FormControl>
  );
}

export default FormCheckboxGroup;
