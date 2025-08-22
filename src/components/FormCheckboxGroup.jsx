import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormGroup, FormControlLabel, Checkbox, FormLabel, Typography } from "@mui/material";
import { differenceWith, isEmpty, isEqual, isString, union } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { useState, useMemo } from "react";
import PropTypes from "prop-types";

function FormCheckboxGroup({ name, label = "", values = [], initialSelected = [], required, supportAllCheck }) {
  if (!isString(name) || isEmpty(name)) {
    throw new Error("FormCheckboxGroup: name is required and must be a string");
  }

  const { control } = useFormContext();

  const [_values, setValues] = useState(() => {
    return values.map((v) => ({ id: uuidv4(), value: v }));
  });

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
      {!!label && (
        <FormLabel component="span" required={!!required && !isEmpty(_values)} focused={false}>
          {label}
        </FormLabel>
      )}
      {isEmpty(_values) ? (
        <Typography sx={{ pt: 1, color: "grey.500", fontStyle: "italic" }}>No Values</Typography>
      ) : (
        <Controller
          name={name}
          control={control}
          defaultValue={initialSelected}
          render={({ field }) => (
            <>
              {!!supportAllCheck && (
                <FormControlLabel
                  key="chkbox-all"
                  control={<Checkbox checked={field.value.length === values.length} />}
                  label="All"
                  value="chkbox-all"
                  onClick={(e) => {
                    if (e.target.type !== "checkbox") return;
                    if (e.target.checked) {
                      field.onChange([...values]);
                    } else {
                      field.onChange([]);
                    }
                  }}
                />
              )}
              <FormGroup
                row
                onChange={(e) => {
                  if (e.target.type !== "checkbox") return;
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
            </>
          )}
        />
      )}
    </FormControl>
  );
}
FormCheckboxGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.string.isRequired),
  initialSelected: PropTypes.arrayOf(PropTypes.string.isRequired),
  required: PropTypes.bool,
  supportAllCheck: PropTypes.bool,
};

export default FormCheckboxGroup;
