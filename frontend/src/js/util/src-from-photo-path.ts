export const srcFromPhotoPath = (photoPath: string): string =>
  `${process.env[`SERVER_ORIGIN`]}/${photoPath}`;