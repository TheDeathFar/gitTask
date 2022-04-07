export const isPhotoFilename = (name: string): boolean => {
  if (!name) return false;

  return (
    name.toLowerCase().endsWith(`.jpg`) || name.toLowerCase().endsWith(`.png`)
  );
};
