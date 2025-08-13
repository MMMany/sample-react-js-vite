import { Button, Box, Typography, Divider, Stack } from "@mui/material";
import { intersection, isEmpty } from "lodash-es";
import { useForm, FormProvider } from "react-hook-form";
import FormCheckboxGroup from "#/components/FormCheckboxGroup";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useDelayedLoading } from "#/hooks";

function FullButton({ children, ...props }) {
  return (
    <Button variant="contained" {...props}>
      {children}
    </Button>
  );
}

function SamplePage() {
  const [isFetching, setIsFetching] = useState(true);

  const { setLoading, DelayedLoading } = useDelayedLoading({
    initialValue: true,
    timeout: 3000,
  });

  const { error, data, refetch } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      try {
        console.time("[GET]");
        console.log("GET : /items");
        setLoading(true);
        const { data } = await axios.get("/items");
        console.log("[RESP] GET :", data);
        return data;
      } finally {
        setLoading(false);
        setIsFetching(false);
        console.log("GET END");
        console.timeEnd("[GET]");
      }
    },
    initialData: [],
    // refetchInterval: 5000,
  });

  const methods = useForm({
    defaultValues: {
      example: [],
    },
  });

  const handleSubmit = () => {
    const data = methods.getValues();
    alert(`SUBMIT\n\n${JSON.stringify(data.example, null, 2)}`);
  };

  // console.log("form watch :", methods.watch("example"));

  const handlePush = () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    let newValue;

    if (isEmpty(data)) {
      newValue = "value-1";
    } else {
      const sorted = data.toSorted((a, b) => {
        const aIdx = Number(a.split("-").pop());
        const bIdx = Number(b.split("-").pop());
        return aIdx - bIdx;
      });
      const last = sorted.pop();
      const nextIdx = Number(last.split("-").pop()) + 1;
      newValue = `value-${nextIdx}`;
    }

    console.time("[PUSH]");
    console.log("POST :", newValue);
    setLoading(true);
    axios
      .post("/items", newValue)
      .then(({ data }) => {
        console.log("[RESP] POST :", data);
        return refetch();
      })
      .catch(({ message, response }) => {
        console.error(`${message} : ${response.data}`);
      })
      .finally(() => {
        setIsFetching(false);
        setLoading(false);
        console.log("PUSH END");
        console.timeEnd("[PUSH]");
      });
  };

  const handlePop = () => {
    if (isFetching) {
      return;
    }
    if (isEmpty(data)) {
      return;
    }

    setIsFetching(true);
    const newValues = data.slice(0, -1);
    console.time("[POP]");
    console.log("PUT :", newValues);
    setLoading(true);
    axios
      .put("/items", newValues)
      .then(({ data }) => {
        console.log("[RESP] PUT :", data);
        return refetch();
      })
      .then(() => {
        const prev = methods.getValues("example");
        methods.setValue("example", intersection(prev, newValues));
      })
      .catch(({ message, response }) => {
        console.error(`${message} : ${response.data}`);
      })
      .finally(() => {
        setIsFetching(false);
        setLoading(false);
        console.log("POP END");
        console.timeEnd("[POP]");
      });
  };

  const handleClear = () => {
    if (isFetching) {
      return;
    }
    setIsFetching(true);
    console.time("[CLEAR]");
    console.log("PUT :", []);
    setLoading(true);
    axios
      .put("/items", [])
      .then(({ data }) => {
        console.log("[RESP] PUT :", data);
        return refetch();
      })
      .then(() => {
        methods.reset();
      })
      .catch(({ message, response }) => {
        console.error(`${message} : ${response.data}`);
      })
      .finally(() => {
        setIsFetching(false);
        setLoading(false);
        console.log("CLEAR END");
        console.timeEnd("[CLEAR]");
      });
  };

  const handleReset = () => {
    if (isFetching) {
      return;
    }
    setIsFetching(true);
    console.time("[RESET]");
    console.log('RESET, PUT : ["value-1", "value-2", "value-3"]');
    setLoading(true);
    axios
      .put("/items", ["value-1", "value-2", "value-3"])
      .then(({ data }) => {
        console.log("[RESP] PUT :", data);
        return refetch();
      })
      .then(() => {
        methods.reset();
      })
      .catch(({ message, response }) => {
        console.error(`${message} : ${response.data}`);
      })
      .finally(() => {
        setIsFetching(false);
        setLoading(false);
        console.log("RESET END");
        console.timeEnd("[RESET]");
      });
  };

  return (
    <Box>
      <DelayedLoading />

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography>Dynamic Form Components Test</Typography>
        <Stack spacing={1} direction="row" sx={{ position: "relative", right: 0 }}>
          <FullButton onClick={handlePush}>Push</FullButton>
          <FullButton onClick={handlePop}>Pop</FullButton>
          <FullButton onClick={handleClear}>Clear</FullButton>
          <FullButton onClick={handleReset}>Reset</FullButton>
          <FullButton onClick={handleSubmit}>Submit</FullButton>
        </Stack>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ border: "1px solid", borderColor: "grey.400", borderRadius: 1, p: 2 }}>
        {error ? (
          <Typography color="error">{error.message}</Typography>
        ) : (
          <FormProvider {...methods}>
            <form>
              <FormCheckboxGroup name="example" values={data} />
            </form>
          </FormProvider>
        )}
      </Box>
    </Box>
  );
}

export default SamplePage;
