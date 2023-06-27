export const setInputsDisabled = (inputIDs, disabled) => {
  const disabledVal = disabled ? "true" : "false";
  inputIDs.forEach((id) => {
    document.getElementById(id).setAttribute("disabled", disabledVal);
  });
};
