"use client";

import { ErrorBoundary } from "react-error-boundary";
import { Box, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";

/**
 * Renders a fallback UI for the error boundary.
 * @param {object} props - The component props.
 * @param {Error} props.error - The error object.
 * @param {(...args: any[]) => void} props.resetErrorBoundary - Function to reset the error boundary.
 * @returns {JSX.Element} The fallback UI.
 */
function Fallback({ error, resetErrorBoundary }) {
  return (
    <Box role="alert">
      <Typography>Something went wrong</Typography>
      <Typography component="pre" sx={{ color: "error.main" }}>
        {error.message}
      </Typography>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </Box>
  );
}
Fallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

/**
 * Global error boundary component.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the error boundary.
 * @returns {JSX.Element} The error boundary component.
 */
export default function GlobalErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onReset={(details) => {
        console.log(details);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
GlobalErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
