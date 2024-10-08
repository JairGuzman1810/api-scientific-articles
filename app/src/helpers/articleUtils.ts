export const validateTitle = (title: string): string | null => {
  if (title.trim() === "") {
    return "Title is required";
  }
  if (title.length > 255) {
    return "Title cannot exceed 255 characters";
  }
  return null;
};

export const validateAuthors = (authors: string): string | null => {
  // Trim and split authors by comma
  const authorsArray = authors.split(",").map((author) => author.trim());

  // Check for empty input
  if (authors.trim() === "") {
    return "Authors field cannot be empty";
  }

  // Check for empty strings in the authors array
  const invalidAuthors = authorsArray.filter((author) => author === "");
  if (invalidAuthors.length > 0) {
    return "Authors cannot be empty strings"; // New message for empty strings
  }

  // Check if there are no valid authors
  if (authorsArray.length === 0) {
    return "At least one author is required";
  }

  return null; // Return null if validation passes
};

export const validateKeywords = (keywords: string): string | null => {
  // Trim and split keywords by comma
  const keywordsArray = keywords.split(",").map((keyword) => keyword.trim());

  // Check for empty input
  if (keywords.trim() === "") {
    return "Keywords field cannot be empty";
  }

  // Check for empty strings in the keywords array
  const invalidKeywords = keywordsArray.filter((keyword) => keyword === "");
  if (invalidKeywords.length > 0) {
    return "Keywords cannot be empty strings"; // New message for empty strings
  }

  // Check if there are no valid keywords
  if (keywordsArray.length === 0) {
    return "At least one keyword is required";
  }

  return null; // Return null if validation passes
};

export const validatePublicationDate = (
  publicationDate: string
): string | null => {
  if (publicationDate.trim() === "") {
    return "Publication date is required";
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
  if (!dateRegex.test(publicationDate)) {
    return "Publication date must be in YYYY-MM-DD format";
  }
  return null;
};

export const validateJournal = (journal: string): string | null => {
  if (journal.trim() === "") {
    return "Journal name is required";
  }
  if (journal.length > 255) {
    return "Journal name cannot exceed 255 characters";
  }
  return null;
};

export const validateDoi = (doi: string): string | null => {
  if (doi.trim() === "") {
    return "DOI is required";
  }
  return null;
};

export const validateAbstract = (abstract: string): string | null => {
  if (abstract.trim() === "") {
    return "Abstract is required";
  }
  if (abstract.length > 5000) {
    return "Abstract cannot exceed 5000 characters";
  }
  return null;
};
