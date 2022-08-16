interface Organization {
  id: string;
  name: string;
  email: string;
  accessibleChains: string[];
  creator: string;
  editor: string;
}

export { Organization };
