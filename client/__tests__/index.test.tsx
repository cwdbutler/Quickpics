import { render } from "@testing-library/react";
import RegisterForm from "../src/components/forms/RegisterForm";

describe("Register form", () => {
  it("says 'Sign up'", () => {
    const { getByText } = render(<RegisterForm />);
    expect(getByText("Sign up")).toBeInTheDocument();
  });
});
