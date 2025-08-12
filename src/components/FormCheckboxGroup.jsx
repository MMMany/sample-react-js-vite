import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormGroup, FormControlLabel, Checkbox, FormLabel, Typography } from "@mui/material";
import { isEmpty } from "lodash-es";

function FormCheckboxGroup({ name, label, values, id }) {
  const { control } = useFormContext();

  return (
    <FormControl>
      <FormLabel>{label || "Checkbox Group"}</FormLabel>
      {isEmpty(values) ? (
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
              {values.map((it) => {
                return (
                  <FormControlLabel
                    key={`${id}+${it}`}
                    control={<Checkbox />}
                    label={`${id} || ${it}`}
                    value={it}
                    checked={field.value.includes(it)}
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
