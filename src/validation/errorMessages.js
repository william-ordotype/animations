const errorMessageFr = {
  mixed: {
    default: "Valeur invalide", // Invalid value
    required: "Ce champ est requis", // This field is required
    oneOf: "Doit être l'une des options autorisées.", // Must be one of the following: ${values}
    notOneOf: "Ne peut pas être l'un des suivants : ${values}", // Cannot be one of the following: ${values}
    notType: "Type de valeur invalide", // Invalid value type
  },
  string: {
    length: "Doit avoir exactement ${length} caractères", // Must be exactly ${length} characters
    min: "Doit avoir au moins ${min} caractères", // Must be at least ${min} characters
    max: "Ne doit pas avoir plus de ${max} caractères", // Must be at most ${max} characters
    email: "Doit être une adresse email valide", // Must be a valid email address
    url: "Doit être une URL valide", // Must be a valid URL
    trim: "Ne peut pas contenir d'espaces en début ou en fin de chaîne", // Cannot contain leading or trailing spaces
    lowercase: "Doit être en minuscules", // Must be in lowercase
    uppercase: "Doit être en majuscules", // Must be in uppercase
  },
  number: {
    min: "Doit être au moins ${min}", // Must be at least ${min}
    max: "Ne doit pas être plus de ${max}", // Must be at most ${max}
    lessThan: "Doit être inférieur à ${less}", // Must be less than ${less}
    moreThan: "Doit être supérieur à ${more}", // Must be more than ${more}
    positive: "Doit être un nombre positif", // Must be a positive number
    negative: "Doit être un nombre négatif", // Must be a negative number
    integer: "Doit être un nombre entier", // Must be an integer
  },
  date: {
    min: "Doit être postérieur à ${min}", // Must be later than ${min}
    max: "Doit être antérieur à ${max}", // Must be earlier than ${max}
  },
  array: {
    min: "Doit avoir au moins ${min} éléments", // Must have at least ${min} items
    max: "Ne doit pas avoir plus de ${max} éléments", // Cannot have more than ${max} items
  },
};

export { errorMessageFr };
