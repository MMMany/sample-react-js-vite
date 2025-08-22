import { Button, Box, Typography, Divider, Stack, Skeleton, Grid } from "@mui/material";
import { intersection, isEmpty } from "lodash-es";
import { useForm, FormProvider } from "react-hook-form";
import FormCheckboxGroup from "#/components/FormCheckboxGroup";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useCallback } from "react";
import { useDelayedLoading } from "#/hooks";
import { set } from "zod";

function FullButton({ children, ...props }) {
  return (
    <Button variant="contained" {...props}>
      {children}
    </Button>
  );
}

function FormCheckboxGroupSkeleton() {
  return (
    <Stack spacing={1}>
      <Skeleton sx={{ width: "15rem" }} />
      <Grid container spacing={1}>
        <Grid>
          <Stack direction="row" spacing={2} sx={{ p: 1 }}>
            <Skeleton variant="rectangular" sx={{ width: "24px", height: "24px" }} />
            <Skeleton sx={{ width: "10rem" }} />
          </Stack>
        </Grid>
        <Grid>
          <Stack direction="row" spacing={2} sx={{ p: 1 }}>
            <Skeleton variant="rectangular" sx={{ width: "24px", height: "24px" }} />
            <Skeleton sx={{ width: "10rem" }} />
          </Stack>
        </Grid>
        <Grid>
          <Stack direction="row" spacing={2} sx={{ p: 1 }}>
            <Skeleton variant="rectangular" sx={{ width: "24px", height: "24px" }} />
            <Skeleton sx={{ width: "10rem" }} />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

function SamplePage() {
  const [isFetching, setIsFetching] = useState(true);
  const [chkboxValues, setChkboxValues] = useState([]);

  const { setLoading, DelayedLoading } = useDelayedLoading({
    initialValue: true,
    timeout: 3000,
  });

  const {
    isPending,
    isFetching: isFetchingQuery,
    error,
    refetch,
  } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      try {
        console.time("[GET]");
        console.log("GET : /items");
        setLoading(true);
        const { data } = await axios.get("/items");
        console.log("[RESP] GET :", data);
        setChkboxValues(data);
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
    refetchOnWindowFocus: false,
  });

  const methods = useForm({
    defaultValues: {
      example: [],
    },
  });

  const onSubmit = (data) => {
    alert(`SUBMIT\n\n${JSON.stringify(data.example, null, 2)}`);
  };

  // console.log("form watch :", methods.watch("example"));

  const handlePush = () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    let newValue;

    if (isEmpty(chkboxValues)) {
      newValue = "value-1";
    } else {
      const sorted = chkboxValues.toSorted((a, b) => {
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
        setChkboxValues((prev) => [...prev, data]);
        // return refetch();
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
    if (isEmpty(chkboxValues)) {
      return;
    }

    setIsFetching(true);
    const newValues = chkboxValues.slice(0, -1);
    console.time("[POP]");
    console.log("PUT :", newValues);
    setLoading(true);
    axios
      .put("/items", newValues)
      .then(({ data }) => {
        console.log("[RESP] PUT :", data);
        setChkboxValues((prev) => prev.slice(0, -1));
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
        setChkboxValues(data);
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
        setChkboxValues(data);
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

  const handleRefetch = () => {
    refetch();
  };

  return (
    <>
      <DelayedLoading />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography>Dynamic Form Components Test</Typography>
            <Stack spacing={1} direction="row" sx={{ position: "relative", right: 0 }}>
              <FullButton onClick={handlePush}>Push</FullButton>
              <FullButton onClick={handlePop}>Pop</FullButton>
              <FullButton onClick={handleClear}>Clear</FullButton>
              <FullButton onClick={handleReset}>Reset</FullButton>
              <FullButton onClick={handleRefetch}>Refetch</FullButton>
              <FullButton type="submit">Submit</FullButton>
            </Stack>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ border: "1px solid", borderColor: "grey.400", borderRadius: 1, p: 2 }}>
            {isFetchingQuery ? (
              <FormCheckboxGroupSkeleton />
            ) : error ? (
              <Typography color="error">{error.message}</Typography>
            ) : (
              <FormCheckboxGroup required label="Checkbox Group" name="example" values={chkboxValues} supportAllCheck />
            )}
          </Box>
        </form>
      </FormProvider>
    </>
  );
}

export default SamplePage;
