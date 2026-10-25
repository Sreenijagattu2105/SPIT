// Import React Testing Library utilities for rendering and querying components.
import { render, screen } from "@testing-library/react";

// Import the main application component.
import App from "./App";

/*
 * Test: Check whether the default Create React App learning link is rendered.
 */
test("renders learn react link", () => {
    // Render the main application component.
    render(<App />);

    // Find the link whose text contains "learn react".
    const linkElement = screen.getByText(/learn react/i);

    // Verify that the link is present in the document.
    expect(linkElement).toBeInTheDocument();
});
