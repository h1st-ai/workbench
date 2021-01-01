import * as React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  constructor(props: any) {
    super(props);
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h3>Something went wrong.</h3>;
    }

    return this.props.children;
  }
}
