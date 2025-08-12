import { useState } from "react";
import { Button, Box, Typography, Divider, Stack } from "@mui/material";
import { useUUID } from "#/hooks";
import { shuffle } from "lodash-es";
import { useForm, FormProvider } from "react-hook-form";
import FormCheckboxGroup from "#/components/FormCheckboxGroup";

function FullButton({ children, ...props }) {
  return (
    <Button variant="contained" {...props}>
      {children}
    </Button>
  );
}

function SamplePage() {
  const uuid = useUUID();
  const [values, setValues] = useState(["value-1", "value-2", "value-3"]);

  const methods = useForm({
    defaultValues: {
      example: [],
    },
  });

  const onSubmit = (data) => {
    alert(`submit\n\n${JSON.stringify(data.example, null, 2)}`);
  };

  console.log(methods.watch("example"));

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography>Dynamic Form Components Test</Typography>
        <Stack spacing={1} direction="row" sx={{ position: "relative", right: 0 }}>
          <FullButton
            onClick={() => {
              setValues((prev) => {
                if (prev.length === 0) {
                  return ["value-1"];
                }
                const sorted = prev.toSorted((a, b) => {
                  const aIdx = Number(a.split("-").pop());
                  const bIdx = Number(b.split("-").pop());
                  return aIdx - bIdx;
                });
                const last = sorted.pop();
                const nextIdx = Number(last.split("-").pop()) + 1;
                return [...prev, `value-${nextIdx}`];
              });
            }}
          >
            Push
          </FullButton>
          <FullButton
            onClick={() => {
              const last = [...values].pop();
              const field = methods.getValues("example");
              setValues((prev) => prev.slice(0, -1));
              methods.setValue(
                "example",
                field.filter((value) => value !== last),
              );
            }}
          >
            Pop
          </FullButton>
          <FullButton
            onClick={() => {
              setValues((prev) => shuffle(prev));
            }}
          >
            Shuffle
          </FullButton>
          <FullButton
            onClick={() => {
              setValues([]);
              methods.reset();
            }}
          >
            Clear
          </FullButton>
          <FullButton
            onClick={() => {
              onSubmit(methods.getValues());
            }}
          >
            Submit
          </FullButton>
        </Stack>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ border: "1px solid", borderColor: "grey.400", borderRadius: 1, p: 2 }}>
        <FormProvider {...methods}>
          <form>
            <FormCheckboxGroup name="example" values={values} id={uuid} />
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
}

export default SamplePage;
