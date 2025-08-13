import { useState, useCallback, useMemo, useRef, forwardRef } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

export const useDelayedLoading = ({ initialValue = false, Component, timeout = 1000 }) => {
  const [loading, _setLoading] = useState(initialValue);

  const timeoutId = useRef();

  const setLoading = useCallback(
    (value) => {
      if (!value) {
        _setLoading(false);
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
          timeoutId.current = null;
        }
      } else {
        if (!timeoutId.current) {
          timeoutId.current = setTimeout(() => {
            _setLoading(true);
            timeoutId.current = null;
          }, timeout);
        }
      }
    },
    [timeout],
  );

  const ret = useMemo(() => {
    return {
      loading,
      setLoading,
      DelayedLoading: forwardRef((props, ref) => {
        return Component ? (
          <Component open={loading} {...props} ref={ref} />
        ) : (
          <Backdrop
            sx={(theme) => ({
              color: "#fff",
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={loading}
            {...props}
            ref={ref}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        );
      }),
      // DelayedLoading: Component ? (
      //   <Component open={loading} />
      // ) : (
      //   <Backdrop
      //     sx={(theme) => ({
      //       color: "#fff",
      //       zIndex: theme.zIndex.drawer + 1,
      //     })}
      //     open={loading}
      //   >
      //     <CircularProgress color="inherit" />
      //   </Backdrop>
      // ),
    };
  }, [Component, loading, setLoading]);
  return ret;
};

// export const useDelayedLoading = memo(({ initialValue = false }) => {
//   const [loading, setLoading] = useState(initialValue);
//   console.log("hook loading :", loading);
//   return { loading };
// });
