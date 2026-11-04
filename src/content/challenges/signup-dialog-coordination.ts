import type { Challenge } from "./schema";

export const signupDialogCoordination: Challenge = {
  slug: "signup-dialog-coordination",
  patternSlug: "mediator",
  difficulty: "advanced",
  scenario:
    "A signup dialog has 7 fields: name, email, password, confirm-password, country, terms-checkbox, and submit. Validity is interdependent — password strength affects submit; email + password together gate the terms checkbox; cancel resets every field to empty; the submit button's enabled state depends on all 6 others. Isolated testing of any field is impossible today.",
  problem:
    "Each field directly references the other six and calls into them on change. Adding an eighth field means editing every existing field's constructor and its change handler. Tests for a single field have to instantiate the other six. The interaction graph is 7×7 and growing.",
  codeSnippet: `class EmailField {
  constructor(
    private password: PasswordField,
    private submit: SubmitButton,
    private terms: TermsCheckbox,
    // 3 more
  ) {}
  onChange(v) {
    this.password.revalidate(v);
    this.submit.setEnabled(…);
    this.terms.update(…);
    // 4 more calls
  }
}`,
  options: ["mediator", "observer", "facade", "chain-of-responsibility"],
  explanation:
    "Mediator collapses the 7×7 peer graph into a star: every field holds one mediator reference, and the mediator owns the coordination logic in a single onFieldChanged() method. Adding an eighth field is a new peer and one mediator change; no existing field is touched. Isolated field tests inject a fake mediator. Observer broadcasts but does not centralize coordination — you would still need the logic somewhere, and it would still cross-reference. Facade simplifies access but does not coordinate peers. Chain is linear — this graph is not a pipeline.",
};
